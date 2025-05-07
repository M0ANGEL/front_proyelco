import { useEffect, useState } from "react"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form"
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd"
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Incapacidad } from "@/services/types"
import { Link, useNavigate, useParams } from "react-router-dom"
import { DatosBasicos } from "../../components"
import useSerialize from "@/modules/common/hooks/useUpperCase"
import { Notification } from "@/modules/auth/pages/LoginPage/types"
import { crearIncapacidad, getIncapacidad, updateIncapacidad } from "@/services/gestion-humana/incapacidadesAPI"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage"
import { KEY_ROL } from "@/config/api"

const { Text } = Typography

export const FormIncapacidades = () => {
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification()
  const [loaderSave, setLoaderSave] = useState<boolean>(true)
  const control = useForm()
  const [incapacidad, setIncapacidad] = useState<Incapacidad>()
  const { transformToUpperCase } = useSerialize()
  const navigate = useNavigate()
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)

  useEffect(() => {
    if (id) {
      getIncapacidad(id).then(({ data }) => {
        setIncapacidad(data);
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
    data = transformToUpperCase(data, ["nombre"]);
    const formData = new FormData();

    // Agregar los campos del formulario al FormData
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_fin", data.fecha_fin);
    formData.append("empleado", data.empleado);
    formData.append("salario", data.salario);
    formData.append("sexo", data.sexo);
    formData.append("origen", data.origen);
    formData.append("diagnostico", data.diagnostico || "");
    formData.append("mesInicio", data.mesInicio);
    formData.append("radicado", data.radicado || "");
    formData.append("pagada", data.pagada);
    formData.append("pagado_valor", data.pagado_valor || "");
    formData.append("fecha_pago", data.fecha_pago || "");
    formData.append("valor", data.valor || "");
    formData.append("observacion", data.observacion || "");

    if (data.documento && data.documento.length > 0) {
      formData.append("documento", data.documento[0]);
    }

    if (data.trascrito && data.trascrito.length > 0) {
      formData.append("trascrito", data.trascrito[0]);
    }

    if (data.constancia && data.constancia.length > 0) {
      formData.append("constancia", data.constancia[0]);
    }
    
    // Agregar el archivo al FormData si existe
    // data.documento?.forEach((file: any) => {
    //   formData.append("documento", file.originFileObj);
    // });

    // if (data.documento?.file?.originFileObj) {
    //   formData.append("documento", data.documento.file.originFileObj);
    // }

    if (incapacidad) {
      updateIncapacidad(formData, id).then(() => {
        pushNotification({ title: "Incapacidad actualizada con exito!" });
        setTimeout(() => {
          navigate("..")
        }, 800);
        setLoaderSave(false);
      });
    } else {
      crearIncapacidad(formData).then(() => {
        pushNotification({ title: "Incapacidad creada con exito!" });
        setTimeout(() => {
          navigate(-1)
        }, 800)
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
              title={(incapacidad ? "Editar" : "Crear") + " Incapacidad o licencia"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar', 'gh_bienestar', 'administrador'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {incapacidad ? (
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
                        incapacidad={incapacidad}
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