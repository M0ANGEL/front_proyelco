import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmpleadoDotacion } from "@/services/types";
import { getDotacionEmpleado } from "@/services/gestion-humana/dotacionesAPI";
import {
  Button,
  Form,
  notification,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { DatosBasicos } from "../../components/DatosBasicos";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { updateDotacionEmpleado } from "@/services/gestion-humana/dotacionesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;
export const FormEmpleadosDotaciones = () => {
  const { id } = useParams<{ id: string }>();
  const [empleado, setEmpleado] = useState<EmpleadoDotacion>();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const control = useForm();
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_role = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id) {
      getDotacionEmpleado(id).then(({ data }) => {
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
    setLoaderSave(true);

    if (empleado) {
        updateDotacionEmpleado(data, id).then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate("..");
        }, 800);
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
            autoComplete="off"
          >
            <StyledCard
              title={(empleado ? "Editar" : "Crear") + "Editar Tallas de empleado"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!['gh_admin', 'gh_bienestar', 'administrador'].includes(user_role)}
                  >
                    Guardar
                  </Button>

                  {empleado ? (
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
                        Datos Basicos
                      </Text>
                    ),
                    children: <DatosBasicos empleado={empleado} />,
                  },
                ]}
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
