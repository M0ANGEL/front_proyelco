import { useState, useEffect } from "react";
import { Table, Button, Input, notification, Row, Col, Typography, Layout, Popconfirm, Tooltip, Tag } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined} from "@ant-design/icons";
import { actualizarEstadoParametro, getListaParametros, verificarRelacionParametro } from "@/services/activos/parametrosAPI"; // Asegúrate de importar getListaCategorias
import { ColumnsType } from "antd/es/table";
import { Parametro} from "@/services/types"; // Importar la interfaz de Categoría
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListParametros = () => {
  const navigate = useNavigate();
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState(""); // Corregido a number | undefined
  const [pagination, setPagination] = useState<{ total: number; per_page: number }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredParametro, setFilteredParametro ] = useState<Parametro[]>([]);

  useEffect(() => {
    fetchParametros();
  }, [currentPage, searchInput]);

  useEffect(() =>{
    setFilteredParametro(
      parametros.filter((parametro) =>
        parametro.descripcion.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  },[searchInput, parametros]);



  const fetchParametros = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getListaParametros(); // Asegúrate de pasar los parámetros correctos si es necesario
        setParametros(response.data);
        setFilteredParametro(response.data);
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

  // const handleDelete = (id: number) => {
  //   deleteParametro(id)
  //     .then(() => {
  //       notification.success({
  //         message: "Categoría Eliminada",
  //         description: "La categoría ha sido eliminada exitosamente.",
  //       });
  //       fetchParametros(); // Refrescar la lista de categorías
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
        // Verificar si el parámetro tiene relaciones en la tabla `parametros_subCategoria`
        const relaciones = await verificarRelacionParametro(id);

        if (relaciones && relaciones.length > 0) {
            // Si existen relaciones, muestra una advertencia y detiene la actualización
            notification.warning({
                message: "No se puede actualizar el estado",
                description: `El parámetro está relacionado con una o más subcategorías. Primero inactiva las relaciones con estas subcategorías: ${relaciones.map((rel:any) => rel.nombreSubCategoria).join(", ")}`,
            });
            return; // Detener el proceso si hay relaciones activas
        }

        // Realiza la llamada a la API para actualizar el estado del parámetro
        const response = await actualizarEstadoParametro(id, nuevoEstado);
        if (response.status === 200) {
            notification.success({
                message: "Estado Actualizado",
                description: "Se ha cambiado el ESTADO del parámetro.",
            });
            // Aquí se puede agregar la lógica para actualizar el estado en la UI
            fetchParametros(); // Ejemplo de función para refrescar los datos en la tabla
        } else {
            throw new Error("No se pudo actualizar el estado");
        }
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
        notification.error({
            message: "Error actualizando el parámetro",
            description: "Ocurrió un problema al intentar actualizar el estado.",
        });
    }
};

  


  const columns: ColumnsType<Parametro> = [
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
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: Parametro) => {
        // Verificar si el estado actual es "activo" o "inactivo" (insensible a mayúsculas/minúsculas)
        const estadoActivo = record.estado?.toLowerCase() === "activo";
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
              onClick={() => navigate(`editar-parametro/${record.id}`)}
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
      <StyledCard title="Lista Parametros">
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-parametro")}
            >
              Crear Parametro
            </Button>
          </Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()} // Asegurar que rowKey sea un string
          size="small"
          columns={columns}
          dataSource={filteredParametro}
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
