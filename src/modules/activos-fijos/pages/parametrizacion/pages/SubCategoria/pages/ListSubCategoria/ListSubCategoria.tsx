import { useState, useEffect } from "react";
import { Table, Button, Input, notification, Row, Col, Typography, Layout, Popconfirm, Tooltip, Tag } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { actualizarEstadoSubCategoria, getListaSubCategorias  } from "@/services/activos/subCategoriaAPI"; // Asegúrate de importar getListaCategorias
import { ColumnsType } from "antd/es/table";
import { SubCategoria } from "@/services/types"; // Importar la interfaz de Categoría
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListSubcategorias = () => {
  const navigate = useNavigate();
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSubcategorias, setFilteredSubcategorias] = useState<SubCategoria[]>([]);
  const [pagination, setPagination] = useState<{ total: number; per_page: number }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchSubcategorias();
  }, [currentPage]);

  useEffect(() => {
    setFilteredSubcategorias(
      subcategorias.filter((subcategoria) =>
        subcategoria.descripcion.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, subcategorias]);


  const fetchSubcategorias = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const {data, total,per_page} = await getListaSubCategorias(); // Asegúrate de pasar los parámetros correctos si es necesario
        setSubcategorias(data);
        setPagination({ total:total, per_page: per_page });
        setFilteredSubcategorias(data); // Inicialmente mostrar todas las subcategorías
      } catch (error) {
        notification.error({
          message: "Error",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  // const handleDelete = (id: number) => {
  //   deleteSubCategoria(id)
  //     .then(() => {
  //       notification.success({
  //         message: "Sub Categoría Eliminada",
  //         description: "La Sub categoría ha sido eliminada exitosamente.",
  //       });
  //       fetchSubcategorias(); // Refrescar la lista de categorías
  //     })
  //     .catch((error) => {
  //       notification.error({
  //         message: "Error",
  //         description: error.message,
  //       });
  //     });
  // };

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      // Realiza la llamada a la API para actualizar el estado de la subcategoría
      const response = await actualizarEstadoSubCategoria(id, nuevoEstado);
      if (response.status === 200) {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el ESTADO de la Subcategoria.",
        });
        // Aquí se puede agregar la lógica para actualizar el estado en la UI
        fetchSubcategorias(); // Ejemplo de función para refrescar los datos en la tabla
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


  const columns: ColumnsType<SubCategoria> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Sub Categoria",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Categoría",
      dataIndex: "categoria", // Usa id_categoria aquí
      key: "categoria",
      render: (categoria:{descripcion : string} ) => (
        <span>{categoria.descripcion}</span> // Usa el mapa para obtener el nombre de la categoría
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: SubCategoria) => {
        // Verificar si el estado actual es "activo" o "inactivo" (insensible a mayúsculas/minúsculas)
        const estadoActivo = record.estado.toLowerCase() === "activo";
        const estadoString = estadoActivo ? "ACTIVO" : "INACTIVO";
        const color = estadoActivo ? "green" : "red";
     
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>

<Tooltip title="Editar">
            <Button
              disabled={record.estado === "0" || record.estado === "5"}
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => navigate(`editar-subcategoria/${record.id}`)}
            />
          </Tooltip>

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
    }
  ];

  return (
    <Layout>
      <StyledCard title="Lista Sub Categorías">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar subcategorías"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-subcategoria")}
            >
              Crear Subcategoría
            </Button>
          </Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()} // Asegurar que rowKey sea un string
          size="small"
          columns={columns}
          dataSource={filteredSubcategorias}
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
