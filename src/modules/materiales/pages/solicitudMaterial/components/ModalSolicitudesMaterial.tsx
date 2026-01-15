import { useState } from "react";
import {
  Button,
  Modal,
  Tooltip,
  Table,
  Space,
  Badge,
  Tag,
  message,
  Spin,
  Typography,
  Input,
  Form,
  Grid,
} from "antd";
import {
  AiOutlineFileSync,
  AiOutlineDownload,
  AiOutlineHistory,
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineFileAdd,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import { BASE_URL } from "@/config/api";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface SolicitudMaterial {
  id: number;
  user_id: number;
  numero_solicitud: string;
  numero_solicitud_sinco: string | null;
  codigo_proyecto: string;
  codigo_item: string;
  codigo_insumo: string;
  descripcion: string;
  padre: string;
  nivel: number;
  um: string;
  cant_unitaria: string;
  cant_solicitada: string;
  cant_total: string;
  fecha_solicitud: string;
  created_at: string;
  updated_at: string;
  tiene_pdf?: boolean; // Nueva propiedad para saber si tiene PDF
  pdf_url?: string; // URL del PDF si existe
}

interface SolicitudGroup {
  numero_solicitud: string;
  fecha_solicitud: string;
  codigo_proyecto: string;
  codigo_item: string;
  cantidad_items: number;
  estado: number;
  total_solicitado: number;
  items: SolicitudMaterial[];
  tiene_sinco: boolean;
  tiene_pdf: boolean; // Nueva propiedad para el grupo
  pdf_url?: string; // URL del PDF para el grupo
}

interface VerDocumentoProps {
  documento_id: string;
  nombreProyecto: string;
}

export const ModalSolicitudesMaterial = ({
  documento_id,
  nombreProyecto,
}: VerDocumentoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState<SolicitudMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [descargandoPDF, setDescargandoPDF] = useState<string | null>(null);
  const [editandoSinco, setEditandoSinco] = useState<string | null>(null);
  const [valorSinco, setValorSinco] = useState<{ [key: string]: string }>({});
  const [guardandoSinco, setGuardandoSinco] = useState<string | null>(null);
  const [subiendoPDF, setSubiendoPDF] = useState<string | null>(null);
  const [pdfsDisponibles, setPdfsDisponibles] = useState<{
    [key: string]: boolean;
  }>({});
  const [form] = Form.useForm();

  // Usar breakpoints para responsividad
  const screens = useBreakpoint();

  // Calcular ancho del modal basado en el tamaño de pantalla
  const getModalWidth = () => {
    if (screens.xxl) return 1600;
    if (screens.xl) return 1400;
    if (screens.lg) return 1200;
    if (screens.md) return 1000;
    if (screens.sm) return 800;
    return "90%";
  };

  // Calcular columnas responsivas
  const getResponsiveColumns = () => {
    const baseColumns = [
      {
        title: "Solicitud",
        dataIndex: "numero_solicitud",
        key: "numero_solicitud",
        render: (text: string, record: SolicitudGroup) => (
          <div>
            <Tag
              color="green"
              style={{ fontSize: "14px", padding: "4px 8px", marginBottom: 4 }}
            >
              {text}
            </Tag>
            {record.tiene_pdf && (
              <div>
                <Badge
                  dot
                  color="green"
                  style={{ marginRight: 4 }}
                  title="Tiene PDF adjunto"
                />
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  PDF disponible
                </Text>
              </div>
            )}
          </div>
        ),
        sorter: (a: SolicitudGroup, b: SolicitudGroup) => {
          const aParts = a.numero_solicitud.split("-");
          const bParts = b.numero_solicitud.split("-");
          const aSec = parseInt(aParts[aParts.length - 1]) || 0;
          const bSec = parseInt(bParts[bParts.length - 1]) || 0;
          return bSec - aSec;
        },
        defaultSortOrder: "descend" as const,
        width: screens.lg ? 120 : 100,
      },
      {
        title: "SINCO",
        key: "numero_solicitud_sinco",
        render: (_: any, record: SolicitudGroup) => {
          const tieneSinco =
            record.tiene_sinco || !!valorSinco[record.numero_solicitud];
          const editando = editandoSinco === record.numero_solicitud;

          if (editando) {
            return (
              <Form form={form} layout="inline">
                <Space
                  direction={screens.md ? "horizontal" : "vertical"}
                  size="small"
                >
                  <Form.Item
                    name="sinco"
                    rules={[
                      { required: true, message: "Ingrese SINCO" },
                      { min: 1, message: "Mínimo 1 carácter" },
                    ]}
                    style={{ marginBottom: screens.md ? 0 : 8 }}
                  >
                    <Input
                      placeholder="N° SINCO"
                      style={{ width: screens.md ? 120 : "100%" }}
                      disabled={guardandoSinco === record.numero_solicitud}
                      size="small"
                    />
                  </Form.Item>
                  <Space size="small">
                    <Button
                      type="primary"
                      size="small"
                      icon={<AiOutlineCheck />}
                      onClick={() => guardarSinco(record)}
                      loading={guardandoSinco === record.numero_solicitud}
                    >
                      {screens.md ? "Guardar" : ""}
                    </Button>
                    <Button
                      size="small"
                      onClick={cancelarEdicionSinco}
                      disabled={guardandoSinco === record.numero_solicitud}
                    >
                      {screens.md ? "Cancelar" : "X"}
                    </Button>
                  </Space>
                </Space>
              </Form>
            );
          }

          return (
            <div>
              {tieneSinco ? (
                <>
                  <Tag
                    color="green"
                    style={{
                      fontSize: "14px",
                      padding: "4px 8px",
                      marginBottom: 4,
                    }}
                  >
                    {valorSinco[record.numero_solicitud] || "SINCO"}
                  </Tag>
                </>
              ) : (
                <Button
                  type="dashed"
                  size="small"
                  icon={<AiOutlineEdit />}
                  onClick={() => iniciarEdicionSinco(record)}
                  style={{ fontSize: screens.md ? "inherit" : "11px" }}
                >
                  {screens.md ? "Agregar # SINCO" : "SINCO"}
                </Button>
              )}
            </div>
          );
        },
        width: screens.lg ? 180 : 120,
      },
    ];

    // Columnas que se muestran en pantallas medianas y grandes
    const mediumColumns = screens.md
      ? [
          {
            title: "Fecha",
            dataIndex: "fecha_solicitud",
            key: "fecha_solicitud",
            render: (text: string) => (
              <Text style={{ fontSize: screens.lg ? "inherit" : "12px" }}>
                {new Date(text).toLocaleDateString("es-ES")}
              </Text>
            ),
            sorter: (a: SolicitudGroup, b: SolicitudGroup) =>
              new Date(b.fecha_solicitud).getTime() -
              new Date(a.fecha_solicitud).getTime(),
            width: screens.lg ? 120 : 90,
          },
          {
            title: "Item",
            dataIndex: "codigo_item",
            key: "codigo_item",
            width: screens.lg ? 80 : 60,
          },
          {
            title: "Items",
            dataIndex: "cantidad_items",
            key: "cantidad_items",
            render: (cantidad: number) => (
              <Badge
                count={cantidad}
                style={{
                  backgroundColor: "#1890ff",
                  fontSize: "12px",
                }}
              />
            ),
            width: 70,
          },
          {
            title: "Total",
            dataIndex: "total_solicitado",
            key: "total_solicitado",
            render: (total: number) => (
              <Text
                strong
                style={{
                  color: "#52c41a",
                  fontSize: screens.md ? "inherit" : "12px",
                }}
              >
                {total.toFixed(2)}
              </Text>
            ),
            width: screens.lg ? 100 : 80,
          },
        ]
      : [];

    // Acciones - siempre visibles
    const actionsColumn = {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: SolicitudGroup) => {
        const tienePDF =
          record.tiene_pdf || pdfsDisponibles[record.numero_solicitud];

        return (
          <Space
            direction={screens.sm ? "horizontal" : "vertical"}
            size="small"
          >
            {/* Botón Excel */}
            <Tooltip title="Descargar Excel">
              <Button
                type="primary"
                size="small"
                icon={<AiOutlineDownload />}
                onClick={() => descargarExcelSolicitud(record)}
                loading={downloading === record.numero_solicitud}
                style={{
                  minWidth: screens.sm ? "auto" : "100%",
                  background: "#1890ff",
                }}
              >
                {screens.sm ? "Excel" : ""}
              </Button>
            </Tooltip>

            {/* Botón Subir PDF */}
            {record.tiene_pdf ? (
              ""
            ) : (
              <Tooltip title="Subir PDF">
                <Button
                  type="default"
                  size="small"
                  icon={<AiOutlineFileAdd />}
                  onClick={() => subirPDF(record)}
                  loading={subiendoPDF === record.numero_solicitud}
                  style={{
                    background: "#ff7a45",
                    color: "white",
                    borderColor: "#ff7a45",
                    minWidth: screens.sm ? "auto" : "100%",
                  }}
                >
                  {screens.sm ? "Subir PDF" : ""}
                </Button>
              </Tooltip>
            )}

            {/* Botón Descargar PDF (solo si tiene PDF) */}
            {tienePDF && (
              <Tooltip title="Descargar PDF">
                <Button
                  type="default"
                  size="small"
                  icon={<AiOutlineCloudDownload />}
                  onClick={() => descargarPDF(record)}
                  loading={descargandoPDF === record.numero_solicitud}
                  style={{
                    background: "#52c41a",
                    color: "white",
                    borderColor: "#52c41a",
                    minWidth: screens.sm ? "auto" : "100%",
                  }}
                >
                  {screens.sm ? "PDF" : ""}
                </Button>
              </Tooltip>
            )}

            {/* Botón Detalles (solo en pantallas medianas+) */}
            {screens.md && (
              <Tooltip title="Ver Detalles">
                <Button
                  type="default"
                  size="small"
                  onClick={() => mostrarDetalles(record)}
                  style={{ minWidth: screens.sm ? "auto" : "100%" }}
                >
                  Detalles
                </Button>
              </Tooltip>
            )}
          </Space>
        );
      },
      width: screens.lg ? 220 : screens.md ? 180 : 120,
    };

    return [...baseColumns, ...mediumColumns, actionsColumn];
  };

  const abrirModal = async () => {
    if (!documento_id) {
      console.error("documento_id no definido");
      return;
    }

    setIsModalOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}getHistorialSolicitudes/${documento_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        setSolicitudes(data.data);
        const valores: { [key: string]: string } = {};
        const pdfs: { [key: string]: boolean } = {};

        data.data.forEach((item: SolicitudMaterial) => {
          if (item.numero_solicitud_sinco) {
            valores[item.numero_solicitud] = item.numero_solicitud_sinco;
          }
          if (item.tiene_pdf) {
            pdfs[item.numero_solicitud] = true;
          }
        });

        setValorSinco(valores);
        setPdfsDisponibles(pdfs);

        // También verificar PDFs existentes
        await verificarPDFsExistentes(data.data);
      } else if (Array.isArray(data)) {
        setSolicitudes(data);
        const valores: { [key: string]: string } = {};
        const pdfs: { [key: string]: boolean } = {};

        data.forEach((item: SolicitudMaterial) => {
          if (item.numero_solicitud_sinco) {
            valores[item.numero_solicitud] = item.numero_solicitud_sinco;
          }
          if (item.tiene_pdf) {
            pdfs[item.numero_solicitud] = true;
          }
        });

        setValorSinco(valores);
        setPdfsDisponibles(pdfs);

        await verificarPDFsExistentes(data);
      } else {
        setSolicitudes([]);
        setValorSinco({});
        setPdfsDisponibles({});
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      setSolicitudes([]);
      setValorSinco({});
      setPdfsDisponibles({});
      message.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // Verificar qué PDFs existen en el servidor
  const verificarPDFsExistentes = async (
    solicitudesData: SolicitudMaterial[]
  ) => {
    try {
      const solicitudesUnicas = [
        ...new Set(solicitudesData.map((s) => s.numero_solicitud)),
      ];
      const verificaciones = solicitudesUnicas.map(async (numeroSolicitud) => {
        try {
          const response = await fetch(`${BASE_URL}verificar-pdf-solicitud`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({
              numero_solicitud: numeroSolicitud,
              codigo_proyecto: solicitudesData[0]?.codigo_proyecto,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && data.data?.existe) {
              return { numeroSolicitud, existe: true };
            }
          }
        } catch (error) {
          console.error(
            `Error verificando PDF para ${numeroSolicitud}:`,
            error
          );
        }
        return { numeroSolicitud, existe: false };
      });

      const resultados = await Promise.all(verificaciones);
      const nuevosPdfs: { [key: string]: boolean } = {};

      resultados.forEach((result) => {
        if (result.existe) {
          nuevosPdfs[result.numeroSolicitud] = true;
        }
      });

      setPdfsDisponibles((prev) => ({ ...prev, ...nuevosPdfs }));
    } catch (error) {
      console.error("Error verificando PDFs:", error);
    }
  };

  // Agrupar por número de solicitud
  const agruparPorSolicitud = (): SolicitudGroup[] => {
    const grupos: { [key: string]: SolicitudGroup } = {};

    solicitudes.forEach((item) => {
      const key = item.numero_solicitud;

      if (!grupos[key]) {
        grupos[key] = {
          numero_solicitud: key,
          fecha_solicitud: item.fecha_solicitud,
          codigo_proyecto: item.codigo_proyecto,
          codigo_item: item.codigo_item,
          cantidad_items: 0,
          total_solicitado: 0,
          items: [],
          tiene_sinco: !!item.numero_solicitud_sinco,
          tiene_pdf: pdfsDisponibles[key] || false,
        };
      }

      grupos[key].cantidad_items++;
      grupos[key].total_solicitado += parseFloat(item.cant_total) || 0;
      grupos[key].items.push(item);

      if (item.numero_solicitud_sinco) {
        grupos[key].tiene_sinco = true;
      }

      // Actualizar estado de PDF si algún item lo tiene
      if (item.tiene_pdf || pdfsDisponibles[key]) {
        grupos[key].tiene_pdf = true;
      }
    });

    return Object.values(grupos).sort((a, b) => {
      return (
        new Date(b.fecha_solicitud).getTime() -
        new Date(a.fecha_solicitud).getTime()
      );
    });
  };

  const descargarExcelSolicitud = async (solicitud: SolicitudGroup) => {
    setDownloading(solicitud.numero_solicitud);

    try {
      const response = await fetch(`${BASE_URL}generar-excel-solicitud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          numero_solicitud: solicitud.numero_solicitud,
          codigo_proyecto: solicitud.codigo_proyecto,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al descargar Excel");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("El archivo Excel está vacío");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${solicitud.numero_solicitud}.xlsx`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      message.success(
        `Excel de solicitud ${solicitud.numero_solicitud} generado`
      );
    } catch (error: any) {
      console.error("Error descargando Excel:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const subirPDF = async (solicitud: SolicitudGroup) => {
    setSubiendoPDF(solicitud.numero_solicitud);

    // Crear un input de archivo temporal
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        setSubiendoPDF(null);
        return;
      }

      if (file.type !== "application/pdf") {
        message.error("Solo se permiten archivos PDF");
        setSubiendoPDF(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB límite
        message.error("El archivo no puede superar los 10MB");
        setSubiendoPDF(null);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("numero_solicitud", solicitud.numero_solicitud);
        formData.append("codigo_proyecto", solicitud.codigo_proyecto);

        const response = await fetch(`${BASE_URL}subir-pdf-solicitud`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Error al subir PDF");
        }

        const data = await response.json();

        if (data.status === "success") {
          // Actualizar estado de PDF disponible
          setPdfsDisponibles((prev) => ({
            ...prev,
            [solicitud.numero_solicitud]: true,
          }));

          message.success("PDF subido exitosamente");
        } else {
          throw new Error(data.message || "Error al subir PDF");
        }
      } catch (error: any) {
        console.error("Error subiendo PDF:", error);
        message.error(`Error: ${error.message}`);
      } finally {
        setSubiendoPDF(null);
      }
    };

    input.click();
  };

  const descargarPDF = async (solicitud: SolicitudGroup) => {
    setDescargandoPDF(solicitud.numero_solicitud);

    try {
      const response = await fetch(`${BASE_URL}descargar-pdf-solicitud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          numero_solicitud: solicitud.numero_solicitud,
          codigo_proyecto: solicitud.codigo_proyecto,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Si el PDF no existe
        if (response.status === 404) {
          setPdfsDisponibles((prev) => {
            const nuevos = { ...prev };
            delete nuevos[solicitud.numero_solicitud];
            return nuevos;
          });
          throw new Error("El PDF no está disponible");
        }

        throw new Error(errorText || "Error al descargar PDF");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("El archivo PDF está vacío");
      }

      // Verificar que sea un PDF
      if (!blob.type.includes("pdf")) {
        throw new Error("El archivo no es un PDF válido");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${solicitud.numero_solicitud}.pdf`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      message.success(
        `PDF de solicitud ${solicitud.numero_solicitud} descargado`
      );
    } catch (error: any) {
      console.error("Error descargando PDF:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setDescargandoPDF(null);
    }
  };

  const mostrarDetalles = (record: SolicitudGroup) => {
    Modal.info({
      title: `Detalles Solicitud ${record.numero_solicitud}`,
      width: screens.lg ? 1000 : screens.md ? 800 : "90%",
      content: (
        <div style={{ maxHeight: "500px", overflow: "auto" }}>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Tag color="green">Solicitud: {record.numero_solicitud}</Tag>
              {record.tiene_sinco && (
                <Tag color="blue">
                  SINCO: {valorSinco[record.numero_solicitud]}
                </Tag>
              )}
              {record.tiene_pdf && <Tag color="green">✓ PDF Disponible</Tag>}
            </Space>
          </div>
          <Table
            size="small"
            dataSource={record.items}
            columns={[
              {
                title: "Código",
                dataIndex: "codigo_insumo",
                key: "codigo_insumo",
                width: 120,
              },
              {
                title: "Descripción",
                dataIndex: "descripcion",
                key: "descripcion",
                ellipsis: true,
                width: 250,
              },
              {
                title: "Item",
                dataIndex: "codigo_item",
                key: "codigo_item",
                width: 80,
              },
              {
                title: "Cant. Unitaria",
                dataIndex: "cant_unitaria",
                key: "cant_unitaria",
                render: (text) => parseFloat(text).toFixed(2),
                width: 100,
              },
              {
                title: "Cant. Solicitada",
                dataIndex: "cant_solicitada",
                key: "cant_solicitada",
                render: (text) => parseFloat(text).toFixed(2),
                width: 100,
              },
              {
                title: "Total",
                dataIndex: "cant_total",
                key: "cant_total",
                render: (text) => (
                  <Text strong style={{ color: "#1890ff" }}>
                    {parseFloat(text).toFixed(2)}
                  </Text>
                ),
                width: 100,
              },
              {
                title: "UM",
                dataIndex: "um",
                key: "um",
                width: 80,
              },
              {
                title: "Estado",
                dataIndex: "estado",
                key: "estado",
                render: (text, record) => {
                  // Determinar el color según el valor
                  let color;
                  let texto;
                  switch (parseInt(text)) {
                    case 0:
                      color = "red"; // Rojo
                      texto = "Pendiente";
                      break;
                    case 1:
                      color = "#fac916"; // amarillo
                      texto = "Asignado";
                      break;
                    case 2:
                      color = "blue"; // azul
                      texto = "En Proceso";
                      break;
                    case 3:
                      color = "green"; // Verde
                      texto = "Completado";
                      break;
                    default:
                      //   color = "#1890ff"; // Color por defecto
                      //   texto = "Sin Data";
                      color = "#52c41a"; // Verde
                      texto = "Completado";
                  }

                  return (
                    <Text strong style={{ color }}>
                      {texto}
                    </Text>
                  );
                },
                width: 100,
              },
            ]}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            scroll={{ x: screens.md ? 800 : 600 }}
          />
        </div>
      ),
    });
  };

  const iniciarEdicionSinco = (solicitud: SolicitudGroup) => {
    setEditandoSinco(solicitud.numero_solicitud);
    form.setFieldsValue({
      sinco: valorSinco[solicitud.numero_solicitud] || "",
    });
  };

  const cancelarEdicionSinco = () => {
    setEditandoSinco(null);
  };

  const guardarSinco = async (solicitud: SolicitudGroup) => {
    setGuardandoSinco(solicitud.numero_solicitud);

    try {
      const values = await form.validateFields();
      const numeroSinco = values.sinco;

      if (!numeroSinco || numeroSinco.trim() === "") {
        message.error("El número SINCO no puede estar vacío");
        return;
      }

      const response = await fetch(`${BASE_URL}actualizar-solicitud-sinco`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          numero_solicitud: solicitud.numero_solicitud,
          numero_solicitud_sinco: numeroSinco,
          codigo_proyecto: solicitud.codigo_proyecto,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al guardar");
      }

      const data = await response.json();

      if (data.status === "success") {
        setValorSinco((prev) => ({
          ...prev,
          [solicitud.numero_solicitud]: numeroSinco,
        }));

        setSolicitudes((prev) =>
          prev.map((item) =>
            item.numero_solicitud === solicitud.numero_solicitud
              ? { ...item, numero_solicitud_sinco: numeroSinco }
              : item
          )
        );

        setEditandoSinco(null);
        message.success("Número SINCO guardado exitosamente");
      } else {
        throw new Error(data.message || "Error al guardar");
      }
    } catch (error: any) {
      console.error("Error guardando SINCO:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setGuardandoSinco(null);
    }
  };

  const gruposSolicitud = agruparPorSolicitud();

  return (
    <>
      <Tooltip title="Ver Solicitudes de Materiales">
        <Button
          type="default"
          size="small"
          onClick={abrirModal}
          style={{ marginLeft: "5px", background: "#722ed1", color: "white" }}
        >
          <AiOutlineHistory />
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setEditandoSinco(null);
          setIsModalOpen(false);
        }}
        footer={[
          <Button
            key="cerrar"
            onClick={() => {
              setEditandoSinco(null);
              setIsModalOpen(false);
            }}
          >
            Cerrar
          </Button>,
        ]}
        width={getModalWidth()}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          padding: screens.sm ? "24px" : "16px",
        }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <AiOutlineFileSync style={{ fontSize: "20px" }} />
            <span style={{ fontSize: screens.md ? "16px" : "14px" }}>
              Solicitudes de Materiales - {nombreProyecto}
            </span>
            {solicitudes.length > 0 && screens.md && (
              <>
                <Tag color="orange" style={{ marginLeft: "auto" }}>
                  Solicitudes: {gruposSolicitud.length}
                </Tag>
                <Tag color="green">
                  PDFs: {Object.keys(pdfsDisponibles).length}
                </Tag>
              </>
            )}
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p>Cargando solicitudes...</p>
          </div>
        ) : (
          <>
            <Table
              columns={getResponsiveColumns()}
              dataSource={gruposSolicitud}
              rowKey="numero_solicitud"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} solicitudes`,
                size: screens.md ? "default" : "small",
                simple: !screens.md,
              }}
              locale={{
                emptyText:
                  solicitudes.length === 0
                    ? "No hay solicitudes disponibles"
                    : "No se encontraron solicitudes",
              }}
              size={screens.md ? "default" : "small"}
              scroll={{ x: screens.sm ? 700 : 500 }}
            />
          </>
        )}
      </Modal>
    </>
  );
};
