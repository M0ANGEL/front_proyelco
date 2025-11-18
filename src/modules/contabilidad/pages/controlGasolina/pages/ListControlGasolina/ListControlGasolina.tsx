import { useEffect, useState } from "react";
import { Button, Col, DatePicker, Select, Row, Card } from "antd";
import dayjs from "dayjs";
import { getConductores, getControlGasolina, getPlacas } from "@/services/contabilidad/controlGasolinaAPI";
import { StyledCard } from "@/components/layout/styled";
import { DataTable } from "@/components/global/DataTable";


const { RangePicker } = DatePicker;

interface DataType {
  key: number;
  placa: string;
  conductor: string;
  km_inicial: number;
  km_final: number;
  km_recorridos: number;
  volumen_litros: number;
  volumen_galones: number;
  km_por_galon: number;
  total_dinero: number;
  cantidad_registros: number;
  fecha_inicio: string;
  fecha_fin: string;
}

interface DataSelect {
  label: string;
  value: number | string;
}

export const ListControlGasolina = () => {
  const [conductores, setConductores] = useState<DataSelect[]>([]);
  const [placas, setPlacas] = useState<DataSelect[]>([]);
  const [selectedPlacas, setSelectedPlacas] = useState<(number | string)[]>([]);
  const [selectedConductores, setSelectedConductores] = useState<(number | string)[]>([]);
  const [selectedFiltro, setSelectedFiltro] = useState<string | null>(null);
  const [selectedCorte, setSelectedCorte] = useState<string | null>(null);
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filtros] = useState<DataSelect[]>([
    { label: "Rango Fechas", value: "1" },
    { label: "Cortes", value: "2" },
  ]);

  const [cortes] = useState<DataSelect[]>([
    { label: "Del 1 al 15", value: "1" },
    { label: "Del 16 a Fin mes", value: "2" },
  ]);

  const [meses] = useState<DataSelect[]>([
    { label: "Enero", value: "1" },
    { label: "Febrero", value: "2" },
    { label: "Marzo", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Mayo", value: "5" },
    { label: "Junio", value: "6" },
    { label: "Julio", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Septiembre", value: "9" },
    { label: "Octubre", value: "10" },
    { label: "Noviembre", value: "11" },
    { label: "Diciembre", value: "12" },
  ]);

  useEffect(() => {
    fetchConductores();
    fetchPlacas();
  }, []);

  const fetchConductores = async () => {
    try {
      const { data: { data } } = await getConductores();
      setConductores(
        data.map((p: any) => ({
          label: p.nombre_completo.toUpperCase(),
          value: p.id,
        }))
      );
    } catch (error) {
      console.error("Error al obtener conductores:", error);
    }
  };

  const fetchPlacas = async () => {
    try {
      const { data: { data } } = await getPlacas();
      setPlacas(
        data.map((p: any) => ({
          label: p.placa.toUpperCase(),
          value: p.placa,
        }))
      );
    } catch (error) {
      console.error("Error al obtener placas:", error);
    }
  };

  const handleConsultar = async () => {
    if (selectedFiltro === "1" && !fechaRange) {
      console.error("Debe seleccionar un rango de fechas");
      return;
    }

    if (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) {
      console.error("Debe seleccionar mes y corte");
      return;
    }

    setLoading(true);
    try {
      const dataPost = {
        tipoFiltro: selectedFiltro,
        fechaInicio: selectedFiltro === "1" && fechaRange ? fechaRange[0].format("YYYY-MM-DD") : null,
        fechaFin: selectedFiltro === "1" && fechaRange ? fechaRange[1].format("YYYY-MM-DD") : null,
        mes: selectedFiltro === "2" ? selectedMes : null,
        corte: selectedFiltro === "2" ? selectedCorte : null,
        placas: selectedPlacas.length > 0 ? selectedPlacas : null,
        conductores: selectedConductores.length > 0 ? selectedConductores : null,
      };

      const { data: { data } } = await getControlGasolina(dataPost);

      // Mapear directamente los datos del backend
      const mapped = data.map((item: any, idx: number) => ({
        key: idx,
        placa: item.placa || "-",
        conductor: item.conductor || "-",
        km_inicial: item.km_inicial || 0,
        km_final: item.km_final || 0,
        km_recorridos: item.km_recorridos || 0,
        volumen_litros: item.volumen_litros || 0,
        volumen_galones: item.volumen_galones || 0,
        km_por_galon: item.km_por_galon || 0,
        total_dinero: item.total_dinero || 0,
        cantidad_registros: item.cantidad_registros || 0,
        fecha_inicio: item.fecha_inicio || "-",
        fecha_fin: item.fecha_fin || "-"
      }));

      setDataSource(mapped);
    } catch (error) {
      console.error("Error en la consulta:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Placa",
      dataIndex: "placa",
      key: "placa",
      align: "center",
      fixed: 'left' as const,
    },
    {
      title: "Conductor",
      dataIndex: "conductor",
      key: "conductor",
      align: "center",
    },
    {
      title: "KM Inicial",
      dataIndex: "km_inicial",
      key: "km_inicial",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "KM Final",
      dataIndex: "km_final",
      key: "km_final",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "KM Recorridos",
      dataIndex: "km_recorridos",
      key: "km_recorridos",
      align: "center",
      render: (km: number) => km.toLocaleString(),
    },
    {
      title: "Volumen (L)",
      dataIndex: "volumen_litros",
      key: "volumen_litros",
      align: "center",
      render: (volumen: number) => `${volumen.toFixed(2)}L`,
    },
    {
      title: "Volumen (Gal)",
      dataIndex: "volumen_galones",
      key: "volumen_galones",
      align: "center",
      render: (volumen: number) => `${volumen.toFixed(2)} gal`,
    },
    {
      title: "Rendimiento",
      dataIndex: "km_por_galon",
      key: "km_por_galon",
      align: "center",
      render: (rendimiento: number) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: rendimiento > 0 ? '#52c41a' : '#ff4d4f' 
        }}>
          {rendimiento.toFixed(2)} km/gal
        </span>
      ),
    },
    {
      title: "Total ($)",
      dataIndex: "total_dinero",
      key: "total_dinero",
      align: "center",
      render: (monto: number) => `$${monto.toLocaleString()}`,
    },
    {
      title: "Registros",
      dataIndex: "cantidad_registros",
      key: "cantidad_registros",
      align: "center",
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      align: "center",
      render: (fecha: string) => dayjs(fecha).format('DD/MM/YYYY'),
    },
    {
      title: "Fecha Fin",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      align: "center",
      render: (fecha: string) => dayjs(fecha).format('DD/MM/YYYY'),
    }
  ];

  const isConsultarDisabled =
    (selectedFiltro === "1" && !fechaRange) ||
    (selectedFiltro === "2" && (!selectedCorte || !selectedMes)) ||
    !selectedFiltro;

  // Calcular totales
  const totalGeneral = dataSource.reduce((acc, item) => acc + item.total_dinero, 0);
  const totalVolumenLitros = dataSource.reduce((acc, item) => acc + item.volumen_litros, 0);
  const totalVolumenGalones = dataSource.reduce((acc, item) => acc + item.volumen_galones, 0);
  const totalKmRecorridos = dataSource.reduce((acc, item) => acc + item.km_recorridos, 0);
  const promedioRendimiento = totalVolumenGalones > 0 ? totalKmRecorridos / totalVolumenGalones : 0;
  const totalRegistros = dataSource.reduce((acc, item) => acc + item.cantidad_registros, 0);

  return (
    <StyledCard title="Informes de control de gasolina - Rendimiento por Placa">
      <Row gutter={16} align="bottom" style={{ marginBottom: 16 }}>
        {/* Tipo de filtro */}
        <Col xs={24} md={4}>
          <Select
            placeholder="Tipo de filtro"
            options={filtros}
            value={selectedFiltro}
            onChange={(value) => {
              setSelectedFiltro(value);
              setFechaRange(null);
              setSelectedCorte(null);
              setSelectedMes(null);
            }}
            style={{ width: "100%" }}
            allowClear
          />
        </Col>

        {/* Corte y mes */}
        {selectedFiltro === "2" && (
          <>
            <Col xs={12} md={3}>
              <Select
                placeholder="Mes"
                options={meses}
                value={selectedMes}
                onChange={(value) => setSelectedMes(value)}
                style={{ width: "100%" }}
                allowClear
              />
            </Col>

            <Col xs={12} md={3}>
              <Select
                placeholder="Corte"
                options={cortes}
                value={selectedCorte}
                onChange={(value) => setSelectedCorte(value)}
                style={{ width: "100%" }}
                allowClear
              />
            </Col>
          </>
        )}

        {/* Rango de fechas */}
        {selectedFiltro === "1" && (
          <Col xs={24} md={6}>
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Fecha inicio", "Fecha fin"]}
              value={fechaRange}
              onChange={(dates) => setFechaRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Col>
        )}

        {/* Placas */}
        <Col xs={24} md={4}>
          <Select
            mode="multiple"
            placeholder="Placas"
            options={placas}
            value={selectedPlacas}
            onChange={(values) => setSelectedPlacas(values)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
          />
        </Col>

        {/* Conductores */}
        <Col xs={24} md={4}>
          <Select
            mode="multiple"
            placeholder="Conductores"
            options={conductores}
            value={selectedConductores}
            onChange={(values) => setSelectedConductores(values)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
            maxTagCount="responsive"
          />
        </Col>

        {/* Botón Consultar */}
        <Col xs={24} md={3} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleConsultar}
            disabled={isConsultarDisabled}
            loading={loading}
            size="large"
            style={{ width: "100%" }}
          >
            Consultar
          </Button>
        </Col>
      </Row>

      <Row gutter={16} align="middle">
        <Col xs={24} md={18}>
          <DataTable
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="key"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: dataSource.length,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} placas`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
            scroll={{ x: 1500 }}
          />
        </Col>

        {/* Indicadores estilo recibo actualizados */}
        <Col xs={24} md={6}>
          <Card 
            title={
              <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
                RESUMEN RENDIMIENTO
              </div>
            }
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              color: "white"
            }}
            bodyStyle={{ padding: "20px" }}
          >
            {/* Total Monto */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                TOTAL MONTO
              </div>
              <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                ${totalGeneral.toLocaleString()}
              </div>
            </div>

            {/* Total KM Recorridos */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                KM RECORRIDOS
              </div>
              <div style={{ 
                fontSize: "1.6rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                {totalKmRecorridos.toLocaleString()} km
              </div>
            </div>

            {/* Rendimiento Promedio */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                RENDIMIENTO PROMEDIO
              </div>
              <div style={{ 
                fontSize: "1.6rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                color: promedioRendimiento > 0 ? '#a7f3a7' : '#ffa7a7'
              }}>
                {promedioRendimiento.toFixed(2)} km/gal
              </div>
            </div>

            {/* Total Volumen */}
            <div style={{ 
              marginBottom: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                COMBUSTIBLE USADO
              </div>
              <div style={{ 
                fontSize: "1.4rem", 
                fontWeight: "bold",
                fontFamily: "'Courier New', monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                {totalVolumenGalones.toFixed(2)} gal
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "5px" }}>
                ({totalVolumenLitros.toFixed(2)} L)
              </div>
            </div>

            {/* Totales */}
            <div style={{ 
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "5px" }}>
                ESTADÍSTICAS
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                <div>Placas: {dataSource.length}</div>
                <div>Registros: {totalRegistros}</div>
              </div>
            </div>

            {/* Información adicional */}
            <div style={{ 
              fontSize: "0.7rem", 
              opacity: 0.8,
              textAlign: "center",
              marginTop: "15px"
            }}>
              <div>Consulta generada:</div>
              <div style={{ fontWeight: "bold" }}>
                {dayjs().format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </StyledCard>
  );
};