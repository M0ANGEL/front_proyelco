import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import {
  cargosTH,
  ciudadesTH,
  paisesTH,
} from "@/services/talento-humano/personalAPI";
import dayjs from "dayjs";
import { StyledFormItem } from "@/components/layout/styled";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  const [selectCargo, setselectCargo] = useState<SelectProps["options"]>([]);
  const [ciudades, setCiudades] = useState<SelectProps["options"]>([]);
  const [paises, setPaises] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("identificacion", TkCategoria?.identificacion);
      methods.setValue("tipo_documento", TkCategoria?.tipo_documento);
      methods.setValue("nombre_completo", TkCategoria?.nombre_completo);
      methods.setValue("estado_civil", TkCategoria?.estado_civil);
      methods.setValue(
        "ciuda_expedicion_id",
        TkCategoria?.ciuda_expedicion_id
      );
      methods.setValue(
        "pais_residencia_id",
        TkCategoria?.pais_residencia_id
      );
      methods.setValue(
        "ciudad_resudencia_id",
        TkCategoria?.ciudad_resudencia_id
      );
      methods.setValue("genero", TkCategoria?.genero);
      methods.setValue("telefono_fijo", TkCategoria?.telefono_fijo);
      methods.setValue("telefono_celular", TkCategoria?.telefono_celular);
      methods.setValue("direccion", TkCategoria?.direccion);
      methods.setValue("correo", TkCategoria?.correo);
      methods.setValue("cargo_id", TkCategoria?.cargo_id.toString());
      methods.setValue("salario", TkCategoria?.salario);
      methods.setValue(
        "fecha_expedicion",
        TkCategoria?.fecha_expedicion
          ? dayjs(TkCategoria.fecha_expedicion)
          : null
      );

      methods.setValue(
        "fecha_nacimiento",
        TkCategoria?.fecha_nacimiento
          ? dayjs(TkCategoria.fecha_nacimiento)
          : null
      );

      methods.setValue(
        "fecha_ingreso",
        TkCategoria?.fecha_ingreso ? dayjs(TkCategoria.fecha_ingreso) : null
      );

      fetchCiudades(Number(TkCategoria?.pais_residencia_id));
    }
  }, [TkCategoria]);

  useEffect(() => {
    const fetchSelects = async () => {
      await cargosTH().then(({ data: { data } }) => {
        setselectCargo(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.cargo,
          }))
        );
      });
    };
    fetchSelects().catch((error) => {
      console.error(error);
    });

    fetchPais();
  }, []);

  //llamado de categorias
  const fetchPais = () => {
    paisesTH().then(({ data: { data } }) => {
      const pais = data.map((item) => ({
        label: item.pais.toUpperCase(),
        value: item.id,
      }));
      setPaises(pais);
    });
  };

  //llamado de subcategorias por id de categoria
  const fetchCiudades = async (paisId: number) => {
    if (!paisId) {
      setCiudades([]);
      return;
    }
    try {
      const response = await ciudadesTH(paisId);
      const ciudad = response?.data?.data || [];
      setCiudades(
        ciudad.map((item) => ({
          label: item.ciudad.toUpperCase(),
          value: Number(item.id),
        }))
      );
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
    }
  };
  return (
    <Row gutter={24}>
      {/* cedula */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="identificacion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cedula">
              <Input
                {...field}
                maxLength={20}
                placeholder="111111111"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* tipo de documento */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="tipo_documento"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El tipo del activo es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Documento">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "cc", label: "CC" },
                  { value: "ppt", label: "PPT" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* genero */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="genero"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El genero es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="genero">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "femenino", label: "FEMENINO" },
                  { value: "masculino", label: "MASCULINO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nombre completo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre_completo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El nombre completo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre Completo">
              <Input
                {...field}
                maxLength={50}
                placeholder="miguel "
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* fecha_expedicion */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_expedicion"
          control={methods.control}
          rules={{
            required: { value: true, message: "Fecha de Expedicion requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha Expedicion">
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

      {/* estado civil */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="estado_civil"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El estado civil es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Estado civil">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "soltero", label: "SOLTERO" },
                  { value: "casado", label: "CASADO" },
                  { value: "union libre", label: "UNION LIBRE" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* pais residencia */}
      <Col xs={24} sm={6}>
        <Controller
          name="pais_residencia_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Pais residencia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Pais residencia:">
              <Select
                {...field}
                status={error && "error"}
                options={paises}
                onSelect={(value) => {
                  methods.resetField("ciudad_recidencia_id");
                  fetchCiudades(value);
                }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* ciudad residencia */}
      <Col xs={24} sm={6}>
        <Controller
          name="ciudad_resudencia_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad residencia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad residencia:">
              <Select
                {...field}
                status={error && "error"}
                options={ciudades}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* fecha nacimiento */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_nacimiento"
          control={methods.control}
          rules={{
            required: { value: true, message: "Fecha de nacimiento requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha nacimiento">
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

      {/* ciudad_expedicion */}
      <Col xs={24} sm={12}>
        <Controller
          name="ciuda_expedicion_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Ciudad expedicion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad expedicion:">
              <Select
                {...field}
                status={error && "error"}
                options={ciudades}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Telefono fijo */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="telefono_fijo"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "Telefono es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono Fijo">
              <Input
                {...field}
                maxLength={10}
                placeholder="000 000 00 00"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Telefono celular */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="telefono_celular"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "Telefono es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono Celular">
              <Input
                {...field}
                maxLength={10}
                placeholder="000 000 00 00"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* direccion */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La direccion es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Direccion">
              <Input
                {...field}
                maxLength={50}
                placeholder="Calle 3c"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* correo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="correo"
          control={methods.control}
          rules={{
            required: {
              value: false,
              message: "El correo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo">
              <Input
                {...field}
                maxLength={50}
                placeholder="correo@correo.com"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* cargo */}
      <Col xs={24} sm={12}>
        <Controller
          name="cargo_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El cargo  es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo:">
              <Select
                {...field}
                status={error && "error"}
                options={selectCargo}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* fecha nacimiento */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_ingreso"
          control={methods.control}
          rules={{
            required: { value: true, message: "Fecha de ingreso requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha ingreso">
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

      {/* salario */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="salario"
          control={methods.control}
          rules={{
            required: { value: true, message: "El salario es requerido" },
          }}
          render={({ field, fieldState: { error } }) => {
            const formatNumber = (value: string) => {
              if (!value) return "";
              // quitar puntos
              const numericValue = value.replace(/\./g, "");
              // convertir a número
              const number = parseInt(numericValue, 10);
              if (isNaN(number)) return "";
              // devolver con puntos de miles
              return new Intl.NumberFormat("es-CO").format(number);
            };

            return (
              <StyledFormItem required label="Salario">
                <Input
                  value={formatNumber(field.value)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\./g, "");
                    // guardar limpio en react-hook-form
                    field.onChange(rawValue);
                  }}
                  maxLength={50}
                  placeholder="0"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            );
          }}
        />
      </Col>
    </Row>
  );
};
