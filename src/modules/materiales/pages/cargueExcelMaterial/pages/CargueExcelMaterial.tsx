import { useState, useEffect } from "react";
import {
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import {
  Upload,
  Spin,
  Typography,
  notification,
  Button,
  Card,
  Space,
  Modal,
  Select,
  Form,
  Row,
  Col,
} from "antd";
import * as XLSX from "xlsx";
import { BASE_URL } from "@/config/api";
import { getProyectosMaterial } from "@/services/material/general.API";
import { DescargaPlantillaMaterial } from "../components/DescargarPlantilla/DescargaPlantillaMaterial";

const { Text, Title } = Typography;
const { Option } = Select;

type DataType = {
  key: string;
  codigo: string;
  descripcion: string;
  padre: string;
  um: string;
  cantidad: number;
  subcapitulo: string;
  cant_apu: number;
  rend: number;
  iva: number;
  valor_sin_iva: number;
  tipo_insumo: string;
  agrupacion: string;
};

type ProyectoType = {
  id: number;
  descripcion_proyecto: string;
  tipoProyecto_id: number;
  codigo_proyecto: string;
  uniqueId: string;
};

export const CargueExcelMaterial = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [loadingProyectos, setLoadingProyectos] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [erroresPlano, setErroresPlano] = useState<string[]>([]);
  const [openModalErrores, setOpenModalErrores] = useState<boolean>(false);
  const [proyectos, setProyectos] = useState<ProyectoType[]>([]);
  const [proyectosFiltrados, setProyectosFiltrados] = useState<ProyectoType[]>(
    []
  );
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Cargar proyectos unificados
  useEffect(() => {
    cargarProyectosUnificados();
  }, []);

  const cargarProyectosUnificados = async () => {
    setLoadingProyectos(true);
    try {
      const response = await getProyectosMaterial();

      if (response.data.status === "success") {
        const proyectosConUniqueId = response.data.data.map(
          (proyecto: any) => ({
            ...proyecto,
            uniqueId: `${proyecto.id}-${proyecto.tipoProyecto_id}`,
          })
        );
        setProyectos(proyectosConUniqueId);
      }
    } catch (error) {
      notificationApi.error({
        message: "Error al cargar proyectos",
        duration: 5,
      });
    } finally {
      setLoadingProyectos(false);
    }
  };

  // ✅ Filtrar proyectos por tipo (1 = apartamentos, 2 = casas)
  const handleTipoObraChange = (tipoObra: string) => {
    let tipoId: number;

    if (tipoObra === "apartamentos") {
      tipoId = 1;
    } else if (tipoObra === "casas") {
      tipoId = 2;
    } else {
      setProyectosFiltrados([]);
      form.setFieldValue("proyecto_id", undefined);
      return;
    }

    const filtrados = proyectos.filter(
      (proyecto) => proyecto.tipoProyecto_id === tipoId
    );
    setProyectosFiltrados(filtrados);
    form.setFieldValue("proyecto_id", undefined);
  };

  // ✅ Validar tipo de archivo - SOLO EXCEL
  const validateFileType = (file: File) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      allowedTypes.includes(file.type) ||
      (fileExtension && ["xlsx", "xls"].includes(fileExtension));

    if (!isValidType) {
      notificationApi.error({
        message: "Tipo de archivo no válido",
        description: "Solo se permiten archivos Excel (.xlsx, .xls)",
        duration: 5,
      });
      return false;
    }
    return true;
  };

  // ✅ FUNCIÓN MEJORADA: Auto-rellenar códigos vacíos
  const autoRellenarCodigos = (jsonData: any[]) => {
    let ultimoCodigo = "";

    return jsonData.map((item) => {
      const CODIGO = item.CODIGO?.toString().trim();

      // Si la fila actual tiene código, actualizamos el último código
      if (CODIGO && CODIGO !== "") {
        ultimoCodigo = CODIGO;
      }
      // Si la fila no tiene código pero tenemos un último código, lo usamos
      else if (ultimoCodigo && ultimoCodigo !== "") {
        item.CODIGO = ultimoCodigo;
      }

      return item;
    });
  };

  // ✅ FUNCIÓN MEJORADA: Procesar valores numéricos
  const procesarValorNumerico = (valor: any): number => {
    if (
      valor === null ||
      valor === undefined ||
      valor === "" ||
      valor === " "
    ) {
      return 0;
    }
    const numero = parseFloat(valor.toString().replace(",", "."));
    return isNaN(numero) ? 0 : numero;
  };

  // ✅ FUNCIÓN MEJORADA: Procesar valores de texto
  const procesarValorTexto = (valor: any): string => {
    if (valor === null || valor === undefined) {
      return "";
    }
    return valor.toString().trim();
  };

  // ✅ Procesar archivo Excel CON AUTO-RELLENO
  const handleExcelUpload = (file: File) => {
    const tipoObra = form.getFieldValue("tipo_obra");
    const proyectoUniqueId = form.getFieldValue("proyecto_id");

    // ✅ VALIDACIÓN 1: Verificar que se haya seleccionado proyecto
    if (!tipoObra || !proyectoUniqueId) {
      notificationApi.warning({
        message: "Seleccione tipo de obra y proyecto",
        description: "Debe seleccionar ambos campos antes de cargar el archivo",
        duration: 5,
      });
      return false;
    }

    // ✅ VALIDACIÓN 2: Verificar que sea archivo Excel
    if (!validateFileType(file)) {
      return false;
    }

    setLoader(true);
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        console.log("Datos originales:", jsonData);

        // ✅ APLICAR AUTO-RELLENO DE CÓDIGOS
        jsonData = autoRellenarCodigos(jsonData);

        console.log("Datos después del auto-relleno:", jsonData);

        // ✅ Incluir TODOS los items del módulo 4, tanto padres como hijos
        const filteredData = jsonData.filter((item) => {
          const CODIGO = item.CODIGO?.toString();
          const PADRE = item.PADRE?.toString();

          return (
            (CODIGO && (CODIGO === "4" || CODIGO.startsWith("4."))) ||
            (PADRE && (PADRE === "4" || PADRE.startsWith("4.")))
          );
        });

        const formattedData = filteredData.map((item, index) => ({
          key: `${index}`,
          codigo: procesarValorTexto(item.CODIGO),
          descripcion: procesarValorTexto(item.DESCRIPCION),
          padre: procesarValorTexto(item.PADRE),
          um: procesarValorTexto(item.UM),
          cantidad: procesarValorNumerico(item.CANTIDAD),
          subcapitulo: procesarValorTexto(item.SUBCAPITULO),
          cant_apu: procesarValorNumerico(item["CANT_APU"]),
          rend: procesarValorNumerico(item.REND),
          iva: procesarValorNumerico(item.IVA),
          valor_sin_iva: procesarValorNumerico(item.VALOR_SIN_IVA),
          tipo_insumo: procesarValorTexto(item["TIPO_INSUMO"]),
          agrupacion: procesarValorTexto(item.AGRUPACION),
        }));

        setDataSource(formattedData);
        setFileToUpload(file);
        setPreviewMode(true);
        setUploadSuccess(false);
        setLoader(false);

        console.log("Datos finales formateados:", formattedData);

        notificationApi.success({
          message: "Archivo procesado correctamente",
          description: `Se encontraron ${formattedData.length} registros del módulo 4. Códigos auto-rellenados.`,
          duration: 3,
        });
      } catch (error) {
        setLoader(false);
        notificationApi.error({
          message: "Error al procesar el archivo",
          description: "El formato del archivo no es válido",
          duration: 5,
        });
      }
    };

    reader.onerror = () => {
      setLoader(false);
      notificationApi.error({
        message: "Error al leer el archivo",
        duration: 5,
      });
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  // ✅ Obtener proyecto seleccionado
  const getProyectoSeleccionado = () => {
    const proyectoUniqueId = form.getFieldValue("proyecto_id");
    return proyectos.find((p) => p.uniqueId === proyectoUniqueId);
  };

  // ✅ Extraer ID y código del proyecto seleccionado
  const getProyectoInfo = () => {
    const proyecto = getProyectoSeleccionado();
    if (!proyecto) return { id: null, codigo: null };

    return {
      id: proyecto.id,
      codigo: proyecto.codigo_proyecto,
    };
  };

  // ✅ FUNCIÓN MEJORADA: Resetear completamente el estado
  const resetearEstadoCompleto = () => {
    setPreviewMode(false);
    setDataSource([]);
    setFileToUpload(null);
    setUploadSuccess(false);
    setErroresPlano([]);
    setOpenModalErrores(false);
    // NO resetear el formulario aquí para mantener la selección del proyecto
  };

  // ✅ FUNCIÓN MEJORADA: Cargar nuevo archivo
  const handleNuevoArchivo = () => {
    resetearEstadoCompleto();
    // Mantener la selección actual del proyecto
  };

  // ✅ CONFIRMAR Y SUBIR ARCHIVO CON ID Y CÓDIGO DEL PROYECTO
  const handleConfirmUpload = async () => {
    if (!fileToUpload) return;

    const tipoObra = form.getFieldValue("tipo_obra");
    const proyectoInfo = getProyectoInfo();

    if (!tipoObra || !proyectoInfo.id) {
      notificationApi.error({
        message: "Error de validación",
        description: "Debe seleccionar tipo de obra y proyecto",
        duration: 5,
      });
      return;
    }

    setLoader(true);

    try {
      const formData = new FormData();
      formData.append("archivo", fileToUpload);
      formData.append("tipo_obra", tipoObra);
      formData.append("proyecto_id", proyectoInfo.id.toString());
      formData.append("codigo_proyecto", proyectoInfo.codigo || "");

      console.log("Enviando datos:", {
        tipo_obra: tipoObra,
        proyecto_id: proyectoInfo.id,
        codigo_proyecto: proyectoInfo.codigo,
        archivo: fileToUpload.name,
        registros: dataSource.length,
      });

      const response = await fetch(`${BASE_URL}cargueProyecion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      // ✅ MEJOR MANEJO DE RESPUESTAS
      if (data.status === "error") {
        if (data.errores && data.errores.length > 0) {
          setErroresPlano(data.errores);
          setOpenModalErrores(true);
        } else {
          throw new Error(data.message || "Error del servidor");
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      // ✅ ÉXITO - Mostrar mensaje y resetear estado
      notificationApi.success({
        message: "Archivo subido exitosamente",
        description: `Se han cargado ${
          data.cantidad || dataSource.length
        } registros del módulo 4 al proyecto ${proyectoInfo.codigo}`,
        duration: 5,
      });

      setUploadSuccess(true);

      // ✅ NO resetear el formulario para mantener la selección del proyecto
      // Solo resetear los datos del archivo
      setDataSource([]);
      setFileToUpload(null);
    } catch (error: any) {
      console.error("Error en upload:", error);
      notificationApi.error({
        message: "Error al subir el archivo",
        description: error.message || "Error de conexión con el servidor",
        duration: 5,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleCancelUpload = () => {
    resetearEstadoCompleto();
  };

  // ✅ Columnas de la tabla
  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      width: 100,
      render: (codigo: string) => (
        <Text strong={!!codigo && codigo !== ""}>
          {codigo || <Text type="secondary">(auto)</Text>}
        </Text>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Padre",
      dataIndex: "padre",
      key: "padre",
      width: 80,
    },
    {
      title: "UM",
      dataIndex: "um",
      key: "um",
      width: 80,
    },
    {
      title: "CANTIDAD",
      dataIndex: "cantidad",
      key: "cantidad",
      width: 100,
      render: (value: number) =>
        value?.toLocaleString("es-ES", { maximumFractionDigits: 4 }) || "0",
    },
    {
      title: "SUBCAPITULO",
      dataIndex: "subcapitulo",
      key: "subcapitulo",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Cant APU",
      dataIndex: "cant_apu",
      key: "cant_apu",
      width: 100,
      render: (value: number) =>
        value?.toLocaleString("es-ES", { maximumFractionDigits: 4 }) || "0",
    },
    {
      title: "Rend",
      dataIndex: "rend",
      key: "rend",
      width: 100,
      render: (value: number) =>
        value?.toLocaleString("es-ES", { maximumFractionDigits: 4 }) || "0",
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva",
      width: 80,
      render: (value: number) => (value ? `${value}%` : "0%"),
    },
    {
      title: "VrUnitSinIVA",
      dataIndex: "valor_sin_iva",
      key: "valor_sin_iva",
      width: 120,
      render: (value: number) =>
        value
          ? `$${value.toLocaleString("es-ES", { maximumFractionDigits: 2 })}`
          : "$0",
    },
    {
      title: "Tipo Insumo",
      dataIndex: "tipo_insumo",
      key: "tipo_insumo",
      width: 100,
    },
    {
      title: "Agrupacion",
      dataIndex: "agrupacion",
      key: "agrupacion",
      width: 200,
      ellipsis: true,
    },
  ];

  // ✅ Determinar si el botón de upload debe estar deshabilitado
  const isUploadDisabled = !form.getFieldValue("proyecto_id");

  return (
    <>
      {contextHolder}
      <Card
        title={
          <Space>
            <UploadOutlined />
            <span>Cargue de Presupuesto - Módulo 4 (OBRA ELÉCTRICA)</span>
          </Space>
        }
      >
        <Spin spinning={loader || loadingProyectos}>
          {!previewMode ? (
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Formulario de selección */}
              <Card size="small" title="Selección de Proyecto">
                <Form form={form} layout="vertical">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Tipo de Obra"
                        name="tipo_obra"
                        rules={[
                          {
                            required: true,
                            message: "Seleccione el tipo de obra",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Seleccione tipo de obra"
                          onChange={handleTipoObraChange}
                          allowClear
                        >
                          <Option value="apartamentos">Apartamentos</Option>
                          <Option value="casas">Casas</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Proyecto"
                        name="proyecto_id"
                        rules={[
                          { required: true, message: "Seleccione el proyecto" },
                        ]}
                      >
                        <Select
                          placeholder={
                            form.getFieldValue("tipo_obra")
                              ? "Seleccione proyecto"
                              : "Primero seleccione tipo de obra"
                          }
                          loading={loadingProyectos}
                          disabled={!form.getFieldValue("tipo_obra")}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.children ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {proyectosFiltrados.map((proyecto) => (
                            <Option
                              key={proyecto.uniqueId}
                              value={proyecto.uniqueId}
                            >
                              {proyecto.descripcion_proyecto} (
                              {proyecto.codigo_proyecto})
                              {proyecto.tipoProyecto_id === 1
                                ? " - Apartamentos"
                                : " - Casas"}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>

              {/* Upload section */}
              <Card size="small" title="Cargar Archivo Excel">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text type="secondary">
                    Seleccione el archivo Excel con el presupuesto. Solo se
                    cargarán los items del Módulo 4 (OBRA ELÉCTRICA)
                  </Text>

                  <Upload
                    accept=".xlsx,.xls"
                    beforeUpload={handleExcelUpload}
                    showUploadList={false}
                    disabled={isUploadDisabled}
                  >
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      disabled={isUploadDisabled}
                    >
                      {isUploadDisabled
                        ? "Seleccione un proyecto primero"
                        : "Seleccionar Archivo Excel de Presupuesto"}
                    </Button>
                    <DescargaPlantillaMaterial />
                  </Upload>

                  {isUploadDisabled && (
                    <Text type="warning" style={{ fontSize: "12px" }}>
                      Debe seleccionar un proyecto antes de cargar el archivo
                    </Text>
                  )}

                  <Text type="warning" style={{ fontSize: "12px" }}>
                    <strong>Nota:</strong> Los códigos vacíos se auto-rellenarán
                    automáticamente
                  </Text>

                  {/* ✅ MOSTRAR BOTÓN PARA NUEVO ARCHIVO DESPUÉS DE ÉXITO */}
                  {uploadSuccess && (
                    <Button
                      type="dashed"
                      icon={<RedoOutlined />}
                      onClick={handleNuevoArchivo}
                      style={{ marginTop: 16 }}
                    >
                      Cargar Nuevo Archivo
                    </Button>
                  )}
                </Space>
              </Card>
            </Space>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>
                  Vista previa - Módulo 4 OBRA ELÉCTRICA ({dataSource.length}{" "}
                  registros)
                </Title>
                <Text type="secondary">
                  Revise los datos antes de confirmar el cargue al proyecto.
                  <Text type="warning">
                    {" "}
                    Los códigos vacíos se auto-rellenaron.
                  </Text>
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong>Tipo de Obra: </Text>
                  <Text>{form.getFieldValue("tipo_obra")}</Text>
                  <Text strong style={{ marginLeft: 16 }}>
                    Proyecto:{" "}
                  </Text>
                  <Text>
                    {getProyectoSeleccionado()?.descripcion_proyecto} (
                    {getProyectoSeleccionado()?.codigo_proyecto})
                  </Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text strong>ID Proyecto: </Text>
                  <Text>{getProyectoInfo().id}</Text>
                  <Text strong style={{ marginLeft: 16 }}>
                    Código Proyecto:{" "}
                  </Text>
                  <Text>{getProyectoInfo().codigo}</Text>
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} de ${total} items`,
                }}
                scroll={{ x: 1500, y: 400 }}
                bordered
                size="small"
                sticky
              />

              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleConfirmUpload}
                  size="large"
                  loading={loader}
                >
                  Confirmar Cargue al Proyecto
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancelUpload}
                  size="large"
                  disabled={loader}
                >
                  Cancelar
                </Button>
              </Space>
            </Space>
          )}
        </Spin>
      </Card>

      {/* Modal de Errores */}
      <Modal
        title="Errores en el archivo"
        open={openModalErrores}
        onCancel={() => setOpenModalErrores(false)}
        footer={[
          <Button key="close" onClick={() => setOpenModalErrores(false)}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {erroresPlano.map((error, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <Text type="danger">• {error}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
