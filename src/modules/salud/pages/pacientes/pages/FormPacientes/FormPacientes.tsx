/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { useNavigate, useParams } from "react-router";
import { DatosBasicos } from "../../components";
import { useState, useEffect } from "react";
import { Paciente } from "@/services/types";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  notification,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
} from "antd";
import {
  updatePaciente,
  crearPaciente,
  getPaciente,
} from "@/services/maestras/pacientesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormPacientes = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [paciente, setPaciente] = useState<Paciente>();
  const { transformToUpperCase } = useSerialize();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();
  const [alertaButton, setAlertaButton] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id) {
      getPaciente(id ?? "")
        .then(({ data: { data } }) => {
          setPaciente(data);
          setLoaderSave(false);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
          setLoaderSave(false);
        });
    } else {
      setLoaderSave(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  const pushNotification = ({
    type = "success",
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, [
      "nombre_primero",
      "nombre_segundo",
      "apellido_primero",
      "apellido_segundo",
      "eps",
    ]);
    setLoaderSave(true);
    if (paciente) {
      updatePaciente(data, id)
        .then(() => {
          pushNotification({ title: "Paciente actualizado con éxito!" });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                pushNotification({
                  type: "error",
                  title: error,
                });
              }
            } else {
              if (response.data.code == "23000") {
                pushNotification({
                  type: "error",
                  title:
                    "Ya existe un paciente con esta combinación de tipo y número de documento",
                });
              } else {
                pushNotification({
                  type: "error",
                  title: response.data.message,
                });
              }
            }
            setLoaderSave(false);
          }
        );
    } else {
      crearPaciente(data)
        .then(() => {
          pushNotification({ title: "Paciente creado con éxito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores: string[] = Object.values(errors);
              for (const error of errores) {
                pushNotification({
                  type: "error",
                  title: error,
                });
              }
            } else {
              if (response.data.code == "23000") {
                pushNotification({
                  type: "error",
                  title:
                    "Ya existe un paciente con esta combinación de tipo y número de documento",
                });
              } else {
                pushNotification({
                  type: "error",
                  title: response.data.message,
                });
              }
            }
            setLoaderSave(false);
          }
        );
    }
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
              title={(paciente ? "Editar" : "Crear") + " paciente"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={
                      user_rol == "regente_farmacia" ? false : alertaButton
                    }
                  >
                    Guardar
                  </Button>

                  {paciente ? (
                    <Link to="../.." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to=".." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  )}
                </Space>
              }
            >
              {Object.keys(control.formState.errors).length > 0 ? (
                <Text type="danger">
                  Faltan campos por diligenciar o existen algunos errores
                </Text>
              ) : null}
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Datos Básicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        paciente={paciente}
                        hasFuente={hasFuente}
                        // alertaButton={alertaButton}
                        setAlertaButton={setAlertaButton}
                      />
                    ),
                  },
                ]}
                animated
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
