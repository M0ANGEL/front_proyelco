/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { Props } from "./types";
import { SelectProps, Typography, Select, Input, Col, Row } from "antd";
import { CustomSelect } from "@/modules/common/components/CustomSelect/CustomSelect";

const { Text } = Typography;

export const DatosBasicos = ({ motivo }: Props) => {
  const [selectMotivos, setSelectMotivos] = useState<SelectProps["options"]>(
    []
  );
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      motivo
        ? {
            codigo: motivo.codigo,
            motivo: motivo.motivo,
            estado: motivo.estado,
            codigo_homologado: motivo.codigo_homologado,
          }
        : {
            codigo: "",
            motivo: "",
            estado: "1",
            codigo_homologado: "",
          }
    );
    getMotivosAud().then(({ data: { data } }) => {
      setSelectMotivos(
        data
          .filter((item) => item.codigo != (motivo ? motivo?.codigo : ""))
          .map((motivo, index) => ({
            key: index,
            value: motivo.codigo,
            label: `${motivo.codigo} - ${motivo.motivo}`,
          }))
      );
    });
  }, [motivo]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="codigo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Número o Código de Motivo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código de Motivo:">
                <Input
                  {...field}
                  showCount
                  maxLength={10}
                  placeholder="Número ó Código de Motivo"
                  status={error && "error"}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="motivo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripción Motivo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Motivo:">
                <TextArea
                  {...field}
                  showCount
                  maxLength={320}
                  autoSize={{ minRows: 3 }}
                  placeholder="Descripción de Motivo"
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
              <StyledFormItem required label="Estado:">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!motivo ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="codigo_homologado"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Código Homologado:" extra="">
                <CustomSelect
                  {...field}
                  options={selectMotivos}
                  error={error}
                  placeholder="Seleccione un Código Homologado"
                  listHeight={400}
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
