import { useState, useRef } from "react";
import {
  Button,
  Input,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Card,
  DatePicker,
  Space,
  Alert,
  Empty,
  message,
  Select,
  Dropdown,
  Menu,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import {
  getReporteAsistenciasTH,
  FiltroReporteAsistencia,
} from "@/services/talento-humano/reporteAPI";
import dayjs, { Dayjs } from "dayjs";
import { DescargarReporteAsistencias } from "./DescargarReporteAsistencias";
import { StyledCard } from "@/components/layout/styled";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import useSessionStorage from "@/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Option } = Select;

interface DataType {
  key: number;
  fecha_ingreso: string;
  hora_ingreso: string;
  fecha_salida: string;
  hora_salida: string;
  horas_laborales: string;
  nombre_completo: string;
  identificacion: string;
  tipo_documento: string;
  telefono_celular: string;
  nombre_obra: string;
  nombre_contratista: string;
  cargo: string;
  tipo_empleado_texto: string;
  tipo_obra_texto: string;
  estado_asistencia: string;
}

interface ContratistaStats {
  nombre: string;
  totalActivos: number;
}

interface FiltrosAvanzados {
  estado: string[];
  contratista: string[];
  obra: string[];
  cargo: string[];
}

export const ReporteAsistenciaTH = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [contratistasStats, setContratistasStats] = useState<
    ContratistaStats[]
  >([]);
  const [fechas, setFechas] = useState<[Dayjs, Dayjs] | null>(null);
  const [fechaError, setFechaError] = useState<string>("");
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltroReporteAsistencia | null>(null);
  const [personalProyelcoTotal, setPersonalProyelcoTotal] = useState(0);

  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  // Estados para filtros y búsqueda
  const [searchText, setSearchText] = useState("");
  const [filtrosAvanzados, setFiltrosAvanzados] = useState<FiltrosAvanzados>({
    estado: [],
    contratista: [],
    obra: [],
    cargo: [],
  });
  const [showFiltrosAvanzados, setShowFiltrosAvanzados] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  // Obtener valores únicos para los filtros
  const obtenerValoresUnicos = (data: DataType[]) => {
    const estados = [...new Set(data.map((item) => item.estado_asistencia))];
    const contratistas = [
      ...new Set(data.map((item) => item.nombre_contratista || "No asignado")),
    ];
    const obras = [
      ...new Set(data.map((item) => item.nombre_obra || "Sin obra")),
    ];
    const cargos = [...new Set(data.map((item) => item.cargo))];

    return { estados, contratistas, obras, cargos };
  };

  // Función para calcular solo las asistencias activas por contratista
  const calcularActivosPorContratista = (data: DataType[]) => {
    const statsMap: { [key: string]: ContratistaStats } = {};

    data.forEach((asistencia) => {
      // Solo contar las asistencias activas
      if (asistencia.estado_asistencia === "activa") {
        const contratista = asistencia.nombre_contratista || "No asignado";

        if (!statsMap[contratista]) {
          statsMap[contratista] = {
            nombre: contratista,
            totalActivos: 0,
          };
        }

        statsMap[contratista].totalActivos++;
      }
    });

    // Convertir a array y ordenar por cantidad de activos descendente
    return Object.values(statsMap).sort(
      (a, b) => b.totalActivos - a.totalActivos,
    );
  };

  // Validar que el rango no sea mayor a 4 meses
  const validarRangoFechas = (dates: [Dayjs, Dayjs] | null) => {
    if (!dates) return true;

    const [start, end] = dates;
    const diffInMonths = end.diff(start, "month");

    if (diffInMonths > 4) {
      setFechaError("El rango de fechas no puede ser mayor a 4 meses");
      return false;
    }

    setFechaError("");
    return true;
  };

  const handleFechaChange = (dates: [Dayjs, Dayjs] | null) => {
    setFechas(dates);
    setFechaError("");
  };

  const fetchAsistencias = async () => {
    if (!fechas) {
      message.warning("Por favor seleccione un rango de fechas");
      return;
    }

    if (!validarRangoFechas(fechas)) {
      return;
    }

    const [startDate, endDate] = fechas;
    const filtros: FiltroReporteAsistencia = {
      fecha_inicio: startDate.format("YYYY-MM-DD"),
      fecha_fin: endDate.format("YYYY-MM-DD"),
    };

    setLoading(true);

    try {
      const { data: response } = await getReporteAsistenciasTH(filtros);

      if (response.status === "success") {
        const asistencias = response.data.map((asistencia) => {
          const tieneSalida = asistencia.hora_salida && asistencia.fecha_salida;
          const estadoAsistencia = tieneSalida ? "completada" : "activa";

          return {
            key: asistencia.id,
            fecha_ingreso: dayjs(asistencia.fecha_ingreso).format("DD-MM-YYYY"),
            hora_ingreso: asistencia.hora_ingreso,
            fecha_salida: asistencia.fecha_salida
              ? dayjs(asistencia.fecha_salida).format("DD-MM-YYYY")
              : "En curso",
            hora_salida: asistencia.hora_salida || "En curso",
            horas_laborales: asistencia.horas_laborales || "No calculada",
            nombre_completo: asistencia.nombre_completo,
            identificacion: asistencia.identificacion,
            tipo_documento: asistencia.tipo_documento,
            telefono_celular: asistencia.telefono_celular,
            nombre_obra: asistencia.nombre_obra,
            nombre_contratista: asistencia.nombre_contratista,
            cargo: asistencia.cargo,
            tipo_empleado_texto: asistencia.tipo_empleado_texto,
            tipo_obra_texto: asistencia.tipo_obra_texto,
            estado_asistencia: estadoAsistencia,
          };
        });

        setInitialData(asistencias);
        setPersonalProyelcoTotal(response.totalPersonalProyelco);
        setDataSource(asistencias);
        setContratistasStats(calcularActivosPorContratista(asistencias));
        setFiltrosAplicados(filtros);

        // Resetear filtros avanzados
        setFiltrosAvanzados({
          estado: [],
          contratista: [],
          obra: [],
          cargo: [],
        });
        setFiltrosActivos([]);
        setSearchText("");

        message.success(`Se encontraron ${asistencias.length} registros`);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Error al cargar el reporte");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función de búsqueda general
  const handleSearch = (value: string) => {
    setSearchText(value);

    if (!value.trim()) {
      aplicarFiltros(initialData);
      return;
    }

    const filteredData = initialData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setDataSource(filteredData);
    setContratistasStats(calcularActivosPorContratista(filteredData));
  };

  // Aplicar filtros avanzados
  const aplicarFiltros = (data: DataType[] = initialData) => {
    let filtered = [...data];

    // Filtro por estado
    if (filtrosAvanzados.estado.length > 0) {
      filtered = filtered.filter((item) =>
        filtrosAvanzados.estado.includes(item.estado_asistencia),
      );
    }

    // Filtro por contratista
    if (filtrosAvanzados.contratista.length > 0) {
      filtered = filtered.filter((item) =>
        filtrosAvanzados.contratista.includes(
          item.nombre_contratista || "No asignado",
        ),
      );
    }

    // Filtro por obra
    if (filtrosAvanzados.obra.length > 0) {
      filtered = filtered.filter((item) =>
        filtrosAvanzados.obra.includes(item.nombre_obra || "Sin obra"),
      );
    }

    // Filtro por cargo
    if (filtrosAvanzados.cargo.length > 0) {
      filtered = filtered.filter((item) =>
        filtrosAvanzados.cargo.includes(item.cargo),
      );
    }

    setDataSource(filtered);
    setContratistasStats(calcularActivosPorContratista(filtered));
  };

  // Manejar cambios en filtros avanzados
  const handleFiltroChange = (
    tipo: keyof FiltrosAvanzados,
    values: string[],
  ) => {
    const nuevosFiltros = {
      ...filtrosAvanzados,
      [tipo]: values,
    };

    setFiltrosAvanzados(nuevosFiltros);

    // Actualizar filtros activos
    const nuevosFiltrosActivos: string[] = [];
    Object.entries(nuevosFiltros).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        nuevosFiltrosActivos.push(key);
      }
    });
    setFiltrosActivos(nuevosFiltrosActivos);

    // Aplicar filtros inmediatamente
    aplicarFiltros();
  };

  // Limpiar todos los filtros
  const limpiarTodosLosFiltros = () => {
    setFiltrosAvanzados({
      estado: [],
      contratista: [],
      obra: [],
      cargo: [],
    });
    setFiltrosActivos([]);
    setSearchText("");

    if (initialData.length > 0) {
      setDataSource(initialData);
      setContratistasStats(calcularActivosPorContratista(initialData));
    }
  };

  // Limpiar un filtro específico
  const limpiarFiltro = (tipo: keyof FiltrosAvanzados) => {
    const nuevosFiltros = {
      ...filtrosAvanzados,
      [tipo]: [],
    };

    setFiltrosAvanzados(nuevosFiltros);
    setFiltrosActivos(filtrosActivos.filter((f) => f !== tipo));
    aplicarFiltros();
  };

  const limpiarFiltros = () => {
    setFechas(null);
    setDataSource([]);
    setInitialData([]);
    setContratistasStats([]);
    setFiltrosAplicados(null);
    setFechaError("");
    limpiarTodosLosFiltros();
  };

  // Definición de columnas completas (sin opción de ocultar)
  const columns: ColumnsType<DataType> = [
    {
      title: "Estado",
      dataIndex: "estado_asistencia",
      key: "estado_asistencia",
      align: "center",
      fixed: "left",
      width: 120,
      render: (estado) => (
        <Tag
          color={estado === "activa" ? "green" : "blue"}
          style={{ fontWeight: "bold" }}
        >
          {estado === "activa" ? "EN CURSO" : "COMPLETADA"}
        </Tag>
      ),
      sorter: (a, b) => a.estado_asistencia.localeCompare(b.estado_asistencia),
    },
    {
      title: "Fecha Ingreso",
      dataIndex: "fecha_ingreso",
      key: "fecha_ingreso",
      width: 120,
      sorter: (a, b) => {
        return (
          dayjs(b.fecha_ingreso, "DD-MM-YYYY").unix() -
          dayjs(a.fecha_ingreso, "DD-MM-YYYY").unix()
        );
      },
      defaultSortOrder: "descend",
    },
    {
      title: "Hora Ingreso",
      dataIndex: "hora_ingreso",
      key: "hora_ingreso",
      width: 100,
      sorter: (a, b) => a.hora_ingreso.localeCompare(b.hora_ingreso),
    },
    {
      title: "Hora Salida",
      dataIndex: "hora_salida",
      key: "hora_salida",
      width: 100,
      render: (hora, record) => (
        <span
          style={{
            color: hora === "En curso" ? "#ff4d4f" : "inherit",
            fontWeight: hora === "En curso" ? "bold" : "normal",
          }}
        >
          {hora}
        </span>
      ),
      sorter: (a, b) => a.hora_salida.localeCompare(b.hora_salida),
    },
    {
      title: "Horas Laboradas",
      dataIndex: "horas_laborales",
      key: "horas_laborales",
      width: 130,
      render: (horas) => (
        <span
          style={{
            color: horas === "No calculada" ? "#faad14" : "inherit",
            fontWeight: horas === "No calculada" ? "bold" : "normal",
          }}
        >
          {horas}
        </span>
      ),
    },
    {
      title: "Nombre Completo",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      width: 200,
      sorter: (a, b) => a.nombre_completo.localeCompare(b.nombre_completo),
    },
    {
      title: "Identificación",
      dataIndex: "identificacion",
      key: "identificacion",
      width: 120,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
      width: 120,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      width: 150,
    },
    {
      title: "Ubicacion",
      dataIndex: "nombre_obra",
      key: "nombre_obra",
      width: 150,
      render: (obra) => obra || "Sin obra asignada",
      sorter: (a, b) => a.nombre_obra.localeCompare(b.nombre_obra),
    },
    {
      title: "Contratista",
      dataIndex: "nombre_contratista",
      key: "nombre_contratista",
      width: 150,
      render: (contratista) => contratista || "No asignado",
    },
  ];

  // Obtener valores únicos de los datos actuales
  const valoresUnicos = obtenerValoresUnicos(initialData);

  // Calcular total de activos
  const totalActivos = dataSource.filter(
    (item) => item.estado_asistencia === "activa",
  ).length;
  const totalCompletadas = dataSource.filter(
    (item) => item.estado_asistencia === "completada",
  ).length;

  // Menú de filtros avanzados
  const filtrosMenu = (
    <Menu style={{ padding: 16, width: 300 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Filtros Avanzados</Text>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">Estado</Text>
        <Select
          mode="multiple"
          placeholder="Seleccionar estado"
          style={{ width: "100%", marginTop: 4 }}
          value={filtrosAvanzados.estado}
          onChange={(values) => handleFiltroChange("estado", values)}
        >
          <Option value="activa">Activa</Option>
          <Option value="completada">Completada</Option>
        </Select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">Contratista</Text>
        <Select
          mode="multiple"
          placeholder="Seleccionar contratista"
          style={{ width: "100%", marginTop: 4 }}
          value={filtrosAvanzados.contratista}
          onChange={(values) => handleFiltroChange("contratista", values)}
        >
          {valoresUnicos.contratistas.map((contratista) => (
            <Option key={contratista} value={contratista}>
              {contratista}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">Obra</Text>
        <Select
          mode="multiple"
          placeholder="Seleccionar obra"
          style={{ width: "100%", marginTop: 4 }}
          value={filtrosAvanzados.obra}
          onChange={(values) => handleFiltroChange("obra", values)}
        >
          {valoresUnicos.obras.map((obra) => (
            <Option key={obra} value={obra}>
              {obra}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Cargo</Text>
        <Select
          mode="multiple"
          placeholder="Seleccionar cargo"
          style={{ width: "100%", marginTop: 4 }}
          value={filtrosAvanzados.cargo}
          onChange={(values) => handleFiltroChange("cargo", values)}
        >
          {valoresUnicos.cargos.map((cargo) => (
            <Option key={cargo} value={cargo}>
              {cargo}
            </Option>
          ))}
        </Select>
      </div>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Button size="small" onClick={() => setShowFiltrosAvanzados(false)}>
          Cerrar
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            aplicarFiltros();
            setShowFiltrosAvanzados(false);
          }}
        >
          Aplicar
        </Button>
      </Space>
    </Menu>
  );

  return (
    <StyledCard
      title={"Reporte de Asistencias"}
      extra={
        <Space>
          <Button onClick={limpiarFiltros}>Limpiar</Button>

          {user_rol === "Administrador" ||
          user_rol === "Directora Proyectos" ||
          user_rol === "Talento Humano" ? (
            <DescargarReporteAsistencias
              filtros={filtrosAplicados || { fecha_inicio: "", fecha_fin: "" }}
              disabled={!filtrosAplicados || dataSource.length === 0}
            />
          ) : null}

          <Button
            onClick={fetchAsistencias}
            loading={loading}
            type="primary"
            disabled={!fechas}
          >
            Generar Reporte
          </Button>
        </Space>
      }
    >
      {/* Filtros */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <Text strong style={{ marginRight: 8 }}>
              Seleccionar rango de fechas:
            </Text>
            <Text type="secondary">(Máximo 4 meses)</Text>
          </div>

          <Space>
            <RangePicker
              value={fechas}
              onChange={handleFechaChange}
              format="DD-MM-YYYY"
              placeholder={["Fecha inicio", "Fecha fin"]}
              style={{ width: 300 }}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Space>

          {fechaError && <Alert message={fechaError} type="error" showIcon />}

          {filtrosAplicados && (
            <Alert
              message={
                <Space>
                  <Text>Período consultado:</Text>
                  <Tag>
                    {dayjs(filtrosAplicados.fecha_inicio).format("DD/MM/YYYY")}
                    {" - "}
                    {dayjs(filtrosAplicados.fecha_fin).format("DD/MM/YYYY")}
                  </Tag>
                </Space>
              }
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Sección de Estadísticas por Contratista */}
      {contratistasStats.length > 0 && (
        <Card
          title={
            <Space>
              <span>👥 Resumen por Contratista</span>
              <Tag color="blue">Activos: {totalActivos}</Tag>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 16]}>
            {contratistasStats.map((contratista, index) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                key={contratista.nombre}
              >
                <Card
                  size="small"
                  hoverable
                  style={{
                    borderLeft: `4px solid ${
                      contratista.totalActivos > 0 ? "#52c41a" : "#ff4d4f"
                    }`,
                    textAlign: "center",
                  }}
                >
                  <Statistic
                    title={
                      <Text
                        ellipsis={{ tooltip: contratista.nombre }}
                        style={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        {contratista.nombre}
                      </Text>
                    }
                    value={
                      contratista.nombre === "Proyelco S.A.S"
                        ? `${contratista.totalActivos} / ${personalProyelcoTotal}`
                        : contratista.totalActivos
                    }
                    valueStyle={{
                      color:
                        contratista.totalActivos > 0 ? "#52c41a" : "#d9d9d9",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                    suffix={
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        persona{contratista.totalActivos !== 1 ? "s" : ""}
                      </Text>
                    }
                  />
                  <div style={{ marginTop: 8 }}>
                    <Tag
                      color={contratista.totalActivos > 0 ? "green" : "red"}
                      style={{ margin: 0 }}
                    >
                      {contratista.totalActivos > 0 ? "ACTIVO" : "SIN ACTIVOS"}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Barra de búsqueda y filtros */}
      {dataSource.length > 0 && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Space
              wrap
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Space>
                <Input
                  placeholder="Buscar por nombre, identificación, obra, teléfono..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: 300 }}
                  allowClear
                />

                <Dropdown
                  overlay={filtrosMenu}
                  trigger={["click"]}
                  open={showFiltrosAvanzados}
                  onOpenChange={setShowFiltrosAvanzados}
                >
                  <Button icon={<FilterOutlined />}>
                    Filtros{" "}
                    {filtrosActivos.length > 0 && `(${filtrosActivos.length})`}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>

              <Space>
                {filtrosActivos.map((filtro) => (
                  <Tag
                    key={filtro}
                    closable
                    onClose={() =>
                      limpiarFiltro(filtro as keyof FiltrosAvanzados)
                    }
                    color="blue"
                  >
                    {filtro === "estado"
                      ? "Estado"
                      : filtro === "contratista"
                      ? "Contratista"
                      : filtro === "obra"
                      ? "Obra"
                      : "Cargo"}
                  </Tag>
                ))}

                {filtrosActivos.length > 0 && (
                  <Button
                    size="small"
                    type="text"
                    onClick={limpiarTodosLosFiltros}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </Space>
            </Space>

            {/* Estadísticas rápidas */}
            <Space wrap>
              <Text strong>
                Total registros: <Tag color="blue">{dataSource.length}</Tag>
              </Text>
              <Text>
                Activas: <Tag color="green">{totalActivos}</Tag>
              </Text>
              <Text>
                Completadas: <Tag color="blue">{totalCompletadas}</Tag>
              </Text>
              {searchText && (
                <Text type="secondary">Buscando: "{searchText}"</Text>
              )}
            </Space>
          </Space>
        </Card>
      )}

      {/* Tabla */}
      {dataSource.length === 0 && !loading ? (
        <Empty
          description={
            <Space direction="vertical" size="middle">
              <Text>Seleccione un rango de fechas para generar el reporte</Text>
              <Text type="secondary">Máximo 4 meses de consulta</Text>
            </Space>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div ref={tableRef}>
          <Table
            className="custom-table"
            rowKey={(record) => record.key}
            size="small"
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            scroll={{
              x: 1800,
              y: 600,
            }}
            pagination={{
              total: dataSource?.length,
              showSizeChanger: true,
              defaultPageSize: 100,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total: number, range: [number, number]) => {
                return (
                  <Text strong>
                    Mostrando {range[0]}-{range[1]} de {total} registros
                  </Text>
                );
              },
            }}
            bordered
            sticky={{
              offsetHeader: 0,
            }}
          />
        </div>
      )}
    </StyledCard>
  );
};
