/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { SearchBar, ButtonTag } from "./styled";
import { getEntidades, setStatusEntidad } from "@/services/maestras/entidadesAPI";

const { Text } = Typography;

interface DataType {
  key: React.Key;
  nombre: string;
  estado: string;
}

export const ListEntidades = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchEntidades();
  }, []);

  const fetchEntidades = () => {
    getEntidades().then(({ data: { data } }) => {
      const entidades = data.map((entidad) => {
        return {
          key: entidad.id,
          nombre: entidad.entidad,
          estado: entidad.estado_id.toString(),
        };
      });
      setInitialData(entidades);
      setDataSource(entidades);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusEntidad(id)
      .then(() => {
        fetchEntidades();
      })
      .catch(() => {
        setLoadingRow([]);
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
        //console.log("entidad estado ", record.estado_id);
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else if (record.estado === "0"){
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
        title={"Lista de Entidades"}
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
          loading={initialData.length == 0 ? true : false}
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
