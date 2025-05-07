import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Input,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import {
  getPorcentajes,
  setStatusPorcentaje,
} from "@/services/gestion-humana/porcentajesAPI";
import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

interface DataType {
  key: number;
  porcentaje: string;
  origen: string;
  estado: string;
  articulo: string;
  dias: string;
}

const { Text } = Typography;

export const ListPorcentajes = () => {
  const location = useLocation();
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPorcentajes();
  }, []);

  const fetchPorcentajes = () => {
    getPorcentajes().then(({ data: { data } }) => {
      const porcentajes = data.map((porcentaje) => {
        console.log(porcentaje);
        return {
          key: porcentaje.id,
          porcentaje: formatPorcentaje(porcentaje.porcentaje),
          origen: porcentaje.tipo_incapacidad,
          estado: porcentaje.estado,
          articulo: porcentaje.articulo,
          dias: porcentaje.dias,
        };
      });
      setInitialData(porcentajes);
      setDataSource(porcentajes);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  const formatPorcentaje = (value: string) => {
    // Convertir el string a número y redondear a 2 decimales
    const numericValue = parseFloat(value);
    // Formatear el número con coma como separador decimal y 2 decimales fijos
    return (
      numericValue.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + "%"
    );
  };

  // const handleStatus = (id: React.Key) => {
  //   setLoadingRow([...loadingRow, id]);
  //   setStatusPorcentaje(id)
  //     .then(() => {
  //       fetchPorcentajes();
  //     })
  //     .catch(() => {
  //       setLoadingRow([]);
  //     });
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Tipo Incapacidad",
      dataIndex: "origen",
      key: "origen",
      sorter: (a, b) => {
        const aValue = parseFloat(a.porcentaje);
        const bValue = parseFloat(b.porcentaje);
        return aValue - bValue;
      },
    },
    {
      title: "Porcentaje",
      dataIndex: "porcentaje",
      key: "porcentaje",
      sorter: (a, b) => a.porcentaje.localeCompare(b.porcentaje),
    },
    {
      title: "Articulo",
      dataIndex: "articulo",
      key: "articulo",
      sorter: (a, b) => a.articulo.localeCompare(b.articulo),
    },
    {
      title: "Dias",
      dataIndex: "dias",
      key: "dias",
      sorter: (a, b) => a.dias.localeCompare(b.dias),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Lista tipos de incapacidades-porcentajes"}
    // extra={
    //   <Link to={`${location.pathname}/create`}>
    //     <Button type="primary">Crear</Button>
    //   </Link>
    // }
    >
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
      <Table
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 5,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return (
              <Text>Total Registros: {total}</Text>
            );
          },
        }}
        bordered
      />
    </StyledCard>
  );
};
