/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Row,
  Col,
  Typography,
  Tooltip,
  Layout,
  Popconfirm,
  Tag,
  message,
} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import {
  actualizarEstadoCategoria,
  getListaCategorias,
  getListaVariablesDinamicasVidaUtil,
} from "@/services/activos/categoriaAPI"; // Importar el servicio de la API
import { ColumnsType } from "antd/es/table";
import { Categoria, VariablesDinamicas } from "@/services/types"; // Importar la interfaz
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListCategory = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const [variablesDinamicas, setVariablesDinamicas] = useState<
    VariablesDinamicas[]
  >([]);

  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  //refresh el estado de las categorias
  useEffect(() => {
    fetchCategorias();
  }, [currentPage, searchInput]);

  //filtra las categorias por el nombre
  useEffect(() => {
    setFilteredCategorias(
      categorias.filter((categoria) =>
        categoria.descripcion.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, categorias]);

  useEffect(() => {
    const fetchVariablesDinamicas = async () => {
      try {
        const { data } = await getListaVariablesDinamicasVidaUtil();
        if (Array.isArray(data)) {
          setVariablesDinamicas(data);
        } else {
          setVariablesDinamicas([]);
          notification.error({
            message: "Error",
            description: "La respuesta de la API no es válida.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Hubo un error al obtener las variables dinamicas.",
        });
      }
    };

    fetchVariablesDinamicas(); // Llama al método al montar el componente.
  }, []);

  //set las categorias con el filtro
  const fetchCategorias = () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getListaCategorias();
        setCategorias(response.data);
        setPagination({ total: response.total, per_page: response.per_page });
      } catch (error) {
        notification.error({
          message: "Error",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      // Realiza la llamada a la API para actualizar el estado de la subcategoría
      const response = await actualizarEstadoCategoria(id, nuevoEstado);
      if (response.status === 200) {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el ESTADO de la categoria.",
        });
        // Aquí se puede agregar la lógica para actualizar el estado en la UI
        fetchCategorias(); // Ejemplo de función para refrescar los datos en la tabla
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      message.error("Error al actualizar el estado");
    }
  };

  const columns: ColumnsType<Categoria> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Vida Útil",
      dataIndex: "variable_dinamica",
      key: "variable_dinamica",
      render: (id: number) => {
        const variable = variablesDinamicas.find((item) => item.id === id);
        return variable ? variable.nombre : "Desconocido";
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: Categoria) => {
        // Verificar si el estado actual es "activo" o "inactivo" (insensible a mayúsculas/minúsculas)
        const estadoActivo = record.estado?.toLowerCase() === "activo";
        const estadoString = estadoActivo ? "ACTIVO" : "INACTIVO";
        const color = estadoActivo ? "green" : "red";

        return (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <Tooltip title="Editar">
              <Button
                disabled={record.estado === "0" || record.estado === "5"}
                icon={<EditOutlined />}
                type="primary"
                size="small"
                onClick={() => navigate(`editar-categoria/${record.id}`)}
              />
            </Tooltip>

            <Tooltip
              title={`Cambiar a ${estadoActivo ? "INACTIVO" : "ACTIVO"}`}
            >
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
      },
    },
  ];

  return (
    <Layout>
      <StyledCard title="LISTA CATEGORIAS">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar categorías"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-categoria")} // Redirigir a la vista de creación de categorías
            >
              Crear Categoría
            </Button>
          </Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id}
          size="small"
          columns={columns}
          dataSource={filteredCategorias}
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
