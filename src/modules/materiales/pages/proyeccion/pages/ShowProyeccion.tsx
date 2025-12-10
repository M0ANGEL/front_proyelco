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
  Tooltip,
  Space,
  Radio,
} from "antd";
import {
  getProyeccionUnica,
  PostgenerarExcelAxuiliarMaterial,
  updateProyeccionItems,
} from "@/services/material/ProyeccionesAPI";
import { useState, useEffect, useMemo } from "react";
import {
  FileTextOutlined,
  FolderOutlined,
  CaretDownOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CalculatorOutlined,
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
  rend: string;
  iva: number;
  valor_sin_iva: string;
  tipo_insumo: string;
  agrupacion: string;
  cant_apu: string;
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

interface ItemModificado {
  id: number;
  tipo: "update";
  valor_anterior: number;
  valor_nuevo: number;
  nivel: number;
  operacion: "suma" | "resta" | null;
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
  const [itemsModificados, setItemsModificados] = useState<ItemModificado[]>(
    []
  );
  const [operaciones, setOperaciones] = useState<
    Record<number, "suma" | "resta" | null>
  >({});

  // Cargar datos iniciales
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
          // Inicializar cantidades con valores actuales para TODOS los niveles
          const initialCantidades: Record<number, number> = {};
          const initialOperaciones: Record<number, "suma" | "resta" | null> =
            {};
          response.data.data.forEach((bloque: BloqueProyeccion) => {
            bloque.items.forEach((item: ProyeccionItem) => {
              if (item.nivel === 1 || item.nivel === 2 || item.nivel === 3) {
                // NIVEL 1 usa 'cantidad', NIVELES 2 y 3 usan 'cant_apu'
                const cantidadInicial =
                  item.nivel === 1
                    ? parseFloat(item.cantidad || "0")
                    : parseFloat(item.cant_apu || "0");

                initialCantidades[item.id] = cantidadInicial;
                initialOperaciones[item.id] = null;
              }
            });
          });
          setCantidades(initialCantidades);
          setOperaciones(initialOperaciones);
          setItemsModificados([]);
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

    items.forEach((item) => {
      if (item.nivel === 1) {
        itemsNivel1.push(item);
      } else if (item.nivel === 2) {
        itemsNivel2.push(item);
      }
    });

    itemsNivel2.forEach((item) => {
      const key = item.padre;
      if (!hijosMap.has(key)) hijosMap.set(key, []);
      hijosMap.get(key)!.push(item);
    });

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

  // Filtrar bloques y items por término de búsqueda
  const bloquesFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return bloques;

    const searchTermLower = searchTerm.toLowerCase();

    return bloques
      .map((bloque) => {
        const itemsFiltrados = bloque.items.filter(
          (item) =>
            item.descripcion.toLowerCase().includes(searchTermLower) ||
            item.codigo.toLowerCase().includes(searchTermLower) ||
            item.agrupacion?.toLowerCase().includes(searchTermLower) ||
            item.codigo === searchTerm ||
            item.codigo.startsWith(searchTerm + ".") ||
            searchTerm.startsWith(item.codigo + ".")
        );

        if (itemsFiltrados.length === 0) return null;

        return {
          ...bloque,
          items: itemsFiltrados,
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

  // Función para manejar el cambio de operación
  const handleOperacionChange = (
    value: "suma" | "resta",
    record: ProyeccionItem
  ) => {
    const operacionAnterior = operaciones[record.id];

    // Si ya había una operación seleccionada y cambia la operación, resetear el input
    if (operacionAnterior && operacionAnterior !== value) {
      setCantidades((prev) => ({
        ...prev,
        [record.id]: 0, // Resetear a 0 cuando cambia la operación
      }));

      // Remover de items modificados si existía
      setItemsModificados((prev) =>
        prev.filter((item) => item.id !== record.id)
      );
    }

    setOperaciones((prev) => ({
      ...prev,
      [record.id]: value,
    }));
  };

  // Función para manejar el cambio en el InputNumber
  const handleCantidadChange = (
    value: number | null,
    record: ProyeccionItem
  ) => {
    if (value === null) value = 0;

    const valorAnterior = cantidades[record.id] || 0;
    const operacion = operaciones[record.id];

    setCantidades((prev) => ({
      ...prev,
      [record.id]: value,
    }));

    // Registrar modificación para TODOS los niveles
    if (
      valorAnterior !== value &&
      (record.nivel === 1 || record.nivel === 2 || record.nivel === 3)
    ) {
      const modificacionExistente = itemsModificados.findIndex(
        (item) => item.id === record.id && item.tipo === "update"
      );

      if (modificacionExistente >= 0) {
        const nuevosModificados = [...itemsModificados];
        nuevosModificados[modificacionExistente].valor_nuevo = value;
        nuevosModificados[modificacionExistente].operacion = operacion;
        setItemsModificados(nuevosModificados);
      } else {
        setItemsModificados((prev) => [
          ...prev,
          {
            id: record.id,
            tipo: "update",
            valor_anterior: valorAnterior,
            valor_nuevo: value,
            nivel: record.nivel,
            operacion: operacion,
          },
        ]);
      }
    }
  };

  // Función para obtener el texto del placeholder según la operación
  const getPlaceholderText = (operacion: "suma" | "resta" | null) => {
    if (!operacion) return "Cantidad";
    return operacion === "suma" ? "Cantidad a sumar" : "Cantidad a restar";
  };

  // Función para enviar todos los cambios a la BD
  const enviarCambios = async () => {
    if (itemsModificados.length === 0) {
      message.warning("No hay cambios para guardar");
      return;
    }

    setGuardando(true);

    try {
      // Preparar updates con tipo (1 para suma, 2 para resta)
      const updates = itemsModificados.map((item) => ({
        id: item.id,
        cant_solicitada: item.valor_nuevo,
        tipo: item.operacion === "suma" ? 1 : 2, // 1 = suma, 2 = resta
      }));

      console.log("Enviando updates:", { updates });

      // Ejecutar updates
      const response = await updateProyeccionItems(updates);

      if (response.data.status === "success") {
        message.success(
          `${updates.length} cantidades actualizadas correctamente`
        );
        setItemsModificados([]);

        // Recargar datos
        const reloadResponse = await getProyeccionUnica(codigo_proyecto!);
        if (reloadResponse?.data?.status === "success") {
          setBloques(reloadResponse.data.data);

          // Actualizar cantidades y operaciones para TODOS los niveles
          const nuevasCantidades: Record<number, number> = {};
          const nuevasOperaciones: Record<number, "suma" | "resta" | null> = {};
          reloadResponse.data.data.forEach((bloque: BloqueProyeccion) => {
            bloque.items.forEach((item: ProyeccionItem) => {
              if (item.nivel === 1 || item.nivel === 2 || item.nivel === 3) {
                // NIVEL 1 usa 'cantidad', NIVELES 2 y 3 usan 'cant_apu'
                const cantidadActualizada =
                  item.nivel === 1
                    ? parseFloat(item.cantidad || "0")
                    : parseFloat(item.cant_apu || "0");

                nuevasCantidades[item.id] = cantidadActualizada;
                nuevasOperaciones[item.id] = null;
              }
            });
          });
          setCantidades(nuevasCantidades);
          setOperaciones(nuevasOperaciones);
        }
      } else if (response.data.status === "partial") {
        // Algunos items se actualizaron, otros no
        message.warning(response.data.message);
        if (
          response.data.data.errores &&
          response.data.data.errores.length > 0
        ) {
          response.data.data.errores.forEach((error: string) => {
            message.error(error);
          });
        }

        // Recargar datos para reflejar los cambios exitosos
        const reloadResponse = await getProyeccionUnica(codigo_proyecto!);
        if (reloadResponse?.data?.status === "success") {
          setBloques(reloadResponse.data.data);

          const nuevasCantidades: Record<number, number> = {};
          const nuevasOperaciones: Record<number, "suma" | "resta" | null> = {};
          reloadResponse.data.data.forEach((bloque: BloqueProyeccion) => {
            bloque.items.forEach((item: ProyeccionItem) => {
              if (item.nivel === 1 || item.nivel === 2 || item.nivel === 3) {
                const cantidadActualizada =
                  item.nivel === 1
                    ? parseFloat(item.cantidad || "0")
                    : parseFloat(item.cant_apu || "0");

                nuevasCantidades[item.id] = cantidadActualizada;
                nuevasOperaciones[item.id] = null;
              }
            });
          });
          setCantidades(nuevasCantidades);
          setOperaciones(nuevasOperaciones);

          // Limpiar solo los items modificados que sí se actualizaron
          const itemsActualizados = response.data.data.actualizados.map(
            (a: any) => a.id
          );
          setItemsModificados((prev) =>
            prev.filter((item) => !itemsActualizados.includes(item.id))
          );
        }
      } else if (response.data.status === "error") {
        // Ningún item se actualizó
        message.error(response.data.message);
        if (
          response.data.data.errores &&
          response.data.data.errores.length > 0
        ) {
          response.data.data.errores.forEach((error: string) => {
            message.error(error);
          });
        }
      }
    } catch (error: any) {
      console.error("Error al guardar cambios:", error);
      message.error(
        `Error al guardar los cambios: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setGuardando(false);
    }
  };

  // Función para generar Excel - USA LA MISMA ESTRUCTURA QUE enviarCambios
  // const generarExcel = async () => {
  //   try {
  //     // USAR SOLO LOS ITEMS MODIFICADOS, igual que en enviarCambios
  //     if (itemsModificados.length === 0) {
  //       message.warning("No hay cambios para generar Excel");
  //       return;
  //     }

  //     // Preparar updates con la MISMA estructura que enviarCambios
  //     const updates = itemsModificados
  //       .filter((item) => item.valor_nuevo > 0) // Solo items con cantidad > 0
  //       .map((item) => ({
  //         id: item.id,
  //         cant_solicitada: item.valor_nuevo,
  //         tipo: item.operacion === "suma" ? 1 : 2, // 1 = suma, 2 = resta
  //       }));

  //     if (updates.length === 0) {
  //       message.warning("No hay cantidades modificadas para generar Excel");
  //       return;
  //     }

  //     console.log("Enviando updates para Excel:", { updates });

  //     await PostgenerarExcelAxuiliarMaterial({
  //       updates: updates, // Misma estructura que enviarCambios
  //       codigo_proyecto: codigo_proyecto,
  //       fecha: new Date().toISOString(),
  //     });

  //     message.success("Excel generado correctamente");
  //   } catch (error: any) {
  //     message.error(`Error al generar Excel: ${error.message}`);
  //   }
  // };

  const generarExcel = async () => {
  try {
    // USAR SOLO LOS ITEMS MODIFICADOS, igual que en enviarCambios
    if (itemsModificados.length === 0) {
      message.warning("No hay cambios para generar Excel");
      return;
    }

    // Preparar updates con la MISMA estructura que enviarCambios
    const updates = itemsModificados
      .filter((item) => item.valor_nuevo > 0) // Solo items con cantidad > 0
      .map((item) => ({
        id: item.id,
        cant_solicitada: item.valor_nuevo,
        tipo: item.operacion === "suma" ? 1 : 2, // 1 = suma, 2 = resta
      }));

    if (updates.length === 0) {
      message.warning("No hay cantidades modificadas para generar Excel");
      return;
    }

    console.log("Enviando updates para Excel:", { updates });

    const response = await PostgenerarExcelAxuiliarMaterial({
      updates: updates,
      codigo_proyecto: codigo_proyecto,
      fecha: new Date().toISOString(),
    });

    // Crear blob desde la respuesta
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Crear URL para el blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento link para descarga
    const link = document.createElement('a');
    link.href = url;
    
    // Generar nombre de archivo
    const fileName = `materiales_auxiliar_${codigo_proyecto}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.download = fileName;
    
    // Agregar al DOM y simular click
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success("Excel generado y descargado correctamente");

  } catch (error: any) {
    console.error('Error completo:', error);
    
    // Si el error viene como blob (posible Excel de error del backend)
    if (error.response?.data instanceof Blob) {
      try {
        const errorBlob = new Blob([error.response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const errorUrl = window.URL.createObjectURL(errorBlob);
        const errorLink = document.createElement('a');
        errorLink.href = errorUrl;
        errorLink.download = 'error_report.xlsx';
        document.body.appendChild(errorLink);
        errorLink.click();
        document.body.removeChild(errorLink);
        window.URL.revokeObjectURL(errorUrl);
        
        message.error("Se generó un archivo de error. Por favor revíselo.");
        return;
      } catch (blobError) {
        console.error('Error procesando blob de error:', blobError);
      }
    }
    
    message.error(`Error al generar Excel: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
  }
};

  // Obtener la cantidad total según el nivel
  const getCantidadTotal = (item: ProyeccionItem) => {
    // NIVEL 1 usa 'cantidad' como total, NIVELES 2 y 3 usan 'cant_apu'
    return item.nivel === 1
      ? parseFloat(item.cantidad || "0")
      : parseFloat(item.cant_apu || "0");
  };

  // Componente para mostrar el input de cantidad
  const RenderInputCantidad = ({ item }: { item: ProyeccionItem }) => {
    const mostrarInput =
      item.nivel === 1 || item.nivel === 2 || item.nivel === 3;
    const cantTotal = getCantidadTotal(item);
    const cantSolicitada = cantidades[item.id] || 0;
    const operacion = operaciones[item.id];

    if (!mostrarInput) return null;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Radio.Group
          size="small"
          value={operacion}
          onChange={(e) => handleOperacionChange(e.target.value, item)}
          style={{ marginRight: 8 }}
        >
          <Radio.Button value="suma">+</Radio.Button>
          <Radio.Button value="resta">-</Radio.Button>
        </Radio.Group>
        <InputNumber
          min={0}
          value={cantSolicitada}
          onChange={(value) => handleCantidadChange(value, item)}
          style={{ width: "120px" }}
          precision={2}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
          placeholder={getPlaceholderText(operacion)}
          disabled={!operacion}
        />
        <Tooltip title={`Cantidad total: ${cantTotal.toFixed(2)}`}>
          <Text
            type="secondary"
            style={{ fontSize: "12px", minWidth: "100px" }}
          >
            Total: {cantTotal.toFixed(2)}
          </Text>
        </Tooltip>
      </div>
    );
  };

  const RenderNivel2 = (
    item: ProyeccionItem,
    hijosMap: Map<string, ProyeccionItem[]>
  ) => {
    const hijos = hijosMap.get(item.id.toString()) || [];
    const tieneHijos = hijos.length > 0;
    const expandido = expandedPanels.includes(item.id.toString());

    const columnasNivel3 = [
      {
        title: "Código",
        dataIndex: "codigo",
        key: "codigo",
        width: 120,
        render: (codigo: string) => <Tag color="blue">{codigo}</Tag>,
      },
      {
        title: "Descripción",
        dataIndex: "descripcion",
        key: "descripcion",
        render: (text: string) => <Text>{text}</Text>,
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
      {
        title: "Operación",
        key: "operacion",
        width: 100,
        render: (_, record: ProyeccionItem) => (
          <Radio.Group
            size="small"
            value={operaciones[record.id]}
            onChange={(e) => handleOperacionChange(e.target.value, record)}
          >
            <Radio.Button value="suma">+</Radio.Button>
            <Radio.Button value="resta">-</Radio.Button>
          </Radio.Group>
        ),
      },
      {
        title: "Cantidad Solicitada",
        key: "cantidad",
        width: 150,
        render: (_, record: ProyeccionItem) => {
          const operacion = operaciones[record.id];
          return (
            <InputNumber
              min={0}
              value={cantidades[record.id] || 0}
              onChange={(value) => handleCantidadChange(value, record)}
              style={{ width: "100%" }}
              precision={2}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
              placeholder={getPlaceholderText(operacion)}
              disabled={!operacion}
            />
          );
        },
      },
      {
        title: "Total",
        key: "total",
        width: 100,
        render: (_, record: ProyeccionItem) => (
          <Tooltip
            title={`Cantidad total: ${getCantidadTotal(record).toFixed(2)}`}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {getCantidadTotal(record).toFixed(2)}
            </Text>
          </Tooltip>
        ),
      },
    ];

    return (
      <div key={item.id} style={{ marginBottom: 8, marginLeft: 20 }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: tieneHijos ? "#f8f9fa" : "#fff",
            border: "1px solid #e9ecef",
            transition: "all 0.3s",
          }}
        >
          <Row align="middle" gutter={[8, 8]}>
            <Col flex="none">
              {tieneHijos ? (
                <FolderOutlined
                  style={{ color: "#1890ff", fontSize: "16px" }}
                />
              ) : (
                <FileTextOutlined style={{ color: "#52c41a" }} />
              )}
            </Col>
            <Col flex="auto">
              <Row align="middle">
                <Col span={24}>
                  <Text strong>{item.descripcion}</Text>
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {item.codigo}
                  </Tag>
                </Col>
                <Col span={24}>
                  <Space size={[4, 4]} wrap>
                    <Tag color={getNivelColor(item.nivel)}>
                      Nivel {item.nivel}
                    </Tag>
                    {item.tipo_insumo && (
                      <Tag color={getTipoInsumoColor(item.tipo_insumo)}>
                        {getTipoInsumoText(item.tipo_insumo)}
                      </Tag>
                    )}
                    {tieneHijos && (
                      <Tag color="orange">{hijos.length} hijos</Tag>
                    )}
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col flex="none">
              <Space>
                <RenderInputCantidad item={item} />
                {tieneHijos && (
                  <Button
                    type="text"
                    icon={<CaretDownOutlined rotate={expandido ? 0 : -90} />}
                    size="small"
                    onClick={() => togglePanel(item.id.toString())}
                  />
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {expandido && tieneHijos && (
          <div style={{ marginLeft: 20, marginTop: 12 }}>
            <Table
              columns={columnasNivel3}
              dataSource={hijos}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 1000 }}
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
            padding: "16px 20px",
            borderRadius: 8,
            background: tieneHijos ? "#f0f8ff" : "#fff",
            border: "2px solid #1890ff",
            transition: "all 0.3s",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col flex="none">
              {tieneHijos ? (
                <FolderOutlined
                  style={{ color: "#1890ff", fontSize: "20px" }}
                />
              ) : (
                <FileTextOutlined
                  style={{ color: "#52c41a", fontSize: "20px" }}
                />
              )}
            </Col>
            <Col flex="auto" style={{ padding: "0 16px" }}>
              <Text strong style={{ fontSize: "16px" }}>
                {item.descripcion}
              </Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {item.codigo}
              </Tag>
              <div style={{ marginTop: 4 }}>
                <Space size={[4, 4]} wrap>
                  <Tag color={getNivelColor(item.nivel)}>
                    Nivel {item.nivel}
                  </Tag>
                  {tieneHijos && (
                    <Tag color="blue">{hijos.length} hijos nivel 2</Tag>
                  )}
                </Space>
              </div>
            </Col>
            <Col flex="none">
              <Space>
                {/* EL NIVEL 1 TAMBIÉN TIENE INPUT DE CANTIDAD */}
                <RenderInputCantidad item={item} />
                {tieneHijos && (
                  <Button
                    type="text"
                    icon={<CaretDownOutlined rotate={expandido ? 0 : -90} />}
                    size="small"
                    onClick={() => togglePanel(item.id.toString())}
                  >
                    {expandido ? "Ocultar" : "Mostrar"}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {expandido && tieneHijos && (
          <div style={{ marginTop: 12 }}>
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
            <Text strong style={{ color: "black", fontSize: "16px" }}>
              {tituloNivel1}
            </Text>
            <Tag style={{ marginLeft: 12 }} color="default">
              Código: {bloque.bloque}
            </Tag>
            <Tag style={{ marginLeft: 8 }} color="default">
              {bloque.items.length} items
            </Tag>
          </div>
        }
        key={bloque.bloque}
      >
        {itemsNivel1.length > 0 ? (
          itemsNivel1.map((item) => RenderNivel1(item, hijosMap))
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Alert
              message="No hay datos de nivel 1 en este bloque"
              type="warning"
              showIcon
            />
          </div>
        )}
      </Panel>
    );
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" tip="Cargando proyección..." />
      </div>
    );

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: 20 }}
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Volver
          </Button>
        }
      />
    );

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
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
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Gestión de Cantidades - Proyección
            </Title>
            <Text type="secondary">Código del proyecto: {codigo_proyecto}</Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<CalculatorOutlined />}
                onClick={generarExcel}
                disabled={
                  itemsModificados.filter((item) => item.valor_nuevo > 0)
                    .length === 0
                }
              >
                Generar Excel (
                {itemsModificados.filter((item) => item.valor_nuevo > 0).length}
                )
              </Button>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={enviarCambios}
                loading={guardando}
                disabled={guardando || itemsModificados.length === 0}
              >
                {guardando
                  ? "Guardando..."
                  : `Guardar Cambios (${itemsModificados.length})`}
              </Button>

              <Button onClick={() => setExpandedPanels([])}>
                Contraer Todos
              </Button>
            </Space>
          </Col>
        </Row>
        {/* Barra de búsqueda */}
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Buscar por código (ej: 4.001), descripción o agrupación..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 500 }}
          />
          {searchTerm && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              {bloquesFiltrados.flatMap((b) => b.items).length} resultados
              encontrados
            </Text>
          )}
        </div>

        {/* Contenido principal */}
        {bloquesFiltrados.length > 0 ? (
          <Collapse
            defaultActiveKey={bloquesFiltrados.map((b) => b.bloque)}
            style={{ background: "transparent" }}
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
      </Card>
    </div>
  );
};
