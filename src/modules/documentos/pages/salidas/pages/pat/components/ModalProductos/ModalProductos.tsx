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
  message,
} from "antd";
import { buscarProducto, getProductosxLP, getProductxLotes } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { ChangeEvent, useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import "./styles.css";
import { Tag } from "@/../node_modules/antd/es/index";
const { Search } = Input;

export const ModalProductos = ({ open, setOpen, onSetDataSource, listPrice, onUpdateTotal }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [valorTotal, setValorTotal] = useState(0);
  const { getSessionVariable } = useSessionStorage();
  const [totalAcumulado, setTotalAcumulado] = useState(0);
  const [btnAdd, setBtnAdd] = useState<boolean>(false);
  const [precioPromedioError, setPrecioPromedioError] = useState(''); // Estado para controlar el estilo de la celda



  useEffect(() => {
    let total = 0;
    let hasNaN = ''; // Variable para verificar si hay NaN en el precio_promedio
    selectRows.forEach((producto) => {
      console.log("aquì=>", producto)
      total += parseFloat(producto.valor);
      // Verificar si precio_promedio es NaN
      if (isNaN(producto.precio_promedio)) {
        hasNaN = 'celda-roja';
      }
    });
    setValorTotal(total);
    // se establece el estado precioPromedioError en true si precio_promedio es NaN
    setPrecioPromedioError(hasNaN);
    
  }, [selectRows]);

  const fetchProductos = (value: string, bodega_id: string) => {
    setLoaderTable(true);
    console.log(listPrice)
    getProductxLotes(value, bodega_id).then(({ data: { data } }) => {
      console.log("data_lot", data)
      const productos = data.map((producto) => {
        console.log("modal pat", producto)
        const uniqueKey = `${producto.id}-${producto.lote}-${producto.fecha_vencimiento}`;
        return {
          key: uniqueKey,
          id: producto.producto_id,
          descripcion: producto.descripcion,
          precio_promedio: parseInt(producto.precio_promedio),
          stock: producto.stock,
          cantidad: 0,
          lote: producto.lote,
          fvence: producto.fecha_vencimiento,
          valor: (0).toString(),
          precio_lista: producto.precio_promedio,
          iva: producto.iva,
          editable: false,
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
    // Verificar si precio_promedio es NaN y deshabilitar si es NaN
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
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text: string, record: DataType) => {
        const rowClass = rowClassName(record);

        if (rowClass === 'row-red') {
          return (
            <div>
              
              {text} {/* Mostrar el texto original después del Tag */}
              <Tag color="red">
                Producto sin precio promedio
              </Tag>
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
                defaultValue={
                  record.cantidad == 0
                    ? ""
                    : record.cantidad
                }
                size="small"
                onBlur={() => handleChangeEdit(record.key)}
                onChange={(e: any) => handleChangeAmount(e, record.key, record)}
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

  const handleChangeAmount = (e: ChangeEvent<InputProps>, key: React.Key) => {
    // Obtener el identificador único del producto actual
    const currentProductId = key;
    const valor: any = e.target.value;

    console.log("idcurr", currentProductId)

    if (selectRows.length > 0) {
      const producto = selectRows.find((producto) => producto.key === currentProductId);
      console.log("producto", producto)
      //console.log("key", producto.key)
      
      if (producto && (isNaN(producto.precio_promedio) || producto.precio_promedio === null || producto.precio_promedio === undefined || parseFloat(producto.precio_promedio) === 0)) {
        message.error("No se puede agregar un producto con precio promedio en cero.", 3);
  
        // Establecer la cantidad en cero
        const newSelectRows = selectRows.map((producto) =>
          producto.key === key ? { ...producto, cantidad: "0" } : producto
        );
        setSelectRows(newSelectRows);
  
        // Quitar el foco del campo
        e.target.blur();
  
        setBtnAdd(true);
        return;
      }
    }
    
    // Verificar si el valor es numérico y no negativo
    if (!isNaN(valor) && parseFloat(valor) >= 0) {
      const cantidad: number = valor ? parseInt(valor) : 0;
      const producto = selectRows.find((producto) => producto.key === currentProductId);
      if (cantidad > 0) {
        if (producto && cantidad > parseInt(producto.stock)) {
          const message_err= "La cantidad no debe superar el valor en stock.";
          message.open({
            type: "error",
            content: message_err,
          });
          setBtnAdd(true);
          // Establecer el valor de cantidad igual al stock
          /*const newSelectRows = selectRows.map((producto) =>
            producto.key === key
              ? { ...producto, cantidad: producto.stock }
              : producto
          );
          setSelectRows(newSelectRows);*/
          return;
        }

        setBtnAdd(false)
        // Actualizar el valor de cantidad
        const newSelectRows = selectRows.map((producto) =>
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

        // Calcular el valor solo si la cantidad es un número válido
        if (!isNaN(cantidad) && producto) {
          const precioPromedio = parseFloat(producto.precio_lista);
          const valor = isNaN(precioPromedio) ? 0 : cantidad * precioPromedio;
          setValorTotal(valor);
          //newSelectRows.find((producto) => producto.key === key).valor = valor;

          // Calcular el total acumulado sumando los valores de todos los productos seleccionados
          const total = selectRows.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
          setTotalAcumulado(total);

          // Llamar a la función onUpdateTotal para actualizar el total en el componente padre
          onUpdateTotal(total);
        }

        const updatedSelectRows = newSelectRows.map((producto) => {
          const precioPromedio = parseFloat(producto.precio_lista);
          const valor = isNaN(precioPromedio)
            ? "0"
            : (precioPromedio * parseInt(producto.cantidad));
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
              cantidad: cantidad.toString(),
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
          return { ...item, cantidad: cantidad.toString() };
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
    console.log("record? => ", record)
    return isNaN(record.precio_promedio) ? 'row-red' : '';
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
  );
};
