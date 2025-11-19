/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { getCargos, setStatusCargo } from "@/services/administrarUsuarios/carosAPI";

const { Text } = Typography;

interface CargoTable {
  key: number;
  id: number;
  nombre: string;
  descripcion: string;
  empresa: string;
  estado: string;
}

export const ListCargos = () => {
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<CargoTable[]>([]);
  const [initialData, setInitialData] = useState<CargoTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      setLoading(true);
      const response = await getCargos();
      const cargosData = response?.data?.data || response?.data || [];

      if (!cargosData || !Array.isArray(cargosData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const cargos: CargoTable[] = cargosData.map((cargo: any) => ({
        key: cargo.id,
        id: cargo.id,
        nombre: cargo.nombre?.toUpperCase() || "",
        descripcion: cargo.descripcion?.toUpperCase() || "",
        empresa: cargo.empresas?.emp_nombre?.toUpperCase() || "SIN EMPRESA",
        estado: cargo.estado?.toString() || "0",
      }));

      setInitialData(cargos);
      setDataSource(cargos);
    } catch (error) {
      message.error("Error al cargar los cargos");
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
    const filteredData = initialData.filter((cargo) =>
      Object.values(cargo).some(
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
      const cargoId = Number(id);
      setLoadingRow((prev) => [...prev, cargoId]);
      await setStatusCargo(cargoId);
      await fetchCargos();
      message.success("Estado actualizado correctamente");
    } catch {
      message.error("Error al cambiar el estado");
    } finally {
      setLoadingRow((prev) => prev.filter((item) => item !== Number(id)));
    }
  };

  // 🔹 Navegación
  const handleEdit = (record: CargoTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof CargoTable) => {
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
        sorter: (a: CargoTable, b: CargoTable) =>
          a.nombre.localeCompare(b.nombre),
        filters: getColumnFilters("nombre"),
        onFilter: (value, record) => record.nombre.includes(value as string),
      },
      {
        title: "DESCRIPCIÓN",
        dataIndex: "descripcion",
        key: "descripcion",
        sorter: (a: CargoTable, b: CargoTable) =>
          a.descripcion.localeCompare(b.descripcion),
        filters: getColumnFilters("descripcion"),
        onFilter: (value, record) => record.descripcion.includes(value as string),
      },
      {
        title: "EMPRESA",
        dataIndex: "empresa",
        key: "empresa",
        sorter: (a: CargoTable, b: CargoTable) =>
          a.empresa.localeCompare(b.empresa),
        filters: getColumnFilters("empresa"),
        onFilter: (value, record) => record.empresa.includes(value as string),
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
        render: (_: any, record: CargoTable) => (
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
        title="Gestión de Cargos"
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
          placeholder="Buscar por nombre, descripción, empresa..."
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
            💡 <strong>TIP:</strong> Haz clic en el estado de un cargo para
            activarlo o desactivarlo.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};