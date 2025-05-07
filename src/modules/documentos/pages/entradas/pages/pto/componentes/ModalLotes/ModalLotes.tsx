/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import {
  DataType,
  DataTypeChildren,
  LoteForm,
  ProductoInfo,
  Props,
} from "./types";
import { useState, useEffect, ChangeEvent } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const minMonthsExpiration = 6;

export const ModalLotes = ({
  openModalLote,
  setOpenModalLote,
  producto_id,
  detalle,
  setDetalle,
}: Props) => {
  const [loteForm] = Form.useForm<{ lotes: LoteForm[] }>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [productoId, setProductoId] = useState<React.Key | undefined>("");
  const [flagLote, setFlagLote] = useState<boolean>(false);
  const [productoInfo, setProductoInfo] = useState<ProductoInfo>({
    descripcion: "",
    codigo: "",
    cant_ingresada: 0,
  });
  const [cantIngDetalle, setCantIngDetalle] = useState<number>(0);
  const lotes = Form.useWatch("lotes", loteForm);

  useEffect(() => {
    setDataSource(detalle);
    setProductoId(producto_id);
    const producto = detalle.find((item) => item.key === producto_id);
    if (producto) {
      setProductoInfo({
        codigo: producto.key.toString(),
        descripcion: producto.descripcion,
        cant_ingresada: producto.total_ingreso,
      });
      setCantIngDetalle(producto.total_ingreso);
    }
  }, [detalle, dataSource, producto_id]);

  useEffect(() => {
    if (lotes) {
      let total_cant_lotes = 0;
      lotes.forEach((lote) => {
        if (lote?.cantidad) {
          total_cant_lotes += lote.cantidad;
        }
      });
      const cant_ingresada = cantIngDetalle + total_cant_lotes;
      setProductoInfo({ ...productoInfo, cant_ingresada });
    }
  }, [lotes]);

  const addLote = (
    values: {
      lotes: LoteForm[];
    },
    producto_id: React.Key = ""
  ) => {
    let flagDuplicado = false;
    let cantIngresoLotes = 0;
    const lotes: DataTypeChildren[] = values.lotes.map((item) => {
      const f_vencimiento = dayjs(item.fecha_vencimiento);
      const lote_key = `${producto_id}_${item.lote}_${f_vencimiento.format(
        "DD-MM-YYYY"
      )}`;

      // Validamos que la combinacion de producto_id + lota + fecha vencimiento no exista en el arreglo para que no exista duplpicidad de información
      const valid_lote = dataSource
        .find((item) => item.key == producto_id)
        ?.lotes.some((lote) => lote.key === lote_key);
      if (valid_lote) {
        flagDuplicado = true;
        setFlagLote(flagDuplicado);
        notificationApi.open({
          type: "error",
          message: `El lote ${
            item.lote
          } con fecha de vencimiento ${f_vencimiento.format(
            "DD-MM-YYYY"
          )} ya existe para este producto`,
        });
      }
      cantIngresoLotes += item.cantidad;
      return {
        key: lote_key,
        lote: item.lote,
        f_vencimiento: f_vencimiento.format("DD-MM-YYYY"),
        cantidad: item.cantidad,
        itemFromModal: true,
      };
    });

    const newData = dataSource.map((producto) => {
      if (producto.key == producto_id) {
        const total_ingreso = producto.total_ingreso + cantIngresoLotes;
        const precio_subtotal = total_ingreso * producto.precio;
        const precio_iva = precio_subtotal * (producto.iva / 100);
        const precio_total = precio_subtotal + precio_iva;
        return {
          ...producto,
          total_ingreso,
          precio_subtotal,
          precio_iva,
          precio_total,
          lotes: producto.lotes.concat(lotes),
        };
      } else {
        return producto;
      }
    });

    if (!flagDuplicado) {
      setDataSource(newData);
      setDetalle(newData);
      setOpenModalLote(false);
      loteForm.resetFields();
    }
  };

  const validateInput = (event: ChangeEvent<HTMLInputElement>, key: number) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^A-Za-z0-9-]/g, "");
    loteForm.setFieldValue(["lotes", key, "lote"], filteredValue);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={openModalLote}
        width={700}
        title={
          <Space
            direction="vertical"
            style={{ marginBottom: 20, width: "100%" }}
            align="center"
            size={0}
          >
            <Text style={{ fontSize: 18 }} strong>
              Añadir Lotes
            </Text>
            <Text type="secondary">Cód.: {productoInfo?.codigo}</Text>
            <Text type="secondary">{productoInfo?.descripcion}</Text>
            <Space>
              <Text>
                Cant. a ingresar:{" "}
                <Tag color={"default"}>{productoInfo?.cant_ingresada}</Tag>
              </Text>
            </Space>
          </Space>
        }
        footer={[]}
        destroyOnClose
        maskClosable={false}
        onCancel={() => {
          setOpenModalLote(false);
          loteForm.resetFields();
        }}
      >
        <Form
          form={loteForm}
          onFinish={(values: any) => addLote(values, productoId)}
          style={{ minWidth: 600 }}
        >
          <Form.List
            name={"lotes"}
            rules={[
              {
                validator: async (_, name) => {
                  if (!name || name.length < 1) {
                    return Promise.reject(
                      new Error("Debes añadir al menos un lote")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={12}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "lote"]}
                        rules={[
                          { required: true, message: "Lote es requerido" },
                        ]}
                        labelCol={{ span: 24 }}
                      >
                        <Input
                          placeholder="Lote"
                          maxLength={50}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            validateInput(event, key);
                            setFlagLote(false);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "fecha_vencimiento"]}
                        rules={[
                          {
                            required: true,
                            message: "Fecha de Vencimiento es requerida",
                          },
                          {
                            warningOnly: true,
                            validator: async (_, fecha_vencimiento) => {
                              if (
                                fecha_vencimiento &&
                                fecha_vencimiento.diff(dayjs(), "month") <=
                                  minMonthsExpiration
                              ) {
                                return Promise.reject(
                                  new Error(
                                    `Fecha de vencimiento inferior a ${minMonthsExpiration} meses`
                                  )
                                );
                              }
                            },
                          },
                        ]}
                      >
                        <DatePicker
                          format={"DD-MM-YYYY"}
                          placeholder="Vencimiento"
                          style={{ width: "100%" }}
                          onChange={() => {
                            setFlagLote(false);
                          }}
                          disabledDate={(current) =>
                            current < dayjs().endOf("day").subtract(1, "day")
                          }
                          inputReadOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        labelCol={{ span: 8 }}
                        name={[name, "cantidad"]}
                        rules={[
                          { required: true, message: "Cantidad es requerida" },
                          {
                            validator: async (_, cantidad) => {
                              if (cantidad < 1) {
                                return Promise.reject(
                                  new Error(`Debe ser mayor o igual a 1`)
                                );
                              }
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Cantidad"
                          controls={false}
                          onChange={() => {
                            setFlagLote(false);
                          }}
                          style={{ width: "100%", textAlign: "center" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Space
                        align="baseline"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 30,
                        }}
                      >
                        <DeleteOutlined
                          style={{ fontSize: 15, color: "#FF0000" }}
                          onClick={() => {
                            remove(name);
                            setFlagLote(false);
                          }}
                        />
                      </Space>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                      setFlagLote(false);
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Añadir Lote
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" block htmlType="submit" disabled={flagLote}>
              Agregar al detalle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
