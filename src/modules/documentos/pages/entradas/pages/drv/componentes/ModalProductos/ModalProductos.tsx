/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InputNumber,
  Modal,
  Table,
  Typography,
  Space,
  notification,
  Input,
} from "antd";
import { DataType, Props, SelectedProduct } from "./types";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { SearchBar, StyledText } from "./styled";

const { Text } = Typography;

export const ModalProductos = ({
  open,
  setOpen,
  remision,
  handleSelectProducts,
  detalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  useEffect(() => {
    const productos: DataType[] = [];
    if (remision) {
      remision.detalle.forEach((item) => {
        const key = `${item.id}_${item.producto_lote_id}`;
        let blockAmount = false;
        if (item.cantidad == item.cantidad_dev) {
          blockAmount = true;
        }

        if (!detalle.includes(key)) {
          productos.push({
            key: key,
            cod_producto: item.lote.producto_id.toString(),
            desc_producto: item.lote.productos.descripcion,
            cantidad: parseInt(item.cantidad),
            cantidad_dev: parseInt(item.cantidad_dev),
            cantidad_devolver: 0,
            lote: item.lote.lote,
            f_vence: item.lote.fecha_vencimiento,
            editable: false,
            blockAmount,
          });
        }
      });
    }
    setDataSource(productos);
    setInitialData(productos);
  }, [remision, detalle]);

  useEffect(() => {
    let flag = false;
    dataSource.forEach((item) => {
      const max = item.cantidad - item.cantidad_dev;
      if (item.cantidad_devolver > max) {
        flag = true;
        notificationApi.open({
          type: "warning",
          message: `El producto ${item.desc_producto} de lote ${item.lote} y fecha de vencimiento ${item.f_vence} excede la cantidad máxima de ${max}`,
          placement: "topLeft",
        });
      }
    });
    setBtnAdd(flag);
  }, [dataSource]);

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      setDataSource(newData);
      setInitialData(newData);
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
    setInitialData(newDataFilter);
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
      title: "Código Producto",
      dataIndex: "cod_producto",
      key: "cod_producto",
      align: "center",
      width: 100,
    },
    {
      title: "Desc. Producto",
      dataIndex: "desc_producto",
      key: "desc_producto",
    },
    {
      title: "Cantidad Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 70,
    },
    {
      title: "Cantidad Devuelta",
      dataIndex: "cantidad_dev",
      key: "cantidad_dev",
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
          cantidad_dev,
          cantidad_devolver,
          editable,
          blockAmount,
        }
      ) {
        const max = cantidad - cantidad_dev;
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
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 90,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "f_vence",
      key: "f_vence",
      align: "center",
      width: 90,
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        title={"Productos Vendidos"}
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
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
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
