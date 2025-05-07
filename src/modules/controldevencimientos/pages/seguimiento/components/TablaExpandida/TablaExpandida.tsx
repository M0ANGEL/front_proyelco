/* eslint-disable @typescript-eslint/no-explicit-any */
import Table, { ColumnsType } from "antd/es/table";
import { Props } from "./types";
import "./styles.scss";


export const TablaExpandida = ({ data }: Props) => {

  const columns: ColumnsType<any> = [
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      width: 200,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      key: "fecha_vencimiento",
      dataIndex: "fecha_vencimiento",
      align: "center",
      width: 400,
    },
    {
      title: "Cantidad",
      key: "stock",
      dataIndex: "stock",
      align: "center",
    },
  ];

  return (
    <>
      <Table
        className="tabla-expandida"
        size={"small"}
        loading={data ? false : true}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </>
  );
};
