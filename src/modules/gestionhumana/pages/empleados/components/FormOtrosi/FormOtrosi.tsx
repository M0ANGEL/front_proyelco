import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import dayjs from "dayjs";
import { getRhConvenios } from "@/services/gestion-humana/rh-conveniosAPI";
import { getCargos } from "@/services/maestras/cargosAPI";
import { getContratosLaborales } from "@/services/gestion-humana/contratosLaboralesAPI";
import { Otrosi } from "@/services/types";
import { getOtrosi, updateOtrosi } from "@/services/gestion-humana/otrosiAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const FormOtrosi = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState(true);
  const control = useForm();
  const [selectCargos, setSelectCargos] = useState<SelectProps["options"]>([]);
  const [selectConvenio, setSelectConvenio] = useState<SelectProps["options"]>(
    []
  );
  const [selectContrato, setSelectContrato] = useState<SelectProps["options"]>(
    []
  );
  const { id_otrosi } = useParams<{ id_otrosi: string }>();
  const [otrosi, setOtrosi] = useState<Otrosi>();
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id_otrosi) {
      getOtrosi(id_otrosi).then(({ data }) => {
        setOtrosi(data);
        setLoaderSave(false);
      });
    }
  }, [id_otrosi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutar todas las peticiones en paralelo
        const [cargos, convenios, contratos] = await Promise.all([
          getCargos(),
          getRhConvenios(),
          getContratosLaborales(),
        ]);

        // Mapear y setear los valores de cada respuesta
        setSelectCargos(
          cargos.data.data.map((item) => ({
            label: item.nombre,
            value: item.id.toString(),
          }))
        );
        setSelectConvenio(
          convenios.data.data.map((item) => ({
            label: item.nombre_convenio + "-" + item.numero_contrato,
            value: item.id.toString(),
          }))
        );
        setSelectContrato(
          contratos.data.data.map((item) => ({
            label: item.nombre,
            value: item.id.toString(),
          }))
        );
      } catch (error: any) {
        console.log("Error: ", error);
        if (error.response) {
          console.error("Error en la respuesta: ", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud: ", error.request);
        } else {
          console.error("Error en el setup de la petición: ", error.message);
        }
      } finally {
        setLoaderSave(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (otrosi) {
      control.setValue("contrato", otrosi?.contrato_laborale_id);
      control.setValue("convenio", otrosi?.rh_convenio_id);
      control.setValue("cargo", otrosi?.cargo_id);
      control.setValue("salario", parseInt(otrosi?.salario));
      control.setValue("fecha_otrosi", dayjs(otrosi?.fecha_otrosi));
      control.setValue("old_convenio", otrosi?.old_rh_convenio_id)
      control.setValue("old_contrato", otrosi?.old_contrato_laborale_id);
      control.setValue("old_cargo", otrosi?.old_cargo_id);
      control.setValue("old_salario", parseInt(otrosi?.old_salario));
    }
  }, [otrosi]);

  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
      placement: "bottomRight",
    });
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);

    updateOtrosi(data, id_otrosi)
      .then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate(-1);
        }, 800);
        setLoaderSave(false);
      })
      .catch((error) => {
        pushNotification({
          type: "error",
          title: error.error,
          description: error.message,
        });
        setLoaderSave(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loaderSave}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={"EDITAR" + " OTROSI"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!['gh_admin', 'gh_auxiliar', 'administrador'].includes(user_rol)}
                  >
                    Guardar
                  </Button>
                  <Link to="../.." relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Volver
                    </Button>
                  </Link>
                </Space>
              }
            >
              {Object.keys(control.formState.errors).length > 0 ? (
                <Text type="danger">
                  Faltan campos por diligenciar o existen algunos errores
                </Text>
              ) : null}

              <Row gutter={24}>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="convenio"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Convenio es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Convenio">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectConvenio}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="contrato"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Contrato es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Contrato">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectContrato}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="cargo"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cargo es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cargo">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectCargos}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="salario"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Salario es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Salario">
                        <Input
                          {...field}
                          placeholder="$"
                          status={error && "error"}
                          type="text"
                          maxLength={12}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d*$/.test(value)) {
                              // Permite solo dígitos
                              field.onChange(value); // Llama a onChange solo si es numérico
                            }
                          }}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="old_convenio"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Convenio anterior es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Convenio anterior">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectConvenio}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="old_contrato"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Contrato anterior es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Contrato anterior">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectContrato}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="old_cargo"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cargo anterior es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cargo anterior">
                        <Spin
                          spinning={loaderSave}
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
                                  (optionB?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                )
                            }
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={selectCargos}
                            status={error && "error"}
                          />
                        </Spin>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="old_salario"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Salario anterior es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Salario anterior">
                        <Input
                          {...field}
                          placeholder="$"
                          status={error && "error"}
                          type="text"
                          maxLength={12}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d*$/.test(value)) {
                              // Permite solo dígitos
                              field.onChange(value); // Llama a onChange solo si es numérico
                            }
                          }}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <Controller
                    name="fecha_otrosi"
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Fecha otrosí es requerido",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Fecha otrosí">
                        <DatePicker
                          {...field}
                          status={error && "error"}
                          style={{ width: "100%" }}
                          format={dateFormat}
                          placeholder="otrosí"
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              </Row>
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
