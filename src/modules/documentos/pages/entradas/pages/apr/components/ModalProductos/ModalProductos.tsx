/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { buscarProducto } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";

const { Search } = Input;
const { Text } = Typography;

export const ModalProductos = ({ open, setOpen, onSetDataSource }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value).then(({ data: { data } }) => {
      const productos: DataType[] = data.map((producto) => {
        return {
          key: producto.id,
          id: producto.id,
          descripcion: producto.descripcion,
          iva: parseFloat(producto.ivas.iva),
          precio_promedio: parseFloat(producto.precio_promedio),
          cantidad: 0,
          editable: false,
          editableLote: false,
          lote: "",
          fvence: "",
          precio_subtotal: 0,
          precio_total: 0,
          precio_iva: 0,
          itemFromModal: true,
        };
      });
      setDataSource(productos);
      setLoaderTable(false);
    });
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      // sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render(_, { precio_promedio, descripcion }) {
        return (
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Text>{descripcion}</Text>
            {precio_promedio == 0 ? (
              <Tag color="red">Producto sin precio promedio</Tag>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad_devolver",
      key: "cantidad_devolver",
      align: "center",
      width: 120,
      render(_, { key, editable, cantidad, precio_promedio }) {
        //stock
        return (
          <Space direction="vertical">
            {precio_promedio > 0 ? (
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
                  // type={cantidad > stock ? "danger" : undefined}
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
  ];

  const handleChangeAmount = (cantidad: number, key: React.Key) => {
    // const cantidad: number = e;
    if (cantidad > 0) {
      // Aqui consulta y valida si la key existe en los productos seleccionados para actualizar cantidad
      const validItem = selectRows.filter((item) => item.key === key);
      if (validItem.length > 0) {
        // Si existe, entra a cambiar la modificar la cantidad segun la key en e arreglo de productos seleccionados
        setSelectRows(
          selectRows.map((item) => {
            if (item.key === key) {
              const precio_subtotal = item.precio_promedio * cantidad;
              const precio_iva = precio_subtotal * (item.iva / 100);
              const precio_total = precio_subtotal + precio_iva;
              return {
                ...item,
                cantidad,
                precio_subtotal,
                precio_iva,
                precio_total,
              };
            } else {
              return item;
            }
          })
        );
      } else {
        // En caso de que sea un nuevo producto en el arreglo de productos seleccionados hace el ingreso con la cantidad correspondiente
        const selectItem = dataSource
          .filter((item) => item.key === key)
          .map((item) => {
            const precio_subtotal = item.precio_promedio * cantidad;
            const precio_iva = precio_subtotal * (item.iva / 100);
            const precio_total = precio_subtotal + precio_iva;
            return { ...item, cantidad, editable: false,precio_subtotal,precio_iva ,precio_total};
          });
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
        const precio_subtotal = item.precio_promedio * cantidad;
        const precio_iva = precio_subtotal * (item.iva / 100);
        const precio_total = precio_subtotal + precio_iva;
        return { ...item, cantidad: cantidad < 0 ? 0 : cantidad,precio_subtotal,precio_iva,precio_total};
      } else {
        return item;
      }
    });
    setDataSource(newDataFilter);
  };

  const handleChangeEdit = (key: React.Key) => {
    const newData = selectFlag ? [...selectRows] : [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      selectFlag ? setSelectRows(newData) : setDataSource(newData);
    }
  };

  const checkCondition = ({ precio_promedio }: DataType) => {
    if (precio_promedio == 0) {
      return "red-row";
    } else {
      return "";
    }
  };

  return (
    <Modal
      open={open}
      footer={[
        <Button
          key={"btnAgregar"}
          type="primary"
          onClick={() => {
            setSelectFlag(false);
            onSetDataSource(selectRows);
            setOpen(false);
            setSelectRows([]);
            setDataSource([]);
          }}
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
            rowClassName={checkCondition}
            dataSource={selectFlag ? selectRows : dataSource}
            columns={columns}
            scroll={{ y: 300 }}
            pagination={{
              simple: false,
            }}
            bordered
          />
        </Col>
      </Row>
    </Modal>
  );
};
