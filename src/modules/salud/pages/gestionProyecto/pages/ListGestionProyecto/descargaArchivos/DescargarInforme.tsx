import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { ExportInformeExcelProyecto } from "@/services/proyectos/descargarExcelesAPI";
import { notification, Tooltip } from "antd";
import { MdOutlineFileDownload } from "react-icons/md";
import { saveAs } from "file-saver";
import { ImFileExcel } from "react-icons/im";

interface Idpros {
  id: number;
}

export const DescargarInforme = ({ id }: Idpros) => {
  //   const DescargarExcelInfo = () => {
  //   ExportInformeExcelProyecto(id)
  //     .then((response) => {
  //       // Obtener nombre sugerido (opcional)
  //       const contentDisposition = response.headers['content-disposition'];
  //       let filename = `informe-proyecto-${id}.xlsx`;

  //       if (contentDisposition) {
  //         const match = contentDisposition.match(/filename="?([^"]+)"?/);
  //         if (match && match[1]) {
  //           filename = match[1];
  //         }
  //       }

  //       // Forzar descarga
  //       saveAs(response.data, filename);

  //       // Notificación de éxito
  //       pushNotification({
  //         title: "Documento descargado con éxito",
  //         type: "success",
  //       });
  //     })
  //     .catch((err) => {
  //       pushNotification({
  //         title: `Error al descargar documento: ${err.message}`,
  //         type: "error",
  //       });
  //     });
  // };

  const DescargarExcelInfo = () => {
    // Notificación inicial opcional
    notification.info({
      message: "En proceso...",
      description: "Descargando informe...",
    });

    ExportInformeExcelProyecto(id)
      .then((response) => {
        // Obtener el nombre del archivo desde los headers
        const contentDisposition = response.headers["content-disposition"];
        let filename = `informe-proyecto-${id}.xlsx`;

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
          message: "Informe descargado",
          description: "El archivo fue descargado correctamente.",
        });
      })
      .catch((err) => {
        // Notificación de error
        notification.error({
          message: "Error al descargar",
          description: "No se pudo generar o descargar el archivo.",
        });
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3%" }}>
      <Tooltip title="Descargar Excel">
        <GreenButton onClick={DescargarExcelInfo} style={{ width: "10%" }}>
          <ImFileExcel />
        </GreenButton>
      </Tooltip>
    </div>
  );
};
