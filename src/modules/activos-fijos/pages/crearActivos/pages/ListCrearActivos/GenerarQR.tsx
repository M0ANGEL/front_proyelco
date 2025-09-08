import { useRef, useState } from "react";
import { Modal, Button, QRCode, Tooltip } from "antd";
import { DownloadOutlined, QrcodeOutlined } from "@ant-design/icons";
import { BASE_URL_IMAGENES } from "@/config/api";

interface GenerarQRProps {
  id: number;
  numero_activo: string;
}

export const GenerarQR = ({ id, numero_activo }: GenerarQRProps) => {
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
        <div
          ref={qrRef}
          style={{
            textAlign: "center",
            position: "relative",
            display: "inline-block",
            marginLeft: 100
          }}
        >
          {/* QR */}
          <QRCode value={enlace} size={200} />

          {/* Número de activo en el centro */}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "16px",
              fontWeight: "bold",
              background: "white",
              padding: "5px 6px",
              borderRadius: "4px",
            }}
          >
            {numero_activo}
          </span>
        </div>

        <p style={{ marginTop: "15px" }}>Escanea para ver el activo</p>
      </Modal>
    </>
  );
};
