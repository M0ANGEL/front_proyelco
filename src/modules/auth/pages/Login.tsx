import React, { useState } from "react";
import { Form, Button, Spin, Input, message, Space } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoginRequest } from "../../../types/auth.types";
import { cleanSessions } from "@/services/auth/loguinAPI";

// ================= ESTILOS =================
const Background = styled.div`
  height: 100vh;
  width: 100%;
  background-image: url("./bg1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 6vw;
  @media (max-width: 900px) {
    justify-content: center;
    padding-left: 0;
  }
`;

const LoginWrapper = styled.div`
  width: 380px;
  background: rgba(255, 255, 255, 0.07);
  padding: 40px 35px;
  border-radius: 18px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.25);
  @media (max-width: 480px) {
    width: 90%;
    padding: 30px 25px;
  }
`;

const Logo = styled.img`
  width: 260px;
  display: block;
  margin: 0 auto 25px auto;
`;

const StyledButton = styled(Button)`
  width: 100% !important;
  font-size: 18px !important;
  height: auto !important;
  padding: 10px !important;
  background: #233dff !important;
  color: white !important;
  border: none;
  border-radius: 8px;
  &:hover {
    background: #ffb020 !important;
    color: #fff !important;
  }
  &:disabled {
    background: #9aa0ff !important;
    color: #fff !important;
  }
`;

const StyledInput = styled(Input)`
  font-size: 16px !important;
  padding: 10px 12px !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.85) !important;
`;

const StyledPassword = styled(Input.Password)`
  font-size: 16px !important;
  padding: 10px 12px !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.85) !important;
`;

// ================= COMPONENTE =================
const LoginUnified: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [forceLogout, setForceLogout] = useState(false);
  const [currentUser, setCurrentUser] = useState<LoginRequest | null>(null);
  const [blocking, setBlocking] = useState(false); // bloquear inputs y botón

  const { control, handleSubmit, setError, reset } = useForm<LoginRequest>({
    defaultValues: { username: "", password: "" },
  });

  // ================= FUNCIÓN SUBMIT =================
  const onSubmit = async (values: LoginRequest) => {
    setError("username", { type: "manual", message: "" });
    setError("password", { type: "manual", message: "" });

    try {
      await login(values);
      message.success("Login exitoso");
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Error en el login";
      message.error(msg);

      if (msg.includes("Credenciales incorrectas")) {
        setError("username", {
          type: "manual",
          message: "Usuario o contraseña incorrecta",
        });
        setError("password", {
          type: "manual",
          message: "Usuario o contraseña incorrecta",
        });
      }

      if (msg.includes("sesión activa")) {
        setForceLogout(true);
        setBlocking(true);
        setCurrentUser(values);
      }
    }
  };

  // ================= CERRAR SESIÓN ACTIVA =================
  const handleForceLogout = async () => {
    if (!currentUser) return;
    try {
      await cleanSessions(currentUser); // enviar { username, password } a la API
      message.success(
        "Sesión anterior cerrada, intenta iniciar sesión de nuevo"
      );
      setForceLogout(false);
      setBlocking(false);
      reset();
      setCurrentUser(null);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "No se pudo cerrar la sesión activa"
      );
    }
  };

  const handleCancelForceLogout = () => {
    setForceLogout(false);
    setBlocking(false);
    setCurrentUser(null);
    reset();
  };

  // ================= RENDER =================
  return (
    <Background>
     {/*  <ParticlesBackground /> ANIMACION DE PARTICULAS */}

      <LoginWrapper>
        <Logo src="./logo_dash3.png" alt="logo" />

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* USERNAME */}
          <Controller
            name="username"
            control={control}
            rules={{ required: "Usuario requerido" }}
            render={({ field, fieldState }) => (
              <Form.Item
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <StyledInput
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Usuario"
                  disabled={blocking}
                />
              </Form.Item>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={control}
            rules={{ required: "Contraseña requerida" }}
            render={({ field, fieldState }) => (
              <Form.Item
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <StyledPassword
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  disabled={blocking}
                />
              </Form.Item>
            )}
          />

          <StyledButton htmlType="submit" disabled={isLoading || blocking}>
            {!isLoading ? (
              "Iniciar Sesión"
            ) : (
              <Spin
                indicator={
                  <LoadingOutlined
                    spin
                    style={{ fontSize: 22, color: "white" }}
                  />
                }
              />
            )}
          </StyledButton>

          {forceLogout && (
            <Space style={{ marginTop: 12 }}>
              <Button danger type="primary" onClick={handleForceLogout}>
                Cerrar sesión activa
              </Button>
              <Button onClick={handleCancelForceLogout}>Cancelar</Button>
            </Space>
          )}
        </Form>
      </LoginWrapper>
    </Background>
  );
};

export default LoginUnified;
