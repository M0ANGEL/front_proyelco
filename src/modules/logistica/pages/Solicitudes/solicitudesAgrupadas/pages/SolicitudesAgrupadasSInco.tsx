import { useEffect, useState } from "react";
import { Button, Col, Input, Select, Row } from "antd";

import { client_sinco } from "@/services/client";
import { getProyectosSinco, getSolicitudesPorProyecto } from "@/services/logistica/logisticaAPI";
import { StyledCard } from "@/components/layout/styled";
import { DataTable } from "@/components/global/DataTable";


interface DataType {
  key: number;
  traslado: string;
  proyecto: string;
  cliente: string;
  fecha: string;
}

interface DataSelect {
  label: string;
  value: number;
}

export const SolicitudesAgrupadasSInco = () => {
  const [numTraslado, setNumTraslado] = useState("");
  const [proyectos, setProyectos] = useState<DataSelect[]>([]);
  const [selectedProyecto, setSelectedProyecto] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    const {
      data: { data },
    } = await getProyectosSinco();
    setProyectos(
      data.map((p: any) => ({ label: p.nombre.toUpperCase(), value: p.codigo }))
    );
  };

  const handleConsultar = async () => {
    if (!numTraslado || !selectedProyecto) return;
    const dataPost = {
      numeroTraslado: numTraslado,
      proyecto: selectedProyecto,
    };
    setLoading(true);
    const {
      data: { data },
    } = await getSolicitudesPorProyecto(dataPost);
    const mapped = data.map((item: any, idx: number) => ({
      key: idx,
      proyecto: item["Proyecto Nombre"],
      insumo: item["Insumo Descripcion"],
      cantidad: item["CantidadTotal"],
      codigo: item["Insumo Codigo"],
    }));
    setDataSource(mapped);

    setDataSource(mapped);
    setLoading(false);
  };

  const handleGenerarPDF = async () => {
    if (!numTraslado || !selectedProyecto) return;

    const dataPost = {
      numeroTraslado: numTraslado,
      proyecto: selectedProyecto,
    };

    setLoading(true);

    try {
      const response = await client_sinco.post(
        "solicitudes-proyectos-pdf",
        dataPost,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
          responseType: "blob", // importante: recibir como blob
        }
      );

      // Crear un enlace para descargar
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Solicitud_${numTraslado}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Codigo",
      dataIndex: "codigo",
      key: "codigo",
      align: "center"
    },
    {
      title: "Insumo",
      dataIndex: "insumo",
      key: "insumo",
      sorter: (a, b) => a.insumo.localeCompare(b.insumo),
    },
    { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" , align: "center"},
  ];

  const isConsultarDisabled = !numTraslado || !selectedProyecto;
  const isPDFDisabled = dataSource.length === 0;

  return (
    <StyledCard title="Solicitudes Agrupadas Sinco">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input
            placeholder="Número de Traslado"
            value={numTraslado}
            onChange={(e) => setNumTraslado(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="Seleccionar Proyecto"
            options={proyectos}
            value={selectedProyecto ?? undefined}
            onChange={(value) => setSelectedProyecto(value)}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="label" // busca por el label del option
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>
        <Col xs={24} sm={8}>
          <Button
            type="primary"
            onClick={handleConsultar}
            disabled={isConsultarDisabled}
          >
            Consultar
          </Button>
        </Col>
      </Row>

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
            `${range[0]}-${range[1]} de ${total} registros`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

      <Button
        type="primary"
        onClick={handleGenerarPDF}
        disabled={isPDFDisabled}
        style={{ marginTop: 16 }}
      >
        Generar PDF
      </Button>
    </StyledCard>
  );
};
