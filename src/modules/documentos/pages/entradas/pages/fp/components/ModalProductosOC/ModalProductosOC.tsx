/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Modal, Table, Typography } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { SearchBar } from "./styled";

const { Text } = Typography;

export const ModalProductosOC = ({
  open,
  setOpen,
  productosOC,
  handleSelectProducto,
  detalle,
  facturas,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);

  useEffect(() => {
    const data: DataType[] = [];
    productosOC.forEach((producto) => {
      const valid_detalle = detalle.some(
        (item) =>
          item.key === producto.producto_id ||
          item.cod_padre === producto.producto.cod_padre
      );
      let cantidad_ingresada = 0;
      facturas?.forEach((factura) => {
        factura.detalle.forEach((item) => {
          item.forEach((productoFP) => {
            if (
              productoFP.producto_id === producto.producto_id ||
              productoFP.producto.cod_padre === producto.producto.cod_padre
            ) {
              cantidad_ingresada += parseInt(productoFP.cantidad);
            }
          });
        });
      });
      const cantidad_pendiente =
        parseInt(producto.cantidad) - cantidad_ingresada;
      if (!valid_detalle) {
        data.push({
          key: producto.producto_id,
          descripcion: producto.producto.descripcion,
          cantidad: producto.cantidad,
          cantidad_ingresada,
          cantidad_pendiente,
          producto,
        });
      }
    });
    setDataSource(data);
    setInitialData(data);
  }, [productosOC, detalle, facturas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "Descripción",
      key: "descripcion",
      dataIndex: "descripcion",
    },
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad Ingresada",
      key: "cantidad_ingresada",
      dataIndex: "cantidad_ingresada",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad Pendiente",
      key: "cantidad_pendiente",
      dataIndex: "cantidad_pendiente",
      align: "center",
      width: 90,
    },
    {
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      render(
        _,
        { producto, cantidad, cantidad_ingresada, cantidad_pendiente }
      ) {
        return (
          <>
            {cantidad_ingresada < parseInt(cantidad) ? (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  handleSelectProducto(producto, cantidad_pendiente);
                  setOpen(false);
                }}
              >
                Seleccionar
              </Button>
            ) : (
              <Text type="danger" style={{ fontSize: 10 }}>
                Total cantidades ingresadas{" "}
              </Text>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        open={open}
        destroyOnClose
        closable
        width={1000}
        footer={[]}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        style={{ top: 20 }}
        title="Productos de la Orden de Compra"
      >
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ simple: false, pageSize: 10 }}
        />
      </Modal>
    </>
  );
};
