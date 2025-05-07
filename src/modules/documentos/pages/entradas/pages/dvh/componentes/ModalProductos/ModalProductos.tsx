/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType, Props, SelectedProduct } from "./types";
import { SearchBar, StyledText } from "./styled";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  InputNumber,
  Typography,
  Input,
  Modal,
  Space,
  Table,
  notification,
} from "antd";

const { Text } = Typography;

export const ModalProductos = ({
  handleSelectProducts,
  dispensaciones,
  hasFuente,
  detalle,
  setOpen,
  open,
}: Props) => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [btnAdd, setBtnAdd] = useState<boolean>(false);

  useEffect(() => {
    const productos: DataType[] = [];
    dispensaciones.forEach((dispensacion) => {
      dispensacion.detalle.forEach((dis_detalle) => {
        const key = `${dispensacion.id}_${dis_detalle.id}`;

        let blockAmount = false;
        if (dis_detalle.cantidad_entregada == dis_detalle.cantidad_dev) {
          blockAmount = true;
        }
        if (!detalle.includes(key)) {
          productos.push({
            key: `${dispensacion.id}_${dis_detalle.id}`,
            cod_huv: dis_detalle.productos_lotes.productos.cod_huv,
            fuente: dispensacion.fuente ? dispensacion.fuente.prefijo : "",
            numero_servinte: dispensacion.numero_servinte,
            fecha_creacion: dayjs(dispensacion.created_at).format(
              "YYYY-MM-DD HH:mm"
            ),
            consec_dis: dispensacion.consecutivo,
            cod_producto: dis_detalle.productos_lotes.producto_id.toString(),
            desc_producto: dis_detalle.productos_lotes.productos.descripcion,
            cantidad: parseInt(dis_detalle.cantidad_entregada),
            cantidad_dev: parseInt(dis_detalle.cantidad_dev),
            cantidad_devolver: 0,
            lote: dis_detalle.productos_lotes.lote,
            f_vence: dis_detalle.productos_lotes.fecha_vencimiento,
            bodega: dispensacion.bodegas.bod_nombre,
            editable: false,
            blockAmount,
          });
        }
      });
    });
    setDataSource(productos);
    setInitialData(productos);
  }, [dispensaciones, detalle]);

  useEffect(() => {
    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      const max = item.cantidad - item.cantidad_dev;
      if (item.cantidad_devolver > max) {
        setBtnAdd(true);
        notificationApi.open({
          type: "error",
          message: `El producto ${item.desc_producto} de lote ${item.lote} y fecha de vencimiento ${item.f_vence} excede la cantidad máxima de ${max}`,
          style: {
            marginTop: "1vh",
          },
          duration: 2,
          placement: "topLeft",
        });
        break;
      } else {
        setBtnAdd(false);
      }
    }
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

    const newInitialDataFilter = initialData.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad_devolver: cantidad ? cantidad : 0 };
      } else {
        return item;
      }
    });
    setInitialData(newInitialDataFilter);
  };

  const handleAddProducts = () => {
    const selectedProducts: SelectedProduct[] = [];
    initialData.forEach((item) => {
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
      title: "DIS",
      dataIndex: "consec_dis",
      key: "consec_dis",
      align: "center",
      width: 120,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 120,
    },
    {
      title: "Fuente",
      dataIndex: "fuente",
      key: "fuente",
      align: "center",
      hidden: !hasFuente,
      width: 60,
    },
    {
      title: "Nro. Serviente",
      dataIndex: "numero_servinte",
      key: "numero_servinte",
      align: "center",
      hidden: !hasFuente,
      width: 120,
    },
    {
      title: "Fecha creación",
      dataIndex: "fecha_creacion",
      key: "fecha_creacion",
      align: "center",
      width: 120,
    },
    {
      title: "Código Producto",
      dataIndex: "cod_producto",
      key: "cod_producto",
      align: "center",
      width: 100,
    },
    {
      title: "Código Servinte",
      dataIndex: "cod_huv",
      key: "cod_huv",
      align: "center",
      width: 100,
      hidden: !hasFuente,
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
          blockAmount,
          editable,
          cantidad,
          cantidad_dev,
          cantidad_devolver,
          key,
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
                Cantidad máxima devuelta
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData
      ?.filter((o: any) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(value.toLowerCase())
        )
      )
      .map((item) => {
        return { ...item, editable: false };
      });
    setDataSource(filterTable);
  };

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
        width={1400}
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
          pagination={{ pageSize: 6, simple: false, hideOnSinglePage: true }}
        />
      </Modal>
    </>
  );
};
