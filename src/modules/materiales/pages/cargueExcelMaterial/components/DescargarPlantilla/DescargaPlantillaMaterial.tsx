import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { DocPlantilla } from "@/services/compras/papeleraAPI";
import { Tooltip } from "antd";
import { notification } from "antd";




export const DescargaPlantillaMaterial = () => {
  const EnvioCierreTicket = () => {
    DocPlantilla()
    .then((response) => {
      const file = response.data;
  
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `PLANTILLA_MATERIALES.xlsx`;
      link.click();
  
      // ✅ 
      notification.success({
        message: "Descarga exitosa",
        description: "La plantilla se descargó correctamente.",
      });
    })
    .catch((err) => {
  
      // ❌ 
      notification.error({
        message: "Error al descargar",
        description: "Ocurrió un error al intentar descargar la plantilla.",
      });
    });
  
  };

  return (
    <Tooltip title="Descargar Documento">
      <GreenButton
        style={{ marginLeft: "5px" }}
        type="primary"
        onClick={EnvioCierreTicket}
      >
        Descargar Plantilla
      </GreenButton>
    </Tooltip>
  );
};
