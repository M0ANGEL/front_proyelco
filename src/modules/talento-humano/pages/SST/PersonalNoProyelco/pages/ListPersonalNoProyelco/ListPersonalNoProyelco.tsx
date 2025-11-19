import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Tag, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { SyncOutlined } from "@ant-design/icons";
import { KEY_ROL } from "@/config/api";
import dayjs from "dayjs";
import { DeletePersonalNo, getPersonalesNo } from "@/services/talento-humano/personalAPI";
import { DataTable } from "@/components/global/DataTable";
import { BotonesOpciones } from "@/components/global/BotonesOpciones";
import { notify } from "@/components/global/NotificationHandler";
import useSessionStorage from "@/hooks/useSessionStorage";
import { StyledCard } from "@/components/layout/styled";

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
  tipo_documento: string;
  estado_civil: string;
}


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
    DeletePersonalNo(id)
      .then(() => {
        notify.success("Estado del personal actualizado con éxito");
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
      title: "Nombre Completo",
      dataIndex: "nombres",
      key: "nombres",
      sorter: (a, b) => a.nombres.localeCompare(b.nombres),
      fixed: "left" as const,
      width: 200,
    },
    {
      title: "Cédula",
      dataIndex: "identificacion",
      key: "identificacion",
      width: 120,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      width: 150,
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_celular",
      key: "telefono_celular",
      width: 120,
    },
    {
      title: "Fecha Ingreso",
      dataIndex: "fecha_ingreso",
      key: "fecha_ingreso",
      sorter: (a, b) => a.fecha_ingreso.localeCompare(b.fecha_ingreso),
      width: 130,
    },
    {
      title: "Fecha Nacimiento",
      dataIndex: "fecha_nacimiento",
      key: "fecha_nacimiento",
      sorter: (a, b) => a.fecha_nacimiento.localeCompare(b.fecha_nacimiento),
      width: 140,
    },
    {
      title: "Género",
      dataIndex: "genero",
      key: "genero",
      width: 100,
    },
    {
      title: "Estado Civil",
      dataIndex: "estado_civil",
      key: "estado_civil",
      width: 120,
    },
    {
      title: "Tipo Documento",
      dataIndex: "tipo_documento",
      key: "tipo_documento",
      width: 130,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 120,
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
      width: 100,
      render: (_, record: DataType) => {
        return (
          <BotonesOpciones
            botones={[
              {
                tipo: "editar",
                label: "Editar personal",
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
      title={"Personal No Proyelco"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear Personal</Button>
        </Link>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Buscar personal..." 
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
        scroll={{ x: 1500, y: 500 }}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} de ${total} registros`,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
        }}
      />
    </StyledCard>
  );
};