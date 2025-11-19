import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography, Select, Input, Col, Row, Form, Tooltip, Spin } from "antd";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Menu, SubMenu } from "@/types/auth.types";

// Types

const { Text } = Typography;

interface Props {
  submenu?: SubMenu | null;
  menus?: Menu[] | null;
}

export const DatosBasicos: React.FC<Props> = ({ submenu, menus }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [menusOptions, setMenusOptions] = useState<any[]>([]);

  // Inicializar valores cuando se carga un submenú
  useEffect(() => {
    if (submenu) {
      setValue("nom_smenu", submenu.nom_smenu || "");
      setValue("desc_smenu", submenu.desc_smenu || "");
      setValue("link_smenu", submenu.link_smenu || "");
      setValue("id_menu", submenu.id_menu?.toString() || "");
    }
  }, [submenu, setValue]);

  // Convertir menús a opciones de select
  useEffect(() => {
    const options = menus?.map((menu: Menu) => ({
      label: `${menu.nom_modulo?.toUpperCase()} / ${menu.nom_menu?.toUpperCase()}`,
      value: menu.id.toString(),
      disabled: menu.estado === "0",
    })) || [];
    
    setMenusOptions(options);
  }, [menus]);

  return (
    <Row gutter={[24, 16]}>
      {/* Columna izquierda - Información básica */}
      <Col xs={24} lg={12}>
        <div style={{ paddingRight: "12px" }}>
          <Form.Item
            label="Nombre del submenú"
            required
            validateStatus={errors.nom_smenu ? "error" : ""}
            help={errors.nom_smenu?.message as string}
          >
            <Controller
              name="nom_smenu"
              control={control}
              rules={{
                required: "Nombre es requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 60, message: "Máximo 60 caracteres" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ingrese el nombre del submenú"
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
            validateStatus={errors.desc_smenu ? "error" : ""}
            help={errors.desc_smenu?.message as string}
          >
            <Controller
              name="desc_smenu"
              control={control}
              rules={{
                required: "Descripción es requerida",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
                maxLength: { value: 255, message: "Máximo 255 caracteres" },
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Ingrese la descripción del submenú"
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
                    Este enlace es la posición número 3, por ejemplo en la
                    url modulo/menu/<Text type="warning">submenu</Text>, el
                    valor que ingreses aquí estará en la tercera parte de la url
                  </Text>
                }
              >
                <Text>Enlace del submenú </Text>
                <InfoCircleOutlined style={{ color: "#1677ff", marginLeft: 4 }} />
              </Tooltip>
            }
            required
            validateStatus={errors.link_smenu ? "error" : ""}
            help={errors.link_smenu?.message as string}
          >
            <Controller
              name="link_smenu"
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
                  placeholder="Ingrese el enlace del submenú"
                  size="large"
                  disabled={!!submenu} // Solo editable al crear
                  maxLength={50}
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Menú padre"
            required
            validateStatus={errors.id_menu ? "error" : ""}
            help={errors.id_menu?.message as string}
          >
            <Controller
              name="id_menu"
              control={control}
              rules={{ required: "Menú padre es requerido" }}
              render={({ field }) => (
                <Spin spinning={!menus} indicator={<LoadingOutlined />}>
                  <Select
                    {...field}
                    options={menusOptions}
                    placeholder="Seleccione el menú padre"
                    size="large"
                    loading={!menus}
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