import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Tooltip, Typography } from "antd"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { getAusentismos } from "@/services/gestion-humana/ausentismosAPI"
import Table, { ColumnsType } from "antd/es/table"
import { EditOutlined } from "@ant-design/icons"


interface DataType {
  key: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
  user_sys: string;
}

const { Text } = Typography

export const ListAusentismos = () => {

  const location = useLocation()
  const [loadingRow, setLoadingRow] = useState<any>(true);
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])

  useEffect(() => {
    fetchAusentismos();
  }, []);

  const fetchAusentismos = () => {
    getAusentismos().then(({ data: { data } }) => {
      
      const ausentismos = data.map((ausentismo) => {
        return {
          key: ausentismo.id,
          nombre: ausentismo.nombre_completo,
          fechaInicio: ausentismo.fecha_inicio,
          fechaFin: ausentismo.fecha_fin,
          observaciones: ausentismo.observacion,
          user_sys: ausentismo.user_sys,
        };
      });
      setInitialData(ausentismos);
      setDataSource(ausentismos);
      setLoadingRow(false);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Fecha inicio",
      dataIndex: "fechaInicio",
      key: "fechaInicio",
      sorter: (a, b) => a.fechaInicio.localeCompare(b.fechaInicio),
    },
    {
      title: "Fecha fin",
      dataIndex: "fechaFin",
      key: "fechaFin",
      sorter: (a, b) => a.fechaFin.localeCompare(b.fechaFin),
    },
    {
      title: "Observación",
      dataIndex: "observaciones",
      key: "observaciones",
      sorter: (a, b) => a.observaciones.localeCompare(b.observaciones),
    },
    {
      title: "Usuario",
      dataIndex: "user_sys",
      key: "user_sys",
      sorter: (a, b) => a.user_sys.localeCompare(b.user_sys),
      align: "center",
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

  return (
    <StyledCard
      title={"Lista de ausentismos"}
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
        loading={loadingRow}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 5,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return (
              <>
                <Text>Total Registros: {total}</Text>
              </>
            );
          },
        }}
        bordered
      />
    </StyledCard>
  )
}