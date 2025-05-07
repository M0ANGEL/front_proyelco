/* eslint-disable @typescript-eslint/no-explicit-any */
import { buscarProducto } from "@/services/maestras/productosAPI";
import { ColumnsType } from "antd/es/table";
import { DataType, Props } from "./types";
import { useState } from "react";
import {
  notification,
  Divider,
  Button,
  Input,
  Modal,
  Table,
  Col,
  Row,
} from "antd";

const { Search } = Input;

export const ModalProductos = ({
  open,
  setOpen,
  handleSelectProducto,
  detalle,
  hasFuente,
}: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value)
      .then(({ data: { data } }) => {
        const productos: DataType[] = [];
        data.forEach((producto) => {
          if (!detalle.some((item) => item.key == producto.id.toString())) {
            productos.push({
              key: producto.id.toString(),
              descripcion: producto.descripcion,
              cod_huv: producto.cod_huv,
              precio: parseFloat(producto.precio_promedio),
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
    },
    {
      title: "Código Servinte",
      dataIndex: "cod_huv",
      key: "cod_huv",
      align: "center",
      hidden: !hasFuente,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 550,
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
                if (hasFuente && record.precio == 0) {
                  notificationApi.warning({
                    message:
                      "El producto seleccionado no tiene precio promedio, por favor validarlo con el area de Cotizaciones",
                  });
                  return;
                }
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
