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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpleados } from "@/services/maestras/empleadosAPI";
import { generarCartasLaborales } from "@/services/gestion-humana/generarContratosAPI";
import { Empleado, Ips } from "@/services/types";
import { index } from "@/services/gestion-humana/ipsAPI";

const { Title, Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const FormCartas = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(true);
  const [loaderIps, setLoaderIps] = useState<boolean>(true);
  const control = useForm();
  const [selectEmpleado, setSelectEmpleado] = useState<SelectProps["options"]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>();
  const [selectCartas, setSelectCartas] = useState<SelectProps["options"]>([]);
  const [tipoCartaSelecionada, setTipoCartaSelecionada] = useState<string>("");
  const [selectIps, setSelectIps] = useState<SelectProps["options"]>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>("");
  const [ips, setIps] = useState<Ips[]>();

  const cartas = [
    { label: "CERTIFICACIÓN APRENDIZAJE", value: "CERTIFICACIÓN APRENDIZAJE" },
    { label: "CARTA ACEPTACIÓN RENUNCIA", value: "CARTA ACEPTACIÓN RENUNCIA" },
    { label: "CERTIFICACIÓN LABORAL", value: "CERTIFICACIÓN LABORAL" },
    { label: "TERMINACIÓN POR PERIODO DE PRUEBA", value: "TERMINACIÓN POR PERIODO DE PRUEBA", },
    { label: "TERMINACIÓN CONTRATO OBRA LABOR", value: "TERMINACIÓN CONTRATO OBRA LABOR" },
  ];

  const fetchIps = () => {

    index().then(({ data: { data } }) => {

      setIps(data);
      setLoaderIps(false);
    }).catch((error) => {
      setLoaderIps(false);
      console.log("error", error);
    });
  }

  useEffect(() => {

    getEmpleados().then(({ data: { data } }) => {
      const options = data.map((item) => {
        return {
          label: `${item.cedula} - ${item.nombre_completo} - ${item.estado === '1' ? 'Activo' : 'Inactivo'}`,
          value: item.id.toString(),
        };
      });
      setSelectEmpleado(options);
      setLoader(false);
      setEmpleados(data);
    }).catch((error) => {
      setLoader(false);
      console.log("error", error);
    });

    fetchIps();
    setSelectCartas(cartas);
  }, []);

  useEffect(() => {

    const empleado = empleados?.find((empleado) => empleado.id == parseInt(empleadoSeleccionado));
    const ipsPorCiudadEmpleado = ips?.filter((ips) => ips.localidade_id == empleado?.ciudadEmpleado);

    const options = ipsPorCiudadEmpleado?.map((item) => {
      return {
        label: item.nombre,
        value: item.id.toString(),
      };
    });
    setSelectIps(options);
  }, [empleados, empleadoSeleccionado, ips])

  const getEmpleadoPorId = (id: number) => {
    return empleados?.find((empleado) => empleado.id === id);
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    const empleado = getEmpleadoPorId(data.empleado);

    if (
      empleado?.contrato_id == "5" &&
      data.tipoCarta != "CERTIFICACIÓN APRENDIZAJE"
    ) {
      api["error"]({
        message: "Error al generar pdf",
        description:
          empleado?.nombre_completo +
          " tiene contrato de aprendizaje debe seleccionar certificación de aprendizaje",
      });
    }

    if (
      empleado?.contrato_id != "5" &&
      data.tipoCarta == "CERTIFICACIÓN APRENDIZAJE"
    ) {
      api["error"]({
        message: "Error al generar pdf",
        description:
          empleado?.nombre_completo +
          " no tiene contrato de aprendizaje debe selecionar otro tipo de documento",
      });
    }

    if (!empleado?.estado && (data.tipoCarta != "CERTIFICACIÓN APRENDIZAJE" || data.tipoCarta != "CERTIFICACIÓN LABORAL")) {
      api["error"]({
        message: "Error al generar pdf",
        description:
          empleado?.nombre_completo +
          " inactivo en el sistema, debe activarlo para generar la carta",
      });
      data = null
    }

    generarCartasLaborales(data)
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        // Crear un enlace temporal para forzar la descarga
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = JSON.parse(data.config.data).tipoCarta + ".pdf"; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click(); // Simular el clic en el enlace para iniciar la descarga
        document.body.removeChild(link); // Eliminar el enlace después de la descarga
        setLoader(false);
      })
      .finally(() => setLoader(false))
      .catch((error) => {
        api["error"]({
          message: "Error al generar pdf",
          description: "Verifique los datos enviados y vuelve a intentarlo.",
        });
        setLoader(false);
        console.log(
          "type: " + error,
          "title: " + error.error + "description: " + error.message
        );
      });
  };

  const addDate = () => {
    if (tipoCartaSelecionada == "CARTA ACEPTACIÓN RENUNCIA") {
      return (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_presentada"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha carta presentada renuncia es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha carta presentada">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha carta presentada renuncia"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_efectiva"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha efectiva es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha efectiva">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha efectiva"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="ips"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "IPS es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="IPS">
                  <Spin spinning={loaderIps} indicator={<LoadingOutlined spin />}>
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
                      options={selectIps}
                      status={error && "error"}
                    />
                  </Spin>
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      );
    }

    if (tipoCartaSelecionada == "TERMINACIÓN CONTRATO OBRA LABOR") {
      return (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_efectiva"
            control={control.control}
            rules={{
              required: {
                value: true,
                message: "Fecha efectiva es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha efectiva">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  format={dateFormat}
                  placeholder="Fecha efectiva"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )
    }

    if (tipoCartaSelecionada == "CARTA VACACIONES" || tipoCartaSelecionada == "CARTA VACACIONES MITA COMPENSADAS") {
      return (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_inicio"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha inicio es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha inicio">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha inicio"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_fin"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha fin es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha fin">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha fin"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_reintegro"
              control={control.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha reintegro es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha reintegro">
                  <DatePicker
                    {...field}
                    status={error && "error"}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    placeholder="Fecha reintegro"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      )
    }
  };

  const addIps = () => {
    if (tipoCartaSelecionada == "TERMINACIÓN POR PERIODO DE PRUEBA" || tipoCartaSelecionada == "TERMINACIÓN CONTRATO OBRA LABOR") {

      return (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ips"
            control={control.control}
            rules={{
              required: {
                value: true,
                message: "IPS es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="IPS">
                <Spin spinning={loaderIps} indicator={<LoadingOutlined spin />}>
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
                    options={selectIps}
                    status={error && "error"}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )
    }
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
        <StyledCard
          title={<Title level={4}>GENERAR CARTAS Y CERTIFICACIONES</Title>}
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
          // onKeyDown={(e: any) => checkKeyDown(e)}
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
                          onChange={(value) => {
                            field.onChange(value); // Actualiza el valor del formulario
                            setEmpleadoSeleccionado(value); // Actualiza el estado con el contrato seleccionado
                          }}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <Controller
                  name="tipoCarta"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo documento es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Tipo documento">
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
                          options={selectCartas}
                          status={error && "error"}
                          onChange={(value) => {
                            field.onChange(value); // Actualiza el valor del formulario
                            setTipoCartaSelecionada(value); // Actualiza el estado con el contrato seleccionado
                            control.setValue('ips', ''); 
                            control.setValue('fecha_fin', '');
                            control.setValue('fecha_efectiva', '');
                            control.setValue('fecha_presentada', '');
                            control.setValue('fecha_reintegro', '');
                            control.setValue('fecha_inicio', '');
                          }}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {addDate()}
              {addIps()}
              <Col xs={24} sm={12} style={{ width: "100%" }}>
                <StyledFormItem label=" ">
                  <Button type="primary" block htmlType="submit">
                    Generar Documento
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
