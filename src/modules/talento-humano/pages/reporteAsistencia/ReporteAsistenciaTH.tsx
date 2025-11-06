import { useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
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
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { SearchBar } from "@/modules/gestion-empresas/pages/empresas/pages/ListEmpresas/styled";
import {
  getReporteAsistenciasTH,
  FiltroReporteAsistencia,
} from "@/services/talento-humano/reporteAPI";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

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
    const [personalProyelcoTotal, setPersonalProyelcoTotal] = useState(0)

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
      (a, b) => b.totalActivos - a.totalActivos
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
        setPersonalProyelcoTotal(response.totalPersonalProyelco)
        setDataSource(asistencias);
        setContratistasStats(calcularActivosPorContratista(asistencias));
        setFiltrosAplicados(filtros);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
    setContratistasStats(calcularActivosPorContratista(filterTable));
  };

  const limpiarFiltros = () => {
    setFechas(null);
    setDataSource([]);
    setInitialData([]);
    setContratistasStats([]);
    setFiltrosAplicados(null);
    setFechaError("");
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Estado",
      dataIndex: "estado_asistencia",
      key: "estado_asistencia",
      align: "center",
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
      sorter: (a, b) => a.hora_ingreso.localeCompare(b.hora_ingreso),
    },
    {
      title: "Fecha Salida",
      dataIndex: "fecha_salida",
      key: "fecha_salida",
      render: (fecha, record) => (
        <span
          style={{
            color: fecha === "En curso" ? "#ff4d4f" : "inherit",
            fontWeight: fecha === "En curso" ? "bold" : "normal",
          }}
        >
          {fecha}
        </span>
      ),
    },
    {
      title: "Hora Salida",
      dataIndex: "hora_salida",
      key: "hora_salida",
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
    },
    {
      title: "Horas Laboradas",
      dataIndex: "horas_laborales",
      key: "horas_laborales",
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
      sorter: (a, b) => a.nombre_completo.localeCompare(b.nombre_completo),
    },
    {
      title: "Tipo Documento",
      dataIndex: "tipo_documento",
      key: "tipo_documento",
    },
    {
      title: "Identificación",
      dataIndex: "identificacion",
      key: "identificacion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Obra",
      dataIndex: "nombre_obra",
      key: "nombre_obra",
      render: (obra) => obra || "Sin obra asignada",
    },
    {
      title: "Tipo Obra",
      dataIndex: "tipo_obra_texto",
      key: "tipo_obra_texto",
    },
    {
      title: "Contratista",
      dataIndex: "nombre_contratista",
      key: "nombre_contratista",
      render: (contratista) => contratista || "No asignado",
    },
    {
      title: "Tipo Empleado",
      dataIndex: "tipo_empleado_texto",
      key: "tipo_empleado_texto",
      render: (tipo) => (
        <Tag color={tipo.includes("Proyelco") ? "blue" : "orange"}>{tipo}</Tag>
      ),
    },
  ];

  // Calcular total de activos
  const totalActivos = dataSource.filter(
    (item) => item.estado_asistencia === "activa"
  ).length;
  const totalCompletadas = dataSource.filter(
    (item) => item.estado_asistencia === "completada"
  ).length;

  return (
    <StyledCard
      title={"Reporte de Asistencias"}
      extra={
        <Space>
          <Button onClick={limpiarFiltros}>Limpiar</Button>
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

      {/* Búsqueda y estadísticas generales */}
      {dataSource.length > 0 && (
        <>
          <SearchBar>
            <Input
              placeholder="Buscar por nombre, identificación, obra..."
              onChange={handleSearch}
              style={{ marginBottom: 16 }}
              allowClear
            />
          </SearchBar>

          <div style={{ marginBottom: 16 }}>
            <Space size="large">
              <Text strong>
                Total registros: <Tag>{dataSource.length}</Tag>
              </Text>
              <Text>
                Activas: <Tag color="green">{totalActivos}</Tag>
              </Text>
              <Text>
                Completadas: <Tag color="blue">{totalCompletadas}</Tag>
              </Text>
            </Space>
          </div>
        </>
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
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          scroll={{ x: 1800 }}
          pagination={{
            total: dataSource?.length,
            showSizeChanger: true,
            defaultPageSize: 20,
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
        />
      )}
    </StyledCard>
  );
};
