import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_ROL } from "@/config/api";

import {
  deletePreguntasDinamica,
  getTkPreguntasDinamicas,
} from "@/services/tickets/preguntasDinamicasApi";

interface DataType {
  key: number;
  id: number;
  pregunta: string;
  subcategoria_id: string;
  estado: string;
  created_at: string;
  subcategoria: string;
}

const { Text } = Typography;

const ListSPreguntasDinamicas = () => {
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
    getTkPreguntasDinamicas().then(({ data: { data } }) => {
      const subcategorias = data.map((subcategoria) => {
        return {
          key: subcategoria.id,
          id: subcategoria.id,
          pregunta: subcategoria.pregunta,
          subcategoria_id: subcategoria.subcategoria_id,
          subcategoria: subcategoria.subcategoria,
          estado: subcategoria.estado,
          created_at: subcategoria.created_at,
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
    deletePreguntasDinamica(id)
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
    //subcategoria
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
    },
    //pregunta
    {
      title: "Pregunta",
      dataIndex: "pregunta",
      key: "pregunta",
      sorter: (a, b) => a.pregunta.localeCompare(b.pregunta),
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
      title={"Lista de preguntas dinamcias"}
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

export default ListSPreguntasDinamicas;
