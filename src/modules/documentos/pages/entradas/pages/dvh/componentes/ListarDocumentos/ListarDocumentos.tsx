/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FilePdfFilled, StopOutlined, SearchOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import {
  getListaDevolucion,
  getPDF,
} from "@/services/documentos/devolucionDisAPI";
import { KEY_BODEGA } from "@/config/api";
import { SearchBar } from "./styled";
import dayjs from "dayjs";
import {
  notification,
  Typography,
  Popover,
  Tooltip,
  Button,
  Input,
  Space,
  Col,
  Row,
} from "antd";

const { Paragraph, Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab, setLoader }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { getSessionVariable } = useSessionStorage();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  useEffect(() => {
    if (privilegios) {
      setLoaderTable(true);
      const controller = new AbortController();
      const { signal } = controller;
      fetchDocumentos(value, currentPage, signal);
      return () => controller.abort();
    }
  }, [privilegios, value, currentPage]);

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
    getListaDevolucion(
      page,
      getSessionVariable(KEY_BODEGA),
      estado,
      query,
      privilegios?.id_tipoDocu,
      abort
    )
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos = data.data.map((item) => {
          const nombre_paciente = `${item.paciente.nombre_primero} ${item.paciente.nombre_segundo} ${item.paciente.apellido_primero} ${item.paciente.apellido_segundo}`;
          return {
            key: item.id,
            bodega: item.bodega.bod_nombre,
            fuente: item.fuente ? item.fuente.prefijo : "",
            numero_servinte: item.numero_servinte,
            usuario: item.usuario.username,
            paciente: nombre_paciente,
            fecha: dayjs(item.created_at).format("DD-MM-YYYY HH:mm"),
            consecutivo: item.consecutivo,
            observacion: item.observacion,
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
      sorter: true,
      align: "center",
      width: 120,
    },
    {
      title: "Fuente",
      dataIndex: "fuente",
      key: "fuente",
      hidden: hasFuente ? false : true,
      align: "center",
      width: 60,
    },
    {
      title: "Número Servinte",
      dataIndex: "numero_servinte",
      key: "numero_servinte",
      hidden: hasFuente ? false : true,
      align: "center",
      width: 120,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 150,
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
            overlayStyle={{
              width: 500,
              border: "1px solid #d4d4d4",
              borderRadius: 10,
            }}
            placement="top"
          >
            <Paragraph
              ellipsis={{ rows: 2, expandable: false }}
              style={{ marginBlock: 0, fontSize: 12 }}
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
      align: "center",
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
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${record.key}`}>
                  <Button key={record.key + "consultar"} size="small">
                    <SearchOutlined />
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
            {privilegios?.anular == "1" && tab == "abiertos" ? (
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
            <Input
              placeholder={`Busqueda por consecutivo o número de identificación${
                hasFuente ? ` o número de servinte` : ""
              }, debes presionar Enter para buscar`}
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
              showSizeChanger: false,
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
