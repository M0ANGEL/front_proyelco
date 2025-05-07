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
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { FaFileExcel } from "react-icons/fa";
import dayjs from "dayjs";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { getDotaciones } from "@/services/gestion-humana/dotacionesAPI";
import { generarReporteEntregaDotacion } from "@/services/informes/reportesAPI";
import fileDownload from "js-file-download";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
export const ReporteEntregaDotaciones = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const control = useForm();
  const [selectEmpleados, setSelectEmpleados] = useState<SelectProps["options"]>([]);
  const [selectDotaciones, setSelectDotaciones] = useState<SelectProps["options"]>([]);
  const { arrayBufferToString } = useArrayBuffer();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  const fetchEmpleados = () => {
    getEmpleados().then(({ data: { data } }) => {
      setSelectEmpleados(
        data.map((empleado) => {
          return {
            label: `${empleado.cedula} - ${empleado.nombre_completo} - ${
              empleado.estado === "1" ? "Activo" : "Inactivo"
            }`,
            value: empleado.id,
          };
        })
      );
    });
  };

  const fetchDotaciones = () => {
    getDotaciones().then(({ data: { data } }) => {
      setSelectDotaciones(
        data.map((dotacion) => {
          return {
            label: `${dotacion.tipo} - ${dotacion.talla}`,
            value: dotacion.id,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchEmpleados();
    fetchDotaciones();
    setLoader(false);
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
    
    const filename = 'entregas_dotaciones'
    generarReporteEntregaDotacion(data)
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
        <StyledCard
          title={<Title level={4}>REPORTES ENTREGAS DOTACIONES</Title>}
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="dotaciones"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Dotaciones"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Dotaciones"
                        options={selectDotaciones}
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
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <StyledFormItem label=" ">
                  <GreenButton 
                    type="primary" 
                    block 
                    htmlType="submit" 
                    icon={<FaFileExcel/>}
                    disabled={!["gh_admin", "gh_bienestar", "administrador"].includes(user_rol)}
                  >
                    Generar Reporte
                  </GreenButton>
                </StyledFormItem>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
