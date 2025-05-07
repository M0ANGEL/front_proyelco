/* eslint-disable react-hooks/exhaustive-deps */
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./styled";
import { useEffect, useState } from "react";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import {
  getListadoAliadosPag,
  setStatusAliado,
} from "@/services/aliados/aliadosAPI";

const { Text } = Typography;

export const ListAliados = () => {
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const location = useLocation();

  useEffect(() => {
    fetchAliados();
  }, []);

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusAliado(id)
      .then(() => {
        fetchAliados();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const fetchAliados = () => {
    setLoaderTable(true);
    const data = {
      page: currentPage,
      paginate: currentItemsPage,
      searchInput: searchInput,
    };
    getListadoAliadosPag(data).then(({ data: { data } }) => {
      setPagination(data);
      const aliados: DataType[] = data.data.map((aliado) => {
        return {
          key: aliado.id,
          aldo_nombre: aliado.aldo_nombre,
          convenio: `${aliado.convenio.descripcion} - ${aliado.convenio.num_contrato}`,
          estado: aliado.estado,
        };
      });
      setDataSource(aliados);
      setLoadingRow([]);
      setLoaderTable(false);
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "aldo_nombre",
      key: "aldo_nombre",
    },
    {
      title: "Convenio",
      dataIndex: "convenio",
      key: "convenio",
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
      <StyledCard
        title={"Lista de aliados"}
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
