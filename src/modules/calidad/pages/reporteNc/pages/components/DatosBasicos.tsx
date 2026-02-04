import { useEffect, useState } from "react";
import { Col, Input, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import { StyledFormItem } from "@/components/layout/styled";
import { getInsumosSincoApi } from "@/services/sincoGlobalAPI/sincoGlobalAPI";

const { Text } = Typography;

interface DataSelect {
  label: string;
  value: number;
}

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();
  const [proyectos, setProyectos] = useState<DataSelect[]>([]);

  const TipoReportes = [
    { label: "Calidad", value: "CALIDAD" },
    { label: "Servicio", value: "SERVICIO" },
    { label: "Otro", value: "OTRO" },
  ];

  /* llamado de los insumos de sico */
  const getInsumosSinco = async () => {
    const {
      data: { data },
    } = await getInsumosSincoApi();
    setProyectos(
      data.map((p: any) => ({
        label: p.nombre.toUpperCase(),
        value: p.codigo,
      })),
    );
  };

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("emp_nombre", TkCategoria?.emp_nombre);
      methods.setValue("nit", TkCategoria?.nit);
      methods.setValue("direccion", TkCategoria?.direccion);
      methods.setValue("telefono", TkCategoria?.telefono);
      methods.setValue("cuenta_de_correo", TkCategoria?.cuenta_de_correo);
      methods.setValue("id_user", TkCategoria?.id_user);
    } else {
      /*  methods.setValue('estado', '1') */
    }
    getInsumosSinco();
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* aqui todo los proyectos sea casa o apartamento */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="emp_nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Proyecto">
              <Input
                {...field}
                maxLength={50}
                placeholder="Empresa"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* tipo de reporte, sera un select */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La direccion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo de Reporte">
              <Select options={TipoReportes} {...field} />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Codigo proyecto y material, poder filtrar en el select */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="telefono"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Telefono de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Insumo Sinco">
              <Select options={proyectos} {...field} />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nit de la empresa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nit"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nit de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nit de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="122301"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* cuenta de correo de la empresa */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cuenta_de_correo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Correo de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo de la empresa">
              <Input
                {...field}
                maxLength={50}
                placeholder="cliente@gmail.com"
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
