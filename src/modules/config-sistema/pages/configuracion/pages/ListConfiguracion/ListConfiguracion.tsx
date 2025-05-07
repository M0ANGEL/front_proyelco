import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Row,
  Col,
  Tooltip,
  Layout,
  Popconfirm,
  Tag,
  message,
  Tabs,
} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { VariablesDinamicas } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  actualizarEstadoVariablesDinamicas,
  getListaVariablesGestionHumana,
  getListaVariablesActivosFijos,
} from "@/services/maestras/configuracionAPI";

import { KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

let timeout: ReturnType<typeof setTimeout> | null;

export const ListConfiguracion = () => {
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const rol = getSessionVariable(KEY_ROL);

  const [tabActiva, setTabActiva] = useState<string | null>(null);
  const [variables, setVariables] = useState<VariablesDinamicas[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredVariables, setFilteredVariables] = useState<VariablesDinamicas[]>([]);
  const [pagination, setPagination] = useState<{ total: number; per_page: number }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Verificación de permisos según el rol
  const puedeVerGestionHumana = rol === "gh_admin";
  const puedeVerActivosFijos = ["administrador", "af-admin", "gerencia"].includes(rol);

  // Definir la pestaña activa basada en los permisos del usuario
  useEffect(() => {
    if (puedeVerGestionHumana) {
      setTabActiva("gestion-humana");
    } else if (puedeVerActivosFijos) {
      setTabActiva("activos-fijos");
    }
  }, [puedeVerGestionHumana, puedeVerActivosFijos]);

  // Cargar datos según la pestaña activa
  useEffect(() => {
    if (!tabActiva) return;
    fetchVariables();
  }, [tabActiva, currentPage, searchInput]);

  // Filtrar variables por nombre
  useEffect(() => {
    setFilteredVariables(
      variables.filter((variable) =>
        variable.nombre.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, variables]);

  // Obtener datos de la API según la pestaña activa
  const fetchVariables = () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(async () => {
      try {
        let response;
        if (tabActiva === "gestion-humana") {
          response = await getListaVariablesGestionHumana();
        } else {
          response = await getListaVariablesActivosFijos();
        }
        setVariables(response.data);
        setPagination({ total: response.total, per_page: response.per_page });
      } catch (error) {
        notification.error({ message: "Error al cargar los datos" });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  // Cambiar el estado de una variable
  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      const response = await actualizarEstadoVariablesDinamicas(id, nuevoEstado);
      if (response.status === 200) {
        notification.success({
          message: "Estado Actualizado",
          description: "Se ha cambiado el estado de la variable.",
        });
        fetchVariables();
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      message.error("Error al actualizar el estado");
    }
  };

  // Definir columnas de la tabla
  const columns: ColumnsType<VariablesDinamicas> = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Valor", dataIndex: "valor", key: "valor" },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record) => {
        const estadoActivo = record.estado === "1";
        return (
          <Tooltip title={`Cambiar a ${estadoActivo ? "INACTIVO" : "ACTIVO"}`}>
            <Popconfirm
              title={`¿Cambiar estado a ${estadoActivo ? "INACTIVO" : "ACTIVO"}?`}
              onConfirm={() => handleEstadoChange(record.id, estadoActivo ? "0" : "1")}
              okText="Sí"
              cancelText="No"
            >
              <Tag color={estadoActivo ? "green" : "red"} style={{ cursor: "pointer" }}>
                {estadoActivo ? "ACTIVO" : "INACTIVO"}
              </Tag>
            </Popconfirm>
          </Tooltip>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Editar">
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => navigate(`editar-variable/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Layout>
      <StyledCard title="LISTA CONFIGURACIÓN">
        {/* Solo mostrar Tabs si el usuario tiene acceso a alguna */}
        {(puedeVerGestionHumana || puedeVerActivosFijos) && (
          <Tabs activeKey={tabActiva || undefined} onChange={setTabActiva}>
            {puedeVerGestionHumana && (
              <Tabs.TabPane tab="Administración Gestión Humana" key="gestion-humana" />
            )}
            {puedeVerActivosFijos && (
              <Tabs.TabPane tab="Administración Activos Fijos" key="activos-fijos" />
            )}
          </Tabs>
        )}

        {/* Filtros y botón de creación */}
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar variables"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-variable")}
            >
              Crear Variable
            </Button>
          </Col>
        </Row>

        {/* Tabla de datos */}
        <Table
          bordered
          rowKey={(record) => record.id}
          size="small"
          columns={columns}
          dataSource={filteredVariables}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: true,
            onChange: (page: number) => setCurrentPage(page),
            hideOnSinglePage: true,
          }}
        />
      </StyledCard>
    </Layout>
  );
};
