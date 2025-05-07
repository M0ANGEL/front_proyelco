import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, DatePicker, Form, notification, Row, Select, SelectProps, Spin, Typography, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons"
import { StyledCard, StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { generarReporteIncapacidades } from "@/services/informes/reportesAPI";
import dayjs from "dayjs";
import fileDownload from "js-file-download";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getPorcentajes } from "@/services/gestion-humana/porcentajesAPI"
import { Empleado, Porcentaje } from  "@/services/types";

const { Title, Text } = Typography
const { RangePicker } = DatePicker

export const FormReporteIncapacidades = () => {

  const [notificationApi, contextHolder] = notification.useNotification()
  const [loader, setLoader] = useState<boolean>(true)
  const control = useForm()
  const [selectEmpleados, setSelectEmpleados] = useState<SelectProps["options"]>([])
  const [selectOrigenIncapacidades, setSelectOrigenIncapacidades] = useState<SelectProps["options"]>([])
  // const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>([])
  const { arrayBufferToString } = useArrayBuffer();
  const [datesSelected, setDatesSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Ejecutar todas las peticiones en paralelo
      try {
        const [empleados, origenIncapacidades] = await Promise.all([
          getEmpleados(),
          getPorcentajes(),
        ]);

        setSelectEmpleados(empleados.data.data.map((item: Empleado) => ({
          label: `${item.cedula} - ${item.nombre_completo} - ${item.estado === '1' ? 'Activo' : 'Inactivo'}`,
          value: item.id.toString()
        })));

        setSelectOrigenIncapacidades(origenIncapacidades.data.data.map((item: Porcentaje) => ({
          label: item.tipo_incapacidad, value: item.id.toString()
        })));

      } catch (error) {
        console.log("Error: " + error);
      } finally {
        setLoader(false);
      }

    }
    fetchData()
  }, [])


  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault()
  }

  const onFinish = (data: any) => {
    setLoader(true);

    if (Array.isArray(data.fechas_rango) && data.fechas_rango.length >= 2) {
      data.fechas_rango = [
        dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
      ];
    }

    if (Array.isArray(data.fechas_rango_reg) && data.fechas_rango_reg.length >= 2) {
      data.fechas_rango_reg = [
        dayjs(data.fechas_rango_reg[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango_reg[1]).format("YYYY-MM-DD"),
      ];
    }
    
    const filename = 'Incapacidades'
    generarReporteIncapacidades(data)
      .then(({ data }) => {

        if (data.excel) {
          const excelBlob = new Blob([new Uint8Array(atob(data.excel).split("").map(c => c.charCodeAt(0)))], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
    
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

  const onDateChange = (dates: any) => {
    setDatesSelected(dates && dates.length === 2);
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
        <StyledCard title={<Title level={4}>REPORTES INCAPACIDADES EMPLEADOS</Title>}>
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
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: "Rango de Fechas es necesario",
                  //   },
                  // }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas incapacidades:"}>
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
                  name="fechas_rango_reg"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas de Registro:"}>
                      <RangePicker
                        {...field}
                        placeholder={["Inicio", "Fin"]}
                        status={error && "error"}
                        style={{ width: "100%" }}
                        onChange={(dates) => {
                          field.onChange(dates);
                          onDateChange(dates);
                        }}
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
                  name="origen"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Origen"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Origen"
                        options={selectOrigenIncapacidades}
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
                <Controller
                  name="pagada"
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Pagada">
                        <Select
                          {...field}
                          showSearch
                          allowClear
                          mode="multiple"
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toString().toLowerCase()
                              )
                          }
                          filterOption={(input, option) =>
                            (option?.label?.toString() ?? "")
                              .toLowerCase()
                              .includes(input.toString().toLowerCase())
                          }
                          options={[
                            { value: "SI", label: "SI" },
                            { value: "NO", label: "NO" },
                            { value: "FARMART", label: "FARMART" },
                          ]}
                          status={error && "error"}
                        />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 12 }} sm={{ span: 6 }}>
                <Controller
                  control={control.control}
                  name="incapacidad_activas"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"¿Incapacidades Activas?"}>
                      <Checkbox
                        {...field}
                      >Seleccione</Checkbox>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 12 }} sm={{ span: 6 }}>
                <Controller
                  control={control.control}
                  name="generar_zip"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"¿Comprimir soportes incapacidad?"}>
                      <Checkbox
                        {...field}
                        disabled={!datesSelected}
                      >Seleccione</Checkbox>
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
}