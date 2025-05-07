/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  notification as notification,
  Row,
  Col,
  Layout,
  Select,
  Form,
  Button,
  SelectProps,
} from "antd";
import { TrasladosActivos } from "@/services/types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import {
  getListaTrasladoActivosFiltrados,
  getListaTrasladosActivos,
} from "@/services/activos/trasladosActivosAPI";
import {
  getBodegasLocalizaciones,
  getUsuariosLista,
} from "@/services/activos/activosAPI";
import { AxiosError } from "axios";
import { StyledWrapper } from "../FormInformesActivos/style";

let timeout: ReturnType<typeof setTimeout> | null;
const { Option } = Select;

export const FormInformesTraslados = () => {
  const [notificationApi, contextHolder] = notification.useNotification();

  const [trasladosActivos, setTrasladosActivos] = useState<TrasladosActivos[]>(
    []
  );

  const [optionsUsuarios, setOptionsUsuarios] = useState<
    SelectProps["options"]
  >([]);
  const [optionsBodega, setOptionsBodega] = useState<SelectProps["options"]>(
    []
  );

  const [searchInput] = useState("");
  const [, setLoaderTable] = useState<boolean>(true);

  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [selectedBodegas, setSelectedBodegas] = useState<string[]>([]);

  const [selectedEstado, setSelectedEstado] = useState<string[]>([]);

  const control = useForm();

  const [, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();

  useEffect(() => {
    fetchGeneralData();
  }, [searchInput, selectedBodegas, selectedUsuarios, selectedEstado]);

  const fetchGeneralData = async () => {
    setLoaderTable(true);

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(async () => {
      try {
        // Ejecuta las tres llamadas a la API en paralelo
        const [trasladosResponse, usuariosResponse, bodegasResponse] =
          await Promise.all([
            getListaTrasladosActivos(),
            getUsuariosLista(),
            getBodegasLocalizaciones(),
          ]);

        // Maneja las respuestas de cada una de las llamadas
        setTrasladosActivos(trasladosResponse.data);
        setOptionsUsuarios(
          usuariosResponse.data.map((user) => ({
            value: user.id,
            label: user.nombre,
          }))
        );
        setOptionsBodega(
          bodegasResponse.data.map((bodega) => ({
            value: bodega.id,
            label: bodega.bod_nombre,
          }))
        );

        // Configura la paginación si es necesaria solo para traslados
        setPagination({
          total: trasladosResponse.total,
          per_page: trasladosResponse.per_page,
        });
      } catch (error: any) {
        notificationApi.error({
          message: "Error",
          description:
            error.response?.data?.message ||
            "Ocurrió un error al cargar los datos.",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  const uniqueEstado = Array.from(
    new Set(trasladosActivos.map((trasladoActivo) => trasladoActivo.estado))
  );

  const handleGenerateReport = async () => {
    const filtros = {
      bodegaOrigen: control.getValues("bodega_origen"),
      bodegaDestino: control.getValues("bodega_destino"),
      usuarioOrigen: control.getValues("user_origen"),
      usuarioDestino: control.getValues("user_destino"),
      estado: control.getValues("estado"),
    };

    try {
      const response = await getListaTrasladoActivosFiltrados(filtros);

      notificationApi.success({
        message: "Informe Generado",
        description: "El informe se ha generado correctamente.",
      });

      exportToExcel(response.data, "Informe_Activos");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Si hay una respuesta de error desde el backend, muestra el mensaje
        const { message } = error.response.data;
        notificationApi.error({
          message: `Error`,
          description: message || "Ocurrió un error en el servidor.",
        });
      } else {
        // Si es otro tipo de error
        notificationApi.error({
          message: "Error",
          description: "Ocurrió un error inesperado.",
        });
      }
    }
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const formattedData = data.map((activo) => ({
      Id: activo.id,
      "ID Activo": activo.id_activo,
      "Fecha Traslado": activo.fecha_traslado,
      "Bodega origen": activo.bodega_origen_info?.bod_nombre || "N/A",
      "Bodega destino": activo.bodega_destino_info?.bod_nombre || "N/A",

      "usuario origen": activo.user_origen_info?.nombre || "N/A",
      "usuario destino": activo.user_destino_info?.nombre || "N/A",
      estado: activo.estado || "N/A",
      "fecha recibido": activo.fecha_recibido || "N/A",
      descripcion: activo.descripcion || "descripcionA",
    }));

    // Crea una nueva hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Crea un nuevo libro de trabajo (workbook) y añade la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Genera un archivo de tipo 'xlsx' y lo descarga
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Layout>
      {contextHolder}
      <Form layout="vertical">
        <StyledCard title=" Informe Traslados">
        <StyledWrapper>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Filtrar por usuario origen">
                <Controller
                  name="user_origen"
                  control={control.control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Filtrar por usuario de origen"
                      style={{ width: "100%" }}
                      onChange={(values) => {
                        field.onChange(values), setSelectedUsuarios(values);
                      }}
                      options={optionsUsuarios}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Filtrar por usuario Destino">
                <Controller
                  name="user_destino"
                  control={control.control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Filtrar por usuario de Destino"
                      style={{ width: "100%" }}
                      onChange={(values) => {
                        field.onChange(values), setSelectedUsuarios(values);
                      }}
                      options={optionsUsuarios}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Filtrar por Sede Origen">
                <Controller
                  name="bodega_origen"
                  control={control.control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Filtrar por Sede De Origen"
                      style={{ width: "100%" }}
                      onChange={(values) => {
                        field.onChange(values), setSelectedBodegas(values);
                      }}
                      options={optionsBodega}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Filtrar por Sede Destino">
                <Controller
                  name="bodega_destino"
                  control={control.control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Filtrar por Sede De Destino"
                      style={{ width: "100%" }}
                      onChange={(values) => {
                        field.onChange(values), setSelectedBodegas(values);
                      }}
                      options={optionsBodega}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Filtrar por Estado">
                <Controller
                  name="estado"
                  control={control.control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Filtrar por estado"
                      style={{ width: "100%" }}
                      onChange={(values) => {
                        field.onChange(values), setSelectedEstado(values);
                      }}
                    >
                      {uniqueEstado.map((estado) => (
                        <Option key={estado} value={estado}>
                          {estado}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Button
                type="primary"
                style={{ backgroundColor: "green", borderColor: "green" }} // Estilo para el botón verde
                onClick={handleGenerateReport} // Método que se llamará al hacer clic
              >
                Generar Informe
              </Button>
            </Col>
          </Row>
          </StyledWrapper>
        </StyledCard>
      </Form>
    </Layout>
  );
};
