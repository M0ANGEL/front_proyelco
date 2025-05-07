import React, { useState } from "react";
import { Modal, Input } from "antd";

interface InactivarActivoModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (observacion: string) => void; // Se envía la observación
}

export const InactivarActivoModal: React.FC<InactivarActivoModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  const [observacion, setObservacion] = useState("");

  return (
    <Modal
      title="Confirmar Inactivación"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => onConfirm(observacion)} // Se envía la observación al confirmar
      okText="Inactivar"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
    >
      <p>¿Estás seguro de que deseas inactivar este activo?</p>
      <Input.TextArea
        placeholder="Escribe una observación..."
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        rows={3}
        style={{ marginTop: 10 }}
      />
    </Modal>
  );
};
