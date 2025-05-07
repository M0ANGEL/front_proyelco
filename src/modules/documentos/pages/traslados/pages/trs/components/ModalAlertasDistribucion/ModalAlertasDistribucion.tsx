/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Table } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";

export const ModalAlertasDistribucion = ({
  open,
  setOpen,
  alertasDistribucion,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>();

  useEffect(() => {
    if (open) {
      const dataGroup = Object.groupBy(
        alertasDistribucion,
        ({ bod_nombre_destino }) => bod_nombre_destino
      );

      const data: any[] = Object.keys(dataGroup).map((key) => ({
        bod_nombre: key,
        items: dataGroup[key]?.map((item) => ({
          desc_producto: item.desc_producto,
          cantidad: item.cantidad_pendiente,
          producto_id: item.producto_id,
        })),
      }));

      setDataSource(data);
    }
  }, [open]);
  return (
    <>
      <Modal
        open={open}
        footer={[]}
        onCancel={() => setOpen(false)}
        width={800}
        title={"Cantidades pendientes por trasladar"}
      >
        <Table
          rowKey={(record) => record.bod_nombre}
          size="small"
          dataSource={dataSource}
          columns={[
            { key: "bod_nombre", dataIndex: "bod_nombre", title: "Bodega" },
          ]}
          expandable={{
            expandedRowRender: ({ items }) => (
              <Table
                size="small"
                rowKey={(record) =>
                  record.producto_id + record.cantidad
                }
                dataSource={items}
                columns={[
                  {
                    key: "producto_id",
                    dataIndex: "producto_id",
                    title: "Código",
                    width: 100,
                    align: "center",
                  },
                  {
                    key: "desc_producto",
                    dataIndex: "desc_producto",
                    title: "Producto",
                  },
                  {
                    key: "cantidad",
                    dataIndex: "cantidad",
                    title: "Cantidad",
                    width: 100,
                    align: "center",
                  },
                ]}
                pagination={{ hideOnSinglePage: true }}
              />
            ),
          }}
          pagination={{ hideOnSinglePage: true }}
        />
      </Modal>
    </>
  );
};
