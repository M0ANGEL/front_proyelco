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
import dayjs from "dayjs";
import { DeleteAmCliente } from "@/services/administraClientes/AdministrarClientesApi";
import { getGestionProyecto } from "@/services/proyectos/gestionProyectoAPI";

interface DataType {
  key: number;
  tipoPoryecto_id: string;
  cliente_id: string;
  usuario_crea_id: string;
  encargado_id: string;
  descripcion_proyecto: string;
  fecha_inicio: string;
  codigo_contrato: string;
  torres: string;
  cant_pisos: string;
  apt: string;
  pisoCambiarProceso: string;
  estado: string;
  nombre_tipo: string;
  emp_nombre: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

const ListGestionProyectos = () => {
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
    getGestionProyecto().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          tipoPoryecto_id: categoria.tipoPoryecto_id,
          estado: categoria.estado.toString(),
          cliente_id: categoria.cliente_id,
          usuario_crea_id: categoria.usuario_crea_id,
          descripcion_proyecto: categoria.descripcion_proyecto,
          fecha_inicio: categoria.fecha_inicio,
          codigo_contrato: categoria.codigo_contrato,
          torres: categoria.torres,
          cant_pisos: categoria.cant_pisos,
          apt: categoria.apt,
          pisoCambiarProceso: categoria.pisoCambiarProceso,
          nombre_tipo: categoria.nombre_tipo,
          emp_nombre: categoria.emp_nombre,
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
    DeleteAmCliente(id)
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
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      fixed: "left",
    },
    {
      title: "Tipo Proyecto",
      dataIndex: "nombre_tipo",
      key: "nombre_tipo",
      sorter: (a, b) => a.nombre_tipo.localeCompare(b.nombre_tipo),
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
    },
    {
      title: "Codigo Proyecto",
      dataIndex: "codigo_contrato",
      key: "codigo_contrato",
    },
    {
      title: "Cliente",
      dataIndex: "emp_nombre",
      key: "emp_nombre",
      sorter: (a, b) => a.emp_nombre.localeCompare(b.emp_nombre),
    },

    {
      title: "Cant Torres",
      dataIndex: "torres",
      key: "torres",
      sorter: (a, b) => a.torres.localeCompare(b.torres),
      align: "center",
    },
    {
      title: "Cant Pisos",
      dataIndex: "cant_pisos",
      key: "cant_pisos",
      sorter: (a, b) => a.cant_pisos.localeCompare(b.cant_pisos),
      align: "center",
    },
    {
      title: "Cant Apt",
      dataIndex: "apt",
      key: "apt",
      sorter: (a, b) => a.apt.localeCompare(b.apt),
      align: "center",
    },
    {
      title: "Estado Proyecto",
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
              disabled={!Number(record.estado === "1") ? false : true}
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
          <Tooltip title="Gestionar">
            <Link to={`${location.pathname}/gestionar/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
      fixed: "right",
      width: 70,
    },
  ];

  return (
    <StyledCard
      title={"Lista de Proyectos Asignados"}
      // extra={
      //   <Link to={`${location.pathname}/gestionar`}>
      //     <Button type="primary">Crear</Button>
      //   </Link>
      // }
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

export default ListGestionProyectos;
