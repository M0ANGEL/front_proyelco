import { useEffect, useState } from "react";
import { Modal, Table, Button, message, Tooltip, Collapse } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { descargarAdjuntosRetorno, eliminarAdjuntosRetorno, getAdjuntosRetorno } from "@/services/activos/retornoActivosProovedorAPI";

const { Panel } = Collapse;

interface ModalArchivosRetornoProps {
  visible: boolean; // Estado de visibilidad del modal
  onClose: () => void; // Función para cerrar el modal
  activoModalId: number; // ID del activo relacionado
}

const ModalArchivosRetorno: React.FC<ModalArchivosRetornoProps> = ({
  visible,
  onClose,
  activoModalId,
}) => {  
  const [archivos, setArchivos] = useState<{ Retorno: any[]; ActaRetornoProovedor: any[] }>({
    Retorno: [],
    ActaRetornoProovedor: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      obtenerArchivos(activoModalId);
    }
  }, [visible, activoModalId]);

  // Función para obtener los archivos desde el backend y clasificarlos por carpeta
  const obtenerArchivos = async (id: number) => {
    setLoading(true);
    try {
      const response = await getAdjuntosRetorno(id);

      if (response.data.status === "success") {
        // Clasificar archivos por carpeta usando el campo 'carpeta' devuelto por el backend
        const archivosPorCarpeta = response.data.data.reduce(
          (acc: any, archivo: any) => {
            const { carpeta } = archivo; // 'carpeta' indica si es 'Retorno' o 'ActaRetornoProovedor'
            acc[carpeta] = acc[carpeta] ? [...acc[carpeta], archivo] : [archivo];
            return acc;
          },
          { Retorno: [], ActaRetornoProovedor: [] }
        );
        setArchivos(archivosPorCarpeta);
      } else {
        message.error("Error al cargar los archivos del activo.");
      }
    } catch (error) {
      message.error("Error al cargar los archivos.");
      console.error("Error en obtenerArchivos:", error); // Mostrar error detallado en la consola
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar un archivo desde el backend
  const descargarArchivo = async (nombreArchivo: string, carpeta: string) => {
    try {
      const response = await descargarAdjuntosRetorno(activoModalId, nombreArchivo, carpeta);
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

  // Función para eliminar un archivo
  const eliminarArchivoHandler = async (nombreArchivo: string, carpeta: string) => {
    try {
      const response = await eliminarAdjuntosRetorno(activoModalId, nombreArchivo, carpeta);
      if (response.data.status === "success") {
        message.success("Archivo eliminado correctamente.");
        obtenerArchivos(activoModalId); // Actualizar la lista de archivos
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
      render: (_: any, record: { nombre: string; carpeta: string }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Descargar">
            <Button
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => descargarArchivo(record.nombre, record.carpeta)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => eliminarArchivoHandler(record.nombre, record.carpeta)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="Archivos del Retorno del Activo"
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Collapse defaultActiveKey={["1"]}>
        {/* Panel para archivos de la carpeta "Retorno" */}
        <Panel header="Archivos de Retorno" key="1">
          <Table
            columns={columnas}
            dataSource={archivos.Retorno}
            rowKey={(record) => record.nombre}
            loading={loading}
            pagination={false}
          />
        </Panel>
        {/* Panel para archivos de la carpeta "ActaRetornoProovedor" */}
        <Panel header="Archivos de Acta de Retorno Proveedor" key="2">
          <Table
            columns={columnas}
            dataSource={archivos.ActaRetornoProovedor}
            rowKey={(record) => record.nombre}
            loading={loading}
            pagination={false}
          />
        </Panel>
      </Collapse>
    </Modal>
  );
};

export default ModalArchivosRetorno;
