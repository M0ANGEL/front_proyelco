import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Typography,
  Upload,
} from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import {
  cargosTH,
  ciudadesTH,
  getEmpleadoByCedula,
  paisesTH,
} from "@/services/talento-humano/personalAPI";
import dayjs from "dayjs";
import { getContratistas } from "@/services/talento-humano/contratistasAPI";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  const [selectCargo, setselectCargo] = useState<SelectProps["options"]>([]);
  const [ciudades, setCiudades] = useState<SelectProps["options"]>([]);
  const [paises, setPaises] = useState<SelectProps["options"]>([]);
  const [contratista, setContratista] = useState<SelectProps["options"]>([]);
  const minimo = useWatch({ control: methods.control, name: "salarioMinimo" });

  // useEffect(() => {
  //   //si tenemos datos en categoria agregamos a metho los datos
  //   if (TkCategoria) {
  //     methods.setValue("identificacion", TkCategoria?.identificacion);
  //     methods.setValue("tipo_documento", TkCategoria?.tipo_documento);
  //     methods.setValue("nombre_completo", TkCategoria?.nombre_completo);
  //     methods.setValue("estado_civil", TkCategoria?.estado_civil);
  //     methods.setValue("ciuda_expedicion_id", TkCategoria?.ciuda_expedicion_id);
  //     methods.setValue("pais_residencia_id", TkCategoria?.pais_residencia_id);
  //     methods.setValue(
  //       "ciudad_resudencia_id",
  //       TkCategoria?.ciudad_resudencia_id
  //     );
  //     methods.setValue("genero", TkCategoria?.genero);
  //     methods.setValue("telefono_fijo", TkCategoria?.telefono_fijo);
  //     methods.setValue("telefono_celular", TkCategoria?.telefono_celular);
  //     methods.setValue("direccion", TkCategoria?.direccion);
  //     methods.setValue("correo", TkCategoria?.correo);
  //     methods.setValue("cargo_id", TkCategoria?.cargo_id.toString());
  //     methods.setValue("salario", TkCategoria?.salario);
  //     methods.setValue(
  //       "fecha_expedicion",
  //       TkCategoria?.fecha_expedicion
  //         ? dayjs(TkCategoria.fecha_expedicion)
  //         : null
  //     );

  //     methods.setValue(
  //       "fecha_nacimiento",
  //       TkCategoria?.fecha_nacimiento
  //         ? dayjs(TkCategoria.fecha_nacimiento)
  //         : null
  //     );

  //     methods.setValue(
  //       "fecha_ingreso",
  //       TkCategoria?.fecha_ingreso ? dayjs(TkCategoria.fecha_ingreso) : null
  //     );
  //     methods.setValue("salarioMinimo", TkCategoria?.minimo);

  //     fetchCiudades(Number(TkCategoria?.pais_residencia_id));
  //   }
  // }, [TkCategoria]);

  const buscarEmpleado = async (cedula: string) => {
    if (!cedula) return;
    try {
      const { data } = await getEmpleadoByCedula(cedula);

      if (data) {
        // llenar formulario con los datos recibidos
        methods.setValue("identificacion", data.identificacion);
        methods.setValue("tipo_documento", data.tipo_documento);
        methods.setValue("nombre_completo", data.nombre_completo);
        methods.setValue("estado_civil", data.estado_civil);
        methods.setValue("ciuda_expedicion_id", data.ciuda_expedicion_id);
        methods.setValue("pais_residencia_id", data.pais_residencia_id);
        methods.setValue("ciudad_resudencia_id", data.ciudad_resudencia_id);
        methods.setValue("genero", data.genero);
        methods.setValue("telefono_fijo", data.telefono_fijo);
        methods.setValue("telefono_celular", data.telefono_celular);
        methods.setValue("direccion", data.direccion);
        methods.setValue("correo", data.correo);
        methods.setValue("cargo_id", data.cargo_id?.toString());
        methods.setValue("salario", data.salario);
        methods.setValue("salarioMinimo", data.minimo);
        methods.setValue(
          "fecha_expedicion",
          data.fecha_expedicion ? dayjs(data.fecha_expedicion) : null
        );
        methods.setValue(
          "fecha_nacimiento",
          data.fecha_nacimiento ? dayjs(data.fecha_nacimiento) : null
        );
        methods.setValue(
          "fecha_ingreso",
          data.fecha_ingreso ? dayjs(data.fecha_ingreso) : null
        );

        fetchCiudades(Number(data.pais_residencia_id));
      }
    } catch (error) {
      console.error("Error al buscar empleado:", error);
    }
  };

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
    fetchContratistas();
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

  //llamado de contratistas
  const fetchContratistas = () => {
    getContratistas().then(({ data: { data } }) => {
      const pais = data.map((item) => ({
        label: item.contratista.toUpperCase(),
        value: item.id,
      }));
      setContratista(pais);
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
      {/* <Col xs={24} sm={12} style={{ width: "100%" }}>
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
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                onPressEnter={() => buscarEmpleado(field.value)} 
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col> */}

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
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault(); // evita que Tab cambie el foco si quieres
                    buscarEmpleado(field.value);
                  }
                }}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Documento">
              <Select
                {...field}
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="genero">
              <Select
                {...field}
                showSearch
                allowClear
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre Completo">
              <Input
                {...field}
                disabled
                maxLength={50}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha Expedicion">
              <DatePicker
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Estado civil">
              <Select
                {...field}
                showSearch
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Pais recidencia:">
              <Select
                {...field}
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad recidencia:">
              <Select
                {...field}
                status={error && "error"}
                options={ciudades}
                showSearch
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha nacimiento">
              <DatePicker
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ciudad expedicion:">
              <Select
                {...field}
                status={error && "error"}
                options={ciudades}
                showSearch
                allowClear
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono Fijo">
              <Input
                {...field}
                maxLength={10}
                disabled
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Telefono Celular">
              <Input
                {...field}
                disabled
                maxLength={10}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Direccion">
              <Input
                {...field}
                disabled
                maxLength={50}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Correo">
              <Input
                {...field}
                disabled
                maxLength={50}
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
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cargo:">
              <Select
                {...field}
                disabled
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

      {/* contratista */}
      <Col xs={24} sm={12}>
        <Controller
          name="contratista_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Pais recidencia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Contratistas:">
              <Select
                {...field}
                status={error && "error"}
                options={contratista}
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

      {/* salarioMinimo */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="salarioMinimo"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Salario Minimo?">
              <Select
                {...field}
                disabled
                showSearch
                allowClear
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* salario */}
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="salario"
          control={methods.control}
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
                  disabled
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
{/* 
      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="eps"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Eps es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Eps">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="pension"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Pension es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Pension">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="eps"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Eps es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo de sangre">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      <Col xs={24} sm={6} style={{ width: "100%" }}>
        <Controller
          name="pension"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Pension es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Numero de hijos">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: "SI", label: "SI" },
                  { value: "NO", label: "NO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col> */}


  {/* EPS */}
  <Col xs={24} sm={6}>
    <Controller
      name="eps"
      control={methods.control}
      rules={{ required: { value: true, message: "Eps es requerido" } }}
      render={({ field, fieldState: { error } }) => (
        <StyledFormItem required label="EPS">
          <Select
            {...field}
            showSearch
            allowClear
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ]}
            status={error ? "error" : ""}
          />
          <Text type="danger">{error?.message}</Text>
        </StyledFormItem>
      )}
    />
  </Col>

  {/* Pensión */}
  <Col xs={24} sm={6}>
    <Controller
      name="pension"
      control={methods.control}
      rules={{ required: { value: true, message: "Pension es requerido" } }}
      render={({ field, fieldState: { error } }) => (
        <StyledFormItem required label="Pensión">
          <Select
            {...field}
            showSearch
            allowClear
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ]}
            status={error ? "error" : ""}
          />
          <Text type="danger">{error?.message}</Text>
        </StyledFormItem>
      )}
    />
  </Col>

  {/* Tipo de sangre */}
  <Col xs={24} sm={6}>
    <Controller
      name="tipo_sangre"
      control={methods.control}
      rules={{ required: { value: true, message: "Tipo de sangre es requerido" } }}
      render={({ field, fieldState: { error } }) => (
        <StyledFormItem required label="Tipo de sangre">
          <Select
            {...field}
            showSearch
            allowClear
            options={[
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
            ]}
            status={error ? "error" : ""}
          />
          <Text type="danger">{error?.message}</Text>
        </StyledFormItem>
      )}
    />
  </Col>

  {/* Número de hijos */}
  <Col xs={24} sm={6}>
    <Controller
      name="numero_hijos"
      control={methods.control}
      rules={{ required: { value: true, message: "Número de hijos es requerido" } }}
      render={({ field, fieldState: { error } }) => (
        <StyledFormItem required label="Número de hijos">
          <Input
            {...field}
            type="number"
            min={0}
            max={20}
            status={error ? "error" : ""}
          />
          <Text type="danger">{error?.message}</Text>
        </StyledFormItem>
      )}
    />
  </Col>

  {/* Subir fotos */}
  <Col xs={24} sm={24} style={{ marginTop: 16 }}>
    <StyledFormItem label="Fotos">
      <Upload
        multiple
        listType="picture-card"
        beforeUpload={() => false} // evitar upload automático
      >
        <div>Click o arrastrar fotos</div>
      </Upload>
    </StyledFormItem>
  </Col>

    </Row>
  );
};
