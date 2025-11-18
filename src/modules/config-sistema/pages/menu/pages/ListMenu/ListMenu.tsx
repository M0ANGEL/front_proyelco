/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Componentes globales
import { DataTable } from "@/components/global/DataTable";
import { BackButton } from "@/components/global/BackButton";
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { message } from "antd";
import { Menu } from "@/types/auth.types";
import { getMenus } from "@/services/config/menuAPI";

const { Text } = Typography;

interface MenuTable {
  key: number;
  id: number;
  nom_menu: string;
  desc_menu: string;
  link_menu: string;
  modulo_nombre: string;
}

export const ListMenu = () => {
  const [dataSource, setDataSource] = useState<MenuTable[]>([]);
  const [initialData, setInitialData] = useState<MenuTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await getMenus();
      const menusData = response?.data || [];

      if (!menusData || !Array.isArray(menusData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const menus: MenuTable[] = menusData.map((menu: Menu) => ({
        key: menu.id,
        id: menu.id,
        nom_menu: menu.nom_menu?.toUpperCase() || "",
        desc_menu: menu.desc_menu?.toUpperCase() || "",
        link_menu: menu.link_menu || "",
        modulo_nombre: menu.modulo?.nom_modulo?.toUpperCase() || "SIN MÓDULO",
      }));

      setInitialData(menus);
      setDataSource(menus);
    } catch (error) {
      message.error("Error al cargar los menús");
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
    const filteredData = initialData.filter((menu) =>
      Object.values(menu).some(
        (val) => val && String(val).includes(value.toUpperCase())
      )
    );
    setDataSource(filteredData);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setDataSource(initialData);
  };

  // 🔹 Navegación
  const handleEdit = (record: MenuTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };

  const handleView = (record: MenuTable) => {
    message.info(`Vista de menú: ${record.nom_menu}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof MenuTable) => {
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
        dataIndex: "nom_menu",
        key: "nom_menu",
        sorter: (a: MenuTable, b: MenuTable) =>
          a.nom_menu.localeCompare(b.nom_menu),
        filters: getColumnFilters("nom_menu"),
        onFilter: (value, record) => record.nom_menu.includes(value as string),
      },
      {
        title: "DESCRIPCIÓN",
        dataIndex: "desc_menu",
        key: "desc_menu",
        sorter: (a: MenuTable, b: MenuTable) =>
          a.desc_menu.localeCompare(b.desc_menu),
        filters: getColumnFilters("desc_menu"),
        onFilter: (value, record) => record.desc_menu.includes(value as string),
      },
      {
        title: "ENLACE",
        dataIndex: "link_menu",
        key: "link_menu",
        sorter: (a: MenuTable, b: MenuTable) =>
          a.link_menu.localeCompare(b.link_menu),
        filters: getColumnFilters("link_menu"),
        onFilter: (value, record) => record.link_menu.includes(value as string),
      },
      {
        title: "MÓDULO PADRE",
        dataIndex: "modulo_nombre",
        key: "modulo_nombre",
        sorter: (a: MenuTable, b: MenuTable) =>
          a.modulo_nombre.localeCompare(b.modulo_nombre),
        filters: getColumnFilters("modulo_nombre"),
        onFilter: (value, record) =>
          record.modulo_nombre.includes(value as string),
      },
      {
        title: "ACCIONES",
        key: "acciones",
        align: "center",
        width: 100,
        render: (_: any, record: MenuTable) => (
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
    [initialData]
  );

  return (
    <div>
      <BackButton text="Volver al Dashboard" to="/dashboard" />

      <GlobalCard
        title="Gestión de Menús"
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
          placeholder="Buscar por nombre, descripción, enlace..."
          showFilterButton={false}
        />

        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="key"
          scroll={{ x: 800, y: 400 }} // Scroll horizontal y vertical
          stickyHeader={true} // Header fijo al hacer scroll
          hasFixedColumn={false} // Cambia a true si quieres primera columna fija
          withPagination={true} // Opcional: activar paginación
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
            💡 <strong>TIP:</strong> Los menús se organizan jerárquicamente bajo
            módulos.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};
