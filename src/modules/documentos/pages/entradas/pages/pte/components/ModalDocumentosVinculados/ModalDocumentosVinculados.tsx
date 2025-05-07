import { Button, Modal, Space } from "antd";
import { Props } from "./types";
import { DocumentosCabecera } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ModalDocumentosVinculados = ({
  open,
  setOpen,
  documentos,
}: Props) => {
  const [dataSource, setDataSource] = useState<DocumentosCabecera[]>([]);

  useEffect(() => {
    const data: DocumentosCabecera[] = [];
    documentos.forEach((documento) => {
      if (documento.estado != "4") {
        data.push(documento);
      }
    });
    setDataSource(data);
  }, [documentos]);

  const columns: ColumnsType<DocumentosCabecera> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render(_, { id }) {
        return (
          <>
            <Space>
              <Link to={`/documentos/salidas/ppt/show/${id}`} target="_blank">
                <Button
                  key={`button-${id}`}
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                >
                  Ver Pago
                </Button>
              </Link>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        title={"Modal de Pagos"}
        key={`modalPagos`}
        footer={[]}
      >
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={dataSource}
          size="small"
          pagination={false}
        />
      </Modal>
    </>
  );
};
