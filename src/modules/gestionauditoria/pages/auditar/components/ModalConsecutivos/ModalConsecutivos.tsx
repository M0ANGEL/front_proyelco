import { Modal, Table } from "antd";
import { Props } from "./types";

export const ModalConsecutivos = ({ open, setOpen, consecutivos }: Props) => {
  return (
    <>
      <Modal
        title="Consecutivos en conflicto"
        open={open}
        footer={[]}
        onCancel={() => {
          setOpen(false);
        }}
        style={{ top: 40 }}
        
      >
        <Table
          size="small"
          rowKey={(record) => record.consecutivo}
          dataSource={consecutivos}
          columns={[
            {
              title: "Consecutivo",
              dataIndex: "consecutivo",
              key: "consecutivo",
            },
            {
              title: "Estado",
              dataIndex: "estado",
              key: "estado",
            },
          ]}
          pagination={{
            simple: false,
            pageSize: 10,
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
        />
      </Modal>
    </>
  );
};
