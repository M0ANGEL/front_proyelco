/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BodegasDist, LotesDisponible, ProductosDist } from "@/services/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ModalGeneracionPDF } from "../ModalGeneracionPDF";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { BaseType } from "antd/es/typography/Base";
import {
  generarTraslados,
  getDistribucionFP,
} from "@/services/distribucion/distComprasAPI";
import { TrasladosGenerados } from "./types";
import { CustomInputNumber } from "./styled";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { KEY_BODEGA } from "@/config/api";
import {
  CollapseProps,
  notification,
  Typography,
  Collapse,
  Button,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Space,
  Tag,
} from "antd";

const { Text } = Typography;

export const FormDistribucionCompra = () => {
  const [openModalTraslados, setOpenModalTraslados] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  const [trasladosGenerados, setTrasladosGenerados] = useState<
    TrasladosGenerados[]
  >([]);
  const [loader, setLoader] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const { fp_id } = useParams<{ fp_id: string }>();
  const navigate = useNavigate();
  const control = useForm<{
    productos: ProductosDist[];
    bodega_id: string;
  }>({
    defaultValues: {
      bodega_id: "",
      productos: [],
    },
  });
  const watchProductos = control.watch("productos");

  useEffect(() => {
    setLoader(true);
    getDistribucionFP({ fp_id: fp_id })
      .then(({ data: { data } }) => {
        if (data.length == 0) {
          notificationApi.open({
            type: "info",
            message: "No hay productos para distribuir.",
          });
          setBtnDisabled(true);
        } else {
          control.reset({
            productos: data,
          });
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
      .finally(() => setLoader(false));
  }, [fp_id]);

  useEffect(() => {
    setBtnDisabled(false);
    const data = control.getValues("productos");
    for (let indexProducto = 0; indexProducto < data.length; indexProducto++) {
      // Se validan las bodegas que no superen la cantidad maxima de distribucion
      // for (
      //   let indexBodega = 0;
      //   indexBodega < data[indexProducto].bodegas.length;
      //   indexBodega++
      // ) {
      //   const cant_distribucion =
      //     data[indexProducto].bodegas[indexBodega].cantidad_distribucion -
      //     data[indexProducto].bodegas[indexBodega].cantidad_trasladada;
      //   const cant_traslado = data[indexProducto].bodegas[
      //     indexBodega
      //   ].cantidades.reduce(
      //     (accumulator, currentValue) =>
      //       accumulator + currentValue.cantidad_traslado,
      //     0
      //   );
      //   if (cant_traslado > cant_distribucion) {
      //     setBtnDisabled(true);
      //     stop;
      //   }
      // }

      // Se validan las cantidades por lote que no superen el disponible
      for (
        let indexLote = 0;
        indexLote < data[indexProducto].lotes_disponibles.length;
        indexLote++
      ) {
        const cant_lote =
          data[indexProducto].lotes_disponibles[indexLote].cantidad;
        const cant_traslado = data[indexProducto].bodegas.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.cantidades[indexLote].cantidad_traslado,
          0
        );
        if (cant_traslado > cant_lote) {
          setBtnDisabled(true);
          stop;
        }
      }
    }
  }, [watchProductos]);

  const itemsCollapse = () => {
    const items: CollapseProps["items"] = control
      .getValues("productos")
      .map((producto_dist, indexProducto) => {
        return {
          key: `producto_dist_${indexProducto}`,
          label: `${producto_dist.cod_producto_distribucion} - ${producto_dist.desc_prod_distribucion}`,
          children: (
            <>
              <Table
                rowKey={(record) =>
                  `${record.producto_id}_${record.lote}_${record.fecha_vencimiento}`
                }
                bordered
                size="small"
                title={() => (
                  <Text strong>
                    {producto_dist.lotes_disponibles[0].producto_id} -{" "}
                    {producto_dist.lotes_disponibles[0].descripcion}
                  </Text>
                )}
                scroll={{
                  x: 360 + producto_dist.bodegas.length * 120,
                }}
                dataSource={producto_dist.lotes_disponibles}
                columns={columnsBodegas(producto_dist.bodegas, indexProducto)}
                pagination={{ hideOnSinglePage: true }}
              />
            </>
          ),
        };
      });
    return items;
  };

  const handleChangeCantidad = (
    value: number,
    indexProducto: number,
    indexBodega: number,
    indexLote: number
  ) => {
    const data: ProductosDist[] = control
      .getValues("productos")
      .map((producto, indexProd) => {
        const bodegas: BodegasDist[] = producto.bodegas.map(
          (bodega, indexBod) => {
            const lotes: LotesDisponible[] = bodega.cantidades.map(
              (lote, indexLot) => {
                if (
                  indexProd == indexProducto &&
                  indexBod == indexBodega &&
                  indexLot == indexLote
                ) {
                  return { ...lote, cantidad_traslado: value ? value : 0 };
                } else {
                  return lote;
                }
              }
            );
            const cantidad_traslado = lotes.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.cantidad_traslado,
              0
            );
            return {
              ...bodega,
              cantidades: lotes,
              cantidad_traslado,
            };
          }
        );
        return { ...producto, bodegas };
      });
    control.setValue("productos", data);
  };

  const handleKeyDown = (event: any, isBlocking: boolean) => {
    if (isBlocking && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  const columnsBodegas = (bodegas: BodegasDist[], indexProducto: number) => {
    const columns: ColumnsType<LotesDisponible> = [
      {
        key: "lote",
        dataIndex: "lote",
        title: "LOTE",
        align: "center",
        width: 120,
      },
      {
        key: "fecha_vencimiento",
        dataIndex: "fecha_vencimiento",
        title: "FECHA VENCIMIENTO",
        align: "center",
        width: 120,
      },
      {
        key: "cantidad",
        dataIndex: "cantidad",
        title: "CANTIDAD_DISPONIBLE",
        align: "center",
        width: 120,
        render(value, _record, indexLote) {
          const cantidad_traslado = bodegas.reduce(
            (accumulator, currentValue) =>
              accumulator +
              currentValue.cantidades[indexLote].cantidad_traslado,
            0
          );

          let input_type: BaseType = "success";
          if (cantidad_traslado == value) {
            input_type = "success";
          }
          if (cantidad_traslado > value) {
            input_type = "danger";
          }
          return (
            <Space direction="vertical">
              <Text style={{ fontSize: 12 }}>{value}</Text>
              {cantidad_traslado >= value ? (
                <Tag color="white">
                  <Text style={{ fontSize: 12 }} type={input_type}>
                    Cantidad disponible{" "}
                    {cantidad_traslado == value ? "tomada" : "excedida"}
                  </Text>
                </Tag>
              ) : null}
            </Space>
          );
        },
      },
      {
        key: "bodegas",
        title: "BODEGAS",
        children: bodegas.map((bodega, indexBodega) => {
          let input_type: BaseType = "warning";
          let cantidad_real =
            bodega.cantidad_distribucion -
            bodega.cantidad_trasladada -
            bodega.cantidad_traslado;
          let texto_cantidad = "Pendiente";
          if (cantidad_real < 0) {
            texto_cantidad = "Excedida por";
            cantidad_real = cantidad_real * -1;
          }
          if (
            bodega.cantidad_traslado ==
            bodega.cantidad_distribucion - bodega.cantidad_trasladada
          ) {
            input_type = "success";
          }
          if (
            bodega.cantidad_traslado >
            bodega.cantidad_distribucion - bodega.cantidad_trasladada
          ) {
            input_type = "danger";
          }
          return {
            key: `bodegaDist_${indexBodega}`,
            title: () => (
              <Space direction="vertical">
                <Text style={{ fontSize: 12, color: "#FFFFFF" }}>
                  {bodega.bod_nombre_destino}
                </Text>
                <Tag color="white">
                  <Text style={{ fontSize: 13 }} type={input_type}>
                    {`Cant. ${texto_cantidad}: ${cantidad_real}`}
                  </Text>
                </Tag>
              </Space>
            ),
            align: "center",
            width: 120,
            render(_, _record, indexLote) {
              return (
                <Controller
                  control={control.control}
                  name={`productos.${indexProducto}.bodegas.${indexBodega}.cantidades.${indexLote}.cantidad_traslado`}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad debe ser al menos cero",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    let isBlocking = false;
                    const data = control.getValues("productos");
                    const cant_lote =
                      data[indexProducto].lotes_disponibles[indexLote].cantidad;

                    const cant_traslado_total_lote = data[
                      indexProducto
                    ].bodegas.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        currentValue.cantidades[indexLote].cantidad_traslado,
                      0
                    );

                    const cant_max_bodega =
                      data[indexProducto].bodegas[indexBodega]
                        .cantidad_distribucion -
                      data[indexProducto].bodegas[indexBodega]
                        .cantidad_trasladada;

                    const cant_traslado_total =
                      data[indexProducto].bodegas[indexBodega]
                        .cantidad_traslado;

                    if (cant_traslado_total >= cant_max_bodega) {
                      isBlocking = false;
                    }

                    if (cant_traslado_total_lote >= cant_lote) {
                      isBlocking = true;
                    }

                    return (
                      <Space direction="vertical">
                        <StyledFormItem>
                          <CustomInputNumber
                            {...field}
                            size="small"
                            controls={false}
                            status={error && "error"}
                            style={{
                              width: "100%",
                            }}
                            onKeyDown={(event: any) =>
                              handleKeyDown(event, isBlocking)
                            }
                            onChange={(value: any) => {
                              handleChangeCantidad(
                                value,
                                indexProducto,
                                indexBodega,
                                indexLote
                              );
                            }}
                          />
                          <Text type="danger" style={{ fontSize: 11 }}>
                            {error?.message}
                          </Text>
                        </StyledFormItem>
                      </Space>
                    );
                  }}
                />
              );
            },
          };
        }),
      },
    ];
    return columns;
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    generarTraslados({
      ...data,
      bodega_id: parseInt(getSessionVariable(KEY_BODEGA)),
      fp_id,
    })
      .then(({ data }) => {
        if (data.length > 0) {
          setTrasladosGenerados(
            data.map((traslado) => ({
              key: traslado.data.trs_id,
              consecutivo: traslado.data.trs_id,
              estado_pdf: "wait",
              id: traslado.id,
            }))
          );
          setOpenModalTraslados(true);
          notificationApi.success({
            message: "Traslados generados correctamente",
          });
        } else {
          notificationApi.info({
            message:
              "No se ha generado ningún traslado, por favor validar cantidades",
          });
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
      .finally(() => setLoader(false));
  };

  return (
    <>
      {contextHolder}
      <ModalGeneracionPDF
        open={openModalTraslados}
        setOpen={(value: boolean) => {
          setOpenModalTraslados(value);
          navigate(`/documentos/traslados/trs`);
          control.reset();
          setTrasladosGenerados([]);
        }}
        traslados={trasladosGenerados}
      />
      <Spin spinning={loader}>
        <StyledCard title={"Distribucion de Compra"}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <Collapse
                  size="small"
                  items={itemsCollapse()}
                  defaultActiveKey={"producto_dist_0"}
                />
              </Col>
              <Col
                xs={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  <Link to={"../.."} relative="path">
                    <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                      Volver
                    </Button>
                  </Link>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    disabled={btnDisabled}
                  >
                    Generar traslados
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
