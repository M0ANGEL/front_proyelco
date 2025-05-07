import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import { useEffect } from "react";

const { Text } = Typography;
export const DatosBasicos = ({documentosAuditoria}: Props) => {
  const methods = useFormContext();

  useEffect(() => {

    if (documentosAuditoria) {
      methods.setValue('elaboro_por', documentosAuditoria?.elaborado_por)
      methods.setValue('documento_elaboro', documentosAuditoria.documento_elaboro)
      methods.setValue('ciudad_expedicion_elab', documentosAuditoria.ciudad_expedicion_elab)
      methods.setValue('cargo_elaboro', documentosAuditoria?.cargo_elaboro)
      methods.setValue('reviso_por', documentosAuditoria?.revisado_por)
      methods.setValue('documento_reviso', documentosAuditoria.documento_reviso)
      methods.setValue('ciudad_expedicion_revi', documentosAuditoria.ciudad_expedicion_revi)
      methods.setValue('cargo_reviso', documentosAuditoria?.cargo_reviso)
      methods.setValue('aprobo_por', documentosAuditoria?.aprobado_por)
      methods.setValue('documento_aprobo', documentosAuditoria.documento_apro)
      methods.setValue('cargo_aprobo', documentosAuditoria?.cargo_aprobo)
      methods.setValue('ciudad_expedicion_apro', documentosAuditoria.ciudad_expedicion_apro)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentosAuditoria])

  return (
    <Row gutter={24}>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="elaboro_por"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "¿Elaboró Por? requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="¿Elaboró Por?">
              <Input
                {...field}
                maxLength={80}
                placeholder="¿Elaboró Por?"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="documento_elaboro"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Documento de quien Elaboró requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Documento de quien elaboró">
              <Input
                {...field}
                maxLength={80}
                placeholder="Documento de quien elaboró"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="ciudad_expedicion_elab"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciuidad expedición elaboró requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciuidad expedición elaboró">
              <Input
                {...field}
                maxLength={80}
                placeholder="Ciuidad expedición elaboró"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="cargo_elaboro"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cargo de quien elaboró requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo de quien elaboró">
              <Input
                {...field}
                maxLength={80}
                placeholder="Cargo de quien elaboró"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="reviso_por"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "¿Revisó Por? requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="¿Revisó Por?">
              <Input
                {...field}
                maxLength={80}
                placeholder="¿Revisó Por?"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="documento_reviso"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Documento de quien revisó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Documento de quien revisó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Documento de quien revisó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="ciudad_expedicion_revi"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciuidad expedición revisoó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciuidad expedición revisó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Ciuidad expedición revisó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="cargo_reviso"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cargo de quien revisó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo de quien revisó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Cargo de quien Revisó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="aprobo_por"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "¿Aprobó Por? requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="¿Aprobó Por? ">
              <Input
                {...field}
                maxLength={80}
                placeholder="¿Aprobó Por? "
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="documento_aprobo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Documento de quien aprobó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Documento de quien aprobó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Documento de quien aprobó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="ciudad_expedicion_apro"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciuidad expedición aprobó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciuidad expedición aprobó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Ciuidad expedición aprobó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="cargo_aprobo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cargo de quien Aprobó requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo de quien Aprobó">
              <Input
                {...field}
                maxLength={80}
                placeholder="Cargo Aprobó"
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
