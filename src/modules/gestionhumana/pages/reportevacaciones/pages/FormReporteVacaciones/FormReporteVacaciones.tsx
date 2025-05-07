import { useState } from "react";
import {
  Col,
  notification,
  Row,
  Spin,
  Typography,
  DatePicker,
  Form,
  Button,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { generarReporteVacaciones } from "@/services/informes/reportesAPI"
import fileDownload from "js-file-download";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const FormReporteVacaciones = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const control = useForm();

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);

    if (Array.isArray(data.fechas_rango) && data.fechas_rango.length >= 2) {
      data.fechas_rango = [
        dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
      ];
    }

    if (
      Array.isArray(data.fechas_rango_reg) &&
      data.fechas_rango_reg.length >= 2
    ) {
      data.fechas_rango_reg = [
        dayjs(data.fechas_rango_reg[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango_reg[1]).format("YYYY-MM-DD"),
      ];
    }

    const filename = "Vacaciones";
    generarReporteVacaciones(data)
      .then(({ data }) => {
        if (data.excel) {
          const excelBlob = new Blob(
            [
              new Uint8Array(
                atob(data.excel)
                  .split("")
                  .map((c) => c.charCodeAt(0))
              ),
            ],
            {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
          );

          fileDownload(excelBlob, `${filename}.xlsx`);
        }
        if (data.zip_url) {
          setTimeout(() => {
            window.open(data.zip_url, "_blank");
          }, 2000);
        }

        notificationApi.open({
          type: "success",
          message: "Reporte generado con exito!",
        });
      })
      .catch(({ response: { data } }) => {
        notificationApi.open({
          type: "error",
          message: data.message,
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
        <StyledCard
          title={<Title level={4}>REPORTES VACACIONES EMPLEADOS</Title>}
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
                  name="fechas_rango"
                  rules={{
                    required: {
                      value: true,


                      message: "Rango de Fechas es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label={"Rango de Fechas vacaciones"}>
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
              <Col xs={24} sm={12}>
                <StyledFormItem label=" ">
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                  >
                    Generar Reporte
                  </Button>
                </StyledFormItem>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
