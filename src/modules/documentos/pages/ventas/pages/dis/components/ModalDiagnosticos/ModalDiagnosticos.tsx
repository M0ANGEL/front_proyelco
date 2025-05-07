import { Button, Modal, Table } from "antd";
import { Props } from "./types";
import { ColumnsType } from "antd/es/table";
import { Diagnostico } from "@/services/types";

export const ModalDiagnosticos = ({
  open,
  setOpen,
  diagnosticos,
  setDiagnostico,
}: Props) => {
  const columns: ColumnsType<Diagnostico> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },

    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render(_, record) {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => setDiagnostico(record)}
          >
            Seleccionar
          </Button>
        );
      },
    },
  ];
  return (
    <Modal
      open={open}
      footer={[]}
      onCancel={() => setOpen(false)}
      style={{ top: 20 }}
      width={800}
    >
      <Table
        bordered
        size="small"
        rowKey={diagnosticos.length > 0 ? (record) => record.id : ""}
        pagination={{ simple: false, pageSize: 15, hideOnSinglePage: true }}
        dataSource={diagnosticos.length > 0 ? diagnosticos : []}
        columns={columns}
        style={{ paddingTop: 30 }}
      />
    </Modal>
  );
};
