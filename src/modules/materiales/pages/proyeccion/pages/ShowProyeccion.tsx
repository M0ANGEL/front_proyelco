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
} from "antd";
import { getProyeccionUnica } from "@/services/material/ProyeccionesAPI";
import { PostgenerarExcelAxuiliarMaterial } from "@/services/material/ProyeccionesAPI"; // 👈 Importar el servicio correcto
import { useState, useEffect, useMemo } from "react";
import {
  FileTextOutlined,
  FolderOutlined,
  CaretDownOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

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

export const ShowProyeccion = () => {
  const { codigo_proyecto } = useParams<{ codigo_proyecto: string }>();
  const navigate = useNavigate();
  const [bloques, setBloques] = useState<BloqueProyeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [guardando, setGuardando] = useState(false);

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
          // Inicializar cantidades en 0 para todos los niveles 2
          const initialCantidades: Record<number, number> = {};
          response.data.data.forEach((bloque: BloqueProyeccion) => {
            bloque.items.forEach((item: ProyeccionItem) => {
              if (item.nivel === 2) {
                initialCantidades[item.id] = 0; // 👈 Todos empiezan en 0
              }
            });
          });
          setCantidades(initialCantidades);
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

  const getTipoInsumoColor = (tipo: string) =>
    ({ V: "red", M: "blue", T: "green", A: "orange" }[tipo] || "default");

  const getTipoInsumoText = (tipo: string) =>
    ({ V: "ACTIVIDAD", M: "MATERIAL", T: "TRANSPORTE", A: "APU" }[tipo] ||
    "OTRO");

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

    const cantApu = parseFloat(record.cant_total || "0");

    if (value > cantApu) {
      message.error(`No puede ingresar un valor mayor a ${cantApu}`);
      return;
    }

    setCantidades((prev) => ({
      ...prev,
      [record.id]: value,
    }));
  };

  // Función para enviar las cantidades - MODIFICADA PARA USAR EL SERVICIO CORRECTO
  const enviarCantidades = async () => {
    setGuardando(true);

    try {
      // Preparar los datos para enviar
      const datosAEnviar = Object.entries(cantidades)
        .filter(([id, cantidad]) => {
          let itemEncontrado = false;
          bloques.forEach((bloque) => {
            const item = bloque.items.find((p) => p.id === parseInt(id));
            if (item && item.nivel === 2 && cantidad > 0) {
              itemEncontrado = true;
            }
          });
          return itemEncontrado;
        })
        .map(([id, cantidad]) => {
          const item = bloques
            .flatMap((b) => b.items)
            .find((p) => p.id === parseInt(id));
          return {
            id: parseInt(id),
            cantidad: cantidad,
            padre: item?.padre || "",
            codigo: item?.codigo || "",
            codigo_proyecto: codigo_proyecto,
            // Incluir otros datos que puedan ser necesarios
            descripcion: item?.descripcion || "",
            um: item?.um || "",
            cant_total: item?.cant_total || "0",
            valor_sin_iva: item?.valor_sin_iva || "0",
          };
        });

      if (datosAEnviar.length === 0) {
        message.warning("No hay cantidades para guardar");
        setGuardando(false);
        return;
      }

      console.log("Enviando datos:", datosAEnviar);

      // Llamar a la API para generar el Excel usando el servicio correcto
      const response = await PostgenerarExcelAxuiliarMaterial({
        items: datosAEnviar,
        codigo_proyecto: codigo_proyecto,
        fecha: new Date().toISOString(),
      });

      message.success("Cantidades guardadas y Excel generado correctamente");
      console.log("Respuesta del servidor:", response);
    } catch (error: any) {
      console.error("Error al guardar cantidades:", error);
      message.error(`Error al guardar las cantidades: ${error.message}`);
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
    // TODOS los niveles 2 tienen input ahora (tengan o no hijos)
    const mostrarInput = true;

    const columnasNivel3 = [
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
        title: "Tipo",
        dataIndex: "tipo_insumo",
        key: "tipo_insumo",
        width: 120,
        render: (tipo: string) =>
          tipo && (
            <Tag color={getTipoInsumoColor(tipo)}>
              {getTipoInsumoText(tipo)}
            </Tag>
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
            cursor: tieneHijos ? "pointer" : "default",
          }}
          onClick={() => tieneHijos && togglePanel(item.id.toString())}
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
              <Text strong>{item.descripcion}</Text>{" "}
              <Tag color={getNivelColor(item.nivel)}>Nivel {item.nivel}</Tag>
              {/* {item.cant_apu && item.cant_apu !== "0.0000" && (
                <Tag color="purple">Cant. APU: {parseFloat(item.cant_apu).toFixed(2)}</Tag>
              )} */}
              {tieneHijos && <Tag color="orange">Nivel 3</Tag>}
            </Col>
            <Col
              flex="none"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {mostrarInput && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <InputNumber
                    min={0}
                    max={parseFloat(item.cant_total || "0")}
                    value={cantidades[item.id] || 0} // 👈 Siempre empieza en 0
                    onChange={(value) => handleCantidadChange(value, item)}
                    style={{ width: "100px" }}
                    precision={2}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Máx: {parseFloat(item.cant_total || "0").toFixed(2)}
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
                  {hijos.length} hijos
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {expandido && tieneHijos && (
          <div style={{ marginLeft: 20, marginTop: 8 }}>
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
            cursor: tieneHijos ? "pointer" : "default",
          }}
          onClick={() => tieneHijos && togglePanel(item.id.toString())}
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
              {tieneHijos && <Tag color="blue">Con hijos nivel 2</Tag>}
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
                  {hijos.length} hijos nivel 2
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
            <Text style={{ color: "white", marginRight: "50px" }} strong>
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
            style={{ padding: 0 }}
          >
            Volver atrás
          </Button>
        </Row>

        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Title level={3}>Detalles de la Proyección</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              onClick={enviarCantidades}
              loading={guardando}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar Cantidades"}
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

        {bloquesFiltrados.length > 0 ? (
          <Collapse defaultActiveKey={bloquesFiltrados.map((b) => b.bloque)}>
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
      </Card>
    </div>
  );
};
