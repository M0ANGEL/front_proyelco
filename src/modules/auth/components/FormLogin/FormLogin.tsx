/* eslint-disable react-hooks/exhaustive-deps */
import { LockOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  cleanSessions,
  fetchUserProfile,
  validateLogin,
} from "@/services/auth/authAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { LoginFormInput } from "../../pages/LoginPage/types";
import useToken from "@/modules/common/hooks/useToken";
import { Button, Form, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  LoginButton,
  LoginInput,
  LoginInputPassword,
} from "../../pages/LoginPage/styled";
import { Props } from "./types";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const FormLogin = ({
  spin,
  onPushNotification,
  onFetch,
}: Props) => {
  const navigate = useNavigate();
  const { setSessionVariable, getSessionVariable } = useSessionStorage();
  const [btnCleanTokens, setBtnCleanTokens] = useState<boolean>(false);
  const { control, handleSubmit, getValues } = useForm<LoginFormInput>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { getToken, setToken, removeToken } = useToken();

  useEffect(() => {
    if (
      getToken() &&
      !getSessionVariable(KEY_BODEGA) &&
      !getSessionVariable(KEY_EMPRESA)
    ) {
      onFetch(true);
      fetchUserProfile()
        .then(() => {
          onFetch(false);
          removeToken();
          onPushNotification({
            type: "success",
            title: `Se ha detectado que existe una sesion activa, sin embargo ha sido cerrada automaticamente, por favor continua con el acceso.`,
          });
        })
        .catch(() => {
          onFetch(false);
          removeToken();
        });
    }
  }, []);

  const cerrarSesiones = () => {
    onFetch(true);
    cleanSessions(getValues())
      .then(() => {
        setBtnCleanTokens(false);
        onPushNotification({
          type: "success",
          title: "Se han cerrado todas las sesiones",
        });
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              onPushNotification({
                type: "error",
                title: error,
              });
            }
          } else {
            onPushNotification({
              type: "error",
              title: response.data.message,
            });
          }
        }
      )
      .finally(() => onFetch(false));
  };

  const onFinish: SubmitHandler<LoginFormInput> = async (data) => {
    onFetch(true);
    await validateLogin(data)
      .then(({ data }) => {
        setBtnCleanTokens(false);
        if (data.token) {
          setToken(data.token);
          fetchUserProfile()
            .then(({ data }) => {
              setSessionVariable(KEY_ROL, data.userData.rol);
              // Guardar valores por defecto
              setSessionVariable(KEY_EMPRESA, "1");
              setSessionVariable(KEY_BODEGA, "1");
              // Redirigir directamente al dashboard
              navigate('/dashboard');
              onFetch(false);
            })
            .catch((error) => {
              onPushNotification({
                type: "error",
                title: error.code,
                description: error.response.data.message,
              });
              onFetch(false);
            });
        } else {
          onPushNotification({
            type: "error",
            title: "Credenciales incorrectas",
          });
          onFetch(false);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          setBtnCleanTokens(true);
        }
        onPushNotification({
          type: "error",
          title: error.code,
          description: error.response.data.message,
        });
        onFetch(false);
      });
  };
  return (
    <>
      <Form
        initialValues={{ remember: true }}
        onFinish={handleSubmit(onFinish)}
        size="large"
      >
        <Controller
          name="username"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Nombre de usuario es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Form.Item>
              <LoginInput
                {...field}
                prefix={<UserOutlined />}
                placeholder="username"
                status={error && "error"}
                readOnly={spin}
              />
              <Text type="danger">{error?.message}</Text>
            </Form.Item>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Contraseña es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Form.Item>
              <LoginInputPassword
                {...field}
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                status={error && "error"}
                readOnly={spin}
              />
              <Text type="danger">{error?.message}</Text>
            </Form.Item>
          )}
        />
        <Form.Item>
          <LoginButton block size={"large"} htmlType="submit" disabled={spin}>
            {!spin ? (
              <>Iniciar Sesion</>
            ) : (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 26, color: "white" }}
                    spin
                  />
                }
              />
            )}
          </LoginButton>
        </Form.Item>
        {btnCleanTokens ? (
          <Button type="link" danger block onClick={() => cerrarSesiones()}>
            Cerrar sesiones activas
          </Button>
        ) : null}
      </Form>
    </>
  );
};
