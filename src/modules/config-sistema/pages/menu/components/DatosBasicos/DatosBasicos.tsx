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

export const DatosBasicos = ({ menu, modulos }: Props) => {
  const [selectModulos, setSelectModulos] = useState<SelectProps["options"]>(
    []
  );
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      menu
        ? {
            nom_menu: menu.nom_menu,
            desc_menu: menu.desc_menu,
            link_menu: menu.link_menu,
            id_modulo: menu.id_modulo,
          }
        : {
            nom_menu: null,
            desc_menu: null,
            link_menu: null,
            id_modulo: null,
          }
    );

    const options = modulos?.map((modulo) => {
      return { label: modulo.nom_modulo, value: modulo.id.toString() };
    });
    setSelectModulos(options);
  }, [menu, modulos]);
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="nom_menu"
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
                  placeholder="Nombre del menu"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="desc_menu"
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
                  placeholder="Descripción del menu"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="link_menu"
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
                        Este enlace es la posición número 2, por ejemplo en la
                        url modulo/<Text type="warning">menu</Text>/submenu, el
                        valor que ingreses aquí estaría en la mitad de la url
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
                  disabled={menu ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="id_modulo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Modulo padre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Módulo padre:">
                <Select
                  {...field}
                  showSearch
                  options={selectModulos}
                  placeholder="Seleccionar módulo padre"
                  status={error && "error"}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
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
