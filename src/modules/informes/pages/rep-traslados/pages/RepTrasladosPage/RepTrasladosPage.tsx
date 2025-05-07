/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { useContext, useEffect, useState } from "react";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import {
  generarReporteTraslados,
  generarInformePHPPuro,
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
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import { GlobalContext } from "@/router/GlobalContext";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RepTrasladosPage = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString, stringToArrayBuffer } = useArrayBuffer();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  // const { disabled62DaysDate } = useDateFunctions();

  const user_rol = getSessionVariable(KEY_ROL);

  const control = useForm({
    defaultValues: {
      tipo_reporte: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
    },
  });

  const selectTipoReporte: SelectProps["options"] = [
    { label: "Traslados Salida", value: "traslados_salida" },
    { label: "Traslados Entrada", value: "traslados_entrada" },
    {
      label: "Traslados Salidas Pendientes",
      value: "traslados_salida_pendientes",
    },
  ];

  const selectEstados: SelectProps["options"] = [
    { label: "Abierto", value: "1" },
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
    generarReporteTraslados(data)
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
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>REPORTES DE TRASLADOS</Title>}>
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
                        // disabledDate={disabled62DaysDate}
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
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .localeCompare(
                              (optionB?.label ?? "").toString().toLowerCase()
                            )
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
              <Col
                xs={{ span: 24 }}
                sm={{ span: 10, offset: 7 }}
                md={{
                  span: 6,
                  offset: 9,
                }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  onClick={() => {
                    control.clearErrors();
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
                        case "traslados_salida":
                          nombre_archivo = "reporteTrasladosSalidaSQL";
                          break;
                        case "traslados_entrada":
                          nombre_archivo = "reporteTrasladosEntradaSQL";
                          break;
                        case "traslados_salida_pendientes":
                          nombre_archivo = "reporteSalidasPendientesSQL";
                          break;
                      }
                      generarInformePHPPuro(
                        {
                          ...control.getValues(),
                          initialDate,
                          endDate,
                          user_rol,
                          hasFuentes: userGlobal?.has_fuentes,
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
                    } else {
                      setLoader(false);
                      control.setError("fechas_rango", {
                        type: "required",
                        message: "Rango de Fechas es necesario",
                      });
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
