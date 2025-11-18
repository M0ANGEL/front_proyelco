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
import { SubMenu } from "@/types/auth.types";
import { getSubMenus } from "@/services/config/submenusAPI";

const { Text } = Typography;

interface SubmenuTable {
  key: number;
  id: number;
  nom_smenu: string;
  desc_smenu: string;
  link_smenu: string;
  menu_nombre: string;
  modulo_nombre: string;
}

export const ListSubmenu = () => {
  const [dataSource, setDataSource] = useState<SubmenuTable[]>([]);
  const [initialData, setInitialData] = useState<SubmenuTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchSubMenus();
  }, []);

  const fetchSubMenus = async () => {
    try {
      setLoading(true);
      const response = await getSubMenus();
      const submenusData = response?.data || [];

      if (!submenusData || !Array.isArray(submenusData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const submenus: SubmenuTable[] = submenusData.map((submenu: SubMenu) => ({
        key: submenu.id,
        id: submenu.id,
        nom_smenu: submenu.nom_smenu?.toUpperCase() || "",
        desc_smenu: submenu.desc_smenu?.toUpperCase() || "",
        link_smenu: submenu.link_smenu || "",
        menu_nombre: submenu.menu?.nom_menu?.toUpperCase() || "SIN MENÚ",
        modulo_nombre: submenu.menu?.modulo?.nom_modulo?.toUpperCase() || "SIN MÓDULO",
      }));

      setInitialData(submenus);
      setDataSource(submenus);
    } catch (error) {
      message.error("Error al cargar los submenús");
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
    const filteredData = initialData.filter((submenu) =>
      Object.values(submenu).some(
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
  const handleEdit = (record: SubmenuTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof SubmenuTable) => {
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
        dataIndex: "nom_smenu",
        key: "nom_smenu",
        sorter: (a: SubmenuTable, b: SubmenuTable) =>
          a.nom_smenu.localeCompare(b.nom_smenu),
        filters: getColumnFilters("nom_smenu"),
        onFilter: (value, record) => record.nom_smenu.includes(value as string),
      },
      {
        title: "DESCRIPCIÓN",
        dataIndex: "desc_smenu",
        key: "desc_smenu",
        sorter: (a: SubmenuTable, b: SubmenuTable) =>
          a.desc_smenu.localeCompare(b.desc_smenu),
        filters: getColumnFilters("desc_smenu"),
        onFilter: (value, record) => record.desc_smenu.includes(value as string),
      },
      {
        title: "ENLACE",
        dataIndex: "link_smenu",
        key: "link_smenu",
        sorter: (a: SubmenuTable, b: SubmenuTable) =>
          a.link_smenu.localeCompare(b.link_smenu),
        filters: getColumnFilters("link_smenu"),
        onFilter: (value, record) => record.link_smenu.includes(value as string),
      },
      {
        title: "MENÚ PADRE",
        dataIndex: "menu_nombre",
        key: "menu_nombre",
        sorter: (a: SubmenuTable, b: SubmenuTable) =>
          a.menu_nombre.localeCompare(b.menu_nombre),
        filters: getColumnFilters("menu_nombre"),
        onFilter: (value, record) => record.menu_nombre.includes(value as string),
      },
      {
        title: "MÓDULO",
        dataIndex: "modulo_nombre",
        key: "modulo_nombre",
        sorter: (a: SubmenuTable, b: SubmenuTable) =>
          a.modulo_nombre.localeCompare(b.modulo_nombre),
        filters: getColumnFilters("modulo_nombre"),
        onFilter: (value, record) => record.modulo_nombre.includes(value as string),
      },
      {
        title: "ACCIONES",
        key: "acciones",
        align: "center",
        width: 100,
        render: (_: any, record: SubmenuTable) => (
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
        title="Gestión de Submenús"
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
          scroll={{ x: 900 }}
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
            💡 <strong>TIP:</strong> Los submenús se organizan jerárquicamente bajo menús y módulos.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};