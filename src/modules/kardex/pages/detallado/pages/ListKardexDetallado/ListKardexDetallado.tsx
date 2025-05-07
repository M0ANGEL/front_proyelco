/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { getProducto } from "@/services/maestras/productosAPI";
import { getKardexDetallado } from "@/services/kardex/kardexAPI";
import { fetchUserBodegas } from "@/services/auth/authAPI";
import { Controller, useForm } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Producto } from "@/services/types";
import { KEY_BODEGA } from "@/config/api";
import { DataType } from "./types";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Button,
  Select,
  Input,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;

export const ListKardexDetallado = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderProducto, setLoaderProducto] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [producto, setProducto] = useState<Producto>();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [form] = Form.useForm();
  const control = useForm({
    defaultValues: {
      bodega_id: getSessionVariable(KEY_BODEGA),
      fechas: undefined,
      producto_id: "",
      desc_producto: "",
      lote: "",
      f_vence: undefined,
    },
  });

  const watchCodigoProducto = control.watch("producto_id");

  useEffect(() => {
    if (watchCodigoProducto != producto?.id.toString()) {
      control.setValue("desc_producto", "");
      setProducto(undefined);
    }
  }, [watchCodigoProducto, producto]);

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

  const handleSearchProducto = (codigo: string) => {
    setLoaderProducto(true);
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
    console.log(data);
    getKardexDetallado(data)
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
      <StyledCard title={"Kardex Detallado"}>
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
                    <Controller
                      control={control.control}
                      name="bodega_id"
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
                  <Col xs={24} md={12}>
                    <Controller
                      control={control.control}
                      name="lote"
                      rules={{
                        required: {
                          value: true,
                          message: "Lote es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Lote:"}>
                          <Input
                            {...field}
                            placeholder="Lote"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Controller
                      control={control.control}
                      name="f_vence"
                      rules={{
                        required: {
                          value: true,
                          message: "Fecha Vencimiento es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Fecha Vencimiento:"}>
                          <DatePicker
                            {...field}
                            placeholder="Fecha Vencimiento (YYYY-MM-DD)"
                            format={"YYYY-MM-DD"}
                            style={{ width: "100%" }}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>

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
                  "Cantidad Movimiento":
                    item.tipo_movimiento == "entrada"
                      ? item.cantidad_movimiento
                      : item.cantidad_movimiento * -1,
                  Saldo: item.cantidad_saldo,
                  "Tipo Movimiento": item.tipo_movimiento.toUpperCase(),
                }))}
                fileName={`KARDEX DETALLADO ${control.getValues(
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
