import { useEffect, useState } from "react";
import { Button, Input, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiActivosAceptar } from "@/services/activosFijos/TrasladosActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { ModalRechazarActivo } from "./ModalRechazarActivo";
import { ModalAceptarActivo } from "./ModalAceptarActivo";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";

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
  mensajero: string;
  aceptacion: number;
}

const { Text } = Typography;

export const AceptarTraslados = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [categoriaFilter, setCategoriaFilter] = useState<string>();
  const [bodegaOrigenFilter, setBodegaOrigenFilter] = useState<string>();
  const [mensajeroFilter, setMensajeroFilter] = useState<string>();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    setLoading(true);
    getActiActivosAceptar().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          mensajero: categoria.mensajero.toString(),
          usuario: categoria.usuario,
          descripcion: categoria.descripcion,
          categoria: categoria.categoria,
          subcategoria: categoria.subcategoria,
          bodega_origen: categoria.bodega_origen,
          bodega_destino: categoria.bodega_destino,
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

  // Búsqueda global mejorada
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      applyFilters(); // Aplica los filtros actuales sin búsqueda
      return;
    }

    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Aplicar filtros combinados
  const applyFilters = (searchValue?: string) => {
    let filteredData = [...initialData];

    // Aplicar búsqueda global si existe
    if (searchValue && searchValue.trim()) {
      filteredData = filteredData.filter((o: any) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    // Filtro por condición
    if (condicionFilter) {
      filteredData = filteredData.filter(item => item.condicion === condicionFilter);
    }

    // Filtro por categoría
    if (categoriaFilter) {
      filteredData = filteredData.filter(item => 
        item.categoria?.toLowerCase().includes(categoriaFilter.toLowerCase())
      );
    }

    // Filtro por bodega origen
    if (bodegaOrigenFilter) {
      filteredData = filteredData.filter(item => 
        item.bodega_origen?.toLowerCase().includes(bodegaOrigenFilter.toLowerCase())
      );
    }

    // Filtro por estado de mensajero
    if (mensajeroFilter) {
      filteredData = filteredData.filter(item => item.mensajero === mensajeroFilter);
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setCondicionFilter(undefined);
    setCategoriaFilter(undefined);
    setBodegaOrigenFilter(undefined);
    setMensajeroFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [condicionFilter, categoriaFilter, bodegaOrigenFilter, mensajeroFilter, initialData]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
      fixed: "left",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      render: (text) => text?.toUpperCase(),
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
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
      title: "Estado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      render: (_, record: { key: React.Key; aceptacion: number; mensajero: string }) => {
        let estadoString = "";
        let color = "";

        if (record.mensajero === "1") {
          estadoString = "ESPERANDO MENSAJERO";
          color = "orange";
        } else {
          estadoString = "PENDIENTE ACEPTACIÓN";
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
            {estadoString}
          </Tag>
        );
      },
      sorter: (a, b) => a.aceptacion - b.aceptacion,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Space>
          {record.mensajero == "1" ? (
            <Tag color="orange" icon={<SyncOutlined spin />}>
              Esperando mensajero
            </Tag>
          ) : (
            <>
              <ModalRechazarActivo
                data={record}
                fetchList={() => fetchCategorias()}
              />
              <ModalAceptarActivo
                data={record}
                fetchList={() => fetchCategorias()}
              />
              <VerFoto id={record.key} />
            </>
          )}
        </Space>
      ),
      fixed: "right",
      width: 180,
    },
  ];

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "condicion",
      label: "Condición",
      options: [
        { label: "Bueno", value: "1" },
        { label: "Regular", value: "2" },
        { label: "Malo", value: "3" }
      ],
      value: condicionFilter,
      onChange: setCondicionFilter
    },
  ];

  return (
    <StyledCard
      title={"Mis activos por aceptar"}
      extra={
        <Link to=".." relative="path">
          <Button danger type="primary" icon={<ArrowLeftOutlined />}>
            Volver
          </Button>
        </Link>
      }
    >
      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar activos por aceptar..."
        filters={filterOptions}
        showFilterButton={false}
      />
      
      <DataTable
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          total: dataSource?.length,
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