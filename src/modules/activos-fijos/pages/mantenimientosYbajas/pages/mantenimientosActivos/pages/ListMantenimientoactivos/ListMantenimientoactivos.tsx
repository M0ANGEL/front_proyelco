import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Link, useLocation } from "react-router-dom";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DeleteActiActivos } from "@/services/activosFijos/CrearActivosAPI";
import { VerFoto } from "@/modules/activos-fijos/pages/crearActivos/pages/ListCrearActivos/VerFoto";
import { DeleteActiMantenemimiento, getActivosMantenimientos } from "@/services/activosFijos/MantenimientoActivosAPI";

interface DataType {
  key: number;
  id: number;
  valor: string;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string;
  activo_id: string;
  user_id: string;
  estado: string;
  numero_activo: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const ListMantenimientoactivos = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getActivosMantenimientos().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          id: categoria.id,
          estado: categoria.estado.toString(),
          valor: categoria.valor,
          observaciones: categoria.observaciones,
          activo_id: categoria.activo_id,
          user_id: categoria.user_id,
          numero_activo: categoria.numero_activo,
          fecha_inicio: dayjs(categoria?.fecha_inicio).format(
            "DD-MM-YYYY HH:mm"
          ),
          fecha_fin: dayjs(categoria?.fecha_fin).format("DD-MM-YYYY HH:mm"),
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
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
    DeleteActiMantenemimiento(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      fixed: "left",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      fixed: "left",
      sorter: (a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Fecha Final",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
      fixed: "left",
      sorter: (a, b) => a.fecha_fin.localeCompare(b.fecha_fin),
      render: (text) => text?.toUpperCase(),
    },

    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Numero Acitivo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Valor Manteimiento",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      align: "center",
    },
    {
      title: "Estado Activo",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;

        if (record.estado === "1") {
          estadoString = "En Proceso";
          color = "blue";
        }else{
          estadoString = "Finalizado";
          color = "green";
        }

        return (
          <Popconfirm
            title="¿Confirmar la finalizacion del mantenimiento del activo?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title={"Finalizar mantenimiento"}>
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

    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`} >
              <Button disabled={record.estado == "0"}  icon={<EditOutlined />} type="primary" size="small" />
            </Link>
          </Tooltip>

          <VerFoto id={record.key} />
        </Space>
      ),
      fixed: "right",
      width: 110, //  aumenta el ancho para que quepan los botones
    },
  ];

  return (
    <StyledCard
      title={"Lista De Activos Fijos Mantenimientos"}
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
        scroll={{ x: 800 }}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        style={{ textAlign: "center" }}
        bordered
      />
    </StyledCard>
  );
};
