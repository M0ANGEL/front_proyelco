/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Space } from "antd";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { SearchBar } from "./styled";
import { getListapre, setStatusListapre } from "@/services/maestras/listaPreciosAPI";
import { UploadOutlined } from '@ant-design/icons';
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";


interface DataType {
  key: number;
  codigo: string;
  descripcion: string;
  estado: string;
  nit: string;
}

export const ListaPrecios = () => {
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = () => {
    getListapre().then(({ data }) => {
      const listaPre = data.map((listaPre) => {
        return {
          key: listaPre.id,
          codigo: listaPre.codigo,
          descripcion: listaPre.descripcion,
          estado: listaPre.estado,
          nit: listaPre.nit,
        };
      });
      setInitialData(listaPre);
      setDataSource(listaPre);
      setLoadingRow([]);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusListapre(id)
      .then(() => {
        fetchPerfiles();
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
        title={"Lista de precios"}
        extra={
          <>
          <Space>
            <Link to={`${location.pathname}/create`}>
              <Button type="primary">Crear</Button>
            </Link>
            
            <Link to={`${location.pathname}/import`}>
              <Button type="primary" icon={<UploadOutlined />} style={{ background: '#7cb305' }}>Importar Excel</Button>
            </Link>
            </Space>
          </>

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
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
