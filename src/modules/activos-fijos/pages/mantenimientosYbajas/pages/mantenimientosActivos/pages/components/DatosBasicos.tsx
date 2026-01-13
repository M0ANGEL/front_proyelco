import { useEffect, useState } from "react";
import {
  Col,
  Input,
  Row,
  SelectProps,
  Select,
  Typography,
  DatePicker,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import TextArea from "antd/es/input/TextArea";
import { getActivosMantenimiento } from "@/services/activosFijos/MantenimientoActivosAPI";
import { StyledFormItem } from "@/components/layout/styled";
import dayjs from "dayjs";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const [selectCategorias, setSelectCategorias] = useState<
    SelectProps["options"]
  >([]);
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("valor", TkCategoria?.valor);
      methods.setValue(
        "fecha_inicio",
        TkCategoria?.fecha_inicio ? dayjs(TkCategoria.fecha_inicio) : null
      );
      methods.setValue(
        "fecha_fin",
        TkCategoria?.fecha_fin ? dayjs(TkCategoria.fecha_fin) : null
      );

      methods.setValue("observacion", TkCategoria?.observaciones);
      methods.setValue("activo_id", TkCategoria?.activo_id);
    } else {
      fetchCategorias();
    }
  }, [TkCategoria]);

  const fetchCategorias = () => {
    getActivosMantenimiento().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.numero_activo.toUpperCase(),
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
  };

  return (
    <Row gutter={24}>
      {/* campo de activo*/}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="activo_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Activo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Activo Fijo">
              <Select
                {...field}
                showSearch
                allowClear
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label ?? "").toString().toLowerCase()
                    )
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                options={selectCategorias}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nombre valor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
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
            <StyledFormItem required label="Valor de mantenimiento del activo">
              <Input
                {...field}
                maxLength={50}
                placeholder="000.000"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campode la fecha de inicio */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_inicio"
          control={methods.control}
          rules={{
            required: { value: true, message: "Fecha inicio es requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha Incio Mantenimiento">
              <DatePicker
                style={{ width: "100%" }}
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campode la fecha final */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_fin"
          control={methods.control}
          rules={{
            required: { value: true, message: "Fecha final es requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha Final Mantenimiento">
              <DatePicker
                style={{ width: "100%" }}
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* descripcion */}
      <Col xs={24} sm={24} style={{ width: "100%" }}>
        <Controller
          name="observacion"
          control={methods.control}
          rules={{
            required: { value: true, message: "Observacion es requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Observacion">
              <TextArea
                {...field}
                maxLength={200}
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
