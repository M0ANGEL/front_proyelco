/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable @typescript-eslint/no-explicit-any
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Popconfirm, message, Tag, Tooltip } from "antd";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";

// Componentes globales
import { DataTable } from "@/components/global/DataTable";
import { BackButton } from "@/components/global/BackButton";
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { getPerfiles, setStatusPerfil } from "@/services/administrarUsuarios/perfilesAPI";

const { Text } = Typography;

interface PerfilTable {
  key: number;
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

export const ListPerfiles = () => {
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<PerfilTable[]>([]);
  const [initialData, setInitialData] = useState<PerfilTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      setLoading(true);
      const response = await getPerfiles();
      const perfilesData = response.data;

      if (!perfilesData || !Array.isArray(perfilesData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const perfiles: PerfilTable[] = perfilesData.map((perfil: any) => ({
        key: perfil.id,
        id: perfil.id,
        nombre: perfil.nom_perfil?.toUpperCase() || "",
        descripcion: perfil.desc_perfil?.toUpperCase() || "",
        estado: perfil.estado?.toString() || "0",
      }));

      setInitialData(perfiles);
      setDataSource(perfiles);
    } catch (error) {
      message.error("Error al cargar los perfiles");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Función de búsqueda global
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setDataSource(initialData);
      return;
    }
    const filteredData = initialData.filter((perfil) =>
      Object.values(perfil).some(
        (val) => val && String(val).includes(value.toUpperCase())
      )
    );
    setDataSource(filteredData);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setDataSource(initialData);
  };

  // 🔹 Cambiar estado
  const handleStatusChange = async (id: number | string) => {
    try {
      const perfilId = Number(id);
      setLoadingRow((prev) => [...prev, perfilId]);
      await setStatusPerfil(perfilId);
      await fetchPerfiles();
      message.success("Estado actualizado correctamente");
    } catch {
      message.error("Error al cambiar el estado");
    } finally {
      setLoadingRow((prev) => prev.filter((item) => item !== Number(id)));
    }
  };

  // 🔹 Navegación
  const handleEdit = (record: PerfilTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof PerfilTable) => {
    const uniqueValues = Array.from(
      new Set(initialData.map((d) => d[dataIndex]))
    );
    return uniqueValues.map((val) => ({
      text: String(val),
      value: String(val),
    }));
  };

  // 🔹 Columnas
  const columns = useMemo(
    () => [
      {
        title: "NOMBRE",
        dataIndex: "nombre",
        key: "nombre",
        sorter: (a: PerfilTable, b: PerfilTable) =>
          a.nombre.localeCompare(b.nombre),
        filters: getColumnFilters("nombre"),
        onFilter: (value, record) => record.nombre.includes(value as string),
      },
      {
        title: "DESCRIPCIÓN",
        dataIndex: "descripcion",
        key: "descripcion",
        sorter: (a: PerfilTable, b: PerfilTable) =>
          a.descripcion.localeCompare(b.descripcion),
        filters: getColumnFilters("descripcion"),
        onFilter: (value, record) => record.descripcion.includes(value as string),
      },
      {
        title: "ESTADO",
        dataIndex: "estado",
        key: "estado",
        align: "center",
        width: 120,
        filters: [
          { text: "ACTIVO", value: "1" },
          { text: "INACTIVO", value: "0" },
        ],
        onFilter: (value, record) => record.estado === value,
        render: (_, record) => {
          const isActive = record.estado === "1";
          const color = isActive ? "green" : "red";
          const estadoString = isActive ? "ACTIVO" : "INACTIVO";

          return (
            <Popconfirm
              title="¿Desea cambiar el estado?"
              onConfirm={() => handleStatusChange(record.id)}
              placement="left"
            >
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.id) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  style={{ cursor: "pointer" }}
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </Popconfirm>
          );
        },
      },
      {
        title: "ACCIONES",
        key: "acciones",
        align: "center",
        width: 100,
        render: (_: any, record: PerfilTable) => (
          <BotonesOpciones
            botones={[
              {
                tipo: "editar",
                label: "Editar",
                onClick: () => handleEdit(record),
              },
            ]}
          />
        ),
      },
    ],
    [initialData, loadingRow]
  );

  return (
    <div>
      <BackButton text="Volver al Dashboard" to="/dashboard" />

      <GlobalCard
        title="Gestión de Perfiles"
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Crear
            </Button>
          </Link>
        }
      >
        <SearchBar
          onSearch={handleSearch}
          onReset={handleResetSearch}
          placeholder="Buscar por nombre, descripción..."
          showFilterButton={false}
        />

        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="key"
          scroll={{ x: 800 }}
          customClassName="custom-table"
          pagination={{
            total: dataSource.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <Text strong>Total Registros: {total}</Text>
              );
            },
          }}
        />

        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #e9ecef",
          }}
        >
          <Text type="secondary">
            💡 <strong>TIP:</strong> Haz clic en el estado de un perfil para
            activarlo o desactivarlo.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};