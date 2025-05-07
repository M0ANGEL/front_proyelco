import { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, SelectProps, Spin, Typography } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { StyledCard, StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form"
import { getBodegas } from "@/services/maestras/bodegasAPI"
import dayjs from "dayjs"
import { generarReporteEmpleados } from "@/services/informes/reportesAPI";
import fileDownload from "js-file-download";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getContratosLaborales } from "@/services/gestion-humana/contratosLaboralesAPI";
import { getEmpleados } from "@/services/maestras/empleadosAPI";

const { Title, Text } = Typography
const { RangePicker } = DatePicker

export const ReportIngresos = () => {

  const [notificationApi, contextHolder] = notification.useNotification()
  const [loader, setLoader] = useState<boolean>(true)
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>([])
  const [selectTipoContratos, setSelectTipoContratos] = useState<SelectProps["options"]>([])
  const [selectEmpleados, setSelectEmpleados] = useState<SelectProps["options"]>([])
  const { arrayBufferToString } = useArrayBuffer();
  const control = useForm()

  useEffect(() => {
    getBodegas().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((bodega) => {
          return { label: bodega.bod_nombre, value: bodega.id }
        })
      )
      fetchTipoContratos()
      fetchEmpleados()
      setLoader(false)
    })
  }, [])

  const fetchTipoContratos = () => {

    getContratosLaborales().then(({ data: { data } }) => {
      setSelectTipoContratos(
        data.map((cargo) => {
          return { label: cargo.nombre, value: cargo.id }
        })
      )
    })
  }

  const fetchEmpleados = () => {
    getEmpleados().then(({ data: { data } }) => {
      setSelectEmpleados(
        data.map((empleado) => {
          return { 
            label: `${empleado.cedula} - ${empleado.nombre_completo} - ${empleado.estado === '1' ? 'Activo' : 'Inactivo'}`, 
            value: empleado.id 
          }
        })
      )
    })
  }

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault()
  }

  const onFinish = (data: any) => {
    setLoader(true);
    if (data.fechas_rango) {
      data.fechas_rango = [
        dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
        dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
      ];
    }
    
    const filename = 'empleados'
    generarReporteEmpleados(data)
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
        <StyledCard title={<Title level={4}>REPORTES INGRESOS EMPLEADOS</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="bodegas"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Sedes"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Sedes"
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
                  name="fechas_rango"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: "Rango de Fechas es necesario",
                  //   },
                  // }}
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
                  name="tipo_contrato"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Tipo de contrato"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Tipos contrato"
                        options={selectTipoContratos}
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
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                >
                  Generar Reporte
                </Button>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  )
}