/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ModalCargueOficios, ModalOficios } from "../../components";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ButtonUpload, SearchBar } from "./styled";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import {
  getListadoRadicacionPag,
  getOficios,
} from "@/services/radicacion/glosasAPI";
import {
  CloudServerOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  Typography,
  Tooltip,
  Button,
  Input,
  Space,
  Table,
  Col,
  Row,
} from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
const { Text } = Typography;

export const ListarRadicados = () => {
  const [openModalOficios, setOpenModalOficios] = useState<boolean>(false);
  const [openModalCargueOficios, setOpenModalCargueOficios] =
    useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [oficios, setOficios] = useState<string[]>([]);
  const [radicadoId, setRadicadoId] = useState<React.Key>();
  const location = useLocation();

  useEffect(() => {
    fetchRadicados();
  }, []);

  useEffect(() => {
    fetchRadicados(searchInput, currentPage, currentItemsPage);
  }, [currentPage, currentItemsPage]);

  const fetchRadicados = (query = "", page = 1, itemsPage = 10) => {
    setLoaderTable(true);
    const data = {
      searchInput: query,
      page,
      itemsPage,
    };
    getListadoRadicacionPag(data)
      .then(({ data: { data } }) => {
        setPagination(data);
        const radicados: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            cta_radicado: item.cta_radicado,
            nro_radicado: item.nro_radicado,
            tercero: item.tercero
              ? `${item.tercero.nit} - ${item.tercero.razon_soc}`
              : "",
            total: parseFloat(item.total),
            total_glosado: parseFloat(item.total_glosado),
            fecha_radicado: dayjs(item.fecha_radicado).format("YYYY-MM-DD"),
            fecha_creacion: dayjs(item.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            usuario: item.users.username,
          };
        });
        setDataSource(radicados);
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
    setSearchInput(value);

    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fetchRadicados(value, currentPage, currentItemsPage);
    }, 500);
  };

  const columns: ColumnsType<DataType> = [
    {
      key: "tercero",
      dataIndex: "tercero",
      title: "Tercero",
      align: "center",
    },
    {
      key: "cta_radicado",
      dataIndex: "cta_radicado",
      title: "Cuenta",
      align: "center",
      width: 120,
    },
    {
      key: "nro_radicado",
      dataIndex: "nro_radicado",
      title: "Número",
      align: "center",
      width: 120,
    },
    {
      key: "fecha_radicado",
      dataIndex: "fecha_radicado",
      title: "Fecha Radicado",
      align: "center",
      width: 120,
    },
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
      align: "center",
      width: 140,
      render(value) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "total_glosado",
      dataIndex: "total_glosado",
      title: "Total Glosado",
      align: "center",
      width: 140,
      render(value) {
        return <>$ {value.toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "fecha_creacion",
      dataIndex: "fecha_creacion",
      title: "Fecha Creación",
      align: "center",
      width: 200,
    },
    {
      key: "usuario",
      dataIndex: "usuario",
      title: "Usuario",
      align: "center",
      width: 120,
    },
    {
      key: "acciones",
      title: "Acciones",
      align: "center",
      fixed: "right",
      width: 200,
      render(_, { key, nro_radicado }) {
        return (
          <>
            <Space>
              <Tooltip title="Ver radicado">
                <Link to={`${location.pathname}/show/${key}`}>
                  <Button type="primary" key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="Ver Oficios">
                <Button
                  key={key + "oficios"}
                  size="small"
                  onClick={() => {
                    setLoaderTable(true);
                    getOficios(nro_radicado)
                      .then(({ data: { data } }) => {
                        if (data.length > 0) {
                          setOpenModalOficios(true);
                          setOficios(data);
                        } else {
                          notificationApi.open({
                            type: "warning",
                            message: "No existen oficios para este radicado",
                            duration: 3,
                          });
                        }
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
                                duration: 5,
                              });
                            }
                          } else {
                            notificationApi.open({
                              type: "error",
                              message: response.data.message,
                              duration: 5,
                            });
                          }
                        }
                      )
                      .finally(() => setLoaderTable(false));
                  }}
                >
                  <CloudServerOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Cargar oficio">
                <ButtonUpload
                  size="small"
                  onClick={() => {
                    setRadicadoId(key);
                    setOpenModalCargueOficios(true);
                  }}
                >
                  <UploadOutlined />
                </ButtonUpload>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <ModalOficios
        open={openModalOficios}
        setOpen={(value: boolean) => {
          setOpenModalOficios(value);
          setOficios([]);
        }}
        oficios={oficios}
      />
      <ModalCargueOficios
        open={openModalCargueOficios}
        setOpen={(value: boolean) => {
          setOpenModalCargueOficios(value);
        }}
        radicadoId={radicadoId}
      />
      <StyledCard title={"Listado de Radicaciones"}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          <Col xs={24}>
            <Table
              bordered
              size="small"
              columns={columns}
              loading={loaderTable}
              dataSource={dataSource}
              scroll={{ x: 1500 }}
              pagination={{
                total: pagination?.total,
                showSizeChanger: true,
                showTotal: (total, range) => (
                  <>
                    {`${range[0]}-${range[1]} de un total de `}
                    <Text type="warning" strong>
                      {total}
                    </Text>{" "}
                    registros
                  </>
                ),
                onChange: (page: number, pageSize: number) => {
                  setCurrentPage(page);
                  setCurrentItemsPage(pageSize);
                },
                locale: {
                  items_per_page: "/ página",
                  jump_to: "Ir a",
                  page: "Página",
                },
              }}
            />
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
