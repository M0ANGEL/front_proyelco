import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "../../../empleados/pages/ListEmpleados/styled";
import { useEffect, useState } from "react";
import { index } from "@/services/gestion-humana/retirarCesantiasAPI";
import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined, SyncOutlined } from "@ant-design/icons"


interface DataType {
  key: number;
  empleado: string;
  asunto: string;
  concepto: string
  valor: string;
  consecutivo: string;
  user: string;
  created_at: string;
}

const { Text } = Typography;

export const ListRetirarCesantias = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRetirarCesantias = async () => {

    index().then(({ data: { data } }) => {
      const retirarCesantias = data.map((riesgoarl) => {
        return {
          key: riesgoarl.id,
          empleado: riesgoarl.empleado,
          asunto: riesgoarl.asunto,
          concepto: riesgoarl.concepto,
          valor: riesgoarl.valor,
          consecutivo: riesgoarl.consecutivo,
          user: riesgoarl.user,
          created_at: riesgoarl.created_at.slice(0, 10),

        };
      });
      setInitialData(retirarCesantias);
      setDataSource(retirarCesantias);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRetirarCesantias();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      sorter: (a, b) => a.consecutivo.localeCompare(b.consecutivo),
    },
    {
      title: "Empleado",
      dataIndex: "empleado",
      key: "empleado",
      sorter: (a, b) => a.empleado.localeCompare(b.empleado),
    },
    {
      title: "Asunto",
      dataIndex: "asunto",
      key: "asunto",
      sorter: (a, b) => a.asunto.localeCompare(b.asunto),
    },
    {
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      sorter: (a, b) => a.concepto.localeCompare(b.concepto),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      render: (text) => text ? parseInt(text, 10).toLocaleString('es-CO') : null, 
    },
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (created_at) => <Text type="secondary">{created_at.slice(0, 10)}</Text>,
    },
    {
      title: "Creado por",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
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
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  return (
    <StyledCard
      title={"Lista de Retiros Cesantias"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear</Button>
        </Link>
      }
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
