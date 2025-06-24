import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import {
  Input,
  DatePicker,
  Select,
  Button,
  Tooltip,
  Tag,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import { SearchBar } from "../components/DatosBasicos/styled";
import { getAsistencias } from "@/services/talento-humano/asistenciasAPI";
import { DataType } from "../components/DatosBasicos/types";
import { EditOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ModalAsistencias } from "../components/ModalAsistencias";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

export const ListAsistenciasObra = () => {
  const location = useLocation();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [selectedPrefijo, setSelectedPrefijo] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [prefijos, setPrefijos] = useState<string[]>([]);

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const fetchAsistencias = () => {
    getAsistencias().then(({ data: { data } }) => {
      const DataPapeleria = data.map((data) => {
        return {
          key: data.id,
          id: data.id,
          nombres: data.nombres,
          apellidos: data.apellidos,
          descripcion_proyecto: data.descripcion_proyecto,
          cargo: data.cargo,
          confirmacion: data.confirmacion.toString(),
          fecha_programacion: data.fecha_programacion,
          fecha_confirmacion: data?.fecha_confirmacion,
          detalle: data?.detalle,
          cedula: data?.cedula,
          created_at: dayjs(data?.created_at),
          updated_at: dayjs(data?.updated_at),
          created_at_string: dayjs(data?.created_at).format("DD-MM-YYYY"),
          //extras  personal_id
          personal_id: data?.personal_id,
          proyecto_id: data?.proyecto_id,
          usuario_asigna : data?.usuario_asigna ,
          usuario_confirma: data?.usuario_confirma,
          usurioConfirma: data?.usurioConfirma,

        };
      });

      const uniqueProyecto = [
        ...new Set(DataPapeleria.map((item) => item.descripcion_proyecto)),
      ];

      setInitialData(DataPapeleria);
      setDataSource(DataPapeleria);
      setPrefijos(uniqueProyecto);
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

    if (search) {
      filteredData = filteredData.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

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

    if (prefijoFilter) {
      filteredData = filteredData.filter(
        (item) => item.descripcion_proyecto === prefijoFilter
      );
    }

    setDataSource(filteredData);
  };

  // Agrupar por fecha_programacion
  const groupedData = dataSource.reduce((acc, item) => {
    const fecha = dayjs(item.fecha_programacion).format("YYYY-MM-DD");
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(item);
    return acc;
  }, {} as Record<string, DataType[]>);

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at_string",
      key: "created_at_string",
      align: "center",
      width: 90,
      sorter: (a, b) => a.created_at_string.localeCompare(b.created_at_string),
    },
    {
      title: "Nombre Empleado",
      dataIndex: "nombres",
      key: "nombres",
      align: "center",
      width: 90,
      sorter: (a, b) => a.nombres.localeCompare(b.nombres),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      align: "center",
      width: 120,
      sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
    },
    {
      title: "Cedula",
      dataIndex: "cedula",
      key: "cedula",
      align: "center",
      width: 120,
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Proyecto(obra)",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) =>
        a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
    },
    {
      title: "Fecha programacion",
      dataIndex: "fecha_programacion",
      key: "fecha_programacion",
      sorter: (a, b) =>
        a.fecha_programacion.localeCompare(b.fecha_programacion),
    },
    {
      title: "Estado",
      dataIndex: "confirmacion",
      key: "confirmacion",
      align: "center",
      render: (_, record: { key: React.Key; confirmacion: string }) => {
        let estadoString = "";
        let color;
        if (record.confirmacion === "1") {
          estadoString = "CONFIRMADA";
          color = "green";
        } else {
          estadoString = "NO CONFIRMADA";
          color = "red";
        }
        return (
          <>
            {record.confirmacion !== "1" ? (
              <Tag color={color} key={estadoString}>
                {estadoString.toUpperCase()}
              </Tag>
            ) : (
              <ModalAsistencias dataTicket={record} />
            )}
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key; confirmacion: string }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button
                disabled={record.confirmacion === "1" ? true : false}
                icon={<EditOutlined />}
                type="primary"
              />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Administracion de Asistencia en las Obras"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear</Button>
        </Link>
      }
    >
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
            placeholder="Selecciona obra"
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
        </div>
      </SearchBar>

      <Collapse accordion style={{ background: "#1a4c9e" }}>
        {Object.entries(groupedData).map(([fecha, registros]) => (
          <Panel
            header={`Programación del ${dayjs(fecha).format("DD-MM-YYYY")} - ${
              registros.length
            } personas`}
            key={fecha}
          >
            <Table
              className="custom-table"
              rowKey={(record) => record.key}
              size="small"
              dataSource={registros}
              columns={columns}
              pagination={false}
              bordered
            />
          </Panel>
        ))}
      </Collapse>
    </StyledCard>
  );
};
