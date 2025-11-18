/* eslint-disable react-hooks/exhaustive-deps */
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
import { getModulos, setStatusModulo } from "@/services/administrarUsuarios/modulosAPI";
import { Modulo } from "@/types/auth.types";

const { Text } = Typography;

interface ModuloTable {
  key: number;
  id: number;
  cod_modulo: string;
  nom_modulo: string;
  desc_modulo: string;
  estado: string;
}

export const ListModulo = () => {
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<ModuloTable[]>([]);
  const [initialData, setInitialData] = useState<ModuloTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchModulos();
  }, []);

  const fetchModulos = async () => {
    try {
      setLoading(true);
      const response = await getModulos();
      const modulosData = response?.data || [];

      if (!modulosData || !Array.isArray(modulosData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const modulos: ModuloTable[] = modulosData.map((modulo: Modulo) => ({
        key: modulo.id,
        id: modulo.id,
        cod_modulo: modulo.cod_modulo?.toUpperCase() || "",
        nom_modulo: modulo.nom_modulo?.toUpperCase() || "",
        desc_modulo: modulo.desc_modulo?.toUpperCase() || "",
        estado: modulo.estado?.toString() || "0",
      }));

      setInitialData(modulos);
      setDataSource(modulos);
    } catch (error) {
      message.error("Error al cargar los módulos");
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
    const filteredData = initialData.filter((modulo) =>
      Object.values(modulo).some(
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
      const moduloId = Number(id);
      setLoadingRow((prev) => [...prev, moduloId]);
      await setStatusModulo(moduloId);
      await fetchModulos();
      message.success("Estado actualizado correctamente");
    } catch {
      message.error("Error al cambiar el estado");
    } finally {
      setLoadingRow((prev) => prev.filter((item) => item !== Number(id)));
    }
  };

  // 🔹 Navegación
  const handleEdit = (record: ModuloTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof ModuloTable) => {
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
        title: "CÓDIGO",
        dataIndex: "cod_modulo",
        key: "cod_modulo",
        sorter: (a: ModuloTable, b: ModuloTable) =>
          a.cod_modulo.localeCompare(b.cod_modulo),
        filters: getColumnFilters("cod_modulo"),
        onFilter: (value, record) => record.cod_modulo.includes(value as string),
      },
      {
        title: "NOMBRE",
        dataIndex: "nom_modulo",
        key: "nom_modulo",
        sorter: (a: ModuloTable, b: ModuloTable) =>
          a.nom_modulo.localeCompare(b.nom_modulo),
        filters: getColumnFilters("nom_modulo"),
        onFilter: (value, record) => record.nom_modulo.includes(value as string),
      },
      {
        title: "DESCRIPCIÓN",
        dataIndex: "desc_modulo",
        key: "desc_modulo",
        sorter: (a: ModuloTable, b: ModuloTable) =>
          a.desc_modulo.localeCompare(b.desc_modulo),
        filters: getColumnFilters("desc_modulo"),
        onFilter: (value, record) => record.desc_modulo.includes(value as string),
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
        render: (_: any, record: ModuloTable) => (
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
        title="Gestión de Módulos"
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
          placeholder="Buscar por código, nombre, descripción..."
          showFilterButton={false}
        />

        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="key"
          scroll={{ x: 800 }}
          customClassName="custom-table"
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
            💡 <strong>TIP:</strong> Haz clic en el estado de un módulo para
            activarlo o desactivarlo.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};