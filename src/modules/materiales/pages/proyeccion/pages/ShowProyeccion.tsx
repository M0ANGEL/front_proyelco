// // // // import { useParams } from "react-router-dom";
// // // // import { Card, Typography, Tag, Collapse, Spin, Alert, Button, Row, Col } from "antd";
// // // // import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
// // // // import { useState, useEffect, useMemo } from "react";
// // // // import { FileTextOutlined, ProjectOutlined } from "@ant-design/icons";

// // // // const { Title, Text } = Typography;
// // // // const { Panel } = Collapse;

// // // // interface ProyeccionItem {
// // // //   id: number;
// // // //   codigo: string;
// // // //   descripcion: string;
// // // //   padre: string;
// // // //   um: string;
// // // //   cantidad: string;
// // // //   cant_total: string;
// // // //   cant_restante: string;
// // // //   cant_solicitada: string;
// // // //   valor_sin_iva: string;
// // // //   tipo_insumo: string;
// // // //   agrupacion: string;
// // // //   estado: number;
// // // // }

// // // // export const ShowProyeccion = () => {
// // // //   const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
// // // //   const [proyeccion, setProyeccion] = useState<ProyeccionItem[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   // =============================
// // // //   // 🔹 Cargar datos desde API
// // // //   // =============================
// // // //   useEffect(() => {
// // // //     const fetchProyeccion = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         const response = await getProyeccionUnica(codigo_proyecto!);
// // // //         if (response.data?.status === "success" && Array.isArray(response.data.data)) {
// // // //           setProyeccion(response.data.data);
// // // //         } else {
// // // //           setError("No se encontraron datos válidos para este proyecto");
// // // //         }
// // // //       } catch (err: any) {
// // // //         setError(`Error al conectar con el servidor: ${err.message}`);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };
// // // //     if (codigo_proyecto) fetchProyeccion();
// // // //     else {
// // // //       setError("No se proporcionó código de proyecto");
// // // //       setLoading(false);
// // // //     }
// // // //   }, [codigo_proyecto]);

// // // //   // =============================
// // // //   // 🔹 Funciones auxiliares
// // // //   // =============================
// // // //   const getTipoInsumoColor = (tipo: string) =>
// // // //     ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");

// // // //   const getTipoInsumoText = (tipo: string) =>
// // // //     ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] || "OTRO");

// // // //   // =============================
// // // //   // ⚙️ Crear mapa jerárquico de hijos
// // // //   // =============================
// // // //   const hijosMap = useMemo(() => {
// // // //     const map = new Map<string, ProyeccionItem[]>();
// // // //     proyeccion.forEach((item) => {
// // // //       const key = item.padre?.trim() || "";
// // // //       if (!map.has(key)) map.set(key, []);
// // // //       map.get(key)!.push(item);
// // // //     });
// // // //     return map;
// // // //   }, [proyeccion]);

// // // //   // =============================
// // // //   // 🎨 Componente de información
// // // //   // =============================
// // // //   const ItemInfo = ({ item }: { item: ProyeccionItem }) => (
// // // //     <div
// // // //       style={{
// // // //         padding: "12px",
// // // //         backgroundColor: "#fafafa",
// // // //         borderRadius: "8px",
// // // //         border: "1px solid #e8e8e8",
// // // //         marginBottom: "12px",
// // // //       }}
// // // //     >
// // // //       <Row gutter={[16, 8]}>
// // // //         <Col xs={24} sm={12}>
// // // //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// // // //             <FileTextOutlined style={{ color: "#1890ff" }} />
// // // //             <div>
// // // //               <Text strong style={{ fontSize: "12px", color: "#666" }}>Código</Text><br />
// // // //               <Text copyable style={{ fontFamily: "monospace" }}>{item.codigo}</Text>
// // // //             </div>
// // // //           </div>
// // // //         </Col>
// // // //         <Col xs={24} sm={12}>
// // // //           <Text strong style={{ fontSize: "12px", color: "#666" }}>Descripción</Text><br />
// // // //           <Text>{item.descripcion}</Text>
// // // //         </Col>
// // // //       </Row>
// // // //     </div>
// // // //   );

// // // //   // =============================
// // // //   // 🔁 Renderizado recursivo optimizado
// // // //   // =============================
// // // //   const RenderNodo = ({ item }: { item: ProyeccionItem }) => {
// // // //     const hijos = hijosMap.get(item.codigo) || hijosMap.get(item.descripcion) || [];

// // // //     return (
// // // //       <Collapse accordion bordered={false} style={{backgroundColor: "white"}}>
// // // //         <Panel
// // // //           key={item.id}
// // // //           header={
// // // //             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// // // //               <ProjectOutlined style={{ color: "#1890ff" }} />
// // // //               <Text strong>{item.descripcion}</Text>
// // // //               {hijos.length > 0 && (
// // // //                 <Tag color="green" style={{ marginLeft: "auto" }}>
// // // //                   {hijos.length} subitems
// // // //                 </Tag>
// // // //               )}
// // // //             </div>
// // // //           }
// // // //         >
// // // //           <ItemInfo item={item} />
// // // //           {hijos.length > 0 && (
// // // //             <div style={{ marginLeft: "24px", marginTop: "8px" }}>
// // // //               {hijos.map((hijo) => (
// // // //                 <RenderNodo key={hijo.id} item={hijo} />
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </Panel>
// // // //       </Collapse>
// // // //     );
// // // //   };

// // // //   // =============================
// // // //   // 🔹 Filtrar raíz
// // // //   // =============================
// // // //   const itemsPrincipales = hijosMap.get("4") || [];

// // // //   // =============================
// // // //   // 🧩 Render principal
// // // //   // =============================
// // // //   if (loading)
// // // //     return (
// // // //       <div style={{ padding: "40px", textAlign: "center" }}>
// // // //         <Spin size="large" tip="Cargando proyección..." />
// // // //       </div>
// // // //     );

// // // //   if (error)
// // // //     return (
// // // //       <div style={{ padding: "20px" }}>
// // // //         <Alert
// // // //           message="Error al cargar la proyección"
// // // //           description={error}
// // // //           type="error"
// // // //           showIcon
// // // //           action={
// // // //             <Button size="small" type="primary" onClick={() => window.location.reload()}>
// // // //               Reintentar
// // // //             </Button>
// // // //           }
// // // //           style={{ borderRadius: "8px" }}
// // // //         />
// // // //       </div>
// // // //     );

// // // //   return (
// // // //     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
// // // //       <Card
// // // //         style={{
// // // //           borderRadius: "12px",
// // // //           boxShadow: "0 4px 12px rgba(133, 133, 133, 1)",
// // // //           border: "none",
// // // //         }}
// // // //         bodyStyle={{ padding: "24px" }}
// // // //       >
// // // //         <Title level={2} style={{ color: "#ffffffff", marginBottom: "16px" }}>
// // // //           Detalles de la Proyección
// // // //         </Title>

// // // //         <div
// // // //           style={{
// // // //             display: "flex",
// // // //             gap: "16px",
// // // //             flexWrap: "wrap",
// // // //             padding: "12px 16px",
// // // //             backgroundColor: "#f8fdff",
// // // //             borderRadius: "8px",
// // // //             border: "1px solid #e6f7ff",
// // // //             marginBottom: "20px",
// // // //           }}
// // // //         >
// // // //           <Text strong style={{ color: "#595959" }}>Código del Proyecto:</Text>
// // // //           <Tag color="blue" style={{ fontSize: "14px", fontWeight: "bold" }}>
// // // //             {codigo_proyecto}
// // // //           </Tag>
// // // //         </div>

// // // //         <Title level={4} style={{ color: "#262626", marginBottom: "20px" }}>
// // // //           Estructura de la Proyección
// // // //         </Title>

// // // //         {itemsPrincipales.length > 0 ? (
// // // //           itemsPrincipales.map((item) => (
// // // //             <RenderNodo key={item.id} item={item} />
// // // //           ))
// // // //         ) : (
// // // //           <Alert
// // // //             message="No hay datos de proyección"
// // // //             description={`No se encontraron items principales para el proyecto ${codigo_proyecto}`}
// // // //             type="warning"
// // // //             showIcon
// // // //             style={{ borderRadius: "8px" }}
// // // //           />
// // // //         )}
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // };
// // // import { useParams } from "react-router-dom";
// // // import { Card, Typography, Tag, Collapse, Spin, Alert, Button, Row, Col } from "antd";
// // // import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
// // // import { useState, useEffect, useMemo } from "react";
// // // import { FileTextOutlined, ProjectOutlined } from "@ant-design/icons";

// // // const { Title, Text } = Typography;
// // // const { Panel } = Collapse;

// // // // ===========================================
// // // // 🧩 Interfaz del tipo de dato ProyeccionItem
// // // // ===========================================
// // // interface ProyeccionItem {
// // //   id: number;
// // //   codigo: string;
// // //   descripcion: string;
// // //   padre: string;
// // //   um: string;
// // //   cantidad: string;
// // //   cant_total: string;
// // //   cant_restante: string;
// // //   cant_solicitada: string;
// // //   valor_sin_iva: string;
// // //   tipo_insumo: string;
// // //   agrupacion: string;
// // //   estado: number;
// // // }

// // // // ===========================================
// // // // 📦 Componente principal: ShowProyeccion
// // // // ===========================================
// // // export const ShowProyeccion = () => {
// // //   // Obtener parámetro de la URL
// // //   const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();

// // //   // Estados locales
// // //   const [proyeccion, setProyeccion] = useState<ProyeccionItem[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   // ===========================================
// // //   // 🔹 Cargar datos desde la API
// // //   // ===========================================
// // //   useEffect(() => {
// // //     const fetchProyeccion = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const response = await getProyeccionUnica(codigo_proyecto!);

// // //         // Validar respuesta
// // //         if (response.data?.status === "success" && Array.isArray(response.data.data)) {
// // //           setProyeccion(response.data.data);
// // //         } else {
// // //           setError("No se encontraron datos válidos para este proyecto");
// // //         }
// // //       } catch (err: any) {
// // //         setError(`Error al conectar con el servidor: ${err.message}`);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     // Ejecutar solo si hay código de proyecto
// // //     if (codigo_proyecto) fetchProyeccion();
// // //     else {
// // //       setError("No se proporcionó código de proyecto");
// // //       setLoading(false);
// // //     }
// // //   }, [codigo_proyecto]);

// // //   // ===========================================
// // //   // 🎨 Funciones auxiliares (colores y textos)
// // //   // ===========================================
// // //   const getTipoInsumoColor = (tipo: string) =>
// // //     ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");

// // //   const getTipoInsumoText = (tipo: string) =>
// // //     ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] || "OTRO");

// // //   // ===========================================
// // //   // ⚙️ Construir mapa jerárquico (padre → hijos)
// // //   // ===========================================
// // //   const hijosMap = useMemo(() => {
// // //     const map = new Map<string, ProyeccionItem[]>();

// // //     proyeccion.forEach((item) => {
// // //       const key = item.padre?.trim() || "";
// // //       if (!map.has(key)) map.set(key, []);
// // //       map.get(key)!.push(item);
// // //     });

// // //     return map;
// // //   }, [proyeccion]);

// // //   // ===========================================
// // //   // 🧱 Componente para mostrar info de cada item
// // //   // ===========================================
// // //   const ItemInfo = ({ item }: { item: ProyeccionItem }) => (
// // //     <div
// // //       style={{
// // //         padding: "12px",
// // //         backgroundColor: "#fafafa",
// // //         borderRadius: "8px",
// // //         border: "1px solid #e8e8e8",
// // //         marginBottom: "12px",
// // //       }}
// // //     >
// // //       <Row gutter={[16, 8]}>
// // //         {/* Columna: Código */}
// // //         <Col xs={24} sm={12}>
// // //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// // //             <FileTextOutlined style={{ color: "#1890ff" }} />
// // //             <div>
// // //               <Text strong style={{ fontSize: "12px", color: "#666" }}>Código</Text><br />
// // //               <Text copyable style={{ fontFamily: "monospace" }}>{item.codigo}</Text>
// // //             </div>
// // //           </div>
// // //         </Col>

// // //         {/* Columna: Descripción */}
// // //         <Col xs={24} sm={12}>
// // //           <Text strong style={{ fontSize: "12px", color: "#666" }}>Descripción</Text><br />
// // //           <Text>{item.descripcion}</Text>
// // //         </Col>
// // //       </Row>
// // //     </div>
// // //   );

// // //   // ===========================================
// // //   // 🔁 Renderizado recursivo de estructura
// // //   // ===========================================
// // //   const RenderNodo = ({ item }: { item: ProyeccionItem }) => {
// // //     // Obtener los hijos de este item (pueden ser por código o descripción)
// // //     const hijos = hijosMap.get(item.codigo) || hijosMap.get(item.descripcion) || [];

// // //     // Si el ítem no tiene hijos, se muestra solo su información sin desplegable
// // //     if (hijos.length === 0) {
// // //       return <ItemInfo item={item} />;
// // //     }

// // //     // Si tiene hijos, se muestra en un Collapse
// // //     return (
// // //       <Collapse accordion bordered={false} style={{ backgroundColor: "white" }}>
// // //         <Panel
// // //           key={item.id}
// // //           header={
// // //             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// // //               <ProjectOutlined style={{ color: "#1890ff" }} />
// // //               <Text strong>{item.descripcion}</Text>
// // //               <Tag color="green" style={{ marginLeft: "auto" }}>
// // //                 {hijos.length} subitems
// // //               </Tag>
// // //             </div>
// // //           }
// // //         >
// // //           {/* Info del item actual */}
// // //           <ItemInfo item={item} />

// // //           {/* Renderizar hijos recursivamente */}
// // //           <div style={{ marginLeft: "24px", marginTop: "8px" }}>
// // //             {hijos.map((hijo) => (
// // //               <RenderNodo key={hijo.id} item={hijo} />
// // //             ))}
// // //           </div>
// // //         </Panel>
// // //       </Collapse>
// // //     );
// // //   };

// // //   // ===========================================
// // //   // 🔹 Filtrar ítems raíz (nivel superior)
// // //   // ===========================================
// // //   const itemsPrincipales = hijosMap.get("4") || [];

// // //   // ===========================================
// // //   // 🧭 Estados de carga o error
// // //   // ===========================================
// // //   if (loading) {
// // //     return (
// // //       <div style={{ padding: "40px", textAlign: "center" }}>
// // //         <Spin size="large" tip="Cargando proyección..." />
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div style={{ padding: "20px" }}>
// // //         <Alert
// // //           message="Error al cargar la proyección"
// // //           description={error}
// // //           type="error"
// // //           showIcon
// // //           action={
// // //             <Button size="small" type="primary" onClick={() => window.location.reload()}>
// // //               Reintentar
// // //             </Button>
// // //           }
// // //           style={{ borderRadius: "8px" }}
// // //         />
// // //       </div>
// // //     );
// // //   }

// // //   // ===========================================
// // //   // 🧩 Render principal del componente
// // //   // ===========================================
// // //   return (
// // //     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
// // //       <Card
// // //         style={{
// // //           borderRadius: "12px",
// // //           boxShadow: "0 4px 12px rgba(133, 133, 133, 0.5)",
// // //           border: "none",
// // //         }}
// // //         bodyStyle={{ padding: "24px" }}
// // //       >
// // //         {/* Título */}
// // //         <Title level={2} style={{ color: "#262626", marginBottom: "16px" }}>
// // //           Detalles de la Proyección
// // //         </Title>

// // //         {/* Código del proyecto */}
// // //         <div
// // //           style={{
// // //             display: "flex",
// // //             gap: "16px",
// // //             flexWrap: "wrap",
// // //             padding: "12px 16px",
// // //             backgroundColor: "#f8fdff",
// // //             borderRadius: "8px",
// // //             border: "1px solid #e6f7ff",
// // //             marginBottom: "20px",
// // //           }}
// // //         >
// // //           <Text strong style={{ color: "#595959" }}>Código del Proyecto:</Text>
// // //           <Tag color="blue" style={{ fontSize: "14px", fontWeight: "bold" }}>
// // //             {codigo_proyecto}
// // //           </Tag>
// // //         </div>

// // //         {/* Estructura jerárquica */}
// // //         <Title level={4} style={{ color: "#262626", marginBottom: "20px" }}>
// // //           Estructura de la Proyección
// // //         </Title>

// // //         {/* Mostrar estructura o mensaje vacío */}
// // //         {itemsPrincipales.length > 0 ? (
// // //           itemsPrincipales.map((item) => (
// // //             <RenderNodo key={item.id} item={item} />
// // //           ))
// // //         ) : (
// // //           <Alert
// // //             message="No hay datos de proyección"
// // //             description={`No se encontraron ítems principales para el proyecto ${codigo_proyecto}`}
// // //             type="warning"
// // //             showIcon
// // //             style={{ borderRadius: "8px" }}
// // //           />
// // //         )}
// // //       </Card>
// // //     </div>
// // //   );
// // // };
// // import { useParams } from "react-router-dom";
// // import { Card, Typography, Tag, Collapse, Spin, Alert, Button, Row, Col, Table } from "antd";
// // import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
// // import { useState, useEffect, useMemo } from "react";
// // import { FileTextOutlined, FolderOutlined, ProjectOutlined, CaretDownOutlined } from "@ant-design/icons";

// // const { Title, Text } = Typography;
// // const { Panel } = Collapse;

// // // ===========================================
// // // 🧩 Interfaz del tipo de dato ProyeccionItem
// // // ===========================================
// // interface ProyeccionItem {
// //   id: number;
// //   user_id: number;
// //   codigo_proyecto: string;
// //   codigo: string;
// //   descripcion: string;
// //   padre: string;
// //   nivel: number;
// //   um: string;
// //   cantidad: string;
// //   subcapitulo: string;
// //   cant_apu: string;
// //   rend: string;
// //   iva: number;
// //   valor_sin_iva: string;
// //   tipo_insumo: string;
// //   agrupacion: string;
// //   cant_total: string;
// //   cant_restante: string;
// //   cant_solicitada: string;
// //   estado: number;
// //   created_at: string;
// //   updated_at: string;
// // }

// // // ===========================================
// // // 📦 Componente principal: ShowProyeccion
// // // ===========================================
// // export const ShowProyeccion = () => {
// //   const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
// //   const [proyeccion, setProyeccion] = useState<ProyeccionItem[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

// //   // ===========================================
// //   // 🔹 Cargar datos desde la API
// //   // ===========================================
// //   useEffect(() => {
// //     const fetchProyeccion = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await getProyeccionUnica(codigo_proyecto!);

// //         if (response.data?.status === "success" && Array.isArray(response.data.data)) {
// //           setProyeccion(response.data.data);
// //         } else {
// //           setError("No se encontraron datos válidos para este proyecto");
// //         }
// //       } catch (err: any) {
// //         setError(`Error al conectar con el servidor: ${err.message}`);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (codigo_proyecto) fetchProyeccion();
// //     else {
// //       setError("No se proporcionó código de proyecto");
// //       setLoading(false);
// //     }
// //   }, [codigo_proyecto]);

// //   // ===========================================
// //   // 🎨 Funciones auxiliares
// //   // ===========================================
// //   const getTipoInsumoColor = (tipo: string) =>
// //     ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");

// //   const getTipoInsumoText = (tipo: string) =>
// //     ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] || "OTRO");

// //   const getNivelColor = (nivel: number) =>
// //     ({ 1: "blue", 2: "green", 3: "orange", 4: "red" }[nivel] || "default");

// //   // ===========================================
// //   // ⚙️ Construir estructura jerárquica
// //   // ===========================================
// //   const { itemsPrincipales, hijosMap } = useMemo(() => {
// //     const map = new Map<string, ProyeccionItem[]>();
    
// //     // Agrupar por padre
// //     proyeccion.forEach((item) => {
// //       const key = item.padre?.trim() || "";
// //       if (!map.has(key)) map.set(key, []);
// //       map.get(key)!.push(item);
// //     });

// //     // Items principales son los de nivel 1 (padre = "4")
// //     const principales = proyeccion.filter(item => item.padre === "4");

// //     return { itemsPrincipales: principales, hijosMap: map };
// //   }, [proyeccion]);

// //   // ===========================================
// //   // 🧱 Componente para mostrar tabla de hijos
// //   // ===========================================
// //   const TablaHijos = ({ hijos }: { hijos: ProyeccionItem[] }) => {
// //     const columnas = [
// //       {
// //         title: 'Código',
// //         dataIndex: 'codigo',
// //         key: 'codigo',
// //         width: 100,
// //         render: (codigo: string) => (
// //           <Text copyable style={{ fontFamily: "monospace", fontSize: "12px" }}>
// //             {codigo}
// //           </Text>
// //         )
// //       },
// //       {
// //         title: 'Descripción',
// //         dataIndex: 'descripcion',
// //         key: 'descripcion',
// //         render: (descripcion: string) => (
// //           <Text style={{ fontSize: "12px" }}>{descripcion}</Text>
// //         )
// //       },
// //       {
// //         title: 'UM',
// //         dataIndex: 'um',
// //         key: 'um',
// //         width: 80,
// //         render: (um: string) => (
// //           <Tag color="blue" style={{ fontSize: "11px" }}>{um}</Tag>
// //         )
// //       },
// //       {
// //         title: 'Cantidad',
// //         dataIndex: 'cantidad',
// //         key: 'cantidad',
// //         width: 90,
// //         render: (cantidad: string) => (
// //           <Text strong style={{ fontSize: "12px" }}>{parseFloat(cantidad).toFixed(2)}</Text>
// //         )
// //       },
// //       {
// //         title: 'Valor',
// //         dataIndex: 'valor_sin_iva',
// //         key: 'valor_sin_iva',
// //         width: 120,
// //         render: (valor: string) => (
// //           <Text style={{ fontSize: "12px" }}>
// //             ${parseFloat(valor).toLocaleString()}
// //           </Text>
// //         )
// //       },
// //       {
// //         title: 'Tipo',
// //         dataIndex: 'tipo_insumo',
// //         key: 'tipo_insumo',
// //         width: 100,
// //         render: (tipo: string) => tipo ? (
// //           <Tag color={getTipoInsumoColor(tipo)} style={{ fontSize: "11px" }}>
// //             {getTipoInsumoText(tipo)}
// //           </Tag>
// //         ) : null
// //       }
// //     ];

// //     return (
// //       <Table
// //         size="small"
// //         columns={columnas}
// //         dataSource={hijos}
// //         rowKey="id"
// //         pagination={false}
// //         style={{ marginTop: 12 }}
// //         scroll={{ x: 600 }}
// //       />
// //     );
// //   };

// //   // ===========================================
// //   // 🔁 Renderizado recursivo de estructura
// //   // ===========================================
// //   const RenderNodo = ({ item, nivel = 0 }: { item: ProyeccionItem; nivel?: number }) => {
// //     const hijos = hijosMap.get(item.codigo) || [];
// //     const tieneHijos = hijos.length > 0;
// //     const esPadrePrincipal = nivel === 0;

// //     const togglePanel = (itemId: string) => {
// //       setExpandedPanels(prev => 
// //         prev.includes(itemId) 
// //           ? prev.filter(id => id !== itemId)
// //           : [...prev, itemId]
// //       );
// //     };

// //     const estaExpandido = expandedPanels.includes(item.id.toString());

// //     // Información básica del item
// //     const ItemBasico = () => (
// //       <div style={{ 
// //         padding: "12px",
// //         backgroundColor: "#fafafa",
// //         borderRadius: "8px",
// //         border: "1px solid #e8e8e8",
// //         marginBottom: "8px"
// //       }}>
// //         <Row gutter={[16, 8]} align="middle">
// //           <Col flex="none">
// //             {tieneHijos ? (
// //               <FolderOutlined style={{ color: "#faad14" }} />
// //             ) : (
// //               <FileTextOutlined style={{ color: "#52c41a" }} />
// //             )}
// //           </Col>
// //           <Col flex="auto">
// //             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
// //               <Text strong style={{ fontSize: "14px" }}>{item.descripcion}</Text>
// //               <Tag color={getNivelColor(item.nivel)} size="small">
// //                 Nivel {item.nivel}
// //               </Tag>
// //               {item.tipo_insumo && (
// //                 <Tag color={getTipoInsumoColor(item.tipo_insumo)} size="small">
// //                   {getTipoInsumoText(item.tipo_insumo)}
// //                 </Tag>
// //               )}
// //             </div>
// //             <Text type="secondary" style={{ fontSize: "12px" }}>
// //               Código: {item.codigo} | UM: {item.um} | Cantidad: {parseFloat(item.cantidad).toFixed(2)} | 
// //               Valor: ${parseFloat(item.valor_sin_iva || "0").toLocaleString()}
// //             </Text>
// //           </Col>
// //           {tieneHijos && (
// //             <Col flex="none">
// //               <Button 
// //                 type="text" 
// //                 size="small" 
// //                 icon={<CaretDownOutlined rotate={estaExpandido ? 0 : -90} />}
// //                 onClick={() => togglePanel(item.id.toString())}
// //               >
// //                 {hijos.length} items
// //               </Button>
// //             </Col>
// //           )}
// //         </Row>
// //       </div>
// //     );

// //     if (!tieneHijos) {
// //       return <ItemBasico />;
// //     }

// //     return (
// //       <div style={{ marginBottom: "8px" }}>
// //         <ItemBasico />
        
// //         {/* Contenido expandido */}
// //         {estaExpandido && (
// //           <div style={{ 
// //             marginLeft: "24px", 
// //             marginTop: "8px",
// //             borderLeft: "2px solid #e8e8e8",
// //             paddingLeft: "16px"
// //           }}>
// //             {/* Mostrar hijos como tabla */}
// //             <TablaHijos hijos={hijos} />
            
// //             {/* Renderizar sub-hijos recursivamente */}
// //             {hijos.map((hijo) => (
// //               <RenderNodo key={hijo.id} item={hijo} nivel={nivel + 1} />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // ===========================================
// //   // 🧭 Estados de carga o error
// //   // ===========================================
// //   if (loading) {
// //     return (
// //       <div style={{ padding: "40px", textAlign: "center" }}>
// //         <Spin size="large" tip="Cargando proyección..." />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={{ padding: "20px" }}>
// //         <Alert
// //           message="Error al cargar la proyección"
// //           description={error}
// //           type="error"
// //           showIcon
// //           action={
// //             <Button size="small" type="primary" onClick={() => window.location.reload()}>
// //               Reintentar
// //             </Button>
// //           }
// //           style={{ borderRadius: "8px" }}
// //         />
// //       </div>
// //     );
// //   }

// //   // ===========================================
// //   // 🧩 Render principal del componente
// //   // ===========================================
// //   return (
// //     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
// //       <Card
// //         style={{
// //           borderRadius: "12px",
// //           boxShadow: "0 4px 12px rgba(133, 133, 133, 0.5)",
// //           border: "none",
// //         }}
// //         bodyStyle={{ padding: "24px" }}
// //       >
// //         {/* Título */}
// //         <Title level={2} style={{ color: "#262626", marginBottom: "16px" }}>
// //           Detalles de la Proyección
// //         </Title>

// //         {/* Código del proyecto */}
// //         <div
// //           style={{
// //             display: "flex",
// //             gap: "16px",
// //             flexWrap: "wrap",
// //             padding: "12px 16px",
// //             backgroundColor: "#f8fdff",
// //             borderRadius: "8px",
// //             border: "1px solid #e6f7ff",
// //             marginBottom: "20px",
// //           }}
// //         >
// //           <Text strong style={{ color: "#595959" }}>Código del Proyecto:</Text>
// //           <Tag color="blue" style={{ fontSize: "14px", fontWeight: "bold" }}>
// //             {codigo_proyecto}
// //           </Tag>
// //           <Text strong style={{ color: "#595959" }}>Total Items:</Text>
// //           <Tag color="green" style={{ fontSize: "14px", fontWeight: "bold" }}>
// //             {proyeccion.length}
// //           </Tag>
// //         </div>

// //         {/* Estructura jerárquica */}
// //         <Title level={4} style={{ color: "#262626", marginBottom: "20px" }}>
// //           Estructura de la Proyección
// //         </Title>

// //         {/* Mostrar estructura o mensaje vacío */}
// //         {itemsPrincipales.length > 0 ? (
// //           itemsPrincipales.map((item) => (
// //             <RenderNodo key={item.id} item={item} nivel={0} />
// //           ))
// //         ) : (
// //           <Alert
// //             message="No hay datos de proyección"
// //             description={`No se encontraron ítems principales para el proyecto ${codigo_proyecto}`}
// //             type="warning"
// //             showIcon
// //             style={{ borderRadius: "8px" }}
// //           />
// //         )}
// //       </Card>
// //     </div>
// //   );
// // };

// import { useParams } from "react-router-dom";
// import { Card, Typography, Tag, Collapse, Spin, Alert, Button, Row, Col, Table } from "antd";
// import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
// import { useState, useEffect, useMemo } from "react";
// import { FileTextOutlined, FolderOutlined, ProjectOutlined, CaretDownOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;
// const { Panel } = Collapse;

// // ===========================================
// // 🧩 Interfaz del tipo de dato ProyeccionItem
// // ===========================================
// interface ProyeccionItem {
//   id: number;
//   user_id: number;
//   codigo_proyecto: string;
//   codigo: string;
//   descripcion: string;
//   padre: string;
//   nivel: number;
//   um: string;
//   cantidad: string;
//   subcapitulo: string;
//   cant_apu: string;
//   rend: string;
//   iva: number;
//   valor_sin_iva: string;
//   tipo_insumo: string;
//   agrupacion: string;
//   cant_total: string;
//   cant_restante: string;
//   cant_solicitada: string;
//   estado: number;
//   created_at: string;
//   updated_at: string;
// }

// // ===========================================
// // 📦 Componente principal: ShowProyeccion
// // ===========================================
// export const ShowProyeccion = () => {
//   const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
//   const [proyeccion, setProyeccion] = useState<ProyeccionItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

//   // ===========================================
//   // 🔹 Cargar datos desde la API
//   // ===========================================
//   useEffect(() => {
//     const fetchProyeccion = async () => {
//       try {
//         setLoading(true);
//         const response = await getProyeccionUnica(codigo_proyecto!);

//         if (response.data?.status === "success" && Array.isArray(response.data.data)) {
//           setProyeccion(response.data.data);
//         } else {
//           setError("No se encontraron datos válidos para este proyecto");
//         }
//       } catch (err: any) {
//         setError(`Error al conectar con el servidor: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (codigo_proyecto) fetchProyeccion();
//     else {
//       setError("No se proporcionó código de proyecto");
//       setLoading(false);
//     }
//   }, [codigo_proyecto]);

//   // ===========================================
//   // 🎨 Funciones auxiliares
//   // ===========================================
//   const getTipoInsumoColor = (tipo: string) =>
//     ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");

//   const getTipoInsumoText = (tipo: string) =>
//     ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] || "OTRO");

//   const getNivelColor = (nivel: number) =>
//     ({ 1: "blue", 2: "green", 3: "orange", 4: "red" }[nivel] || "default");

//   // ===========================================
//   // ⚙️ Construir estructura jerárquica
//   // ===========================================
//   const { itemsPrincipales, hijosMap, itemsConHijos } = useMemo(() => {
//     const map = new Map<string, ProyeccionItem[]>();
//     const conHijos = new Set<string>();
    
//     // Agrupar por padre
//     proyeccion.forEach((item) => {
//       const key = item.padre?.trim() || "";
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(item);
      
//       // Marcar que este padre tiene hijos
//       if (key !== "4") { // No marcar el nivel raíz "4" como que tiene hijos
//         conHijos.add(key);
//       }
//     });

//     // Items principales son los de nivel 1 (padre = "4")
//     const principales = proyeccion.filter(item => item.padre === "4");

//     return { 
//       itemsPrincipales: principales, 
//       hijosMap: map,
//       itemsConHijos: conHijos
//     };
//   }, [proyeccion]);

//   // ===========================================
//   // 🔄 Auto-expandir niveles con hijos
//   // ===========================================
//   useEffect(() => {
//     if (proyeccion.length > 0) {
//       // Auto-expandir los items principales (nivel 1) que tienen hijos
//       const itemsParaExpandir: string[] = [];
      
//       itemsPrincipales.forEach(item => {
//         const hijos = hijosMap.get(item.codigo) || [];
//         if (hijos.length > 0) {
//           itemsParaExpandir.push(item.id.toString());
//         }
//       });

//       setExpandedPanels(itemsParaExpandir);
//     }
//   }, [proyeccion, itemsPrincipales, hijosMap]);

//   // ===========================================
//   // 🧱 Componente para mostrar tabla de hijos
//   // ===========================================
//   const TablaHijos = ({ hijos }: { hijos: ProyeccionItem[] }) => {
//     const columnas = [
//       {
//         title: 'Código',
//         dataIndex: 'codigo',
//         key: 'codigo',
//         width: 100,
//         render: (codigo: string) => (
//           <Text copyable style={{ fontFamily: "monospace", fontSize: "12px" }}>
//             {codigo}
//           </Text>
//         )
//       },
//       {
//         title: 'Descripción',
//         dataIndex: 'descripcion',
//         key: 'descripcion',
//         render: (descripcion: string) => (
//           <Text style={{ fontSize: "12px" }}>{descripcion}</Text>
//         )
//       },
//       {
//         title: 'UM',
//         dataIndex: 'um',
//         key: 'um',
//         width: 80,
//         render: (um: string) => (
//           <Tag color="blue" style={{ fontSize: "11px" }}>{um}</Tag>
//         )
//       },
//       {
//         title: 'Cantidad',
//         dataIndex: 'cantidad',
//         key: 'cantidad',
//         width: 90,
//         render: (cantidad: string) => (
//           <Text strong style={{ fontSize: "12px" }}>{parseFloat(cantidad).toFixed(2)}</Text>
//         )
//       },
//       {
//         title: 'Valor',
//         dataIndex: 'valor_sin_iva',
//         key: 'valor_sin_iva',
//         width: 120,
//         render: (valor: string) => (
//           <Text style={{ fontSize: "12px" }}>
//             ${parseFloat(valor || "0").toLocaleString()}
//           </Text>
//         )
//       },
//       {
//         title: 'Tipo',
//         dataIndex: 'tipo_insumo',
//         key: 'tipo_insumo',
//         width: 100,
//         render: (tipo: string) => tipo ? (
//           <Tag color={getTipoInsumoColor(tipo)} style={{ fontSize: "11px" }}>
//             {getTipoInsumoText(tipo)}
//           </Tag>
//         ) : null
//       }
//     ];

//     return (
//       <Table
//         size="small"
//         columns={columnas}
//         dataSource={hijos}
//         rowKey="id"
//         pagination={false}
//         style={{ marginTop: 12 }}
//         scroll={{ x: 600 }}
//       />
//     );
//   };

//   // ===========================================
//   // 🔁 Renderizado recursivo de estructura
//   // ===========================================
//   const RenderNodo = ({ item, nivel = 0 }: { item: ProyeccionItem; nivel?: number }) => {
//     const hijos = hijosMap.get(item.codigo) || [];
//     const tieneHijos = hijos.length > 0;
//     const esPadrePrincipal = nivel === 0;

//     const togglePanel = (itemId: string) => {
//       setExpandedPanels(prev => 
//         prev.includes(itemId) 
//           ? prev.filter(id => id !== itemId)
//           : [...prev, itemId]
//       );
//     };

//     const estaExpandido = expandedPanels.includes(item.id.toString());

//     // Información básica del item
//     const ItemBasico = () => (
//       <div 
//         style={{ 
//           padding: "12px",
//           backgroundColor: esPadrePrincipal ? "#f0f8ff" : "#fafafa",
//           borderRadius: "8px",
//           border: `1px solid ${esPadrePrincipal ? "#bae7ff" : "#e8e8e8"}`,
//           marginBottom: "8px",
//           cursor: tieneHijos ? "pointer" : "default",
//         }}
//         onClick={() => tieneHijos && togglePanel(item.id.toString())}
//       >
//         <Row gutter={[16, 8]} align="middle">
//           <Col flex="none">
//             {tieneHijos ? (
//               <FolderOutlined style={{ 
//                 color: esPadrePrincipal ? "#1890ff" : "#faad14",
//                 fontSize: esPadrePrincipal ? "18px" : "16px"
//               }} />
//             ) : (
//               <FileTextOutlined style={{ color: "#52c41a" }} />
//             )}
//           </Col>
//           <Col flex="auto">
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
//               <Text strong style={{ 
//                 fontSize: esPadrePrincipal ? "16px" : "14px",
//                 color: esPadrePrincipal ? "#1890ff" : "#000"
//               }}>
//                 {item.descripcion}
//               </Text>
//               <Tag color={getNivelColor(item.nivel)} size="small">
//                 Nivel {item.nivel}
//               </Tag>
//               {item.tipo_insumo && (
//                 <Tag color={getTipoInsumoColor(item.tipo_insumo)} size="small">
//                   {getTipoInsumoText(item.tipo_insumo)}
//                 </Tag>
//               )}
//             </div>
//             <Text type="secondary" style={{ fontSize: "12px" }}>
//               Código: {item.codigo} | UM: {item.um} | Cantidad: {parseFloat(item.cantidad).toFixed(2)} | 
//               {item.valor_sin_iva !== "0.0000" && ` Valor: $${parseFloat(item.valor_sin_iva || "0").toLocaleString()}`}
//             </Text>
//           </Col>
//           {tieneHijos && (
//             <Col flex="none">
//               <Button 
//                 type="text" 
//                 size="small" 
//                 icon={<CaretDownOutlined rotate={estaExpandido ? 0 : -90} />}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   togglePanel(item.id.toString());
//                 }}
//               >
//                 {hijos.length} {hijos.length === 1 ? 'item' : 'items'}
//               </Button>
//             </Col>
//           )}
//         </Row>
//       </div>
//     );

//     if (!tieneHijos) {
//       return <ItemBasico />;
//     }

//     return (
//       <div style={{ marginBottom: "8px" }}>
//         <ItemBasico />
        
//         {/* Contenido expandido */}
//         {estaExpandido && (
//           <div style={{ 
//             marginLeft: "20px", 
//             marginTop: "8px",
//             borderLeft: "2px solid #e8e8e8",
//             paddingLeft: "16px"
//           }}>
//             {/* Mostrar hijos como tabla */}
//             <div style={{ marginBottom: "16px" }}>
//               <Text strong style={{ display: "block", marginBottom: 8, fontSize: "14px" }}>
//                 Items detallados ({hijos.length}):
//               </Text>
//               <TablaHijos hijos={hijos} />
//             </div>
            
//             {/* Renderizar sub-hijos recursivamente */}
//             <div style={{ marginTop: "16px" }}>
//               <Text strong style={{ display: "block", marginBottom: 8, fontSize: "14px" }}>
//                 Estructura jerárquica:
//               </Text>
//               {hijos.map((hijo) => (
//                 <RenderNodo key={hijo.id} item={hijo} nivel={nivel + 1} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ===========================================
//   // 🎛️ Controles de expansión
//   // ===========================================
//   const expandirTodos = () => {
//     const todosLosIds = proyeccion
//       .filter(item => hijosMap.has(item.codigo))
//       .map(item => item.id.toString());
//     setExpandedPanels(todosLosIds);
//   };

//   const contraerTodos = () => {
//     setExpandedPanels([]);
//   };

//   // ===========================================
//   // 🧭 Estados de carga o error
//   // ===========================================
//   if (loading) {
//     return (
//       <div style={{ padding: "40px", textAlign: "center" }}>
//         <Spin size="large" tip="Cargando proyección..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: "20px" }}>
//         <Alert
//           message="Error al cargar la proyección"
//           description={error}
//           type="error"
//           showIcon
//           action={
//             <Button size="small" type="primary" onClick={() => window.location.reload()}>
//               Reintentar
//             </Button>
//           }
//           style={{ borderRadius: "8px" }}
//         />
//       </div>
//     );
//   }

//   // ===========================================
//   // 🧩 Render principal del componente
//   // ===========================================
//   return (
//     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
//       <Card
//         style={{
//           borderRadius: "12px",
//           boxShadow: "0 4px 12px rgba(133, 133, 133, 0.5)",
//           border: "none",
//         }}
//         bodyStyle={{ padding: "24px" }}
//       >
//         {/* Título */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
//           <Title level={2} style={{ color: "#262626", margin: 0 }}>
//             Detalles de la Proyección
//           </Title>
//           <div style={{ display: "flex", gap: "8px" }}>
//             <Button size="small" onClick={expandirTodos}>
//               Expandir Todos
//             </Button>
//             <Button size="small" onClick={contraerTodos}>
//               Contraer Todos
//             </Button>
//           </div>
//         </div>

//         {/* Código del proyecto */}
//         <div
//           style={{
//             display: "flex",
//             gap: "16px",
//             flexWrap: "wrap",
//             padding: "12px 16px",
//             backgroundColor: "#f8fdff",
//             borderRadius: "8px",
//             border: "1px solid #e6f7ff",
//             marginBottom: "20px",
//           }}
//         >
//           <Text strong style={{ color: "#595959" }}>Código del Proyecto:</Text>
//           <Tag color="blue" style={{ fontSize: "14px", fontWeight: "bold" }}>
//             {codigo_proyecto}
//           </Tag>
//           <Text strong style={{ color: "#595959" }}>Total Items:</Text>
//           <Tag color="green" style={{ fontSize: "14px", fontWeight: "bold" }}>
//             {proyeccion.length}
//           </Tag>
//           <Text strong style={{ color: "#595959" }}>Items con hijos:</Text>
//           <Tag color="orange" style={{ fontSize: "14px", fontWeight: "bold" }}>
//             {Array.from(new Set(proyeccion.filter(item => hijosMap.has(item.codigo)).map(item => item.codigo))).length}
//           </Tag>
//         </div>

//         {/* Estructura jerárquica */}
//         <Title level={4} style={{ color: "#262626", marginBottom: "20px" }}>
//           Estructura de la Proyección
//         </Title>

//         {/* Mostrar estructura o mensaje vacío */}
//         {itemsPrincipales.length > 0 ? (
//           itemsPrincipales.map((item) => (
//             <RenderNodo key={item.id} item={item} nivel={0} />
//           ))
//         ) : (
//           <Alert
//             message="No hay datos de proyección"
//             description={`No se encontraron ítems principales para el proyecto ${codigo_proyecto}`}
//             type="warning"
//             showIcon
//             style={{ borderRadius: "8px" }}
//           />
//         )}
//       </Card>
//     </div>
//   );
// };

import { useParams } from "react-router-dom";
import { Card, Typography, Tag, Spin, Alert, Button, Row, Col, Table } from "antd";
import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
import { useState, useEffect, useMemo } from "react";
import { FileTextOutlined, FolderOutlined, CaretDownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// ===========================================
// 🧩 Interfaz del tipo de dato ProyeccionItem
// ===========================================
interface ProyeccionItem {
  id: number;
  user_id: number;
  codigo_proyecto: string;
  codigo: string;
  descripcion: string;
  padre: string;
  nivel: number;
  um: string;
  cantidad: string;
  subcapitulo: string;
  cant_apu: string;
  rend: string;
  iva: number;
  valor_sin_iva: string;
  tipo_insumo: string;
  agrupacion: string;
  cant_total: string;
  cant_restante: string;
  cant_solicitada: string;
  estado: number;
  created_at: string;
  updated_at: string;
}

// ===========================================
// 📦 Componente principal: ShowProyeccion
// ===========================================
// ===========================================
// 🧩 Componente ShowProyeccion optimizado
// ===========================================
export const ShowProyeccion = () => {
  const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
  const [proyeccion, setProyeccion] = useState<ProyeccionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

  useEffect(() => {
    const fetchProyeccion = async () => {
      try {
        setLoading(true);
        const response = await getProyeccionUnica(codigo_proyecto!);
        if (response.data?.status === "success" && Array.isArray(response.data.data)) {
          setProyeccion(response.data.data);
        } else {
          setError("No se encontraron datos válidos para este proyecto");
        }
      } catch (err: any) {
        setError(`Error al conectar con el servidor: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (codigo_proyecto) fetchProyeccion();
    else {
      setError("No se proporcionó código de proyecto");
      setLoading(false);
    }
  }, [codigo_proyecto]);

  // ===========================================
  // ⚙️ Crear mapa de hijos y niveles con hijos
  // ===========================================
  const { itemsPrincipales, hijosMap } = useMemo(() => {
    const map = new Map<string, ProyeccionItem[]>();
    proyeccion.forEach(item => {
      const key = item.padre?.trim() || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    const principales = proyeccion.filter(item => item.padre === "4"); // Nivel raíz
    return { itemsPrincipales: principales, hijosMap: map };
  }, [proyeccion]);

  // ===========================================
  // 🎨 Funciones auxiliares de color y texto
  // ===========================================
  const getTipoInsumoColor = (tipo: string) =>
    ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");
  const getTipoInsumoText = (tipo: string) =>
    ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] || "OTRO");
  const getNivelColor = (nivel: number) =>
    ({ 1: "blue", 2: "green", 3: "orange", 4: "red" }[nivel] || "default");

  // ===========================================
  // 🔄 Renderizado de cada item
  // ===========================================
  const RenderNodo = ({ item, nivel = 0 }: { item: ProyeccionItem; nivel?: number }) => {
    const hijos = hijosMap.get(item.codigo) || [];
    const tieneHijos = hijos.length > 0;
    const estaExpandido = expandedPanels.includes(item.id.toString());

    const togglePanel = (itemId: string) => {
      setExpandedPanels(prev =>
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    };

    return (
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            padding: "12px",
            backgroundColor: nivel === 0 ? "#f0f8ff" : "#fafafa",
            borderRadius: "8px",
            border: `1px solid ${nivel === 0 ? "#bae7ff" : "#e8e8e8"}`,
            cursor: tieneHijos ? "pointer" : "default",
          }}
          onClick={() => tieneHijos && togglePanel(item.id.toString())}
        >
          <Row gutter={[16, 8]} align="middle">
            <Col flex="none">
              {tieneHijos ? (
                <FolderOutlined
                  style={{
                    color: nivel === 0 ? "#1890ff" : "#faad14",
                    fontSize: nivel === 0 ? "18px" : "16px",
                  }}
                />
              ) : (
                <FileTextOutlined style={{ color: "#52c41a" }} />
              )}
            </Col>
            <Col flex="auto">
              <Text strong style={{ fontSize: nivel === 0 ? "16px" : "14px" }}>
                {item.descripcion}
              </Text>
              <Tag color={getNivelColor(item.nivel)} size="small">
                Nivel {item.nivel}
              </Tag>
              {item.tipo_insumo && (
                <Tag color={getTipoInsumoColor(item.tipo_insumo)} size="small">
                  {getTipoInsumoText(item.tipo_insumo)}
                </Tag>
              )}
              <div style={{ fontSize: "12px", marginTop: 4 }}>
                Código: {item.codigo} | UM: {item.um} | Cantidad: {parseFloat(item.cantidad).toFixed(2)}
                {item.valor_sin_iva !== "0.0000" &&
                  ` | Valor: $${parseFloat(item.valor_sin_iva).toLocaleString()}`}
              </div>
            </Col>
            {tieneHijos && (
              <Col flex="none">
                <Button
                  type="text"
                  size="small"
                  icon={<CaretDownOutlined rotate={estaExpandido ? 0 : -90} />}
                  onClick={e => {
                    e.stopPropagation();
                    togglePanel(item.id.toString());
                  }}
                >
                  {hijos.length} {hijos.length === 1 ? "item" : "items"}
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {/* Solo desplegar si tiene hijos */}
        {tieneHijos && estaExpandido && (
          <div style={{ marginLeft: "20px", marginTop: "8px" }}>
            <Table
              size="small"
              columns={[
                { title: "Código", dataIndex: "codigo", key: "codigo" },
                { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
                { title: "UM", dataIndex: "um", key: "um" },
                { title: "Cantidad", dataIndex: "cantidad", key: "cantidad", render: (c) => parseFloat(c).toFixed(2) },
                { title: "Valor", dataIndex: "valor_sin_iva", key: "valor_sin_iva", render: (v) => `$${parseFloat(v).toLocaleString()}` },
                {
                  title: "Tipo",
                  dataIndex: "tipo_insumo",
                  key: "tipo_insumo",
                  render: (tipo) => tipo && <Tag color={getTipoInsumoColor(tipo)}>{getTipoInsumoText(tipo)}</Tag>
                }
              ]}
              dataSource={hijos}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </div>
    );
  };

  const expandirTodos = () => setExpandedPanels(proyeccion.filter(item => hijosMap.has(item.codigo)).map(i => i.id.toString()));
  const contraerTodos = () => setExpandedPanels([]);

  if (loading) return <Spin size="large" tip="Cargando proyección..." style={{ display: "block", margin: "40px auto" }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ margin: 20 }} />;

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(133,133,133,0.5)" }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0 }}>Detalles de la Proyección</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="small" onClick={expandirTodos}>Expandir Todos</Button>
            <Button size="small" onClick={contraerTodos}>Contraer Todos</Button>
          </div>
        </Row>

        {itemsPrincipales.length > 0 ? (
          itemsPrincipales.map(item => <RenderNodo key={item.id} item={item} />)
        ) : (
          <Alert message="No hay datos de proyección" type="warning" showIcon />
        )}
      </Card>
    </div>
  );
};
