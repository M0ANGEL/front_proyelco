/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Table } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";

export const ModalProductsPAT = ({
  open,
  setOpen,
  productosPAT,
  handleSelectProducto,
  detalle,
  setVariableCompartida
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);//disabledSel
  const [disabledSel, setDisabledSel] = useState<Boolean>(false);//disabledSel


  useEffect(() => {
    const data: DataType[] = [];
    let allDisabled = true; // Variable para controlar si todos los botones deben estar deshabilitados
    productosPAT.forEach((producto) => {
      const valid_detalle = detalle.some(
        (item) => item.key === producto.producto_id
        );
        
      if (!valid_detalle) {
        const isDisabled = producto.cantidad === 0; // Otra lógica para determinar si debe estar deshabilitado
        allDisabled = allDisabled && isDisabled; // Actualiza la variable allDisabled
  
        let cantRetorno = producto.cantidad_retorno;
        if (cantRetorno === null) {
          cantRetorno = 0;
        }
        let pendRetorno = producto.cantidad - cantRetorno;
  
        if (pendRetorno === 0) {
          allDisabled = true;
        }
  
        data.push({
          key: producto.producto_id,
          descripcion: producto.producto.descripcion,
          cantidad: producto.cantidad,
          producto,
          disabled: isDisabled,
        });
      }
    });
  
    setDisabledSel(allDisabled); // Actualiza el estado de disabledSel
    setDataSource(data);
  }, [productosPAT, detalle]);
  

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
                handleSelectProducto(record.producto, record.cantidad);
                setOpen(false);
              }}
              disabled={record.disabled}
            >
              Seleccionar
            </Button>
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
        title="Listado Detalle de Préstamo a Terceros"
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ simple: false, pageSize: 10 }}
        />
      </Modal>
    </>
  );
};
