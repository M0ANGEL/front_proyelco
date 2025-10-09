import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, DatePicker, Select, Table, Row, Space } from "antd";
import dayjs from "dayjs";
import { getProyectos, PostUnidadDeMedida } from "@/services/proyectos/proyectosAPI";

const { RangePicker } = DatePicker;

interface DataType {
  key: number;
  proyecto: string;
  cliente: string;
  cantidad: number;
  proceso?: string;
}

interface DataSelect {
  label: string;
  value: number | string;
}

export const UnidadMedida = () => {
  const [proyectos, setProyectos] = useState<DataSelect[]>([]);
  const [selectedProyecto, setSelectedProyecto] = useState<(number | string)[]>([]);
  const [selectedProceso, setSelectedProceso] = useState<string | null>("fundida");
  const [fechaRange, setFechaRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [procesos] = useState<DataSelect[]>([
    { label: "fundida", value: "fundida" },
    { label: "destapada", value: "destapada" },
    { label: "prolongacion", value: "prolongacion" },
    { label: "alambrada", value: "alambrada" },
    { label: "aparateada", value: "aparateada" },
    { label: "pruebas", value: "pruebas" },
    { label: "retie", value: "retie" },
    { label: "ritel", value: "ritel" },
    { label: "entrega", value: "entrega" },
  ]);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    const {
      data: { data },
    } = await getProyectos();
    setProyectos(
      data.map((p: any) => ({
        label: p.descripcion_proyecto.toUpperCase(),
        value: p.id,
      }))
    );
  };

  const handleConsultar = async () => {
    if (!fechaRange) return;

    const dataPost = {
      fechaInicio: fechaRange[0].format("YYYY-MM-DD"),
      fechaFin: fechaRange[1].format("YYYY-MM-DD"),
      proyecto: selectedProyecto || null,
      proceso: selectedProceso || "fundida",
    };

    setLoading(true);
    const {
      data: { data },
    } = await PostUnidadDeMedida(dataPost);

    // 👇 Adaptado a la respuesta real del backend
    const mapped = data.map((item: any, idx: number) => ({
      key: idx,
      proyecto: item.proyecto,
      cliente: item.cliente ?? "-",
      cantidad: item.total,
      proceso: selectedProceso ?? "-",
    }));

    setDataSource(mapped);
    setLoading(false);
  };

  const columns = [
    {
      title: "Proyecto",
      dataIndex: "proyecto",
      key: "proyecto",
      align: "center",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
    },
  ];

  const isConsultarDisabled = !fechaRange;

  return (
    <StyledCard title="Unidad de Medida">
      <Row gutter={16} style={{ marginBottom: 16 }}>
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
        <Col xs={24} md={6}>
          <Select
            mode="multiple"
            placeholder="Seleccionar Proyecto (opcional)"
            options={proyectos}
            value={selectedProyecto ?? []}
            onChange={(values) => setSelectedProyecto(values)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Col>
        <Col xs={24} md={4}>
          <Select
            placeholder="Seleccionar Proceso"
            options={procesos}
            value={selectedProceso ?? "fundida"}
            onChange={(value) => setSelectedProceso(value)}
            style={{ width: "100%" }}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Col>
        <Col xs={24} md={6}>
          <Space>
            <Button
              type="primary"
              onClick={handleConsultar}
              disabled={isConsultarDisabled}
            >
              Consultar
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16} align="middle">
        {/* Tabla a la izquierda */}
        <Col xs={24} md={18}>
          <Table
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
                `${range[0]}-${range[1]} de ${total} registros`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
          />
        </Col>

        {/* Indicador grande a la derecha */}
        <Col xs={24} md={6} style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "10rem", // número grande
              fontWeight: "bold",
              color: "#e68415ff", // color primario AntD
              display: "block",
            }}
          >
            {dataSource.reduce((acc, item) => acc + item.cantidad, 0)}
          </span>
          <span style={{ fontSize: "2rem" }}>Total: <span style={{color: "#e68415ff"}}>{selectedProceso}</span>  </span>
        </Col>
      </Row>
    </StyledCard>
  );
};
