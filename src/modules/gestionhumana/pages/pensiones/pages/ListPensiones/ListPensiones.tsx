import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd"
import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { getPensiones, setStatusPension } from "@/services/gestion-humana/pensionesAPI"
import useSessionStorage from "@/modules/common/hooks/useSessionStorage"
import { KEY_ROL } from "@/config/api"

interface DataType {
  key: number;
  nombre: string;
  estado: string;
}

const { Text } = Typography;

export const ListPensiones = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { getSessionVariable } = useSessionStorage()
  const user_rol = getSessionVariable(KEY_ROL)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  useEffect(() => {
    fetchPensiones();
  }, []);

  const fetchPensiones = () => {
    getPensiones().then(({ data: { data } }) => {
      const pensiones = data.map((pension) => {
        return {
          key: pension.id,
          nombre: pension.nombre,
          estado: pension.estado,
        };
      });
      setInitialData(pensiones);
      setDataSource(pensiones);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusPension(id)
      .then(() => {
        fetchPensiones();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
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
            <ButtonTag color={color} disabled={!['gh_admin', 'gh_auxiliar'].includes(user_rol)}>
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
        title={"Lista de pensiones"}
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
  
  )
}