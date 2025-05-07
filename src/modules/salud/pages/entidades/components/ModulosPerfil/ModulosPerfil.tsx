/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { Checkbox, Space, Typography } from "antd";
import { Modulo, Perfil } from "@/services/types";
import { useEffect, useState } from "react";
const { Text } = Typography;

interface Props {
  perfil: Perfil | undefined;
  modulos: Modulo[];
}

export const ModulosPerfil = ({ perfil, modulos }: Props) => {
  const methods = useFormContext();
  const [modulosOptions, setModulosOptions] =
    useState<CheckboxGroupProps["options"]>();
  useEffect(() => {
    const options = modulos?.map((modulo) => {
      return { value: modulo.id.toString(), label: modulo.nom_modulo };
    });
    if (perfil) {
      const perfilModulos = perfil.modulos.map((modulo) => {
        return modulo.id.toString();
      });
      methods.setValue("modulos", perfilModulos);
    }
    setModulosOptions(options);
  }, [modulos]);
  return (
    <>
      <Controller
        control={methods.control}
        name="modulos"
        rules={{
          required: {
            value: true,
            message: "Debes seleccionar al menos un modulo",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <StyledFormItem required label="Modulos">
            <Space
              direction="vertical"
              style={{
                marginTop: 5,
                padding: 10,
                border: "1px solid #dcdcdc",
                width: "100%",
                borderRadius: 5,
              }}
            >
              <Checkbox.Group {...field} options={modulosOptions} />
              <Text type="danger">{error?.message}</Text>
            </Space>
          </StyledFormItem>
        )}
      />
    </>
  );
};
