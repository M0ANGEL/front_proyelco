// Archivo: ModalArchivosMantenimiento.jsx

import { useEffect, useState } from "react";
import { Modal, Table, Button, message, Tooltip } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { descargarAdjuntos, eliminarAdjunto, getAdjuntos } from "@/services/activos/mantenimientoAPI";

interface ModalArchivosMantenimientoProps {
  visible: boolean; // El estado de visibilidad del modal
  onClose: () => void; // Función para cerrar el modal
  mantenimientoId: number; // ID del mantenimiento
}

const ModalArchivosMantenimiento: React.FC<ModalArchivosMantenimientoProps> = ({
  visible,
  onClose,
  mantenimientoId,
}) => {  
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      obtenerArchivos(mantenimientoId);
    }
  }, [visible, mantenimientoId]);

  // Función para obtener los archivos del mantenimiento desde el backend
  const obtenerArchivos = async (id: number) => {
    setLoading(true);
    try {
      const response = await getAdjuntos(id);
      if (response.data.status === "success") {
        setArchivos(response.data.data);
      } else {
        message.error("Error al cargar los archivos del mantenimiento.");
      }
    } catch (error) {
      message.error("Error al cargar los archivos.");
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar un archivo desde el backend
  const descargarArchivo = async (nombreArchivo: string) => {
    try {
      const response = await descargarAdjuntos(mantenimientoId, nombreArchivo);
      
      if (response.status === 200) {
        // Crear un enlace de descarga para el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreArchivo); // Nombre de descarga
        document.body.appendChild(link);
        link.click(); // Descarga automática
        document.body.removeChild(link);
      } else {
        message.error("Error al descargar el archivo.");
      }
    } catch (error) {
      message.error("Error al descargar el archivo.");
    }
  };

  // Función para eliminar un archivo
  const eliminarArchivoHandler = async (nombreArchivo: string) => {
    try {
      const response = await eliminarAdjunto(mantenimientoId, nombreArchivo);
      if (response.status === "success") {
        message.success("Archivo eliminado correctamente.");
        obtenerArchivos(mantenimientoId); // Actualiza la lista de archivos
      } else {
        message.error("Error al eliminar el archivo.");
      }
    } catch (error) {
      message.error("Error al eliminar el archivo.");
    }
  };

  // Columnas de la tabla que muestra los archivos
  const columnas = [
    {
      title: "Nombre del Archivo",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Fecha de Carga",
      dataIndex: "fecha_carga",
      key: "fecha_carga",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: { nombre: string; }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Descargar">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => descargarArchivo(record.nombre)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => eliminarArchivoHandler(record.nombre)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="Archivos del Mantenimiento"
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        columns={columnas}
        dataSource={archivos}
        rowKey={(record) => record.nombre}
        loading={loading}
        pagination={false}
      />
    </Modal>
  );
};

export default ModalArchivosMantenimiento;
