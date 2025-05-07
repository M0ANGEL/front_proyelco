import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import Table, { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import { DataTypeChildren, Props } from "./types";
import { KEY_ROL } from "@/config/api";
import { Button, Space } from "antd";
import { useState } from "react";
import "./styles.scss";

export const TablaExpandida = ({ data, setChildren, accion }: Props) => {
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
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
  ];

  if (
    ["create", "edit"].includes(accion) &&
    [
      "administrador",
      "usuario",
      "regente",
      "regente_farmacia",
      "quimico",
      "auxiliar_bodega",
    ].includes(user_rol)
  ) {
    columns.push({
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
              danger
              onClick={() => {
                setChildren(data.filter((item) => item.key != record.key));
              }}
            >
              <DeleteOutlined />
            </Button>
          </Space>
        );
      },
    });
  }

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
