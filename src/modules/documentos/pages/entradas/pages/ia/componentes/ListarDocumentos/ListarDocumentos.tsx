/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  FilePdfFilled,
  FileExcelFilled,
  StopOutlined,
  SearchOutlined,
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
  Typography
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { SearchBar } from "./styled";
import { getExcel, getListaIA, getPDF } from "@/services/documentos/iaAPI";
import fileDownload from "js-file-download";

let timeout: ReturnType<typeof setTimeout> | null;
const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [value, setValue] = useState<string>("");

  const location = useLocation();

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
    setLoaderTable(true);
    getExcel(key.toString(), privilegios?.id_tipoDocu)
      .then(({ data }) => {
        fileDownload(data, "INVENTARIO APERTURA.xlsx");
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
  }, [privilegios]);

  const fetchDocumentos = (query = "", page = 1) => {
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
    if (privilegios) {
      getListaIA(page, privilegios.id_tipoDocu, estado, query)
        .then(({ data: { data } }) => {
          setPagination(data);
          const documentos: DataType[] = data.data.map((item) => {
            return {
              key: item.id,
              bodega: item.bodega.bod_nombre,
              usuario: item.user.username,
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
    }
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
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      sorter: (a, b) => a.bodega.localeCompare(b.bodega),
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
