/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";
import { getProductoPadreByCodigo } from "@/services/maestras/productosPadreAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getKardexConsolidado } from "@/services/kardex/kardexAPI";
import { getProducto } from "@/services/maestras/productosAPI";
import { fetchUserBodegas } from "@/services/auth/authAPI";
import { Producto, ProductoPadre } from "@/services/types";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { KEY_BODEGA, KEY_ROL } from "@/config/api";
import { DataType, FormTypes } from "./types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Divider,
  Button,
  Select,
  Radio,
  Input,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;

export const ListKardexConsolidado = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderProducto, setLoaderProducto] = useState<boolean>(false);
  const [productoPadre, setProductoPadre] = useState<ProductoPadre>();
  const [withBodegas, setWithBodegas] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [producto, setProducto] = useState<Producto>();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const [form] = Form.useForm();
  const control = useForm<FormTypes>({
    defaultValues: {
      bodega_id: getSessionVariable(KEY_BODEGA),
      bodegas: [],
      fechas: undefined,
      producto_id: "",
      desc_producto: "",
      cod_padre: "",
      desc_cod_padre: "",
      tipo_busqueda: "producto",
    },
  });

  const watchCodigoProducto = control.watch("producto_id");
  const watchCodigoPadre = control.watch("cod_padre");
  const watchTipoBusqueda = control.watch("tipo_busqueda");

  useEffect(() => {
    if (watchCodigoProducto != producto?.id.toString()) {
      control.setValue("desc_producto", "");
      setProducto(undefined);
    }
  }, [watchCodigoProducto, producto]);

  useEffect(() => {
    if (watchCodigoPadre != productoPadre?.cod_padre.toString()) {
      control.setValue("desc_cod_padre", "");
      setProductoPadre(undefined);
    }
  }, [watchCodigoPadre, productoPadre]);

  useEffect(() => {
    fetchUserBodegas().then(({ data: { data } }) => {
      setSelectBodegas(
        data.bodega.map((bodega) => {
          return {
            value: bodega.id_bodega,
            label: `${bodega.bodega.prefijo} - ${bodega.bodega.bod_nombre}`,
          };
        })
      );
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (user_rol) {
      if (["administrador", "cotizaciones"].includes(user_rol)) {
        // control.setValue("bodega_id", "");
        // control.setValue("bodegas", []);
        setWithBodegas(true);
      } else {
        setWithBodegas(false);
      }
    }
  }, [user_rol]);

  useEffect(() => {
    if (watchTipoBusqueda) {
      switch (watchTipoBusqueda) {
        case "producto":
          control.setValue("cod_padre", "");
          control.setValue("desc_cod_padre", "");
          break;
        case "cod_padre":
          control.setValue("producto_id", "");
          control.setValue("desc_producto", "");

          break;
      }
    }
  }, [watchTipoBusqueda]);

  const handleSearchProducto = (codigo: string) => {
    setLoaderProducto(true);

    switch (watchTipoBusqueda) {
      case "producto":
        getProducto(codigo)
          .then(({ data: { data } }) => {
            if (data) {
              setProducto(data);
              control.setValue("desc_producto", data.descripcion);
              notificationApi.open({
                type: "success",
                message: "Producto encontrado",
              });
            } else {
              control.setValue("desc_producto", "");
              setProducto(undefined);
              notificationApi.open({
                type: "error",
                message: "Código de producto no encontrado",
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
          .finally(() => setLoaderProducto(false));
        break;
      case "cod_padre":
        getProductoPadreByCodigo(codigo)
          .then(({ data: { data } }) => {
            if (data) {
              setProductoPadre(data);
              control.setValue("desc_cod_padre", data.descripcion);
              notificationApi.open({
                type: "success",
                message: "Código Padre encontrado",
              });
            } else {
              control.setValue("desc_cod_padre", "");
              setProducto(undefined);
              notificationApi.open({
                type: "error",
                message: "Código Padre no encontrado",
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
          .finally(() => setLoaderProducto(false));
        break;
    }
  };

  const handleSelectAll = (origin: string) => {
    switch (origin) {
      case "bodegas":
        if (selectBodegas) {
          if (
            selectBodegas.filter((item) => item.disabled != true).length ===
            control.getValues("bodegas").length
          ) {
            control.setValue("bodegas", []);
          } else {
            const opcionesSeleccionadas: any[] = [];
            selectBodegas.forEach((item) => {
              if (typeof item.value !== "string" && item.disabled != true) {
                opcionesSeleccionadas.push(item.value);
              }
            });
            control.setValue("bodegas", opcionesSeleccionadas);
          }
        }
        break;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      width: 100,
      align: "center",
    },
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      width: 100,
      align: "center",
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 100,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 100,
      hidden: !withBodegas,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 100,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "f_vence",
      key: "f_vence",
      align: "center",
      width: 100,
    },
    {
      title: "Cantidad Movimiento",
      dataIndex: "cantidad_movimiento",
      key: "cantidad_movimiento",
      align: "center",
      width: 100,
      render(value, { tipo_movimiento }) {
        switch (tipo_movimiento) {
          case "entrada":
            return <>{value}</>;
            break;
          case "salida":
            return <>-{value}</>;
            break;
        }
      },
    },
    {
      title: "Saldo",
      dataIndex: "cantidad_saldo",
      key: "cantidad_saldo",
      align: "center",
      width: 100,
    },
    {
      title: "Tipo Movimiento",
      dataIndex: "tipo_movimiento",
      key: "tipo_movimiento",
      align: "center",
      width: 100,
      render(value) {
        switch (value) {
          case "entrada":
            return <>Entrada</>;
            break;
          case "salida":
            return <>Salida</>;
            break;
        }
      },
    },
  ];
  const onFinish = (data: any) => {
    setLoader(true);
    data.fechas = [
      dayjs(data.fechas[0]).format("YYYY-MM-DD"),
      dayjs(data.fechas[1]).format("YYYY-MM-DD"),
    ];
    data.f_vence = dayjs(data.f_vence).format("YYYY-MM-DD");
    getKardexConsolidado(data)
      .then(({ data: { data, saldoAnterior } }) => {
        const items: DataType[] = [];
        let saldo = 0;
        data.forEach((item, index) => {
          const cantidad_movimiento = parseInt(item.cantidad);
          if (index == 0) {
            saldo = saldoAnterior;
          }
          switch (item.tipo_movimiento) {
            case "entrada":
              saldo += cantidad_movimiento;

              break;
            case "salida":
              saldo -= cantidad_movimiento;

              break;
          }
          items.push({
            fecha: dayjs(item.fecha).format("YYYY-MM-DD"),
            hora: dayjs(item.fecha).format("HH:mm"),
            consecutivo: item.consecutivo,
            cantidad_movimiento,
            cantidad_saldo: saldo,
            tipo_movimiento: item.tipo_movimiento,
            lote: item.lote,
            f_vence: item.f_vence,
            bodega: item.bodega,
          });
        });
        setDataSource(items);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          setDataSource([]);
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

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <>
      {contextHolder}
      <StyledCard title={"Kardex Consolidado"}>
        <Spin
          spinning={loader}
          indicator={
            <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
          }
          style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
        >
          <Row gutter={[12, 12]}>
            <Col
              xs={24}
              sm={24}
              md={{ offset: 2, span: 20 }}
              lg={{ offset: 4, span: 16 }}
            >
              <Form
                layout="vertical"
                form={form}
                onFinish={control.handleSubmit(onFinish)}
                onKeyDown={(e: any) => checkKeyDown(e)}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={24} md={24} lg={12}>
                    {!withBodegas ? (
                      <Controller
                        control={control.control}
                        name={"bodega_id"}
                        rules={{
                          required: {
                            value: true,
                            message: "Bodega es necesaria",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label={"Bodega:"}>
                            <Select
                              {...field}
                              allowClear
                              showSearch
                              placeholder="Bodega"
                              maxTagCount={1}
                              options={selectBodegas}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              popupMatchSelectWidth={false}
                              status={error && "error"}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : (
                      <Controller
                        control={control.control}
                        name="bodegas"
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Bodegas:"}>
                            <Select
                              {...field}
                              mode="multiple"
                              allowClear
                              showSearch
                              placeholder="Bodega"
                              maxTagCount={1}
                              options={selectBodegas}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              popupMatchSelectWidth={false}
                              status={error && "error"}
                              dropdownRender={(menu) => (
                                <>
                                  <div>
                                    <Button
                                      type="text"
                                      shape="round"
                                      onClick={() => handleSelectAll("bodegas")}
                                    >
                                      Seleccionar todos
                                    </Button>
                                  </div>
                                  <Divider style={{ marginBlock: 5 }} />
                                  {menu}
                                </>
                              )}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12}>
                    <Controller
                      control={control.control}
                      name="fechas"
                      rules={{
                        required: {
                          value: true,
                          message: "Rango de Fechas es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Rango de Fechas:"}>
                          <RangePicker
                            {...field}
                            placeholder={["Inicio", "Fin"]}
                            status={error && "error"}
                            style={{ width: "100%" }}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  {withBodegas ? (
                    <Col xs={24}>
                      <Controller
                        name="tipo_busqueda"
                        control={control.control}
                        render={({ field }) => (
                          <StyledFormItem label={"Tipo de Búsqueda:"}>
                            <Radio.Group {...field} buttonStyle="solid">
                              <Radio.Button value="producto">
                                Producto
                              </Radio.Button>
                              <Radio.Button value="cod_padre">
                                Código Padre
                              </Radio.Button>
                            </Radio.Group>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                  ) : null}
                  {control.watch("tipo_busqueda") == "producto" ? (
                    <>
                      <Col xs={24} md={24} lg={8}>
                        <Spin
                          spinning={loaderProducto}
                          indicator={
                            <LoadingOutlined
                              spin
                              style={{ fontSize: 28, color: "#f4882a" }}
                            />
                          }
                          style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                        >
                          <Controller
                            control={control.control}
                            name="producto_id"
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Código del Producto:"}
                              >
                                <Search
                                  {...field}
                                  placeholder="Código Producto"
                                  loading={loaderProducto}
                                  status={error && "error"}
                                  onSearch={(value: string) =>
                                    handleSearchProducto(value)
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Spin>
                      </Col>
                      <Col xs={24} md={24} lg={16}>
                        <Controller
                          control={control.control}
                          name="desc_producto"
                          rules={{
                            required: {
                              value: true,
                              message: "Código del Producto es necesario",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required
                              label={"Descripción del Producto:"}
                            >
                              <Input
                                {...field}
                                placeholder="Descripción Producto"
                                status={error && "error"}
                                readOnly
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}
                  {control.watch("tipo_busqueda") == "cod_padre" ? (
                    <>
                      <Col xs={24} md={24} lg={8}>
                        <Spin
                          spinning={loaderProducto}
                          indicator={
                            <LoadingOutlined
                              spin
                              style={{ fontSize: 28, color: "#f4882a" }}
                            />
                          }
                          style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
                        >
                          <Controller
                            control={control.control}
                            name="cod_padre"
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem required label={"Código Padre:"}>
                                <Search
                                  {...field}
                                  placeholder="Código Padre"
                                  loading={loaderProducto}
                                  status={error && "error"}
                                  onSearch={(value: string) =>
                                    handleSearchProducto(value)
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Spin>
                      </Col>
                      <Col xs={24} md={24} lg={16}>
                        <Controller
                          control={control.control}
                          name="desc_cod_padre"
                          rules={{
                            required: {
                              value: true,
                              message: "Código Padre es necesario",
                            },
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem
                              required
                              label={"Descripción de Código Padre:"}
                            >
                              <Input
                                {...field}
                                placeholder="Descripción Código Padre"
                                status={error && "error"}
                                readOnly
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}

                  <Col
                    xs={24}
                    sm={24}
                    md={{ offset: 2, span: 20 }}
                    lg={{ offset: 4, span: 16 }}
                  >
                    <Button htmlType="submit" type="primary" block>
                      Generar Kardex
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24}>
              <ExportExcel
                excelData={dataSource.map((item) => ({
                  Fecha: item.fecha,
                  Hora: item.hora,
                  Consecutivo: item.consecutivo,
                  Bodega: item.bodega,
                  Lote: item.lote,
                  "Fecha Vencimiento": item.f_vence,
                  "Cantidad Movimiento":
                    item.tipo_movimiento == "entrada"
                      ? item.cantidad_movimiento
                      : item.cantidad_movimiento * -1,
                  Saldo: item.cantidad_saldo,
                  "Tipo Movimiento": item.tipo_movimiento.toUpperCase(),
                }))}
                fileName={`KARDEX CONSOLDIDADO ${control.getValues(
                  "desc_producto"
                )}`}
              />
            </Col>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
              />
            </Col>
          </Row>
        </Spin>
      </StyledCard>
    </>
  );
};
