/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputNumber, Modal, Table, Typography, Space, message } from "antd";
import { DataType, Props, SelectedProduct } from "./types";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";

const { Text } = Typography;

export const ModalProductos = ({
  open,
  setOpen,
  factura,
  handleSelectProducts,
  detalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  useEffect(() => {
    const productos: DataType[] = [];
    if (factura) {
      factura.detalle.forEach((item) => {
        const key = `${item.codigo_producto}_${item.lote}_${item.fecha_vencimiento}`;
        let blockAmount = false;
        let cantidad_total_devuelta = 0;
        item.nce_dis_detalle?.forEach((item) => {
          cantidad_total_devuelta += parseInt(item.cantidad);
        });
        if (parseInt(item.cantidad_entregada) == cantidad_total_devuelta) {
          blockAmount = true;
        }
        if (!detalle.includes(key)) {
          productos.push({
            key: key,
            codigo_producto: item.codigo_producto,
            descripcion: item.descripcion,
            lote: item.lote,
            fecha_vencimiento: item.fecha_vencimiento,
            cantidad_entregada: parseInt(item.cantidad_entregada),
            cantidad_devuelta: cantidad_total_devuelta,
            cantidad_devolver: 0,
            editable: false,
            blockAmount,
          });
        }
      });
    }
    setDataSource(productos);
  }, [factura, detalle]);

  useEffect(() => {
    dataSource.forEach((item) => {
      const max = item.cantidad_entregada - item.cantidad_devuelta;
      if (item.cantidad_devolver > max && !item.editable) {
        setBtnAdd(true);
        messageApi.open({
          type: "error",
          content: `El producto ${item.descripcion} excede la cantidad máxima de ${max}`,
          style: {
            marginTop: "1vh",
          },
          duration: 2,
        });
        return false;
      } else {
        setBtnAdd(false);
      }
    });
  }, [dataSource]);

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      setDataSource(newData);
    }
  };

  const handleChangeAmount = (cantidad: number, key: React.Key) => {
    const newDataFilter = dataSource.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad_devolver: cantidad ? cantidad : 0 };
      } else {
        return item;
      }
    });
    setDataSource(newDataFilter);
  };

  const handleAddProducts = () => {
    const selectedProducts: SelectedProduct[] = [];
    dataSource.forEach((item) => {
      if (item.cantidad_devolver > 0) {
        selectedProducts.push({
          key: item.key,
          cantidad: item.cantidad_devolver,
        });
      }
    });
    handleSelectProducts(selectedProducts);
    setOpen(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigo_producto",
      key: "codigo_producto",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 100,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      align: "center",
      width: 100,
    },
    {
      title: "Cantidad Entregada",
      dataIndex: "cantidad_entregada",
      key: "cantidad_entregada",
      align: "center",
      width: 100,
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_devuelta",
      key: "cantidad_devuelta",
      align: "center",
      width: 100,
    },
    {
      title: "Cant. a Devolver",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 120,
      render(
        _,
        {
          key,
          cantidad_entregada,
          cantidad_devuelta,
          cantidad_devolver,
          editable,
          blockAmount,
        }
      ) {
        const max = cantidad_entregada - cantidad_devuelta;
        return (
          <Space direction="vertical">
            {!blockAmount ? (
              editable ? (
                <InputNumber
                  autoFocus
                  defaultValue={cantidad_devolver == 0 ? "" : cantidad_devolver}
                  size="small"
                  min={0}
                  onBlur={() => handleChangeEdit(key)}
                  onChange={(e: any) => handleChangeAmount(e, key)}
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(key)}
                  type={cantidad_devolver > max ? "danger" : undefined}
                >
                  {cantidad_devolver}
                </StyledText>
              )
            ) : (
              <Text type="danger" style={{ fontSize: 11 }}>
                Cantidad máxima cumplida
              </Text>
            )}
            {!blockAmount ? (
              <Text type="danger" style={{ fontSize: 11 }}>
                Máx.: {max}
              </Text>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        title={"Productos Dispensados"}
        open={open}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        okText={"Agregar"}
        okButtonProps={{ disabled: btnAdd }}
        cancelText={"Cancelar"}
        width={1200}
        onOk={() => handleAddProducts()}
        onCancel={() => setOpen(false)}
        style={{ top: 20 }}
      >
        <Table
          size="small"
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: 500, x: 500 }}
          pagination={{ pageSize: 6, simple: false }}
        />
      </Modal>
    </>
  );
};
