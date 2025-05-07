import React from "react";
import { Modal } from "antd";

interface ModalFotoProps {
  visible: boolean;
  onClose: () => void;
  nombre: string;
  fotoUrl: string | null;
}

export const ModalFoto: React.FC<ModalFotoProps> = ({
  visible,
  onClose,
  nombre,
  fotoUrl,
}) => {
  return (
    <Modal
      title={`${nombre}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt={`Foto de ${nombre}`}
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        />
      ) : (
        <p>No hay foto disponible</p>
      )}
    </Modal>
  );
};
