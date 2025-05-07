/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Divider, Input, Modal, Row, Table, message } from "antd";
import { buscarProductoPTO } from "@/services/documentos/ptoAPI";
import { ColumnsType } from "antd/es/table";
import { DataType, Props } from "./types";
import { useState } from "react";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";

const { Search } = Input;

export const ModalProductos = ({
  handleSelectProducto,
  detalle,
  setOpen,
  open,
}: Props) => {
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { getSessionVariable } = useSessionStorage();
  const bodega_id = getSessionVariable(KEY_BODEGA);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProductoPTO(value, bodega_id)
      .then(({ data: { data } }) => {
        const productos: DataType[] = [];
        data.forEach((producto) => {
          if (
            !detalle.some((item) => item.key == producto.id.toString()) &&
            parseFloat(producto.precio_venta) > 0
          ) {
            productos.push({
              key: producto.id.toString(),
              descripcion: producto.descripcion,
              cod_huv: producto.cod_huv,
              precio: parseFloat(producto.precio_venta),
              iva: parseFloat(producto.ivas.iva),
              cod_padre: producto.cod_padre,
              editablePrecio: false,
              lotes: [],
              total_ingreso: 0,
              precio_subtotal: 0,
              precio_iva: 0,
              precio_total: 0,
              itemFromModal: true,
            });
          }
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
      align: "center",
      width: 100,
    },
    {
      title: "Código Servinte",
      dataIndex: "cod_huv",
      key: "cod_huv",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      width: 120,
      render(_, record) {
        return (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleSelectProducto(record);
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
