
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Spin,
  Alert,
  Button,
  Row,
  Col,
  Table,
  InputNumber,
  message,
  Collapse,
  Input,
  Checkbox,
} from "antd";
import {
  getProyeccionUnica,
  postEnviarSolicitud,
} from "@/services/material/ProyeccionesAPI";
import { useState, useEffect, useMemo } from "react";
import {
  FileTextOutlined,
  FolderOutlined,
  CaretDownOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { GreenButton } from "@/components/layout/styled";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

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

interface BloqueProyeccion {
  bloque: string;
  items: ProyeccionItem[];
}

interface SolicitudItem {
  id: number;
  cantidad: number;
  padre: string;
  codigo: string;
  codigo_proyecto: string;
  descripcion: string;
  um: string;
  cant_total: string;
  valor_sin_iva: string;
  tipo_insumo: string;
  agrupacion: string;
  nivel: number;
  es_padre: boolean;
  tiene_hijos_seleccionados?: boolean;
  hijos_seleccionados?: number;
  subHijos?: SolicitudItem[];
  id_padre?: number;
  nombre_padre?: string;
  cant_apu?: string;
}

interface ActividadSolicitud {
  actividad: string;
  item: string;
  dataActividad: SolicitudItem[];
}

export const ShowSolicitudeMaterial = () => {
  const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
  const navigate = useNavigate();
  const [bloques, setBloques] = useState<BloqueProyeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeUso, setMensajeUso] = useState(true);
  const [seleccionados, setSeleccionados] = useState<Record<number, boolean>>(
    {}
  );
  const [seleccionadosHijos, setSeleccionadosHijos] = useState<
    Record<number, Record<number, boolean>>
  >({});

  useEffect(() => {
    const fetchProyeccion = async () => {
      try {
        setLoading(true);
        const response = await getProyeccionUnica(codigo_proyecto!);
        if (
          response.data?.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          setBloques(response.data.data);
          // Inicializar cantidades en 0 para todos los niveles 2 y 3
          const initialCantidades: Record<number, number> = {};
          const initialSeleccionados: Record<number, boolean> = {};
          const initialSeleccionadosHijos: Record<
            number,
            Record<number, boolean>
          > = {};

          response.data.data.forEach((bloque: BloqueProyeccion) => {
            bloque.items.forEach((item: ProyeccionItem) => {
              // Inicializar cantidades para niveles 2 y 3
              if (item.nivel === 2 || item.nivel === 3) {
                initialCantidades[item.id] = 0;
              }

              // Verificar si es nivel 2
              if (item.nivel === 2) {
                // Inicializar todos los niveles 2 como no seleccionados
                initialSeleccionados[item.id] = false;
                
                // Inicializar hijos si los tiene
                const tieneHijos = bloque.items.some(
                  (hijo) => hijo.nivel === 3 && hijo.padre === item.descripcion
                );
                if (tieneHijos) {
                  initialSeleccionadosHijos[item.id] = {};
                  // Inicializar selección de hijos
                  const hijos = bloque.items.filter(
                    (hijo) =>
                      hijo.nivel === 3 && hijo.padre === item.descripcion
                  );
                  hijos.forEach((hijo) => {
                    initialSeleccionadosHijos[item.id][hijo.id] = false;
                  });
                }
              }
            });
          });
          setCantidades(initialCantidades);
          setSeleccionados(initialSeleccionados);
          setSeleccionadosHijos(initialSeleccionadosHijos);
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

  // Construir estructura jerárquica por bloque
  const construirJerarquiaPorBloque = (items: ProyeccionItem[]) => {
    const hijosMap = new Map<string, ProyeccionItem[]>();
    const itemsNivel1: ProyeccionItem[] = [];
    const itemsNivel2: ProyeccionItem[] = [];

    // Primero, identificar todos los items
    items.forEach((item) => {
      if (item.nivel === 1) {
        itemsNivel1.push(item);
      } else if (item.nivel === 2) {
        itemsNivel2.push(item);
      }
    });

    // Para niveles 2: padre es el código del nivel 1
    itemsNivel2.forEach((item) => {
      const key = item.padre;
      if (!hijosMap.has(key)) hijosMap.set(key, []);
      hijosMap.get(key)!.push(item);
    });

    // Para niveles 3: padre es la descripción del nivel 2
    items.forEach((item) => {
      if (item.nivel === 3) {
        const padreNivel2 = itemsNivel2.find(
          (n2) => n2.descripcion === item.padre
        );
        if (padreNivel2) {
          const key = padreNivel2.id.toString();
          if (!hijosMap.has(key)) hijosMap.set(key, []);
          hijosMap.get(key)!.push(item);
        }
      }
    });

    return { itemsNivel1, hijosMap };
  };

  // Obtener el título del nivel 1 para un bloque
  const getTituloNivel1 = (bloque: BloqueProyeccion): string => {
    const nivel1 = bloque.items.find((item) => item.nivel === 1);
    return nivel1 ? nivel1.descripcion : `Bloque ${bloque.bloque}`;
  };

  // Filtrar bloques y items nivel 1 por término de búsqueda
  const bloquesFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return bloques;

    return bloques
      .map((bloque) => {
        const itemsNivel1Filtrados = bloque.items.filter(
          (item) =>
            item.nivel === 1 &&
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (itemsNivel1Filtrados.length === 0) return null;

        // Para mantener la estructura jerárquica, necesitamos incluir también los hijos de los niveles 1 filtrados
        const codigosNivel1Filtrados = itemsNivel1Filtrados.map(
          (item) => item.codigo
        );
        const itemsIncluir = bloque.items.filter(
          (item) =>
            (item.nivel === 1 &&
              codigosNivel1Filtrados.includes(item.codigo)) ||
            (item.nivel === 2 && codigosNivel1Filtrados.includes(item.padre)) ||
            (item.nivel === 3 &&
              itemsNivel1Filtrados.some((n1) =>
                bloque.items.some(
                  (n2) =>
                    n2.nivel === 2 &&
                    n2.padre === n1.codigo &&
                    n2.descripcion === item.padre
                )
              ))
        );

        return {
          ...bloque,
          items: itemsIncluir,
        };
      })
      .filter(Boolean) as BloqueProyeccion[];
  }, [bloques, searchTerm]);


  const getNivelColor = (nivel: number) =>
    ({ 1: "blue", 2: "green", 3: "orange" }[nivel] || "default");

  const togglePanel = (id: string) => {
    setExpandedPanels((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Función para manejar el cambio en el InputNumber
  const handleCantidadChange = (
    value: number | null,
    record: ProyeccionItem
  ) => {
    if (value === null) return;

    const cantApu = parseFloat(record.cant_restante || "0");

    if (value > cantApu) {
      message.error(`No puede ingresar un valor mayor a ${cantApu}`);
      return;
    }

    setCantidades((prev) => ({
      ...prev,
      [record.id]: value,
    }));
  };

  // Función para manejar el checkbox del padre (nivel 2)
  const handleCheckboxPadreChange = (id: number, checked: boolean) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: checked,
    }));

    // Si tiene hijos, actualizar todos los hijos
    if (seleccionadosHijos[id]) {
      const nuevosHijos = { ...seleccionadosHijos[id] };
      Object.keys(nuevosHijos).forEach((hijoId) => {
        nuevosHijos[parseInt(hijoId)] = checked;
      });
      setSeleccionadosHijos((prev) => ({
        ...prev,
        [id]: nuevosHijos,
      }));
    }
  };

  // Función para manejar el checkbox de un hijo específico (nivel 3)
  const handleCheckboxHijoChange = (
    padreId: number,
    hijoId: number,
    checked: boolean
  ) => {
    setSeleccionadosHijos((prev) => ({
      ...prev,
      [padreId]: {
        ...prev[padreId],
        [hijoId]: checked,
      },
    }));

    // Verificar si todos los hijos están seleccionados
    const hijos = seleccionadosHijos[padreId];
    if (hijos) {
      const todosSeleccionados = Object.values(hijos).every(
        (val) => val === true
      );
      const algunoSeleccionado = Object.values(hijos).some(
        (val) => val === true
      );

      if (algunoSeleccionado) {
        // Si al menos un hijo está seleccionado, marcar el padre como seleccionado
        setSeleccionados((prev) => ({ ...prev, [padreId]: true }));
      } else {
        // Si ningún hijo está seleccionado, desmarcar el padre
        setSeleccionados((prev) => ({ ...prev, [padreId]: false }));
      }
    }
  };

  // Función para seleccionar todos los hijos de un padre
  const seleccionarTodosHijos = (padreId: number) => {
    const hijos = seleccionadosHijos[padreId];
    if (hijos) {
      const nuevosHijos = { ...hijos };
      Object.keys(nuevosHijos).forEach((hijoId) => {
        nuevosHijos[parseInt(hijoId)] = true;
      });
      setSeleccionadosHijos((prev) => ({
        ...prev,
        [padreId]: nuevosHijos,
      }));
      setSeleccionados((prev) => ({ ...prev, [padreId]: true }));
    }
  };

  // Función para deseleccionar todos los hijos de un padre
  const deseleccionarTodosHijos = (padreId: number) => {
    const hijos = seleccionadosHijos[padreId];
    if (hijos) {
      const nuevosHijos = { ...hijos };
      Object.keys(nuevosHijos).forEach((hijoId) => {
        nuevosHijos[parseInt(hijoId)] = false;
      });
      setSeleccionadosHijos((prev) => ({
        ...prev,
        [padreId]: nuevosHijos,
      }));
      setSeleccionados((prev) => ({ ...prev, [padreId]: false }));
    }
  };

  // Construir la estructura de actividades para enviar
  const construirEstructuraSolicitud = (): ActividadSolicitud[] => {
    const actividades: ActividadSolicitud[] = [];

    bloques.forEach((bloque) => {
      // Buscar el item de nivel 1 para este bloque
      const nivel1 = bloque.items.find((item) => item.nivel === 1);
      if (!nivel1) return;

      // Obtener todos los items de nivel 2 para este bloque
      const itemsNivel2 = bloque.items.filter((item) => item.nivel === 2);
      
      // Agrupar items de nivel 2 por su padre (código del nivel 1)
      const itemsPorActividad: Record<string, ProyeccionItem[]> = {};
      
      itemsNivel2.forEach((item) => {
        const key = item.padre; // Este es el código del nivel 1
        if (!itemsPorActividad[key]) {
          itemsPorActividad[key] = [];
        }
        itemsPorActividad[key].push(item);
      });

      // Crear una actividad por cada código de nivel 1
      Object.entries(itemsPorActividad).forEach(([codigoNivel1, items]) => {
        // Buscar el nivel 1 correspondiente
        const actividadNivel1 = bloque.items.find(
          (item) => item.nivel === 1 && item.codigo === codigoNivel1
        );
        
        if (!actividadNivel1) return;

        const dataActividad: SolicitudItem[] = [];

        items.forEach((itemNivel2) => {
          // Verificar si el nivel 2 está seleccionado
          const estaSeleccionado = seleccionados[itemNivel2.id] || false;
          
          // Verificar si tiene hijos nivel 3
          const hijosNivel3 = bloque.items.filter(
            (hijo) => hijo.nivel === 3 && hijo.padre === itemNivel2.descripcion
          );

          const tieneHijosSeleccionados = hijosNivel3.some(
            (hijo) => seleccionadosHijos[itemNivel2.id]?.[hijo.id]
          );

          // Solo incluir si está seleccionado o tiene hijos seleccionados
          if (estaSeleccionado || tieneHijosSeleccionados) {
            const cantidadSolicitada = cantidades[itemNivel2.id] || 0;
            
            // Si tiene cantidad > 0 o tiene hijos seleccionados, incluir
            if (cantidadSolicitada > 0 || tieneHijosSeleccionados) {
              const itemSolicitud: SolicitudItem = {
                id: itemNivel2.id,
                cantidad: cantidadSolicitada,
                padre: itemNivel2.padre,
                codigo: itemNivel2.codigo,
                codigo_proyecto: codigo_proyecto!,
                descripcion: itemNivel2.descripcion,
                um: itemNivel2.um,
                cant_total: itemNivel2.cant_total,
                valor_sin_iva: itemNivel2.valor_sin_iva,
                tipo_insumo: itemNivel2.tipo_insumo,
                agrupacion: itemNivel2.agrupacion,
                nivel: itemNivel2.nivel,
                es_padre: true,
                tiene_hijos_seleccionados: tieneHijosSeleccionados,
                hijos_seleccionados: tieneHijosSeleccionados 
                  ? Object.values(seleccionadosHijos[itemNivel2.id] || {}).filter(Boolean).length
                  : 0,
              };

              // Agregar hijos si los tiene y están seleccionados
              if (tieneHijosSeleccionados) {
                itemSolicitud.subHijos = hijosNivel3
                  .filter((hijo) => seleccionadosHijos[itemNivel2.id]?.[hijo.id])
                  .map((hijo) => ({
                    id: hijo.id,
                    cantidad: cantidades[hijo.id] || 0,
                    padre: hijo.padre,
                    codigo: hijo.codigo,
                    codigo_proyecto: codigo_proyecto!,
                    descripcion: hijo.descripcion,
                    um: hijo.um,
                    cant_total: hijo.cant_total,
                    valor_sin_iva: hijo.valor_sin_iva,
                    tipo_insumo: hijo.tipo_insumo,
                    agrupacion: hijo.agrupacion,
                    nivel: hijo.nivel,
                    es_padre: false,
                    id_padre: itemNivel2.id,
                    nombre_padre: itemNivel2.descripcion,
                    cant_apu: hijo.cant_apu,
                  }));
              }

              dataActividad.push(itemSolicitud);
            }
          }
        });

        if (dataActividad.length > 0) {
          actividades.push({
            actividad: actividadNivel1.descripcion,
            item: codigoNivel1,
            dataActividad,
          });
        }
      });
    });

    return actividades;
  };

  const enviarCantidades = async () => {
    setGuardando(true);

    try {
      // Construir la estructura de actividades
      const actividades = construirEstructuraSolicitud();

      if (actividades.length === 0) {
        message.warning(
          "No hay elementos seleccionados con cantidad mayor a 0. Ingrese cantidades válidas o seleccione items."
        );
        setGuardando(false);
        return;
      }

      // Contar elementos seleccionados
      let totalPadres = 0;
      let totalHijos = 0;

      actividades.forEach((actividad) => {
        actividad.dataActividad.forEach((item) => {
          if (item.es_padre) {
            totalPadres++;
            totalHijos += item.subHijos?.length || 0;
          }
        });
      });

      console.log("Datos a enviar:", actividades);
      console.log(`Total: ${totalPadres} padres (con ${totalHijos} hijos)`);

      // Llamar a la API - ENVIAR LA ESTRUCTURA DE ACTIVIDADES
      const result = await postEnviarSolicitud({
        actividades,
        codigo_proyecto: codigo_proyecto,
        fecha: new Date().toISOString(),
        resumen: {
          total_actividades: actividades.length,
          total_padres: totalPadres,
          total_hijos: totalHijos,
          total_elementos: totalPadres + totalHijos,
        },
      });

      if (result?.status === "success") {
        message.success({
          content: `Excel generado correctamente: ${result.filename}`,
          duration: 5,
        });

        // Mostrar detalles de lo enviado
        if (totalHijos > 0) {
          const padresConHijos = actividades.flatMap(act => 
            act.dataActividad.filter(item => item.subHijos && item.subHijos.length > 0)
          );

          message.info({
            content: `${padresConHijos.length} padre(s) incluyen ${totalHijos} hijo(s) en la solicitud`,
            duration: 4,
          });
        }

        // Mostrar resumen de actividades
        message.info({
          content: `${actividades.length} actividad(es) procesada(s) exitosamente`,
          duration: 4,
        });
        
      }
    } catch (error: any) {
      console.error("Error al guardar cantidades:", error);

      // Mostrar error específico
      if (error.message.includes("No se proporcionaron")) {
        message.error("Error: No hay datos para generar el Excel");
      } else if (error.message.includes("Error del servidor")) {
        message.error("Error del servidor. Contacte al administrador");
      } else {
        message.error(`Error: ${error.message}`);
      }
    } finally {
      setGuardando(false);
     
    }
  };

  const RenderNivel2 = (
    item: ProyeccionItem,
    hijosMap: Map<string, ProyeccionItem[]>
  ) => {
    const hijos = hijosMap.get(item.id.toString()) || [];
    const tieneHijos = hijos.length > 0;
    const expandido = expandedPanels.includes(item.id.toString());
    const mostrarCheckbox = true; // Siempre mostrar checkbox para nivel 2
    const mostrarInput = true;

    const columnasNivel3 = [
      {
        title: "Seleccionar",
        key: "seleccionar",
        width: 100,
        render: (_, record: ProyeccionItem) => (
          <Checkbox
            checked={seleccionadosHijos[item.id]?.[record.id] || false}
            onChange={(e) =>
              handleCheckboxHijoChange(item.id, record.id, e.target.checked)
            }
          />
        ),
      },
      {
        title: "Código",
        dataIndex: "codigo",
        key: "codigo",
        width: 120,
      },
      {
        title: "Descripción",
        dataIndex: "descripcion",
        key: "descripcion",
      },
      {
        title: "UM",
        dataIndex: "um",
        key: "um",
        width: 80,
      },
      {
        title: "Disponible",
        key: "disponible",
        width: 120,
        render: (_, record: ProyeccionItem) => (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {parseFloat(record.cant_apu || "0").toFixed(2)}
          </Text>
        ),
      },
    ];

    return (
      <div key={item.id} style={{ marginBottom: 8, marginLeft: 20 }}>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: tieneHijos ? "#fafafa" : "#fff",
            border: "1px solid #d9d9d9",
            cursor: "default",
          }}
        >
          <Row align="middle">
            <Col flex="none">
              {tieneHijos ? (
                <FolderOutlined
                  style={{ color: "#1890ff", fontSize: "16px", marginRight: 8 }}
                />
              ) : (
                <FileTextOutlined
                  style={{ color: "#52c41a", marginRight: 8 }}
                />
              )}
            </Col>
            <Col flex="auto">
              <Row align="middle">
                <Col span={24}>
                  <Text strong>{item.descripcion}</Text>{" "}
                  <Tag color={getNivelColor(item.nivel)}>
                    Nivel {item.nivel}
                  </Tag>
                  {tieneHijos && <Tag color="orange">Con hijos nivel 3</Tag>}
                  {!tieneHijos && <Tag color="green">Sin hijos</Tag>}
                  {mostrarCheckbox && (
                    <Checkbox
                      checked={seleccionados[item.id] || false}
                      onChange={(e) =>
                        handleCheckboxPadreChange(item.id, e.target.checked)
                      }
                      style={{ marginLeft: 8 }}
                    >
                      Solicitar
                    </Checkbox>
                  )}
                </Col>
                <Col span={24}>
                  {tieneHijos && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">
                        {hijos.length} hijo{hijos.length > 1 ? "s" : ""}{" "}
                        disponible{hijos.length > 1 ? "s" : ""}
                        {(seleccionados[item.id] || seleccionadosHijos[item.id]) && (
                          <span style={{ color: "#52c41a", marginLeft: 8 }}>
                            (
                            {
                              Object.values(
                                seleccionadosHijos[item.id] || {}
                              ).filter((v) => v).length
                            }{" "}
                            seleccionados)
                          </span>
                        )}
                      </Text>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            <Col
              flex="none"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              {mostrarInput && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <InputNumber
                    min={0}
                    max={parseFloat(item.cant_restante || "0")}
                    value={cantidades[item.id] || 0}
                    onChange={(value) => handleCantidadChange(value, item)}
                    style={{ width: "100px" }}
                    precision={2}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Máx: {parseFloat(item.cant_restante || "0").toFixed(2)}
                  </Text>
                </div>
              )}

              {tieneHijos && (
                <Button
                  type="text"
                  icon={<CaretDownOutlined rotate={expandido ? 0 : -90} />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePanel(item.id.toString());
                  }}
                >
                  {expandido ? "Ocultar" : "Mostrar"}
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {expandido && tieneHijos && (
          <div style={{ marginLeft: 20, marginTop: 8 }}>
            <div
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                background: "#f0f8ff",
                borderRadius: 4,
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong>Hijos de: {item.descripcion}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    (
                    {
                      Object.values(seleccionadosHijos[item.id] || {}).filter(
                        (v) => v
                      ).length
                    }{" "}
                    seleccionados)
                  </Text>
                </Col>
                <Col>
                  <Button
                    type="link"
                    size="small"
                    style={{
                      backgroundColor: "rgba(75, 141, 75, 0.98)",
                      color: "white",
                    }}
                    onClick={() => seleccionarTodosHijos(item.id)}
                  >
                    Seleccionar todos
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => deseleccionarTodosHijos(item.id)}
                    style={{
                      marginLeft: 8,
                      backgroundColor: "rgba(230, 114, 114, 1)",
                      color: "white",
                    }}
                  >
                    Deseleccionar todos
                  </Button>
                </Col>
              </Row>
            </div>
            <Table
              columns={columnasNivel3}
              dataSource={hijos}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </div>
    );
  };

  const RenderNivel1 = (
    item: ProyeccionItem,
    hijosMap: Map<string, ProyeccionItem[]>
  ) => {
    const hijos = hijosMap.get(item.codigo) || [];
    const tieneHijos = hijos.length > 0;
    const expandido = expandedPanels.includes(item.id.toString());

    return (
      <div key={item.id} style={{ marginBottom: 16 }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: tieneHijos ? "#f0f8ff" : "#fff",
            border: "2px solid #1890ff",
            cursor: "default",
          }}
        >
          <Row align="middle">
            <Col flex="none">
              {tieneHijos ? (
                <FolderOutlined
                  style={{ color: "#1890ff", fontSize: "18px", marginRight: 8 }}
                />
              ) : (
                <FileTextOutlined
                  style={{ color: "#52c41a", fontSize: "18px", marginRight: 8 }}
                />
              )}
            </Col>
            <Col flex="auto">
              <Text strong style={{ fontSize: "16px" }}>
                {item.descripcion}
              </Text>{" "}
              <Tag color={getNivelColor(item.nivel)}>Nivel {item.nivel}</Tag>
              {tieneHijos && (
                <>
                  <Tag color="blue">Con hijos nivel 2</Tag>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({hijos.length} items)
                  </Text>
                </>
              )}
            </Col>
            {tieneHijos && (
              <Col flex="none">
                <Button
                  type="text"
                  icon={<CaretDownOutlined rotate={expandido ? 0 : -90} />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePanel(item.id.toString());
                  }}
                >
                  {expandido ? "Ocultar" : "Mostrar"} ({hijos.length})
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {expandido && tieneHijos && (
          <div style={{ marginTop: 8 }}>
            {hijos.map((hijoNivel2) => RenderNivel2(hijoNivel2, hijosMap))}
          </div>
        )}
      </div>
    );
  };

  const RenderBloque = (bloque: BloqueProyeccion) => {
    const { itemsNivel1, hijosMap } = construirJerarquiaPorBloque(bloque.items);
    const tituloNivel1 = getTituloNivel1(bloque);

    return (
      <Panel
        header={
          <div>
            <Text style={{ color: "black", marginRight: "50px" }} strong>
              {tituloNivel1}
            </Text>
            <Tag style={{ marginLeft: 8 }}>Código: {bloque.bloque}</Tag>
            <Tag style={{ marginLeft: 4 }}>{bloque.items.length} items</Tag>
          </div>
        }
        key={bloque.bloque}
      >
        {itemsNivel1.length > 0 ? (
          itemsNivel1.map((item) => RenderNivel1(item, hijosMap))
        ) : (
          <Alert
            message="No hay datos de nivel 1 en este bloque"
            type="warning"
            showIcon
          />
        )}
      </Panel>
    );
  };

  if (loading)
    return (
      <Spin
        size="large"
        tip="Cargando proyección..."
        style={{ display: "block", margin: "40px auto" }}
      />
    );

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        {/* Botón de volver atrás */}
        <Row style={{ marginBottom: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ padding: 5, background: "blue", color: "white" }}
          >
            Volver atrás
          </Button>
        </Row>

        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Title level={3}>Materiales</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              onClick={enviarCantidades}
              loading={guardando}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Generar Solicitud"}
            </Button>
            <Button onClick={() => setExpandedPanels([])}>
              Contraer Todos
            </Button>
          </div>
        </Row>

        {/* Barra de búsqueda */}
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Buscar por nombre de nivel 1..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 400 }}
          />
          {searchTerm && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              {
                bloquesFiltrados.flatMap((b) =>
                  b.items.filter((i) => i.nivel === 1)
                ).length
              }{" "}
              resultados encontrados
            </Text>
          )}
        </div>

        {/* mensaje de avisos */}
        {mensajeUso ? (
          <>
            <div>
              <Alert
                title="Instrucciones de Uso"
                description={
                  <>
                    <p>
                      Este módulo permite solicitar materiales de forma
                      selectiva:
                    </p>
                    <ul>
                      <li>
                        Los items de <strong>nivel 2</strong> siempre muestran
                        un checkbox "Solicitar"
                      </li>
                      <li>
                        <strong>Regla importante:</strong> Los niveles 2 pueden
                        enviarse aunque no tengan hijos nivel 3
                      </li>
                      <li>
                        Los niveles 2 con hijos permiten seleccionar hijos
                        específicos
                      </li>
                      <li>
                        Si selecciona al menos 1 hijo, automáticamente se
                        incluirá el padre en la solicitud
                      </li>
                      <li>
                        Puede usar los botones "Seleccionar todos" /
                        "Deseleccionar todos" para gestionar checkboxes
                        rápidamente
                      </li>
                      <li>
                        Ingrese la cantidad deseada en el campo numérico (tanto
                        para padres como para hijos)
                      </li>
                      <li>
                        <strong>Nota:</strong> Solo se enviarán los items que
                        tengan el checkbox "Solicitar" marcado o tengan hijos
                        seleccionados, con una cantidad mayor a 0
                      </li>
                    </ul>
                  </>
                }
                type="info"
              />

              <span style={{ color: "red" }}>
                Si ya está claro, haz clic en <strong>Entendido</strong> para
                comenzar a solicitar material.
              </span>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <GreenButton
                  style={{ marginTop: "5px" }}
                  onClick={() => setMensajeUso(false)}
                >
                  Entendido
                </GreenButton>
              </div>
            </div>
          </>
        ) : (
          <>
            {bloquesFiltrados.length > 0 ? (
              <Collapse
                defaultActiveKey={bloquesFiltrados.map((b) => b.bloque)}
              >
                {bloquesFiltrados.map((bloque) => RenderBloque(bloque))}
              </Collapse>
            ) : (
              <Alert
                message={
                  searchTerm
                    ? "No se encontraron resultados para la búsqueda"
                    : "No hay datos de proyección"
                }
                type="warning"
                showIcon
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};