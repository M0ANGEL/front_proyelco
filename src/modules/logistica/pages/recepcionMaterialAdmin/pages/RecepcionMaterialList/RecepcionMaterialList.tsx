import { useEffect, useState } from "react";
import { Button, Tooltip, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";
import { ModalRecepcionAdminMaterial } from "../components/ModalRecepcionAdminMaterial";
import { getProyectosProyecionesLogistica } from "@/services/logistica/recepcionMaterialAPI";

interface DataType {
  key: number;
  codigo_proyecto: string;
  descripcion_proyecto: string;
  tipo_proyecto: string;
  total_registros: number;
  fecha_ultimo_registro: string;
  fecha_primer_registro: string;
  cantidad_total: string;
  valor_total_sin_iva: string;
  usuario_carga: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const RecepcionMaterialList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para filtros
  const [tipoProyectoFilter, setTipoProyectoFilter] = useState<string>();
  const [usuarioFilter, setUsuarioFilter] = useState<string>();
  const [rangoRegistrosFilter, setRangoRegistrosFilter] = useState<string>();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getProyectosProyecionesLogistica().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          codigo_proyecto: categoria.codigo_proyecto,
          descripcion_proyecto: categoria.descripcion_proyecto,
          tipo_proyecto: categoria.tipo_proyecto,
          total_registros: categoria.total_registros,
          fecha_ultimo_registro: categoria.fecha_ultimo_registro,
          fecha_primer_registro: categoria.fecha_primer_registro,
          cantidad_total: categoria.cantidad_total,
          valor_total_sin_iva: Number(
            categoria.valor_total_sin_iva
          ).toLocaleString("es-CO"),
          usuario_carga: categoria.usuario_carga,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
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

    const filterTable = initialData?.filter((o: DataType) =>
      Object.keys(o).some((k) =>
        String(o[k as keyof DataType])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  // Aplicar filtros combinados
  const applyFilters = (searchValue?: string) => {
    let filteredData = [...initialData];

    // Aplicar búsqueda global si existe
    if (searchValue && searchValue.trim()) {
      filteredData = filteredData.filter((o: DataType) =>
        Object.keys(o).some((k) =>
          String(o[k as keyof DataType])
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      );
    }

    // Filtro por tipo de proyecto
    if (tipoProyectoFilter) {
      filteredData = filteredData.filter((item) =>
        item.tipo_proyecto
          ?.toLowerCase()
          .includes(tipoProyectoFilter.toLowerCase())
      );
    }

    // Filtro por usuario
    if (usuarioFilter) {
      filteredData = filteredData.filter((item) =>
        item.usuario_carga?.toLowerCase().includes(usuarioFilter.toLowerCase())
      );
    }

    // Filtro por rango de registros
    if (rangoRegistrosFilter) {
      switch (rangoRegistrosFilter) {
        case "bajo":
          filteredData = filteredData.filter(
            (item) => item.total_registros < 100
          );
          break;
        case "medio":
          filteredData = filteredData.filter(
            (item) => item.total_registros >= 100 && item.total_registros < 500
          );
          break;
        case "alto":
          filteredData = filteredData.filter(
            (item) => item.total_registros >= 500
          );
          break;
        default:
          break;
      }
    }

    setDataSource(filteredData);
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setTipoProyectoFilter(undefined);
    setUsuarioFilter(undefined);
    setRangoRegistrosFilter(undefined);
    setDataSource(initialData);
  };

  // Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [tipoProyectoFilter, usuarioFilter, rangoRegistrosFilter, initialData]);


  // ✅ Función para navegar a editar con código de proyecto
  const handleEditarProyeccion = (codigo_proyecto: string) => {
    navigate(
      `${location.pathname}/showSolicitudeMaterial-ing/${codigo_proyecto}`
    );
  };

  // Obtener opciones únicas para filtros
  const getUniqueOptions = (data: DataType[], key: keyof DataType) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))].filter(
      Boolean
    );
    return uniqueValues.map((value) => ({
      label: String(value).toUpperCase(),
      value: String(value),
    }));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Proyecto",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) =>
        a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      render: (text) => text?.toUpperCase(),
      fixed: "left",
      width: 100,
    },
    {
      title: "Código",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      sorter: (a, b) => a.codigo_proyecto.localeCompare(b.codigo_proyecto),
      width: 50,
    },
    {
      title: "Tipo Proyecto",
      dataIndex: "tipo_proyecto",
      key: "tipo_proyecto",
      sorter: (a, b) => a.tipo_proyecto.localeCompare(b.tipo_proyecto),
      render: (text) => text?.toUpperCase(),
      width: 50,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: DataType) => {
        return (
          <>
          <Tooltip title="Solicitar Material">
            <Button
              icon={<EditOutlined />}
              type="primary"
              size="small"
              onClick={() => handleEditarProyeccion(record.codigo_proyecto)}
            />
          </Tooltip>

          <ModalRecepcionAdminMaterial documento_id={record.codigo_proyecto} nombreProyecto={record.descripcion_proyecto}/>
          </>
        );
      },
      fixed: "right",
      width: 50,
    },
  ];

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "tipo_proyecto",
      label: "Tipo Proyecto",
      options: getUniqueOptions(initialData, "tipo_proyecto"),
      value: tipoProyectoFilter,
      onChange: setTipoProyectoFilter,
    },
  ];

  return (
    <StyledCard
      title={"Solicitud Material"}
    >
      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar por proyecto, código, usuario..."
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
        scroll={{ x: 1300 }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30", "50"],
          showTotal: (total: number) => {
            return <Text strong>Total Proyectos: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};
