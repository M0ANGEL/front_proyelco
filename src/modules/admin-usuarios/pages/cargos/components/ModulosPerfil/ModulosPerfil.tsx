import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, Space, Typography, Form, Row, Col, Card } from "antd";
import { Modulo, Perfil } from "@/types/auth.types";

const { Text } = Typography;

interface Props {
  perfil?: Perfil | null;
  modulos: Modulo[];
}

export const ModulosPerfil: React.FC<Props> = ({ perfil, modulos }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [modulosOptions, setModulosOptions] = useState<any[]>([]);

  // Inicializar módulos seleccionados cuando se carga un perfil
  useEffect(() => {
    if (perfil && perfil.modulos) {
      const perfilModulos = perfil.modulos.map((modulo) => 
        modulo.id.toString()
      );
      setValue("modulos", perfilModulos);
    }
  }, [perfil, setValue]);

  // Convertir módulos a opciones de checkbox
  useEffect(() => {
    const options = modulos?.map((modulo) => ({
      value: modulo.id.toString(),
      label: modulo.nom_modulo?.toUpperCase() || "",
      disabled: modulo.estado === "0",
    })) || [];
    
    setModulosOptions(options);
  }, [modulos]);

  if (modulos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <Text type="secondary">
          No hay módulos disponibles para asignar al perfil.
        </Text>
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card size="small" title="Módulos Disponibles">
          <Form.Item
            validateStatus={errors.modulos ? "error" : ""}
            help={errors.modulos?.message as string}
          >
            <Controller
              control={control}
              name="modulos"
              rules={{
                required: "Debe seleccionar al menos un módulo",
                validate: (value) => 
                  value && value.length > 0 || "Seleccione al menos un módulo"
              }}
              render={({ field }) => (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox.Group
                    {...field}
                    options={modulosOptions}
                    style={{ width: "100%" }}
                  />
                </Space>
              )}
            />
          </Form.Item>

          <div style={{ 
            marginTop: 16, 
            padding: "12px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: "6px" 
          }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              💡 <strong>Total módulos:</strong> {modulos.length} disponible(s)
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};