/* eslint-disable @typescript-eslint/no-explicit-any */
import { generarReporteFacturacion } from "@/services/informes/reportesAPI";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { useContext, useEffect, useState } from "react";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { GlobalContext } from "@/router/GlobalContext";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import { GreenButton } from "./styled";
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
import { BASE_URL_REP } from "@/config/api";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
export const RepAnuladosPage = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const { arrayBufferToString } = useArrayBuffer();

  const control = useForm({
    defaultValues: {
      tipo_reporte: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      tipo_autorizacion: "detalle",
    },
  });

  const selectTipoReporte: SelectProps["options"] = [
    { label: "DISPENSACIONES", value: "repDispensacionesAnuladas" },
    { label: "DEVOLUCIONES", value: "repDevolucionesAnuladas" },
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
    generarReporteFacturacion(data)
      .then(({ data }) => {
        if (
          ["fact_anexof", "anexoDev", "facturacion1"].includes(
            control.getValues("tipo_reporte")
          )
        ) {
          fileDownload(data, `${filename}.csv`);
        } else {
          fileDownload(data, `${filename}.xlsx`);
        }
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
        <StyledCard title={<Title level={4}>REPORTES DE ANULADOS</Title>}>
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
                        minDate={
                          userGlobal &&
                          [1, "1"].includes(userGlobal.has_limite_reportes)
                            ? dayjs().subtract(1, "day")
                            : undefined
                        }
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
              <Col
                xs={{ span: 24 }}
                sm={{ offset: 7, span: 10 }}
                md={{ offset: 9, span: 6 }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  onClick={() => {
                    if (control.getValues("fechas_rango")) {
                      const rango_fechas =
                        control.getValues("fechas_rango") ?? [];

                      const initialDate = dayjs(rango_fechas[0]).format(
                        "YYYY-MM-DD"
                      );
                      const endDate = dayjs(rango_fechas[1]).format(
                        "YYYY-MM-DD"
                      );
                      let link = "";
                      switch (control.getValues("tipo_reporte")) {
                        case "repDispensacionesAnuladas":
                          link = `repDispensacionesAnuladasSQL`;
                          break;
                        case "repDevolucionesAnuladas":
                          link = `repDevolucionesAnuladasSQL`;
                          break;

                        default:
                          break;
                      }

                      window
                        .open(
                          `${BASE_URL_REP}${link}.php?initialDate=${initialDate}&endDate=${endDate}`,
                          "_blank"
                        )
                        ?.focus();
                    } else {
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
