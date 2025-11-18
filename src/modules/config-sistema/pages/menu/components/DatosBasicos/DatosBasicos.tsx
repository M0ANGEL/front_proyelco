import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography, Select, Input, Col, Row, Form, Tooltip, Spin } from "antd";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Menu, Modulo } from "@/types/auth.types";

// Types

const { Text } = Typography;

interface Props {
  menu?: Menu | null;
  modulos?: Modulo[] | null;
}

export const DatosBasicos: React.FC<Props> = ({ menu, modulos }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [modulosOptions, setModulosOptions] = useState<any[]>([]);

  // Inicializar valores cuando se carga un menú
  useEffect(() => {
    if (menu) {
      setValue("nom_menu", menu.nom_menu || "");
      setValue("desc_menu", menu.desc_menu || "");
      setValue("link_menu", menu.link_menu || "");
      setValue("id_modulo", menu.id_modulo?.toString() || "");
    }
  }, [menu, setValue]);

  // Convertir módulos a opciones de select
  useEffect(() => {
    const options = modulos?.map((modulo: Modulo) => ({
      label: modulo.nom_modulo?.toUpperCase() || "",
      value: modulo.id.toString(),
      disabled: modulo.estado === "0",
    })) || [];
    
    setModulosOptions(options);
  }, [modulos]);

  return (
    <Row gutter={[24, 16]}>
      {/* Columna izquierda - Información básica */}
      <Col xs={24} lg={12}>
        <div style={{ paddingRight: "12px" }}>
          <Form.Item
            label="Nombre del menú"
            required
            validateStatus={errors.nom_menu ? "error" : ""}
            help={errors.nom_menu?.message as string}
          >
            <Controller
              name="nom_menu"
              control={control}
              rules={{
                required: "Nombre es requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el nombre del menú"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  maxLength={60}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Descripción"
            required
            validateStatus={errors.desc_menu ? "error" : ""}
            help={errors.desc_menu?.message as string}
          >
            <Controller
              name="desc_menu"
              control={control}
              rules={{
                required: "Descripción es requerida",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                maxLength: { value: 255, message: "Máximo 255 caracteres" },
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Ingrese la descripción del menú"
                  size="large"
                  style={{ textTransform: "uppercase" }}
                  rows={3}
                  maxLength={255}
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
            label={
              <Tooltip
                title={
                  <Text style={{ color: "white" }}>
                    Este enlace es la posición número 2, por ejemplo en la
                    url modulo/<Text type="warning">menu</Text>/submenu, el
                    valor que ingreses aquí estará en la segunda parte de la url
                  </Text>
                }
              >
                <Text>Enlace del menú </Text>
                <InfoCircleOutlined style={{ color: "#1677ff", marginLeft: 4 }} />
              </Tooltip>
            }
            required
            validateStatus={errors.link_menu ? "error" : ""}
            help={errors.link_menu?.message as string}
          >
            <Controller
              name="link_menu"
              control={control}
              rules={{
                required: "Enlace es requerido",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Solo letras minúsculas, números y guiones"
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el enlace del menú"
                  size="large"
                  disabled={!!menu} // Solo editable al crear
                  maxLength={50}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Módulo padre"
            required
            validateStatus={errors.id_modulo ? "error" : ""}
            help={errors.id_modulo?.message as string}
          >
            <Controller
              name="id_modulo"
              control={control}
              rules={{ required: "Módulo padre es requerido" }}
              render={({ field }) => (
                <Spin spinning={!modulos} indicator={<LoadingOutlined />}>
                  <Select
                    {...field}
                    options={modulosOptions}
                    placeholder="Seleccione el módulo padre"
                    size="large"
                    loading={!modulos}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    optionFilterProp="label"
                  />
                </Spin>
              )}
            />
          </Form.Item>
        </div>
      </Col>
    </Row>
  );
};