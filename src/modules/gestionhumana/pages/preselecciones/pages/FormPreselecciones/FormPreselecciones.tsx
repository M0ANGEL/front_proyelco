import { useEffect, useState } from "react";
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd"
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Preseleccion } from "@/services/types"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Link, useNavigate, useParams } from "react-router-dom"
import { DatosBasicos } from "../../components"
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import useSerialize from "@/modules/common/hooks/useUpperCase"
import { getPreseleccion, crearPreselecciones, updatePreseleccion} from "@/services/gestion-humana/preseleccionesAPI"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography

export const FormPreselecciones = () => {

  const { id } = useParams<{ id: string }>()
  const [loaderSave, setLoaderSave] = useState<boolean>(true)
  const [api, contextHolder] = notification.useNotification()
  const control = useForm()
  const [preseleccion, setPreseleccion] = useState<Preseleccion>()
  const { transformToUpperCase } = useSerialize()
  const navigate = useNavigate()
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
    })
  }

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoaderSave(true);
    data = transformToUpperCase(data, ["nombre"])
    if (preseleccion) {
      updatePreseleccion(data, id).then(() => {
        pushNotification({ title: "Preselección actualizada con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearPreselecciones(data).then(() => {
          pushNotification({ title: "Preselección registrada correctamente!" });
          setTimeout(() => {
            navigate(-1)
          }, 800);
          setLoaderSave(false)
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
          });
          setLoaderSave(false)
        })
    }
  }

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
              title={(preseleccion ? "Editar" : "Crear") + " Preselección"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {preseleccion ? (
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
                        Datos Basicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                      preseleccion={preseleccion}
                      />
                    ),
                  },
                ]}
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  )
}