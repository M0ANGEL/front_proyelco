import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  notification,
  SelectProps,
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
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components/DatosBasicos";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { crearIngresoDotacion } from "@/services/gestion-humana/dotacionesAPI";
import { getDotaciones } from "@/services/gestion-humana/dotacionesAPI";

const { Text } = Typography;

export const FormIngresoDotacion = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const control = useForm();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const [selectDotacion, setSelectDotacion] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { data: { data } } = await getDotaciones();
        const options = data.map((item) => ({
          label: `${item.tipo}-${item.talla}`,
          value: item.id.toString(),
        }));
        setSelectDotacion(options);

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
        // setLoader(false);
      }
    };

    fetchData();
  }, []);

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
    data = transformToUpperCase(data, ["tipo", "talla"]);
    setLoaderSave(true);

      crearIngresoDotacion(data)
        .then((res) => {
          pushNotification({ title: res.data.message });
          setTimeout(() => {
            navigate(1);
          }, 800);
          setLoaderSave(false);
          control.reset();
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
              title={"REALIZAR INGRESOS DE DOTACIÓN"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!["gh_admin", "gh_bienestar", "administrador"].includes(user_rol)}
                  >
                    Guardar
                  </Button>
                  <Link to="/gestionhumana/dotaciones/dotacion" relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Dotaciones
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
                    children: <DatosBasicos selectDotacion={selectDotacion}/>,
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
