/* eslint-disable react-hooks/exhaustive-deps */
import { /*EditOutlined,*/ SearchOutlined, StopOutlined, FilePdfFilled } from "@ant-design/icons";
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
import {
  getListaDP,
  getPDF,
} from "@/services/documentos/dpAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";

let timeout: ReturnType<typeof setTimeout> | null;

const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [value, setValue] = useState<string>("");
  const { getSessionVariable } = useSessionStorage();
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

  useEffect(() => {
    if (privilegios) {
      fetchDocumentos();
    }
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
    getListaDP(
      page,
      getSessionVariable(KEY_BODEGA),
      estado,
      query,
      privilegios?.id_tipoDocu
    )
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos = data.data.map((item) => {
          return {
            key: item.id,
            consecutivo_fp: item.fp_cabecera.consecutivo,
            consecutivo: item.consecutivo,
            observacion: item.observacion,
            usuario: item.usuario.username,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm:ss"),
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
      title: "Numero FP",
      dataIndex: "consecutivo_fp",
      key: "consecutivo_fp",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
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
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
      align: "center",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      sorter: (a, b) => a.fecha.localeCompare(b.fecha),
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
            <Input placeholder="Buscar" onChange={handleSearch} />
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