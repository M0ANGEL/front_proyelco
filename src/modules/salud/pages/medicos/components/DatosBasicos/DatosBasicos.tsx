/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import {
  Col,
  Input,
  notification,
  Row,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Props } from "./types";
import { getTiposDocumentosIdentificacion } from "@/services/maestras/tiposDocumentosIdentificacionAPI";

const { Text } = Typography;

export const DatosBasicos = ({ medico }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
    SelectProps["options"]
  >([]);
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      medico
        ? {
            tipo_identificacion: medico.tipo_identificacion,
            numero_identificacion: medico.numero_identificacion,
            nombre_primero: medico.nombre_primero,
            nombre_segundo: medico.nombre_segundo,
            apellido_primero: medico.apellido_primero,
            apellido_segundo: medico.apellido_segundo,
            entidad: medico.entidad,
            estado: medico.estado,
            rural: medico.rural,
          }
        : {
            tipo_identificacion: null,
            numero_identificacion: null,
            nombre_primero: null,
            nombre_segundo: null,
            apellido_primero: null,
            apellido_segundo: null,
            entidad: null,
            estado: "1",
            rural: "0",
          }
    );
    getTiposDocumentosIdentificacion("medicos")
      .then(({ data: { data } }) => {
        setSelectTipoDocumento(
          data.map((item) => ({
            value: item.codigo,
            label: `${item.codigo} - ${item.descripcion}`,
          }))
        );
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);
            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      );
  }, [medico]);
  return (
    <>
      {contextHolder}
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="tipo_identificacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "tipo de documento es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo de documento">
                <Select
                  {...field}
                  placeholder="Tipo de documento"
                  options={selectTipoDocumento}
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="nombre_primero"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "primer nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Primer nombre:">
                <Input
                  {...field}
                  placeholder="Primer nombre"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="apellido_primero"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "primer apellido es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Primer apellido:">
                <Input
                  {...field}
                  placeholder="Primer apellido"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="entidad"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Entidad a la que pertenece es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Entidad:">
                <Input
                  {...field}
                  placeholder="Entidad"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="numero_identificacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "numero de identificacion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Numero de identificacion:">
                <Input
                  {...field}
                  placeholder="Numero de identificacion"
                  status={error && "error"}
                  // disabled={medico ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="nombre_segundo"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Segundo nombre:">
                <Input
                  {...field}
                  placeholder="Segundo nombre"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="apellido_segundo"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem label="Segundo apellido:">
                <Input
                  {...field}
                  placeholder="Segundo apellido"
                  status={error && "error"}
                />
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
                  disabled={!medico ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="rural"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Medico Rural es requerido",
              },
            }}
            defaultValue={"1"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Medico Rural">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "No" },
                    { value: "1", label: "Si" },
                  ]}
                  status={error && "error"}
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
