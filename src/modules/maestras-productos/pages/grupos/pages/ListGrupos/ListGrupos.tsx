/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import { getGruposProducto } from "@/services/maestras/productoGrupoAPI";

export const ListGrupos = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = () => {
    getGruposProducto().then(({ data: { data } }) => {
      const subgrupos = data.map((item) => {
        return {
          key: item.id,
          descripcion: item.descripcion,
        };
      });
      setInitialData(subgrupos);
      setDataSource(subgrupos);
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
        title={"Lista de Grupos"}
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
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
