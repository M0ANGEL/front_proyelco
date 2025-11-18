import { GreenButton } from "@/components/layout/styled";
import { 
  exportReporteCompletoAsistenciasTH, 
  // exportReporteAsistenciasTH // ← Mantén este si quieres ambas opciones
} from "@/services/talento-humano/reporteAPI";
import { notification, Tooltip } from "antd";
import { saveAs } from "file-saver";
import { ImFileExcel } from "react-icons/im";

interface FiltrosProps {
  filtros: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  disabled?: boolean;
}

export const DescargarReporteAsistencias = ({ filtros, disabled = false }: FiltrosProps) => {

  const DescargarExcelAsistencias = async () => {
    // Validar que existan los filtros necesarios
    if (!filtros.fecha_inicio || !filtros.fecha_fin) {
      notification.warning({
        message: "Filtros incompletos",
        description: "Seleccione un rango de fechas válido para exportar.",
      });
      return;
    }

    // Notificación inicial
    notification.info({
      message: "Generando reporte completo...",
      description: "Estamos preparando su archivo Excel con toda la información.",
      duration: 2,
    });

    try {
      // Usar el nuevo servicio del reporte completo
      const response = await exportReporteCompletoAsistenciasTH(filtros);
      
      // Verificar si la respuesta es un blob válido (archivo Excel)
      if (response.data instanceof Blob && response.data.size > 0) {
        // Verificar el tipo MIME
        if (response.data.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          // Si no es un Excel, puede ser un JSON de error
          const errorText = await response.data.text();
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.message || 'Error al generar el reporte');
          } catch (e) {
            throw new Error('El servidor devolvió una respuesta inválida');
          }
        }

        // Obtener el nombre del archivo desde los headers
        const contentDisposition = response.headers["content-disposition"];
        let filename = `reporte_completo_asistencias_${new Date().toISOString().split('T')[0]}.xlsx`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Descargar el archivo
        saveAs(response.data, filename);

        // Notificación de éxito
        notification.success({
          message: "Reporte completo descargado",
          description: "El archivo Excel con toda la información fue descargado correctamente.",
        });
      } else {
        throw new Error('El archivo recibido está vacío o es inválido');
      }
    } catch (err: any) {
      console.error("Error completo al descargar:", err);
      
      let errorMessage = "No se pudo generar o descargar el archivo.";
      
      if (err.response?.status === 400) {
        // Intentar leer el mensaje de error del blob
        try {
          const errorBlob = err.response.data;
          const errorText = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(errorBlob);
          });
          const errorData = JSON.parse(errorText as string);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = err.response.data?.message || "Los filtros enviados son inválidos.";
        }
      } else if (err.response?.status === 500) {
        errorMessage = "Error interno del servidor al generar el reporte.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      notification.error({
        message: "Error al descargar",
        description: errorMessage,
        duration: 5,
      });
    }
  };

  return (
    <Tooltip title="Descargar Reporte Completo en Excel (Incluye asistencias y personas sin marcar)">
      <GreenButton 
        onClick={DescargarExcelAsistencias} 
        disabled={disabled}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px 16px'
        }}
      >
        <ImFileExcel style={{ fontSize: '16px' }} />
        Exportar Reporte
      </GreenButton>
    </Tooltip>
  );
};