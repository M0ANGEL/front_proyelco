// import { SearchBar } from "@/modules/common/components/FormDocuments/styled";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { getProcesosDisciplinarios } from "@/services/gestion-humana/procesosdisciplinariosAPI"
import Table, { ColumnsType } from "antd/es/table"
import { EditOutlined } from "@ant-design/icons"

interface DataType {
  key: number;
  nombre: string;
  sancion: string;
  observacion: string;
  fecha: string;
  usuario_sys: string;
}

const { Text } = Typography

export const ListProcesosDisciplinarios = () => {

  const location = useLocation()
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [loadingRow, setLoadingRow] = useState<any>(true)

  useEffect(() => {
    fetchProcesosDisciplinarios()
  }, [])

  const fetchProcesosDisciplinarios = () => {

    getProcesosDisciplinarios().then(({ data: { data } }) => {
      const procesosDisciplinarios = data.map((procesosDisciplinario) => {
        return {
          key: procesosDisciplinario.id,
          nombre: procesosDisciplinario.nombre,
          sancion: procesosDisciplinario.sancion,
          observacion: procesosDisciplinario.observacion,
          usuario_sys: procesosDisciplinario.usuario_sys,
          fecha: procesosDisciplinario.created_at,
        };
      });
      setInitialData(procesosDisciplinarios)
      setDataSource(procesosDisciplinarios)
      setLoadingRow(false)
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    )
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
      title: "Observación",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
    },
    {
      title: "Sanción",
      dataIndex: "sancion",
      key: "sancion",
      sorter: (a, b) => a.sancion.localeCompare(b.sancion),
    },
    {
      title: "Usuario",
      dataIndex: "usuario_sys",
      key: "usuario_sys",
      sorter: (a, b) => a.usuario_sys.localeCompare(b.usuario_sys),
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
      title={"LISTA DE PROCESOS DISCIPLINARIOS"}
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
              <Text>Total Registros: {total}</Text>
            );
          },
        }}
        bordered
      />
    </StyledCard>
  )
}