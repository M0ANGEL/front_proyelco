/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { OrdenCompraCabecera, RqpDetalle } from "@/services/types";
import { DataType, DataTypeOC, Pagination, Props } from "./types";
import { ModalDetalleCantidad, ModalOrdenesCompra } from "..";
import { getListaRQP } from "@/services/documentos/rqpAPI";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import { KEY_BODEGA } from "@/config/api";
import {
  getExcelSeguimiento,
  getFormatoProveedor,
  getOCxRQP,
  getListaOC,
  getExcel,
  getPDF,
} from "@/services/documentos/ocAPI";
import { SearchBar } from "./styled";
import {
  FileExcelFilled,
  SearchOutlined,
  FilePdfFilled,
  EditOutlined,
  StopOutlined,
  TagOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  Typography,
  DatePicker,
  Tooltip,
  Popover,
  Button,
  Input,
  Space,
  Form,
  Col,
  Row,
  Tag,
} from "antd";

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

export const ListarDocumentos = ({
  privilegios,
  tab,
  setLoader,
  selectedDoc,
}: Props) => {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompraCabecera[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [estado_cantidades, setEstadoCantidades] = useState<string>("");
  const [ordenes, setOrdenes] = useState<OrdenCompraCabecera[]>([]);
  const [openDetalle, setOpenDetalle] = useState<boolean>(false);
  const [errorFechas, setErrorFechas] = useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [detalle, setDetalle] = useState<RqpDetalle[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const [rqpInfo, setRqpInfo] = useState<DataType>();
  const [open, setOpen] = useState<boolean>(false);
  const [rangoFechas, setRangoFechas] = useState<{
    fecha_inicio: string;
    fecha_fin: string;
  }>();
  const [RQPID, setRQPID] = useState<React.Key>();
  const [value, setValue] = useState<string>("");
  const location = useLocation();
  const [formFechas] = Form.useForm();

  useEffect(() => {
    setLoader(true);
    setLoaderTable(true);
    setPagination(undefined);
    fetchDocumentos(value, currentPage);
  }, [selectedDoc, value, currentPage]);

  const fetchDocumentos = (query = "", page = 1, doc = selectedDoc) => {
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
    if (doc == "rqp") {
      getListaRQP(page, getSessionVariable(KEY_BODEGA), estado, query)
        .then(({ data: { data } }) => {
          setPagination(data);
          const dataDocumentos = data.data.map((rqp) => {
            let total_cantidad_rqp = 0;
            let total_cantidad_oc = 0;
            let flag_total = false;
            if (rqp.ordenes_compra.length > 0) {
              rqp.detalle.forEach((itemRQP) => {
                total_cantidad_rqp += parseInt(itemRQP.cantidad);
                let total = 0;
                rqp.ordenes_compra
                  .filter((orden) => !["3", "4"].includes(orden.estado))
                  .forEach((item) => {
                    const producto = item.detalle.find(
                      (itemOC) =>
                        itemOC.producto.cod_padre == itemRQP.producto.cod_padre
                    );
                    if (producto) {
                      total += parseInt(producto.cantidad);
                    }
                  });
                if (total >= parseInt(itemRQP.cantidad)) {
                  flag_total = true;
                } else {
                  flag_total = false;
                }
              });
              // Se realiza un filtro por estado "Cerrado = 3" y "Anulado = 4" para descartar ordenes de compra y no contarlas como activas.
              rqp.ordenes_compra
                .filter((orden) => !["3", "4"].includes(orden.estado))
                .forEach((item) => {
                  item.detalle.forEach((detalleItem) => {
                    total_cantidad_oc += parseInt(detalleItem.cantidad);
                  });
                });
            }

            return {
              ...rqp,
              total_cantidad_rqp,
              total_cantidad_oc,
              flag_total,
            };
          });
          const documentos: DataType[] = dataDocumentos.map((item) => {
            let estado_cantidades = "";
            if (item.total_cantidad_oc == 0) {
              estado_cantidades = "1";
            } else if (
              item.flag_total &&
              item.total_cantidad_oc >= item.total_cantidad_rqp
            ) {
              estado_cantidades = "3";
            } else {
              estado_cantidades = "2";
            }
            return {
              key: item.id,
              bod_solicitante: item.bodega.bod_nombre,
              usuario: item.usuario.username,
              fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm:ss"),
              estado_cantidades,
              detalleRQP: item.detalle,
              ordenes_compra: item.ordenes_compra,
              consecutivo: item.consecutivo,
              observacion: item.observacion,
            };
          });
          setDataSource(documentos);

          setLoader(false);
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
      getListaOC(page, getSessionVariable(KEY_BODEGA), estado, query)
        .then(({ data: { data } }) => {
          setPagination(data);
          const documentos: DataTypeOC[] = data.data.map((item) => {
            return {
              key: item.id,
              consecutivo: item.consecutivo,
              consecutivo_rqp: item.rqp_cabecera.consecutivo,
              proveedor: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
              observacion: item.observacion,
              usuario: item.usuario.username,
              fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm:ss"),
              bodega_destino: item.bodega_destino
                ? `${item.bodega_destino.prefijo} - ${item.bodega_destino.bod_nombre}`
                : "Sin bodega destino",
            };
          });
          setDataSource(documentos);
          setLoader(false);
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

  const generarPDF = (key: React.Key) => {
    setLoader(true);
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
      .finally(() => {
        setLoader(false);
        setLoaderTable(false);
      });
  };

  const generarExcel = (key: React.Key) => {
    const data = {
      oc_id: key.toString(),
      bodega_id: getSessionVariable(KEY_BODEGA),
      fecha_inicio: "",
      fecha_fin: "",
    };
    setLoader(true);
    setLoaderTable(true);
    if (
      ["pendientes", "proceso", "cerrados", "anulados"].includes(key.toString())
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
        fileDownload(data, "ORDEN DE COMPRA.xlsx");
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
      .finally(() => {
        setLoader(false);
        setLoaderTable(false);
      });
  };

  const generarExcelSeguimiento = (key: React.Key) => {
    const data = {
      rqp_id: key.toString(),
      bodega_id: getSessionVariable(KEY_BODEGA),
      fecha_inicio: "",
      fecha_fin: "",
    };
    setLoader(true);
    setLoaderTable(true);
    if (
      ["pendientes", "proceso", "cerrados", "anulados"].includes(key.toString())
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
    getExcelSeguimiento(data)
      .then(({ data }) => {
        fileDownload(data, "SEQUIMIENTO REQUISICION.xlsx");
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
      .finally(() => {
        setLoader(false);
        setLoaderTable(false);
        setErrorFechas(false);
      });
  };

  const generarFormatoProveedor = (key: React.Key, consecutivo: string) => {
    setLoader(true);
    setLoaderTable(true);
    getFormatoProveedor(key.toString())
      .then(({ data }) => {
        formFechas.setFieldsValue(undefined);
        fileDownload(data, consecutivo + ".xls");
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
      .finally(() => {
        setLoader(false);
        setLoaderTable(false);
      });
  };

  const getOC = (rqp: DataType) => {
    setLoader(true);
    setLoaderTable(true);
    getOCxRQP(rqp.key.toString()).then(({ data: { data } }) => {
      setLoader(false);
      setLoaderTable(false);
      setOrdenesCompra(data);
      setOpen(true);
      setRqpInfo(rqp);
    });
  };

  const columnsRQP: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
      align: "center",
      width: 150,
    },
    {
      title: "Bodega solicitante",
      dataIndex: "bod_solicitante",
      key: "bod_solicitante",
      width: 120,
      align: "center",
      sorter: (a, b) => a.bod_solicitante.localeCompare(b.bod_solicitante),
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
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
      width: 120,
      align: "center",
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
    },
    {
      title: "Estado Cantidades",
      dataIndex: "estado_cantidades",
      key: "estado_cantidades",
      align: "center",
      width: 300,
      sorter: (a, b) => a.estado_cantidades.localeCompare(b.estado_cantidades),
      render: (_, record) => {
        let estado = "";
        let color = "";
        switch (record.estado_cantidades) {
          case "1":
            estado = "Sin cantidades";
            color = "volcano";
            break;
          case "2":
            estado = "Faltan cantidades por pedir";
            color = "volcano";
            break;
          case "3":
            estado = "No hay cantidades pendientes";
            color = "green";
            break;
        }
        return (
          <ButtonTag
            onClick={() => {
              setRQPID(record.key);
              setDetalle(record.detalleRQP);
              setOrdenes(record.ordenes_compra);
              setEstadoCantidades(record.estado_cantidades);
              setOpenDetalle(true);
            }}
          >
            <Tag color={color}>
              <Space>
                <EyeOutlined />
                {estado}
              </Space>
            </Tag>
          </ButtonTag>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 70,
      render: (_, record) => {
        return (
          <Space>
            <Tooltip title="Generar Excel">
              <Button
                size="small"
                key={record.key + "excel"}
                onClick={() => generarExcelSeguimiento(record.key)}
              >
                <FileExcelFilled className="icono-verde" />
              </Button>
            </Tooltip>
            {privilegios?.crear ==
            "1" /*&& record.estado_cantidades != "3"*/ ? (
              <Tooltip title="Crear OC">
                <Link to={`${location.pathname}/create/${record.key}`}>
                  <Button
                    type="primary"
                    key={record.key + "crear"}
                    size="small"
                  >
                    <TagOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {tab == "proceso" ? (
              <Tooltip title="Ver OC">
                <Button
                  size="small"
                  key={record.key + "verdc"}
                  onClick={() => getOC(record)}
                >
                  <EyeOutlined />
                </Button>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
    },
  ];

  const columnsOC: ColumnsType<DataTypeOC> = [
    {
      title: "Consecutivo RQP",
      dataIndex: "consecutivo_rqp",
      key: "consecutivo_rqp",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Bodega Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
      sorter: true,
      align: "center",
      width: 200,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
      align: "center",
      width: 150,
    },
    {
      title: "Proveedor",
      dataIndex: "proveedor",
      key: "proveedor",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
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
      render: (_, { key, consecutivo }) => {
        return (
          <>
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
              <Tooltip title="Generar Formato Proveedor">
                <Button
                  size="small"
                  key={key + "formato_proveedor"}
                  onClick={() => generarFormatoProveedor(key, consecutivo)}
                >
                  <FileExcelFilled className="icono-morado" />
                </Button>
              </Tooltip>
              {privilegios?.modificar == "1" && tab == "pendientes" ? (
                <Tooltip title="Editar">
                  <Link to={`${location.pathname}/edit/${key}`}>
                    <Button type="primary" key={key + "editar"} size="small">
                      <EditOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              ) : null}
              {privilegios?.anular == "1" ? (
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
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <ModalOrdenesCompra
        open={open}
        setOpen={(value: boolean) => setOpen(value)}
        ordenes={ordenesCompra}
        rqpInfo={rqpInfo ? rqpInfo : null}
        privilegios={privilegios}
      />
      <ModalDetalleCantidad
        detalle={detalle}
        ordenes={ordenes}
        RQPID={RQPID}
        estado_cantidades={estado_cantidades}
        openDetalle={openDetalle}
        setOpenDetalle={(value: boolean) => setOpenDetalle(value)}
      />
      <Row gutter={[12, 12]}>
        <Col lg={12} md={24} xs={24}>
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
          {selectedDoc == "oc" ? (
            <Col lg={4} md={10} xs={24}>
              <Button
                type="dashed"
                icon={<FileExcelFilled className="icono-verde" />}
                block
                onClick={() => generarExcel(tab)}
                disabled={dataSource.length == 0}
              >
                Generar
              </Button>
            </Col>
          ) : (
            <Col lg={4} md={10} xs={24}>
              <Button
                type="dashed"
                icon={<FileExcelFilled className="icono-verde" />}
                block
                onClick={() => generarExcelSeguimiento(tab)}
                disabled={dataSource.length == 0}
              >
                Generar
              </Button>
            </Col>
          )}
        </>

        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={selectedDoc == "rqp" ? columnsRQP : columnsOC}
            dataSource={dataSource}
            loading={loaderTable}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: false,
              onChange: (page: number) => setCurrentPage(page),
              current: currentPage,
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
