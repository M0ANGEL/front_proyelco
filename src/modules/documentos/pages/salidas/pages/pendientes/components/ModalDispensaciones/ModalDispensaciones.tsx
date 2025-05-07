import { getPagosPendiente } from "@/services/documentos/pendApi";
import Table, { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { IDispensacion } from "@/services/types";
import { Button, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Props } from "./types";

export const ModalDispensaciones = ({ open, setOpen, pendiente_id }: Props) => {
  const [dataSource, setDataSource] = useState<IDispensacion[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);

  useEffect(() => {
    if (open && pendiente_id) {
      setLoaderTable(true);
      getPagosPendiente(pendiente_id)
        .then(({ data: { data } }) => {
          setDataSource(data);
        })
        .finally(() => setLoaderTable(false));
    }
  }, [open, pendiente_id]);

  const columns: ColumnsType<IDispensacion> = [
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
              <Link to={`/documentos/ventas/dis/show/${id}`} target="_blank">
                <Button
                  key={`button-${id}`}
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                >
                  Ver dispensación
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
        footer={[]}
        destroyOnClose
        key={`modalPagos`}
        onCancel={() => {
          setOpen(false);
          setDataSource([]);
        }}
        title={"Modal de Pagos"}
      >
        <Table
          size="small"
          columns={columns}
          pagination={false}
          loading={loaderTable}
          dataSource={dataSource}
          rowKey={(record) => record.id}
        />
      </Modal>
    </>
  );
};
