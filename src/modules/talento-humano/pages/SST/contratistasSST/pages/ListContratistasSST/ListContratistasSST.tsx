import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { SyncOutlined } from "@ant-design/icons";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { DeleteContratista, getContratistas } from "@/services/talento-humano/contratistasAPI";
import { DataTable } from "@/components/global/DataTable";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { notify } from "@/components/global/NotificationHandler";
import useSessionStorage from "@/hooks/useSessionStorage";
import { StyledCard } from "@/components/layout/styled";

interface DataType {
  key: number;
  id: number;
  nit: string;
  nombre: string;
  arl: string;
  actividad: string;
  contacto: string;
  telefono: string;
  direccion: string;
  correo: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  estado: string;
}

const { Text } = Typography;

export const ListContratistasSST = () => {
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
    getContratistas().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          nit: categoria.nit,
          nombre: categoria.contratista,
          arl: categoria.arl,
          actividad: categoria.actividad,
          contacto: categoria.contacto,
          telefono: categoria.telefono,
          direccion: categoria.direccion,
          correo: categoria.correo,
          user_id: categoria.user_id,
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

  const handleSearch = (value: string) => {
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
    DeleteContratista(id)
      .then(() => {
        notify.success("Estado del contratista actualizado con éxito");
        fetchCategorias();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Error al cambiar el estado";
        notify.error("Error", msg);
        setLoadingRow([]);
      });
  };

  const handleEdit = (record: DataType) => {
    // Navegar a la página de edición
    window.location.href = `${location.pathname}/edit/${record.key}`;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Contratistas",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      render: (text) => text?.toUpperCase(),
      fixed: "left" as const,
    },
    {
      title: "Nit",
      dataIndex: "nit",
      key: "nit",
      sorter: (a, b) => a.nit.localeCompare(b.nit),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      sorter: (a, b) => a.telefono.localeCompare(b.telefono),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => text?.toLowerCase(),
    },
    {
      title: "Contacto",
      dataIndex: "contacto",
      key: "contacto",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: DataType) => {
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
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right" as const,
      render: (_, record: DataType) => {
        return (
          <BotonesOpciones
            botones={[
              {
                tipo: "editar",
                label: "Editar contratista",
                onClick: () => handleEdit(record),
              }
            ]}
            soloIconos={true}
            size="small"
          />
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Lista de contratistas"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear</Button>
        </Link>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Buscar contratista..." 
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300, borderRadius: 8 }}
          allowClear
        />
      </div>
      
      <DataTable
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        withPagination={true}
        hasFixedColumn={true}
        stickyHeader={true}
        scroll={{ x: 1200, y: 500 }}
      />
    </StyledCard>
  );
};