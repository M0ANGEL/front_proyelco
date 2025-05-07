/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getExcel, getListaCGN, getPDF } from "@/services/documentos/cgnAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import fileDownload from "js-file-download";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import {
  QuestionCircleFilled,
  FileExcelFilled,
  SearchOutlined,
  FilePdfFilled,
  StopOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  DatePicker,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Modal,
  Spin,
  Form,
  Col,
  Row,
} from "antd";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasFuente, setHasFuente] = useState<boolean>(true);
  const [modal, contextHolderModal] = Modal.useModal();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const [formInforme] = Form.useForm();
  const location = useLocation();
  
  useEffect(() => {
    setLoaderTable(true);
    const controller = new AbortController();
    const { signal } = controller;
    fetchDocumentos(value, currentPage, signal);
    return () => controller.abort();
  }, [value, currentPage]);

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  const generarPDF = (key: React.Key) => {
    setLoaderTable(true);
    getPDF(key.toString())
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        notificationApi.open({
          type: "success",
          message: "Documento generado con exito!",
        });
        window.open(fileURL);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const fetchDocumentos = (query = "", page = 1, abort?: AbortSignal) => {
    let estado = "";
    switch (tab) {
      case "abiertos":
        estado = "0";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }
    getListaCGN(page, getSessionVariable(KEY_BODEGA), estado, query, abort)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            bodega: item.bodega.bod_nombre,
            usuario: item.usuario.username,
            tercero: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            total: item.total.toString(),
          };
        });
        setDataSource(documentos);
        setLoaderTable(false);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        setLoader(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      width: 150,
      align: "center",
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 120,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 120,
    },
    {
      title: "Cliente",
      dataIndex: "tercero",
      key: "tercero",
    },
    {
      title: "Valor",
      dataIndex: "total",
      key: "total",
      hidden: hasFuente,
      render(_, { total }) {
        return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
      },
      width: 200,
      align: "center",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
      width: 120,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, { key }) => {
        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${key}`}>
                  <Button key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            <Tooltip title="Generar PDF">
              <Button
                size="small"
                key={key + "pdf"}
                onClick={() => generarPDF(key)}
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            <Tooltip title="Generar Excel">
              <Button
                size="small"
                key={key + "excel"}
                onClick={() => generarExcel(key)}
              >
                <FileExcelFilled className="icono-verde" />
              </Button>
            </Tooltip>
            {privilegios?.modificar == "1" && ["abiertos"].includes(tab) ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" key={key + "modificar"} size="small">
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "abiertos" ? (
              <Tooltip title="Anular documento">
                <Link to={`${location.pathname}/anular/${key}`}>
                  <Button
                    danger
                    type="primary"
                    size="small"
                    key={key + "anular"}
                  >
                    <StopOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
      width: 70,
    },
  ];

  const generarExcel = (key: React.Key) => {
    if (key != tab) {
      setLoaderTable(true);
      getExcel(key.toString(), getSessionVariable(KEY_BODEGA))
        .then(({ data }) => {
          fileDownload(data, "ENTRADA CONSIGNACION.xlsx");
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => setLoaderTable(false));
    } else {
      modal.confirm({
        title: "Selecciona el rango de fechas para el informe",
        icon: <QuestionCircleFilled />,
        width: 400,
        content: (
          <Form form={formInforme} layout="vertical" style={{ margin: 20 }}>
            <StyledFormItem
              name={"fechas_rango"}
              label={"Rango de fechas:"}
              rules={[
                {
                  required: true,
                  message: "Rango de fechas es requerido",
                },
              ]}
            >
              <RangePicker
                placeholder={["Inicio", "Fin"]}
                style={{ width: "100%" }}
              />
            </StyledFormItem>
          </Form>
        ),
        cancelText: "Cancelar",
        cancelButtonProps: { type: "primary", danger: true },
        onCancel: () => formInforme.resetFields(),
        footer: (_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              type="primary"
              onClick={() => {
                formInforme
                  .validateFields()
                  .then((values) => {
                    setLoaderTable(true);
                    const {
                      fechas_rango: [start, end],
                    } = values;
                    const data = {
                      fechas_rango: [
                        dayjs(start).format("YYYY-MM-DD"),
                        dayjs(end).format("YYYY-MM-DD"),
                      ],
                      bodegas: [getSessionVariable(KEY_BODEGA)],
                    };
                    const initialDate = dayjs(data.fechas_rango[0]).format(
                      "YYYY-MM-DD"
                    );
                    const endDate = dayjs(data.fechas_rango[1]).format(
                      "YYYY-MM-DD"
                    );
                    Modal.destroyAll();
                    getExcel(
                      key.toString(),
                      getSessionVariable(KEY_BODEGA),
                      initialDate,
                      endDate
                    )
                      .then(({ data }) => {
                        fileDownload(data, `ENTRADA CONSIGNACION ${initialDate} AL ${endDate}.xlsx`);
                      })
                      .catch(
                        ({
                          response,
                          response: {
                            data: { errors },
                          },
                        }) => {
                          if (errors) {
                            const errores: string[] = Object.values(errors);
                            for (const error of errores) {
                              notificationApi.open({
                                type: "error",
                                message: error,
                              });
                            }
                          } else {
                            notificationApi.open({
                              type: "error",
                              message: response.data.message,
                            });
                          }
                        }
                      )
                      .finally(() => setLoaderTable(false));
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }}
            >
              Generar informe
            </Button>
          </>
        ),
      });
    }
    // setLoaderTable(true);
  };

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <Row gutter={12}>
        <Col xs={24} lg={18}>
          <SearchBar>
            <Input
              placeholder={`Busqueda por consecutivo, debes presionar Enter para buscar`}
              onKeyUp={(e: any) => {
                const {
                  key,
                  target: { value },
                } = e;
                if (key == "Enter") setValue(value);
              }}
            />
          </SearchBar>
        </Col>
        <Col xs={24} lg={6}>
          <Spin spinning={loaderTable}>
            <Button
              type="dashed"
              icon={<FileExcelFilled className="icono-verde" />}
              block
              onClick={() => generarExcel(tab)}
              disabled={dataSource.length == 0}
            >
              Descargar informe
            </Button>
          </Spin>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: false,
              onChange: (page: number) => setCurrentPage(page),
              hideOnSinglePage: true,
              showTotal: (total: number) => {
                return (
                  <>
                    <Text>Total Registros: {total}</Text>
                  </>
                );
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};
