import { useRef, useState } from "react";
import { Modal, Button, QRCode, Tooltip } from "antd";
import { DownloadOutlined, QrcodeOutlined } from "@ant-design/icons";
import { BASE_URL_IMAGENES } from "@/config/api";

interface GenerarQRProps {
  id: number;
}

export const GenerarQR = ({ id }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const enlace = `${BASE_URL_IMAGENES}activos/${id}/qr`;

  const descargarQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      const enlaceDescarga = document.createElement("a");
      enlaceDescarga.href = canvas.toDataURL("image/png");
      enlaceDescarga.download = `QR_Activo_${id}.png`;
      enlaceDescarga.click();
    }
  };

  return (
    <>
      <Tooltip title="Generar QR">
        <Button
          icon={<QrcodeOutlined />}
          type="primary"
          size="small"
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "#17ae00ff" }}
        />
      </Tooltip>

      <Modal
        title="Código QR del Activo"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={descargarQR}
          >
            Descargar QR
          </Button>,
          <Button key="close" onClick={() => setVisible(false)}>
            Cerrar
          </Button>,
        ]}
        centered
      >
        <div ref={qrRef} style={{ textAlign: "center" }}>
          <QRCode value={enlace} size={200} />
          <p style={{ marginTop: "10px" }}>Escanea para ver el activo</p>
        </div>
      </Modal>
    </>
  );
};
