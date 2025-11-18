import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect, useState } from "react";

interface DataType {
  id: string;
  orden: number;
  consecutivo: number;
  proceso: string;
}

interface Props {
  visible: boolean;
  infoApt: DataType | null;
  onCancel: () => void;
  onConfirm: (detalle: string) => void;
}

const ModalAnulacion: FC<Props> = ({
  visible,
  infoApt,
  onCancel,
  onConfirm,
}) => {
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    if (visible) setDetalle("");
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title="Cambio de estado  de APT"
      onOk={() => onConfirm(detalle)}
      onCancel={onCancel}
      okText="Anular"
      cancelText="Cancelar"
      okButtonProps={{ disabled: detalle.trim() === "" || !infoApt }}
    >
      <p>
        <span style={{ color: "blue" }}>
          Se anulará el APT <b>{infoApt?.consecutivo}</b> del proceso{" "}
          <b>{infoApt?.proceso}</b>. Ten en cuenta que si este afecta la
          secuencia, se anularán los pisos siguientes en efecto cascada.
        </span>
      </p>

      <TextArea
        style={{ width: "100%" }}
        onChange={(e) => setDetalle(e.target.value)}
        value={detalle}
        maxLength={255}
        placeholder="Escribe el motivo de la anulación"
      />
    </Modal>
  );
};

export default ModalAnulacion;
