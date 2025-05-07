import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  notification,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import dayjs from "dayjs";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getTerminarContratos } from "@/services/gestion-humana/terminarContratosAPI";
import { ContratoTerminado } from "@/services/types";
import { generarReporteRetiros } from "@/services/informes/reportesAPI";
import fileDownload from "js-file-download";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const FormReportesRetiros = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false); // poner en true cuando terminemos el component
  const { arrayBufferToString } = useArrayBuffer();
  const control = useForm();
  const [selectEmpleados, setSelectEmpleados] = useState<
    SelectProps["options"]
  >([]);
  const [selectMotivosRetiro, setSelectMotivosRetiro] = useState<
    SelectProps["options"]
  >([]);

  useEffect(() => {
    setSelectMotivosRetiro([
      { label: "VOLUNTARIO", value: "1" },
      { label: "TERMINACIÓN", value: "2" },
      { label: "PERIODO DE PRUEBA", value: "3" },
    ]);

    const fetchData = async () => {
      try {
        const [empleados] = await Promise.all([
          getTerminarContratos(),
          //   getPorcentajes(),
        ]);

        setSelectEmpleados(
          empleados.data.data.map((item: ContratoTerminado) => ({
            label: item.cedula + "-" + item.nombre_completo,
            value: item.empleado_id,
          }))
        );

        // setSelectOrigenIncapacidades(origenIncapacidades.data.data.map((item: Porcentaje) => ({
        //   label: item.tipo_incapacidad, value: item.id.toString()
        // })));
      } catch (error) {
        console.log("Error: " + error);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    if (data.fechas_rango) {
      data.fechas_rango = [
        dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
      ];
    }

    const filename = 'Retirados'
    generarReporteRetiros(data)
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
        <StyledCard title={<Title level={4}>REPORTE RETIRO EMPLEADOS</Title>}>
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
                  //   rules={{
                  //     required: {
                  //       value: true,
                  //       message: "Rango de Fechas es necesario",
                  //     },
                  //   }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas:"}>
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="empleados_retirados"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Empleados Retirados"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Empleados Retirados"
                        options={selectEmpleados}
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
                  name="motivo_retiro"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Motivo Retiro"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Motivo Retiro"
                        options={selectMotivosRetiro}
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
              <Col xs={24} sm={12}>
                <StyledFormItem label=" ">
                  <Button type="primary" block htmlType="submit">
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
