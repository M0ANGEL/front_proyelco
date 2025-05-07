/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getTipoRegimen } from "@/services/maestras/tipoRegimenAPI";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Select,
  Input,
  Col,
  Row,
} from "antd";

dayjs.extend(customParseFormat);

const { Text } = Typography;
const dateFormat = "YYYY";

export const DatosBasicos = ({ cuotamoderadora }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectTipoRegimen, setSelectTipoRegimen] = useState<
    SelectProps["options"]
  >([]);
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      cuotamoderadora
        ? {
            fecha: dayjs(cuotamoderadora.fecha),
            regimen: cuotamoderadora.regimen,
            categoria: cuotamoderadora.categoria,
            valor: parseFloat(cuotamoderadora.valor),
            estado: cuotamoderadora.estado,
            tipo_regimen: cuotamoderadora.tipo_regimen
              ? JSON.parse(cuotamoderadora.tipo_regimen)
              : [],
          }
        : {
            fecha: null,
            regimen: null,
            categoria: null,
            valor: null,
            estado: "1",
            tipo_regimen: [],
          }
    );
    getTipoRegimen()
      .then(({ data: { data } }) => {
        setSelectTipoRegimen(
          data.map((item) => ({
            value: item.id.toString(),
            label: `${item.nombre}`,
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
  }, [cuotamoderadora]);

  return (
    <>
      {contextHolder}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12}>
          <Controller
            name="fecha"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Año es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Año:">
                <DatePicker
                  {...field}
                  placeholder="Seleccionar Año"
                  picker="year"
                  format={dateFormat}
                  status={error && "error"}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="regimen"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Regimen es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Regimen:">
                <Select
                  {...field}
                  options={[
                    { value: "SUBSIDIADO", label: "SUBSIDIADO" },
                    { value: "CONTRIBUTIVO", label: "CONTRIBUTIVO" },
                    { value: "ESPECIAL", label: "ESPECIAL" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Row gutter={[12, 12]}>
            <Col xs={24}>
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
                      disabled={!cuotamoderadora ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
              <Controller
                name="tipo_regimen"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Tipo Regimen es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo Regimen:">
                    <Select
                      {...field}
                      mode="multiple"
                      maxTagCount={2}
                      listHeight={300}
                      maxTagTextLength={20}
                      popupMatchSelectWidth={false}
                      placeholder="Seleccionar Tipo Regimen"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={selectTipoRegimen}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <Controller
                name="categoria"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Categoria es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Categoria:">
                    <Select
                      {...field}
                      options={[
                        { value: "A", label: "A" },
                        { value: "B", label: "B" },
                        { value: "C", label: "C" },
                        { value: "NA", label: "NA" },
                      ]}
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="valor"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Valor es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Valor:">
                    <Input
                      {...field}
                      placeholder="Valor"
                      status={error && "error"}
                      prefix={"$"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
