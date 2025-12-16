import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { EditOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { DataTable } from "@/components/global/DataTable";
import { SearchBar } from "@/components/global/SearchBar";
import { SaveButton } from "@/components/global/SaveButton";

// Servicios y hooks
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import useSessionStorage from "@/hooks/useSessionStorage";

import {
  DeleteInformePowerBi,
  getInformesPowerBi,
} from "@/services/powerBi/AdministrarInformePoerBiAPI";

// Tipos
interface DataType {
  key: number;
  nombre: string;
  estado: string;
  ruta: number;
  link_power_bi: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListInformesPowerBI = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");

  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await getInformesPowerBi();

      const categorias = data.map((categoria) => ({
        key: categoria.id,
        nombre: categoria.nombre,
        estado: categoria.estado.toString(),
        ruta: categoria.ruta,
        link_power_bi: categoria.link_power_bi,
        created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
      }));

      setInitialData(categorias);
      setFilteredData(categorias);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los informe",
      });
    } finally {
      setLoading(false);
      setLoadingRow([]);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (!value.trim()) {
        setFilteredData(initialData);
        return;
      }

      const filterTable = initialData.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k as keyof DataType])
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
      setFilteredData(filterTable);
    },
    [initialData]
  );

  const handleReset = useCallback(() => {
    setSearchValue("");
    setFilteredData(initialData);
  }, [initialData]);

  // Cambio de estado
  const handleStatus = useCallback(
    async (id: React.Key) => {
      setLoadingRow((prev) => [...prev, id]);
      try {
        await DeleteInformePowerBi(id);
        await fetchCategorias();
        notification.success({
          message: "Éxito",
          description: "Estado del informe actualizado correctamente",
        });
      } catch (error) {
        console.error("Error updating status:", error);
        notification.error({
          message: "Error",
          description: "No se pudo actualizar el estado del informe",
        });
      } finally {
        setLoadingRow((prev) => prev.filter((rowId) => rowId !== id));
      }
    },
    [fetchCategorias]
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        align: "center" as const,
      },
      {
        title: "Link",
        dataIndex: "link_power_bi",
        key: "link_power_bi",
        align: "center" as const,
      },
      {
        title: "Estado",
        dataIndex: "estado",
        key: "estado",
        align: "center" as const,
        render: (_: any, record: DataType) => {
          const isActive = record.estado === "1";
          const estadoString = isActive ? "ACTIVO" : "INACTIVO";
          const color = isActive ? "green" : "red";

          return (
            <Popconfirm
              title={`¿Desea ${
                isActive ? "desactivar" : "activar"
              } este Informe?`}
              onConfirm={() => handleStatus(record.key)}
              placement="left"
            >
              <Tooltip title={"Cambiar estado"}>
                <Tag
                  color={color}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  style={{
                    cursor: "pointer",
                    margin: 0,
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  {estadoString}
                </Tag>
              </Tooltip>
            </Popconfirm>
          );
        },
        sorter: (a: DataType, b: DataType) => a.estado.localeCompare(b.estado),
      },
      {
        title: "Acciones",
        key: "acciones",
        align: "center" as const,
        render: (_: any, record: DataType) => (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <Tooltip title="Editar cliente">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  size="small"
                  disabled={record.estado === "0"}
                />
              </Link>
            </Tooltip>
          </div>
        ),
        fixed: "right" as const,
      },
    ],
    [location.pathname, user_rol, loadingRow, handleStatus]
  );

  return (
    <GlobalCard
      title="Informes Power Bi"
      className="clients-management-container"
      extra={
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to={`${location.pathname}/create`}>
            <SaveButton text="Nuevo Link" icon={<PlusOutlined />} />
          </Link>
        </div>
      }
    >
      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar Informe..."
          showFilterButton={false}
        />
      </div>

      {/* Información de resultados */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "12px 16px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <Text strong style={{ color: "#475569" }}>
          Total: {filteredData.length} informes
        </Text>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {searchValue && `Filtrado por: "${searchValue}"`}
        </Text>
      </div>

      {/* Tabla de clientes */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        withPagination={true}
        hasFixedColumn={false}
        stickyHeader={true}
        scroll={{ x: 1000 }}
        rowClassName={(record) =>
          record.estado === "1" ? "row-active" : "row-inactive"
        }
      />

      {/* Estado vacío */}
      {filteredData.length === 0 && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fafafa",
            borderRadius: "8px",
            border: "2px dashed #e2e8f0",
            marginTop: "16px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "16px" }}>
            {searchValue
              ? "No se encontraron clientes que coincidan con la búsqueda"
              : "No hay clientes registrados"}
          </Text>
        </div>
      )}
    </GlobalCard>
  );
};

export default ListInformesPowerBI;
