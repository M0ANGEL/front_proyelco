// import { DocumentoTkTicketRespuesta } from "@/services/tickets/administracionAPI";
// import { Button, Tooltip } from "antd";
// import { MdOutlineFileDownload } from "react-icons/md";

// interface Idpros {
//   id: number;
//   pushNotification: (message: { title: string; type?: string }) => void;
// }

// export const DescargaDocTkRespuesta = ({ id, pushNotification }: Idpros) => {
//   const EnvioCierreTicket = () => {
//     DocumentoTkTicketRespuesta(id)
//       .then((response) => {
//         // Verifica que la respuesta es un archivo binario (Blob)
//         const file = response.data; // Este es el archivo binario

//         // Crea un enlace de descarga para el archivo Blob
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(file); // Crea un objeto URL para el archivo
//         link.download = `ticket_${id}`; // El nombre del archivo (puedes modificarlo si es necesario)
//         link.click(); // Dispara la descarga

//         // Mostrar notificación de éxito
//         pushNotification({
//           title: "Documento descargado con éxito",
//           type: "success",
//         });
//       })
//       .catch((err) => {
//         // Mostrar notificación de error si la descarga falla
//         pushNotification({
//           title: `Error al descargar documento: ${err.message}`,
//           type: "error",
//         });
//       });
//   };

//   return (
//     <Tooltip title="Descargar Documento de respuesta al ticket">
//       <Button
//         style={{ marginLeft: "5px" , background: 'black'}}
//         size="small"
//         type="primary"
//         onClick={EnvioCierreTicket}
//       >
//         <MdOutlineFileDownload />
//       </Button>
//     </Tooltip>
//   );
// };



export const DescargaDocTkRespuesta = () => {
  return (
    <div>DescargaDocTkRespuesta</div>
  )
}
