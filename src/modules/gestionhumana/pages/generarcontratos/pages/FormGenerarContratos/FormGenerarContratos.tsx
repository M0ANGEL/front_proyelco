import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Form, notification, Row, Select, SelectProps, Spin, Typography } from "antd";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { generarContratos } from "@/services/gestion-humana/generarContratosAPI";
// import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { LoadingOutlined } from "@ant-design/icons";
import { StyledCard, StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";

const { Title, Text } = Typography

export const FormGenerarContratos = () => {

  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const control = useForm();
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    getEmpleados()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { 
            label: `${item.cedula} - ${item.nombre_completo} - ${item.estado === '1' ? 'Activo' : 'Inactivo'}`,
            value: item.id.toString()
           };
        });
        setSelectEmpleado(options);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  }, []);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  // const pushNotification = ({
  //   type = "success",
  //   title,
  //   description,
  // }: Notification) => {
  //   api[type]({
  //     message: title,
  //     description: description,
  //     placement: "bottomRight",
  //   });
  // };


  const onFinish: SubmitHandler<any> = async (datos) => {
    setLoader(true);

    generarContratos(datos.empleado).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      setLoader(false);
    })
      .finally(() => setLoader(false))
      .catch((error) => {
        setLoader(false)
        console.log('type: ' + error, 'title: ' + error.error + 'description: ' + error.message)
      })

  }

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
        <StyledCard title={<Title level={4}>GENERAR CONTRATO EMPLEADO</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <Controller
                  name="empleado"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Empleado es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Empleado">
                      <Spin
                        spinning={loader}
                        indicator={<LoadingOutlined spin />}
                      >
                        <Select
                          {...field}
                          showSearch
                          allowClear
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
                          options={selectEmpleado}
                          status={error && "error"}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <StyledFormItem label=" ">
                  <Button
                    type="primary"
                    block
                    htmlType="submit">
                    Generar Contrato
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
