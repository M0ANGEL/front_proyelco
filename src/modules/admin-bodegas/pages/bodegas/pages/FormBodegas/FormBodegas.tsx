/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { DatosBasicos } from "../../components";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Bodega, Empresa, Localidades } from "@/services/types";
import { Link } from "react-router-dom";
import { getEmpresas } from "@/services/maestras/empresasAPI";
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
import {
  crearBodega,
  getBodega,
  updateBodega,
} from "@/services/maestras/bodegasAPI";
import { getLocalidades } from "@/services/maestras/localidadesAPI";
import useSerialize from "@/modules/common/hooks/useUpperCase";

const { Text } = Typography;

export const FormBodegas = () => {
  const { id } = useParams<{ id: string }>();
  const [bodega, setBodega] = useState<Bodega>();
  const [empresas, setEmpresas] = useState<Empresa[]>();
  const [localidades, setLocalidades] = useState<Localidades[]>();
  const [loaderSave, setLoaderSave] = useState<boolean>(true);
  const [api, contextHolder] = notification.useNotification();
  const { transformToUpperCase } = useSerialize();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    if (id) {
      getBodega(id ?? "")
        .then(({ data: { data } }) => {
          setBodega(data);
          getEmpresas().then(({ data: { data } }) => {
            setEmpresas(data);
            setLoaderSave(false);
          });
          getLocalidades().then(({ data: { data } }) => {
            setLocalidades(data);
          });
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
      getEmpresas().then(({ data: { data } }) => {
        setEmpresas(data);
        setLoaderSave(false);
      });
      getLocalidades().then(({ data: { data } }) => {
        setLocalidades(data);
      });
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
    data = transformToUpperCase(data, [
      "bod_nombre",
      "prefijo",
      "bod_cencosto",
    ]);

    setLoaderSave(true);
    if (bodega) {
      updateBodega(data, id).then(() => {
        pushNotification({ title: "Bodega actualizada con exito!" });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearBodega(data)
        .then(() => {
          pushNotification({ title: "Bodega creada con exito!" });
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
              title={(bodega ? "Editar" : "Crear") + " bodega"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {bodega ? (
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
                        Datos Basicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        bodega={bodega}
                        empresas={empresas}
                        localidades={localidades}
                      />
                    ),
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
