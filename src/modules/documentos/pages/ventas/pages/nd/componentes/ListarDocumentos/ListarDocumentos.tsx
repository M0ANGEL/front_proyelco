/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  // FilePdfFilled,
  StopOutlined,
  SearchOutlined,
  EditOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  notification,
  PaginationProps,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import { getExcel, getListaND } from "@/services/documentos/ndAPI";
import fileDownload from "js-file-download";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");

  const location = useLocation();

  // const generarPDF = (key: React.Key) => {
  //   setLoaderTable(true);
  //   getPDF(key.toString())
  //     .then((data) => {
  //       const file = new Blob([data.data], { type: "application/pdf" });
  //       const fileURL = URL.createObjectURL(file);
  //       notificationApi.open({
  //         type: "success",
  //         message: "Documento generado con exito!",
  //       });
  //       window.open(fileURL);
  //     })
  //     .catch(
  //       ({
  //         response,
  //         response: {
  //           data: { errors },
  //         },
  //       }) => {
  //         if (errors) {
  //           const errores: string[] = Object.values(errors);
  //           for (const error of errores) {
  //             notificationApi.open({
  //               type: "error",
  //               message: error,
  //             });
  //           }
  //         } else {
  //           notificationApi.open({
  //             type: "error",
  //             message: response.data.message,
  //           });
  //         }
  //       }
  //     )
  //     .finally(() => setLoaderTable(false));
  // };

  const generarExcel = (key: React.Key) => {
    setLoaderTable(true);
    getExcel(key.toString())
      .then(({ data }) => {
        fileDownload(data, "NOTA DEBITO.xlsx");
        notificationApi.open({
          type: "success",
          message: "Documento generado con exito!",
        });
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

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    switch (tab) {
      case "abiertos":
        estado = "1";
        break;
      case "cerrados":
        estado = "4";
        break;
      case "anulados":
        estado = "5";
        break;
    }
    getListaND(page, getSessionVariable(KEY_BODEGA), estado, query)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          
          let consecutivo_factura = "";
          if (item.tipo_nota_debito == 'dispensacion') {
            consecutivo_factura = item.fve_dis_cabecera.numero_factura_vta;
          } else if (item.tipo_nota_debito == 'venta_directa') {
            consecutivo_factura = item.fve_rvd_cabecera.numero_factura_vta;
          } else if (item.tipo_nota_debito == 'concepto') {
            consecutivo_factura = item.fvc_cabecera.nro_factura;
          }
          let tercero = "";
          if (item.tercero) {
            tercero = `${item.tercero.nit} - ${item.tercero.razon_soc}`;
          } else {
            tercero = `${item.paciente.numero_identificacion} - ${item.paciente.nombre_primero} ${item.paciente.nombre_segundo} ${item.paciente.apellido_primero} ${item.paciente.apellido_segundo}`;
          }
          return {
            key: item.id,
            consecutivo_factura,
            bodega: item.bodega.bod_nombre,
            usuario: item.usuario.username,
            tercero,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            observacion: item.observacion,
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

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchDocumentos(value, page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);

    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fetchDocumentos(value);
    }, 500);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
      width: 150,
      align: "center",
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
      title: "Factura Número",
      dataIndex: "consecutivo_factura",
      key: "consecutivo_factura",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      sorter: (a, b) => a.bodega.localeCompare(b.bodega),
    },
    {
      title: "Cliente",
      dataIndex: "tercero",
      key: "tercero",
      sorter: (a, b) => a.tercero.localeCompare(b.tercero),
      width: 300,
    },
    {
      title: "Valor",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total.toString().localeCompare(b.total.toString()),
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
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
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
            {/* <Tooltip title="Generar PDF">
              <Button
                size="small"
                key={key + "pdf"}
                onClick={() => generarPDF(key)}
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip> */}
            <Tooltip title="Generar Excel">
              <Button
                size="small"
                key={key + "excel"}
                onClick={() => generarExcel(key)}
              >
                <FileExcelFilled className="icono-verde" />
              </Button>
            </Tooltip>
            {privilegios?.modificar == "1" && ["abiertos"].includes(tab) /*&&
            ["0"].includes(estado_facturacion)*/ ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" key={key + "modificar"} size="small">
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "abiertos" /*&&
            ["0"].includes(estado_facturacion)*/ ? (
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
      <Row gutter={12}>
        <Col span={18}>
          <SearchBar>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        <Col span={6}>
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
              onChange: handleChangePagination,
              hideOnSinglePage: true,
              showTotal: () => {
                return (
                  <>
                    <Text>Total Registros: {pagination?.total}</Text>
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
