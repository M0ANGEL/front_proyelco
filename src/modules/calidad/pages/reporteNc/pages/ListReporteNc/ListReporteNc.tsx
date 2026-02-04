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
import { DeleteAmCliente } from "@/services/clientes/AdministrarClientesApi";
import { getReportesNc } from "@/services/calidad/calidadAPI";

// Tipos
interface DataType {
  key: number;
  estado: string;
  created_at: string;
  proyecto: string;
  codigo_proyecto: string;
  tipo_reporte: string;
  insumo: string;
  codigo_insumo: string;
  factura: string;
  proveedor: string;
  no_conformidad: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListReporteNc = () => {
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
      } = await getReportesNc();

      const categorias = data.map((categoria) => ({
        key: categoria.id,
        proyecto: categoria.proyecto,
        estado: categoria.estado.toString(),
        codigo_proyecto: categoria.codigo_proyecto,
        tipo_reporte: categoria.tipo_reporte,
        insumo: categoria.insumo,
        codigo_insumo: categoria.codigo_insumo,
        factura: categoria.factura,
        proveedor: categoria.proveedor,
        descripcion_proyecto: categoria.descripcion_proyecto,
        descripcion_nc: categoria.descripcion_nc,
        created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
      }));

      setInitialData(categorias);
      setFilteredData(categorias);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los clientes",
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
            .includes(value.toLowerCase()),
        ),
      );
      setFilteredData(filterTable);
    },
    [initialData],
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
        await DeleteAmCliente(id);
        await fetchCategorias();
        notification.success({
          message: "Éxito",
          description: "Estado del cliente actualizado correctamente",
        });
      } catch (error) {
        console.error("Error updating status:", error);
        notification.error({
          message: "Error",
          description: "No se pudo actualizar el estado del cliente",
        });
      } finally {
        setLoadingRow((prev) => prev.filter((rowId) => rowId !== id));
      }
    },
    [fetchCategorias],
  );

  const columns = useMemo(
    () => [
      {
        title: "Fecha de Creación",
        dataIndex: "created_at",
        key: "created_at",
        sorter: (a: DataType, b: DataType) =>
          a.created_at.localeCompare(b.created_at),
        ellipsis: true,
        width: 200,
      },
      {
        title: "Proyecto",
        dataIndex: "descripcion_proyecto",
        key: "descripcion_proyecto",
        align: "center" as const,
        width: 120,
      },
      {
        title: "Codigo Proyecto",
        dataIndex: "codigo_proyecto",
        key: "codigo_proyecto",
        sorter: (a: DataType, b: DataType) =>
          a.codigo_proyecto.localeCompare(b.codigo_proyecto),
        ellipsis: true,
        width: 150,
      },
      {
        title: "Tipo Reporte",
        dataIndex: "tipo_reporte",
        key: "tipo_reporte",
        align: "center" as const,
        sorter: (a: DataType, b: DataType) =>
          a.tipo_reporte.localeCompare(b.tipo_reporte),
        width: 120,
      },
      {
        title: "Insumo",
        dataIndex: "insumo",
        key: "insumo",
        sorter: (a: DataType, b: DataType) => a.insumo.localeCompare(b.insumo),
        ellipsis: true,
        width: 200,
      },
      {
        title: "Codigo Insumo",
        dataIndex: "codigo_insumo",
        key: "codigo_insumo",
        ellipsis: true,
        width: 180,
      },
      {
        title: "Factura",
        dataIndex: "factura",
        key: "factura",
        ellipsis: true,
        width: 180,
      },
      {
        title: "Proveedor",
        dataIndex: "proveedor",
        key: "proveedor",
        ellipsis: true,
        width: 180,
      },
      {
        title: "No Conformidad",
        dataIndex: "descripcion_nc",
        key: "descripcion_nc",
        ellipsis: true,
        width: 180,
      },
      // {
      //   title: "Estado",
      //   dataIndex: "estado",
      //   key: "estado",
      //   align: "center" as const,
      //   render: (_: any, record: DataType) => {
      //     const isActive = record.estado === "1";
      //     const estadoString = isActive ? "ACTIVO" : "INACTIVO";
      //     const color = isActive ? "green" : "red";

      //     return (
      //       <Popconfirm
      //         title={`¿Desea ${
      //           isActive ? "desactivar" : "activar"
      //         } este cliente?`}
      //         onConfirm={() => handleStatus(record.key)}
      //         placement="left"
      //         disabled={!["Administrador"].includes(user_rol)}
      //       >
      //         <Tooltip
      //           title={
      //             ["Administrador"].includes(user_rol)
      //               ? "Cambiar estado"
      //               : "Sin permisos"
      //           }
      //         >
      //           <Tag
      //             color={color}
      //             icon={
      //               loadingRow.includes(record.key) ? (
      //                 <SyncOutlined spin />
      //               ) : null
      //             }
      //             style={{
      //               cursor: ["Administrador"].includes(user_rol)
      //                 ? "pointer"
      //                 : "default",
      //               margin: 0,
      //               minWidth: "80px",
      //               textAlign: "center",
      //             }}
      //           >
      //             {estadoString}
      //           </Tag>
      //         </Tooltip>
      //       </Popconfirm>
      //     );
      //   },
      //   sorter: (a: DataType, b: DataType) => a.estado.localeCompare(b.estado),
      //   width: 100,
      // },
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
        width: 80,
      },
    ],
    [location.pathname, user_rol, loadingRow, handleStatus],
  );

  return (
    <GlobalCard
      title="Gestión de Reportes NC"
      className="clients-management-container"
      extra={
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to={`${location.pathname}/create`}>
            <SaveButton text="Nuevo Reporte NC" icon={<PlusOutlined />} />
          </Link>
        </div>
      }
    >
      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar NC..."
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
          Total: {filteredData.length} NC
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

export default ListReporteNc;
