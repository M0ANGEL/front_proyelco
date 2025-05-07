/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  /*EditOutlined,*/ SearchOutlined,
  StopOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  Button,
  Space,
  Col,
  Tooltip,
  Typography,
  PaginationProps,
  notification,
  Row,
  Input,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataType, Pagination, Props } from "./types";
import dayjs from "dayjs";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import { getListaPagSCO, getPDF } from "@/services/documentos/scoAPI";

const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPaginate, setCurrentPaginate] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();
  const location = useLocation();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    setLoaderTable(true);
    fetchDocumentos(searchInput, currentPage, currentPaginate);
  }, [currentPage, currentPaginate, searchInput]);

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

  const fetchDocumentos = (query = "", page = 1, paginate = 10) => {
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
    getListaPagSCO({
      bodega_id: getSessionVariable(KEY_BODEGA),
      estado,
      searchInput: query,
      paginate,
      page,
    })
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos = data.data.map((item) => {
          return {
            key: item.id,
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            usuario: item.usuario.username,
            tercero: `${item.tercero.nit} - ${item.tercero.razon_soc}`,
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
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

  const handleChangePagination: PaginationProps["onChange"] = (
    page,
    paginate
  ) => {
    setLoaderTable(true);
    setCurrentPage(page);
    setCurrentPaginate(paginate);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 130,
    },
    {
      title: "Proveedor",
      dataIndex: "tercero",
      key: "tercero",
    },
    {
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
      width: 100,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      width: 150,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        return (
          <Space>
            {privilegios?.crear == "1" && tab == "pendientes" ? (
              <Tooltip title="Ingresar Factura Proveedor">
                <Link to={`${location.pathname}/create/${record.key}`}>
                  <Button
                    type="primary"
                    key={record.key + "crear"}
                    size="small"
                  >
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
                <Link to={`${location.pathname}/show/${record.key}`}>
                  <Button key={record.key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && ["abiertos"].includes(tab) ? (
              <Tooltip title="Anular documento">
                <Link to={`${location.pathname}/anular/${record.key}`}>
                  <Button
                    danger
                    type="primary"
                    size="small"
                    key={record.key + "anular"}
                  >
                    <StopOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            <Tooltip title="Generar PDF">
              <Button
                size="small"
                key={record.key + "pdf"}
                onClick={() => generarPDF(record.key)}
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Row gutter={12}>
        <Col span={24}>
          <SearchBar>
            <Input
              placeholder="Buscar"
              onPressEnter={(event) => {
                const {
                  target: { value },
                }: any = event;
                setCurrentPage(1);
                setSearchInput(value);
              }}
            />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            scroll={{ x: 1000 }}
            pagination={{
              total: pagination?.total,
              pageSize: currentPaginate,
              current: currentPage,
              simple: false,
              showSizeChanger: true,
              pageSizeOptions: ["10", "30", "50"],
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
