import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircleFilled, SyncOutlined, EditFilled } from "@ant-design/icons";
import { Typography, Switch, Tag, notification, Tooltip } from "antd";

// Componentes globales
import { GlobalCard } from "@/components/global/GlobalCard";
import { SearchBar } from "@/components/global/SearchBar";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";
import { BackButton } from "@/components/global/BackButton";
import { SaveButton } from "@/components/global/SaveButton";

// Servicios y componentes específicos
import {
  DeleteProyecto,
  DeleteProyectoCasa,
  getProyectos,
  getEstadoTramitesAdmin,
} from "@/services/proyectos/proyectosAPI";
import { ModalInformeCasa } from "./ModalInformeCasa";
import { DataType } from "./types";

// Estilos
import "./CustomList.css";
import { AiFillCopy, AiOutlineExpandAlt } from "react-icons/ai";
import { ModalInforme } from "../../../gestionProyecto/pages/ListGestionProyecto/ModalInforme";
import { ModalHisotircoPorcentajes } from "../../components/ModalHisotircoPorcentajes/ModalHisotircoPorcentajes";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

// Tipos para los datos de trámites
interface EtapaData {
  etapa: number;
  avance: number;
  atrazo: number;
  total: number;
  completados: number;
  pendientes: number;
  info: string;
}

interface DocumentoData {
  tipo: string;
  codigo_proyecto: number;
  avance: number;
  atrazo: number;
  total: number;
  completados: number;
  pendientes: number;
  etapas: EtapaData[];
}

interface OperadorData {
  operador: number;
  avance: number;
  atrazo: number;
  total: number;
  completados: number;
  pendientes: number;
}

interface OrganismoData {
  codigo_proyecto: number;
  tipo: string;
  operadores: OperadorData[];
}

interface TramitesData {
  documentos: DocumentoData[];
  organismos: OrganismoData[];
}

interface TramitesResponse {
  status: string;
  porcentajes: TramitesData;
}

export const ListProyectos = () => {
  const [showActiveConvenios, setShowActiveConvenios] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tramitesData, setTramitesData] = useState<TramitesData>({
    documentos: [],
    organismos: [],
  });

  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const navigate = useNavigate();

  const location = useLocation();

  const fetchConvenios = useCallback(async () => {
    try {
      setLoading(true);

      // Obtener proyectos y trámites en paralelo
      const [proyectosResponse, tramitesResponse] = await Promise.all([
        getProyectos(),
        getEstadoTramitesAdmin(),
      ]);

      const { data } = proyectosResponse;
      const tramitesDataResponse: TramitesResponse = tramitesResponse.data;

      // Guardar datos de trámites
      setTramitesData(tramitesDataResponse.porcentajes);

      // Transformar datos de proyectos
      const proyectos = data.data.map((proyecto: any) => ({
        key: proyecto.id,
        tipo: "Apartamento",
        nombreEncargado: (proyecto.nombresEncargados || []).join(", "),
        nombreIngeniero: (proyecto.nombresIngenieros || []).join(", "),
        descripcion_proyecto: proyecto.descripcion_proyecto,
        emp_nombre: proyecto.emp_nombre,
        estado: proyecto.estado.toString(),
        fec_ini: proyecto.fecha_inicio,
        fec_fin: proyecto.fec_fin,
        codigo_proyecto: Number(proyecto.codigo_proyecto),
        porcentaje: proyecto.porcentaje,
        avance: proyecto.avance,
      }));

      const proyectosCasas = data.data_casas.map((casa: any) => ({
        key: casa.id,
        tipo: "Casa",
        nombreEncargado: (casa.nombresEncargados || []).join(", "),
        nombreIngeniero: (casa.nombresIngenieros || []).join(", "),
        descripcion_proyecto: casa.descripcion_proyecto,
        emp_nombre: casa.emp_nombre,
        estado: casa.estado.toString(),
        fec_ini: casa.fecha_inicio,
        fec_fin: casa.fec_fin,
        codigo_proyecto: Number(casa.codigo_proyecto),
        porcentaje: casa.porcentaje,
        avance: casa.avance,
      }));

      setInitialData([...proyectos, ...proyectosCasas]);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los datos",
      });
    } finally {
      setLoading(false);
      setLoadingRow([]);
    }
  }, []);

  useEffect(() => {
    fetchConvenios();
  }, [fetchConvenios]);

  // Modificar estas funciones para que devuelvan undefined si no existe la relación
  const getDocumentosData = useCallback(
    (codigoProyecto: number) => {
      return tramitesData.documentos.find(
        (doc) => doc.codigo_proyecto === codigoProyecto,
      );
    },
    [tramitesData],
  );

  const getOrganismosData = useCallback(
    (codigoProyecto: number) => {
      return tramitesData.organismos.find(
        (org) => org.codigo_proyecto === codigoProyecto,
      );
    },
    [tramitesData],
  );

  const handleStatus = useCallback(
    async (id: React.Key, tipo: string) => {
      setLoadingRow((prev) => [...prev, id]);
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
        setLoadingRow((prev) => prev.filter((rowId) => rowId !== id));
      }
    },
    [fetchConvenios],
  );

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearchValue("");
  }, []);

  const toggleConvenioList = useCallback((checked: boolean) => {
    setShowActiveConvenios(checked);
  }, []);

  //renderizar y filtrar proyectos por sus estados para poder verlos, ya que del backend se envian todos, aqui se discriminar por estados,
  //esto solo para ese componente ya que es del modulo administrador
  const filteredConvenios = useMemo(() => {
    return initialData.filter((convenio) => {
      const matchesSearch =
        searchValue === "" ||
        Object.values(convenio).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase()),
        );

      if (showActiveConvenios) {
        return (
          (matchesSearch && convenio.estado == "1") || convenio.estado == "2"
        );
      } else {
        return matchesSearch && convenio.estado === "0";
      }
    });
  }, [initialData, searchValue, showActiveConvenios]);

  // Función para renderizar círculos de progreso
  const renderProgressCircle = useCallback(
    (
      value: number,
      color: string,
      label: string,
      showNoData: boolean = false,
      noDataMessage: string = "PND",
    ) => {
      // Para avance/atraso: SIEMPRE mostrar círculo aunque sea 0%
      if (!showNoData) {
        return (
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
                  <span>{value.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <span className="circle-progress-label">{label}</span>
          </div>
        );
      }

      // Mostrar "Sin datos" cuando no hay relación
      return (
        <div className="circle-progress-container">
          <div className="circle-progress-wrapper">
            <div className="no-data-circle">
              <div className="no-data-text">{noDataMessage}</div>
            </div>
          </div>
          <span className="circle-progress-label">{label}</span>
        </div>
      );
    },
    [],
  );

  // Función para renderizar círculo de documentos CON NUEVO TOOLTIP DE ETAPAS
  const renderDocumentosCircle = useCallback(
    (codigoProyecto: number) => {
      const documentoData = getDocumentosData(codigoProyecto);

      // Si NO existe la relación por codigo_proyecto, mostrar "Sin datos"
      if (!documentoData) {
        return renderProgressCircle(0, "#60A5FA", "OR", true, "PND");
      }

      // Si EXISTE la relación, mostrar el círculo con tooltip mejorado
      return (
        <Tooltip
          title={
            <div style={{ textAlign: 'center', padding: '10px', maxWidth: '240px' }}>
              {documentoData.etapas && documentoData.etapas.length > 0 && (
                <>
                  <div style={{ 
                    margin: '8px 0 6px 0', 
                    fontWeight: 'bold', 
                    borderTop: '1px solid #e2e8f0', 
                    paddingTop: '8px', 
                    fontSize: '13px',
                    color: '#1e293b'
                  }}>
                    📊 Avance por Etapas:
                  </div>
                  {documentoData.etapas.map((etapa, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px', 
                      color: '#475569',
                      marginBottom: '4px',
                      padding: '3px 0'
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        {etapa.info} __
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>
                          {etapa.avance.toFixed(1)}%
                        </span>
                        {/* <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          ({etapa.completados}/{etapa.total})
                        </span> */}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          }
          placement="top"
          color="white"
          overlayStyle={{ maxWidth: '250px' }}
        >
          <div className="circle-progress-container">
            <div className="circle-progress-wrapper">
              <div className="circle-progress">
                <div
                  className="circle-progress-fill"
                  style={{
                    background: `conic-gradient(#60A5FA 0% ${documentoData.avance}%, #F5F5F5 ${documentoData.avance}% 100%)`,
                  }}
                ></div>
                <div className="circle-progress-text">
                  <span>{documentoData.avance.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <span className="circle-progress-label">OR</span>
          </div>
        </Tooltip>
      );
    },
    [getDocumentosData, renderProgressCircle],
  );

  // Función para renderizar círculo de organismos con círculos concéntricos
  const renderOrganismosCircle = useCallback(
    (codigoProyecto: number) => {
      const organismoData = getOrganismosData(codigoProyecto);

      // Si NO existe la relación por codigo_proyecto, mostrar "Sin datos"
      if (!organismoData) {
        return (
          <div className="circle-progress-container">
            <div className="circle-progress-wrapper">
              <div className="no-data-circle">
                <div className="no-data-text">PND</div>
              </div>
            </div>
            <span className="circle-progress-label">CERTF.</span>
          </div>
        );
      }

      const { operadores } = organismoData;
      const totalOperadores = operadores.length;

      // Si EXISTE la relación pero no hay operadores
      if (totalOperadores === 0) {
        return (
          <div className="circle-progress-container">
            <div className="circle-progress-wrapper">
              <div className="circle-progress">
                <div
                  className="circle-progress-fill"
                  style={{
                    background: `conic-gradient(#8B5CF6 0%, #F5F5F5 0% 100%)`,
                  }}
                ></div>
                <div className="circle-progress-text">
                  <span>0.0%</span>
                </div>
              </div>
            </div>
            <span className="circle-progress-label">CERTF.</span>
          </div>
        );
      }

      // Calcular porcentajes para cada operador
      const avances = operadores.map((op) => op.avance);
      const totalAvance =
        avances.reduce((sum, a) => sum + a, 0) / totalOperadores;

      // Colores para los círculos concéntricos
      const colors = [
        "#60A5FA",
        "#34D399",
        "#F87171",
        "#FBBF24",
        "#8B5CF6",
        "#F59E0B",
      ];

      // Determinar cuántos círculos mostrar (máximo 3)
      const circlesToShow = Math.min(totalOperadores, 3);

      // Calcular porcentajes para los círculos
      let percentages = [];
      if (totalOperadores === 1) {
        percentages = [avances[0]];
      } else if (totalOperadores === 2) {
        percentages = [avances[0], avances[1]];
      } else if (totalOperadores === 3) {
        percentages = [avances[0], avances[1], avances[2]];
      } else {
        // Para 4+ operadores: 3 círculos, el último agrupa los restantes
        percentages = [
          avances[0],
          avances[1],
          avances.slice(2).reduce((sum, a) => sum + a, 0) /
            (totalOperadores - 2),
        ];
      }

      return (
        <div className="circle-progress-container">
          <div className="circle-progress-wrapper">
            <Tooltip
              title={
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    maxWidth: "200px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "4px",
                      fontSize: "12px",
                      color: "black",
                    }}
                  >
                    Avance por Operador
                  </div>
                  {operadores.map((op, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "3px",
                        fontSize: "11px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: colors[idx % colors.length],
                          marginRight: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "black",
                        }}
                      >
                        {op.operador === 1 ? "Retie" : op.operador === 2 ? "Ritel" : "Retilap"}: {op.avance.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: "6px",
                      fontWeight: "bold",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "6px",
                      fontSize: "12px",
                    }}
                  >
                    Promedio total: {totalAvance.toFixed(1)}%
                  </div>
                </div>
              }
              placement="top"
              color="white"
            >
              <div className="organismos-concentric">
                {/* Círculo 1 (más grande) */}
                <div
                  className="concentric-layer concentric-layer-1"
                  style={{
                    background: `conic-gradient(${colors[0]} 0% ${percentages[0]}%, #F5F5F5 ${percentages[0]}% 100%)`,
                  }}
                />

                {/* Círculo 2 - solo si existe */}
                {percentages[1] !== undefined && (
                  <div
                    className="concentric-layer concentric-layer-2"
                    style={{
                      background: `conic-gradient(${colors[1]} 0% ${percentages[1]}%, #F5F5F5 ${percentages[1]}% 100%)`,
                    }}
                  />
                )}

                {/* Círculo 3 - solo si existe */}
                {percentages[2] !== undefined && (
                  <div
                    className="concentric-layer concentric-layer-3"
                    style={{
                      background: `conic-gradient(${colors[2]} 0% ${percentages[2]}%, #F5F5F5 ${percentages[2]}% 100%)`,
                    }}
                  />
                )}

                {/* Centro con el promedio */}
                <div className="donut-center">
                  <div className="donut-center-text">
                    {totalAvance.toFixed(1)}%
                  </div>
                </div>
              </div>
            </Tooltip>
          </div>
          <span className="circle-progress-label">CERTF.</span>
        </div>
      );
    },
    [getOrganismosData],
  );

  const getBotonesAccion = useCallback(
    (item: DataType) => {
      const botones = [];

      // Solo mostrar el botón de Activar/Desactivar si el usuario es Administrador
      if (user_rol === "Administrador" || user_rol === "Directora Proyectos") {
        if (item.estado !== "2") {
          botones.push({
            tipo: "custom" as const,
            label: item.estado === "1" ? "Desactivar" : "Activar",
            onClick: () => handleStatus(item.key, item.tipo),
            iconoPersonalizado: loadingRow.includes(item.key) ? (
              <SyncOutlined spin />
            ) : (
              <CheckCircleFilled
                style={{
                  color: item.estado === "1" ? "#10B981" : "#EF4444",
                }}
              />
            ),
            color: item.estado === "1" ? "success" : ("danger" as const),
          });
        }
      }

      // Agregar los demás botones que todos pueden ver solo ing, admin y direcotara proyectos
      if (
        user_rol === "Administrador" ||
        user_rol === "Directora Proyectos" ||
        user_rol === "Ingeniero Obra"
      ) {
        botones.push(
          {
            tipo: "custom" as const,
            label: "Tramites",
            onClick: () => {
              navigate("/tramites/documentacion-all");
            },
            iconoPersonalizado: <AiFillCopy />,
            color: "primary" as const,
          },
          {
            tipo: "custom" as const,
            label: "Ver Proceso",
            onClick: () =>
              window.open(
                `${location.pathname}/${
                  item.tipo === "Casa" ? "proceso-casa" : "proceso"
                }/${item.key}`,
                "_self",
              ),
            iconoPersonalizado: <AiOutlineExpandAlt />,
            color: "primary" as const,
          },
          {
            tipo: "custom" as const,
            label: "Informe",
            onClick: () => {},
            iconoPersonalizado:
              item.tipo === "Casa" ? (
                <ModalInformeCasa proyecto={item} />
              ) : (
                <ModalInforme proyecto={item} />
              ),
            color: "default" as const,
          },
          {
            tipo: "custom" as const,
            label: "Historico Porcentajes (no disponible)",
            onClick: () => {},
            iconoPersonalizado:
              item.tipo === "Casa" ? (
                <ModalHisotircoPorcentajes proyecto={item} />
              ) : (
                <ModalHisotircoPorcentajes proyecto={item} />
              ),
            color: "default" as const,
          },
        );
      }

      return botones;
    },
    [handleStatus, loadingRow, location.pathname, user_rol, navigate],
  );

  const renderCardContent = useCallback(
    (item: DataType) => {
      return (
        <div className="card-top-layout">
          {/* --------- FILA SUPERIOR DE CÍRCULOS --------- */}
          <div className="top-circles-row">
            {/* Avance - SIEMPRE mostrar */}
            {renderProgressCircle(item.avance || 0, "#4ADE80", "Avance", false)}

            {/* Atraso - SIEMPRE mostrar */}
            {renderProgressCircle(
              item.porcentaje || 0,
              "#F87171",
              "Atraso",
              false,
            )}

            {/* Documentos - CON NUEVO TOOLTIP DE ETAPAS */}
            {renderDocumentosCircle(item.codigo_proyecto)}

            {/* Organismos - Usar la función existente */}
            {renderOrganismosCircle(item.codigo_proyecto)}
          </div>

          <hr className="divider" />

          {/* --------- INFO DEL PROYECTO --------- */}
          <div className="project-info-block">
            <div className="title-row">
              {["Administrador", "Directora Proyectos"].includes(user_rol) &&
              item.estado === "1" ? (
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

            <div className="text-info">
              <div className="left-info">
                <Typography.Text className="client-text">
                  CLIENTE: {item.emp_nombre || "Sin definir"}
                </Typography.Text>
                <Typography.Text className="engineer-text">
                  INGENIEROS:{" "}
                  {item.nombreIngeniero.toUpperCase() || "Sin asignar"}
                </Typography.Text>
              </div>

              <div className="right-info">
                <Typography.Text className="manager-text">
                  ENCARGADOS:{" "}
                  {item.nombreEncargado.toUpperCase() || "Sin asignar"}
                </Typography.Text>
                <Typography.Text className="code-text">
                  CÓDIGO: {item.codigo_proyecto || "N/A"}
                </Typography.Text>
              </div>
            </div>

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
    },
    [
      renderProgressCircle,
      renderDocumentosCircle,
      renderOrganismosCircle,
      getBotonesAccion,
      location.pathname,
    ],
  );

  if (loading) {
    return (
      <LoadingSpinner
        spinning={true}
        size={40}
        color="#F59E0B"
        backgroundColor="rgb(251 251 251 / 70%)"
      >
        <div style={{ height: "200px" }}></div>
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

          {(user_rol === "Administrador" ||
            user_rol === "Directora Proyectos") && (
            <Link to={`${location.pathname}/create`}>
              <SaveButton text="Crear Proyecto" />
            </Link>
          )}
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
          value={searchValue} // Agregar esta línea
          onChange={(e) => setSearchValue(e.target.value)} // Agregar esta línea
        />

        <div className="filters-section">
          <div className="filter-switch">
            {(user_rol === "Administrador" ||
              user_rol === "Directora Proyectos") && (
              <Switch
                checkedChildren="Activos"
                unCheckedChildren="Inactivos"
                checked={showActiveConvenios}
                onChange={toggleConvenioList}
              />
            )}
          </div>

          <Typography.Text className="total-text">
            Total: {filteredConvenios.length} proyectos
          </Typography.Text>
        </div>
      </div>

      {/* Grid de proyectos */}
      <div className="projects-grid">
        {filteredConvenios.map((item) => (
          <GlobalCard key={item.key} className="project-card">
            {renderCardContent(item)}
          </GlobalCard>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredConvenios.length === 0 && (
        <div className="empty-state">
          <Typography.Text type="secondary">
            {searchValue
              ? `No se encontraron proyectos que coincidan con "${searchValue}"`
              : "No se encontraron proyectos con los filtros aplicados"}
          </Typography.Text>
        </div>
      )}
    </GlobalCard>
  );
};