import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";
import {
  getTkSubCategorias,
  DeleteTkSubCategoria,
} from "@/services/tickets/subcategoriasAPI";
import dayjs from "dayjs";


interface DataType {
  key: number;
  id: number;
  tk_categoria_id: string;
  name: string;
  user_id: string;
  estado: string;
  prioridad: string;
  proceso_id: string | null;
  proceso_autoriza_id: string | null;
  autorizacion: string;
  created_at: string;
  nombre_usuario: string;
  categoria_padre: string;
  updated_at: string;
  usuarios_autorizados: string;
}

const { Text } = Typography;

const ListSubCategorias = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchSubCategorias();
  }, []);

  //peticion de sucategorias
  const fetchSubCategorias = () => {
    getTkSubCategorias().then(({ data: { data } }) => {
      const subcategorias = data.map((subcategoria) => {
        return {
          key: subcategoria.id,
          id: subcategoria.id,
          tk_categoria_id: subcategoria.tk_categoria_id,
          name: subcategoria.name,
          user_id: subcategoria.user_id,
          estado: subcategoria.estado,
          prioridad: subcategoria.prioridad,
          proceso_id: subcategoria.proceso_id,
          proceso_autoriza_id: subcategoria.proceso_autoriza_id,
          autorizacion: subcategoria.autorizacion,
          nombre_usuario: subcategoria.nombre_usuario,
          categoria_padre: subcategoria.categoria_padre,
          created_at: dayjs(subcategoria.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: subcategoria.updated_at,
          usuarios_autorizados: subcategoria.usuarios_autorizados,
        };
      });

      setInitialData(subcategorias);
      setDataSource(subcategorias);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  //manejo de busqueda de lapeticion
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  //cambio de estado de la subcategoria 1 activo || 0 inactivo
  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeleteTkSubCategoria(id)
      .then(() => {
        fetchSubCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  //tabla datos
  const columns: ColumnsType<DataType> = [
    //Fecha
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    //categoria
    {
      title: "Categoria",
      dataIndex: "categoria_padre",
      key: "categoria_padre",
      sorter: (a, b) => a.categoria_padre.localeCompare(b.categoria_padre),
    },
    //subcategoria
    {
      title: "Subcategoria",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    //usuario creo
    {
      title: "Usuario Creo",
      dataIndex: "nombre_usuario",
      key: "nombre_usuario",
      sorter: (a, b) => a.nombre_usuario.localeCompare(b.nombre_usuario),
    },
    //prioridad
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      align: "center",
      render: (_, record: { key: React.Key; prioridad: string }) => {
        let estadoString = "";
        let color;

        switch (record.prioridad) {
          case "1":
            estadoString = "BAJA";
            color = "green";
            break;
          case "2":
            estadoString = "MEDIA";
            color = "blue";
            break;
          case "3":
            estadoString = "ALTA";
            color = "red";
            break;

          default:
            break;
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.prioridad.localeCompare(b.prioridad),
    },
    //autorizacion
    {
      title: "Autorizacion",
      dataIndex: "autorizacion",
      key: "autorizacion",
      align: "center",
      render: (_, record: { key: React.Key; autorizacion: string }) => {
        let estadoString = "";
        let color;

        if (record.autorizacion === "1") {
          estadoString = "Si";
          color = "blue";
        } else {
          estadoString = "NO";
          color = "red";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.autorizacion.localeCompare(b.autorizacion),
    },
    //estado de la subcategoria
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
              disabled={!["administrador"].includes(user_rol)}
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
    },
    //acciones de editar
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
      title={"Lista de subcategorias"}
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

export default ListSubCategorias;
