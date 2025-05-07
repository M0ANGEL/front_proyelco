/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd";
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos, } from "../../components";
import { crearPension, getPension, updatePension } from "@/services/gestion-humana/pensionesAPI";
import { Pension } from "@/services/types";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { Text } = Typography;

export const FormPensiones = () => {
  const { id } = useParams<{ id: string }>();
  const control = useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false);
  const [pension, setPension] = useState<Pension>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    if (id) {
      getPension(id).then(({ data }) => {
        setPension(data);
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
    // setLoaderSave(true);
    data = transformToUpperCase(data, ["nombre"]);
    if (pension) {
      updatePension(data, id).then(() => {
        pushNotification({ title: "Pensión actualizada con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearPension(data).then(() => {
          pushNotification({ title: "Pensión creado con exito!" });
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
              title={(pension ? "Editar" : "Crear") + " Fondo de pensión"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {pension ? (
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
                      pension={pension}
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