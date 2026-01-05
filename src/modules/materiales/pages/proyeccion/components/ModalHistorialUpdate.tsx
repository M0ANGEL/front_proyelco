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
} from "antd";
import {
  AiOutlineFileSync,
  AiOutlineDownload,
  AiOutlineHistory,
} from "react-icons/ai";
import { BASE_URL } from "@/config/api";


interface CambioHistorial {
  id: number;
  user_id: number;
  version_edicion: string;
  proyecto: string;
  codigo_proyecto: string;
  codigo_insumo: string;
  descripcion: string;
  padre: string;
  nivel: string;
  um: string;
  cant_old: string;
  cant_modificada: string;
  cant_final: string;
  cant_apu_old: string;
  cant_apu_modificada: string;
  cant_apu_final: string;
  fecha_modificacion: string;
  created_at: string;
  updated_at: string;
}

interface VersionGroup {
  version_edicion: string;
  fecha_modificacion: string;
  proyecto: string;
  codigo_proyecto: string;
  cantidad_modificados: number;
  items: CambioHistorial[];
}

interface VerDocumentoProps {
  documento_id: string;
  nombreProyecto: string;
}

export const ModalHistorialUpdate = ({
  documento_id,
  nombreProyecto,
}: VerDocumentoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historial, setHistorial] = useState<CambioHistorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const abrirModal = async () => {
    if (!documento_id) {
      console.error("documento_id no definido");
      return;
    }

    setIsModalOpen(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}getHistorialCcambiosProyeccion/${documento_id}`,
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
        setHistorial(data.data);
      } else if (Array.isArray(data)) {
        setHistorial(data);
      } else {
        setHistorial([]);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistorial([]);
      message.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  // Agrupar por versión_edicion
  const agruparPorVersion = (): VersionGroup[] => {
    const grupos: { [key: string]: VersionGroup } = {};

    historial.forEach((item) => {
      const key = item.version_edicion;

      if (!grupos[key]) {
        grupos[key] = {
          version_edicion: key,
          fecha_modificacion: item.fecha_modificacion,
          proyecto: item.proyecto,
          codigo_proyecto: item.codigo_proyecto,
          cantidad_modificados: 0,
          items: [],
        };
      }

      // Verificar si es una modificación real (cant_modificada > 0 o cant_apu_modificada > 0)
      const cantMod = parseFloat(item.cant_modificada) || 0;
      const cantApuMod = parseFloat(item.cant_apu_modificada) || 0;

      if (cantMod > 0 || cantApuMod > 0) {
        grupos[key].cantidad_modificados++;
      }

      grupos[key].items.push(item);
    });

    return Object.values(grupos).sort((a, b) => {
      return parseInt(b.version_edicion) - parseInt(a.version_edicion);
    });
  };


  const descargarExcelVersion = async (version: VersionGroup) => {
    setDownloading(version.version_edicion);

    try {
      // Enviar petición al NUEVO endpoint de historial con la versión específica
      const response = await fetch(`${BASE_URL}generar-excel-version`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          codigo_proyecto: version.codigo_proyecto,
          version_edicion: version.version_edicion, // Enviar versión específica
          fecha: version.fecha_modificacion,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || `Error ${response.status}`);
        } catch {
          throw new Error(
            `Error ${response.status}: ${errorText.substring(0, 100)}...`
          );
        }
      }

      // Obtener el blob
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("El archivo Excel está vacío");
      }

      // Descargar archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial_v${version.version_edicion}_${version.codigo_proyecto}.xlsx`;
      document.body.appendChild(a);
      a.click();

      // Limpiar
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      message.success(`Excel de versión ${version.version_edicion} generado`);
    } catch (error: any) {
      console.error("Error descargando Excel:", error);
      message.error(`Error: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };
  const gruposVersion = agruparPorVersion();

  const columns = [
    {
      title: "Versión",
      dataIndex: "version_edicion",
      key: "version_edicion",
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
          V{text}
        </Tag>
      ),
      sorter: (a: VersionGroup, b: VersionGroup) =>
        parseInt(b.version_edicion) - parseInt(a.version_edicion),
      defaultSortOrder: "descend" as const,
    },
    {
      title: "Fecha Modificación",
      dataIndex: "fecha_modificacion",
      key: "fecha_modificacion",
      render: (text: string) => new Date(text).toLocaleString("es-ES"),
      sorter: (a: VersionGroup, b: VersionGroup) =>
        new Date(b.fecha_modificacion).getTime() -
        new Date(a.fecha_modificacion).getTime(),
    },
    {
      title: "Proyecto",
      dataIndex: "proyecto",
      key: "proyecto",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Código",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      width: 100,
    },
    {
      title: "Modificados",
      dataIndex: "cantidad_modificados",
      key: "cantidad_modificados",
      render: (cantidad: number, record: VersionGroup) => (
        <Badge
          count={cantidad}
          style={{
            backgroundColor: cantidad > 0 ? "#52c41a" : "#d9d9d9",
            fontSize: "12px",
          }}
        />
      ),
      width: 100,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record: VersionGroup) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<AiOutlineDownload />}
            onClick={() => descargarExcelVersion(record)}
            loading={downloading === record.version_edicion}
          >
            Excel
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <>
      <Tooltip title="Ver Historial de Cambios">
        <Button
          type="default"
          size="small"
          onClick={abrirModal}
          style={{ marginLeft: "5px", background: "#4523ee", color: "white" }}
        >
          <AiOutlineHistory />
        </Button>
      </Tooltip>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cerrar" onClick={() => setIsModalOpen(false)}>
            Cerrar
          </Button>,
        ]}
        width={1200}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AiOutlineFileSync style={{ fontSize: "20px" }} />
            <span>Historial de Cambios - {nombreProyecto}</span>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p>Cargando historial...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={gruposVersion}
            rowKey="version_edicion"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} versiones`,
            }}
            locale={{
              emptyText:
                historial.length === 0
                  ? "No hay datos de historial disponibles"
                  : "No se encontraron versiones",
            }}
          />
        )}
      </Modal>
    </>
  );
};
