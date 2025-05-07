/* eslint-disable @typescript-eslint/no-explicit-any */
import Table, { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import { DataTypeChildren, Props } from "./types";
import { Button, InputNumber, Space } from "antd";
import "./styles.scss";
import { StyledText } from "./styled";
import { useEffect, useState } from "react";

export const TablaExpandida = ({
  data,
  setChildren,
  setCantidadLote,
  accion,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataTypeChildren[]>(data);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      setDataSource(newData);
    }
  };

  const handleChangeAmount = (valor: number, key: React.Key) => {
    if (valor) {
      const key_split = key.toString().split("_");
      const newDataFilter = dataSource.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            cantidad: valor ? valor : 0,
          };
        } else {
          return item;
        }
      });
      setCantidadLote(valor, key_split[0], key);
      setDataSource(newDataFilter);
    }
  };
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
      render: (_, record) => {
        return (
          <Space direction="vertical">
            {["editar", "create"].includes(accion) ? (
              <>
                {record.editable ? (
                  <>
                    <InputNumber
                      autoFocus
                      controls={false}
                      size="small"
                      defaultValue={record.cantidad == 0 ? "" : record.cantidad}
                      onBlur={() => handleChangeEdit(record.key)}
                      onChange={(e: any) => handleChangeAmount(e, record.key)}
                    />
                  </>
                ) : (
                  <StyledText onClick={() => handleChangeEdit(record.key)}>
                    {record.cantidad}
                  </StyledText>
                )}
              </>
            ) : (
              record.cantidad
            )}
          </Space>
        );
      },
    },
  ];

  if (["create", "edit"].includes(accion)) {
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
                setChildren(
                  dataSource.filter((item) => item.key != record.key)
                );
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
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};
