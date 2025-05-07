/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, SyncOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  notification,
  PaginationProps,
  Popconfirm,
  Row,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType, Pagination } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import {
  buscarProductoLista,
  getProductos,
  getReportProductos,
  setStatusProducto,
} from "@/services/maestras/productosAPI";
import fileDownload from "js-file-download";
import { FaFileDownload } from "react-icons/fa";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListProductos = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRep, setLoadingRep] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = (page = 1) => {
    getProductos(page).then(({ data: { data } }) => {
      setPagination(data);
      const productos = data.data.map((producto) => {
        return {
          key: producto.id,
          descripcion: producto.descripcion,
          estado: producto.estado,
        };
      });
      setDataSource(productos);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const fetchSearchBarProductos = (query: string, page = 1) => {
    buscarProductoLista(query, page).then(({ data: { data } }) => {
      setPagination(data);
      const productos = data.data.map((producto) => {
        return {
          key: producto.id,
          descripcion: producto.descripcion,
          estado: producto.estado,
        };
      });
      setDataSource(productos);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusProducto(id)
      .then(() => {
        fetchProductos(currentPage);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          setLoadingRow([]);
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
      );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
    setCurrentPage(1);

    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (value.length > 0) {
      timeout = setTimeout(() => {
        fetchSearchBarProductos(value);
      }, 500);
    } else {
      fetchProductos();
    }
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    setCurrentPage(page);
    if (value.length > 0) {
      fetchSearchBarProductos(value, page);
    } else {
      fetchProductos(page);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
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
        title={"Lista de productos"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Row gutter={12}>
          <Col xs={24} sm={18}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          <Col xs={24} sm={6} style={{ marginBottom: 20 }}>
            <Spin
              spinning={loadingRep}
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            >
              <Button
                type="primary"
                onClick={() => {
                  setLoadingRep(true);
                  getReportProductos()
                    .then(({ data }) => {
                      fileDownload(data, "ReporteProductos.xlsx");
                    })
                    .finally(() => {
                      setLoadingRep(false);
                    });
                }}
                icon={<FaFileDownload />}
                block
              >
                Informe
              </Button>
            </Spin>
          </Col>
        </Row>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource}
          columns={columns}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: false,
            onChange: handleChangePagination,
            current: currentPage,
            hideOnSinglePage: true,
            showTotal: () => {
              return (
                <>
                  <Text>Total Registros: {pagination?.total}</Text>
                </>
              );
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
