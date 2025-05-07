import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  DeleteTkPregunta,
  getTkPreguntas,
} from "@/services/tickets/preguntasAPI";
import dayjs from "dayjs";

interface DataType {
  key: number;
  pregunta: string;
  estado: string;
  tipo: string;
  created_at: string;
  nombre_crea: string;
}

const { Text } = Typography;

const ListPreguntas = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPreguntas();
  }, []);

  const fetchPreguntas = () => {
    getTkPreguntas().then(({ data: { data } }) => {
      const preguntas = data.map((pregunta) => {
        return {
          key: pregunta.id,
          pregunta: pregunta.pregunta,
          estado: pregunta.estado,
          tipo: pregunta.tipo,
          nombre_crea: pregunta.nombre_crea,
          created_at: dayjs(pregunta.created_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(preguntas);
      setDataSource(preguntas);
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
    DeleteTkPregunta(id)
      .then(() => {
        fetchPreguntas();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    //fecha creacion
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    //preguntas
    {
      title: "Pregunta",
      dataIndex: "pregunta",
      key: "pregunta",
      sorter: (a, b) => a.pregunta.localeCompare(b.pregunta),
    },
    //creador
    {
      title: "Usuario Creo",
      dataIndex: "nombre_crea",
      key: "nombre_crea",
      sorter: (a, b) => a.nombre_crea.localeCompare(b.nombre_crea),
    },
    //estado de la pregunta
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
            <ButtonTag color={color}>
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
    //acciones edit
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
      title={"Lista de preguntas para calificacion de tickets"}
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
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};

export default ListPreguntas;
