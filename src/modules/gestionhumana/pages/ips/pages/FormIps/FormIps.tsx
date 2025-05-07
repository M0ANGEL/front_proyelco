import { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd";
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { DatosBasicos } from "../../components";
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import { Ips } from "@/services/types";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { store, edit, update } from "@/services/gestion-humana/ipsAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormIps = () => {
  const [api, contextHolder] = notification.useNotification()
  const { transformToUpperCase } = useSerialize()
  const control = useForm()
  const navigate = useNavigate()
  const [loader, setLoader] = useState<boolean>(true)
  const [ips, setIps] = useState<Ips>()
  const { id } = useParams<{ id: string }>()
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)
  
  useEffect(() => {
    if (id) {
      edit(id).then(({ data }) => {
        setIps(data)
        setLoader(false)
      })
    } else {
      setLoader(false)
    }
  }, [])
  
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
    setLoader(true);
    if (ips) {
      update(data, id).then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate("..")
        }, 800)
      })
    } else {
      store(data).then((res) => {
        pushNotification({ title: res.data.message });
        setTimeout(() => {
          navigate(-1)
        }, 800)
      }).catch((error) => {
        pushNotification({
          type: "error",
          title: error.error,
          description: error.message,
        })
        setLoader(false)
      })
    }
  }

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loader}
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
              title={(ips ? "Editar" : "Crear") + " IPS"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {ips ? (
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
                        ips={ips}
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
  );
};
