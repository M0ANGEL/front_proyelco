/* eslint-disable react-hooks/exhaustive-deps */
import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEmpresas } from "@/services/maestras/empresasAPI";
import { Col, Input, Row, Select, SelectProps, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { Cargo, Entidad } from "@/services/types";

const { Text } = Typography;

interface Props {
  onPushNotification: (data: Notification) => void;
  entidad?: Entidad;
}

export const DatosBasicos = ({ onPushNotification, entidad }: Props) => {
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      entidad
        ? {
            nombre: entidad.entidad,
            estado: entidad.estado_id,
          }
        : {
            nombre: null,
            estado: "1",
          }
    );
    setLoaderEmp(true);
    
  }, [entidad]);

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
              <StyledFormItem required label="Nombre de Entidad">
                <Input
                  {...field}
                  placeholder="Nombre de Entidad"
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
                  disabled={!entidad ? true : false}
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
