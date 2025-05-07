import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Space, Table, Tooltip, Typography } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import { EditOutlined } from "@ant-design/icons";
import { getDotaciones } from "@/services/gestion-humana/dotacionesAPI";
import { ColumnsType } from "antd/es/table";
import { FaPlusCircle } from "react-icons/fa";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
import { ModalIngresoDotacion } from "../../components/ModalIngresoDotacion";


interface DataType {
  key: number;
  tipo: string;
  talla: string;
  stock: string;
}

const { Text } = Typography;

export const ListDotaciones = () => {
  const location = useLocation();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalLink, setOpenModal] = useState<boolean>(false);
  const [idPreseleccion, setIdPreseleccion] = useState<string>('');
  const [dotacion, setDotacion] = useState<string>('')
  const [talla, setTalla] = useState<string>('')

  useEffect(() => {

    fetchDotaciones();
  }, []);

  const fetchDotaciones = () => {

    getDotaciones().then(({ data: { data } }) => {
      const dotaciones = data.map((dotacion) => {
        return {
          key: dotacion.id,
          tipo: dotacion.tipo,
          talla: dotacion.talla,
          stock: dotacion.stock,
        };
      });
      setInitialData(dotaciones);
      setDataSource(dotaciones);
      setLoading(false);
    });

  }

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
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      sorter: (a, b) => a.tipo.localeCompare(b.tipo),
    },
    {
      title: "Talla",
      dataIndex: "talla",
      key: "talla",
      sorter: (a, b) => a.talla.localeCompare(b.talla),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock.localeCompare(b.stock),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key, tipo: string, talla: string }) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Link to={`${location.pathname}/edit/${record.key}`}>
                <Button icon={<EditOutlined />} type="primary" size="small" />
              </Link>
            </Tooltip>

            <Tooltip title="Ingreso dotación">
              <GreenButton
                key={record.key + "tipo"}
                size="small"
                onClick={() => {
                  setOpenModal(true);
                  setIdPreseleccion(record.key.toString());
                  setDotacion(record.tipo);
                  setTalla(record.talla);
                }}
              >
                <FaPlusCircle />
              </GreenButton>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <ModalIngresoDotacion
        open={openModalLink}
        setOpen={(value: boolean) => {
          setOpenModal(value);
          fetchDotaciones();
        }}
        id={idPreseleccion}
        dotacion={dotacion}
        talla={talla}
      />
      <StyledCard
        title={"LISTA DE DOTACIONES"}
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
          dataSource={dataSource ?? initialData}
          columns={columns}
          loading={loading}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return <Text>Total Registros: {total}</Text>;
            },
          }}
          bordered
        />
      </StyledCard>
    </>
  );
};
