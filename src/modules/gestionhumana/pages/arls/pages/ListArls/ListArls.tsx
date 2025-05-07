import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Input, Tooltip, Typography } from "antd"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { index } from "@/services/gestion-humana/arlAPI"
import { EditOutlined, SyncOutlined } from "@ant-design/icons"
import Table, { ColumnsType } from "antd/es/table"

interface DataType {
  key: number
  nombre: string
  estado: string
}

const { Text } = Typography

export const ListArls = () => {
  const location = useLocation()
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [loadingRow, setLoadingRow] = useState<any>(true)

  const fetchBancos = () => {
    index().then(({ data: { data } }) => {
      const arls = data.map((arl) => {
        return {
          key: arl.id,
          nombre: arl.nombre,
          estado: arl.estado,
        }
      })
      setInitialData(arls)
      setDataSource(arls)
      setLoadingRow(false)
    })
  }

  useEffect(() => {
    fetchBancos()
  }, [])



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
    // {
    //   title: "Estado",
    //   dataIndex: "estado",
    //   key: "estado",
    //   align: "center",
    //   render: (_, record: { key: React.Key; estado: string }) => {
    //     let estadoString = "";
    //     let color;
    //     if (record.estado === "1") {
    //       estadoString = "ACTIVO";
    //       color = "green";
    //     } else {
    //       estadoString = "INACTIVO";
    //       color = "red";
    //     }
    //     return (
    //       <Popconfirm
    //         title="¿Desea cambiar el estado?"
    //         onConfirm={() => handleStatus(record.key)}
    //         placement="left"
    //       >
    //         <ButtonTag color={color}>
    //           <Tooltip title="Cambiar estado">
    //             <Tag
    //               color={color}
    //               key={estadoString}
    //               icon={
    //                 loadingRow.includes(record.key) ? (
    //                   <SyncOutlined spin />
    //                 ) : null
    //               }
    //             >
    //               {estadoString.toUpperCase()}
    //             </Tag>
    //           </Tooltip>
    //         </ButtonTag>
    //       </Popconfirm>
    //     );
    //   },
    //   sorter: (a, b) => a.estado.localeCompare(b.estado),
    // },
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
      title={"LISTA ARL"}
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
        dataSource={dataSource ?? initialData }
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