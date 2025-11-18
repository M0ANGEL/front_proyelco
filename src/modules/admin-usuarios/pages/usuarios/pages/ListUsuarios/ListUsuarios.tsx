/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable @typescript-eslint/no-explicit-any
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Popconfirm, message, Tag } from "antd";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Componentes globales
import { DataTable } from "@/components/global/DataTable";
import { BackButton } from "@/components/global/BackButton";
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import {
  getUsuarios,
  setStatusUser,
} from "@/services/administrarUsuarios/usuariosAPI";
import { Usuario as UsuarioType } from "@/types/typesGlobal";
import { ButtonTag } from "./styled";

const { Text } = Typography;

interface UsuarioTable {
  key: number;
  id: number;
  name: string;
  cedula: string;
  username: string;
  rol: string;
  last_login: string;
  estado: string;
  empresa_nombre: string;
}

export const ListUsuarios = () => {
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<UsuarioTable[]>([]);
  const [initialData, setInitialData] = useState<UsuarioTable[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Fetch inicial
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();
      const usersData = response.data;

      if (!usersData || !Array.isArray(usersData)) {
        message.error("Error en la estructura de datos recibida");
        return;
      }

      const users: UsuarioTable[] = usersData.map((user: UsuarioType) => ({
        key: user.id,
        id: user.id,
        name: user.nombre?.toUpperCase() || "",
        cedula: user.cedula?.toUpperCase() || "",
        username: user.username?.toUpperCase() || "",
        rol: user.rol?.toUpperCase() || "",
        last_login: dayjs(user.last_login).isValid()
          ? dayjs(user.last_login).format("DD-MM-YYYY HH:mm")
          : "NUNCA",
        estado: user.estado?.toString() || "0",
        empresa_nombre:
          user.empresa?.[0]?.emp_nombre?.toUpperCase() || "SIN EMPRESA",
      }));

      setInitialData(users);
      setDataSource(users);
    } catch (error) {
      message.error("Error al cargar los usuarios");
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
    const filteredData = initialData.filter((usuario) =>
      Object.values(usuario).some(
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
      const userId = Number(id);
      setLoadingRow((prev) => [...prev, userId]);
      await setStatusUser(userId);
      await fetchUsers();
      message.success("Estado actualizado correctamente");
    } catch {
      message.error("Error al cambiar el estado");
    } finally {
      setLoadingRow((prev) => prev.filter((item) => item !== Number(id)));
    }
  };

  // 🔹 Navegación
  const handleEdit = (record: UsuarioTable) => {
    navigate(`${location.pathname}/edit/${record.id}`);
  };
  const handleView = (record: UsuarioTable) => {
    message.info(`Vista de usuario: ${record.name}`);
  };

  // 🔹 Generar filtros dinámicos por columna
  const getColumnFilters = (dataIndex: keyof UsuarioTable) => {
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
        dataIndex: "name",
        key: "name",
        sorter: (a: UsuarioTable, b: UsuarioTable) =>
          a.name.localeCompare(b.name),
        fixed: "left" as const,
        width: 200,
        filters: getColumnFilters("name"),
        onFilter: (value, record) => record.name.includes(value as string),
      },
      {
        title: "CÉDULA",
        dataIndex: "cedula",
        key: "cedula",
        width: 120,
        filters: getColumnFilters("cedula"),
        onFilter: (value, record) => record.cedula.includes(value as string),
      },
      {
        title: "USUARIO",
        dataIndex: "username",
        key: "username",
        width: 150,
        filters: getColumnFilters("username"),
        onFilter: (value, record) => record.username.includes(value as string),
      },
      {
        title: "ROL",
        dataIndex: "rol",
        key: "rol",
        width: 150,
        filters: getColumnFilters("rol"),
        onFilter: (value, record) => record.rol.includes(value as string),
      },
      {
        title: "EMPRESA",
        dataIndex: "empresa_nombre",
        key: "empresa_nombre",
        width: 180,
        filters: getColumnFilters("empresa_nombre"),
        onFilter: (value, record) =>
          record.empresa_nombre.includes(value as string),
      },
      {
        title: "ÚLTIMO LOGIN",
        dataIndex: "last_login",
        key: "last_login",
        width: 160,
        filters: getColumnFilters("last_login"),
        onFilter: (value, record) =>
          record.last_login.includes(value as string),
      },
      {
        title: "ESTADO",
        dataIndex: "estado",
        key: "estado",
        align: "center",
        width: 90,
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
              <ButtonTag color={color}>
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.id) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </ButtonTag>
            </Popconfirm>
          );
        },
      },
      {
        title: "ACCIONES",
        key: "acciones",
        fixed: "right" as const,
        width: 100,
        render: (_: any, record: UsuarioTable) => (
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
        title="Gestión de Usuarios"
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
          placeholder="Buscar por nombre, cédula, usuario..."
          showFilterButton={false}
        />

        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="key"
          scroll={{ x: 1200, y: 500 }}
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
            💡 <strong>TIP:</strong> Haz clic en el estado de un usuario para
            activarlo o desactivarlo.
          </Text>
        </div>
      </GlobalCard>
    </div>
  );
};
