/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Divider, Input, Modal, Row, Table, message } from "antd";
import { buscarProducto } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";

const { Search } = Input;

export const ModalProductos = ({
  open,
  setOpen,
  handleSelectProducto,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value)
      .then(({ data: { data } }) => {
        const productos: any[] = data.map((producto) => {
          return {
            key: producto.id.toString(),
            descripcion: producto.descripcion,
            producto: {
              producto_id: producto.id.toString(),
              cantidad: 0,
              precio_compra: producto.precio_promedio,
              iva: producto.ivas.iva,
              producto: producto,
            },
          };
        });

        setDataSource(productos);
        setLoaderTable(false);
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
              messageApi.open({
                type: "error",
                content: error,
              });
            }
          } else {
            messageApi.open({
              type: "error",
              content: response.data.message,
            });
          }

          setLoaderTable(false);
        }
      );
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 600,
    },

    {
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      render(_, record) {
        return (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleSelectProducto(record.producto);
                setDataSource([]);
                setOpen(false);
              }}
            >
              Seleccionar
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      destroyOnClose
      closable
      width={1000}
      footer={[]}
      onCancel={() => setOpen(false)}
      maskClosable={false}
      style={{ top: 20 }}
      title="Lista de Productos"
    >
      {contextHolder}
      <Row>
        <Col span={24}>
          <Search
            enterButton
            type="primary"
            onSearch={onSearch}
            placeholder="Buscar Producto"
          />
        </Col>
        <Divider style={{ marginBlock: 15 }} />
        <Col span={24}>
          <Table
            rowKey={(record) => record.key}
            loading={loaderTable}
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 300 }}
            pagination={{ simple: false, pageSize: 10 }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
