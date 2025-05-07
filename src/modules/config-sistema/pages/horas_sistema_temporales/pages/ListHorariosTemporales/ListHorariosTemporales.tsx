import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import {
  cambioEstadoHorariAdicional,
  getPerfilesHorariosAdicional,
} from "@/services/horarios-sistema/horarioTemporalAPI";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";

const { Text } = Typography;

export const ListHorariosTemporales = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [open, setOpen] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const location = useLocation();
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = () => {
    setOpen(true);
    getPerfilesHorariosAdicional().then(({ data }) => {
      const menus = data.data.map((menu) => {
        return {
          id: menu.id,
          key: menu.id,
          observacion: menu.observacion,
          fecha_inicio: menu.fecha_inicio,
          fecha_final: menu.fecha_final,
          usuarios_autorizados: menu.usuarios_autorizados,
          estado: menu.estado,
        };
      });
      setInitialData(menus);
      setDataSource(menus);
    });
    setOpen(false);
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

    cambioEstadoHorariAdicional(id)
      .then(() => {
        fetchMenus();
      })
      .catch((error) => {
        notification.error({
          message: "Error al inactivar el horario adicional",
          description: error,
        });
      })
      .finally(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
      sorter: (a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio),
    },
    {
      title: "Fecha Final",
      dataIndex: "fecha_final",
      key: "fecha_final",
      sorter: (a, b) => a.fecha_final.localeCompare(b.fecha_final),
    },

    {
      title: " Observacion",
      dataIndex: "observacion",
      key: "observacion",
      sorter: (a, b) => a.observacion.localeCompare(b.observacion),
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
    <>
      <StyledCard
        title={"Lista de horarios adicional"}
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
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={open}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
