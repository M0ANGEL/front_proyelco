/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductxLotesPrecio } from "@/services/maestras/productosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { ChangeEvent, useState, useEffect } from "react";
import { Tag } from "@/../node_modules/antd/es/index";
import { ColumnsType } from "antd/es/table";
import { DataType, Props } from "./types";
import { KEY_BODEGA } from "@/config/api";
import { StyledText } from "./styled";
import dayjs from "dayjs";
import "./styles.css";
import {
  InputProps,
  Typography,
  Divider,
  message,
  Button,
  Switch,
  Input,
  Modal,
  Space,
  Table,
  Form,
  Col,
  Row,
} from "antd";

const { Text } = Typography;
const { Search } = Input;

export const ModalProductos = ({
  onSetDataSource,
  hasFuente,
  listPrice,
  setOpen,
  open,
}: Props) => {
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();

  const fetchProductos = (value: string, bodega_id: string) => {
    setLoaderTable(true);
    getProductxLotesPrecio(value, bodega_id, listPrice).then(
      ({ data: { data } }) => {
        const productos = data.map((producto) => {
          const uniqueKey = `${producto.id}-${producto.lote}-${
            producto.fecha_vencimiento
          }-${Math.floor(Math.random() * 99999)}`;

          return {
            key: uniqueKey,
            id: producto.producto_id,
            descripcion: producto.descripcion,
            precio_promedio: parseFloat(producto.precio_promedio),
            stock: producto.stock,
            cantidad: 0,
            lote: producto.lote,
            fvence: producto.fecha_vencimiento,
            fecha_invima: producto.fecha_vig_invima,
            valor: (0).toString(),
            precio_lista: producto.precio_lista_precio
              ? parseFloat(producto.precio_lista_precio)
              : 0,
            iva: producto.iva,
            editable: false,
            estado_invima: producto.estado_invima,
            codigo_servinte: producto.cod_huv,
          };
        });

        setDataSource(productos);
        setLoaderTable(false);
      }
    );
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value, getSessionVariable(KEY_BODEGA));
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 100,
      hidden: !hasFuente,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (value: string, record: DataType) => {
        const estadoInvima = record.estado_invima;
        const date_diff_fvence = dayjs(Date()).diff(
          dayjs(record.fvence),
          "days"
        );
        return (
          <Space direction="vertical" size={0}>
            <Text>{value}</Text>
            {record.precio_lista === 0 ? (
              <Tag color="red">Producto sin precio de venta</Tag>
            ) : null}
            {record.precio_promedio === 0 ? (
              <Tag color="red">Producto sin precio promedio</Tag>
            ) : null}
            {date_diff_fvence > 0 ? (
              <Tag color="red">Producto vencido</Tag>
            ) : null}
            {![
              "En tramite renov",
              "N/A",
              "Vigente",
              "Temp. no comerc - Vigente",
              "Temp. no comercializado - En TrAmite Renov",
            ].includes(estadoInvima) ? (
              <Tag color="red">Registro Invima vencido</Tag>
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
      fixed: "right",
      width: 90,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 100,
      render: (
        _,
        {
          estado_invima,
          editable,
          cantidad,
          key,
          precio_lista,
          precio_promedio,
          fvence,
        }
      ) => {
        const date_diff_fvence = dayjs(Date()).diff(dayjs(fvence), "days");
        return (
          <>
            {editable &&
            precio_lista != 0 &&
            precio_promedio != 0 &&
            [
              "En tramite renov",
              "N/A",
              "Vigente",
              "Temp. no comerc - Vigente",
              "Temp. no comercializado - En TrAmite Renov",
            ].includes(estado_invima) &&
            date_diff_fvence <= 0 ? (
              <Input
                autoFocus
                allowClear
                defaultValue={cantidad == 0 ? "" : cantidad}
                size="small"
                onBlur={() => handleChangeEdit(key)}
                onChange={(e: any) => handleChangeAmount(e, key)}
                disabled={
                  precio_lista == 0 ||
                  precio_promedio == 0 ||
                  ![
                    "En tramite renov",
                    "N/A",
                    "Vigente",
                    "Temp. no comerc - Vigente",
                    "Temp. no comercializado - En TrAmite Renov",
                  ].includes(estado_invima) ||
                  date_diff_fvence > 0
                }
              />
            ) : (
              <StyledText onClick={() => handleChangeEdit(key)}>
                {cantidad}
              </StyledText>
            )}
          </>
        );
      },
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      fixed: "right",
      width: 90,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      fixed: "right",
      width: 150,
    },
  ];

  useEffect(() => {
    let flag = false;

    selectRows.forEach((item) => {
      if (item.cantidad > parseInt(item.stock) && !flag) {
        const message_err = "La cantidad no debe superar el valor en stock.";
        message.open({
          type: "error",
          content: message_err,
        });
        flag = true;
      }
    });
    setBtnAdd(flag);
  }, [selectRows]);

  const handleChangeAmount = (e: ChangeEvent<InputProps>, key: React.Key) => {
    // Obtener el identificador único del producto actual
    // const currentProductId = key;
    const valor: any = e.target.value;

    // Verificar si el valor es numérico y no negativo
    if (!isNaN(valor) && parseFloat(valor) >= 0) {
      const cantidad: number = valor ? parseInt(valor) : 0;
      // const producto = selectRows.find(
      //   (producto) => producto.key === currentProductId
      // );
      if (cantidad > 0) {
        // if (producto && cantidad > parseInt(producto.stock)) {
        //   const message_err = "La cantidad no debe superar el valor en stock.";
        //   message.open({
        //     type: "error",
        //     content: message_err,
        //   });
        //   setBtnAdd(true);
        //   cantidad = 0;
        // }

        // setBtnAdd(false);
        // Actualizar el valor de cantidad
        const newSelectRows = selectRows.map((producto) =>
          producto.key === key
            ? {
                ...producto,
                cantidad: isNaN(cantidad) ? 0 : cantidad,
                valor: isNaN(cantidad) ? 0 : producto.precio_lista * cantidad, // Calcular el nuevo valor
              }
            : producto
        );

        // Calcular el valor solo si la cantidad es un número válido
        // if (!isNaN(cantidad) && producto) {
        // Calcular el total acumulado sumando los valores de todos los productos seleccionados
        // const total = selectRows.reduce(
        //   (acc, curr) => acc + parseFloat(curr.valor),
        //   0
        // );

        // Llamar a la función onUpdateTotal para actualizar el total en el componente padre
        // onUpdateTotal(total);
        // }

        const updatedSelectRows = newSelectRows.map((producto) => {
          const precioPromedio = producto.precio_lista;
          const valor = isNaN(precioPromedio)
            ? "0"
            : precioPromedio * producto.cantidad;
          return { ...producto, valor };
        });
        setSelectRows(updatedSelectRows);
        // Aqui consulta y valida si la key existe en los productos seleccionados para actualizar cantidad
        const validItem = selectRows.filter((item) => item.key === key);
        if (validItem.length > 0) {
          // Si existe, entra a cambiar la modificar la cantidad segun la key en e arreglo de productos seleccionados
          setSelectRows(
            selectRows.map((item) => {
              if (item.key === key) {
                return { ...item, cantidad: cantidad };
              } else {
                return item;
              }
            })
          );
        } else {
          // En caso de que sea un nuevo producto en el arreglo de productos seleccionados hace el ingreso con la cantidad correspondiente
          const selectItem = dataSource
            .filter((item) => item.key === key)
            .map((item) => ({
              ...item,
              cantidad,
              editable: false,
            }));
          setSelectRows(selectRows.concat(selectItem));
        }
      } else {
        // Aqui quita el registro de acuerdo a la key, ya que no se esta ingresando cantidad y es como si lo estuviera descartando
        const newDataSelect = selectRows.filter((item) => item.key != key);
        setSelectRows(newDataSelect);
      }

      // Aqui actualiza si o si el arreglo principal
      const newDataFilter = dataSource.map((item) => {
        if (item.key === key) {
          return { ...item, cantidad };
        } else {
          return item;
        }
      });
      setDataSource(newDataFilter);
    } else {
      // Mostrar mensaje de error si la cantidad no es válida
      message.error("La cantidad ingresada no es válida.", 3);
    }
  };

  const handleChangeEdit = (key: React.Key) => {
    const newData = selectFlag ? [...selectRows] : [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      selectFlag ? setSelectRows(newData) : setDataSource(newData);
    }
  };

  const rowClassName = (record: DataType) => {
    const date_diff_fvence = dayjs(Date()).diff(dayjs(record.fvence), "days");
    return record.precio_lista === 0 ||
      record.precio_promedio === 0 ||
      date_diff_fvence > 0
      ? "row-red"
      : "";
  };

  return (
    <Modal
      open={open}
      footer={[
        <Button
          key={"btnAgregar"}
          type="primary"
          onClick={() => {
            onSetDataSource(selectRows);
            setSelectRows([]);
            setDataSource([]);
            setSelectFlag(false);
            setOpen(false);
          }}
          disabled={btnAdd}
        >
          Agregar
        </Button>,
        <Button
          key={"btnCancelar"}
          type="primary"
          danger
          onClick={() => {
            setSelectFlag(false);
            setOpen(false);
            setDataSource([]);
            setSelectRows([]);
          }}
        >
          Cancelar
        </Button>,
      ]}
      destroyOnClose
      maskClosable={false}
      closable={false}
      width={1200}
      style={{ top: 20 }}
      key="modalProductos"
    >
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
        <Col span={12}>
          <Form>
            <Form.Item
              label="Ver productos con cantidades:"
              style={{ marginBottom: 10 }}
            >
              <Switch
                size="small"
                onChange={() => setSelectFlag(selectFlag ? false : true)}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table
            bordered
            size="small"
            columns={columns}
            scroll={{ y: 300 }}
            loading={loaderTable}
            rowClassName={rowClassName}
            rowKey={(record) => record.key}
            dataSource={selectFlag ? selectRows : dataSource}
            pagination={{
              simple: false,
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
