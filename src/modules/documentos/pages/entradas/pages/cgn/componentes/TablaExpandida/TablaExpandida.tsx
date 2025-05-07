import Table, { ColumnsType } from "antd/es/table";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { DataTypeChildren, Props } from "./types";
import { Button, Popconfirm, Space, Typography, notification } from "antd";
import "./styles.scss";
import { useState } from "react";
import { deleteLoteItem } from "@/services/documentos/obpAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";

const { Text } = Typography;

export const TablaExpandida = ({ data, setChildren, accion, cgn_id }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const {getSessionVariable} = useSessionStorage();

  const handleDeleteProducto = (key: React.Key, itemFromModal: boolean, cantidad = 0) => {
    if (["create"].includes(accion) || itemFromModal) {
      setChildren(data.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      deleteLoteItem({
        key: key,
        cgn_id: cgn_id,
        bodega_id: getSessionVariable(KEY_BODEGA),
        cantidad: cantidad,
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setChildren(data.filter((item) => item.key != key));
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: error,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => {
          setDeleteLoader(false);
          setDeletingRow([]);
        });
    }
  };

  const handleOpenChange = (
    value: boolean,
    key: React.Key,
    itemFromModal: boolean
  ) => {
    if (!value) {
      setDeletingRow([]);
    }
    if (["create"].includes(accion) || itemFromModal) {
      handleDeleteProducto(key, itemFromModal);
    } else {
      setDeletingRow([...deletingRow, key]);
    }
  };

  const columns: ColumnsType<DataTypeChildren> = [
    {},
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
      width: 217,
    },
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      width: 217,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      key: "f_vencimiento",
      dataIndex: "f_vencimiento",
      align: "center",
      width: 217,
    },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.push({
      title: "Acciones",
      key: "acciones",
      align: "center",
      width: 100,
      render: (_, { key, cantidad, itemFromModal }) => {
        return (
          <Space>
            <Popconfirm
              title="¿Desea eliminar este item?"
              open={deletingRow.includes(key)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se devolverá al inventario la cantidad de ${cantidad}`}
                  </Text>
                </Space>
              }
              okButtonProps={{
                loading: deleteLoader,
                danger: true,
              }}
              okText="Si"
              cancelText="No"
              onConfirm={() => handleDeleteProducto(key, itemFromModal, cantidad)}
              onCancel={() => setDeletingRow([])}
              onOpenChange={(value: boolean) =>
                handleOpenChange(value, key, itemFromModal)
              }
              disabled={deletingRow.length > 0}
            >
              <Button type="primary" size="small" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    });
  }

  return (
    <>
      {contextHolder}
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
