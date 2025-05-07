/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getTercerosList } from "@/services/admin-terceros/tercerosAPI";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import fileDownload from "js-file-download";
import {
  generarInformePHPPuro,
  generarReporteCompras,
  validarTotalRegistros,
} from "@/services/informes/reportesAPI";
import { GreenButton } from "./styled";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Select,
  Modal,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RepComprasPage = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTercero, setLoaderTercero] = useState<boolean>(true);
  const [aceptaGenerarReporte, setAceptaGenerarReporte] =
    useState<boolean>(false);
  const [selectProveedores, setSelectProveedores] = useState<
    SelectProps["options"]
  >([]);
  const [modal, contextHolderModal] = Modal.useModal();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const { arrayBufferToString } = useArrayBuffer();
  const user_rol = getSessionVariable(KEY_ROL);
  const control = useForm({
    defaultValues: {
      tipo_reporte: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      proveedores: [],
    },
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const watchTipoReporte = control.watch("tipo_reporte");

  const selectTipoReporte: SelectProps["options"] = [
    { label: "Facturas Proveedor", value: "facturas_proveedor" },
    {
      label: "Dispensaciones, Pendientes y Devoluciones",
      value: "dis_pen_dvd",
    },
    { label: "Devoluciones Proveedor", value: "devoluciones_proveedor" },
    { label: "Documentos Movimientos", value: "documentos_movimientos" },
    {
      label: "Variación Precios Factura Proveedor",
      value: "variacion_precio_fp",
      disabled: ![
        "administrador",
        "revisor_compras",
        "cotizaciones",
        "compras",
      ].includes(user_rol),
    },
    { label: "Seguimiento Requisiciones", value: "seguimiento_requisiciones" },
  ];

  const selectEstados: SelectProps["options"] = [
    { label: "Abierto", value: "0" },
    { label: "Pendientes", value: "1" },
    { label: "En Proceso", value: "2" },
    { label: "Cerrado", value: "3" },
    { label: "Anulado", value: "4" },
  ];

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((bodega) => {
          return { label: bodega.bod_nombre, value: bodega.id };
        })
      );
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    switch (watchTipoReporte) {
      case "variacion_precio_fp":
        setLoaderTercero(true);
        control.resetField("proveedores");
        getTercerosList()
          .then(({ data: { data } }) => {
            const opciones: SelectProps["options"] = [];
            data.forEach((item) => {
              item.tipo_id.includes("1")
                ? opciones.push({
                    label: `${item.nit} - ${item.razon_soc}`,
                    value: item.id.toString(),
                  })
                : null;
            });
            setSelectProveedores(opciones);
          })
          .finally(() => setLoaderTercero(false));
        break;
      default:
        control.resetField("proveedores");
        break;
    }
  }, [watchTipoReporte]);

  useEffect(() => {
    if (aceptaGenerarReporte) {
      buttonRef.current?.click();
    }
  }, [aceptaGenerarReporte]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    data.fechas_rango = [
      dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
      dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
    ];
    const filename = selectTipoReporte
      .find((item) => item.value == data.tipo_reporte)
      ?.label?.toString()
      .toUpperCase();
    data.filename = filename;
    generarReporteCompras(data)
      .then(({ data }) => {
        fileDownload(data, `${filename}.xlsx`);
        notificationApi.open({
          type: "success",
          message: "Reporte generado con exito!",
        });
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>REPORTES DE COMPRAS</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="tipo_reporte"
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo de Reporte es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Tipo de Reporte:"} required>
                      <Select
                        {...field}
                        showSearch
                        allowClear
                        placeholder="Tipo Reporte"
                        options={selectTipoReporte}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="fechas_rango"
                  rules={{
                    required: {
                      value: true,
                      message: "Rango de Fechas es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas:"} required>
                      <RangePicker
                        {...field}
                        placeholder={["Inicio", "Fin"]}
                        status={error && "error"}
                        style={{ width: "100%" }}
                        maxDate={dayjs()}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="bodegas"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Bodegas:"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Bodegas"
                        options={selectBodegas}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="estados"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Estados:"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Estados"
                        options={selectEstados}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {["variacion_precio_fp"].includes(watchTipoReporte) ? (
                <Col xs={{ span: 24 }}>
                  <Controller
                    control={control.control}
                    name="proveedores"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Proveedores:"}>
                        <Spin spinning={loaderTercero}>
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            placeholder="Proveedores"
                            options={selectProveedores}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12, offset: 6 }}
                md={{ span: 8, offset: 8 }}
                lg={{ span: 6, offset: 9 }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  ref={buttonRef}
                  onClick={() => {
                    setLoader(true);
                    if (control.getValues("fechas_rango")) {
                      const rango_fechas =
                        control.getValues("fechas_rango") ?? [];
                      const initialDate = dayjs(rango_fechas[0]).format(
                        "YYYY-MM-DD"
                      );
                      const endDate = dayjs(rango_fechas[1]).format(
                        "YYYY-MM-DD"
                      );
                      let nombre_archivo = "";
                      switch (control.getValues("tipo_reporte")) {
                        case "dis_pen_dvd":
                          nombre_archivo = "reporteDisPenDevSQL";
                          break;
                        case "facturas_proveedor":
                          nombre_archivo = "reporteFacturaProveedorSQL";
                          break;
                        case "devoluciones_proveedor":
                          nombre_archivo = "reporteDevolucionProveedorSQL";
                          break;
                        case "variacion_precio_fp":
                          nombre_archivo = "reporteVariacionPrecioFPSQL";
                          break;
                        case "seguimiento_requisiciones":
                          nombre_archivo = "reporteSeguimientoRequisicionSQL";
                          break;
                        case "documentos_movimientos":
                          nombre_archivo = "reporteDocumentosMovimientosSQL";
                          break;
                      }

                      if (
                        [
                          "dis_pen_dvd",
                          "facturas_proveedor",
                          "documentos_movimientos",
                        ].includes(control.getValues("tipo_reporte")) &&
                        ["administrador", "compras", "cotizaciones"].includes(
                          user_rol
                        ) &&
                        !aceptaGenerarReporte
                      ) {
                        generarInformePHPPuro(
                          {
                            ...control.getValues(),
                            initialDate,
                            endDate,
                            only_sql: true,
                            user_rol,
                          },
                          nombre_archivo
                        ).then(({ data }) => {
                          const sql = data;
                          notificationApi.info({
                            message: "Validando registros...",
                          });
                          validarTotalRegistros({ sql })
                            .then(({ data: { data } }) => {
                              modal.confirm({
                                title: "Generar Reporte",
                                content: `El reporte que estás intentando generar tiene ${data} filas, ¿Deseas generarlo?`,
                                onOk: () => {
                                  setAceptaGenerarReporte(true);
                                },
                                onCancel: () => {
                                  setAceptaGenerarReporte(false);
                                },
                                okText: "Si",
                                cancelText: "No",
                              });
                            })
                            .catch(({ request: { response } }) => {
                              notificationApi.open({
                                type: "error",
                                message: response,
                              });
                            })
                            .finally(() => {
                              setLoader(false);
                            });
                        });

                        return;
                      }
                      notificationApi.info({
                        message: "Generando reporte...",
                      });
                      generarInformePHPPuro(
                        {
                          ...control.getValues(),
                          initialDate,
                          endDate,
                          user_rol,
                        },
                        nombre_archivo
                      )
                        .then(({ data }) => {
                          const filename = selectTipoReporte
                            .find(
                              (item) =>
                                item.value == control.getValues("tipo_reporte")
                            )
                            ?.label?.toString()
                            .toUpperCase();
                          fileDownload(data, `${filename}.xls`);
                          notificationApi.open({
                            type: "success",
                            message: "Reporte generado con exito!",
                          });
                        })
                        .catch(({ request: { response } }) => {
                          notificationApi.open({
                            type: "error",
                            message: response,
                          });
                        })
                        .finally(() => {
                          setLoader(false);
                          setAceptaGenerarReporte(false);
                        });
                    } else {
                      control.setError("fechas_rango", {
                        type: "required",
                        message: "Rango de Fechas es necesario",
                      });
                      setLoader(false);
                    }
                  }}
                >
                  Reporte General
                </GreenButton>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
