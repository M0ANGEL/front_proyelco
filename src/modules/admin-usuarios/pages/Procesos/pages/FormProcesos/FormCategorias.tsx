import { useEffect, useState } from "react"
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd"
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import {  TkProcesos } from "@/services/types"
import { DatosBasicos } from "../components/DatosBasicos"
import useSerialize from "@/modules/common/hooks/useUpperCase"
import { crearTkProceso, getTkProceso, updateTkProceso } from "@/services/tickets/procesosAPI"

const { Text } = Typography

export const FormProcesos = () => {

  const [api, contextHolder] = notification.useNotification()
  const [loaderSave, setLoaderSave] = useState<boolean>(false)
  const control = useForm();
  const [procesos, setProcesos] = useState<TkProcesos>()
  const { transformToUpperCase } = useSerialize()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()


  useEffect(() => {
    //si hay un id ejecutamos una consulta para traer datos de esa categoria
    if (id) {
      getTkProceso(id).then(({ data }) => {
        setProcesos(data);        
        setLoaderSave(false);
      });
    } else {
      setLoaderSave(false);
    }
  }, [])

  //notificacion de los estados
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

  //guardado de los datos
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nombre"])
    
    setLoaderSave(true);
    if (procesos) {
      updateTkProceso(data, id).then(() => {
        pushNotification({ title: "Proceso actualizada con exito!" });
        setTimeout(() => {
          navigate("..")
        }, 800)
      })
    } else {
      crearTkProceso(data).then(() => {        
        pushNotification({ title: "Proceso creada con exito!" });
        setTimeout(() => {
          navigate(-1)
        }, 800)
      }).catch((error) => {        
        pushNotification({
          type: "error",
          title: error.error,
          description: error.message,
        })
        setLoaderSave(false)
      })
    }
  }


  //retorno ed la vista
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
              title={(procesos ? "Editar" : "Crear") + " Proceso"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} /* disabled={!['admin'].includes(user_rol)} */>
                    Guardar
                  </Button>

                  {procesos ? (
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
                      /* campos de input datos basicos */
                      <DatosBasicos
                      procesos={procesos}
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