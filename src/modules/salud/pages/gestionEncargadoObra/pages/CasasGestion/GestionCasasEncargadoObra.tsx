// import {
//   Card,
//   Select,
//   Typography,
//   Button,
//   Row,
//   Col,
//   Modal,
//   Tag,
//   Divider,
//   Space,
//   Alert,
//   notification,
//   Popconfirm,
//   Tooltip,
//   Spin,
// } from "antd";
// import { useState, useMemo, useEffect } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
// import {
//   confirmarCasaGestion,
//   getProyectoDetalleGestionCasa,
//   InfoProyectoCasa,
//   confirmarValidacionCasa,
//   IniciarManzana,
// } from "@/services/proyectos/casasProyectosAPI";
// import { AiOutlineCheckCircle } from "react-icons/ai";

// const { Title, Text } = Typography;

// export const GestionCasasEncargadoObra = () => {
//   // 📌 Recibimos los datos que envía ResumenManzanas
//   const { state } = useLocation();
//   const { manzana } = state || {};
//   const { id } = useParams<{ id: string }>();

//   const [manzanaSeleccionada, setManzanaSeleccionada] = useState<string | null>(
//     manzana
//   );
//   const [filtroProceso, setFiltroProceso] = useState("");
//   const [filtroEtapa, setFiltroEtapa] = useState("");
//   const [porcetanjeManzana, setPorcetanjeManzana] = useState<any>({});
//   const [loading, setLoading] = useState(false);
//   const [infoProyecto, setInfoProyecto] = useState<any>({});
//   const [data, setData] = useState<any>({});
//   const [procesoAValidar, setProcesoAValidar] = useState<any>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   // Modal de info de procesos

//   const manzanasUnicas = Object.keys(data || {});

//   //llamado de data para el detalle de las casas
//   useEffect(() => {
//     LlamadoData();
//     InfoProyectoCasa(Number(id)).then(({ data: { data } }) => {
//       setInfoProyecto(data);
//     });
//   }, [id]);

//   const LlamadoData = () => {
//     setLoading(true);
//     getProyectoDetalleGestionCasa(Number(id)).then(({ data }) => {
//       setData(data.data);
//       setPorcetanjeManzana(data.manzanaResumen);
//       setLoading(false);
//     });
//   };

//   // Obtener todas las etapas únicas para el filtro
//   const todasEtapas = useMemo(() => {
//     if (!manzanaSeleccionada || !data[manzanaSeleccionada]) return [];

//     const etapasSet = new Set();
//     Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
//       Object.values(casa.pisos || {}).forEach((piso: any) => {
//         Object.keys(piso).forEach((etapaKey) => {
//           etapasSet.add(etapaKey);
//         });
//       });
//     });

//     return Array.from(etapasSet).map((etapa) => ({
//       label: `Etapa ${etapa}`,
//       value: etapa,
//     }));
//   }, [manzanaSeleccionada, data]);

//   // Obtener procesos únicos para la etapa seleccionada
//   const procesosPorEtapa = useMemo(() => {
//     if (!manzanaSeleccionada || !data[manzanaSeleccionada] || !filtroEtapa)
//       return [];

//     const procesosSet = new Set();
//     Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
//       Object.values(casa.pisos || {}).forEach((piso: any) => {
//         // Solo buscar procesos en la etapa seleccionada
//         if (piso[filtroEtapa]) {
//           Object.values(piso[filtroEtapa]).forEach((proceso: any) => {
//             procesosSet.add(proceso.nombre_proceso);
//           });
//         }
//       });
//     });

//     return Array.from(procesosSet);
//   }, [manzanaSeleccionada, data, filtroEtapa]);

//   // Verificar si hay filtros aplicados
//   const hayFiltrosAplicados = useMemo(() => {
//     return filtroEtapa !== "";
//   }, [filtroEtapa]);

//   // Filtrar datos según el proceso y etapa seleccionados
//   const datosFiltrados = useMemo(() => {
//     if (!manzanaSeleccionada || !data[manzanaSeleccionada] || !filtroEtapa) {
//       return {};
//     }

//     const casasFiltradas = { ...data[manzanaSeleccionada] };

//     Object.keys(casasFiltradas).forEach((casaKey) => {
//       const casa = { ...casasFiltradas[casaKey] };
//       const pisosFiltrados = {};

//       Object.keys(casa.pisos || {}).forEach((pisoKey) => {
//         const etapasFiltradas = {};

//         Object.entries(casa.pisos[pisoKey]).forEach(
//           ([etapaKey, etapa]: any) => {
//             // Solo procesamos la etapa seleccionada
//             if (etapaKey !== filtroEtapa) return;

//             const procesosFiltrados = {};

//             Object.entries(etapa).forEach(([procesoId, proceso]: any) => {
//               // Si hay filtro de proceso, solo mostramos procesos que coincidan
//               if (!filtroProceso || proceso.nombre_proceso === filtroProceso) {
//                 procesosFiltrados[procesoId] = proceso;
//               }
//             });

//             if (Object.keys(procesosFiltrados).length > 0) {
//               etapasFiltradas[etapaKey] = procesosFiltrados;
//             }
//           }
//         );

//         if (Object.keys(etapasFiltradas).length > 0) {
//           pisosFiltrados[pisoKey] = etapasFiltradas;
//         }
//       });

//       casa.pisos = pisosFiltrados;
//       casasFiltradas[casaKey] = casa;
//     });

//     return casasFiltradas;
//   }, [manzanaSeleccionada, data, filtroProceso, filtroEtapa]);

//   // Función para obtener el color del estado basado en el valor de la data
//   const getColorEstado = (estado: string) => {
//     switch (estado) {
//       case "2":
//         return "green"; // Completado - Verde
//       case "1":
//         return "blue"; // En progreso - Azul
//       case "0":
//         return "default"; // Pendiente - Gris
//       default:
//         return "default"; // Por defecto - Gris
//     }
//   };

//   // Función para obtener el texto del estado basado en el valor de the data
//   const getTextoEstado = (estado: string) => {
//     switch (estado) {
//       case "2":
//         return "Completado";
//       case "1":
//         return "Habilitado";
//       case "0":
//         return "Pendiente";
//       default:
//         return "Desconocido";
//     }
//   };

//   // Función para obtener el color de la etapa
//   const getColorEtapa = (etapa: string) => {
//     switch (etapa) {
//       case "1":
//         return "blue";
//       case "2":
//         return "green";
//       default:
//         return "default";
//     }
//   };

//   // Limpiar todos los filtros
//   const limpiarFiltros = () => {
//     setFiltroEtapa("");
//     setFiltroProceso("");
//   };

//   // Manejar cambio de etapa
//   const manejarCambioEtapa = (valor: string) => {
//     setFiltroEtapa(valor);
//     setFiltroProceso(""); // Resetear filtro de proceso al cambiar etapa
//   };

//   // Confirmar proceso de casa
//   // Confirmar proceso de casa
//   const confirmarProceso = async (procesoId: string) => {
//     try {
//       // Enviar tanto el procesoId como el casaId
//       const response = await confirmarCasaGestion(procesoId);

//       if (response.data.needs_validation) {
//         // Buscar el proceso que necesita validación
//         let procesoValidacion = null;

//         Object.values(data[manzanaSeleccionada] || {}).forEach((casa: any) => {
//           Object.values(casa.pisos || {}).forEach((piso: any) => {
//             Object.values(piso).forEach((etapa: any) => {
//               Object.values(etapa).forEach((proceso: any) => {
//                 if (proceso.id === response.data.next_process_id) {
//                   procesoValidacion = proceso;
//                 }
//               });
//             });
//           });
//         });

//         if (procesoValidacion) {
//           setProcesoAValidar({
//             ...procesoValidacion,
//             proceso_actual_id: procesoId,
//           });
//           setModalVisible(true);
//         }
//       } else {
//         notification.success({
//           message: "Proceso confirmado",
//           placement: "topRight",
//           duration: 4,
//         });
//       }
//       LlamadoData();
//     } catch (error: any) {
//       notification.error({
//         message: "Error al confirmar proceso",
//         description: error.response?.data?.message || "Error desconocido",
//         placement: "topRight",
//         duration: 4,
//       });
//     }
//   };

//   // Validar proceso
//   const handleValidarProceso = async () => {
//     if (!procesoAValidar || !manzanaSeleccionada ) return;

//     try {
//       const response = await confirmarValidacionCasa({
//         manzana: manzanaSeleccionada,
//         casa_id: procesoAValidar.id,
//         proyecto: infoProyecto.id,
//       });

//       if (response.status) {
//         notification.success({
//           message: "Proceso validado exitosamente",
//           placement: "topRight",
//           duration: 5,
//         });
//         setModalVisible(false);
//         LlamadoData();
//       } else {
//         notification.error({
//           message: response.data?.message || "Error al validar",
//           placement: "topRight",
//           duration: 12,
//         });
//         setModalVisible(false);
//         LlamadoData();
//       }
//     } catch (error: any) {
//       notification.error({
//         message: "Error al validar proceso",
//         description: error.response?.data?.message || "Error desconocido",
//         placement: "topRight",
//         duration: 12,
//       });
//       setModalVisible(false);
//       LlamadoData();
//     }
//   };


//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "50vh",
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     );
//   }

//   //iniciar manzana
//   const iniciarManzana = async () => {
//     if (!manzanaSeleccionada) {
//       notification.error({
//         message: "Debes seleccionar una torre antes de iniciar.",
//         placement: "topRight",
//       });
//       return;
//     }

//     const dataIniciarTorre = {
//       proyecto: id,
//       manzana: manzanaSeleccionada,
//     };

//     try {
//       await IniciarManzana(dataIniciarTorre);
//       notification.success({
//         message: "Manzana iniciada exitosamente",
//         placement: "topRight",
//       });
//     } catch (error: any) {
//       notification.error({
//         message: "Error al iniciar manzana",
//         description: error?.response?.data?.message || error.message,
//         placement: "topRight",
//       });
//     } finally {
//       LlamadoData();
//     }
//   };

//   // Ver si la manzana ya se inició
//   const manzanaYaIniciada = () => {
//     if (!manzanaSeleccionada) return false;

//     const torres = data[manzanaSeleccionada];
//     if (!torres) return false;

//     // Recorremos cada torre dentro de la manzana
//     for (const torre of Object.values(torres)) {
//       const pisos = (torre as any).pisos;
//       if (!pisos) continue;

//       // Recorremos cada piso
//       for (const piso of Object.values(pisos)) {
//         // Recorremos cada apartamento/proceso
//         for (const aptos of Object.values(piso as any)) {
//           for (const proceso of Object.values(aptos as any)) {
//             if ((proceso as any).estado !== "0") {
//               return true; // Si hay alguno distinto de 0 → manzana ya iniciada
//             }
//           }
//         }
//       }
//     }

//     return false; // Ningún proceso iniciado en la manzana
//   };

//   return (
//     <>
//       <div
//         style={{
//           padding: "24px",
//           maxWidth: "1400px",
//           margin: "0 auto",
//           background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
//           minHeight: "100vh",
//         }}
//       >
//         <div style={{ marginBottom: 15, textAlign: "right" }}>
//           <Link to="../.." relative="path">
//             <Button danger type="primary" icon={<ArrowLeftOutlined />}>
//               Volver
//             </Button>
//           </Link>
//         </div>

//         {/* Header Section */}
//         <div
//           style={{
//             background: "rgba(255, 255, 255, 0.8)",
//             backdropFilter: "blur(8px)",
//             padding: "24px",
//             borderRadius: "16px",
//             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
//             marginBottom: "32px",
//           }}
//         >
//           <Title
//             level={3}
//             style={{
//               margin: 0,
//               color: "#1a1a1a",
//               fontWeight: 600,
//               display: "flex",
//               alignItems: "center",
//               gap: "12px",
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-block",
//                 width: "8px",
//                 height: "32px",
//                 background: "linear-gradient(to bottom, #1890ff, #36cfc9)",
//                 borderRadius: "4px",
//               }}
//             ></span>
//             Visual del Proyecto: {infoProyecto?.descripcion_proyecto}
//           </Title>
//           <Text type="secondary" style={{ marginLeft: "20px" }}>
//             ID: {id} | Seleccione una manzana para gestionar
//           </Text>
//         </div>

//         {/* Selección de Manzana y Filtro */}
//         <Card
//           style={{
//             marginBottom: "32px",
//             borderRadius: "16px",
//             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//             border: "none",
//             background: "rgba(255, 255, 255, 0.8)",
//             backdropFilter: "blur(8px)",
//             position: "sticky",
//             top: 60,
//             zIndex: 100,
//           }}
//         >
//           <Row gutter={[16, 16]} align="middle">
//             {/* Columna izquierda: Select de Manzana */}
//             <Col xs={24} sm={12} md={8} lg={6}>
//               <Select
//                 placeholder="Seleccione una manzana"
//                 style={{ width: "100%" }}
//                 onChange={(value) => {
//                   setManzanaSeleccionada(value);
//                   limpiarFiltros(); // Resetear filtros al cambiar manzana
//                 }}
//                 value={manzanaSeleccionada}
//                 options={manzanasUnicas.map((manzana) => ({
//                   label:
//                     porcetanjeManzana[manzana]?.nombre_manzana ||
//                     `Manzana ${manzana}`,
//                   value: manzana,
//                 }))}
//                 size="large"
//               />
//             </Col>

//             {/* Filtro por Etapa (obligatorio) */}
//             <Col xs={24} sm={12} md={8} lg={6}>
//               <Select
//                 placeholder="Seleccione una etapa*"
//                 style={{ width: "100%" }}
//                 value={filtroEtapa}
//                 onChange={manejarCambioEtapa}
//                 allowClear
//                 suffixIcon={<FilterOutlined />}
//                 size="large"
//                 options={todasEtapas}
//                 disabled={!manzanaSeleccionada}
//               />
//             </Col>

//             {/* Filtro por Proceso (opcional) - Solo procesos de la etapa seleccionada */}
//             <Col xs={24} sm={12} md={8} lg={6}>
//               <Select
//                 placeholder={
//                   filtroEtapa
//                     ? "Filtrar por proceso (opcional)"
//                     : "Primero seleccione una etapa"
//                 }
//                 style={{ width: "100%" }}
//                 value={filtroProceso}
//                 onChange={setFiltroProceso}
//                 allowClear
//                 suffixIcon={<FilterOutlined />}
//                 size="large"
//                 options={procesosPorEtapa.map((proceso: any) => ({
//                   label: proceso,
//                   value: proceso,
//                 }))}
//                 disabled={!manzanaSeleccionada || !filtroEtapa}
//               />
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={6} style={{ textAlign: "right" }}>
//               <Space>
//                 {hayFiltrosAplicados && (
//                   <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
//                 )}
//                 <Button
//                   type="primary"
//                   size="large"
//                   onClick={iniciarManzana}
//                   disabled={
//                     !manzanaSeleccionada || manzanaYaIniciada() /* ||
//                     !["Encargado Obras"].includes(user_rol) */
//                   }
//                   style={{
//                     background: manzanaYaIniciada() ? "#52c41a" : "#1890ff",
//                     border: "none",
//                     borderRadius: "8px",
//                     fontWeight: 500,
//                     boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
//                     height: "40px",
//                     padding: "0 24px",
//                   }}
//                 >
//                   {manzanaYaIniciada() ? "Manaza Iniciada" : "Iniciar Manaza"}
//                 </Button>
//               </Space>
//             </Col>
//           </Row>
//         </Card>

//         {/* Mostrar contenido solo cuando hay una etapa seleccionada */}
//         {hayFiltrosAplicados && (
//           <div>
//             {/* Resumen de filtros aplicados */}
//             <Alert
//               message={
//                 <span>
//                   <Text strong>Filtros aplicados: </Text>
//                   <Tag color="blue" style={{ marginLeft: 8 }}>
//                     Etapa: {filtroEtapa}
//                   </Tag>
//                   {filtroProceso && (
//                     <Tag color="green" style={{ marginLeft: 8 }}>
//                       Proceso: {filtroProceso}
//                     </Tag>
//                   )}
//                 </span>
//               }
//               type="info"
//               style={{ marginBottom: 16 }}
//               closable
//               onClose={limpiarFiltros}
//             />

//             {/* Lista de Casas - Cartas con diseño mejorado */}
//             {Object.keys(datosFiltrados).length > 0 ? (
//               <Row gutter={[16, 16]}>
//                 {Object.entries(datosFiltrados).map(
//                   ([casaKey, casaContenido]: any) => (
//                     <Col xs={24} sm={12} md={8} lg={6} key={casaKey}>
//                       <Card
//                         style={{
//                           borderRadius: "12px",
//                           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                           border: "1px solid #f0f0f0",
//                           background: "#ffffff",
//                           height: "100%",
//                           transition: "all 0.3s ease",
//                         }}
//                         bodyStyle={{
//                           padding: "16px",
//                         }}
//                         hoverable
//                       >
//                         {/* Header de la Casa */}
//                         <div
//                           style={{
//                             textAlign: "center",
//                             marginBottom: "16px",
//                             padding: "5px",
//                             background:
//                               "linear-gradient(135deg, #1890ff, #36cfc9)",
//                             borderRadius: "8px",
//                             color: "white",
//                           }}
//                         >
//                           <Title
//                             level={4}
//                             style={{ margin: 0, color: "white" }}
//                           >
//                             Casa {casaContenido.consecutivo}
//                           </Title>
//                         </div>

//                         {/* Pisos de la casa - Ordenados de mayor a menor (PISO 2, PISO 1) */}
//                         {Object.entries(casaContenido.pisos || {})
//                           .sort((a, b) => Number(b[0]) - Number(a[0]))
//                           .map(([pisoKey, etapas]: any) => (
//                             <div key={pisoKey} style={{ marginBottom: "20px" }}>
//                               {/* Header del Piso */}
//                               <div
//                                 style={{
//                                   background: "#f5f5f5",
//                                   padding: "8px 12px",
//                                   borderRadius: "6px",
//                                   marginBottom: "12px",
//                                   borderLeft: "4px solid #1890ff",
//                                 }}
//                               >
//                                 <Text
//                                   strong
//                                   style={{
//                                     color: "#595959",
//                                     fontSize: "14px",
//                                   }}
//                                 >
//                                   PISO {pisoKey}
//                                 </Text>
//                               </div>

//                               {/* Etapas del piso */}
//                               {Object.entries(etapas).map(
//                                 ([etapaKey, procesos]: any) => (
//                                   <div
//                                     key={etapaKey}
//                                     style={{ marginBottom: "16px" }}
//                                   >
//                                     {/* Header de la Etapa */}
//                                     <Divider
//                                       orientation="left"
//                                       orientationMargin="0"
//                                     >
//                                       <Tag
//                                         color={getColorEtapa(etapaKey)}
//                                         style={{
//                                           fontSize: "12px",
//                                           padding: "4px 8px",
//                                         }}
//                                       >
//                                         Etapa {etapaKey}
//                                       </Tag>
//                                     </Divider>

//                                     {/* Procesos de la etapa */}
//                                     {Object.entries(procesos).map(
//                                       ([procesoId, proceso]: any) => {
//                                         const necesitaValidacion =
//                                           Number(proceso.validacion) === 1;
//                                         const estaValidado =
//                                           Number(proceso.estado_validacion) ===
//                                           1;

//                                         return (
//                                           <div
//                                             key={procesoId}
//                                             style={{
//                                               padding: "12px",
//                                               background: "#fafafa",
//                                               borderRadius: "8px",
//                                               marginBottom: "12px",
//                                               border: "1px solid #e8e8e8",
//                                             }}
//                                           >
//                                             {/* Nombre del proceso y estado con botón de confirmación integrado */}
//                                             <div
//                                               style={{
//                                                 display: "flex",
//                                                 justifyContent: "space-between",
//                                                 alignItems: "center",
//                                                 marginBottom: "8px",
//                                               }}
//                                             >
//                                               <Text
//                                                 strong
//                                                 style={{
//                                                   fontSize: "14px",
//                                                   color: "#262626",
//                                                 }}
//                                               >
//                                                 {proceso.nombre_proceso}
//                                               </Text>

//                                               <div
//                                                 style={{
//                                                   display: "flex",
//                                                   alignItems: "center",
//                                                   gap: "8px",
//                                                 }}
//                                               >
//                                                 {/* Botón de confirmación integrado en el Tag */}
//                                                 {proceso.estado === "1" ? (
//                                                   <Popconfirm
//                                                     title="¿Estás seguro de que deseas confirmar este proceso?"
//                                                     onConfirm={() =>
//                                                       confirmarProceso(
//                                                         proceso.id,
//                                                         casaContenido.id
//                                                       )
//                                                     }
//                                                     okText="Sí"
//                                                     cancelText="No"
//                                                   >
//                                                     <Tag
//                                                       color={getColorEstado(
//                                                         proceso.estado
//                                                       )}
//                                                       style={{
//                                                         cursor: "pointer",
//                                                         fontSize: "12px",
//                                                         padding: "4px 8px",
//                                                         borderRadius: "12px",
//                                                         display: "flex",
//                                                         alignItems: "center",
//                                                         gap: "4px",
//                                                       }}
//                                                     >
//                                                       {getTextoEstado(
//                                                         proceso.estado
//                                                       )}
//                                                       <AiOutlineCheckCircle />
//                                                     </Tag>
//                                                   </Popconfirm>
//                                                 ) : (
//                                                   <Tag
//                                                     color={getColorEstado(
//                                                       proceso.estado
//                                                     )}
//                                                     style={{
//                                                       fontSize: "12px",
//                                                       padding: "4px 8px",
//                                                       borderRadius: "12px",
//                                                     }}
//                                                   >
//                                                     {getTextoEstado(
//                                                       proceso.estado
//                                                     )}
//                                                   </Tag>
//                                                 )}

//                                                 {/* Indicador de validación pendiente */}
//                                                 {necesitaValidacion &&
//                                                   !estaValidado && (
//                                                     <span
//                                                       style={{
//                                                         background: "#ff4d4f",
//                                                         borderRadius: "50%",
//                                                         width: 8,
//                                                         height: 8,
//                                                         display: "inline-block",
//                                                       }}
//                                                     />
//                                                   )}
//                                               </div>
//                                             </div>

//                                             {/* Botón de validación (solo para procesos que necesitan validación) */}

//                                             {/* Información adicional */}
//                                             <div
//                                               style={{
//                                                 borderTop: "1px dashed #e8e8e8",
//                                                 paddingTop: "8px",
//                                                 marginTop: "8px",
//                                                 display: "flex", // Flex para que estén uno al lado del otro
//                                                 justifyContent: "space-between",
//                                                 alignItems: "center",
//                                               }}
//                                             >
//                                               {proceso.validacion === 1 && (
//                                                 <Text
//                                                   type="secondary"
//                                                   style={{
//                                                     fontSize: "12px",
//                                                   }}
//                                                 >
//                                                   {proceso.estado_validacion ===
//                                                   1
//                                                     ? "✅ Validado"
//                                                     : "⏳ Pendiente validación"}
//                                                 </Text>
//                                               )}

//                                               {proceso.validacion === 1 &&
//                                                 proceso.estado_validacion ===
//                                                   0 && (
//                                                   <Tooltip title="Validar proceso">
//                                                     <Button
//                                                       type="primary"
//                                                       size="small"
//                                                       onClick={() => {
//                                                         setProcesoAValidar({
//                                                           ...proceso,
//                                                           proceso_actual_id:
//                                                             proceso.id,
//                                                         });
//                                                         setModalVisible(true);
//                                                       }}
//                                                       icon={
//                                                         <AiOutlineCheckCircle />
//                                                       }
//                                                     >
//                                                     </Button>
//                                                   </Tooltip>
//                                                 )}
//                                             </div>
//                                           </div>
//                                         );
//                                       }
//                                     )}
//                                   </div>
//                                 )
//                               )}
//                             </div>
//                           ))}
//                       </Card>
//                     </Col>
//                   )
//                 )}
//               </Row>
//             ) : (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: "40px",
//                   background: "rgba(255, 255, 255, 0.8)",
//                   borderRadius: "12px",
//                   border: "2px dashed #d9d9d9",
//                 }}
//               >
//                 <Title
//                   level={4}
//                   style={{ color: "#8c8c8c", marginBottom: "16px" }}
//                 >
//                   No se encontraron resultados para los filtros aplicados
//                 </Title>
//                 <Text
//                   type="secondary"
//                   style={{ display: "block", marginBottom: "16px" }}
//                 >
//                   {filtroProceso
//                     ? `No hay procesos "${filtroProceso}" en la etapa ${filtroEtapa}`
//                     : `No hay procesos en la etapa ${filtroEtapa}`}
//                 </Text>
//                 <Button
//                   type="primary"
//                   onClick={limpiarFiltros}
//                   style={{ marginTop: "16px" }}
//                 >
//                   Limpiar filtros
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Mensaje cuando no hay filtros aplicados */}
//         {!hayFiltrosAplicados && manzanaSeleccionada && (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px",
//               background: "rgba(255, 255, 255, 0.8)",
//               borderRadius: "12px",
//               border: "2px dashed #d9d9d9",
//             }}
//           >
//             <Title level={4} style={{ color: "#8c8c8c", marginBottom: "16px" }}>
//               Seleccione una etapa para visualizar los procesos
//             </Title>
//             <Text
//               type="secondary"
//               style={{
//                 fontSize: "16px",
//                 display: "block",
//                 marginBottom: "16px",
//               }}
//             >
//               El filtro de etapa es obligatorio para mostrar la información
//             </Text>
//             <div style={{ marginTop: 24 }}>
//               <Text strong style={{ display: "block", marginBottom: 8 }}>
//                 Opciones de filtrado:
//               </Text>
//               <div
//                 style={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}
//               >
//                 <ul>
//                   <li>Seleccione una etapa para ver todos sus procesos</li>
//                   <li>
//                     Luego puede filtrar adicionalmente por un proceso específico
//                     de esa etapa
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Mensaje cuando no hay manzana seleccionada */}
//         {!manzanaSeleccionada && (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px",
//               background: "rgba(255, 255, 255, 0.8)",
//               borderRadius: "12px",
//               border: "2px dashed #d9d9d9",
//             }}
//           >
//             <Title level={4} style={{ color: "#8c8c8c", marginBottom: "16px" }}>
//               Seleccione una manzana para visualizar la información
//             </Title>
//             <Text type="secondary" style={{ fontSize: "16px" }}>
//               Use el menú desplegable de "Seleccione una manzana" para comenzar
//             </Text>
//           </div>
//         )}
//       </div>

//       {/* Modal de Validación */}
//       <Modal
//         visible={modalVisible}
//         title={"Validar proceso " + (procesoAValidar?.nombre_proceso || "")}
//         onOk={handleValidarProceso}
//         onCancel={() => {
//           setModalVisible(false);
//         }}
//         okText="Validar"
//         cancelText="Cancelar"
//       >
//         <p>
//           ¿Confirmas que esta validación se cumple en este piso:{" "}
//           <strong>
//             {procesoAValidar?.text_validacion?.toUpperCase() || ""}
//           </strong>
//           ?
//         </p>
        
//       </Modal>
//     </>
//   );
// };
import {
  Card,
  Select,
  Typography,
  Button,
  Row,
  Col,
  Modal,
  Tag,
  Divider,
  Space,
  Alert,
  notification,
  Popconfirm,
  Tooltip,
  Spin,
} from "antd";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
import {
  confirmarCasaGestion,
  getProyectoDetalleGestionCasa,
  InfoProyectoCasa,
  confirmarValidacionCasa,
  IniciarManzana,
} from "@/services/proyectos/casasProyectosAPI";
import { AiOutlineCheckCircle } from "react-icons/ai";

const { Title, Text } = Typography;

export const GestionCasasEncargadoObra = () => {
  // 📌 Recibimos los datos que envía ResumenManzanas
  const { state } = useLocation();
  const { manzana } = state || {};
  const { id } = useParams<{ id: string }>();

  const [manzanaSeleccionada, setManzanaSeleccionada] = useState<string | null>(
    manzana
  );
  const [filtroProceso, setFiltroProceso] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [filtroCasa, setFiltroCasa] = useState(""); // Nuevo filtro por casa
  const [porcetanjeManzana, setPorcetanjeManzana] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [procesoAValidar, setProcesoAValidar] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const manzanasUnicas = Object.keys(data || {});

  //llamado de data para el detalle de las casas
  useEffect(() => {
    LlamadoData();
    InfoProyectoCasa(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestionCasa(Number(id)).then(({ data }) => {
      setData(data.data);
      setPorcetanjeManzana(data.manzanaResumen);
      setLoading(false);
    });
  };

  // Obtener todas las casas únicas para el filtro (por consecutivo)
  const casasUnicas = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada]) return [];

    const consecutivosSet = new Set();
    const casas = [];

    Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
      if (!consecutivosSet.has(casa.consecutivo)) {
        consecutivosSet.add(casa.consecutivo);
        casas.push({
          label: `Casa ${casa.consecutivo}`,
          value: casa.consecutivo.toString(), // Usar el consecutivo como valor
        });
      }
    });

    // Ordenar por número de casa
    return casas.sort((a, b) => parseInt(a.value) - parseInt(b.value));
  }, [manzanaSeleccionada, data]);

  // Obtener todas las etapas únicas para el filtro
  const todasEtapas = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada]) return [];

    const etapasSet = new Set();
    Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
      // Si hay filtro de casa, solo buscar en esa casa
      if (filtroCasa && casa.consecutivo.toString() !== filtroCasa) return;
      
      Object.values(casa.pisos || {}).forEach((piso: any) => {
        Object.keys(piso).forEach((etapaKey) => {
          etapasSet.add(etapaKey);
        });
      });
    });

    return Array.from(etapasSet).map((etapa) => ({
      label: `Etapa ${etapa}`,
      value: etapa,
    }));
  }, [manzanaSeleccionada, data, filtroCasa]);

  // Obtener procesos únicos para la etapa seleccionada
  const procesosPorEtapa = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada] || !filtroEtapa)
      return [];

    const procesosSet = new Set();
    Object.values(data[manzanaSeleccionada]).forEach((casa: any) => {
      // Si hay filtro de casa, solo buscar en esa casa
      if (filtroCasa && casa.consecutivo.toString() !== filtroCasa) return;
      
      Object.values(casa.pisos || {}).forEach((piso: any) => {
        // Solo buscar procesos en la etapa seleccionada
        if (piso[filtroEtapa]) {
          Object.values(piso[filtroEtapa]).forEach((proceso: any) => {
            procesosSet.add(proceso.nombre_proceso);
          });
        }
      });
    });

    return Array.from(procesosSet);
  }, [manzanaSeleccionada, data, filtroEtapa, filtroCasa]);

  // Verificar si hay filtros aplicados
  const hayFiltrosAplicados = useMemo(() => {
    return filtroEtapa !== "" || filtroCasa !== "" || filtroProceso !== "";
  }, [filtroEtapa, filtroCasa, filtroProceso]);

  // Filtrar datos según los filtros seleccionados
  const datosFiltrados = useMemo(() => {
    if (!manzanaSeleccionada || !data[manzanaSeleccionada]) {
      return {};
    }

    const casasFiltradas = { ...data[manzanaSeleccionada] };

    Object.keys(casasFiltradas).forEach((casaKey) => {
      const casa = { ...casasFiltradas[casaKey] };
      
      // Aplicar filtro por casa (por consecutivo)
      if (filtroCasa && casa.consecutivo.toString() !== filtroCasa) {
        delete casasFiltradas[casaKey];
        return;
      }

      // Si no hay etapa seleccionada, mostrar todas las etapas
      if (!filtroEtapa) {
        return; // Mantener toda la casa sin filtrar por etapa
      }

      const pisosFiltrados = {};

      Object.keys(casa.pisos || {}).forEach((pisoKey) => {
        const etapasFiltradas = {};

        Object.entries(casa.pisos[pisoKey]).forEach(
          ([etapaKey, etapa]: any) => {
            // Solo procesamos la etapa seleccionada
            if (etapaKey !== filtroEtapa) return;

            const procesosFiltrados = {};

            Object.entries(etapa).forEach(([procesoId, proceso]: any) => {
              // Si hay filtro de proceso, solo mostramos procesos que coincidan
              if (!filtroProceso || proceso.nombre_proceso === filtroProceso) {
                procesosFiltrados[procesoId] = proceso;
              }
            });

            if (Object.keys(procesosFiltrados).length > 0) {
              etapasFiltradas[etapaKey] = procesosFiltrados;
            }
          }
        );

        if (Object.keys(etapasFiltradas).length > 0) {
          pisosFiltrados[pisoKey] = etapasFiltradas;
        }
      });

      casa.pisos = pisosFiltrados;
      casasFiltradas[casaKey] = casa;
    });

    return casasFiltradas;
  }, [manzanaSeleccionada, data, filtroProceso, filtroEtapa, filtroCasa]);

  // Función para obtener el color del estado basado en el valor de la data
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "2":
        return "green"; // Completado - Verde
      case "1":
        return "blue"; // En progreso - Azul
      case "0":
        return "default"; // Pendiente - Gris
      default:
        return "default"; // Por defecto - Gris
    }
  };

  // Función para obtener el texto del estado basado en el valor de the data
  const getTextoEstado = (estado: string) => {
    switch (estado) {
      case "2":
        return "Completado";
      case "1":
        return "Habilitado";
      case "0":
        return "Pendiente";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener el color de la etapa
  const getColorEtapa = (etapa: string) => {
    switch (etapa) {
      case "1":
        return "blue";
      case "2":
        return "green";
      default:
        return "default";
    }
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroEtapa("");
    setFiltroProceso("");
    setFiltroCasa("");
  };

  // Manejar cambio de etapa
  const manejarCambioEtapa = (valor: string) => {
    setFiltroEtapa(valor);
    setFiltroProceso(""); // Resetear filtro de proceso al cambiar etapa
  };

  // Manejar cambio de manzana
  const manejarCambioManzana = (valor: string) => {
    setManzanaSeleccionada(valor);
    limpiarFiltros(); // Resetear todos los filtros al cambiar manzana
  };

  // Confirmar proceso de casa
  const confirmarProceso = async (procesoId: string) => {
    try {
      const response = await confirmarCasaGestion(procesoId);

      if (response.data.needs_validation) {
        // Buscar el proceso que necesita validación
        let procesoValidacion = null;

        Object.values(data[manzanaSeleccionada] || {}).forEach((casa: any) => {
          Object.values(casa.pisos || {}).forEach((piso: any) => {
            Object.values(piso).forEach((etapa: any) => {
              Object.values(etapa).forEach((proceso: any) => {
                if (proceso.id === response.data.next_process_id) {
                  procesoValidacion = proceso;
                }
              });
            });
          });
        });

        if (procesoValidacion) {
          setProcesoAValidar({
            ...procesoValidacion,
            proceso_actual_id: procesoId,
          });
          setModalVisible(true);
        }
      } else {
        notification.success({
          message: "Proceso confirmado",
          placement: "topRight",
          duration: 4,
        });
      }
      LlamadoData();
    } catch (error: any) {
      notification.error({
        message: "Error al confirmar proceso",
        description: error.response?.data?.message || "Error desconocido",
        placement: "topRight",
        duration: 4,
      });
    }
  };

  // Validar proceso
  const handleValidarProceso = async () => {
    if (!procesoAValidar || !manzanaSeleccionada ) return;

    try {
      const response = await confirmarValidacionCasa({
        manzana: manzanaSeleccionada,
        casa_id: procesoAValidar.id,
        proyecto: infoProyecto.id,
      });

      if (response.status) {
        notification.success({
          message: "Proceso validado exitosamente",
          placement: "topRight",
          duration: 5,
        });
        setModalVisible(false);
        LlamadoData();
      } else {
        notification.error({
          message: response.data?.message || "Error al validar",
          placement: "topRight",
          duration: 12,
        });
        setModalVisible(false);
        LlamadoData();
      }
    } catch (error: any) {
      notification.error({
        message: "Error al validar proceso",
        description: error.response?.data?.message || "Error desconocido",
        placement: "topRight",
        duration: 12,
      });
      setModalVisible(false);
      LlamadoData();
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  //iniciar manzana
  const iniciarManzana = async () => {
    if (!manzanaSeleccionada) {
      notification.error({
        message: "Debes seleccionar una manzana antes de iniciar.",
        placement: "topRight",
      });
      return;
    }

    const dataIniciarTorre = {
      proyecto: id,
      manzana: manzanaSeleccionada,
    };

    try {
      await IniciarManzana(dataIniciarTorre);
      notification.success({
        message: "Manzana iniciada exitosamente",
        placement: "topRight",
      });
    } catch (error: any) {
      notification.error({
        message: "Error al iniciar manzana",
        description: error?.response?.data?.message || error.message,
        placement: "topRight",
      });
    } finally {
      LlamadoData();
    }
  };

  // Ver si la manzana ya se inició
  const manzanaYaIniciada = () => {
    if (!manzanaSeleccionada) return false;

    const torres = data[manzanaSeleccionada];
    if (!torres) return false;

    // Recorremos cada torre dentro de la manzana
    for (const torre of Object.values(torres)) {
      const pisos = (torre as any).pisos;
      if (!pisos) continue;

      // Recorremos cada piso
      for (const piso of Object.values(pisos)) {
        // Recorremos cada apartamento/proceso
        for (const aptos of Object.values(piso as any)) {
          for (const proceso of Object.values(aptos as any)) {
            if ((proceso as any).estado !== "0") {
              return true; // Si hay alguno distinto de 0 → manzana ya iniciada
            }
          }
        }
      }
    }

    return false; // Ningún proceso iniciado en la manzana
  };

  return (
    <>
      <div
        style={{
          padding: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
          minHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: 15, textAlign: "right" }}>
          <Link to="../.." relative="path">
            <Button danger type="primary" icon={<ArrowLeftOutlined />}>
              Volver
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "32px",
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#1a1a1a",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "32px",
                background: "linear-gradient(to bottom, #1890ff, #36cfc9)",
                borderRadius: "4px",
              }}
            ></span>
            Visual del Proyecto: {infoProyecto?.descripcion_proyecto}
          </Title>
          <Text type="secondary" style={{ marginLeft: "20px" }}>
            ID: {id} | Seleccione una manzana para gestionar
          </Text>
        </div>

        {/* Selección de Manzana y Filtros */}
        <Card
          style={{
            marginBottom: "32px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "none",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 60,
            zIndex: 100,
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            {/* Columna 1: Select de Manzana */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Select
                placeholder="Seleccione una manzana"
                style={{ width: "100%" }}
                onChange={manejarCambioManzana}
                value={manzanaSeleccionada}
                options={manzanasUnicas.map((manzana) => ({
                  label:
                    porcetanjeManzana[manzana]?.nombre_manzana ||
                    `Manzana ${manzana}`,
                  value: manzana,
                }))}
                size="large"
              />
            </Col>

            {/* Columna 2: Filtro por Casa */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Select
                placeholder="Filtrar por casa"
                style={{ width: "100%" }}
                value={filtroCasa}
                onChange={setFiltroCasa}
                allowClear
                suffixIcon={<FilterOutlined />}
                size="large"
                options={casasUnicas}
                disabled={!manzanaSeleccionada}
              />
            </Col>

            {/* Columna 3: Filtro por Etapa */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Select
                placeholder="Filtrar por etapa"
                style={{ width: "100%" }}
                value={filtroEtapa}
                onChange={manejarCambioEtapa}
                allowClear
                suffixIcon={<FilterOutlined />}
                size="large"
                options={todasEtapas}
                disabled={!manzanaSeleccionada}
              />
            </Col>

            {/* Columna 4: Filtro por Proceso */}
            <Col xs={24} sm={12} md={6} lg={4}>
              <Select
                placeholder={
                  filtroEtapa
                    ? "Filtrar por proceso"
                    : "Primero seleccione una etapa"
                }
                style={{ width: "100%" }}
                value={filtroProceso}
                onChange={setFiltroProceso}
                allowClear
                suffixIcon={<FilterOutlined />}
                size="large"
                options={procesosPorEtapa.map((proceso: any) => ({
                  label: proceso,
                  value: proceso,
                }))}
                disabled={!manzanaSeleccionada || !filtroEtapa}
              />
            </Col>

            {/* Columna 5: Botones de acción */}
            <Col xs={24} sm={24} md={12} lg={8} style={{ textAlign: "right" }}>
              <Space>
                {hayFiltrosAplicados && (
                  <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
                )}
                <Button
                  type="primary"
                  size="large"
                  onClick={iniciarManzana}
                  disabled={
                    !manzanaSeleccionada || manzanaYaIniciada()
                  }
                  style={{
                    background: manzanaYaIniciada() ? "#52c41a" : "#1890ff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
                    height: "40px",
                    padding: "0 24px",
                  }}
                >
                  {manzanaYaIniciada() ? "Manzana Iniciada" : "Iniciar Manzana"}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Mostrar contenido cuando hay una manzana seleccionada */}
        {manzanaSeleccionada && (
          <div>
            {/* Resumen de filtros aplicados */}
            {hayFiltrosAplicados && (
              <Alert
                message={
                  <span>
                    <Text strong>Filtros aplicados: </Text>
                    {filtroCasa && (
                      <Tag color="purple" style={{ marginLeft: 8 }}>
                        Casa: {filtroCasa}
                      </Tag>
                    )}
                    {filtroEtapa && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        Etapa: {filtroEtapa}
                      </Tag>
                    )}
                    {filtroProceso && (
                      <Tag color="green" style={{ marginLeft: 8 }}>
                        Proceso: {filtroProceso}
                      </Tag>
                    )}
                  </span>
                }
                type="info"
                style={{ marginBottom: 16 }}
                closable
                onClose={limpiarFiltros}
              />
            )}

            {/* Lista de Casas - Cartas con diseño mejorado */}
            {Object.keys(datosFiltrados).length > 0 ? (
              <Row gutter={[16, 16]}>
                {Object.entries(datosFiltrados).map(
                  ([casaKey, casaContenido]: any) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={casaKey}>
                      <Card
                        style={{
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #f0f0f0",
                          background: "#ffffff",
                          height: "100%",
                          transition: "all 0.3s ease",
                        }}
                        bodyStyle={{
                          padding: "16px",
                        }}
                        hoverable
                      >
                        {/* Header de la Casa */}
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "16px",
                            padding: "5px",
                            background:
                              "linear-gradient(135deg, #1890ff, #36cfc9)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        >
                          <Title
                            level={4}
                            style={{ margin: 0, color: "white" }}
                          >
                            Casa {casaContenido.consecutivo}
                          </Title>
                        </div>

                        {/* Pisos de la casa - Ordenados de mayor a menor (PISO 2, PISO 1) */}
                        {Object.entries(casaContenido.pisos || {})
                          .sort((a, b) => Number(b[0]) - Number(a[0]))
                          .map(([pisoKey, etapas]: any) => (
                            <div key={pisoKey} style={{ marginBottom: "20px" }}>
                              {/* Header del Piso */}
                              <div
                                style={{
                                  background: "#f5f5f5",
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  marginBottom: "12px",
                                  borderLeft: "4px solid #1890ff",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: "#595959",
                                    fontSize: "14px",
                                  }}
                                >
                                  PISO {pisoKey}
                                </Text>
                              </div>

                              {/* Etapas del piso */}
                              {Object.entries(etapas).map(
                                ([etapaKey, procesos]: any) => (
                                  <div
                                    key={etapaKey}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    {/* Header de la Etapa */}
                                    <Divider
                                      orientation="left"
                                      orientationMargin="0"
                                    >
                                      <Tag
                                        color={getColorEtapa(etapaKey)}
                                        style={{
                                          fontSize: "12px",
                                          padding: "4px 8px",
                                        }}
                                      >
                                        Etapa {etapaKey}
                                      </Tag>
                                    </Divider>

                                    {/* Procesos de la etapa */}
                                    {Object.entries(procesos).map(
                                      ([procesoId, proceso]: any) => {
                                        const necesitaValidacion =
                                          Number(proceso.validacion) === 1;
                                        const estaValidado =
                                          Number(proceso.estado_validacion) ===
                                          1;

                                        return (
                                          <div
                                            key={procesoId}
                                            style={{
                                              padding: "12px",
                                              background: "#fafafa",
                                              borderRadius: "8px",
                                              marginBottom: "12px",
                                              border: "1px solid #e8e8e8",
                                            }}
                                          >
                                            {/* Nombre del proceso y estado con botón de confirmación integrado */}
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                              }}
                                            >
                                              <Text
                                                strong
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#262626",
                                                }}
                                              >
                                                {proceso.nombre_proceso}
                                              </Text>

                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "8px",
                                                }}
                                              >
                                                {/* Botón de confirmación integrado en el Tag */}
                                                {proceso.estado === "1" ? (
                                                  <Popconfirm
                                                    title="¿Estás seguro de que deseas confirmar este proceso?"
                                                    onConfirm={() =>
                                                      confirmarProceso(
                                                        proceso.id,
                                                        casaContenido.id
                                                      )
                                                    }
                                                    okText="Sí"
                                                    cancelText="No"
                                                  >
                                                    <Tag
                                                      color={getColorEstado(
                                                        proceso.estado
                                                      )}
                                                      style={{
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        padding: "4px 8px",
                                                        borderRadius: "12px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                      }}
                                                    >
                                                      {getTextoEstado(
                                                        proceso.estado
                                                      )}
                                                      <AiOutlineCheckCircle />
                                                    </Tag>
                                                  </Popconfirm>
                                                ) : (
                                                  <Tag
                                                    color={getColorEstado(
                                                      proceso.estado
                                                    )}
                                                    style={{
                                                      fontSize: "12px",
                                                      padding: "4px 8px",
                                                      borderRadius: "12px",
                                                    }}
                                                  >
                                                    {getTextoEstado(
                                                      proceso.estado
                                                    )}
                                                  </Tag>
                                                )}

                                                {/* Indicador de validación pendiente */}
                                                {necesitaValidacion &&
                                                  !estaValidado && (
                                                    <span
                                                      style={{
                                                        background: "#ff4d4f",
                                                        borderRadius: "50%",
                                                        width: 8,
                                                        height: 8,
                                                        display: "inline-block",
                                                      }}
                                                    />
                                                  )}
                                              </div>
                                            </div>

                                            {/* Información adicional */}
                                            <div
                                              style={{
                                                borderTop: "1px dashed #e8e8e8",
                                                paddingTop: "8px",
                                                marginTop: "8px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                              }}
                                            >
                                              {proceso.validacion === 1 && (
                                                <Text
                                                  type="secondary"
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {proceso.estado_validacion ===
                                                  1
                                                    ? "✅ Validado"
                                                    : "⏳ Pendiente validación"}
                                                </Text>
                                              )}

                                              {proceso.validacion === 1 &&
                                                proceso.estado_validacion ===
                                                  0 && (
                                                  <Tooltip title="Validar proceso">
                                                    <Button
                                                      type="primary"
                                                      size="small"
                                                      onClick={() => {
                                                        setProcesoAValidar({
                                                          ...proceso,
                                                          proceso_actual_id:
                                                            proceso.id,
                                                        });
                                                        setModalVisible(true);
                                                      }}
                                                      icon={
                                                        <AiOutlineCheckCircle />
                                                      }
                                                    >
                                                    </Button>
                                                  </Tooltip>
                                                )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "12px",
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Title
                  level={4}
                  style={{ color: "#8c8c8c", marginBottom: "16px" }}
                >
                  No se encontraron resultados para los filtros aplicados
                </Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "16px" }}
                >
                  {filtroCasa && filtroEtapa && filtroProceso
                    ? `No hay procesos "${filtroProceso}" en la etapa ${filtroEtapa} de la casa ${filtroCasa}`
                    : filtroCasa && filtroEtapa
                    ? `No hay procesos en la etapa ${filtroEtapa} de la casa ${filtroCasa}`
                    : filtroCasa
                    ? `No hay datos para la casa ${filtroCasa}`
                    : filtroEtapa && filtroProceso
                    ? `No hay procesos "${filtroProceso}" en la etapa ${filtroEtapa}`
                    : filtroEtapa
                    ? `No hay procesos en la etapa ${filtroEtapa}`
                    : `No hay casas en esta manzana`}
                </Text>
                <Button
                  type="primary"
                  onClick={limpiarFiltros}
                  style={{ marginTop: "16px" }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mensaje cuando no hay manzana seleccionada */}
        {!manzanaSeleccionada && (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              border: "2px dashed #d9d9d9",
            }}
          >
            <Title level={4} style={{ color: "#8c8c8c", marginBottom: "16px" }}>
              Seleccione una manzana para visualizar la información
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Use el menú desplegable de "Seleccione una manzana" para comenzar
            </Text>
          </div>
        )}
      </div>

      {/* Modal de Validación */}
      <Modal
        visible={modalVisible}
        title={"Validar proceso " + (procesoAValidar?.nombre_proceso || "")}
        onOk={handleValidarProceso}
        onCancel={() => {
          setModalVisible(false);
        }}
        okText="Validar"
        cancelText="Cancelar"
      >
        <p>
          ¿Confirmas que esta validación se cumple en este piso:{" "}
          <strong>
            {procesoAValidar?.text_validacion?.toUpperCase() || ""}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};