/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Select, SelectProps, Spin, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { Bodega, Empresa } from "@/services/types";
import { useEffect, useState } from "react";
import { TablaEmpresasBodegas } from "..";
import { Usuario } from "../../types";
const { Text } = Typography;

interface Props {
  onPushNotification: (data: Notification) => void;
  empresas: Empresa[];
  bodegas: Bodega[];
  usuario: Usuario | undefined;
  setUsuario: (value: Usuario) => void;
}

interface GroupOptions {
  label?: string;
  options?: {
    label?: string;
    value?: string;
  }[];
}

export const DatosEmpresas = ({
  empresas,
  bodegas,
  usuario,
  setUsuario,
}: Props) => {
  const methods = useFormContext();
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [loaderBod, setLoaderBod] = useState<boolean>(true);
  const [optionsEmpresas, setOptionsEmpresas] = useState<
    SelectProps["options"]
  >([]);
  const [optionsBodegas, setOptionsBodegas] = useState<GroupOptions[]>([]);

  useEffect(() => {
    setLoaderEmp(true);
    const options = empresas
      .filter((item) => item.estado == "1")
      .map((item) => {
        return { label: item.emp_nombre, value: item.id.toString() };
      });

    setOptionsEmpresas(options);
    setLoaderEmp(false);
  }, [usuario]);

  const handleChange = (value: Array<number>) => {
    methods.setValue("empresas", value);
    methods.clearErrors("empresas");
    methods.setValue("bodegas", []);
    setLoaderBod(true);
    if (value.length > 0) {
      let options;

      if (!usuario) {
        options = value.map((empresa) => {
          const bod = bodegas
            .filter(
              (bodega) =>
                bodega.id_empresa == empresa.toString() && bodega.estado == "1"
            )
            .map((bodega) => {
              return {
                empresa_id: empresa,
                label: bodega.bod_nombre,
                value: bodega.id.toString(),
              };
            });
          return {
            label: empresas?.find((item) => item.id == empresa)?.emp_nombre,
            options: bod,
          };
        });
      } else {
        const filterBodegas = bodegas.filter(
          (item) =>
            !usuario.bodegas.some(
              (value) => item.id.toString() === value.id_bodega
            )
        );

        options = value.map((empresa) => {
          const bod = filterBodegas
            .filter(
              (bodega) =>
                bodega.id_empresa == empresa.toString() && bodega.estado == "1"
            )
            .map((bodega) => {
              return {
                empresa_id: empresa,
                label: bodega.bod_nombre,
                value: bodega.id.toString(),
              };
            });
          return {
            label: empresas?.find((item) => item.id == empresa)?.emp_nombre,
            options: bod,
          };
        });
      }

      setOptionsBodegas(options);
      setLoaderBod(false);
    } else {
      setOptionsBodegas([]);
    }
  };
  return (
    <>
      <Controller
        name="empresas"
        control={methods.control}
        rules={{
          required: {
            value: usuario?.user ? false : true,
            message: "Empresas es requerido",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <StyledFormItem required label="Empresas:">
            <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
              <Select
                {...field}
                mode="multiple"
                options={optionsEmpresas}
                filterOption={(input, option) =>
                  (
                    option?.label?.toString().toLocaleLowerCase() ?? ""
                  ).includes(input.toLowerCase())
                }
                status={error && "error"}
                onChange={handleChange}
              />
            </Spin>
            <Text type="danger">{error?.message}</Text>
          </StyledFormItem>
        )}
      />
      <Controller
        name="bodegas"
        control={methods.control}
        rules={{
          required: {
            value: usuario?.user ? false : true,
            message: "Bodegas es requerido",
          },
          min: {
            value: 1,
            message: "Debes escoger al menos una bodega",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <StyledFormItem required label="Bodegas:">
            <Select
              {...field}
              mode="multiple"
              allowClear
              options={optionsBodegas}
              filterOption={(input, option) =>
                (option?.label?.toString().toLocaleLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              status={error && "error"}
              disabled={loaderBod}
            />
            <Text type="danger">{error?.message}</Text>
          </StyledFormItem>
        )}
      />
      {usuario ? (
        <TablaEmpresasBodegas
          usuario={usuario}
          setUsuario={(value: Usuario) => {
            setUsuario(value);
          }}
        />
      ) : null}
    </>
  );
};
