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
import fileDownload from "js-file-download";
import { getExcel, getListaNCV } from "@/services/documentos/ncvAPI";

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

  const generarExcel = (key: React.Key) => {
    setLoaderTable(true);
    getExcel(key.toString())
      .then(({ data }) => {
        fileDownload(data, "NOTA CREDITO VENTA DIRECTA.xlsx");
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
    let estado = 1;
    switch (tab) {
      case "abiertos":
        estado = 1;
        break;
      case "cerrados":
        estado = 4;
        break;
      case "anulados":
        estado = 5;
        break;
    }
    getListaNCV(page, getSessionVariable(KEY_BODEGA), estado, query)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            consecutivo_factura: item.fve_cabecera.numero_fve,
            bodega: item.bodega.bod_nombre,
            usuario: item.usuario.username,
            cliente: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            total: item.total.toString(),
            cufe: item.cufe,
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
      title: "Consecutivo Factura",
      dataIndex: "consecutivo_factura",
      key: "consecutivo_factura",
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      sorter: (a, b) => a.cliente.localeCompare(b.cliente),
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
      render: (_, { key, cufe }) => {
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
            {privilegios?.modificar == "1" &&
            ["abiertos"].includes(tab) &&
            ["", null].includes(cufe) ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" key={key + "modificar"} size="small">
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" &&
            tab == "abiertos" &&
            ["", null].includes(cufe) ? (
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
