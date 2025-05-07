/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Input, Modal, Row, Table, message } from "antd";
import { DataType, Props } from "./types";
import { useState, useEffect } from "react";
import { buscarProductosxCodigoPadre } from "@/services/maestras/productosAPI";
import { ColumnsType } from "antd/es/table";
import { SearchBar } from "./styled";

export const ModalCambioProducto = ({
  open,
  setOpen,
  oldItem,
  handleSelectProductoPadre,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (oldItem) {
      buscarProductosxCodigoPadre(oldItem.cod_padre)
        .then(({ data: { data } }) => {
          const productos: any[] = data.map((producto) => {
            return {
              key: producto.id.toString(),
              descripcion: producto.descripcion,
              cod_padre: producto.cod_padre,
              precio_promedio: producto.precio_promedio,
              precio_compra: parseFloat(producto.precio_compra.toString()),
              iva: producto.ivas.iva,
              laboratorio: producto.laboratorio,
              // descripcion: producto.descripcion,
              // laboratorio: producto.laboratorio,
              // producto: {
              //   producto_id: producto.id.toString(),
              //   cantidad: 0,
              //   precio_compra: 0,
              //   iva: producto.ivas.iva,
              //   producto: producto,
              // },
            };
          });

          setDataSource(productos);
          setInitialData(productos);
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
    }
  }, [oldItem]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "key",
      key: "key",
      width: 100,
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 500,
    },
    {
      title: "Laboratorio",
      dataIndex: "laboratorio",
      key: "laboratorio",
      width: 200,
      align: "center",
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
                handleSelectProductoPadre(record);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDataSource(filterTable);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        closable
        width={1000}
        footer={[]}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        style={{ top: 20 }}
        title="Lista de Productos Padre"
      >
        <Row>
          <Col span={24}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
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
    </>
  );
};
