import { Modal, Typography } from "antd";
import { Props } from "./types";

const { Title, Paragraph, Link } = Typography;

export const ModalLinkDocumentos = ({ open, setOpen, id, documento, urlHost }: Props) => {

  const linkDocumentos = () => {
    return (
      <div>
        <Title level={3}>Link para cargue documentos</Title>
        <Paragraph>Para cargar documentos al sistema, copia y envía el siguiente enlace:</Paragraph>
        <Paragraph>
          <Link copyable href={`${urlHost}/cargue-documentos/${id}/${documento}`}>{`${urlHost}/cargue-documentos/${id}/${documento}`}</Link>
        </Paragraph>
      </div>
    )
  }

  return (
    <Modal
      open={open}
      destroyOnClose
      onCancel={() => setOpen(false)}
      title={"Modal link para cargue documentos"}
      key={`modal-link`}
      footer={[]}
      style={{ top: 10 }}
    >
      {linkDocumentos()}
    </Modal>
  );
}