import { useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd"
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import { DatosBasicos } from "../../components"
import { RhConvenio } from "@/services/types"
import useSerialize from "@/modules/common/hooks/useUpperCase"
import { crearRhConvenio } from "@/services/gestion-humana/rh-conveniosAPI"
import { getRhConvenio, updateRhConvenio } from "@/services/gestion-humana/rh-conveniosAPI"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage"
import { KEY_ROL } from "@/config/api"

const { Text } = Typography

export const FormConvenios = () => {
  const [api, contextHolder] = notification.useNotification()
  const [loaderSave, setLoaderSave] = useState<boolean>(false)
  const control = useForm();
  const [rhConvenio, setRhConvenio] = useState<RhConvenio>()
  const { transformToUpperCase } = useSerialize()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)

  useEffect(() => {
    if (id) {
      getRhConvenio(id).then(({ data }) => {
        setRhConvenio(data);
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
    data = transformToUpperCase(data, ["nombre", "numero_contrato"])
    setLoaderSave(true);

    if (rhConvenio) {
      updateRhConvenio(data, id).then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate("..");
        }, 800);
      })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
          });
          setLoaderSave(false);
        });
    } else {
      crearRhConvenio(data).then(() => {
        pushNotification({ title: "Convenio creado con exito!" });
        setTimeout(() => {
          navigate(-1);
        }, 800);
      })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.error,
            description: error.message,
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
            autoComplete="off"
          >
            <StyledCard
              title={(rhConvenio ? "Editar" : "Crear") + " Convenio"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {rhConvenio ? (
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
                        rhConvenio={rhConvenio}
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

