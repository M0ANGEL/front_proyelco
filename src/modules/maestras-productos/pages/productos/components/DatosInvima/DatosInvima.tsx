/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, DatePicker, Input, Row, Select, Typography } from "antd";

const { Text } = Typography;

export const DatosInvima = () => {
  const methods = useFormContext();
  const preparacion=methods.watch('grupo_invima');

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="invima"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Invima es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Invima:">
                <Input
                  {...field}
                  placeholder="Invima"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="grupo_invima"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Grupo Invima es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Grupo Invima:">
                <Select
                  {...field}
                  placeholder={"Grupo Invima"}
                  options={[
                    { value: "MEDICAMENTOS", label: "MEDICAMENTOS" },
                    { value: "BIOLOGICOS", label: "BIOLOGICOS" },
                    { value: "COSMETICOS", label: "COSMETICOS" },
                    {
                      value: "PREPARACION MAGISTRAL",
                      label: "PREPARACION MAGISTRAL",
                    },
                    {
                      value: "MEDICO QUIRURGICOS",
                      label: "MEDICO QUIRURGICOS",
                    },
                    {
                      value: "SUPLEMENTO DIETARIO",
                      label: "SUPLEMENTO DIETARIO",
                    },
                    {
                      value: "VITAL NO DISPONIBLE",
                      label: "VITAL NO DISPONIBLE",
                    },
                    {
                      value: "BEBIDAS ALCOHOLICAS",
                      label: "BEBIDAS ALCOHOLICAS",
                    },
                    { value: "FITOTERAPEUTICO", label: "FITOTERAPEUTICO" },
                    { value: "HOMEOPATICOS", label: "HOMEOPATICOS" },
                    { value: "ALIMENTOS", label: "ALIMENTOS" },
                    { value: "ODONTOLOGICOS", label: "ODONTOLOGICOS" },
                    { value: "ASEO Y LIMPIEZA", label: "ASEO Y LIMPIEZA" },
                    {
                      value: "REACTIVO DIAGNOSTICO",
                      label: "REACTIVO DIAGNOSTICO",
                    },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="cum"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "CUM es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="CUM:">
                <Input {...field} placeholder="CUM" status={error && "error"} />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="expediente"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Expediente es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Expediente:">
                <Input
                  {...field}
                  placeholder="Expediente"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Controller
                name="atc"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "ATC es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="ATC:">
                    <Input
                      {...field}
                      placeholder="ATC"
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="nivel_invima"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Nivel Riesgo es requerido",
                  },
                }}
                defaultValue={"1"}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Nivel Riesgo:">
                    <Select
                      {...field}
                      options={[
                        { value: "0", label: "0" },
                        { value: "I", label: "I" },
                        { value: "II", label: "II" },
                        { value: "IIA", label: "IIA" },
                        { value: "IIB", label: "IIB" },
                        { value: "III", label: "III" },
                      ]}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Controller
            name="estado_invima"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Estado:">
                <Select
                  {...field}
                  showSearch
                  placeholder="Estado"
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={[
                    { value: "Abandono", label: "Abandono" },
                    { value: "N/A", label: "N/A" },
                    { value: "Cancelado", label: "Cancelado" },
                    { value: "Suspendido", label: "Suspendido" },
                    { value: "Vencido", label: "Vencido" },
                    { value: "Vigente", label: "Vigente" },
                    {
                      value: "Temp. no comercializado - En TrAmite Renov",
                      label: "Temp. no comercializado - En TrAmite Renov",
                    },
                    { value: "ACTIVO", label: "ACTIVO" },
                    { value: "Desistido", label: "Desistido" },
                    { value: "Negado", label: "Negado" },
                    { value: "En tramite renov", label: "En tramite renov" },
                    {
                      value: "Perdida Fuerza Ejec",
                      label: "Perdida Fuerza Ejec",
                    },
                    {
                      value: "Temp. no comerc - Vigente",
                      label: "Temp. no comerc - Vigente",
                    },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="fecha_vig_invima"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha es requerida",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Vigencia Invima:">
                {/* <Input
                  {...field}
                  placeholder="Fecha Vigencia Invima"
                  status={error && "error"}
                /> */}
                <DatePicker
                  {...field}
                  // defaultValue={dayjs("01/01/2015", "DD/MM/YYYY")}
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
           { preparacion === "PREPARACION MAGISTRAL" ? (
            <>
          <Row gutter={12}> 
            <Col xs={24} sm={12}> 
          <Controller
            name="codigo_dci"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Codigo DCI es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Codigo DCI:">
                <Input
                  {...field}
                  placeholder="Codigo DCI"
                  status={error && "error"}
                  maxLength={6}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          </Col>
          <Col xs={24} sm={12}>
          <Controller
          name="codigo_dci2"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Codigo DCI2 es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Codigo DCI2:">
              <Input
                {...field}
                placeholder="Codigo DCI2"
                status={error && "error"}
                maxLength={6}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        </Col>
        </Row>
        </>
        ) : null}
        </Col>
      </Row>
    </>
  );
};
