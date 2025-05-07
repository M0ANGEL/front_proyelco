/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ButtonTag } from "../../../usuarios/pages/ListUsuarios/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { SearchBar } from "./styled";
import { getCargos, setStatusCargo } from "@/services/maestras/cargosAPI";

const { Text } = Typography;

interface DataType {
  key: number;
  nombre: string;
  descripcion: string;
  empresa: string;
  estado: string;
}

export const ListCargos = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = () => {
    getCargos().then(({ data: { data } }) => {
      const cargos = data.map((cargo) => {
        return {
          key: cargo.id,
          nombre: cargo.nombre,
          descripcion: cargo.descripcion,
          empresa: cargo.empresas.emp_nombre,
          estado: cargo.estado,
        };
      });
      setInitialData(cargos);
      setDataSource(cargos);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusCargo(id)
      .then(() => {
        fetchCargos();
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
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Empresa",
      dataIndex: "empresa",
      key: "empresa",
      sorter: (a, b) => a.empresa.localeCompare(b.empresa),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado) {
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
        title={"Lista de cargos"}
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
