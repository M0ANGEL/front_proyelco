import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, Tooltip, Space, Typography, Table, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import { getListaUsuariosConvenios } from "@/services/facturacion/facturacionConveniosAPI";

const { Text } = Typography;

export const ListFacturacionConvenios: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [originalDataSource, setOriginalDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getListaUsuariosConvenios();
      
      const userConvenio = data.data.map((userCon) => ({
        key: userCon.id,
        id: userCon.id,
        nombre: userCon.nombre,
        descripcion: userCon.descripcion,
      }));
      setDataSource(userConvenio);
      setOriginalDataSource(userConvenio);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      message.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setDataSource(originalDataSource);
    } else {
      const filterTable = originalDataSource.filter((o) =>
        Object.values(o).some((val) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setDataSource(filterTable);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Usuario",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Convenio",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Editar">
          <Link to={`${location.pathname}/edit/${record.key}`}>
            <Button icon={<EditOutlined />} type="primary" />
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <StyledCard
      title="Lista de Usuarios Y Convenios"
      extra={
        <Space>
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        </Space>
      }
    >
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
      <Table
        className="custom-table"
        rowKey="key"
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={{
          total: dataSource.length,
          showSizeChanger: true,
          defaultPageSize: 5,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => <Text>Total Registros: {total}</Text>,
        }}
        bordered
      />
    </StyledCard>
  );
};