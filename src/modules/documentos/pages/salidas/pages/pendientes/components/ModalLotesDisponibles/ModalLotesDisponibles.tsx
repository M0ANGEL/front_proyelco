import { Button, Col, Modal, Row, Table } from "antd";
import { Props } from "./types";

export const ModalLotesDisponibles = ({ open, setOpen, lotes }: Props) => {
  const clearValues = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        footer={[
          <>
            <Button
              key={"add-button-whatever"}
              type="primary"
              onClick={() => {
                setOpen(false, "si");
              }}
            >
              Agregar de todas formas
            </Button>
          </>,
        ]}
        onCancel={() => clearValues()}
        title={"Disponibilidad de Lotes"}
        width={1200}
        zIndex={101}
        maskClosable={false}
        keyboard={false}
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={lotes}
              rowKey={(record) => record.id}
              columns={[
                {
                  key: "producto_id",
                  dataIndex: "producto_id",
                  title: "Codigo Producto",
                  width: 150,
                  align: "center",
                },
                {
                  key: "descripcion",
                  dataIndex: "descripcion",
                  title: "Descripción",
                  render(_, { productos: { descripcion } }) {
                    return descripcion;
                  },
                },
                {
                  key: "lote",
                  dataIndex: "lote",
                  title: "Lote",
                  width: 160,
                  align: "center",
                },
                {
                  key: "fecha_vencimiento",
                  dataIndex: "fecha_vencimiento",
                  title: "Fecha Vencimiento",
                  width: 160,
                  align: "center",
                },
                {
                  key: "stock",
                  dataIndex: "stock",
                  title: "Stock",
                  width: 160,
                  align: "center",
                },
              ]}
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
