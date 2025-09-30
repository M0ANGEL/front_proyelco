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
  Card,
  Image,
  Space,
  Divider,
} from "antd";
import { UploadOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
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
const { Meta } = Card;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();
  const [selectCargo, setselectCargo] = useState<SelectProps["options"]>([]);
  const [ciudades, setCiudades] = useState<SelectProps["options"]>([]);
  const [paises, setPaises] = useState<SelectProps["options"]>([]);
  const [contratista, setContratista] = useState<SelectProps["options"]>([]);
  const [fotos, setFotos] = useState<any[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const minimo = useWatch({ control: methods.control, name: "salarioMinimo" });

  const buscarEmpleado = async (cedula: string) => {
    if (!cedula) return;
    try {
      const { data } = await getEmpleadoByCedula(cedula);
      if (data) {
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

  const fetchPais = () => {
    paisesTH().then(({ data: { data } }) => {
      const pais = data.map((item) => ({
        label: item.pais.toUpperCase(),
        value: item.id,
      }));
      setPaises(pais);
    });
  };

  const fetchContratistas = () => {
    getContratistas().then(({ data: { data } }) => {
      const pais = data.map((item) => ({
        label: item.contratista.toUpperCase(),
        value: item.id,
      }));
      setContratista(pais);
    });
  };

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

  const handleUpload = (info: any) => {
    const fileList = info.fileList;
    setFotos(fileList);

    // Mostrar preview de la última foto subida
    if (fileList.length > 0) {
      const lastFile = fileList[fileList.length - 1];
      if (lastFile.originFileObj) {
        const url = URL.createObjectURL(lastFile.originFileObj);
        setFotoPreview(url);
      }
    }
  };

  const formatNumber = (value: string) => {
    if (!value) return "";
    const numericValue = value.replace(/\./g, "");
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("es-CO").format(number);
  };

  return (
    <Row gutter={[24, 16]}>
      {/* Columna izquierda - Formulario */}
      <Col xs={24} lg={16}>
        <Card
          title="Información Básica del Empleado"
          bordered={false}
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <Row gutter={[16, 12]}>
            {/* Primera fila - Cédula y búsqueda */}
            <Col xs={24} md={12}>
              <Controller
                name="identificacion"
                control={methods.control}
                rules={{
                  required: { value: true, message: "Cédula es requerida" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cédula">
                    <Input
                      {...field}
                      maxLength={20}
                      status={error && "error"}
                      style={{ textTransform: "uppercase" }}
                      placeholder="Ingrese cédula y presione Enter o Tab"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Tab") {
                          e.preventDefault(); // Evita que tabule sin ejecutar
                          buscarEmpleado(field.value); // Ejecuta la búsqueda
                        }
                      }}
                      suffix={<UserOutlined />}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} md={6}>
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

            <Col xs={24} md={6}>
              <Controller
                name="genero"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Género">
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

            {/* Información personal */}
            <Col xs={24} md={12}>
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

            <Col xs={24} md={6}>
              <Controller
                name="fecha_expedicion"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Fecha Expedición">
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

            <Col xs={24} md={6}>
              <Controller
                name="estado_civil"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Estado Civil">
                    <Select
                      {...field}
                      showSearch
                      disabled
                      allowClear
                      options={[
                        { value: "soltero", label: "SOLTERO" },
                        { value: "casado", label: "CASADO" },
                        { value: "union libre", label: "UNIÓN LIBRE" },
                      ]}
                      status={error ? "error" : ""}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            {/* Ubicación */}
            <Col xs={24} md={8}>
              <Controller
                name="pais_residencia_id"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="País Residencia">
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

            <Col xs={24} md={8}>
              <Controller
                name="ciudad_resudencia_id"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Ciudad Residencia">
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

            <Col xs={24} md={8}>
              <Controller
                name="ciuda_expedicion_id"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Ciudad Expedición">
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

            {/* Contacto */}
            <Col xs={24} md={8}>
              <Controller
                name="telefono_fijo"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Teléfono Fijo">
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

            <Col xs={24} md={8}>
              <Controller
                name="telefono_celular"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Teléfono Celular">
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

            <Col xs={24} md={8}>
              <Controller
                name="correo"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Correo Electrónico">
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

            <Col xs={24}>
              <Controller
                name="direccion"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Dirección">
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

            <Divider />

            {/* Información laboral */}
            <Col xs={24} md={8}>
              <Controller
                name="cargo_id"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cargo">
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

            <Col xs={24} md={8}>
              <Controller
                name="contratista_id"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Contratista es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Contratista">
                    <Select
                      {...field}
                      status={error && "error"}
                      options={contratista}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} md={8}>
              <Controller
                name="salarioMinimo"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Salario Mínimo">
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

            <Col xs={24} md={12}>
              <Controller
                name="salario"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Salario">
                    <Input
                      disabled
                      value={formatNumber(field.value)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, "");
                        field.onChange(rawValue);
                      }}
                      maxLength={50}
                      placeholder="0"
                      status={error && "error"}
                      prefix="$"
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Controller
                name="fecha_nacimiento"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Fecha Nacimiento">
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

            {/* Información adicional */}
            <Col xs={24} md={6}>
              <Controller
                name="eps"
                control={methods.control}
                rules={{
                  required: { value: true, message: "EPS es requerido" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="EPS">
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      options={[
                        { value: "SURA", label: "SURA" },
                        { value: "ETC", label: "ETC" },
                      ]}
                      status={error ? "error" : ""}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} md={6}>
              <Controller
                name="pension"
                control={methods.control}
                rules={{
                  required: { value: true, message: "Pensión es requerido" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Pensión">
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      options={[
                        { value: "PROVENIR", label: "PROVENIR" },
                        { value: "ETC", label: "ETC" },
                      ]}
                      status={error ? "error" : ""}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} md={6}>
              <Controller
                name="tipo_sangre"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Tipo de sangre es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo de Sangre">
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

            <Col xs={24} md={6}>
              <Controller
                name="numero_hijos"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Número de hijos es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Número de Hijos">
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
          </Row>
        </Card>
      </Col>

      {/* Columna derecha - Foto y upload */}
      <Col xs={24} lg={8}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* Preview de foto */}
          <Card
            title="Fotografía"
            bordered={false}
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            cover={
              fotoPreview ? (
                <Image
                  alt="Preview"
                  src={fotoPreview}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                  placeholder={
                    <div
                      style={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EyeOutlined style={{ fontSize: "24px" }} />
                    </div>
                  }
                />
              ) : (
                <div
                  style={{
                    height: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <UserOutlined
                    style={{ fontSize: "48px", color: "#d9d9d9" }}
                  />
                </div>
              )
            }
          >
            <Meta
              description={
                fotoPreview
                  ? "Vista previa de la fotografía seleccionada"
                  : "No hay fotografía seleccionada"
              }
            />
          </Card>

          {/* Upload de fotos */}
          <Card
            title="Subir Fotografías"
            bordered={false}
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            <Upload
              multiple
              listType="picture"
              beforeUpload={() => false}
              onChange={handleUpload}
              fileList={fotos}
              accept="image/*"
            >
              <div style={{ padding: "20px", textAlign: "center" }}>
                <UploadOutlined
                  style={{ fontSize: "32px", color: "#1890ff" }}
                />
                <div style={{ marginTop: 8 }}>
                  Click o arrastra las fotos aquí
                </div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Formatos soportados: JPG, PNG, GIF
                </Text>
              </div>
            </Upload>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};
