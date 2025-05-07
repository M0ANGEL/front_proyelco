/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  notification,
  InputProps,
  Divider,
  Button,
  Switch,
  Input,
  Modal,
  Table,
  Form,
  Col,
  Row,
  Tag,
} from "antd";
import { getProductxLotes } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { ChangeEvent, useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import "./styles.css";
const { Search } = Input;

export const ModalProductos = ({
  open,
  setOpen,
  onSetDataSource,
  hasFuente,
}: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();

  const fetchProductos = (value: string, bodega_id: string) => {
    setLoaderTable(true);
    getProductxLotes(value, bodega_id).then(({ data: { data } }) => {
      const productos: any[] = data.map((producto) => {
        const uniqueKey = `${producto.id}-${producto.lote}-${producto.fecha_vencimiento}`;
        return {
          key: uniqueKey,
          id: producto.producto_id,
          descripcion: producto.descripcion,
          codigo_servinte: producto.cod_huv,
          precio_promedio: parseInt(producto.precio_promedio),
          stock: producto.stock,
          cantidad: 0,
          lote: producto.lote,
          fvence: producto.fecha_vencimiento,
          valor: (0).toString(),
          precio_lista: producto.precio_promedio,
          iva: producto.iva,
          editable: false,
          id_lote: producto.id,
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

  const isCantidadDisabled = (record: DataType): boolean => {
    return isNaN(record.precio_promedio);
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
      sorter: (a, b) =>
        a.codigo_servinte
          .toString()
          .localeCompare(b.codigo_servinte.toString()),
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
      render: (text: string, record: DataType) => {
        const rowClass = rowClassName(record);

        if (rowClass === "row-red") {
          return (
            <div>
              {text} {/* Mostrar el texto original después del Tag */}
              <Tag color="red">Producto sin precio promedio</Tag>
            </div>
          );
        }

        return text; // Mostrar el precio si no es 0
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
      render: (_, record) => {
        return (
          <>
            {record.editable ? (
              <Input
                autoFocus
                allowClear
                defaultValue={record.cantidad == 0 ? "" : record.cantidad}
                size="small"
                onBlur={() => handleChangeEdit(record.key)}
                onChange={(e: any) => handleChangeAmount(e, record.key)}
                disabled={isCantidadDisabled(record)}
              />
            ) : (
              <StyledText onClick={() => handleChangeEdit(record.key)}>
                {record.cantidad}
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
      if (item.cantidad > parseInt(item.stock)) {
        const message_err = "La cantidad no debe superar el valor en stock.";
        notificationApi.open({
          type: "error",
          message: message_err,
        });
        flag = true;
      }
      setBtnAdd(flag);
    });
  }, [selectRows]);

  const handleChangeAmount = (e: ChangeEvent<InputProps>, key: React.Key) => {
    const valor: any = e.target.value;

    if (!isNaN(valor) && parseFloat(valor) > 0) {
      const cantidad: number = valor ? parseInt(valor) : 0;
      if (cantidad > 0) {
        const newSelectRows: any[] = selectRows.map((producto) =>
          producto.key === key
            ? {
                ...producto,
                cantidad: isNaN(cantidad) ? "0" : cantidad.toString(),
                valor: isNaN(cantidad)
                  ? "0"
                  : (parseFloat(producto.precio_lista) * cantidad).toString(), // Calcular el nuevo valor
              }
            : producto
        );

        setSelectRows(newSelectRows);

        const updatedSelectRows = newSelectRows.map((producto) => {
          const precioPromedio = parseFloat(producto.precio_lista);
          const valor = isNaN(precioPromedio)
            ? "0"
            : precioPromedio * parseInt(producto.cantidad);
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
          const selectItem: any[] = dataSource
            .filter((item) => item.key === key)
            .map((item) => ({
              ...item,
              cantidad: cantidad.toString(),
              editable: false,
            }));
          setSelectRows(selectRows.concat(selectItem));
        }
      } else {
        const newDataSelect = selectRows.filter((item) => item.key != key);
        setSelectRows(newDataSelect);
      }

      const newDataFilter: any[] = dataSource.map((item) => {
        if (item.key === key) {
          return { ...item, cantidad: cantidad.toString() };
        } else {
          return item;
        }
      });
      setDataSource(newDataFilter);
    } else {
      notificationApi.error({
        message: "La cantidad ingresada no es válida.",
        duration: 3,
      });
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
    return isNaN(record.precio_promedio) ? "row-red" : "";
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        footer={[
          <Button
            key={"btnAgregar"}
            type="primary"
            onClick={() => {
              onSetDataSource(selectRows);
              setOpen(false);
              setSelectRows([]);
              setDataSource([]);
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
              setOpen(false);
              setDataSource([]);
            }}
          >
            Cancelar
          </Button>,
        ]}
        destroyOnClose
        maskClosable={false}
        closable={false}
        width={900}
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
              rowKey={(record) => record.key}
              size="small"
              loading={loaderTable}
              dataSource={selectFlag ? selectRows : dataSource}
              columns={columns}
              rowClassName={rowClassName}
              scroll={{ y: 300 }}
              pagination={{
                simple: false,
              }}
              bordered
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
