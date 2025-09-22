import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Select, Row, Col, Tag, Typography } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiHistorico } from "@/services/activosFijos/TrasladosActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { GenerarQR } from "../../../crearActivos/pages/ListCrearActivos/GenerarQR";
import { ModalInfo } from "../../../traslados/pages/AceptarTraslados/ModalInfo";

interface DataType {
  key: number;
  id: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  ubicacion_id: string;
  valor: string;
  fecha_fin_garantia: string;
  condicion: string;
  updated_at: string;
  created_at: string;
  marca: string;
  serial: string;
  observacion: string;
  estado: string;
  usuario: string;
  categoria: string;
  subcategoria: string;
  codigo_traslado: string;
  bodega_origen: string;
  bodega_destino: string;
  aceptacion: string;
}

const { Text } = Typography;

export const ListKardex = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // estados de filtros
  const [filterTraslado, setFilterTraslado] = useState<string | null>(null);
  const [filterActivo, setFilterActivo] = useState<string | null>(null);
  const [filterBodegaDestino, setFilterBodegaDestino] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getActiHistorico().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          codigo_traslado: categoria.codigo_traslado,
          activo_id: categoria.activo_id,
          user_id: categoria.user_id,
          aceptacion: categoria.aceptacion,
          bodega_origen: categoria.bodega_origen,
          bodega_destino: categoria.bodega_destino,
          usuario: categoria.usuario,
          categoria: categoria.categoria,
          subcategoria: categoria.subcategoria,
          numero_activo: categoria.numero_activo,
          valor: Number(categoria.valor).toLocaleString("es-CO"),
          descripcion: categoria.descripcion,
          condicion: categoria.condicion.toString(),
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
            "DD-MM-YYYY HH:mm"
          ),
        };
      });

      setInitialData(categorias);
      setDataSource(categorias);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // aplicar filtros
  useEffect(() => {
    let filtered = [...initialData];

    if (filterTraslado) {
      filtered = filtered.filter((item) =>
        item.codigo_traslado?.toString().includes(filterTraslado)
      );
    }

    if (filterActivo) {
      filtered = filtered.filter((item) =>
        item.numero_activo?.toString().includes(filterActivo)
      );
    }

    if (filterBodegaDestino) {
      filtered = filtered.filter(
        (item) =>
          item.bodega_destino?.toLowerCase() ===
          filterBodegaDestino.toLowerCase()
      );
    }

    setDataSource(filtered);
  }, [filterTraslado, filterActivo, filterBodegaDestino, initialData]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Numero Traslado",
      dataIndex: "codigo_traslado",
      key: "codigo_traslado",
      fixed: "left",
    },
    {
      title: "Fecha creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Usuario Crea Traslado",
      dataIndex: "usuario",
      key: "usuario",
      sorter: (a, b) => a.usuario.localeCompare(b.usuario),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
     {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Area Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Area Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
      sorter: (a, b) => a.bodega_destino.localeCompare(b.bodega_destino),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      render: (_, record: { key: React.Key; condicion: string }) => {
        let estadoString = "";
        let color = "";

        if (record.condicion === "1") {
          estadoString = "BUENO";
          color = "green";
        } else if (record.condicion === "2") {
          estadoString = "REGULAR";
          color = "yellow";
        } else {
          estadoString = "MALO";
          color = "red";
        }

        return (
          <Tag
            color={color}
            key={estadoString}
            icon={
              loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
            }
          >
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
    },
    {
      title: "Estado Traslado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      render: (_, record: { key: React.Key; aceptacion: string }) => {
        let estadoString;
        let color;

        if (record.aceptacion == "0") {
          estadoString = "Sin Trasladar";
          color = "yellow";
        } else if (record.aceptacion == "1") {
          estadoString = "Pendiente";
          color = "red";
        } else if (record.aceptacion == "2") {
          estadoString = "Aceptado";
          color = "green";
        } else {
          estadoString = "Rechazado";
          color = "red";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <>
          <ModalInfo data={record} />
          <VerFoto id={record.key} />
          <GenerarQR id={record.key} numero_activo={record.numero_activo} />
        </>
      ),
      fixed: "right",
      width: 120,
    },
  ];

  return (
    <StyledCard title={"Lista de Activos Fijos para traslado"}>
      <SearchBar>
        <Row gutter={10}>
          <Col>
            <Input placeholder="Buscar general..." onChange={handleSearch} />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filtrar por Traslado"
              style={{ width: 180 }}
              onChange={(value) => setFilterTraslado(value)}
              options={[
                ...new Set(initialData.map((i) => i.codigo_traslado)),
              ].map((v) => ({ label: v, value: v }))}
            />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filtrar por Activo"
              style={{ width: 180 }}
              onChange={(value) => setFilterActivo(value)}
              options={[
                ...new Set(initialData.map((i) => i.numero_activo)),
              ].map((v) => ({ label: v, value: v }))}
            />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filtrar por Bodega Destino"
              style={{ width: 200 }}
              onChange={(value) => setFilterBodegaDestino(value)}
              options={[
                ...new Set(initialData.map((i) => i.bodega_destino)),
              ].map((v) => ({ label: v, value: v }))}
            />
          </Col>
        </Row>
      </SearchBar>

      <Table
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};
