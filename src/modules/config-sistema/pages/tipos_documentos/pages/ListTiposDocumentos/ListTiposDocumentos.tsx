/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import {
  getTiposDocumentos,
  setStatusTipoDocumento,
} from "@/services/maestras/tiposDocumentosAPI";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";

const { Text } = Typography;

export const ListTiposDocumentos = () => {
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loaderData, setLoaderData] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchTiposDocumentos();
  },[]);

  const fetchTiposDocumentos = () => {
    getTiposDocumentos().then(({ data }) => {
      const tipos = data.map((tipo) => {
        return {
          key: tipo.id,
          codigo: tipo.codigo,
          descripcion: tipo.descripcion,
          empresa: tipo.empresa ? tipo.empresa.emp_nombre : '',
          grupo: tipo.grupo ? tipo.grupo.nombre : '',
          consecutivo: tipo.consecutivo,
          estado: tipo.estado,
        };
      });
      setInitialData(tipos);
      setDataSource(tipos);
      setLoadingRow([]);
      setLoaderData(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusTipoDocumento(id)
      .then(() => {
        fetchTiposDocumentos();
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
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
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
      title: "Grupo",
      dataIndex: "grupo",
      key: "grupo",
      sorter: (a, b) => a.grupo.localeCompare(b.grupo),
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      sorter: (a, b) =>
        a.consecutivo.toString().localeCompare(b.consecutivo.toString()),
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
        title={"Lista de documentos"}
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
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={loaderData}
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
