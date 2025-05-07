/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Table, { ColumnsType } from "antd/es/table";
import { DataTypeChildren, Props } from "./types";
import { Button, Space } from "antd";
import "./styles.scss";

export const TablaExpandidaModal = ({
  data,
  setProducto,
  productos,
}: Props) => {
  const columns: ColumnsType<DataTypeChildren> = [
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      width: 200,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      key: "f_vencimiento",
      dataIndex: "f_vencimiento",
      align: "center",
      width: 400,
    },
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 120,
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                const key_split = record.key.toString().split("_");
                const producto = productos?.find(
                  (item) => item.key.toString() === key_split[0]
                );
                setProducto(producto!, record.key);
              }}
            >
              Seleccionar
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        className="tabla-expandida"
        size={"small"}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </>
  );
};
