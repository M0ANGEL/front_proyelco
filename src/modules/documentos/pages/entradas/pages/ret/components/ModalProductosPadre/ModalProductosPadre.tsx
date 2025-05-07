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
import { getProductosxPadreOtros } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { ChangeEvent, useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { StyledText } from "./styled";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export const ModalProductosPadre = ({ openModalPro, setOpenModalPro, onSetDataSource, idProducto, handleSelectPadre, variableCompartida }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [totalAcumulado, setTotalAcumulado] = useState(0);
  const [msgFull, setMsgFull] = useState<boolean>(false);
  const [selectedFvence, setSelectedFvence] = useState(null);
  const [loteValue, setLoteValue] = useState("");
  const [btnAdd, setBtnAdd] = useState<boolean>(false);

  useEffect(() => {
    setLoaderTable(true);

    getProductosxPadreOtros(`${idProducto}`).then(({ data: { data } }) => {
      const fechaFormat = selectedFvence ? dayjs(selectedFvence).format('YYYY-MM-DD') : null;
      const productos = data.map((producto: any) => {
        const uniqueKey = `${producto.id_padre}_${loteValue}_${fechaFormat}`;
        return {
          key: uniqueKey,
          id: producto.id_padre,
          descripcion: producto.desc_padre,
          cantidad: 0,
          lote: loteValue || "LOT1",
          fvence: fechaFormat || "2023-12-31",
          editable: false,
          prodRetorno: idProducto,
        };
      })

      setDataSource(productos);
      setLoaderTable(false);
    });
  }, [idProducto]);

  useEffect(() => {
    let total = 0;
    selectRows.forEach((producto) => {
      total += parseFloat(producto.valor);
    });
    setValorTotal(total);
  }, [selectRows]);

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
      render: (_, record) => {
        return (
          <>
            <Input
              autoFocus
              allowClear
              defaultValue={
                record.cantidad == 0
                  ? ""
                  : record.cantidad
              }
              size="small"
              onBlur={() => handleChangeEditLote(record.key)}
              onChange={(e: any) => handleChangeAmountLote(e.target.value, record.key)}
            />

          </>
        );
      },
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        return (
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            placeholder="Vencimiento"
            onChange={(date) => {
              //setFlagLote(false);
              setSelectedFvence(date);
              handleChangeDate(date, record.key);
            }}
            disabledDate={(current) =>
              current < dayjs().endOf("day").subtract(1, "day")
            }
          />
        );
      },
    },
  ];

  const handleChangeAmount = (
    e: ChangeEvent<InputProps>,
    key: React.Key
  ) => {
    // Obtener el identificador único del producto actual
    const currentProductId = key;
    const valor: any = e.target.value;
    setMsgFull(false);

    // Verificar si el valor es numérico y no negativo
    if (!isNaN(valor) && parseFloat(valor) >= 0) {
      const cantidad: number = valor ? parseInt(valor) : 0;
      const producto = selectRows.find((producto) => producto.key === currentProductId);
      // Calcular la suma actual de las cantidades en selectRows
      const sumaActual = selectRows.reduce((acc, curr) => acc + parseInt(curr.cantidad), 0);

      if (cantidad > 0) {
        // Verificar si la suma actual más la nueva cantidad supera variableCompartida
        // if (sumaActual + cantidad > variableCompartida) {
        if (cantidad > variableCompartida) {

          const message_err = "La suma de las cantidades no debe superar la cantidad prestada.";
          message.open({
            type: "error",
            content: message_err,
          });
          setBtnAdd(true);
          setMsgFull(false);

          return;
        }else if(cantidad == variableCompartida){
          setMsgFull(true);
        }
      //  setMsgFull(false);

        setBtnAdd(false);
        // Concatenar "idProducto" al objeto antes de actualizar selectRows
        const productoConId = { ...producto, idProducto };

        // Actualizar el valor de cantidad
        const newSelectRows = selectRows.map((producto) =>
          producto.key === key
            ? {
              productoConId, // Aquí se agrega el idProducto
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
          //onUpdateTotal(total);
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
      setMsgFull(false);

    }
  };

  const handleChangeDate = (date: any, key: React.Key) => {
    // Supongamos que tienes un estado lineas en el componente padre
    // y cada línea es un objeto que tiene una propiedad "key" para identificarla
    const fechaFormat = date ? dayjs(date).format('YYYY-MM-DD') : null;

    // Crea una copia del arreglo selectRows para no mutar el estado directamente
   // const nuevasSelectRows = [...selectRows];
    const currentProductId = key;

    // Ahora, necesitas encontrar las líneas que se agregaron desde el modal
    // y actualizar la propiedad "date" en cada una de ellas

    const newSelectRows = selectRows.map((producto) =>
      producto.key === currentProductId ?
        { ...producto, fvence: fechaFormat || "2023-31-12", } : producto
    );

    setSelectRows(newSelectRows);
  };

  const handleChangeEdit = (key: React.Key) => {
    const newData = selectFlag ? [...selectRows] : [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      selectFlag ? setSelectRows(newData) : setDataSource(newData);
    }
  };

  const handleChangeAmountLote = (lote: string, key: React.Key) => {
    // Supongamos que tienes un estado lineas en el componente padre
    // y cada línea es un objeto que tiene una propiedad "key" para identificarla

    // Crea una copia del arreglo selectRows para no mutar el estado directamente
   // const nuevasSelectRows = [...selectRows];
    const currentProductId = key;

    // Ahora, necesitas encontrar las líneas que se agregaron desde el modal
    // y actualizar la propiedad "lote" en cada una de ellas

    const newSelectRows = selectRows.map((producto) =>
      producto.key === currentProductId ?
        { ...producto, lote: lote || "Sin lote", } : producto
    );

    setSelectRows(newSelectRows);
  };

  const handleChangeEditLote = (key: React.Key) => {
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
      open={openModalPro}
      footer={[
        <Button
          key={"btnAgregar"}
          type="primary"
          onClick={() => {
            onSetDataSource(selectRows);
            setOpenModalPro(false);
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
            setOpenModalPro(false);
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
          {/* <Search
            enterButton
            type="primary"
            onSearch={onSearch}
            placeholder="Buscar Producto"
          /> */}
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
          <StyledText>Cantidad prestada: <span><b>{variableCompartida}</b></span></StyledText>
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
            footer={() => (msgFull ? (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <span style={{ color: "green", fontWeight: "bold" }}>
                  El retorno de préstamo está completo.
                </span>
              </div>
            ) : null)}
          />
        </Col>
      </Row>
    </Modal>
  );
};
