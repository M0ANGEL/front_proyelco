/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClientesRadicaciones } from "@/services/radicacion/radicacionAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { generarInformePHPPuro } from "@/services/informes/reportesAPI";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import fileDownload from "js-file-download";
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

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
export const RepRadicacionesPage = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectClientes, setSelectClientes] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoReporte, setSelectTipoReporte] = useState<
    SelectProps["options"]
  >([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [showClientesRadicados, setShowClientesRadicados] =
    useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const { stringToArrayBuffer } = useArrayBuffer();

  const control = useForm({
    defaultValues: {
      tipo_reporte: "",
      fechas_rango: undefined,
      clientes: [],
    },
  });

  useEffect(() => {
    const reportesDisponibles: SelectProps["options"] = [
      { label: "Radicaciones", value: "radicaciones" },
      {
        label: "Notas Crédito Consolidado",
        value: "notas_credito_glosas_consolidado",
      },
      {
        label: "Notas Crédito Detallado",
        value: "notas_credito_glosas_detallado",
      },
    ];
    switch (user_rol) {
      case "auditoria":
      case "administrador":
        reportesDisponibles.push({
          label: "Consolidado Dispensaciones Auditadas",
          value: "consolidado_dis_auditadas",
        });
        break;
    }

    setSelectTipoReporte(reportesDisponibles);
  }, []);

  const watchTipoReporte = control.watch("tipo_reporte");

  useEffect(() => {
    if (!watchTipoReporte) {
      control.reset({ fechas_rango: control.getValues("fechas_rango") });
    }
    if (watchTipoReporte) {
      switch (watchTipoReporte) {
        case "radicaciones":
        case "consolidado_dis_auditadas":
          setShowClientesRadicados(true);
          break;
        default:
          setShowClientesRadicados(false);
          break;
      }
    }
  }, [watchTipoReporte]);

  useEffect(() => {
    const fetchInputs = async () => {
      setLoader(true);
      await getClientesRadicaciones().then(({ data: { data } }) => {
        setSelectClientes(
          data.map((item: any) => ({
            label: `${item.nit} - ${item.razon_soc}`,
            value: item.nit,
          }))
        );
      });

      setLoader(false);
    };

    fetchInputs();
  }, []);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
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
    const rango_fechas = control.getValues("fechas_rango") ?? [];
    const initialDate = dayjs(rango_fechas[0]).format("YYYY-MM-DD");
    const endDate = dayjs(rango_fechas[1]).format("YYYY-MM-DD");
    let nombre_archivo = "";
    switch (control.getValues("tipo_reporte")) {
      case "radicaciones":
        nombre_archivo = "radicacion/reporteRadicacionesSQL";
        break;
      case "notas_credito_glosas_consolidado":
        nombre_archivo = "radicacion/reporteNotasCreditoGlosasConsolidadoSQL";
        break;
      case "notas_credito_glosas_detallado":
        nombre_archivo = "radicacion/reporteNotasCreditoGlosasDetalladoSQL";
        break;
      case "consolidado_dis_auditadas":
        nombre_archivo =
          "radicacion/reporteConsolidadoDispensacionesAuditadasSQL";
        break;
    }

    generarInformePHPPuro(
      {
        ...data,
        initialDate,
        endDate,
        user_rol,
      },
      nombre_archivo
    )
      .then(({ data }) => {
        if (selectTipoReporte) {
          const filename = selectTipoReporte
            .find((item) => item.value == control.getValues("tipo_reporte"))
            ?.label?.toString()
            .toUpperCase();
          fileDownload(stringToArrayBuffer(data), `${filename}.xls`);
          notificationApi.open({
            type: "success",
            message: "Reporte generado con exito!",
          });
        }
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
        <StyledCard
          title={<Title level={4}>REPORTES DE RADICACION - GLOSAS</Title>}
        >
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
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {showClientesRadicados ? (
                <Col span={24}>
                  <Controller
                    name="clientes"
                    control={control.control}
                    render={({ field }) => (
                      <StyledFormItem label={"Clientes:"}>
                        <Select
                          {...field}
                          showSearch
                          allowClear
                          maxTagCount={3}
                          maxTagTextLength={40}
                          mode="multiple"
                          options={selectClientes}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        />
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}

              <Col
                xs={{ span: 24 }}
                sm={{ offset: 7, span: 10 }}
                md={{ offset: 9, span: 6 }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  htmlType="submit"
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
