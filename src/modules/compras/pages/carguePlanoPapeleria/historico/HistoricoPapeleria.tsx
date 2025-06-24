import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import Table, { ColumnsType } from "antd/es/table";
import { DataType } from "../pages/types";
import { useState, useEffect } from "react";
import {
  Input,
  Typography,
  DatePicker,
  Select,
  Button,
  Tooltip,
  notification,
} from "antd";
import { SearchBar } from "../pages/styled";
import dayjs from "dayjs";
import { enviarCotizacion, getPapeleria } from "@/services/compras/papeleraAPI";

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export const HistoricoPapeleria = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [selectedPrefijo, setSelectedPrefijo] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [prefijos, setPrefijos] = useState<string[]>([]);

  useEffect(() => {
    fetchPapeleria();
  }, []);

  const fetchPapeleria = () => {
    getPapeleria().then(({ data: { data } }) => {
      const DataPapeleria = data.map((data) => {
        return {
          key: data.id,
          codigo_insumo: data.codigo_insumo,
          insumo_descripcion: data.insumo_descripcion,
          unidad: data.unidad,
          mat_requerido: data.mat_requerido,
          agrupacion_descripcion: data.agrupacion_descripcion,
          nombre_tercero: data.nombre_tercero,
          prefijo: data.prefijo,
          created_at: dayjs(data?.created_at),
          updated_at: dayjs(data?.updated_at),
          created_at_string: dayjs(data?.created_at).format("DD-MM-YYYY"),
        };
      });

      // Extraer prefijos únicos
      const uniquePrefijos = [
        ...new Set(DataPapeleria.map((item) => item.prefijo)),
      ];

      setInitialData(DataPapeleria);
      setDataSource(DataPapeleria);
      setPrefijos(uniquePrefijos);
      setLoading(false);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    applyFilters(initialData, dateRange, selectedPrefijo, value);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
    applyFilters(initialData, dates, selectedPrefijo, searchValue);
  };

  const handleSelectChange = (value: string | undefined) => {
    const prefijo = value || null;
    setSelectedPrefijo(prefijo);
    applyFilters(initialData, dateRange, prefijo, searchValue);
  };

  const applyFilters = (
    data: DataType[],
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    prefijoFilter: string | null,
    search: string
  ) => {
    let filteredData = [...data];

    // Filtro por búsqueda
    if (search) {
      filteredData = filteredData.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Filtro por rango de fechas
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;
      filteredData = filteredData.filter((item) => {
        const itemDate = item.created_at;
        return (
          itemDate.isAfter(start.startOf("day")) &&
          itemDate.isBefore(end.endOf("day"))
        );
      });
    }

    // Filtro por prefijo
    if (prefijoFilter) {
      filteredData = filteredData.filter(
        (item) => item.prefijo === prefijoFilter
      );
    }

    setDataSource(filteredData);
  };


  const EnvioCotizacionClientes = () => {
    setLoading(true);

    const prefijoSelect = {
      prefijo: selectedPrefijo,
    };

    enviarCotizacion(prefijoSelect)
      .then(() => {
        notification.success({
          message: "Cotizacion Enviada",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Error al enviar Cotizacion Enviada",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Cargue",
      dataIndex: "created_at_string",
      key: "created_at_string",
      align: "center",
      width: 90,
      sorter: (a, b) => a.created_at_string.localeCompare(b.created_at_string),
    },
    {
      title: "codigo_insumo",
      dataIndex: "codigo_insumo",
      key: "codigo_insumo",
      align: "center",
      width: 90,
      sorter: (a, b) => a.codigo_insumo.localeCompare(b.codigo_insumo),
    },
    {
      title: "descripcion",
      dataIndex: "insumo_descripcion",
      key: "insumo_descripcion",
      align: "center",
      width: 120,
      sorter: (a, b) =>
        a.insumo_descripcion.localeCompare(b.insumo_descripcion),
    },
    {
      title: "unidad",
      dataIndex: "unidad",
      key: "unidad",
      sorter: (a, b) => a.unidad.localeCompare(b.unidad),
    },
    {
      title: "mat_requerido",
      dataIndex: "mat_requerido",
      key: "mat_requerido",
      sorter: (a, b) => a.mat_requerido.localeCompare(b.mat_requerido),
    },
    {
      title: "agrupacion_descripcion",
      dataIndex: "agrupacion_descripcion",
      key: "agrupacion_descripcion",
      sorter: (a, b) =>
        a.agrupacion_descripcion.localeCompare(b.agrupacion_descripcion),
    },
    {
      title: "Tercero",
      dataIndex: "nombre_tercero",
      key: "nombre_tercero",
      sorter: (a, b) => a.nombre_tercero.localeCompare(b.nombre_tercero),
    },
    {
      title: "Codigo Cargue",
      dataIndex: "prefijo",
      key: "prefijo",
      sorter: (a, b) => a.prefijo.localeCompare(b.prefijo),
    },
  ];

  return (
    <StyledCard title={"Historico Cotizaciones"}>
      <SearchBar>
        <div style={{ display: "flex", width: "100%", gap: "10px" }}>
          <Input
            placeholder="Buscar"
            onChange={handleSearch}
            style={{ width: "40%" }}
          />
          <RangePicker
            format="DD-MM-YYYY"
            onChange={handleDateRangeChange}
            style={{ width: "30%" }}
          />
          <Select
            placeholder="Selecciona prefijo"
            onChange={handleSelectChange}
            allowClear
            style={{ width: "30%" }}
          >
            {prefijos.map((prefijo) => (
              <Option key={prefijo} value={prefijo}>
                {prefijo}
              </Option>
            ))}
          </Select>
          <Tooltip title="Seleciona un prefijo para enviar cotizacion ">
            <Button
              disabled={selectedPrefijo ? false : true}
              type="primary"
              onClick={EnvioCotizacionClientes}
            >
              Enviar Cotizacion
            </Button>
          </Tooltip>
        </div>
      </SearchBar>
      <Table
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ["5", "15", "30", "100"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};
