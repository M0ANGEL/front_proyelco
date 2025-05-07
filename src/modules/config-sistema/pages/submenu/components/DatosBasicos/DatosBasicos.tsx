/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import {
  Col,
  Input,
  Row,
  Select,
  SelectProps,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Props } from "./types";

import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const DatosBasicos = ({ submenu, menus }: Props) => {
  const [selectMenus, setSelectMenus] = useState<SelectProps["options"]>([]);
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      submenu
        ? {
            nom_smenu: submenu.nom_smenu,
            desc_smenu: submenu.desc_smenu,
            link_smenu: submenu.link_smenu,
            id_menu: submenu.id_menu,
          }
        : {
            nom_smenu: null,
            desc_smenu: null,
            link_smenu: null,
            id_menu: null,
          }
    );

    const options = menus?.map((menu) => {
      return { label: menu.nom_menu, value: menu.id.toString() };
    });
    setSelectMenus(options);
  }, [submenu, menus]);
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="nom_smenu"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre:">
                <Input
                  {...field}
                  placeholder="Nombre del submenu"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="desc_smenu"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripcion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripción:">
                <Input
                  {...field}
                  placeholder="Descripción del submenu"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="link_smenu"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Enlace es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                required
                label={
                  <Tooltip
                    title={
                      <Text style={{ color: "white" }}>
                        Este enlace es la posición número 3, por ejemplo en la
                        url modulo/menu/<Text type="warning">submenu</Text>, el
                        valor que ingreses aquí estaría al final de la url
                      </Text>
                    }
                  >
                    <Text>Enlace: </Text>
                    <InfoCircleOutlined style={{ color: "#1677ff" }} />
                  </Tooltip>
                }
              >
                <Input
                  {...field}
                  placeholder="Enlace del submenu"
                  status={error && "error"}
                  disabled={submenu ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="id_menu"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Menu padre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Menu padre:">
                <Select
                  {...field}
                  options={selectMenus}
                  placeholder="Seleccionar menú padre"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
