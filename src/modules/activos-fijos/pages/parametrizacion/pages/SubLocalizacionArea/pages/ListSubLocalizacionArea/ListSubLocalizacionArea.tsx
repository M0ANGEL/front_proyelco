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
  Popconfirm,
  Tooltip,
  Layout,
  Tag,
  message,
} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { SubLocalizacionArea } from "@/services/types"; // Importar la interfaz
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  actualizarEstadoArea,
  getListaSubLocalizacionArea,
} from "@/services/activos/subLocalizacionAreaAPI";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListSubLocalizacionArea = () => {
  const navigate = useNavigate();
  const [subLocalizacionArea, setSubLocalizacionArea] = useState<
    SubLocalizacionArea[]
  >([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredSubLocalizacionArea, setFilteredSubLocalizacionArea] =
    useState<SubLocalizacionArea[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  //refresh el estado de las categorias
  useEffect(() => {
    fetchSubLocalizacionArea();
  }, [currentPage, searchInput]);

  //filtra las categorias por el nombre
  useEffect(() => {
    setFilteredSubLocalizacionArea(
      subLocalizacionArea.filter((subLocalizacionArea) =>
        subLocalizacionArea.descripcion
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, subLocalizacionArea]);

  //set las categorias con el filtro
  const fetchSubLocalizacionArea = () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getListaSubLocalizacionArea();
        setSubLocalizacionArea(response.data);
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
      const response = await actualizarEstadoArea(id, nuevoEstado);
      if (response.status === 200) {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el ESTADO de la categoria.",
        });
        // Aquí se puede agregar la lógica para actualizar el estado en la UI
        fetchSubLocalizacionArea(); // Ejemplo de función para refrescar los datos en la tabla
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      message.error("Error al actualizar el estado");
    }
  };

  const columns: ColumnsType<SubLocalizacionArea> = [
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
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: SubLocalizacionArea) => {
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
                onClick={() => navigate(`editar-sub-localizacion-area/${record.id}`)}
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
      <StyledCard title="LISTA  AREAS">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar areas"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-sub-localizacion-area")} // Redirigir a la vista de creación de categorías
            >
              Crear Area
            </Button>
          </Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id}
          size="small"
          columns={columns}
          dataSource={filteredSubLocalizacionArea}
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
