/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Spin,
  StepProps,
  Switch,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DataTypeLote, DataTypeProductosPend, Props } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { getProductosLotes } from "@/services/documentos/pendApi";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_BODEGA } from "@/config/api";
import { CustomSteps, SearchBar } from "./styled";
import dayjs from "dayjs";
// import { AiOutlineConsoleSql } from "react-icons/ai";

const { Text } = Typography;

export const ModalPagoProductos = ({
  open,
  setOpen,
  productos,
  pendiente_id,
  convenio,
  handleSetDetalle,
  detalle,
}: // dispensacionesPagadas,
Props) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [producto, setProducto] = useState<DataTypeProductosPend>();
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [productosPend, setProductosPend] = useState<DataTypeProductosPend[]>(
    []
  );
  const [lotes, setLotes] = useState<DataTypeLote[]>([]);
  const [lotesOriginal, setLotesOriginal] = useState<DataTypeLote[]>([]);
  const [selectedLotes, setSelectedLotes] = useState<DataTypeLote[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const { getSessionVariable } = useSessionStorage();

  useEffect(() => {
    const data: DataTypeProductosPend[] = [];
    productos.forEach((producto) => {
      if (
        !detalle.some(
          (item) =>
            item.id == producto.id || item.cod_padre == producto.cod_padre
        )
      ) {
        const cantidad_pagada = producto.cantidad_pagada;
        // if (dispensacionesPagadas) {
        //   dispensacionesPagadas.forEach((dispensacion) => {
        //     dispensacion.detalle.forEach((item) => {
        //       if (
        //         item.producto_id == producto.id ||
        //         item.producto.cod_padre == producto.cod_padre
        //       ) {
        //         cantidad_pagada += parseInt(item.cantidad_entregada);
        //       }
        //     });
        //   });
        // }
        const cantidad_saldo = producto.cantidad - cantidad_pagada;
        data.push({ ...producto, cantidad_pagada, cantidad_saldo });
      }
    });
    setProductosPend(data);
  }, [productos, detalle]);

  useEffect(() => {
    if (producto) {
      let total = 0;
      selectedLotes.forEach((item) => (total += item.cantidad));
      if (total > producto.cantidad_saldo) {
        setInputDisabled(true);
        notificationApi.warning({
          message: `Se ha sobrepasado la cantidad máxima para pagar el producto`,
        });
        return;
      } else {
        setInputDisabled(false);
      }
    }
  }, [selectedLotes, producto]);

  const items: StepProps[] = [
    {
      title: "Productos pendientes",
      description: "Selecciona un producto para pagar el pendiente",
    },
    {
      title: "Seleccionar lote",
      description: "Ingresa cantidades ",
      disabled: !producto,
    },
  ];

  const handleSearchLotes = (
    producto_id: string,
    pendiente_id: string | undefined,
    productoPend: DataTypeProductosPend
  ) => {
    setLoader(true);
    const dataSearch = {
      producto_id,
      bodega_id: getSessionVariable(KEY_BODEGA),
      pendiente_id,
      convenio_id: convenio?.id,
    };
    getProductosLotes(dataSearch)
      .then(({ data: { data } }) => {
        const dataLotes: DataTypeLote[] = data.map((item) => {
          return {
            key: item.id,
            cantidad: 0,
            desc_producto: item.productos.descripcion,
            cod_padre: item.productos.cod_padre,
            fecha_vencimiento: item.fecha_vencimiento,
            lote: item.lote,
            id: item.producto_id.toString(),
            stock: parseInt(item.stock),
            precio_lista: item.precio_lista
              ? parseFloat(item.precio_lista.precio)
              : 0,
            precio_promedio: parseFloat(item.productos.precio_promedio),
            iva: parseFloat(item.productos.ivas.iva),
            fecha_invima: item.productos.fecha_vig_invima,
            estado_invima: item.productos.estado_invima,
            detalle_id: productoPend.key.toString(),
            dias_tratamiento: 0,
          };
        });
        setLotes(dataLotes);
        setLotesOriginal(dataLotes);
        setProducto(productoPend);
        setCurrentStep(1);
      })
      .finally(() => setLoader(false));
  };

  const handleChangeStep = (value: number) => {
    if (value == 0) {
      setProducto(undefined);
      setLotes([]);
      setSelectedLotes([]);
    }
    setCurrentStep(value);
  };

  const clearValues = () => {
    setOpen(false);
    setCurrentStep(0);
    setProducto(undefined);
    setLotes([]);
    setSelectFlag(false);
    setSelectedLotes([]);
  };

  const handleSearchBarProductos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = productos?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setProductosPend(filterTable);
  };

  const handleSearchBarLotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = lotesOriginal?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setLotes(filterTable);
  };

  const handleChangeAmount = (cantidad: number, loteSelected: DataTypeLote) => {
    if (isNaN(cantidad)) {
      cantidad = 0;
    }
    if (cantidad > 0) {
      if (selectedLotes.find((item) => item.key == loteSelected.key)) {
        setSelectedLotes(
          selectedLotes.map((item) => {
            if (item.key == loteSelected.key) {
              return { ...item, cantidad };
            } else {
              return item;
            }
          })
        );
      } else {
        setSelectedLotes([...selectedLotes, { ...loteSelected, cantidad }]);
      }
    } else {
      setSelectedLotes(
        selectedLotes.filter((item) => item.key != loteSelected.key)
      );
    }
  };

  const productosColumns: ColumnsType<DataTypeProductosPend> = [
    {
      title: "Código",
      key: "cod_producto",
      dataIndex: "id",
      align: "center",
      width: 90,
    },
    {
      title: "Descripción",
      key: "descripcion",
      dataIndex: "descripcion",
    },
    {
      title: "Días Tratamiento",
      key: "dias_tratamiento",
      dataIndex: "dias_tratamiento",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad Pagada",
      key: "cantidad_pagada",
      dataIndex: "cantidad_pagada",
      align: "center",
      width: 90,
    },
    {
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      align: "center",
      width: 150,
      render: (_, record) => {
        return (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleSearchLotes(record.id, pendiente_id, record);
              }}
              disabled={record.cantidad_saldo == 0}
            >
              Seleccionar
            </Button>
          </>
        );
      },
    },
  ];

  const lotesColumns: ColumnsType<DataTypeLote> = [
    {
      title: "Código",
      key: "id",
      dataIndex: "id",
      align: "center",
      width: 90,
    },
    {
      title: "Descripción",
      key: "desc_producto",
      dataIndex: "desc_producto",
      render(value, { precio_lista, fecha_invima }) {
        let diffInvima = 0;
        if (dayjs(fecha_invima, "DD/MM/YYYY", true).isValid()) {
          diffInvima = dayjs(fecha_invima, "DD/MM/YYYY").diff(dayjs(), "days");
        } else if (dayjs(fecha_invima, "D/MM/YYYY", true).isValid()) {
          diffInvima = dayjs(fecha_invima, "D/MM/YYYY").diff(dayjs(), "days");
        }
        return (
          <Space direction="vertical" size={0}>
            <Text>{value}</Text>
            {precio_lista == 0 || diffInvima < 0 ? (
              <Space>
                {precio_lista == 0 ? (
                  <Tag color="red">Producto sin precio de venta</Tag>
                ) : null}
                {diffInvima < 0 ? (
                  <Tag color="red">Registro Invima vencido</Tag>
                ) : null}
              </Space>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      align: "center",
      width: 120,
    },
    {
      title: "Fecha Vencimiento",
      key: "fecha_vencimiento",
      dataIndex: "fecha_vencimiento",
      align: "center",
      width: 120,
    },
    {
      title: "Stock",
      key: "stock",
      dataIndex: "stock",
      align: "center",
      width: 90,
    },
    {
      title: "Cantidad",
      key: "cantidad",
      align: "center",
      width: 120,
      render: (_, record) => {
        return (
          <>
            <InputNumber
              controls={false}
              max={record.stock}
              defaultValue={record.cantidad}
              onChange={(value: any) =>
                handleChangeAmount(parseInt(value), record)
              }
              disabled={record.precio_lista == 0}
            />
          </>
        );
      },
    },
  ];

  const rowClassName = (record: DataTypeLote) => {
    return record.precio_lista === 0 ? "row-red" : "";
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={"Pago de pendiente"}
        open={open}
        footer={[
          <Button
            key={"btnAgregar"}
            type="primary"
            onClick={() => {
              handleSetDetalle(
                selectedLotes.map((item) => ({
                  ...item,
                  dias_tratamiento: producto ? producto.dias_tratamiento : 0,
                }))
              );
              clearValues();
            }}
            disabled={inputDisabled}
          >
            Agregar
          </Button>,
          <Button
            key={"btnCancelar"}
            type="primary"
            danger
            onClick={() => clearValues()}
          >
            Cancelar
          </Button>,
        ]}
        destroyOnClose={true}
        onCancel={() => {
          clearValues();
        }}
        width={1200}
        style={{ top: 10 }}
      >
        <Row>
          <Col xs={24} md={{ span: 20, offset: 2 }}>
            <CustomSteps
              current={currentStep}
              items={items}
              onChange={handleChangeStep}
            />
          </Col>
        </Row>
        <Spin
          spinning={loader}
          indicator={
            <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
          }
        >
          <div style={{ marginTop: 5 }}>
            {currentStep == 0 ? (
              <>
                <SearchBar>
                  <Input
                    placeholder="Buscar"
                    onChange={handleSearchBarProductos}
                  />
                </SearchBar>
                <Table
                  dataSource={productosPend}
                  columns={productosColumns}
                  size="small"
                  scroll={{ y: 450 }}
                  pagination={{
                    simple: false,
                    pageSize: 10,
                    hideOnSinglePage: true,
                  }}
                />
              </>
            ) : currentStep == 1 ? (
              <>
                <SearchBar>
                  <Input placeholder="Buscar" onChange={handleSearchBarLotes} />
                </SearchBar>
                <div
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Form layout="inline">
                    <Form.Item
                      label="Ver productos con cantidades:"
                      style={{ marginBottom: 0 }}
                    >
                      <Switch
                        size="small"
                        onChange={() =>
                          setSelectFlag(selectFlag ? false : true)
                        }
                      />
                    </Form.Item>
                    <Form.Item>
                      <Text strong style={{ fontSize: 12 }}>
                        La cantidad máxima que puedes pagar es de{" "}
                        <Tag color="success" style={{ fontSize: 14 }}>
                          {producto?.cantidad_saldo}
                        </Tag>
                      </Text>
                    </Form.Item>
                    <Form.Item>
                      <Text strong style={{ fontSize: 12 }}>
                        Los días de tratamiento son de{" "}
                        <Tag color="cyan" style={{ fontSize: 14 }}>
                          {producto?.dias_tratamiento}
                        </Tag>
                      </Text>
                    </Form.Item>
                  </Form>
                </div>
                <Table
                  rowClassName={rowClassName}
                  dataSource={selectFlag ? selectedLotes : lotes}
                  columns={lotesColumns}
                  size="small"
                  scroll={{ y: 450 }}
                  pagination={{
                    simple: false,
                    pageSize: 10,
                    hideOnSinglePage: true,
                  }}
                />
              </>
            ) : null}
          </div>
        </Spin>
      </Modal>
    </>
  );
};
