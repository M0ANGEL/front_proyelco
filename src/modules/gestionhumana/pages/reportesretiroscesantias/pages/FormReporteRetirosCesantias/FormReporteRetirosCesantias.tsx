import { useEffect, useState } from "react";
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
import { Controller, useForm } from "react-hook-form";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { Empleado } from "@/services/types";
import { generarRetiroCesantias } from "@/services/informes/reportesAPI";
import fileDownload from "js-file-download";
import dayjs from "dayjs";


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const FormReporteRetirosCesantias = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const control = useForm();
  const [selectEmpleados, setSelectEmpleados] = useState<
    SelectProps["options"]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ejecutar todas las peticiones en paralelo
      try {
        const [empleados] = await Promise.all([getEmpleados()]);

        setSelectEmpleados(
          empleados.data.data.map((item: Empleado) => ({
            label: `${item.cedula} - ${item.nombre_completo} - ${
              item.estado === "1" ? "Activo" : "Inactivo"
            }`,
            value: item.id.toString(),
          }))
        );
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

    generarRetiroCesantias(data)
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

          fileDownload(excelBlob, `${data.fileName}.xlsx`);
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
        <StyledCard title={<Title level={4}>REPORTE RETIROS CESANTIAS</Title>}>
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="empleados"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Empleados"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Empleados"
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
