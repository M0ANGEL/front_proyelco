/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { cambiarContrasena } from "@/services/dashboard/usuarioPerfil";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { fetchUserProfile, logout } from "@/services/auth/authAPI";
import useToken from "@/modules/common/hooks/useToken";
import { BASE_URL, FILES_URL, KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { UploadOutlined } from "@ant-design/icons";
import { AuthRoutesList } from "@/modules/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bodega, Cargo, Empresa, UserData } from "@/services/types";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  Upload,
  UploadProps,
  notification,
} from "antd";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

const { Text, Title } = Typography;

export const PerfilPage = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>();
  const [imageProfile, setImageProfile] = useState<string>();
  const [api, contextHolder] = notification.useNotification();
  const [modal, contextModal] = Modal.useModal();
  const { removeToken } = useToken();
  const navigate = useNavigate();
  const [bodegaInf, setBodegaInf] = useState<Bodega>();
  const [cargoInf, setCargoInf] = useState<Cargo>();
  const { getSessionVariable } = useSessionStorage();
  const {
    control,
    setError,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
    reset,
  } = useForm();
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("password_confirmation", e.target.value);
    if (e.target.value != getValues("password")) {
      setError("password_confirmation", {
        message: "Contraseñas no coinciden",
      });
    } else {
      clearErrors("password_confirmation");
    }
  };

  useEffect(() => {
    fetchUserProfile()
      .then(({ data }) => {
        setUser(data.userData);
        setBodegaInf(
          data.userData.bodega.find(
            (element) => element.id.toString() == getSessionVariable(KEY_BODEGA)
          )
        );
        setCargoInf(
          data.userData.cargos.find(
            (element) => element.id_empresa == getSessionVariable(KEY_EMPRESA)
          )
        );
        if (data.userData.image.includes("default")) {
          setImageProfile("./default.png");
        } else {
          setImageProfile(`${FILES_URL}${data.userData.image}`);
        }
      })
      .catch((error) => {
        api["error"]({
          message: error.error,
          placement: "bottomRight",
        });
      });
  }, []);

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    cambiarContrasena(data, user?.id)
      .then(({ data }) => {
        api["success"]({
          message: data.message,
          placement: "bottomRight",
        });
        reset();
        logout().then(() => {
          modal.warning({
            title: "Sesion cerrada",
            keyboard: false,
            icon: <ExclamationCircleOutlined />,
            content:
              "Se ha cerrado la sesión ya que se hizo un cambio de contraseña, por favor vuelve a ingresar.",
            onOk: () => {
              removeToken();
              setTimeout(() => {
                navigate(`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`);
              }, 200);
            },
          });
        });
      })
      .catch((error) => {
        const response = error.response.data;
        api["error"]({
          message: response.error,
          placement: "bottomRight",
        });
        setLoader(false);
      });
  };
  const props: UploadProps = {
    name: "image",
    action: `${BASE_URL}usuarios/perfiles/imagen`,
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: "image/png, image/jpeg, image/jpg",
    beforeUpload(file) {
      // console.log(file.size);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        api["error"]({
          message: "Imagen no puede ser mayor a 2MB!",
          placement: "bottomRight",
        });
      }

      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        api["error"]({
          message: "Solo se admiten los formatos .png .jpg y .jpeg",
          placement: "bottomRight",
        });
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        // console.log(info.file, info.fileList);
        setImageProfile(`${FILES_URL}${info.file.response.data}`);
      } else if (info.file.status === "error") {
        api["error"]({
          message: info.file.response.data.error,
          placement: "bottomRight",
        });
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      {contextModal}
      {contextHolder}
      <StyledCard title={"Editar perfil"}>
        <Row gutter={24}>
          <Col xs={24} md={6}>
            <Space direction="vertical" align="center">
              <Image
                src={imageProfile}
                preview={false}
                style={{
                  border: "1px solid rgb(217 217 217)",
                  borderRadius: "5px",
                  height: "140px",
                }}
              />
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Subir imagen</Button>
              </Upload>
            </Space>
          </Col>
          <Col xs={24} md={9}>
            <Space direction="vertical" align="center">
              <Title level={3}>{user?.nombre}</Title>
              <Text>Identificación : {user?.cedula}</Text>
              <Text>Cargo : {cargoInf?.descripcion}</Text>
              <Text>Bodega : {bodegaInf?.bod_nombre}</Text>
              <Text>
                Último login:{" "}
                <Text type="success" code>
                  {user?.last_login
                    .toString()
                    .slice(0, user?.last_login.toString().length - 4)}
                </Text>
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={9}>
            <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
              <Form
                layout="vertical"
                title="Cambio de contraseña"
                onFinish={handleSubmit(onFinish)}
              >
                <Controller
                  name="current_password"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Contraseña actual es requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item label="Contraseña actual:">
                      <Input.Password
                        {...field}
                        placeholder="Contraseña actual"
                        status={error && "error"}
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
                      message: "Contraseña es requerido",
                    },

                    minLength: {
                      value: 6,
                      message:
                        "La contraseña debe tener un minimo de 6 caracteres",
                    },
                    maxLength: {
                      value: 8,
                      message:
                        "La contraseña debe tener un máximo de 8 caracteres",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item label="Nueva contraseña">
                      <Input.Password
                        {...field}
                        placeholder="Contraseña"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </Form.Item>
                  )}
                />
                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Confirmacion de contraseña es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item label="Confirmar contraseña">
                      <Input.Password
                        {...field}
                        placeholder="Confirmar contraseña"
                        status={error && "error"}
                        onChange={handleChangePassword}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </Form.Item>
                  )}
                />
                <Form.Item>
                  <Space direction="horizontal">
                    <Button htmlType="submit" type="primary">
                      Cambiar
                    </Button>
                    <Button onClick={() => reset()}>Reset</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Spin>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
