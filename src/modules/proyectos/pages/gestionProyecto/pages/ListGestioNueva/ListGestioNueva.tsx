/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Typography, Tag, notification } from "antd";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";

// Servicios y componentes específicos
import { getGestionProyecto } from "@/services/proyectos/gestionProyectoAPI";
import { ModalInforme } from "../ListGestionProyecto/ModalInforme";
import { ModalInformeCasa } from "../../../proyectos/pages/ListProyectos/ModalInformeCasa";
import { DataType } from "./types";

// Estilos
import "./CustomListIng.css";
import { AiOutlineExpandAlt } from "react-icons/ai";

export const ListGestioNueva = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();

  const fetchConvenios = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { data, data_casas } } = await getGestionProyecto();
      
      // Mapear proyectos normales
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

      // Mapear proyectos de casas
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
    }
  }, []);

  useEffect(() => {
    fetchConvenios();
  }, [fetchConvenios]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchValue("");
  }, []);

  const filteredConvenios = useMemo(() => {
    return initialData.filter((convenio) => {
      const matchesSearch = Object.values(convenio).some(value =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      );
      return matchesSearch && convenio.estado === "1";
    });
  }, [initialData, searchValue]);

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
          <Typography.Title level={5} className="title-text">
            {item.descripcion_proyecto.toUpperCase()}
          </Typography.Title>
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
      title="Gestión de Proyectos"
      className="projects-list-container"
    >
      {/* Barra de búsqueda */}
      <div className="search-filters-container">
        <SearchBar
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="Buscar proyectos..."
          showFilterButton={false}
        />
        
        <div className="filters-section">
          <Typography.Text className="total-text">
            Total: {filteredConvenios.length} proyectos activos
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