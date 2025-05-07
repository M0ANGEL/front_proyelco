/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Modal, Row, Table } from "antd";
import { Props } from "./types";
import { useEffect, useState } from "react";
import { Producto } from "@/services/types";
import { buscarProducto } from "@/services/maestras/productosAPI";
import Search from "antd/es/input/Search";

export const ModalProductos = ({
  open,
  setOpen,
  addProducto,
  productos,
}: Props) => {
  const [dataSource, setDataSource] = useState<Producto[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setDataSource([]);
      setLoaderTable(false);
    }
  }, [open]);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value).then(({ data: { data } }) => {
      const newDataSource: Producto[] = [];
      data.forEach((producto) => {
        if (!productos.some((item) => item == producto.id.toString())) {
          newDataSource.push(producto);
        }
      });
      setDataSource(newDataSource);
      setLoaderTable(false);
    });
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value);
    }
  };

  return (
    <>
      <Modal
        open={open}
        footer={[]}
        destroyOnClose
        style={{ top: 5 }}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <Row gutter={[12, 12]} style={{ marginTop: 30 }}>
          <Col span={24}>
            <Search
              enterButton
              type="primary"
              onSearch={onSearch}
              placeholder="Buscar Producto"
            />
          </Col>
          <Col span={24}>
            <Table
              size="small"
              dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
              loading={loaderTable}
              columns={[
                {
                  title: "Código",
                  key: "id",
                  dataIndex: "id",
                  align: "center",
                },
                {
                  title: "Descripción",
                  key: "descripcion",
                  dataIndex: "descripcion",
                },
                {
                  title: "Acciones",
                  key: "acciones",
                  dataIndex: "acciones",
                  align: "center",
                  render(_, { id }) {
                    return (
                      <>
                        <Button
                          block
                          size="small"
                          type="primary"
                          onClick={() => {
                            addProducto(id.toString());
                          }}
                        >
                          Seleccionar
                        </Button>
                      </>
                    );
                  },
                },
              ]}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
