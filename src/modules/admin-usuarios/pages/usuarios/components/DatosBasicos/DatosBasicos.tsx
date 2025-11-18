import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography, Select, Input, Col, Row, Checkbox, Form } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

// Servicios
import { validarUsuario } from "@/services/administrarUsuarios/usuariosAPI";
// Notificaciones

// Types
import { Usuario } from "@/types/typesGlobal";
import { notify } from "@/components/global/NotificationHandler";

const { Text } = Typography;

interface Props {
  usuario?: Usuario | null;
}

export const DatosBasicos: React.FC<Props> = ({ usuario }) => {
  const {
    control,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useFormContext();

  const [phoneValue, setPhoneValue] = useState<string>("");
  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);

  // Opciones de roles
  const rolesOptions = [
    { value: "Administrador", label: "Administrador" },
    { value: "Administrador TI", label: "Administrador TI" },
    { value: "Gerente", label: "Gerente" },
    { value: "Ingeniero Obra", label: "Ingeniero Obra" },
    { value: "Encargado Obras", label: "Encargado Obras" },
    { value: "Directora Proyectos", label: "Directora Proyectos" },
    { value: "Administrativo", label: "Administrativo" },
    { value: "Activos", label: "Activos" },
    { value: "Logistica", label: "Logistica" },
  ];

  // Inicializar valores cuando se carga un usuario
  useEffect(() => {
    if (usuario?.user) {
      setPhoneValue(usuario.user.telefono || "");
      setUsernameAvailable(true);

      setValue("nombre", usuario.user.nombre || "");
      setValue("cedula", usuario.user.cedula || "");
      setValue("telefono", usuario.user.telefono || "");
      setValue("rol", usuario.user.rol || "");
      setValue("username", usuario.user.username || "");
      setValue("correo", usuario.user.correo || "");
      setValue(
        "can_config_telefono",
        usuario.user.can_config_telefono?.toString() || "0"
      );
    }
  }, [usuario, setValue]);

  // 💡 Validar username único
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.trim();
    setValue("username", username);
    setUsernameAvailable(true);

    // Si se está editando un usuario existente, no validar
    if (usuario) {
      clearErrors("username");
      return;
    }

    // Cancelar validación anterior
    if (usernameTimer) clearTimeout(usernameTimer);

    // Validaciones básicas
    if (!username || username.length < 5) {
      clearErrors("username");
      setUsernameAvailable(true);
      setCheckingUsername(false);
      return;
    }

    // Iniciar nueva validación con retardo
    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const response = await validarUsuario(username);

        if (response && Object.keys(response).length === 0) {
          clearErrors("username");
          setUsernameAvailable(true);
          notify.success("Usuario disponible");
        } else {
          setError("username", {
            type: "manual",
            message: "Usuario no disponible",
          });
          setUsernameAvailable(false);
          notify.error("El nombre de usuario ya está en uso");
        }
      } catch (error) {
        clearErrors("username");
        setUsernameAvailable(true);
        notify.warning("No se pudo validar el usuario");
      } finally {
        setCheckingUsername(false);
      }
    }, 800);

    setUsernameTimer(timer);
  };

  // Manejar cambio de teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 10) {
      setPhoneValue(numericValue);
      setValue("telefono", numericValue, { shouldValidate: true });

      if (numericValue.length > 0 && numericValue.length !== 10) {
        setError("telefono", {
          type: "manual",
          message: "El teléfono debe tener 10 dígitos",
        });
      } else {
        clearErrors("telefono");
      }
    }
  };

  // Obtener estado del input de username
  const getUsernameStatus = () => {
    const username = watch("username");

    if (!username || username.length < 5) return undefined;
    if (checkingUsername) return "validating";
    if (usernameAvailable && username.length >= 5) return "success";
    if (!usernameAvailable) return "error";
    return undefined;
  };

  // Obtener sufijo del input de username
  const getUsernameSuffix = () => {
    const username = watch("username");

    if (!username || username.length < 5) return null;
    if (checkingUsername) return <LoadingOutlined />;
    if (usernameAvailable && username.length >= 5)
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    if (!usernameAvailable)
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    return null;
  };

  // Cleanup del timer
  useEffect(() => {
    return () => {
      if (usernameTimer) {
        clearTimeout(usernameTimer);
      }
    };
  }, [usernameTimer]);

  return (
    <Row gutter={[24, 16]}>
      {/* Columna izquierda - Información personal */}
      <Col xs={24} lg={12}>
        <div style={{ paddingRight: "12px" }}>
          <Form.Item
            label="Nombre completo"
            required
            validateStatus={errors.nombre ? "error" : ""}
            help={errors.nombre?.message as string}
          >
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: "Nombre completo es requerido",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el nombre completo"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  maxLength={60}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Cédula"
            required
            validateStatus={errors.cedula ? "error" : ""}
            help={errors.cedula?.message as string}
          >
            <Controller
              name="cedula"
              control={control}
              rules={{
                required: "Cédula es requerida",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                maxLength: { value: 15, message: "Máximo 15 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese la cédula"
                  size="large"
                  maxLength={15}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            required
            validateStatus={errors.telefono ? "error" : ""}
            help={errors.telefono?.message as string}
          >
            <Controller
              name="telefono"
              control={control}
              rules={{
                required: "Teléfono es requerido",
                minLength: { value: 10, message: "Debe tener 10 dígitos" },
                maxLength: { value: 10, message: "Debe tener 10 dígitos" },
                pattern: {
                  value: /^\d{10}$/,
                  message: "Debe ser un número de 10 dígitos",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="3001234567"
                  size="large"
                  prefix={<PhoneOutlined />}
                  maxLength={10}
                  showCount
                />
              )}
            />
          </Form.Item>
        </div>
      </Col>

      {/* Columna derecha - Credenciales y configuración */}
      <Col xs={24} lg={12}>
        <div style={{ paddingLeft: "12px" }}>
          <Form.Item
            label="Rol"
            required
            validateStatus={errors.rol ? "error" : ""}
            help={errors.rol?.message as string}
          >
            <Controller
              name="rol"
              control={control}
              rules={{ required: "Rol es requerido" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={rolesOptions}
                  placeholder="Seleccione un rol"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Nombre de usuario"
            required
            validateStatus={errors.username ? "error" : getUsernameStatus()}
            help={
              errors.username?.message ||
              (checkingUsername
                ? "Verificando disponibilidad..."
                : usernameAvailable && watch("username")?.length >= 5
                ? "✓ Usuario disponible"
                : "")
            }
          >
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Nombre de usuario es requerido",
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
                validate: {
                  available: () => usernameAvailable || "Usuario no disponible",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={handleUsernameChange}
                  placeholder="Ingrese el nombre de usuario"
                  size="large"
                  prefix={<UserOutlined />}
                  disabled={!!usuario}
                  suffix={getUsernameSuffix()}
                  status={getUsernameStatus()}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            validateStatus={errors.correo ? "error" : ""}
            help={errors.correo?.message as string}
          >
            <Controller
              name="correo"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ingrese un correo válido",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="usuario@empresa.com"
                  size="large"
                  prefix={<MailOutlined />}
                  maxLength={255}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            required={!usuario}
            validateStatus={errors.password ? "error" : ""}
            help={
              (errors.password?.message as string) ||
              (usuario
                ? "Dejar en blanco para mantener la contraseña actual"
                : "")
            }
          >
            <Controller
              name="password"
              control={control}
              rules={{
                required: usuario ? false : "Contraseña es requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 8, message: "Máximo 8 caracteres" },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder={
                    usuario
                      ? "Dejar en blanco para no cambiar"
                      : "Ingrese la contraseña"
                  }
                  size="large"
                  prefix={<LockOutlined />}
                  autoComplete="new-password"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="can_config_telefono"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value === "1"}
                  onChange={(e) => field.onChange(e.target.checked ? "1" : "0")}
                >
                  <Text strong>Permitir configuración de teléfono</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      El usuario podrá configurar opciones relacionadas con
                      teléfono en el sistema
                    </Text>
                  </div>
                </Checkbox>
              )}
            />
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
};
