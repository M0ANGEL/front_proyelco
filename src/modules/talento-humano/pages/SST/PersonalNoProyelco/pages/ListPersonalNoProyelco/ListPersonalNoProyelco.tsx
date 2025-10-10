import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { SearchBar } from "@/modules/gestion-empresas/pages/empresas/pages/ListEmpresas/styled";
import { DeletePersonalNo, getPersonalesNo } from "@/services/talento-humano/personalAPI";

interface DataType {
  key: number;
  nombres: string;
  estado: string;
  identificacion: number;
  cargo: string;
  genero: string;
  telefono_celular: string;
  created_at: string;
  updated_at: string;
  fecha_ingreso: string;
  fecha_nacimiento: string;
}

const { Text } = Typography;

export const ListPersonalNoProyelco = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getPersonalesNo().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          nombres: categoria.nombre_completo,
          estado: categoria.estado.toString(),
          tipo_documento: categoria.tipo_documento,
          identificacion: categoria.identificacion,
          telefono_celular: categoria.telefono_celular,
          genero: categoria.genero,
          cargo: categoria.cargo,
          estado_civil: categoria.estado_civil,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_ingreso: dayjs(categoria?.fecha_ingreso).format("DD-MM-YYYY"),
          fecha_nacimiento: dayjs(categoria?.fecha_nacimiento).format("DD-MM-YYYY"),
        };
      });

      setInitialData(categorias);
      setDataSource(categorias);
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
    );
    setDataSource(filterTable);
  };

  //cambio de estado
  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeletePersonalNo(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Ingreso",
      dataIndex: "fecha_ingreso",
      key: "fecha_ingreso",
      sorter: (a, b) => a.fecha_ingreso.localeCompare(b.fecha_ingreso),
    },
       {
      title: "Fecha Nacimiento",
      dataIndex: "fecha_nacimiento",
      key: "fecha_nacimiento",
      sorter: (a, b) => a.fecha_nacimiento.localeCompare(b.fecha_nacimiento),
    },
    {
      title: "Nombre Completo",
      dataIndex: "nombres",
      key: "nombres",
      sorter: (a, b) => a.nombres.localeCompare(b.nombres),
    },
    {
      title: "Genero",
      dataIndex: "genero",
      key: "genero",
    },
    {
      title: "Estado Civil",
      dataIndex: "estado_civil",
      key: "estado_civil",
    },
    {
      title: "Tipo Documento",
      dataIndex: "tipo_documento",
      key: "tipo_documento",
    },
    {
      title: "Cedula",
      dataIndex: "identificacion",
      key: "identificacion",
    },
    {
      title: "Telefono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
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
            <ButtonTag
              color={color}
            >
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
  ];

  return (
    <StyledCard
      title={"Lista de Personal No Proyelco"}
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
          defaultPageSize: 15,
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

