/* eslint-disable @typescript-eslint/no-explicit-any */
import { buscarProducto } from "@/services/maestras/productosAPI";
import { ListapreProductos, ProductoLote } from "@/services/types";
import { ModalLotesDisponibles } from "../ModalLotesDisponibles";
import { ChangeEvent, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { DataType, Props } from "./types";
import {
  validarExistenciasCodPadre,
  getProductosLPConvenio,
} from "@/services/documentos/pendApi";
import { StyledText } from "./styled";
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
} from "antd";

const { Search } = Input;

export const ModalProductos = ({
  onSetDataSource,
  bodega_id,
  convenio,
  setOpen,
  open,
}: Props) => {
  const [productosLista, setProductosLista] = useState<ListapreProductos[]>([]);
  const [lotesDisponibles, setLotesDisponibles] = useState<ProductoLote[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [openModalLotesDisponibles, setOpenModalLotesDisponibles] =
    useState<boolean>(false);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);

  useEffect(() => {
    if (open && convenio) {
      setLoaderTable(true);
      getProductosLPConvenio(convenio.id_listapre).then(
        ({ data: { data } }) => {
          setProductosLista(data);
          setLoaderTable(false);
        }
      );
    }
  }, [open, convenio]);

  const fetchProductos = (value: string) => {
    setLoaderTable(true);
    if (convenio) {
      buscarProducto(value).then(({ data: { data } }) => {
        const productos: DataType[] = [];
        // Consulto los productos de la maestra pero filtro solo los que estén dentro de la lista de precios del convenio
        data.forEach((producto, index) => {
          const uniqueKey = `${producto.id}-${index}-${producto.created_at}`;
          let precio_lista = 0;
          const productoLP = productosLista.find(
            (item) => producto.id.toString() == item.producto_id
          );
          if (productoLP) {
            precio_lista = parseFloat(productoLP.precio);
            productos.push({
              key: uniqueKey,
              id: producto.id,
              descripcion: producto.descripcion,
              precio_promedio: parseInt(producto.precio_promedio),
              cantidad: 0,
              precio_lista,
              iva: producto.ivas.iva,
              editable: false,
              dias_tratamiento: 0,
              stock: 0,
              cod_padre: producto.cod_padre,
            });
          }
        });
        setDataSource(productos);
        setLoaderTable(false);
      });
    }
  };

  const onSearch = (value: string) => {
    if (value.length > 0) {
      fetchProductos(value);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 100,
      render: (_, record) => {
        return (
          <>
            {record.editable ? (
              <Input
                maxLength={4}
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
    // Obtener el identificador único del producto actual
    const valor: any = e.target.value;
    const cantidad: number = valor ? parseInt(valor) : 0;
    if (cantidad > 0) {
      setBtnAdd(false);
      // Actualizar el valor de cantidad
      const newSelectRows = selectRows.map((producto: any) =>
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

      const updatedSelectRows = newSelectRows.map((producto: any) => {
        const precioPromedio = parseFloat(producto.precio_lista);
        const valor = isNaN(precioPromedio)
          ? "0"
          : precioPromedio * parseInt(producto.cantidad);
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
        const selectItem: any = dataSource
          .filter((item) => item.key === key)
          .map((item) => ({
            ...item,
            cantidad: cantidad.toString(),
          }));
        setSelectRows(selectRows.concat(selectItem));
      }
    } else {
      // Aqui quita el registro de acuerdo a la key, ya que no se esta ingresando cantidad y es como si lo estuviera descartando
      const newDataSelect = selectRows.filter((item) => item.key != key);
      setSelectRows(newDataSelect);
    }

    // Aqui actualiza si o si el arreglo principal
    const newDataFilter: any = dataSource.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad: cantidad.toString() };
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

  const rowClassName = (record: DataType) => {
    return record.precio_lista === 0 || record.precio_promedio === 0
      ? "row-red"
      : "";
  };

  const validarExistencias = () => {
    const duplicado = selectRows.some(
      (obj, index, array) =>
        array.findIndex((o) => o.cod_padre === obj.cod_padre) !== index
    );

    if (duplicado) {
      notificationApi.error({
        message:
          "No es posible agregar productos con el mismo principio activo",
      });
      return;
    }

    setLoaderTable(true);
    const data = {
      productos: selectRows.map((item) => item.id),
      bodega_id,
      lista_precio_id: convenio?.id_listapre,
    };
    validarExistenciasCodPadre(data)
      .then(({ data: { data } }) => {
        if (data.length > 0) {
          setOpenModalLotesDisponibles(true);
          setLotesDisponibles(data);
          notificationApi.error({
            message:
              "Existen lotes con disponibilidad de los productos seleccionados. Por favor verificar antes de generar el pendiente.",
          });
        } else {
          clearValues();
        }
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
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const clearValues = () => {
    onSetDataSource(selectRows);
    setOpen(false);
    setSelectRows([]);
    setDataSource([]);
  };

  return (
    <>
      {contextHolder}
      <ModalLotesDisponibles
        open={openModalLotesDisponibles}
        setOpen={(value: boolean, agregar?: string) => {
          setOpenModalLotesDisponibles(value);
          setLotesDisponibles([]);
          if (agregar == "si") {
            clearValues();
          }
        }}
        lotes={lotesDisponibles}
      />
      <Modal
        zIndex={100}
        open={open}
        footer={[
          <Button
            key={"btnAgregar"}
            type="primary"
            onClick={() => {
              validarExistencias();
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
        width={1100}
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
              rowClassName={rowClassName}
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
    </>
  );
};
