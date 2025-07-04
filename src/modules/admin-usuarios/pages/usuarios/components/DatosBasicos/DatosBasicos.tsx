/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  validarUsuario,
} from "@/services/maestras/maestrasAPI";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Usuario } from "../../types";
import {
  Typography,
  Select,
  Input,
  Col,
  Row,
} from "antd";

const { Text } = Typography;

interface Props {
  usuario?: Usuario;
}

export const DatosBasicos = ({ usuario }: Props) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [timer, setTimer] = useState<any>(null);
  const methods = useFormContext();

  useEffect(() => {
    methods.setValue("rol", methods.watch("rol"));
  }, [methods.watch("rol")]);


  useEffect(() => {
    usuario?.user ? setPhoneValue(usuario.user.telefono) : "";

    methods.reset(
      usuario?.user
        ? {
            nombre: usuario.user.nombre,
            cedula: usuario.user.cedula,
            cargo: usuario.user.cargo,
            telefono: usuario.user.telefono,
            rol: usuario.user.rol,
            username: usuario.user.username,
            password: "",
            correo: usuario.user.correo,
          }
        : {
            nombre: null,
            cedula: null,
            cargo: "NA",
            telefono: null,
            rol: null,
            username: null,
            password: "",
            correo: null,
          }
    );
   
  }, [usuario]);

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!usuario) {
      methods.setValue("username", e.target.value);
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        validarUsuario(e.target.value).then(({ data }) => {
          Object.entries(data).length === 0
            ? methods.clearErrors("username")
            : methods.setError("username", {
                message: "Usuario existente, ingresa otro.",
              });
        });
      }, 600);

      setTimer(newTimer);
    }
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("telefono", e.target.value);
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\d*)?$/;
    if (
      reg.test(inputValue) ||
      (inputValue === "" && inputValue.length == 10)
    ) {
      setPhoneValue(inputValue);
      methods.clearErrors("telefono");
    }
  };

  const handleBlurPhone = () => {
    let valueTemp = phoneValue;
    if (phoneValue.charAt(phoneValue.length - 1) === ".") {
      valueTemp = phoneValue.slice(0, -1);
    }
    setPhoneValue(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={12}>
        <Row gutter={[12, 12]}>
          <Col span={24} style={{ width: "100%" }}>
            <Controller
              name="nombre"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Nombre completo es requerido",
                },
                minLength: {
                  value: 10,
                  message: "Nombre completo debe tener mínimo 10 caracteres",
                },
                maxLength: {
                  value: 60,
                  message: "Nombre completo debe tener máximo 60 caracteres",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Nombre completo:">
                  <Input
                    {...field}
                    placeholder="Nombre completo"
                    status={error && "error"}
                    maxLength={60}
                    style={{ textTransform: "uppercase" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="cedula"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Cédula es requerido",
                },
                minLength: {
                  value: 8,
                  message: "La cédula debe tener más de 8 caracteres",
                },
                maxLength: {
                  value: 15,
                  message: "La cédula debe tener hasta 15 caracteres",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Cédula:">
                  <Input
                    {...field}
                    placeholder="Cédula"
                    status={error && "error"}
                    style={{ width: "100%" }}
                    maxLength={10}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="telefono"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Telefono es requerido",
                },
                minLength: {
                  value: 10,
                  message: "El teléfono debe tener 10 caracteres",
                },
                maxLength: {
                  value: 10,
                  message: "El teléfono debe tener 10 caracteres",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Teléfono:">
                  <Input
                    {...field}
                    placeholder="Teléfono"
                    value={phoneValue}
                    onChange={handleChangePhone}
                    onBlur={handleBlurPhone}
                    status={error && "error"}
                    maxLength={10}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={12}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Controller
              name="rol"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Rol es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Rol:">
                  <Select
                    {...field}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toString().toLowerCase())
                    }
                    options={[
                      { value: "Administrador", label: "Administrador" },
                      { value: "Administrador TI", label: "Administrador TI" },
                      { value: "Gerente", label: "Gerente" },
                      { value: "Ingeniero Obra", label: "Ingeniero Obra" },
                      { value: "Encargado Obras", label: "Encargado Obras" },
                      { value: "Directora Proyectos", label: "Directora Proyectos" },
                      { value: "Talento Humano", label: "Talento Humano" },
                    ]}
                    status={error && "error"}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="username"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Nombre de usuario es requerido",
                },
                minLength: {
                  value: 5,
                  message: "El usuario debe tener mas de 5 caracteres",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Nombre de usuario:">
                  <Input
                    {...field}
                    prefix={<UserOutlined style={{ color: "grey" }} />}
                    placeholder="Nombre de usuario"
                    status={error && "error"}
                    disabled={usuario ? true : false}
                    onChange={onUsernameChange}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="correo"
              control={methods.control}
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Ingrese un correo válido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem label="Correo:">
                  <Input
                    {...field}
                    placeholder="Correo"
                    status={error && "error"}
                    maxLength={255}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
            <Controller
              name="password"
              control={methods.control}
              rules={{
                required: {
                  value: usuario?.user ? false : true,
                  message: "Contraseña es requerido",
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener un minimo de 6 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "La contraseña debe tener un máximo de 8 caracteres",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Contraseña:">
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined style={{ color: "grey" }} />}
                    placeholder="Contraseña de usuario"
                    status={error && "error"}
                    autoComplete="off"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
