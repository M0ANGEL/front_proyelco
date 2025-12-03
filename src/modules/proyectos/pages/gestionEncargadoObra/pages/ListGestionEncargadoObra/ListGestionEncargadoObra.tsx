import { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Componentes globales
import { DataTable } from "@/components/global/DataTable";
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";

// Servicios y hooks
import {
  getGestionProyectoEncargado,
  IniciarProyecto,
} from "@/services/proyectos/gestionProyectoAPI";
import { IniciarProyectoCasas } from "@/services/proyectos/casasProyectosAPI";
import { ModalInforme } from "./ModalInforme";
import { ModalInformeCasa } from "../../../proyectos/pages/ListProyectos/ModalInformeCasa";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "@/hooks/useSessionStorage";

// Tipos
interface DataType {
  key: number;
  tipoPoryecto_id: string;
  cliente_id: string;
  usuario_crea_id: string;
  encargado_id: string;
  descripcion_proyecto: string;
  fecha_inicio: string;
  fecha_ini_proyecto: string;
  codigo_proyecto: string;
  torres: string;
  cant_pisos: string;
  apt: string;
  pisoCambiarProceso: string;
  estado: string;
  nombre_tipo: string;
  emp_nombre: string;
  porcentaje: string;
  avance: string;
  avance_pisos: string;
  total_apartamentos: string;
  apartamentos_realizados: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListGestionEncargadoObra = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  
 const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);


  const fetchCategorias = useCallback(() => {
    setLoading(true);
    getGestionProyectoEncargado()
      .then(({ data: { data, data_casas } }) => {
        // 🔹 Unimos apartamentos y casas
        const proyectos = [...(data || []), ...(data_casas || [])];

        const categorias = proyectos.map((categoria) => ({
          key: categoria.id,
          tipoPoryecto_id: categoria.tipoPoryecto_id,
          estado: categoria.estado?.toString(),
          cliente_id: categoria.cliente_id,
          usuario_crea_id: categoria.usuario_crea_id,
          encargado_id: categoria.encargado_id,
          descripcion_proyecto: categoria.descripcion_proyecto,
          fecha_inicio: categoria.fecha_inicio,
          codigo_proyecto: categoria.codigo_proyecto,
          torres: categoria.torres ?? null,
          cant_pisos: categoria.cant_pisos ?? null,
          avance_pisos: categoria.avance_pisos,
          apt: categoria.apt,
          pisoCambiarProceso: categoria.pisoCambiarProceso,
          fecha_ini_proyecto: categoria.fecha_ini_proyecto,
          nombre_tipo: categoria.nombre_tipo,
          emp_nombre: categoria.emp_nombre,
          porcentaje: categoria.porcentaje?.toString(),
          avance: categoria.avance,
          total_apartamentos: categoria.total_apartamentos,
          apartamentos_realizados: categoria.apartamentos_realizados,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
        }));

        setInitialData(categorias);
        setFilteredData(categorias);
      })
      .catch((error) => {
        console.error("Error fetching proyectos:", error);
      })
      .finally(() => {
        setLoading(false);
        setLoadingRow([]);
      });
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredData(initialData);
      return;
    }

    const filterTable = initialData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k as keyof DataType]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filterTable);
  }, [initialData]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setFilteredData(initialData);
  }, [initialData]);

  // Iniciar proyecto apartamentos
  const iniciarProyectoAparamentos = useCallback((id: React.Key) => {
    setLoadingRow(prev => [...prev, id]);
    IniciarProyecto(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow(prev => prev.filter(rowId => rowId !== id));
      });
  }, [fetchCategorias]);

  // Iniciar proyecto casas
  const iniciarProyectoCasas = useCallback((id: React.Key) => {
    setLoadingRow(prev => [...prev, id]);
    IniciarProyectoCasas(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow(prev => prev.filter(rowId => rowId !== id));
      });
  }, [fetchCategorias]);

  const columns = useMemo(() => [
    {
      title: "Fecha Creación",
      dataIndex: "created_at",
      key: "created_at",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => a.created_at.localeCompare(b.created_at),
      width: 120,
    },
    {
      title: "Tipo Proyecto",
      dataIndex: "nombre_tipo",
      align: "center" as const,
      key: "nombre_tipo",
      sorter: (a: DataType, b: DataType) => a.nombre_tipo.localeCompare(b.nombre_tipo),
      width: 120,
    },
    {
      title: "Atraso Proyecto",
      dataIndex: "porcentaje",
      key: "porcentaje",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => Number(a.porcentaje) - Number(b.porcentaje),
      render: (porcentaje: string) => (
        <Tag color={
          Number(porcentaje) <= 15 ? "green" : 
          Number(porcentaje) <= 30 ? "orange" : "red"
        }>
          {porcentaje}%
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Avance del Proyecto",
      dataIndex: "avance",
      key: "avance",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => Number(a.avance) - Number(b.avance),
      render: (avance: string) => (
        <Tag color={
          Number(avance) >= 80 ? "green" : 
          Number(avance) >= 50 ? "blue" : "cyan"
        }>
          {avance}%
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      align: "center" as const,
      ellipsis: true,
      width: 200,
    },
    {
      title: "Código Proyecto",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      align: "center" as const,
      width: 120,
    },
    {
      title: "Cliente",
      dataIndex: "emp_nombre",
      key: "emp_nombre",
      align: "center" as const,
      sorter: (a: DataType, b: DataType) => a.emp_nombre.localeCompare(b.emp_nombre),
      ellipsis: true,
      width: 150,
    },
    {
      title: "Estado Proyecto",
      dataIndex: "fecha_ini_proyecto",
      key: "fecha_ini_proyecto",
      align: "center" as const,
      render: (
        _: any,
        record: DataType
      ) => {
        const estadoString = record.fecha_ini_proyecto !== null ? "PROCESO" : "INICIAR";
        const color = record.fecha_ini_proyecto !== null ? "green" : "blue";

        const iniciarProyecto = (id: React.Key, tipo: string) => {
          if (tipo === "Apartamentos") {
            iniciarProyectoAparamentos(id);
          } else if (tipo === "Casa") {
            iniciarProyectoCasas(id);
          }
        };

        return (
          <Popconfirm
            // disabled={!["Encargado Obras"].includes(user_rol) || record.fecha_ini_proyecto !== null}
            title="¿Desea iniciar el proyecto?"
            onConfirm={() => iniciarProyecto(record.key, record.nombre_tipo)}
            placement="left"
          >
            <Tooltip title={record.fecha_ini_proyecto !== null ? "Proyecto en proceso" : "Iniciar Proyecto"}>
              <Tag
                color={color}
                icon={loadingRow.includes(record.key) ? <SyncOutlined spin /> : null}
                style={{ 
                  cursor: record.fecha_ini_proyecto === null && ["Encargado Obras", "Administrador"].includes(user_rol) 
                    ? "pointer" 
                    : "default",
                  margin: 0
                }}
              >
                {estadoString.toUpperCase()}
              </Tag>
            </Tooltip>
          </Popconfirm>
        );
      },
      sorter: (a: DataType, b: DataType) => (a.fecha_ini_proyecto || "").localeCompare(b.fecha_ini_proyecto || ""),
      width: 120,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center" as const,
      render: (_: any, record: DataType) => {
        const ruta =
          record.nombre_tipo === "Casa"
            ? `${location.pathname}/casas/${record.key}`
            : `${location.pathname}/${record.key}`;

        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Tooltip
              title={
                record.fecha_ini_proyecto === null
                  ? "Inicia el proyecto para Gestionar"
                  : "Gestionar Proyecto"
              }
            >
              <Link to={ruta}>
                <Button
                  disabled={record.fecha_ini_proyecto === null}
                  icon={<EditOutlined />}
                  type="primary"
                  size="small"
                />
              </Link>
            </Tooltip>
            
            {record.nombre_tipo === "Casa" ? (
              <ModalInformeCasa proyecto={record} />
            ) : (
              <ModalInforme proyecto={record} />
            )}
          </div>
        );
      },
      fixed: "right" as const,
      width: 100,
    },
  ], [location.pathname, user_rol, loadingRow, iniciarProyectoAparamentos, iniciarProyectoCasas]);

  return (
    <GlobalCard
      title="Lista de Proyectos Asignados"
      className="projects-management-container"
    >
      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar proyectos..."
          showFilterButton={false}
        />
      </div>

      {/* Tabla de proyectos */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        withPagination={true}
        hasFixedColumn={false}
        stickyHeader={true}
        scroll={{ x: 1000 }}
        rowClassName={(record) => 
          record.fecha_ini_proyecto === null ? "row-pending" : "row-active"
        }
      />

      {/* Información adicional */}
      {filteredData.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: '#fafafa',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <Text type="secondary">
            {searchValue ? 
              "No se encontraron proyectos que coincidan con la búsqueda" : 
              "No hay proyectos asignados"
            }
          </Text>
        </div>
      )}
    </GlobalCard>
  );
};

export default ListGestionEncargadoObra;