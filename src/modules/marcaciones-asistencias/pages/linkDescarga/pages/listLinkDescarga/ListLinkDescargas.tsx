import { useEffect, useState } from "react"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd"
import { Link, useLocation } from "react-router-dom"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import Table, { ColumnsType } from "antd/es/table"
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled"
import {  SyncOutlined } from "@ant-design/icons"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage"
import { KEY_ROL } from "@/config/api"
import dayjs from "dayjs"
import { DeleteMaLink, getLinkDescargas } from "@/services/marcaciones-asistencias/ma_linkDescargasApi"


interface DataType {
  key: number
  nombre: string
  link_descarga: string
  estado: string
  version: string
  created_at: string
}

const { Text } = Typography

export const ListLinkDescargas = () => {

  const location = useLocation()
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [loadingRow, setLoadingRow] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = () => {
    getLinkDescargas().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => ({
        key: categoria.id,
        nombre: categoria.nombre,
        link_descarga: categoria.link_descarga,
        version: categoria.version ? categoria.version : "Antes de la migracion",
        estado: categoria.estado,
        created_at: categoria?.created_at ? dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm") : "nada",
      }));
  
      // Filtrar datos según el rol
      const filteredData = categorias.filter(categoria => {
        if (user_rol === 'administrador') {
          return true; // Administrador ve todo
        }
        return categoria.estado === "1"; // Usuarios normales solo ven activos
      });
  
      setInitialData(filteredData);
      setDataSource(filteredData);
      setLoadingRow([]);
      setLoading(false);
    });
  };
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    )
    setDataSource(filterTable);
  }

  //cambio de estado
  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id])
    DeleteMaLink(id)
      .then(() => {
        fetchCategorias()
      })
      .catch(() => {
        setLoadingRow([])
      })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Numero de version",
      dataIndex: "version",
      key: "version",
      sorter: (a, b) => a.version.localeCompare(b.version),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color} disabled={!['administrador'].includes(user_rol)}>
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </ButtonTag>
          </Popconfirm>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    {
      title: "Descargar | Actualizar",
      dataIndex: "link_descarga",
      key: "link_descarga",
      align: "center",
      render: (_, record) => (
        <Button 
          type="primary" 
          shape="round" 
          size="small"
          href={record.link_descarga} 
          target="_blank"
        >
          Descargar
        </Button>
      ),
    }
    
  ]

  return (
    <StyledCard
      title={"Link de Descargas | Actualizar"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary" style={{display: user_rol === 'administrador' ? 'block' : 'none' }} >Crear</Button>
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
          defaultPageSize: 15,
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
