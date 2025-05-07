/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Props } from "./types";
import dayjs from "dayjs";
import {
  getConvenios,
  getListaResolucion,
} from "@/services/facturacion/resolucionAPI";
import { useParams } from "react-router-dom";

const { Text } = Typography;
const dateFormat = "YYYY/MM/DD";

export const DatosBasicos = ({ resolucion, empresas }: Props) => {
  const [optionsConvenios, setOptionsConvenios] = useState<
    SelectProps["options"]
  >([]);
  const { id } = useParams<{ id: string }>();
  const methods = useFormContext();

  useEffect(() => {
    let convenioArray: string[] = [];
    if (id && resolucion) {
      convenioArray = JSON.parse(resolucion.convenio_id.replace(/"/g, "")).map(
        (item: number) => item.toString()
      );
      const convenios = resolucion.convenios.map((item) => {
        return { label: item.descripcion, value: item.id.toString() };
      });
      fetchConvenios(convenios);
    } else {
      fetchConvenios();
    }
    methods.reset(
      resolucion
        ? {
            convenio: convenioArray,
            prefijo: resolucion.prefijo,
            resolucion: resolucion.resolucion,
            fecha: dayjs(resolucion.fecha_resolucion),
            desde: resolucion.desde,
            hasta: resolucion.hasta,
            actualNc: resolucion.consecutivo_nc,
            actualNd: resolucion.consecutivo_nd ?? '0',
            estado: resolucion.estado_id,
          }
        : {
            convenio: [],
            prefijo: null,
            resolucion: null,
            fecha: null,
            desde: null,
            hasta: null,
            actualNc: null,
            actualNd: null,
            estado: "6",
          }
    );
  }, [resolucion, empresas]);

  const fetchConvenios = (conveniosResolucion: any = []) => {
    getListaResolucion().then(({ data: { data } }) => {
      const listResolucion: number[] = [];
      data.data
        .filter((item) => (resolucion ? item : item.estado_id == "6"))
        .forEach((listResol) => {
          const convenios: string[] = JSON.parse(listResol.convenio_id);
          convenios.forEach((item) => {
            if (!listResolucion.includes(parseInt(item))) {
              listResolucion.push(parseInt(item));
            }
          });
        });
      getConvenios().then(({ data: { data } }) => {
        if (listResolucion.length > 0) {
          const convenios = data
            .filter((item) => !listResolucion.includes(item.id))
            .map((item) => {
              return { label: item.descripcion, value: item.id.toString() };
            });
          setOptionsConvenios(convenios.concat(conveniosResolucion));
        } else {
          const convenios = data.map((item) => {
            return { label: item.descripcion, value: item.id.toString() };
          });
          setOptionsConvenios(convenios.concat(conveniosResolucion));
        }
      });
    });
  };

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="convenio"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Convenio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Convenio :">
                <Select
                  {...field}
                  allowClear
                  mode="multiple"
                  options={optionsConvenios}
                  placeholder="Convenio"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="prefijo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Prefijo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Prefijo:">
                <Input
                  {...field}
                  placeholder="Prefijo de la resolución"
                  status={error && "error"}
                  disabled={resolucion ? true : false}
                  maxLength={4}
                  style={{ textTransform: "uppercase" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="resolucion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Resolución es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Resolución:">
                <Input
                  {...field}
                  placeholder="Número de Resolución"
                  status={error && "error"}
                  maxLength={20}
                  disabled={resolucion ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha Resolución es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Resolución:">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  // defaultValue={dayjs("2015/01/01", dateFormat)}
                  format={dateFormat}
                  placeholder="Fecha Resolución"
                  disabled={resolucion ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Row gutter={24}>
            <Col xs={12} sm={12} style={{ width: "100%" }}>
              <Controller
                name="desde"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Desde es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Facturas Desde:">
                    <Input
                      {...field}
                      placeholder="Desde"
                      status={error && "error"}
                      maxLength={6}
                      disabled={resolucion ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={12} sm={12} style={{ width: "100%" }}>
              <Controller
                name="hasta"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Hasta",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Facturas Hasta:">
                    <Input
                      {...field}
                      placeholder="Hasta"
                      status={error && "error"}
                      maxLength={10}
                      disabled={resolucion ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={12} sm={12} style={{ width: "100%" }}>
              <Controller
                name="actualNc"
                control={methods.control}
                rules={{
                  required: {
                    value: resolucion ? true : false,
                    message: "Desde Nota Credito es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem 
                    required={resolucion ? true : false} 
                    label="Notas Credito Desde:"
                    style={{ display: resolucion ? 'block' : 'none' }} 
                  >
                    <Input
                      {...field}
                      placeholder="Nota Credito Actual"
                      status={error && "error"}
                      maxLength={6}
                      disabled={resolucion ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={12} sm={12} style={{ width: "100%" }}>
              <Controller
                name="actualNd"
                control={methods.control}
                rules={{
                  required: {
                    value: resolucion ? true : false,
                    message: "Desde Nota Debito es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem 
                    required={resolucion ? true : false} 
                    label="Notas Debito Desde:"
                    style={{ display: resolucion ? 'block' : 'none' }} 
                  >
                    <Input
                      {...field}
                      placeholder="Nota Debito Actual"
                      status={error && "error"}
                      maxLength={6}
                      disabled={resolucion ? true : false}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </Row>

          <Controller
            name="estado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            defaultValue={6}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Estado">
                <Select
                  {...field}
                  options={[
                    { value: "7", label: "INACTIVO" },
                    { value: "6", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!resolucion ? true : false}
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
