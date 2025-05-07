/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getProductxLotes } from "@/services/maestras/productosAPI";
import { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { DataTypeProductos, Props } from "./types";
import { KEY_BODEGA } from "@/config/api";
import { StyledText } from "./styled";
import dayjs from "dayjs";
import "./styles.css";
import {
  InputNumber,
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
  Tag,
} from "antd";

const { Search } = Input;

export const ModalProductos = ({
  hasFuente,
  setOpen,
  open,
  addProducts,
  detalle,
}: Props) => {
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataTypeProductos[]>([]);
  const [selectRows, setSelectRows] = useState<DataTypeProductos[]>([]);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();

  const fetchProductos = (value: string, bodega_id: string) => {
    setLoaderTable(true);
    getProductxLotes(value, bodega_id).then(({ data: { data } }) => {
      const productos = data.map((productoLote) => {
        return {
          key: productoLote.id,
          id: productoLote.id,
          producto_id: productoLote.producto_id,
          descripcion: productoLote.descripcion,
          cantidad: 0,
          precio_promedio: parseFloat(productoLote.precio_promedio),
          lote: productoLote.lote,
          fvence: productoLote.fecha_vencimiento,
          editable: false,
          codigo_servinte: productoLote.cod_huv,
          stock: parseInt(productoLote.stock),
          iva: parseFloat(productoLote.iva),
        };
      });

      setDataSource(productos);
      setLoaderTable(false);
    });
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value, getSessionVariable(KEY_BODEGA));
    }
  };

  const columns: ColumnsType<DataTypeProductos> = [
    {
      title: "Código",
      dataIndex: "producto_id",
      key: "producto_id",
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      align: "center",
      fixed: "left",
      width: 100,
      hidden: !hasFuente,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
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
      render: (_, { editable, cantidad, key, precio_promedio, stock }) => {
        return (
          <>
            {editable &&
            precio_promedio != 0 &&
            !detalle.some((item) => item.key == key) ? (
              <InputNumber
                autoFocus
                controls={false}
                defaultValue={cantidad == 0 ? "" : cantidad}
                size="small"
                max={stock}
                onBlur={() => handleChangeEdit(key)}
                onChange={(e: any) => handleChangeAmount(e, key)}
                disabled={precio_promedio == 0}
                onKeyDown={(e) => {
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                style={{ width: "100%" }}
              />
            ) : (
              <Space direction="vertical">
                {detalle.some((item) => item.key == key) ? (
                  <Tag color={"red"} style={{ fontSize: 10 }}>
                    Item agregado
                  </Tag>
                ) : (
                  <StyledText onClick={() => handleChangeEdit(key)}>
                    {cantidad}
                  </StyledText>
                )}
              </Space>
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
      align: "center",
      fixed: "right",
      width: 150,
    },
  ];

  useEffect(() => {
    let flag = false;

    selectRows.forEach((item) => {
      if (item.cantidad > item.stock && !flag) {
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

  const handleChangeAmount = (e: number, key: React.Key) => {
    const valor: number = e;

    if (!isNaN(valor) && valor >= 0) {
      const cantidad: number = valor ? valor : 0;
      if (cantidad > 0) {
        const newSelectRows = selectRows.map((producto) =>
          producto.key === key
            ? {
                ...producto,
                cantidad: isNaN(cantidad) ? 0 : cantidad,
                valor: isNaN(cantidad)
                  ? 0
                  : producto.precio_promedio * cantidad,
              }
            : producto
        );

        const updatedSelectRows = newSelectRows.map((producto) => {
          const precioPromedio = producto.precio_promedio;
          const valor = isNaN(precioPromedio)
            ? "0"
            : precioPromedio * producto.cantidad;
          return { ...producto, valor };
        });
        setSelectRows(updatedSelectRows);
        const validItem = selectRows.filter((item) => item.key === key);
        if (validItem.length > 0) {
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
        const newDataSelect = selectRows.filter((item) => item.key != key);
        setSelectRows(newDataSelect);
      }

      const newDataFilter = dataSource.map((item) => {
        if (item.key === key) {
          return { ...item, cantidad };
        } else {
          return item;
        }
      });
      setDataSource(newDataFilter);
    } else {
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

  const rowClassName = (record: DataTypeProductos) => {
    const date_diff_fvence = dayjs(Date()).diff(dayjs(record.fvence), "days");
    return record.precio_promedio === 0 || date_diff_fvence > 0
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
            console.log(selectRows);
            addProducts(selectRows);
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
