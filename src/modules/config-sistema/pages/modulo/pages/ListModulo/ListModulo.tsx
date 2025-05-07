/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { getModulos, setStatusModulo } from "@/services/maestras/modulosAPI";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";

const { Text } = Typography;

export const ListModulo = () => {
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  useEffect(() => {
    fetchModulos();
  }, []);

  const fetchModulos = () => {
    getModulos().then(({ data }) => {
      const modulos = data.map((modulo) => {
        return {
          key: modulo.id,
          cod_modulo: modulo.cod_modulo,
          nom_modulo: modulo.nom_modulo,
          desc_modulo: modulo.desc_modulo,
          estado: modulo.estado,
        };
      });
      setInitialData(modulos);
      setDataSource(modulos);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusModulo(id)
      .then(() => {
        fetchModulos();
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
      title: "Codigo",
      dataIndex: "cod_modulo",
      key: "cod_modulo",
      sorter: (a, b) => a.cod_modulo.localeCompare(b.cod_modulo),
    },
    {
      title: "Nombre",
      dataIndex: "nom_modulo",
      key: "nom_modulo",
      sorter: (a, b) => a.nom_modulo.localeCompare(b.nom_modulo),
    },
    {
      title: "Descripción",
      dataIndex: "desc_modulo",
      key: "desc_modulo",
      sorter: (a, b) => a.desc_modulo.localeCompare(b.desc_modulo),
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
        title={"Lista de modulos"}
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
