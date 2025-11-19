import { useEffect, useState } from "react";
import { Button, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { DeleteActiActivos } from "@/services/activosFijos/CrearActivosAPI";
import { FormTraslados } from "../formTraslados/FormTraslados";
import { getActiActivosSalida } from "@/services/activosFijos/TrasladosActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { FormLiberarActivo } from "../formLiberarActivo/FormLiberarActivo";
import useSessionStorage from "@/hooks/useSessionStorage";
import { StyledCard } from "@/components/layout/styled";
import { DataTable } from "@/components/global/DataTable";
import { SearchBar } from "@/components/global/SearchBar";

interface DataType {
  key: number;
  id: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  bodega_actual: string;
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
  solicitud: string;
  motivo_solicitud: string;
  usuario_solicita: string;
}

const { Text } = Typography;

export const TrasladarActivos = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  // Estados para filtros
  const [estadoFilter, setEstadoFilter] = useState<string>();
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [categoriaFilter, setCategoriaFilter] = useState<string>();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    setLoading(true);
    getActiActivosSalida().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          usuario: categoria.usuario,
          categoria: categoria.categoria,
          bodega_actual: categoria.bodega_actual,
          solicitud: categoria.solicitud,
          subcategoria: categoria.subcategoria,
          motivo_solicitud: categoria.motivo_solicitud,
          descripcion: categoria.descripcion,
          usuario_solicita: categoria.usuario_solicita,
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
      setDataSource(initialData);
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
  const applyFilters = () => {
    let filteredData = [...initialData];

    // Filtro por estado
    if (estadoFilter) {
      filteredData = filteredData.filter(item => item.estado === estadoFilter);
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

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setEstadoFilter(undefined);
    setCondicionFilter(undefined);
    setCategoriaFilter(undefined);
    setDataSource(initialData);
  };

  useEffect(() => {
    applyFilters();
  }, [estadoFilter, condicionFilter, categoriaFilter, initialData]);

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
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag
              color={color}
              disabled={!["administrador"].includes(user_rol)}
            >
              <Tooltip title="Cambiar estado">
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
          <FormTraslados data={record} fetchList={() => fetchCategorias()} />
          <VerFoto id={record.key} />
          <FormLiberarActivo
            data={record}
            fetchList={() => fetchCategorias()}
          />
        </>
      ),
      fixed: "right",
      width: 120,
    },
  ];

  // Opciones para los filtros
  const filterOptions = [
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
      key: "condicion",
      label: "Condición",
      options: [
        { label: "Bueno", value: "1" },
        { label: "Regular", value: "2" },
        { label: "Malo", value: "3" }
      ],
      value: condicionFilter,
      onChange: setCondicionFilter
    }
  ];

  return (
    <StyledCard
      title={"Lista de mis Activos"}
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
        placeholder="Buscar en todos los campos..."
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
        scroll={{ x: 800 }}
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
        rowClassName={(record) => (record.solicitud ? "red-row" : "")}
      />
    </StyledCard>
  );
};