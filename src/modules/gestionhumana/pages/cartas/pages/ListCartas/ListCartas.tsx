import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Input } from "antd"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"

interface DataType {
  key: number
  nombre: string
  estado: string
}

export const ListCartas = () => {
  const location = useLocation()
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [loadingRow, setLoadingRow] = useState<any>([])

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
      title={"Lista cartas"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear</Button>
        </Link>
      }
    >
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
    </StyledCard>
  )
}