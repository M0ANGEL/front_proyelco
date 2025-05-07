import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Row,
  Col,
  Typography,
  Layout,
  Tag,
  Popconfirm,
  Tooltip,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import {
  actualizarEstadoParametroSubCategoria,
  getListaParametros_SubCategoria,
} from "@/services/activos/Parametros_SubCategoriaAPI";
import { ColumnsType } from "antd/es/table";
import { Parametros_SubCategoria } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListParametros_SubCategoria = () => {
  const navigate = useNavigate();
  const [parametros_sub_Categoria, setParametros_sub_categoria] = useState<
    Parametros_SubCategoria[]
  >([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchInputSubcategoria, setSearchInputSubcategoria] = useState("");

  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredParametrosSubCategoria, setFilteredParametrosSubCategoria] =
    useState<Parametros_SubCategoria[]>([]);
  useEffect(() => {
    fetchParametros_SubCategoria();
  }, [currentPage]);

  useEffect(() => {
    setFilteredParametrosSubCategoria(
      parametros_sub_Categoria.filter((parametrosSubCategoria) =>
        parametrosSubCategoria.parametro.descripcion
          .toLowerCase()
          .includes(searchInput.toLowerCase()) &&
        parametrosSubCategoria.subcategoria.descripcion
          .toLowerCase()
          .includes(searchInputSubcategoria.toLowerCase())
      )
    );
  }, [searchInput, searchInputSubcategoria, parametros_sub_Categoria]);
  

  const fetchParametros_SubCategoria = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getListaParametros_SubCategoria();
  
        const data = Object.values(response.data).flat();
  
        setParametros_sub_categoria(data);
        setFilteredParametrosSubCategoria(data);
        setPagination({ total: response.total, per_page: response.per_page });
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            "Hubo un error al obtener los parámetros por subcategoría.",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };


  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      // Realiza la llamada a la API para actualizar el estado de la subcategoría
      const response = await actualizarEstadoParametroSubCategoria(id, nuevoEstado);
      if (response.status === 200) {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el ESTADO de la Subcategoria.",
        });
        fetchParametros_SubCategoria(); 
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      notification.error({
        message: "error actualizando la categoria"
      });
    }
  };


  const columns: ColumnsType<Parametros_SubCategoria> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "SUBCATEGORIA",
      dataIndex: "id_subCategoria",
      key: "id_subCategoria",
      render: (_, { subcategoria: { descripcion } }) => (
        <span> {descripcion} </span>
      ),
    },
    {
      title: "PARAMETRO",
      dataIndex: "id_parametro",
      key: "id_parametro",
      render: (_, { parametro: { descripcion } }) => (
        <span> {descripcion} </span>
      ),
    },
   
    {
      title: "CATEGORIA",
      dataIndex: "id_categoria",
      key: "id_categoria",
      render: (
        _,
        {
          subcategoria: {
            categoria: { descripcion },
          },
        }
      ) => <span> {descripcion} </span>,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: Parametros_SubCategoria) => {
        // Verificar si el estado actual es "activo" o "inactivo" (insensible a mayúsculas/minúsculas)
        const estadoActivo = record.estado?.toLowerCase() === "activo";
        const estadoString = estadoActivo ? "ACTIVO" : "INACTIVO";
        const color = estadoActivo ? "green" : "red";
     
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Tooltip title={`Cambiar a ${estadoActivo ? "INACTIVO" : "ACTIVO"}`}>
            <Popconfirm
                title={`¿Estás seguro de cambiar el estado a ${
                  estadoActivo ? "INACTIVO" : "ACTIVO"
                }?`}
                onConfirm={() =>
                  handleEstadoChange(
                    record.id,
                    estadoActivo ? "inactivo" : "activo"
                  )
                }
                okText="Sí"
                cancelText="No"
              >
                <Tag color={color} style={{ cursor: "pointer" }}>
                  {estadoString}
                </Tag>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      }
    },
  ];

  return (
    <Layout>
      <StyledCard title="Lista Parametros Sub Categoria">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar parametros"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar subcategoria"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInputSubcategoria(e.target.value)}
            />
          </Col>

         

          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-parametro-sub-categoria")}
            >
              Crear Parametro Sub Categoria
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}></Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()}
          size="small"
          columns={columns}
          dataSource={filteredParametrosSubCategoria}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: true,
            onChange: (page: number) => {
              setCurrentPage(page);
            },
            hideOnSinglePage: true,
          }}
        />
      </StyledCard>
    </Layout>
  );
};
