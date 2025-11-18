/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  CheckCircleFilled, 
  SyncOutlined, 
  EditFilled,
} from "@ant-design/icons";
import { Typography, Switch, Tag, notification } from "antd";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";
import { BackButton } from "@/components/global/BackButton";
import { SaveButton } from "@/components/global/SaveButton";

// Servicios y componentes específicos
import { DeleteProyecto, DeleteProyectoCasa, getProyectos } from "@/services/proyectos/proyectosAPI";
import { ModalInformeCasa } from "./ModalInformeCasa";
import { DataType } from "./types";

// Estilos
import "./CustomList.css";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { ModalInforme } from "../../../gestionProyecto/pages/ListGestionProyecto/ModalInforme";

export const ListProyectos = () => {
  const [showActiveConvenios, setShowActiveConvenios] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();

  const fetchConvenios = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { data, data_casas } } = await getProyectos();
      
      const convenios = data.map((convenio: any) => ({
        key: convenio.id,
        tipo: "Apartamento",
        nombreEncargado: (convenio.nombresEncargados || []).join(", "),
        nombreIngeniero: (convenio.nombresIngenieros || []).join(", "),
        descripcion_proyecto: convenio.descripcion_proyecto,
        emp_nombre: convenio.emp_nombre,
        estado: convenio.estado.toString(),
        fec_ini: convenio.fecha_inicio,
        fec_fin: convenio.fec_fin,
        codigo_proyecto: convenio.codigo_proyecto,
        porcentaje: convenio.porcentaje,
        avance: convenio.avance,
      }));

      const conveniosCasas = data_casas.map((casa: any) => ({
        key: casa.id,
        tipo: "Casa",
        nombreEncargado: (casa.nombresEncargados || []).join(", "),
        nombreIngeniero: (casa.nombresIngenieros || []).join(", "),
        descripcion_proyecto: casa.descripcion_proyecto,
        emp_nombre: casa.emp_nombre,
        estado: casa.estado.toString(),
        fec_ini: casa.fecha_inicio,
        fec_fin: casa.fec_fin,
        codigo_proyecto: casa.codigo_proyecto,
        porcentaje: casa.porcentaje,
        avance: casa.avance,
      }));

      setInitialData([...convenios, ...conveniosCasas]);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los proyectos",
      });
    } finally {
      setLoading(false);
      setLoadingRow([]);
    }
  }, []);

  useEffect(() => {
    fetchConvenios();
  }, [fetchConvenios]);

  const handleStatus = useCallback(async (id: React.Key, tipo: string) => {
    setLoadingRow(prev => [...prev, id]);
    try {
      if (tipo === "Casa") {
        await DeleteProyectoCasa(id);
      } else {
        await DeleteProyecto(id);
      }
      await fetchConvenios();
      notification.success({
        message: "Estado actualizado",
        description: "El estado del proyecto se ha actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      notification.error({
        message: "Error",
        description: "No se pudo actualizar el estado del proyecto",
      });
    } finally {
      setLoadingRow(prev => prev.filter(rowId => rowId !== id));
    }
  }, [fetchConvenios]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchValue("");
  }, []);

  const toggleConvenioList = useCallback((checked: boolean) => {
    setShowActiveConvenios(checked);
  }, []);

  const filteredConvenios = useMemo(() => {
    return initialData.filter((convenio) => {
      const matchesSearch = Object.values(convenio).some(value =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      );

      if (showActiveConvenios) {
        return matchesSearch && convenio.estado === "1";
      } else {
        return matchesSearch && convenio.estado === "0";
      }
    });
  }, [initialData, searchValue, showActiveConvenios]);

  const renderProgressCircle = (value: number, color: string, label: string) => (
    <div className="circle-progress-container">
      <div className="circle-progress-wrapper">
        <div className="circle-progress">
          <div
            className="circle-progress-fill"
            style={{
              background: `conic-gradient(${color} ${value}%, #F5F5F5 ${value}% 100%)`,
            }}
          ></div>
          <div className="circle-progress-text">
            <span>{value}%</span>
          </div>
        </div>
      </div>
      <span className="circle-progress-label">{label}</span>
    </div>
  );

  const getBotonesAccion = (item: DataType) => [
    {
      tipo: "custom" as const,
      label: item.estado === "1" ? "Desactivar" : "Activar",
      onClick: () => handleStatus(item.key, item.tipo),
      iconoPersonalizado: loadingRow.includes(item.key) ? 
        <SyncOutlined spin /> : 
        <CheckCircleFilled style={{ 
          color: item.estado === "1" ? "#10B981" : "#EF4444" 
        }} />,
      color: item.estado === "1" ? "success" : "danger" as const,
    },
    {
      tipo: "custom" as const,
      label: "Ver Proceso",
      onClick: () => window.open(`${location.pathname}/${item.tipo === "Casa" ? "proceso-casa" : "proceso"}/${item.key}`, '_self'),
      iconoPersonalizado: <AiOutlineExpandAlt />,
      color: "primary" as const,
    },
    {
      tipo: "custom" as const,
      label: "Generar Informe",
      onClick: () => {},
      iconoPersonalizado: item.tipo === "Casa" ? 
        <ModalInformeCasa proyecto={item} /> : 
        <ModalInforme proyecto={item} />,
      color: "default" as const,
    }
  ];

  const renderCardContent = (item: DataType) => (
    <div className="card-content-wrapper">
      {/* Sección izquierda con gráficos circulares */}
      <div className="progress-section">
        {renderProgressCircle(item.avance, "#4ADE80", "Avance")}
        {renderProgressCircle(item.porcentaje, "#F87171", "Atraso")}
      </div>

      {/* Sección derecha con información */}
      <div className="info-section">
        <div className="card-header">
          {item.estado === "1" ? (
            <Link
              to={`${location.pathname}/${
                item.tipo === "Casa" ? "edit-casa" : "edit"
              }/${item.key}`}
              className="title-link"
            >
              <Typography.Title level={5} className="title-text">
                {item.descripcion_proyecto.toUpperCase()}
              </Typography.Title>
              <EditFilled className="edit-icon" />
            </Link>
          ) : (
            <Typography.Title level={5} className="title-text">
              {item.descripcion_proyecto.toUpperCase()}
            </Typography.Title>
          )}
        </div>

        <div className="card-details">
          <Typography.Text className="client-text">
            CLIENTE: {item.emp_nombre}
          </Typography.Text>
          <Typography.Text className="engineer-text">
            INGENIEROS: {item.nombreIngeniero.toUpperCase()}
          </Typography.Text>
          <Typography.Text className="manager-text">
            ENCARGADOS: {item.nombreEncargado.toUpperCase()}
          </Typography.Text>
          <Typography.Text className="code-text">
            CÓDIGO PROYECTO: {item.codigo_proyecto.toUpperCase()}
          </Typography.Text>
        </div>

        {/* Botones de acción */}
        <div className="actions-section">
          <BotonesOpciones 
            botones={getBotonesAccion(item)}
            size="small"
            soloIconos={true}
            alineacion="center"
          />
        </div>

        <Tag 
          color={item.tipo === "Casa" ? "blue" : "green"} 
          className="type-tag"
        >
          {item.tipo}
        </Tag>
      </div>
    </div>
  );

  if (loading) {
    return (
      <LoadingSpinner 
        spinning={true}
        size={40}
        color="#F59E0B"
        backgroundColor="rgb(251 251 251 / 70%)"
      >
        <div style={{ height: '200px' }}></div>
      </LoadingSpinner>
    );
  }

  return (
    <GlobalCard
      title="Lista de Proyectos"
      className="projects-list-container"
      extra={
        <div className="header-actions">
          <BackButton />
          <Link to={`${location.pathname}/create`}>
            <SaveButton text="Crear Proyecto" />
          </Link>
        </div>
      }
    >
      {/* Barra de búsqueda y filtros */}
      <div className="search-filters-container">
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar proyectos..."
          showFilterButton={false}
        />
        
        <div className="filters-section">
          <div className="filter-switch">
            <Switch
              checkedChildren="Activos"
              unCheckedChildren="Inactivos"
              checked={showActiveConvenios}
              onChange={toggleConvenioList}
            />
          </div>
          
          <Typography.Text className="total-text">
            Total: {filteredConvenios.length} proyectos
          </Typography.Text>
        </div>
      </div>

      {/* Grid de proyectos */}
      <div className="projects-grid">
        {filteredConvenios.map((item) => (
          <GlobalCard 
            key={item.key} 
            className="project-card"
          >
            {renderCardContent(item)}
          </GlobalCard>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredConvenios.length === 0 && (
        <div className="empty-state">
          <Typography.Text type="secondary">
            No se encontraron proyectos con los filtros aplicados
          </Typography.Text>
        </div>
      )}
    </GlobalCard>
  );
};