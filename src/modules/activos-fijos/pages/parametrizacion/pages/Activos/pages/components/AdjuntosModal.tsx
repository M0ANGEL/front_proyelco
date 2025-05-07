import { useEffect, useState } from "react";
import { Modal, Table, Button, message, Tooltip, Image } from "antd";
import { DownloadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { descargarAdjuntos, eliminarAdjunto, getAdjuntosActivos } from "@/services/activos/activosAPI";
import { FILES_ACTIVOS_URL } from "@/config/api";

// Definición de tipos
interface Archivo {
  key: string;
  nombre: string;
  fecha_carga: string;
  carpeta: string;
}

interface Carpeta {
  key: string;
  nombre: string;
  archivos: Archivo[];
}

interface ModalArchivosMantenimientoProps {
  visible: boolean;
  onClose: () => void;
  activoModalId: number;
  hideDeleteButton?: boolean;
}

const ModalArchivosMantenimiento: React.FC<ModalArchivosMantenimientoProps> = ({
  visible,
  onClose,
  activoModalId,
  hideDeleteButton = false,
}) => {
  const [archivos, setArchivos] = useState<Carpeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      obtenerArchivos(activoModalId);
    }
  }, [visible, activoModalId]);

  const obtenerArchivos = async (id: number) => {
    setLoading(true);
    setArchivos([]);
    try {
      const response = await getAdjuntosActivos(id);
      if (response.data.status === "success") {
        const datosArchivos: Carpeta[] = response.data.data.map((carpeta: { carpeta: string; archivos: any[] }) => ({
          key: carpeta.carpeta,
          nombre: carpeta.carpeta,
          archivos: carpeta.archivos.map(archivo => ({
            key: archivo.nombre,
            nombre: archivo.nombre,
            fecha_carga: archivo.fecha_carga,
            carpeta: carpeta.carpeta,
          })),
        }));
        setArchivos(datosArchivos);
      } else {
        message.info(response.data.message || "Error al cargar los archivos.");
      }
    } catch (error: any) {
      message.warning(error.response?.data?.message || "Error al obtener archivos.");
    } finally {
      setLoading(false);
    }
  };

  const descargarArchivo = async (nombreArchivo: string, carpeta: string) => {
    try {
      const response = await descargarAdjuntos(activoModalId, nombreArchivo, carpeta);
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreArchivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        message.error("Error al descargar el archivo.");
      }
    } catch (error) {
      message.error("Error al descargar el archivo.");
    }
  };

  const eliminarArchivoHandler = async (nombreArchivo: string, carpeta: string) => {
    try {
      const response = await eliminarAdjunto(activoModalId, nombreArchivo, carpeta);
      if (response.data.status === "success") {
        message.success("Archivo eliminado correctamente.");
        obtenerArchivos(activoModalId);
      } else {
        message.error("Error al eliminar el archivo.");
      }
    } catch (error) {
      message.error("Error al eliminar el archivo.");
    }
  };

  // Función para verificar si el archivo es una imagen
  const esImagen = (nombreArchivo: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(nombreArchivo);
  };

  const mostrarVistaPrevia = (nombreArchivo: string, carpeta: string) => {
    const imageUrl = `${FILES_ACTIVOS_URL}Activos/${activoModalId}/${carpeta}/${nombreArchivo}`; // Ajusta la URL
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };
  const columnas = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      render: (text: string, record: Archivo) =>
        esImagen(record.nombre) ? (
          <Tooltip title="Ver imagen">
            <Image
              src={`${FILES_ACTIVOS_URL}Activos/${activoModalId}/${record.carpeta}/${record.nombre}`} // Ajusta la URL
              alt={record.nombre}
              width={50}
              style={{ cursor: "pointer" }}
              preview={false}
              onClick={() => mostrarVistaPrevia(record.nombre, record.carpeta)}
            />
          </Tooltip>
        ) : (
          text
        ),
    },
    {
      title: "Fecha de Carga",
      dataIndex: "fecha_carga",
      key: "fecha_carga",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Archivo) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {esImagen(record.nombre) && (
            <Tooltip title="Ver imagen">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => mostrarVistaPrevia(record.nombre, record.carpeta)}
              />
            </Tooltip>
          )}
          <Tooltip title="Descargar">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => descargarArchivo(record.nombre, record.carpeta)}
            />
          </Tooltip>
          {!hideDeleteButton && (
            <Tooltip title="Eliminar">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => eliminarArchivoHandler(record.nombre, record.carpeta)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal visible={visible} title="Archivos del Mantenimiento" onCancel={onClose} footer={null} width={800}>
      {archivos.map(carpeta => (
        <div key={carpeta.key}>
          <h3>{carpeta.nombre}</h3>
          <Table columns={columnas} dataSource={carpeta.archivos} rowKey="key" loading={loading} pagination={false} />
        </div>
      ))}
      
      {/* Modal para la vista previa de imágenes */}
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} width={600}>
        {previewImage && <Image src={previewImage} alt="Vista previa" style={{ width: "100%" }} />}
      </Modal>
    </Modal>
  );
};

export default ModalArchivosMantenimiento;
