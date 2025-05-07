/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/router/GlobalContext";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import {
  generarReporteDispensacion,
  generarInformePHPPuro,
} from "@/services/informes/reportesAPI";
import { GreenButton } from "./styled";
import { TypesForm } from "./types";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";

import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Select,
  Form,
  Spin,
  Col,
  Row,
  Input,
} from "antd";
import { fetchUserProfile } from "@/services/auth/authAPI";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const ReporteTickets = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }

  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString, stringToArrayBuffer } = useArrayBuffer();
  const [usuario, setUsuario] = useState<number>();
  const [numeroTicekt, setNumeroTicekt] = useState<string>("");

  const [loader, setLoader] = useState<boolean>(false);
  const control = useForm<TypesForm>({
    defaultValues: {
      tipo_reporte: "",
      fechas_rango: undefined,
    },
  });
  const watchTipoReporte = control.watch("tipo_reporte");

  const selectTipoReporte: SelectProps["options"] = [
    {
      label: "Reporte Tickets Calificados y cerrados",
      value: "reporte_calificado",
    },
    { label: "Reporte Tickets rechazados", value: "reporte_rechazdos" },
    { label: "Reporte Detallado por ticket", value: "reporte_por_ticket" },
  ];

  const fetchDocumentos = async () => {
    const response = await fetchUserProfile();
    setUsuario(response.data.userData.proceso_id);
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  useEffect(() => {
    control.reset({
      tipo_reporte: watchTipoReporte,
      usuario_proceso: usuario,
      fechas_rango: undefined,
    });
  }, [watchTipoReporte]);

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
    data.usuario_proceso = usuario; // Agregar proceso_id

    generarReporteDispensacion(data)
      .then(({ data }) => {
        fileDownload(data, `${filename}.xlsx`);
        notificationApi.open({
          type: "success",
          message: "Reporte generado con éxito!",
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

      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>REPORTES DE TICKETS</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              {/* tipo de reporte */}
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
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

              {/* Número del ticket (solo si es "reporte_por_ticket") */}
              {watchTipoReporte === "reporte_por_ticket" && (
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="numero_ticket"
                    rules={{
                      required: {
                        value: true,
                        message: "Número de Ticket es necesario",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Número de Ticket:"} required>
                        <Input
                          {...field}
                          maxLength={50}
                          placeholder="Ingrese el número de ticket"
                          status={error && "error"}
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              )}

              {/* rango de fehcas */}
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
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
                        status={error && "error"}
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </Row>

            {/* boton generar el reporte */}
            <Row gutter={[12, 12]} style={{ marginTop: 15 }}>
              <Col
                xs={{ span: 24 }}
                sm={{
                  span: 10,
                  offset: 7,
                }}
                md={{
                  span: 6,
                  offset: 9,
                }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  disabled={control.getValues("tipo_reporte") ? false : true}
                  onClick={() => {
                    control.clearErrors();
                    setLoader(true);
                    if (!control.getValues("fechas_rango")) {
                      setLoader(false);
                      control.setError("fechas_rango", {
                        type: "required",
                        message: "Rango de Fechas es necesario",
                      });
                      return;
                    }

                    const rango_fechas =
                      control.getValues("fechas_rango") ?? [];
                    const initialDate = dayjs(rango_fechas[0]).format(
                      "YYYY-MM-DD"
                    );
                    const endDate = dayjs(rango_fechas[1]).format("YYYY-MM-DD");
                    let nombre_archivo = "";
                    switch (control.getValues("tipo_reporte")) {
                      case "reporte_calificado":
                        nombre_archivo = "tickets/reporteTicketsSQL";
                        break;

                      case "reporte_rechazdos":
                        nombre_archivo = "tickets/reporteTicketsSQL";
                        break;

                      case "reporte_por_ticket":
                        nombre_archivo = "tickets/reportePorTickteSQL";
                        break;

                    }

                    generarInformePHPPuro(
                      {
                        ...control.getValues(),
                        initialDate,
                        endDate,
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
                        fileDownload(
                          stringToArrayBuffer(data),
                          `${filename}.xls`
                        );
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
                      });
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
