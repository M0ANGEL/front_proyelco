/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getListaOCDestinos } from "@/services/documentos/ocAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import { RiFileTransferLine } from "react-icons/ri";
import Table, { ColumnsType } from "antd/es/table";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import {
  getListaFP,
  getExcel,
  getActa,
  getPDF,
} from "@/services/documentos/fpAPI";
import {
  FileExcelFilled,
  SearchOutlined,
  FilePdfFilled,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  PaginationProps,
  notification,
  DatePicker,
  Typography,
  Popover,
  Tooltip,
  Button,
  Input,
  Space,
  Col,
  Row,
  Tag,
  Form,
} from "antd";

const { Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [errorFechas, setErrorFechas] = useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [rangoFechas, setRangoFechas] = useState<{
    fecha_inicio: string;
    fecha_fin: string;
  }>();
  const [value, setValue] = useState<string>("");
  const [formFechas] = Form.useForm();
  const location = useLocation();

  useEffect(() => {
    fetchDocumentos(value);
  }, [value]);

  const fetchDocumentos = (query = "", page = 1) => {
    setLoaderTable(true);
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
    if (["pendientes"].includes(tab)) {
      getListaOCDestinos(page, getSessionVariable(KEY_BODEGA), estado, query)
        .then(({ data: { data } }) => {
          setPagination(data);
          const documentos: DataType[] = data.data.map((item) => {
            return {
              key: item.id,
              consecutivo: item.consecutivo,
              proveedor: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
              observacion: item.observacion,
              usuario: item.usuario.username,
              fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
              has_distribucion: item.distribucion_id ? true : false,
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
    } else {
      getListaFP(page, getSessionVariable(KEY_BODEGA), estado, query)
        .then(({ data: { data } }) => {
          setPagination(data);
          const documentos: DataType[] = data.data.map((item) => {
            return {
              key: item.id,
              consecutivo: item.consecutivo,
              consecutivo_oc: item.oc_cabecera.consecutivo,
              nro_factura: item.factura_nro,
              proveedor: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
              observacion: item.observacion,
              observacion_rqp: item.oc_cabecera.rqp_cabecera.observacion,
              usuario: item.usuario.username,
              fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
              has_distribucion: item.distribucion_id ? true : false,
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
    }
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchDocumentos(value, page);
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

  const generarActaRecepcion = (key: React.Key) => {
    setLoaderTable(true);
    getActa(key.toString())
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
    const data = {
      fp_id: key.toString(),
      bodega_id: getSessionVariable(KEY_BODEGA),
      fecha_inicio: "",
      fecha_fin: "",
    };
    setLoaderTable(true);
    if (
      ["pendientes", "proceso", "cerrados", "anulados", "abiertos"].includes(key.toString())
    ) {
      if (rangoFechas) {
        if (rangoFechas.fecha_inicio != "" && rangoFechas.fecha_fin != "") {
          data.fecha_inicio = rangoFechas.fecha_inicio;
          data.fecha_fin = rangoFechas.fecha_fin;
        } else {
          notificationApi.open({
            type: "error",
            message: "Falta por seleccionar rango de fechas",
          });
          setLoader(false);
          setLoaderTable(false);
          setErrorFechas(true);
          return;
        }
      } else {
        notificationApi.open({
          type: "error",
          message: "Falta por seleccionar rango de fechas",
        });
        setLoader(false);
        setLoaderTable(false);
        setErrorFechas(true);
        return;
      }
    }
    getExcel(data)
      .then(({ data }) => {
        fileDownload(data, "FACTURA PROVEEDOR.xlsx");
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 120,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
      width: 150,
    },
    {
      title: "Proveedor",
      dataIndex: "proveedor",
      key: "proveedor",
      align: "center",
      width: 120,
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      render(_, { observacion }) {
        return (
          <Popover
            autoAdjustOverflow
            content={observacion}
            title="Observación"
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 10,
            }}
            placement="top"
          >
            <Paragraph
              style={{ fontSize: 12, marginBottom: 0 }}
              ellipsis={{ rows: 2, expandable: false }}
            >
              {observacion}
            </Paragraph>
          </Popover>
        );
      },
    },
    {
      title: "Observación RQP",
      dataIndex: "observacion_rqp",
      key: "observacion_rqp",
      hidden: ["pendientes"].includes(tab),
      render(_, { observacion_rqp }) {
        return (
          <Popover
            autoAdjustOverflow
            content={observacion_rqp}
            title="Observación RQP"
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 10,
            }}
            placement="top"
          >
            <Paragraph
              style={{ fontSize: 12, marginBottom: 0 }}
              ellipsis={{ rows: 2, expandable: false }}
            >
              {observacion_rqp}
            </Paragraph>
          </Popover>
        );
      },
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
      align: "center",
      width: 120,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 70,
      render: (_, { key, has_distribucion }) => {
        return (
          <Space>
            {privilegios?.crear == "1" && tab == "pendientes" ? (
              <Tooltip title="Ingresar Factura Proveedor">
                <Link to={`${location.pathname}/create/${key}`}>
                  <Button type="primary" key={key + "crear"} size="small">
                    <Text
                      style={{ fontSize: 15, marginTop: 2, color: "#FFFFFF" }}
                    >
                      <BsFileEarmarkPlus />
                    </Text>
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.consultar == "1" && !["pendientes"].includes(tab) ? (
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${key}`}>
                  <Button key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {tab != "pendientes" ? (
              <>
                <Tooltip title="Generar PDF">
                  <Button
                    size="small"
                    key={key + "pdf"}
                    onClick={() => generarPDF(key)}
                  >
                    <FilePdfFilled className="icono-rojo" />
                  </Button>
                </Tooltip>
                <Tooltip title="Generar ACTA DE RECEPCIÓN">
                  <Button
                    size="small"
                    key={key + "pdf"}
                    onClick={() => generarActaRecepcion(key)}
                  >
                    <FilePdfFilled className="icono-morado" />
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
                {has_distribucion && ["abiertos"].includes(tab) ? (
                  <Tooltip title="Crear Traslados">
                    <Link
                      to={`/documentos/traslados/trs/distribuir/${key}`}
                      target="_blank"
                    >
                      <Button
                        type="primary"
                        size="small"
                        key={key + "traslados"}
                      >
                        <RiFileTransferLine />
                      </Button>
                    </Link>
                  </Tooltip>
                ) : null}
              </>
            ) : null}
            {privilegios?.modificar == "1" && tab == "proceso" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" &&
            ["abiertos", "proceso"].includes(tab) ? (
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
    },
  ];

  if (tab != "pendientes")
    [
      columns.splice(1, 0, {
        title: "Nro Factura",
        dataIndex: "nro_factura",
        key: "nro_factura",
        sorter: true,
        align: "center",
        width: 120,
      }),
      columns.splice(1, 0, {
        title: "Consecutivo OC",
        dataIndex: "consecutivo_oc",
        key: "consecutivo_oc",
        sorter: true,
        align: "center",
        width: 120,
      }),
    ];

  const rowClassName = ({ has_distribucion }: DataType) => {
    return has_distribucion ? "cyan-row" : "";
  };

  return (
    <>
      {contextHolder}
      <Row gutter={12}>
        <Col
          {...(!["pendientes"].includes(tab)
            ? { lg: 12, md: 24, xs: 24 }
            : { span: 24 })}
        >
          <SearchBar>
            <Input
              placeholder="Busqueda por consecutivo, debes presionar Enter para buscar"
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
        {!["pendientes"].includes(tab) ? (
          <>
            <Col lg={8} md={14} xs={24}>
              <Form form={formFechas}>
                <Form.Item name={"fechas"} style={{ marginBottom: 0 }}>
                  <RangePicker
                    placeholder={["Inicial", "Final"]}
                    style={{ width: "100%" }}
                    status={errorFechas ? "error" : ""}
                    onChange={(_, dates) => {
                      setRangoFechas({
                        fecha_inicio: dates[0],
                        fecha_fin: dates[1],
                      });
                      setErrorFechas(false);
                    }}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col lg={4} md={10} xs={24}>
              <Button
                type="dashed"
                icon={<FileExcelFilled className="icono-verde" />}
                block
                onClick={() => generarExcel(tab)}
                disabled={dataSource.length == 0}
              >
                Descargar informe
              </Button>
            </Col>
          </>
        ) : null}
        <Col
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            marginBottom: 10,
          }}
          span={24}
        >
          <Text>
            Los documentos marcados de color azul son aquellos que pertenecen a
            una distribucion de compra{" "}
            <Tag color="#aecdff" style={{ color: "#1e85f9" }}>
              Azul
            </Tag>
          </Text>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={columns}
            dataSource={dataSource}
            rowClassName={rowClassName}
            loading={loaderTable}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: false,
              onChange: handleChangePagination,
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
