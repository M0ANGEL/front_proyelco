/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputProps,
  Modal,
  Row,
  Switch,
  Table,
  Typography,
} from "antd";
import { buscarProducto } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { ChangeEvent, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";

const { Search } = Input;
const { Text } = Typography;

export const ModalProductos = ({
  open,
  setOpen,
  handleSelectProductos,
  detalle,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value).then(({ data: { data } }) => {
      const productos: DataType[] = [];
      data.forEach((producto) => {
        if (!detalle.some((item) => item.key == producto.id)) {
          // Filtro por precio regulado, en caso de tener circular de regulación y precio de compra regulado en cero no aparece en la lista para agregar
          // let flag = true;
          // if (!["0", ""].includes(producto.circular_regulacion)) {
          //   if (parseFloat(producto.p_regulado_compra) == 0) {
          //     flag = false;
          //   }
          // }
          // if (flag) {
          productos.push({
            key: producto.id,
            descripcion: producto.descripcion,
            precio_promedio: parseInt(producto.precio_promedio),
            cantidad: 0,
            editable: false,
            producto: producto,
          });
          // }
        }
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
      fixed: "left",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 240,
      render: (_, { key, cantidad, editable, producto: { cod_padre } }) => {
        return (
          <>
            {detalle.some((item) => item.cod_padre == cod_padre) ||
            (selectRows.some((item) => item.producto.cod_padre == cod_padre) &&
              cantidad == 0) ? (
              <Text type="danger" style={{ fontSize: 10 }}>
                <b>PRINCIPIO ACTIVO</b>
                <br /> coincide con algún item del detalle o <br />
                en productos seleccionados
              </Text>
            ) : (
              <>
                {editable ? (
                  <Input
                    autoFocus
                    allowClear
                    defaultValue={cantidad == 0 ? "" : cantidad}
                    size="small"
                    onBlur={() => handleChangeEdit(key)}
                    onChange={(e: any) => handleChangeAmount(e, key)}
                  />
                ) : (
                  <StyledText onClick={() => handleChangeEdit(key)}>
                    {cantidad}
                  </StyledText>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  const handleChangeAmount = (e: ChangeEvent<InputProps>, key: React.Key) => {
    const valor: any = e.target.value;
    const cantidad: number = valor ? parseInt(valor) : 0;
    if (cantidad > 0) {
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
          .map((item) => ({ ...item, cantidad: cantidad, editable: false }));
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
        return { ...item, cantidad: cantidad };
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

  return (
    <Modal
      open={open}
      footer={[
        <Button
          key={"btnAgregar"}
          type="primary"
          onClick={() => {
            handleSelectProductos(selectRows);
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
            rowKey={(record) => record.key}
            size="small"
            loading={loaderTable}
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
