import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd"
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CajaCompensacion } from "@/services/types"
import { DatosBasicos } from "../../components"
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import { crearCajaCompensacion, getCajaCompensacion, updateCajaCompensacion } from "@/services/gestion-humana/cajacompensacionAPI"
import useSerialize from "@/modules/common/hooks/useUpperCase"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage"
import { KEY_ROL } from "@/config/api"

const { Text } = Typography;

export const FormCajaCompensacion = () => {

  const { id } = useParams<{ id: string }>()
  const [api, contextHolder] = notification.useNotification()
  const [loaderSave, setLoaderSave] = useState<boolean>(false)
  const [cajaCompensacion, setCajaCompensacion] = useState<CajaCompensacion>()
  const { transformToUpperCase } = useSerialize()
  const control = useForm()
  const navigate = useNavigate()
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id) {
      getCajaCompensacion(id).then(({ data }) => {
        setCajaCompensacion(data);
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
    data = transformToUpperCase(data, ["nombre"])

    setLoaderSave(true);
    if (cajaCompensacion) {
      updateCajaCompensacion(data, id).then(() => {
        pushNotification({ title: "Caja de compensación actualizada con exito!" });
        setTimeout(() => {
          navigate("..")
        }, 800);
      })
    } else {
      crearCajaCompensacion(data).then(() => {
        pushNotification({ title: "Caja compensación creado con exito!" });
        setTimeout(() => {
          navigate(-1);
        }, 800);
      })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
          })
          setLoaderSave(false);
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
              title={(cajaCompensacion ? "Editar" : "Crear") + " Caja de compensación"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {cajaCompensacion ? (
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
                        cajaCompensacion={cajaCompensacion}
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