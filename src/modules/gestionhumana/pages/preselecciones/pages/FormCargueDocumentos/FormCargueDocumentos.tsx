import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Preseleccion } from "@/services/types";
import { CargueDocumentos } from "../../components/CargueDocumentos";
import {
  getPreseleccion,
  uploadSoportesPreseleccion,
} from "@/services/gestion-humana/preseleccionesAPI";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormCargueDocumentos = () => {
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const control = useForm();
  const [preseleccion, setPreseleccion] = useState<Preseleccion>();
  const navigate = useNavigate();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id) {
      getPreseleccion(id).then(({ data }) => {
        setPreseleccion(data);
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
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
    setLoaderSave(true);

    const formData = new FormData();
    formData.append("documento", data.documento);

    if (data.hv && data.hv.length > 0) {
      formData.append("hv", data.hv[0]);
    }

    if (data.cedula && data.cedula.length > 0) {
      formData.append("cedula", data.cedula[0]);
    }

    if (data.pension && data.pension.length > 0) {
        formData.append("pension", data.pension[0]);
    }

    if (data.cesantia && data.cesantia.length > 0) {
        formData.append("cesantia", data.cesantia[0]);
    }

    if (data.diplomaBachiller && data.diplomaBachiller.length > 0) {
        formData.append("diplomaBachiller", data.diplomaBachiller[0]);
    }

    if (data.titulo && data.titulo.length > 0) {
        formData.append("titulo", data.titulo[0]);
    } 

    if (data.certificadoLaboral1 && data.certificadoLaboral1.length > 0) {
        formData.append("certificadoLaboral1", data.certificadoLaboral1[0]);
    }

    if (data.certificadoLaboral2 && data.certificadoLaboral2.length > 0) {
        formData.append("certificadoLaboral2", data.certificadoLaboral2[0]);
    }

    if (data.foto && data.foto.length > 0) {
        formData.append("foto", data.foto[0]);
    }

    if (data.rethus && data.rethus.length > 0) {
        formData.append("rethus", data.rethus[0]);
    }

    if (data.resolucion && data.resolucion.length > 0) {
        formData.append("resolucion", data.resolucion[0]);
    }


    uploadSoportesPreseleccion(formData)
      .then(() => {
        pushNotification({ title: "Documentos cargados correctamente!" });
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
              title={preseleccion ? "Cargar documentos de Preselección" : null}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}
                  >
                    Cargar Documentos
                  </Button>

                  {preseleccion ? (
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
                        Cargue documentos
                      </Text>
                    ),
                    children: <CargueDocumentos preseleccion={preseleccion} />,
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
