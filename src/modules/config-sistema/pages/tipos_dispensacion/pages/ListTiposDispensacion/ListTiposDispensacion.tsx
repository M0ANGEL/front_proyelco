/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTiposDispensaciones } from "@/services/maestras/tiposDispensacionesAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";

const { Text } = Typography;

export const ListTiposDispensacion = () => {
  const [loaderData, setLoaderData] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchTiposDocumentos();
  }, []);

  const fetchTiposDocumentos = () => {
    getTiposDispensaciones().then(({ data: { data } }) => {
      const tipos = data.map((tipo) => {
        return {
          key: tipo.id,
          descripcion: tipo.descripcion,
        };
      });
      setInitialData(tipos);
      setDataSource(tipos);
      setLoaderData(false);
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
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, { key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${key}`}>
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
        title={"Lista de Tipos de Dispensación"}
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
