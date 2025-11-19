import React, {useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography, Select, Input, Col, Row, Form, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Modulo } from "@/types/auth.types";

// Types

const { Text } = Typography;

interface Props {
  modulo?: Modulo | null;
}

export const DatosBasicos: React.FC<Props> = ({ modulo }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Opciones de estado
  const estadoOptions = [
    { value: "1", label: "ACTIVO" },
    { value: "0", label: "INACTIVO" },
  ];

  // Inicializar valores cuando se carga un módulo
  useEffect(() => {
    if (modulo) {
      setValue("cod_modulo", modulo.cod_modulo || "");
      setValue("nom_modulo", modulo.nom_modulo || "");
      setValue("desc_modulo", modulo.desc_modulo || "");
      setValue("estado", modulo.estado?.toString() || "1");
    } else {
      // Valores por defecto para nuevo módulo
      setValue("estado", "1");
    }
  }, [modulo, setValue]);

  return (
    <Row gutter={[24, 16]}>
      {/* Columna izquierda - Información básica */}
      <Col xs={24} lg={12}>
        <div style={{ paddingRight: "12px" }}>
          <Form.Item
            label="Código del módulo"
            required
            validateStatus={errors.cod_modulo ? "error" : ""}
            help={errors.cod_modulo?.message as string}
          >
            <Controller
              name="cod_modulo"
              control={control}
              rules={{
                required: "Código es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 10, message: "Máximo 10 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el código del módulo"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  disabled={!!modulo} // Solo editable al crear
                  maxLength={10}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip
                title={
                  <Text style={{ color: "white" }}>
                    Este nombre es la posición número 1, por ejemplo en la
                    url <Text type="warning">modulo</Text>/menu/submenu, el
                    valor que ingreses aquí estará en la primera parte de la url
                  </Text>
                }
              >
                <Text>Nombre del módulo </Text>
                <InfoCircleOutlined style={{ color: "#1677ff", marginLeft: 4 }} />
              </Tooltip>
            }
            required
            validateStatus={errors.nom_modulo ? "error" : ""}
            help={errors.nom_modulo?.message as string}
          >
            <Controller
              name="nom_modulo"
              control={control}
              rules={{
                required: "Nombre es requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el nombre del módulo"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  disabled={!!modulo} // Solo editable al crear
                  maxLength={60}
                  showCount
                />
              )}
            />
          </Form.Item>
        </div>
      </Col>

      {/* Columna derecha - Configuración adicional */}
      <Col xs={24} lg={12}>
        <div style={{ paddingLeft: "12px" }}>
          <Form.Item
            label="Descripción"
            required
            validateStatus={errors.desc_modulo ? "error" : ""}
            help={errors.desc_modulo?.message as string}
          >
            <Controller
              name="desc_modulo"
              control={control}
              rules={{
                required: "Descripción es requerida",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                maxLength: { value: 255, message: "Máximo 255 caracteres" },
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Ingrese la descripción del módulo"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  rows={3}
                  maxLength={255}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Estado"
            required
            validateStatus={errors.estado ? "error" : ""}
            help={errors.estado?.message as string}
          >
            <Controller
              name="estado"
              control={control}
              rules={{ required: "Estado es requerido" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={estadoOptions}
                  placeholder="Seleccione el estado"
                  size="large"
                  disabled={!modulo} // Solo editable al crear
                />
              )}
            />
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
};