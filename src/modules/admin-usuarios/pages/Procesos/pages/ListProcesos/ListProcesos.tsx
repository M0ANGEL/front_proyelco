import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { getTkProcesos } from "@/services/tickets/procesosApi";
import dayjs from "dayjs";

interface DataType {
  key: number;
  nombre_proceso: string;
  user_id: string;
  creador: string;
  created_at: string;
}

const { Text } = Typography;

export const ListProcesos = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = () => {
    getTkProcesos().then(({ data: { data } }) => {
      const procesos = data.map((proceso) => {
        return {
          key: proceso.id,
          nombre_proceso: proceso.nombre_proceso,
          user_id: proceso.user_id,
          creador: proceso.creador,
          created_at: dayjs(proceso?.created_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(procesos);
      setDataSource(procesos);
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



  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Nombre Proceso",
      dataIndex: "nombre_proceso",
      key: "nombre_proceso",
      sorter: (a, b) => a.nombre_proceso.localeCompare(b.nombre_proceso),
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
      title={"Lista de procesos"}
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
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};
