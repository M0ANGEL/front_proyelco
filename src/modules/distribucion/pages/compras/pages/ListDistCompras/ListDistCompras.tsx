/* eslint-disable react-hooks/exhaustive-deps */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, FileExcelFilled, SyncOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useLocation } from "react-router-dom";
import {
  getInformeCumplimiento,
  getInformeDistribucion,
  getListadoDistribucion,
  setStatusDistribucion,
} from "@/services/distribucion/distComprasAPI";
import { DataType, Pagination } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import fileDownload from "js-file-download";
import { SearchBar } from "./styled";
import {
  notification,
  Popconfirm,
  Typography,
  Statistic,
  Progress,
  Tooltip,
  Button,
  Input,
  Table,
  Space,
  Col,
  Row,
  Tag,
} from "antd";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListDistCompras = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const location = useLocation();

  useEffect(() => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fetchDistTraslados();
    }, 800);
  }, [currentPage, currentItemsPage, searchInput]);

  useEffect(() => {
    fetchDistTraslados();
  }, []);

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusDistribucion(id)
      .then(() => {
        fetchDistTraslados();
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
          setLoadingRow([]);
        }
      );
  };

  const fetchDistTraslados = () => {
    setLoaderTable(true);
    const data = {
      page: currentPage,
      paginate: currentItemsPage,
      searchInput: searchInput,
    };
    getListadoDistribucion(data).then(({ data: { data } }) => {
      setPagination(data);
      const distribuciones: DataType[] = data.data.map(
        ({
          id,
          nombre,
          consecutivo,
          cantidad_trasladada,
          cantidad_total,
          estado,
        }) => {
          const porcentaje_traslados = parseInt(
            ((cantidad_trasladada * 100) / cantidad_total).toFixed()
          );
          return {
            key: id,
            nombre,
            consecutivo,
            cantidad_total,
            cantidad_trasladada,
            porcentaje_traslados,
            estado,
          };
        }
      );
      setDataSource(distribuciones);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const generarInforme = (key: React.Key, consecutivo: string) => {
    setLoaderTable(true);
    getInformeDistribucion(key.toString())
      .then(({ data }) => {
        fileDownload(data, "INFORME DISTRIBUCION - " + consecutivo + ".xlsx");
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

  const generarInformeCumplimiento = (key: React.Key, consecutivo: string) => {
    setLoaderTable(true);
    getInformeCumplimiento(key.toString())
      .then(({ data }) => {
        fileDownload(data, "INFORME CUMPLIMIENTO - " + consecutivo + ".xlsx");
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
      width: 100,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Cumpliento",
      key: "porcentaje_cumplimiento",
      align: "center",
      children: [
        {
          title: "TRASLADOS",
          align: "center",
          width: 200,
          render: (
            _,
            { porcentaje_traslados, cantidad_trasladada, cantidad_total }
          ) => {
            return (
              <div style={{ marginInline: 10 }}>
                <Space style={{ width: "100%" }} direction="vertical">
                  <Progress
                    type="circle"
                    size={"small"}
                    percent={porcentaje_traslados}
                  />
                  <Statistic
                    value={cantidad_trasladada.toLocaleString("es-CO")}
                    suffix={`/ ${cantidad_total.toLocaleString("es-CO")}`}
                  />
                </Space>
              </div>
            );
          },
        },
      ],
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 100,
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
            disabled={record.estado === "0"}
          >
            <ButtonTag color={color} disabled={record.estado === "0"}>
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </ButtonTag>
          </Popconfirm>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key, consecutivo }) => {
        return (
          <Space>
            <Tooltip title="Generar informe">
              <Button
                key={key + "excel"}
                onClick={() => generarInforme(key, consecutivo)}
                icon={<FileExcelFilled className="icono-verde" />}
              />
            </Tooltip>
            <Tooltip title="Generar informe cumplimiento">
              <Button
                key={key + "cumplimiento"}
                onClick={() => generarInformeCumplimiento(key, consecutivo)}
                icon={<FileExcelFilled className="icono-morado" />}
              />
            </Tooltip>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${key}`}>
                <Button icon={<EditOutlined />} type="primary" />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"Lista de distribuciones compras"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Row gutter={12}>
          <Col xs={24}>
            <SearchBar>
              <Input
                placeholder="Buscar"
                onPressEnter={(event) => {
                  setSearchInput(event.currentTarget.value);
                }}
              />
            </SearchBar>
          </Col>
        </Row>
        <Table
          bordered
          size="small"
          columns={columns}
          loading={loaderTable}
          dataSource={dataSource}
          className="custom-table"
          rowKey={(record) => record.key}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: false,
            onChange: (page: number, pageSize: number) => {
              setCurrentPage(page);
              setCurrentItemsPage(pageSize);
            },

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
      </StyledCard>
    </>
  );
};
