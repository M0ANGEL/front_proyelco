/* eslint-disable react-hooks/exhaustive-deps */
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpresas } from "@/services/maestras/empresasAPI";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { Cargo } from "@/services/types";

const { Text } = Typography;

interface Props {
  onPushNotification: (data: Notification) => void;
  cargo?: Cargo;
}

export const DatosBasicos = ({ onPushNotification, cargo }: Props) => {
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [selectEmpresa, setSelectEmpresas] = useState<SelectProps["options"]>(
    []
  );
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      cargo
        ? {
            nombre: cargo.nombre,
            descripcion: cargo.descripcion,
            id_empresa: cargo.id_empresa,
            estado: cargo.estado,
          }
        : {
            nombre: null,
            descripcion: null,
            id_empresa: null,
            estado: "1",
          }
    );
    setLoaderEmp(true);
    getEmpresas()
      .then(({ data: { data } }) => {
        const options = data.map((item) => {
          return { label: item.emp_nombre, value: item.id.toString() };
        });
        setSelectEmpresas(options);
        setLoaderEmp(false);
      })
      .catch((error) => {
        onPushNotification({
          type: "error",
          title: error.code,
          description: error.message,
        });
        setLoaderEmp(false);
      });
  }, [cargo]);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="nombre"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre del cargo">
                <Input
                  {...field}
                  placeholder="Nombre del cargo"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="descripcion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripcion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripcion">
                <Input
                  {...field}
                  placeholder="Descripcion del cargo"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="id_empresa"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Empresa es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Empresa">
                <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                  <Select
                    {...field}
                    options={selectEmpresa}
                    status={error && "error"}
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="estado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            defaultValue={"1"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Estado">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!cargo ? true : false}
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
