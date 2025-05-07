/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getExcel, getListaRQP, getPDF } from "@/services/documentos/rqpAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { generarInformePHPPuro } from "@/services/informes/reportesAPI";
import { fetchUserBodegas } from "@/services/auth/authAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import {
  QuestionCircleFilled,
  FileExcelFilled,
  SearchOutlined,
  FilePdfFilled,
  DislikeFilled,
  EditOutlined,
  StopOutlined,
  LikeFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  DatePicker,
  Typography,
  Popover,
  Tooltip,
  Button,
  Input,
  Modal,
  Space,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

export const ListarDocumentos = ({
  privilegios,
  setLoader,
  user_rol,
  tab,
}: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [bodegasInforme, setBodegasInforme] = useState<number[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [showInformeSeguimiento, setShowInformeSeguimiento] =
    useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modal, contextHolderModal] = Modal.useModal();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");

  const location = useLocation();
  const [formInforme] = Form.useForm();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    setLoaderTable(true);
    fetchDocumentos(value, currentPage);
  }, [currentPage, value]);

  useEffect(() => {
    if (
      ["administrador", "cotizaciones", "compras", "regente"].includes(user_rol)
    ) {
      setShowInformeSeguimiento(true);
      setLoaderTable(true);
      fetchUserBodegas()
        .then(({ data: { data } }) => {
          setBodegasInforme(data.bodega.map(({ bodega }) => bodega.id));
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
        .finally(() => setLoaderTable(false));
    } else {
      setShowInformeSeguimiento(false);
      setBodegasInforme([]);
    }
  }, [user_rol]);

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    switch (tab) {
      case "abiertos":
        estado = "0";
        break;
      case "pendientes":
        estado = "1";
        break;
      case "proceso":
        estado = "2";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }
    getListaRQP(page, getSessionVariable(KEY_BODEGA), estado, query)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            bod_solicitante: item.bodega.bod_nombre,
            usuario: item.usuario.username,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            fecha_aprobacion:
              item.fecha_aprueba != "Sin aprobación"
                ? dayjs(item.fecha_aprueba).format("DD-MM-YYYY HH:mm")
                : item.fecha_aprueba,
            usuario_aprobacion: item.usuario_aprueba
              ? item.usuario_aprueba.username
              : "Sin aprobación",
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

  const generarExcel = (key: React.Key) => {
    if (key != tab) {
      setLoaderTable(true);
      getExcel(key.toString(), getSessionVariable(KEY_BODEGA))
        .then(({ data }) => {
          fileDownload(data, "REQUISICION DE PEDIDO.xlsx");
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
                      bodegas: bodegasInforme,
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
                        fileDownload(data, "REQUISICION DE PEDIDO.xlsx");
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      width: 180,
      align: "center",
    },
    {
      title: "Fecha Aprobación",
      dataIndex: "fecha_aprobacion",
      key: "fecha_aprobacion",
      width: 180,
      align: "center",
      hidden: ["abiertos"].includes(tab),
    },
    {
      title: "Usuario Aprobación",
      dataIndex: "usuario_aprobacion",
      key: "usuario_aprobacion",
      width: 180,
      align: "center",
      hidden: ["abiertos"].includes(tab),
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega solicitante",
      dataIndex: "bod_solicitante",
      key: "bod_solicitante",
      align: "center",
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      width: 700,
      render(_, { observacion }) {
        return (
          <Popover
            autoAdjustOverflow
            content={observacion}
            title="Observación"
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 5,
            }}
            placement="top"
          >
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
              {observacion}
            </Paragraph>
          </Popover>
        );
      },
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
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
            {privilegios?.consultar == "1" &&
            tab == "abiertos" &&
            ["administrador", "quimico", "cotizaciones", "compras"].includes(
              user_rol
            ) ? (
              <Tooltip title="Consultar y aprobar">
                <Link to={`${location.pathname}/aprobar/${key}`}>
                  <Button size="small" key={key + "aprobar"}>
                    <LikeFilled className="icono-verde" />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.consultar == "1" &&
            tab == "pendientes" &&
            ["administrador", "quimico", "cotizaciones", "compras"].includes(
              user_rol
            ) ? (
              <Tooltip title="Consultar y desaprobar">
                <Link to={`${location.pathname}/desaprobar/${key}`}>
                  <Button size="small" key={key + "desaprobar"}>
                    <DislikeFilled className="icono-rojo" />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.modificar == "1" && ["abiertos"].includes(tab) ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && ["abiertos"].includes(tab) ? (
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
  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={showInformeSeguimiento ? 12 : 18}>
          <SearchBar>
            <Input
              placeholder="Busqueda por consecutivo, debes presionar Enter para buscar"
              onKeyUp={(e: any) => {
                const {
                  key,
                  target: { value },
                } = e;
                if (key == "Enter") {
                  setValue(value);
                  setCurrentPage(1);
                }
              }}
            />
          </SearchBar>
        </Col>
        {showInformeSeguimiento ? (
          <Col xs={24} lg={6}>
            <Spin spinning={loaderTable}>
              <Button
                type="dashed"
                icon={<FileExcelFilled className="icono-verde" />}
                block
                onClick={() => {
                  modal.confirm({
                    title: "Selecciona el rango de fechas para el informe",
                    icon: <QuestionCircleFilled />,
                    width: 400,
                    content: (
                      <Form
                        form={formInforme}
                        layout="vertical"
                        style={{ margin: 20 }}
                      >
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
                                  bodegas: bodegasInforme,
                                };
                                const initialDate = dayjs(
                                  data.fechas_rango[0]
                                ).format("YYYY-MM-DD");
                                const endDate = dayjs(
                                  data.fechas_rango[1]
                                ).format("YYYY-MM-DD");
                                Modal.destroyAll();
                                generarInformePHPPuro(
                                  {
                                    ...data,
                                    initialDate,
                                    endDate,
                                  },
                                  "reporteSeguimientoRequisicionSQL"
                                )
                                  .then(({ data }) => {
                                    fileDownload(
                                      data,
                                      `Seguimiento Requisiciones.xls`
                                    );
                                    notificationApi.open({
                                      type: "success",
                                      message: "Reporte generado con exito!",
                                    });
                                  })
                                  .catch(({ request: { response } }) => {
                                    notificationApi.open({
                                      type: "error",
                                      message: response,
                                    });
                                  })
                                  .finally(() => {
                                    setLoaderTable(false);
                                  });
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
                }}
              >
                Informe seguimiento
              </Button>
            </Spin>
          </Col>
        ) : null}
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
              simple: false,
              onChange: (page: number) => setCurrentPage(page),
              current: currentPage,
              showSizeChanger: false,
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
