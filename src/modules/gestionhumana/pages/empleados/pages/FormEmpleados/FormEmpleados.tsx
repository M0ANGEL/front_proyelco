/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DatosBasicos, DatosAfiliaciones, DatosContratos, DatosDotacion, DatosOtrosi } from "../../components";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Empleado } from "@/services/types";
import { crearEmpleado, getEmpleado, updateEmpleado } from "@/services/maestras/empleadosAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormEmpleados = () => {
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [empleado, setEmpleado] = useState<Empleado>();
  const control = useForm();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  
  useEffect(() => {
    if (id) {
      getEmpleado(id).then(({ data }) => {
        setEmpleado(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [id]);

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
    data = transformToUpperCase(data, [
      "nombre", "barrio", "direccion", "contacto_emergencia", "inclusiones_caja", "observacion", "centro_formacion",
      "especialidad_curso", "instituto_formacion"
    ]);
    setLoaderSave(true);
    if (empleado) {
      updateEmpleado(data, id).then(() => {
        pushNotification({ title: "Empleado actualizado con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearEmpleado(data)
        .then(() => {
          pushNotification({ title: "Empleado creado con exito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.response.data.error,
          });
          setLoaderSave(false);
        });
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
            initialValues={empleado ? empleado : {}} 
            autoComplete="off"
          >
            <StyledCard
              title={(empleado ? "Editar" : "Crear") + " Empleado"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar', 'administrador'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {empleado ? (
                    <Link to="../.." relative="path">
                      <Button danger type="primary" icon={<ArrowLeftOutlined />} >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to=".." relative="path">
                      <Button danger type="primary" icon={<ArrowLeftOutlined />} >
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
                    forceRender: true,
                    children: (
                      <DatosBasicos
                      empleado={empleado}
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                       Datos Afiliaciones
                      </Text>
                    ),
                    forceRender: true,
                    children: (
                      <DatosAfiliaciones
                      empleado={empleado}
                      />
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                       Datos Contrato
                      </Text>
                    ),
                    forceRender: true,
                    children: (
                      <DatosContratos
                      empleado={empleado}
                      />
                    ),
                  },
                  {
                    key: "4",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                       Datos Dotación 
                      </Text>
                    ),
                    forceRender: true,
                    children: (
                      <DatosDotacion
                      empleado={empleado}
                      />
                    ),
                  },
                  {
                    key: "5",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                       {empleado ? 'Datos Otrosí' : ''}
                      </Text>
                    ),
                    forceRender: true,
                    disabled: !empleado,
                    children: (
                      <DatosOtrosi
                        empleado={empleado}
                      />
                    ),
                  },
                ]}
                // animated
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};