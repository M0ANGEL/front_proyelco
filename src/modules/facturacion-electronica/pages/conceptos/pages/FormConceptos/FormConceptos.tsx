/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { ConceptoFact } from "@/services/types";
import { Link } from "react-router-dom";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Space,
  Spin,
  Tabs,
  Typography,
  notification,
} from "antd";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { crearConceptoFact, getConceptoFact, updateConceptoFact } from "@/services/facturacion/conceptosFactAPI";

const { Text } = Typography;

export const FormConceptos = () => {
  const { id } = useParams<{ id: string }>();
  const [concepto, setConcepto] = useState<ConceptoFact>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getConceptoFact(id ?? "")
        .then(({ data: { data } }) => {
          setConcepto(data);

          setLoaderSave(false);
        })
        .catch((error) => {
          pushNotification({
            type: "error",
            title: error.code,
            description: error.message,
          });
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
    data = transformToUpperCase(data, ["descripcion"]);
    setLoaderSave(true);
    if (concepto) {
      updateConceptoFact(data, id).then(() => {
        pushNotification({ title: "Concepto actualizado con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearConceptoFact(data)
        .then(() => {
          pushNotification({ title: "Concepto creado con exito!" });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response: {
              data: { errors },
            },
          }) => {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              pushNotification({
                type: "error",
                title: error,
              });
            }

            setLoaderSave(false);
          }
        );
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
              title={(concepto ? "Editar" : "Crear") + " concepto"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {concepto ? (
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
                        Datos Básicos
                      </Text>
                    ),
                    children: <DatosBasicos concepto={concepto} />,
                  },
                ]}
                animated
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
