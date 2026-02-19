import {
  Alert,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Tooltip,
  Form,
  Button,
  message,
  Spin,
  Card,
  InputNumber,
} from "antd";
import {
  InfoCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";
import {
  getProyectosCodigo,
  getTorresManzasDisponibles,
} from "@/services/documentacion/documentacionAPI";
import { StyledFormItem } from "@/components/layout/styled";

interface FormData {
  codigo_proyecto: string;
  operadorRed: string;
  requiereOrganismos: string; // "1" para SI, "2" para NO
  organismoInspeccion?: string[]; // Array de organismos seleccionados
  etapaProyecto: string;
  codigoDocumentos: string;
  fechaEntrega: any;
  nombre_etapa: string;
  numeroContrato?: string;
  responsable?: string;
  descripcion?: string;
  requiereTorres?: string; // "1" para SI, "2" para NO
  torres?: string[]; // Torres seleccionadas
  cantidad_tm?: number; // Cantidad de torres/manzanas para OI
}

interface ProyectoOption {
  label: string;
  value: string;
  descripcion?: string;
}

interface TorresManzanasOption {
  label: string;
  value: string;
  id?: number;
}

export const CrearDocumentacionRed = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingProyectos, setLoadingProyectos] = useState(false);
  const [selectProyecto, setSelectProyecto] = useState<ProyectoOption[]>([]);
  const [selectToMaDisponibles, setSelectToMaDisponibles] = useState<TorresManzanasOption[]>([]);
  const [selectedOrganismo, setSelectedOrganismo] = useState<string>("");
  const [selectedTorres, setSelectedTorres] = useState<string>("");
  const [loadingTorres, setLoadingTorres] = useState(false);

  const opcionOperadorRed = [
    { value: "1", label: "EMCALI" },
    { value: "2", label: "CELSIA" },
  ];

  const RequeireOpcionOrganismo = [
    { value: "1", label: "SI" },
    { value: "2", label: "NO" },
  ];

  const RequeireOpcionTorres = [
    { value: "1", label: "SI" },
    { value: "2", label: "NO" },
  ];

  const organismoSI = selectedOrganismo === "1";
  const torresSi = selectedTorres === "1";

  const opcionOrganismo = [
    { value: "1", label: "RETIE" },
    { value: "2", label: "RITEL" },
    { value: "3", label: "RETILAP" },
  ];

  const opcionEtapa = [
    { value: "1", label: "ET1" },
    { value: "2", label: "ET2" },
    { value: "3", label: "ET3" },
    { value: "4", label: "ET4" },
    { value: "5", label: "ET5" },
    { value: "6", label: "ET6" },
    { value: "7", label: "ET7" },
    { value: "8", label: "ET8" },
    { value: "9", label: "ET9" },
    { value: "10", label: "ET10" },
    { value: "11", label: "ET11" },
    { value: "12", label: "ET12" },
    { value: "13", label: "ET13" },
    { value: "14", label: "ET14" },
    { value: "15", label: "ET15" },
    { value: "16", label: "ET16" },
    { value: "17", label: "ET17" },
    { value: "18", label: "ET18" },
    { value: "19", label: "ET19" },
    { value: "20", label: "ET20" },
    { value: "21", label: "ET21" },
    { value: "22", label: "ET22" },
    { value: "23", label: "ET23" },
    { value: "24", label: "ET24" },
    { value: "25", label: "ET25" },
    { value: "26", label: "ET26" },
    { value: "27", label: "ET27" },
    { value: "28", label: "ET28" },
    { value: "29", label: "ET29" },
    { value: "30", label: "ET30" },
  ];

  // Manejo de torres o manzanas disponibles
  const handleProyectoChange = async (value: string) => {
    // Limpiar torres seleccionadas
    form.setFieldValue("torres", []);
    setSelectToMaDisponibles([]);

    if (!value) return;

    try {
      setLoadingTorres(true);

      const response = await getTorresManzasDisponibles(value);

      if (response.data.status === "success") {
        const opciones = response.data.data.map((item: any) => ({
          label: item.nombre_torre ?? item.nombre_manzana,
          value: item.nombre_torre ?? item.nombre_manzana,
          id: item.id,
        }));

        setSelectToMaDisponibles(opciones);
        
        if (opciones.length === 0) {
          message.info("El proyecto seleccionado no tiene torres o manzanas disponibles");
        }
      } else {
        message.warning("No hay torres/manzanas disponibles para este proyecto");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al cargar torres/manzanas disponibles");
    } finally {
      setLoadingTorres(false);
    }
  };

  // Función mejorada para enviar datos a la API
  const enviarDatosAPI = async (datos: FormData): Promise<any> => {
    try {
      setLoading(true);

      // Validaciones antes del envío
      const errores = validarDatosEnvio(datos);
      if (errores.length > 0) {
        throw new Error(errores.join(", "));
      }

      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error(
          "Sesión expirada. Por favor, inicie sesión nuevamente."
        );
      }

      // Preparar datos para enviar
      const datosEnviar = {
        ...datos,
        organismoInspeccion: organismoSI ? datos.organismoInspeccion : null,
        torres: torresSi ? datos.torres : null,
        fechaEntrega: datos.fechaEntrega
          ? datos.fechaEntrega.format("YYYY-MM-DD")
          : null,
        fechaCreacion: new Date().toISOString(),
        usuarioId: obtenerUsuarioId(),
      };

      // Configurar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${BASE_URL}StoreDocumentacionRed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosEnviar),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parsear respuesta
      const resultado = await response.json();

      // Manejar errores de la API
      if (!response.ok || resultado.status === "error") {
        const mensajeError =
          resultado.message ||
          `Error ${response.status}: ${response.statusText}`;
        throw new Error(mensajeError);
      }

      // Validar respuesta exitosa
      if (resultado.status !== "success") {
        throw new Error("Respuesta inesperada del servidor");
      }

      return resultado;
    } catch (error: any) {
      console.error("Error al enviar datos:", error);

      // Mensajes de error específicos
      if (error.name === "AbortError") {
        throw new Error(
          "La solicitud tardó demasiado tiempo. Por favor, intente nuevamente."
        );
      }

      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Error de conexión. Verifique su internet e intente nuevamente."
        );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Validar datos antes del envío
  const validarDatosEnvio = (datos: FormData): string[] => {
    const errores: string[] = [];

    if (!datos.codigo_proyecto) errores.push("Proyecto es requerido");
    if (!datos.operadorRed) errores.push("Operador de red es requerido");
    if (!datos.requiereOrganismos)
      errores.push("Debe indicar si requiere organismo de inspección");
    if (!datos.etapaProyecto) errores.push("Etapa del proyecto es requerida");
    if (!datos.codigoDocumentos?.trim())
      errores.push("Código de documentos es requerido");
    if (!datos.fechaEntrega) errores.push("Fecha de entrega es requerida");
    if (!datos.nombre_etapa?.trim())
      errores.push("Nombre de la etapa es requerido");

    // Validación condicional: Organismo de inspección
    if (organismoSI) {
      if (!datos.organismoInspeccion || datos.organismoInspeccion.length === 0) {
        errores.push(
          "Organismo de inspección es requerido cuando se selecciona 'SI'"
        );
      }
      if (!datos.cantidad_tm && datos.cantidad_tm !== 0) {
        errores.push("Cantidad de torres/manzanas es requerida para OI");
      }
    }

    // Validación condicional: Torres
    if (torresSi) {
      if (!datos.torres || datos.torres.length === 0) {
        errores.push(
          "Debe seleccionar al menos una torre/manzana cuando requiere torres"
        );
      }
    }

    if (datos.codigoDocumentos && datos.codigoDocumentos.length > 20) {
      errores.push("Código de documentos no puede exceder 20 caracteres");
    }

    if (datos.nombre_etapa && datos.nombre_etapa.length > 199) {
      errores.push("Nombre de la etapa no puede exceder 199 caracteres");
    }

    return errores;
  };

  // Obtener ID de usuario
  const obtenerUsuarioId = (): string | null => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData).id : null;
    } catch {
      return null;
    }
  };

  // Cargar proyectos
  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setLoadingProyectos(true);
      const response = await getProyectosCodigo();

      if (response.data.status === "success") {
        const proyectos = response.data.data.map((item: any) => ({
          label: `${item.descripcion_proyecto} `,
          value: item.codigo_proyecto,
          descripcion: item.descripcion_proyecto,
        }));
        setSelectProyecto(proyectos);
      } else {
        message.warning("No se pudieron cargar los proyectos");
      }
    } catch (error: any) {
      console.error("Error al cargar proyectos:", error);
      message.error("Error al cargar la lista de proyectos");
    } finally {
      setLoadingProyectos(false);
    }
  };

  // Manejar cambio en "Requiere Organismo"
  const handleOrganismoChange = (value: string) => {
    setSelectedOrganismo(value);

    // Si se cambia a "NO", limpiar el campo organismoInspeccion y cantidad
    if (value === "2") {
      form.setFieldValue("organismoInspeccion", undefined);
      form.setFieldValue("cantidad_tm", undefined);
    }
  };

  // Manejar cambio en "Requiere Torres"
  const handleTorreChange = (value: string) => {
    setSelectedTorres(value);

    // Si se cambia a "NO", limpiar el campo torres
    if (value === "2") {
      form.setFieldValue("torres", undefined);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (values: FormData) => {
    try {
      const resultado = await enviarDatosAPI(values);

      // Mostrar mensaje de éxito específico
      const mensajeExito =
        resultado.message || "Documentación creada exitosamente";
      message.success(mensajeExito);

      // Resetear formulario
      form.resetFields();
      setSelectedOrganismo(""); // Resetear el estado
      setSelectedTorres(""); // Resetear el estado
      setSelectToMaDisponibles([]); // Limpiar torres disponibles
    } catch (error: any) {
      console.error("Error al crear documentación:", error);

      // Mensajes de error específicos
      if (error.message.includes("ya tinene una")) {
        message.error(error.message);
      } else if (error.message.includes("Sesión expirada")) {
        message.error(error.message);
        // Opcional: redirigir al login
      } else if (error.message.includes("Error de conexión")) {
        message.error(error.message);
      } else {
        message.error(
          error.message ||
            "Error al crear la documentación. Por favor, intente nuevamente."
        );
      }
    }
  };

  // Manejar errores de validación
  const handleFailedSubmit = (errorInfo: any) => {
    const camposFaltantes = errorInfo.errorFields
      .map((field: any) => field.name[0])
      .join(", ");
    message.warning(`Complete los campos requeridos: ${camposFaltantes}`);
  };

  // Recargar proyectos
  const handleRecargarProyectos = () => {
    cargarProyectos();
  };

  return (
    <Card
      title="Crear Documentación de Red"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={handleFailedSubmit}
        autoComplete="off"
        disabled={loading}
      >
        <Row gutter={[16, 16]}>
          {/* Alerta informativa */}
          <Col span={24}>
            <Alert
              message="Configuración de Documentación de Red"
              type="info"
              showIcon
              description="Complete todos los campos obligatorios (*) para crear la documentación del proyecto."
            />
          </Col>

          {/* Proyecto */}
          <Col xs={24} sm={12} md={8}>
            <StyledFormItem
              name="codigo_proyecto"
              label={
                <span>
                  Proyecto
                  <Tooltip title="Seleccione el proyecto para la documentación">
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Seleccione un proyecto" }]}
              required
            >
              <Select
                options={selectProyecto}
                placeholder={
                  loadingProyectos
                    ? "Cargando proyectos..."
                    : "Seleccione proyecto"
                }
                allowClear
                showSearch
                loading={loadingProyectos}
                onChange={handleProyectoChange}
                onClear={() => {
                  setSelectToMaDisponibles([]);
                  form.setFieldValue("torres", []);
                }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                notFoundContent={
                  loadingProyectos ? (
                    <Spin size="small" />
                  ) : (
                    "No se encontraron proyectos"
                  )
                }
                suffixIcon={
                  <ReloadOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecargarProyectos();
                    }}
                    style={{ cursor: "pointer" }}
                    title="Recargar proyectos"
                  />
                }
                disabled={loadingProyectos}
              />
            </StyledFormItem>
          </Col>

          {/* Operador de red */}
          <Col xs={24} sm={12} md={6}>
            <StyledFormItem
              name="operadorRed"
              label="Operador de Red"
              rules={[{ required: true, message: "Seleccione el operador" }]}
              required
            >
              <Select
                options={opcionOperadorRed}
                placeholder="Seleccione operador"
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* ¿REQUIERE ORGANISMO? */}
          <Col xs={24} sm={12} md={4}>
            <StyledFormItem
              name="requiereOrganismos"
              label={
                <span>
                  ¿Requiere Organismo?
                  <Tooltip title="Indique si esta documentación requiere organismo de inspección (OI)">
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Seleccione una opción" }]}
              required
            >
              <Select
                options={RequeireOpcionOrganismo}
                placeholder="SI / NO"
                onChange={handleOrganismoChange}
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* Organismo de inspección - CONDICIONAL */}
          {organismoSI && (
            <>
              <Col xs={24} sm={12} md={6}>
                <StyledFormItem
                  name="organismoInspeccion"
                  label="Organismo de Inspección (OI)"
                  rules={[
                    {
                      required: true,
                      message: "Seleccione el organismo de inspección",
                    },
                  ]}
                  required
                >
                  <Select
                    mode="multiple"
                    options={opcionOrganismo}
                    placeholder="Seleccione organismo(s)"
                    allowClear
                  />
                </StyledFormItem>
              </Col>

              {/* Cantidad de torres o manzanas para OI */}
              <Col xs={24} sm={12} md={4}>
                <StyledFormItem
                  name="cantidad_tm"
                  label="Número de Torres o Manzanas (OI)"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  required
                >
                  <InputNumber
                    placeholder="Número de Torres o Manzanas"
                    style={{ width: "100%" }}
                    min={1}
                    max={100}
                  />
                </StyledFormItem>
              </Col>
            </>
          )}

          {/* Etapa del proyecto */}
          <Col xs={24} sm={12} md={organismoSI ? 6 : 8}>
            <StyledFormItem
              name="etapaProyecto"
              label="Etapa del Proyecto"
              rules={[{ required: true, message: "Seleccione la etapa" }]}
              required
            >
              <Select
                options={opcionEtapa}
                placeholder="Seleccione etapa"
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* ¿REQUIERE TORRES? */}
          <Col xs={24} sm={12} md={4}>
            <StyledFormItem
              name="requiereTorres"
              label={
                <span>
                  ¿Requiere Torres?
                  <Tooltip title="Indique si esta documentación requiere seleccionar torres o manzanas">
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: "Seleccione una opción" }]}
              required
            >
              <Select
                options={RequeireOpcionTorres}
                placeholder="SI / NO"
                onChange={handleTorreChange}
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* Torres / Manzanas - CONDICIONAL */}
          {torresSi && (
            <Col xs={24} sm={12} md={6}>
              <StyledFormItem
                name="torres"
                label="Torres / Manzanas Etapa"
                rules={[
                  {
                    required: torresSi,
                    message: "Seleccione al menos una Torre",
                  },
                ]}
                required={torresSi}
              >
                <Select
                  mode="multiple"
                  options={selectToMaDisponibles}
                  placeholder={
                    loadingTorres 
                      ? "Cargando torres..." 
                      : selectToMaDisponibles.length === 0
                      ? "No hay torres disponibles"
                      : "Seleccione Torre(s)"
                  }
                  allowClear
                  loading={loadingTorres}
                  disabled={loadingTorres || selectToMaDisponibles.length === 0}
                  notFoundContent={
                    loadingTorres ? (
                      <Spin size="small">Cargando...</Spin>
                    ) : (
                      "No hay torres/manzanas disponibles"
                    )
                  }
                />
              </StyledFormItem>
            </Col>
          )}

          {/* Mensaje cuando no hay torres disponibles */}
          {torresSi && selectToMaDisponibles.length === 0 && !loadingTorres && (
            <Col span={24}>
              <Alert
                message="No hay torres disponibles"
                description="El proyecto seleccionado no tiene torres o manzanas asociadas. Puede continuar sin seleccionar torres o cambiar de proyecto."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </Col>
          )}

          {/* Código de documentos */}
          <Col xs={24} sm={12} md={8}>
            <StyledFormItem
              name="codigoDocumentos"
              label="Código de Documentos"
              rules={[
                { required: true, message: "Ingrese el código de documentos" },
                { max: 20, message: "Máximo 20 caracteres" },
                {
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message: "Solo letras, números, guiones y guiones bajos",
                },
              ]}
              required
            >
              <Input
                showCount
                maxLength={20}
                placeholder="Ej: DOC-001-2024"
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* Fecha de entrega del proyecto */}
          <Col xs={24} sm={12} md={8}>
            <StyledFormItem
              name="fechaEntrega"
              label={
                <span>
                  Fecha de Entrega del Proyecto
                  <Tooltip title="Fecha límite para la entrega de toda la documentación">
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, color: "#1890ff" }}
                    />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: "Seleccione la fecha de entrega" },
              ]}
              required
            >
              <DatePicker
                placeholder="Seleccione fecha"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </StyledFormItem>
          </Col>

          {/* Nombre de la etapa */}
          <Col span={24}>
            <StyledFormItem
              name="nombre_etapa"
              label="Nombre de la Etapa"
              rules={[
                { required: true, message: "Ingrese el nombre de la etapa" },
                { max: 199, message: "Máximo 199 caracteres" },
              ]}
              required
            >
              <Input.TextArea
                rows={3}
                placeholder="Ej: Proyecto ET1 (Torres 1, 2, 7) - Documentación técnica inicial"
                showCount
                maxLength={199}
                allowClear
              />
            </StyledFormItem>
          </Col>

          {/* Botones de acción */}
          <Col span={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setSelectedOrganismo("");
                  setSelectedTorres("");
                  setSelectToMaDisponibles([]);
                }}
                disabled={loading}
                icon={<ReloadOutlined />}
              >
                Limpiar Formulario
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                style={{
                  background: "#1890ff",
                  borderColor: "#1890ff",
                  minWidth: "120px",
                }}
              >
                {loading ? "Creando..." : "Crear Documentación"}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};