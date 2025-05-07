import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Tooltip, Typography } from "antd"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { index } from "@/services/gestion-humana/alertasContratosAPI"
import Table, { ColumnsType } from "antd/es/table"
import { EditOutlined } from "@ant-design/icons"

interface DataType {
  key: number;
  contrato_laborale_id: string;
  dias: string;
  descripcion: string;
  nombre: string;
  estado: string;
}

const { Text } = Typography

export const ListAlertasContratos = () => {
  const location = useLocation()
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [loadingRow, setLoadingRow] = useState<any>(true)

  useEffect(() => {
    fetchAlertasContratos()
  }, [])

  const fetchAlertasContratos = () => {
    index().then(({ data: { data } }) => {
      const alertasContratos = data.map((alertasContrato) => {
        return {
          key: alertasContrato.id,
          contrato_laborale_id: alertasContrato.contrato_laborale_id,
          dias: alertasContrato.dias,
          descripcion: alertasContrato.descripcion,
          nombre: alertasContrato.nombre,
          estado: alertasContrato.estado,
        }
      })
      setInitialData(alertasContratos)
      setDataSource(alertasContratos)
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
    setDataSource(filterTable);
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Días",
      dataIndex: "dias",
      key: "dias",
      sorter: (a, b) => a.dias.localeCompare(b.dias),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
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
      title={"LISTA DE ALERTAS POR TIPO DE CONTRATO"}
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
        loading={loadingRow}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ["10", "15", "30"],
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