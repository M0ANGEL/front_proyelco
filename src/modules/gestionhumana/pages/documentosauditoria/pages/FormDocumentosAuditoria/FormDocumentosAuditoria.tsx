import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, notification, Space, Spin, Tabs, Typography } from "antd";
import { LoadingOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { DocumentosAuditoriaGH } from "@/services/types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import { DatosBasicos } from "../../components/DatosBasicos";
import { crearDocumentoAuditoria } from "@/services/gestion-humana/documentoAuditoriaAPI";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { getDocumentoAuditoria, updateDocumentoAuditoria } from "@/services/gestion-humana/documentoAuditoriaAPI";

const { Text } = Typography;

export const FormDocumentosAuditoria = () => {
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification();
  const [loaderSave, setLoaderSave] = useState<boolean>(false)
  const control = useForm();
  const [documentoAuditoria, setDocumentoAuditoria] = useState<DocumentosAuditoriaGH>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const navigate = useNavigate();

  useEffect(() => {
      if (id) {
        getDocumentoAuditoria(id).then(({ data }) => {
          setDocumentoAuditoria(data);
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
      if (documentoAuditoria) {
        updateDocumentoAuditoria(data, id).then((res) => {
          pushNotification({ title: "Cesantia actualizada con exito!" });
          setTimeout(() => {
            navigate("..");
          }, 800);
        });
      } else {
        crearDocumentoAuditoria(data).then(($res) => {
          console.log("Auditoria", $res);
            pushNotification({ title: $res.data.message });
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
              title={(documentoAuditoria ? "Editar" : "Crear") + " Pie de página auditoria documento"}
              extra={
                <Space>
                  <Button htmlType="submit" type="primary" icon={<SaveOutlined />} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
                    Guardar
                  </Button>

                  {documentoAuditoria ? (
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
                        Datos Básicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        documentosAuditoria={documentoAuditoria}
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
}
