/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, SyncOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
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
import fileDownload from "js-file-download";
import { FaFileDownload } from "react-icons/fa";
import {
  getReportTerceros,
  getTerceros,
  setStatusTercero,
} from "@/services/admin-terceros/tercerosAPI";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const ListTerceros = () => {
  const [loadingRep, setLoadingRep] = useState<boolean>(false);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const location = useLocation();
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    fetchTerceros();
  }, []);

  const fetchTerceros = (query = "", page = 1) => {
    getTerceros(page, query).then(({ data: { data } }) => {
      setPagination(data);
      const terceros: DataType[] = data.data.map((tercero) => {
        return {
          key: tercero.id,
          nombre: tercero.nombre,
          nit: tercero.nit,
          razon_soc: tercero.razon_soc,
          correo_ele: tercero.correo_ele,
          telefono: tercero.telefono,
          celular: tercero.celular,
          estado: tercero.estado,
        };
      });
      setDataSource(terceros);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusTercero(id)
      .then(() => {
        fetchTerceros();
      })
      .catch(() => {
        setLoadingRow([]);
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
      fetchTerceros(value);
    }, 500);
  };

  const handleChangePagination: PaginationProps["onChange"] = (page) => {
    setLoaderTable(true);
    fetchTerceros(value, page);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre Comercial",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      fixed: "left",
      width: 100,
    },
    {
      title: "Razón Social",
      dataIndex: "razon_soc",
      key: "razon_soc",
      sorter: (a, b) => a.razon_soc.localeCompare(b.razon_soc),
      width: 120,
    },
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
      sorter: (a, b) => a.nit.localeCompare(b.nit),
      width: 80,
      align: "center",
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      sorter: (a, b) => a.celular.localeCompare(b.celular),
      width: 90,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      sorter: (a, b) => a.telefono.localeCompare(b.telefono),
      width: 90,
    },
    {
      title: "Correo Electrónico",
      dataIndex: "correo_ele",
      key: "correo_ele",
      sorter: (a, b) => a.correo_ele.localeCompare(b.correo_ele),
      width: 200,
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
      sorter: (a, b) => a.estado.localeCompare(b.estado),
      width: 90,
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
      width: 50,
    },
  ];

  return (
    <>
      <StyledCard
        title={"Lista de terceros"}
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
                  getReportTerceros()
                    .then(({ data }) => {
                      fileDownload(data, "ReporteTerceros.xlsx");
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
            hideOnSinglePage: true,
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
          bordered
          scroll={{ x: 1000 }}
        />
      </StyledCard>
    </>
  );
};
