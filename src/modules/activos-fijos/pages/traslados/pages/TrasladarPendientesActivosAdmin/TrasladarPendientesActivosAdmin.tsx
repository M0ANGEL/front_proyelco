import { useEffect, useState } from "react";
import { Button, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DeleteActiActivos } from "@/services/activosFijos/CrearActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { GenerarQR } from "../../../crearActivos/pages/ListCrearActivos/GenerarQR";
import { ModalInfo } from "../../../traslados/pages/AceptarTraslados/ModalInfo";
import { getActiAdministrarActivosPendientesAdmin } from "@/services/activosFijos/AdministarActivosAdminAPI";
import { Link } from "react-router-dom";
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
}

const { Text } = Typography;

export const TrasladarPendientesActivosAdmin = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [categoriaFilter, setCategoriaFilter] = useState<string>();
  const [bodegaOrigenFilter, setBodegaOrigenFilter] = useState<string>();
  const [bodegaDestinoFilter, setBodegaDestinoFilter] = useState<string>();
  const [estadoFilter, setEstadoFilter] = useState<string>();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getActiAdministrarActivosPendientesAdmin().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          usuario: categoria.usuario,
          categoria: categoria.categoria,
          subcategoria: categoria.subcategoria,
          codigo_traslado: categoria.codigo_traslado,
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

    // Filtro por bodega destino
    if (bodegaDestinoFilter) {
      filteredData = filteredData.filter(item => 
        item.bodega_destino?.toLowerCase().includes(bodegaDestinoFilter.toLowerCase())
      );
    }

    // Filtro por estado
    if (estadoFilter) {
      filteredData = filteredData.filter(item => item.estado === estadoFilter);
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setCondicionFilter(undefined);
    setCategoriaFilter(undefined);
    setBodegaOrigenFilter(undefined);
    setBodegaDestinoFilter(undefined);
    setEstadoFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [condicionFilter, categoriaFilter, bodegaOrigenFilter, bodegaDestinoFilter, estadoFilter, initialData]);

  //cambio de estado
  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeleteActiActivos(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  // Obtener opciones únicas para filtros
  const getUniqueOptions = (data: DataType[], key: keyof DataType) => {
    const uniqueValues = [...new Set(data.map(item => item[key]))].filter(Boolean);
    return uniqueValues.map(value => ({
      label: String(value).toUpperCase(),
      value: String(value)
    }));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      fixed: "left",
    },
    {
      title: "Código Traslado",
      dataIndex: "codigo_traslado",
      key: "codigo_traslado",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Fecha fin garantía",
      dataIndex: "fecha_fin_garantia",
      key: "fecha_fin_garantia",
      sorter: (a, b) =>
        a.fecha_fin_garantia.localeCompare(b.fecha_fin_garantia),
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
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Subcategoría",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Área Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Área Destino",
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
      title: "Número Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Anular Traslado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title="Anular Traslado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </ButtonTag>
          </Popconfirm>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
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
          <GenerarQR id={record.key} />
        </>
      ),
      fixed: "right",
      width: 120,
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
    {
      key: "estado",
      label: "Estado",
      options: [
        { label: "Activo", value: "1" },
        { label: "Inactivo", value: "2" }
      ],
      value: estadoFilter,
      onChange: setEstadoFilter
    },
    {
      key: "bodega_origen",
      label: "Bodega Origen",
      options: getUniqueOptions(initialData, 'bodega_origen'),
      value: bodegaOrigenFilter,
      onChange: setBodegaOrigenFilter
    },
    {
      key: "bodega_destino",
      label: "Bodega Destino",
      options: getUniqueOptions(initialData, 'bodega_destino'),
      value: bodegaDestinoFilter,
      onChange: setBodegaDestinoFilter
    }
  ];

  return (
    <StyledCard
      title={"Activos pendientes por ser aceptados"}
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
        placeholder="Buscar traslados pendientes..."
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
        scroll={{ x: 1500 }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30", "50"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};