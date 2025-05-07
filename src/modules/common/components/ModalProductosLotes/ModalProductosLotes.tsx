/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  InputNumber,
  Modal,
  Space,
  Table,
  Typography,
  Row,
  Col,
  Form,
  Switch,
  notification,
  Tag,
} from "antd";
import { DataType, Props } from "./types";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import Search from "antd/es/input/Search";
import { searchLotes } from "@/services/documentos/rvdAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import dayjs from "dayjs";

const { Text } = Typography;

export const ModalProductosLotes = ({
  open,
  setOpen,
  handleAddProducts,
  detalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [listaOriginal, setListaOriginal] = useState<DataType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [selectFlagPrecios, setSelectFlagPrecios] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();

  useEffect(() => {
    let flag = false;
    dataSource.forEach(
      ({ stock, lote, cantidad, fvence, descripcion }) => {
        if (cantidad > stock!) {
          notificationApi.warning({
            message: `El item ${descripcion} con lote ${lote} y fecha de vencimiento ${fvence} excede la cantidad en stock`,
          });
          flag = true;
        }
      }
    );
    setBtnAdd(flag);
  }, [dataSource, notificationApi]);

  useEffect(() => {
    if (selectFlagPrecios) {
      setListaOriginal(dataSource);
      setDataSource(dataSource.filter(({ precio_promedio }) => precio_promedio > 0));
    } else {
      setDataSource(listaOriginal);
    }
  }, [selectFlagPrecios]);

  const clearValues = () => {
    setDataSource([]);
    setListaOriginal([]);
    setSelectedProducts([]);
    setSelectFlag(false);
    setSelectFlagPrecios(false);
  };

  const handleChangeEdit = (key: React.Key) => {
    const newData = selectFlag ? [...selectedProducts] : [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      selectFlag ? setSelectedProducts(newData) : setDataSource(newData);
    }
  };

  const handleChangeAmount = (cantidad: number, key: React.Key) => {
    const newDataFilter = dataSource.map((item) => {
      const precio_subtotal = cantidad * item.precio_promedio;
      const precio_iva = precio_subtotal * (item.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      if (item.key === key) {
        // Condicion de si el producto ya se encuentra dentro de los seleccionados para modificar la cantidad
        if (selectedProducts.some(({ key: itemKey }) => itemKey == key)) {
          // En caso de que la cantidad sea sea mayor a cero se modifica la cantidad del producto seleccionado
          if (cantidad > 0) {
            setSelectedProducts(
              selectedProducts.map((item) => {
                if (item.key == key) {
                  return {
                    ...item,
                    cantidad: cantidad,
                    precio_subtotal,
                    precio_iva,
                    precio_total,
                  };
                } else {
                  return item;
                }
              })
            );
            // En caso de que la cantidad sea cero se quita los productos seleccionados
          } else if (cantidad == 0) {
            setSelectedProducts(
              selectedProducts.filter(({ key: itemKey }) => itemKey != key)
            );
          }
        } else {
          // Si no encuentra el producto dentro de los productos selecionados se añade a los productos seleccionados en caso de que la cantidad sea mayor a cero
          if (cantidad > 0) {
            setSelectedProducts([
              ...selectedProducts,
              {
                ...item,
                cantidad,
                editable: false,
                precio_subtotal,
                precio_iva,
                precio_total,
              },
            ]);
          }
        }

        return {
          ...item,
          cantidad: cantidad ? cantidad : 0,
          precio_subtotal,
          precio_iva,
          precio_total,
        };
      } else {
        return item;
      }
    });
    setDataSource(newDataFilter);
  };


  const onSearch = (value: string) => {
    if (value.length > 0) {
      setSelectFlag(false);
      setSelectFlagPrecios(false);
      fetchProductos(value);
    }
  };

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    searchLotes(value, getSessionVariable(KEY_BODEGA))
      .then(({ data: { data } }) => {
        const productos: DataType[] = [];

        data.forEach((lote) => {
          const precio_promedio = parseFloat(lote.productos.precio_promedio);
          let cantidad = 0;
          // Se valida si dentro de los productos seleccionados se encuentra el lote para setearle la cantidad en caso de que se haga otra consulta
          const selectedItem = selectedProducts.find(
            (item) => item.key == lote.id
          );
          if (selectedItem) {
            cantidad = selectedItem.cantidad;
          }
          const iva = parseInt(lote.productos.ivas.iva);
          const precio_subtotal = cantidad * precio_promedio;
          const precio_iva = precio_subtotal * (iva / 100);
          const precio_total = precio_subtotal + precio_iva;
          if (!detalle.some(({ key }) => lote.id == key)) {
            productos.push({
              key: lote.id,
              cantidad,
              descripcion: lote.productos.descripcion,
              editable: false,
              fvence: lote.fecha_vencimiento,
              iva,
              lote: lote.lote,
              precio_promedio,
              id: lote.producto_id,
              stock: parseInt(lote.stock),
              precio_iva,
              precio_subtotal,
              precio_total,
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
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código Producto",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción Producto",
      dataIndex: "descripcion",
      key: "descripcion",
      render(_, { precio_promedio, descripcion,fvence }) {
        const dateNow=dayjs(new Date());
        const diferenciaEnDias = dayjs(fvence).diff(dateNow, 'day');
        return (
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Text>{descripcion}</Text>
            {precio_promedio == 0 ? (
              <Tag color="red">Producto sin precio promedio</Tag>
            ) : null}
            {diferenciaEnDias==0 || diferenciaEnDias < 180 ? (
              <Tag color="red">Producto vencido o proximo a vencer</Tag>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      width: 70,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 120,
      render(_, { key, editable, stock, cantidad, precio_promedio }) {
        return (
          <Space direction="vertical">
            {precio_promedio > 0  ? (
              editable ? (
                <InputNumber
                  autoFocus
                  defaultValue={cantidad}
                  size="small"
                  min={0}
                  controls={false}
                  keyboard={false}
                  onBlur={() => handleChangeEdit(key)}
                  onChange={(e: any) => handleChangeAmount(e, key)}
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(key)}
                  type={cantidad > stock! ? "danger" : undefined}
                >
                  {cantidad}
                </StyledText>
              )
            ) : (
              <Text> {cantidad}</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 120,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      align: "center",
      width: 120,
    },
  ];

  const checkCondition = ({ precio_promedio, fvence }: DataType) => {
    const dateNow=dayjs(new Date());
    const diferenciaEnDias = dayjs(fvence).diff(dateNow, 'day');
    if (precio_promedio == 0 || diferenciaEnDias < 180) {
      return "red-row";
    } else {
      return "";
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={"Productos Lotes "}
        open={open}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        okText={"Agregar"}
        okButtonProps={{
          disabled: btnAdd || (!btnAdd && selectedProducts.length == 0),
        }}
        cancelText={"Cancelar"}
        width={1200}
        onOk={() => {
          handleAddProducts(selectedProducts);
          clearValues();
          setOpen(false);
        }}
        onCancel={() => {
          clearValues();
          setOpen(false);
        }}
        style={{ top: 20 }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Search
              enterButton
              type="primary"
              onSearch={onSearch}
              placeholder="Buscar Producto"
            />
          </Col>
          <Col span={24} style={{ marginTop: 10 }}>
            <Form layout="inline" disabled={dataSource.length == 0}>
              <Form.Item
                label="Ver productos con cantidades:"
                style={{ marginBottom: 10 }}
              >
                <Switch
                  size="small"
                  checked={selectFlag}
                  onChange={() => setSelectFlag(selectFlag ? false : true)}
                />
              </Form.Item>
              <Form.Item
                label="Ver productos con precios:"
                style={{ marginBottom: 10 }}
              >
                <Switch
                  size="small"
                  checked={selectFlagPrecios}
                  onChange={() =>
                    setSelectFlagPrecios(selectFlagPrecios ? false : true)
                  }
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              columns={columns}
              dataSource={selectFlag ? selectedProducts : dataSource}
              pagination={{ pageSize: 10, simple: false }}
              loading={loaderTable}
              rowClassName={checkCondition}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
