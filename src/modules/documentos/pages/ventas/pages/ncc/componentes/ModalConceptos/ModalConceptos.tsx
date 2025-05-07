/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputNumber, Modal, Table, Typography, Space, message } from "antd";
import { DataType, Props, SelectedProduct } from "./types";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";

const { Text } = Typography;

export const ModalConceptos = ({
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
        const key = `${item.id}`;
        let blockAmount = false;
        if (item.cantidad == item.cantidad_dev) {
          blockAmount = true;
        }
        if (!detalle.includes(item.concepto)) {
          productos.push({
            key: key,
            concepto: item.concepto,
            cantidad: parseInt(item.cantidad),
            cantidad_dev: parseInt(item.cantidad_dev),
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
      if (item.cantidad_devolver > item.cantidad && item.editable == false) {
        setBtnAdd(true);
        messageApi.open({
          type: "error",
          content: `El concepto ${item.concepto} excede la cantidad máxima de ${item.cantidad_devolver}`,
          style: {
            marginTop: "1vh",
          },
          duration: 2,
        });
        return;
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
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
    },
    {
      title: "Cantidad Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 70,
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
          cantidad,
          cantidad_devolver,
          editable,
        }
      ) {
        return (
          <Space direction="vertical">
            {editable ? (
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
                  type={cantidad_devolver > cantidad ? "danger" : undefined}
                  >
                  {cantidad_devolver}
                </StyledText>
              )}
              {cantidad_devolver > cantidad && (
                <Text type="danger" style={{ fontSize: 11 }}>
                  La cantidad a devolver no puede ser mayor que {cantidad}
                </Text>
              )}
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
          pagination={{ pageSize: 6, simple: false }}
        />
      </Modal>
    </>
  );
};
