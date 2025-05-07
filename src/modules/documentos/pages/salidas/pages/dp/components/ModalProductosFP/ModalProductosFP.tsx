/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Table } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { TablaExpandidaModal } from "..";

export const ModalProductosFP = ({
  open,
  setOpen,
  productosFP,
  handleSelectProducto,
  detalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  // const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);

  useEffect(() => {
    setDataSource(productosFP);
  }, [productosFP, detalle]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      key: "key",
      dataIndex: "key",
      align: "center",
      width: 60,
    },
    {
      title: "Producto",
      key: "descripcion",
      dataIndex: "descripcion",
      width: 400,
      // render: (_, { key, descripcion }) => {
      //   return (
      //     <Paragraph
      //       ellipsis={
      //         !ellipsisRow.includes(key)
      //           ? {
      //               rows: 1,
      //               expandable: true,
      //               symbol: "ver más",
      //               onExpand: () => {
      //                 setEllipsisRow([...ellipsisRow, key]);
      //               },
      //             }
      //           : false
      //       }
      //     >
      //       {descripcion}
      //     </Paragraph>
      //   );
      // },
    },
    // {
    //   title: "Total cantidad",
    //   key: "total_cantidad",
    //   dataIndex: "total_cantidad",
    //   align: "center",
    //   width: 100,
    //   render: (_, { total_cantidad }) => {
    //     let alertaOC: string;
    //     if (total_cantidad > 0) {
    //       alertaOC = `Cantidad pedida en la OC: ${total_cantidad}`;
    //     } else {
    //       alertaOC = `Producto fuera de la OC`;
    //     }
    //     return <>{alertaOC}</>;
    //   },
    // },
    // {
    //   title: "Precio Compra",
    //   key: "precio_compra",
    //   dataIndex: "precio_compra",
    //   align: "center",
    //   width: 150,
    //   render: (_, { precio_compra }) => {
    //     return <>$ {precio_compra.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Subtotal",
    //   key: "subtotal",
    //   dataIndex: "subtotal",
    //   align: "center",
    //   width: 100,
    //   render: (_, { precio_compra, lotes }) => {
    //     const cantidad = lotes.reduce(
    //       (counter, value) => counter + value.cantidad,
    //       0
    //     );
    //     const subtotal = precio_compra * cantidad;
    //     return <>$ {subtotal.toLocaleString("es-CO")}</>;
    //   },
    // },
    // {
    //   title: "Total",
    //   key: "total",
    //   dataIndex: "total",
    //   align: "center",
    //   width: 100,
    //   render: (_, { precio_compra, iva, lotes }) => {
    //     const cantidad = lotes.reduce(
    //       (counter, value) => counter + value.cantidad,
    //       0
    //     );
    //     const subtotal = precio_compra * cantidad;
    //     const total = subtotal * iva + subtotal;
    //     return <>$ {total.toLocaleString("es-CO")}</>;
    //   },
    // },
  ];

  return (
    <>
      <Modal
        open={open}
        destroyOnClose
        closable
        width={1000}
        footer={[]}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        style={{ top: 20 }}
        title="Productos de la Factura"
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ simple: false, pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <TablaExpandidaModal
                  data={record.lotes}
                  productos={productosFP}
                  setProducto={(producto: DataType, loteKey: React.Key) =>
                    handleSelectProducto(producto, loteKey)
                  }
                />
              );
            },
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </Modal>
    </>
  );
};
