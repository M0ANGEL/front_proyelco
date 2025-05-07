/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  StopOutlined,
  SearchOutlined,
  EditOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  PaginationProps,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getActa, getListaTRE, getTrePdf } from "@/services/documentos/trsAPI";
import { KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";
import { SearchBar } from "./styled";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = (query = "", page = 1) => {
    let estado = "";
    switch (tab) {
      case "aceptados":
        estado = "0";
        break;
      case "pendientes":
        estado = "1";
        break;
      case "cerrado":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }
    getListaTRE(page, getSessionVariable(KEY_BODEGA), estado, query)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            tre_id: item.tre_id,
            trs: item.traslado_salida.trs_id,
            bod_origen: item.bod_origen.bod_nombre,
            bod_destino: item.bod_destino.bod_nombre,
            user: item.user.username,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
          };
        });
        setDataSource(documentos);
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
        setLoaderTable(false);
      });
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

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchDocumentos(value, page);
  };

  const handlePdfClick = async (id: any) => {
    try {
      const response = await getTrePdf(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // Abrir el PDF en una nueva pestaña
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error mostrando el PDF:", error);
    }
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "tre_id",
      key: "tre_id",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "TRS",
      dataIndex: "trs",
      key: "trs",
      sorter: true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega Origen",
      dataIndex: "bod_origen",
      key: "bod_origen",
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Fecha Realizado",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <>
                <Tooltip title="Descargar Pdf">
                  <Button
                    size="small"
                    onClick={() => handlePdfClick(record.key)}
                  >
                    <FilePdfFilled className="icono-rojo" />
                  </Button>
                </Tooltip>
                <Tooltip title="Generar ACTA DE RECEPCIÓN">
                  <Button
                    size="small"
                    key={record.key + "pdf"}
                    onClick={() => generarActaRecepcion(record.key)}
                  >
                    <FilePdfFilled className="icono-morado" />
                  </Button>
                </Tooltip>
                <Tooltip title="Ver documento">
                  <Link to={`${location.pathname}/show/${record.key}`}>
                    <Button key={record.key + "consultar"} size="small">
                      <SearchOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              </>
            ) : null}
            {privilegios?.modificar == "1" && tab == "pendientes" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${record.key}`}>
                  <Button
                    type="primary"
                    size="small"
                    key={record.key + "modificar"}
                  >
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "aceptados" ? (
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
