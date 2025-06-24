import { useEffect, useState } from "react";
import { Col, Input, Row, Select, SelectProps, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import { getCargos } from "@/services/maestras/cargosAPI";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  const [selectCargo, setselectCargo] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    const fetchSelects = async () => {
      await getCargos().then(({ data: { data } }) => {
        setselectCargo(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
      });
    };
    fetchSelects().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("nombres", TkCategoria?.nombres);
      methods.setValue("apellidos", TkCategoria?.apellidos);
      methods.setValue("cedula", TkCategoria?.cedula);
      methods.setValue("telefono", TkCategoria?.telefono);
      methods.setValue("cargo_id", TkCategoria?.cargo_id);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* cargo */}
      <Col xs={24} sm={12}>
        <Controller
          name="cargo_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cargo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo:">
              <Select
                {...field}
                status={error && "error"}
                options={selectCargo}
                placeholder="Tipo de Proyecto"
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nombre del porveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombres"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombres">
              <Input
                {...field}
                maxLength={50}
                placeholder="AnM"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Apellidos */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="apellidos"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Los apellidos son requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Apellidos">
              <Input
                {...field}
                maxLength={50}
                placeholder="O"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Telefono de la proveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Telefono es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono">
              <Input
                {...field}
                maxLength={50}
                placeholder="000 000 00 00"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* cuenta de correo de proveedor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cedula"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "cedula es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cedula">
              <Input
                {...field}
                maxLength={50}
                placeholder="123456789"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
