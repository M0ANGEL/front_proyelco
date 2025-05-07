/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip, Typography } from "antd";
import { useState, useEffect } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DataType } from "./types";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import { getSubMenus } from "@/services/maestras/submenuAPI";

const { Text } = Typography;

export const ListSubmenu = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  useEffect(() => {
    fetchSubMenus();
  }, []);

  const fetchSubMenus = () => {
    getSubMenus().then(({ data }) => {
      const submenus = data.map((submenu) => {
        return {
          key: submenu.id,
          nom_smenu: submenu.nom_smenu,
          desc_smenu: submenu.desc_smenu,
        };
      });
      setInitialData(submenus);
      setDataSource(submenus);
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
      dataIndex: "nom_smenu",
      key: "nom_smenu",
      sorter: (a, b) => a.nom_smenu.localeCompare(b.nom_smenu),
    },
    {
      title: "Descripcion",
      dataIndex: "desc_smenu",
      key: "desc_smenu",
      sorter: (a, b) => a.desc_smenu.localeCompare(b.desc_smenu),
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
        title={"Lista de submenus"}
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
