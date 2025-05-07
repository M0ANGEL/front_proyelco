/* eslint-disable react-hooks/exhaustive-deps */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import {
  getListadoAudObservacionesPag,
  setStatusAudObservacion,
} from "@/services/maestras/audObservacionesAPI";
import { DataType, Pagination } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { SearchBar } from "./styled";
import {
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Input,
  Table,
  Col,
  Row,
  Tag,
  Space,
  notification,
} from "antd";
import { MotivosAuditoria } from "@/services/types";

const { Text } = Typography;

export const ListObservacionesAud = () => {
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
    fetchObservaciones();
  }, []);

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusAudObservacion(id)
      .then(() => {
        fetchObservaciones();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const fetchObservaciones = () => {
    setLoaderTable(true);
    const data = {
      page: currentPage,
      paginate: currentItemsPage,
      searchInput: searchInput,
    };
    getListadoAudObservacionesPag(data)
      .then(({ data: { data } }) => {
        setPagination(data);
        const observaciones: DataType[] = data.data.map((observacion) => {
          return {
            key: observacion.id,
            aud_observacion: observacion.aud_observacion,
            motivos: observacion.motivos,
            estado: observacion.estado,
          };
        });
        setDataSource(observaciones);
        setLoadingRow([]);
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
      title: "Observación",
      dataIndex: "aud_observacion",
      key: "aud_observacion",
    },
    {
      title: "Motivos",
      dataIndex: "motivos",
      key: "motivos",
      render: (motivos) => {
        return (
          <Space style={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
            {motivos.map((motivo: MotivosAuditoria) => {
              return (
                <Tag
                  color="blue"
                  bordered={false}
                  key={`tag-${motivo.id}`}
                  style={{ fontSize: 11, textWrap: "wrap" }}
                >
                  {motivo.codigo} - {motivo.motivo}
                </Tag>
              );
            })}
          </Space>
        );
      },
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
          >
            <ButtonTag color={color}>
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
      fixed: "right",
      width: 100,
      render: (_, record: { key: React.Key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard
        title={"Lista de Observaciones de Auditoria"}
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
                onChange={(event) => {
                  if (event.currentTarget.value == "") {
                    setSearchInput("");
                  }
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
          scroll={{ x: 600 }}
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
