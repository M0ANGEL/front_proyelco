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
} from "antd";
import { buscarProducto } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { ChangeEvent, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";

const { Search } = Input;

export const ModalProductos = ({ open, setOpen, onSetDataSource }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    buscarProducto(value).then(({ data: { data } }) => {
      const productos = data.map((producto) => {
        return {
          key: producto.id,
          descripcion: producto.descripcion,
          precio_promedio: producto.precio_promedio,
          cantidad: 0,
          editable: false,
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
      width: 100,
      render: (
        _,
        record: { key: React.Key; cantidad: number; editable: boolean }
      ) => {
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

  // const agregarProductos = () => {};

  return (
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
