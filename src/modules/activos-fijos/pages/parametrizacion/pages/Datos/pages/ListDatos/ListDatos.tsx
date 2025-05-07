import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  notification,
  Row,
  Col,
  Typography,
  Layout,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Datos } from "@/services/types"; // Importar la interfaz de Categoría
import { useNavigate } from "react-router-dom";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { getListaDatos } from "@/services/activos/datosAPI";

const { Text } = Typography;

let timeout: ReturnType<typeof setTimeout> | null;

export const ListDatos = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<Datos[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDatos, setFilteredDatos] = useState<Datos[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    per_page: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchDatos();
  }, [currentPage, searchInput]);

  useEffect(() => {
    setFilteredDatos(
      datos.filter(
        (dato) => dato.id === Number(searchInput) // Comparar el id con searchInput convertido a número
      )
    );
  }, [searchInput]);

  useEffect(() => {
    setFilteredDatos(
      datos.filter((datos) =>
        datos.activo.nombre
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput]);


  const fetchDatos = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const response = await getListaDatos(); // Asegúrate de pasar los parámetros correctos si es necesario
        setDatos(response.data);
        setPagination({ total: response.total, per_page: response.per_page });
        setFilteredDatos(response.data); // Inicialmente mostrar todas las subcategorías
      } catch (error) {
        notification.error({
          message: "Error",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };


  const columns: ColumnsType<Datos> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Activo",
      dataIndex: "id_activo",
      key: "id_activo",
      render: (_, { activo: { nombre } }) => <span> {nombre} </span>,
    },
    {
      title: "Parametro Sub Categoria",
      dataIndex: "id_parametro_subCategoria", // Usa id_categoria aquí
      key: "id_parametro_subCategoria",
      render: (
        _,
        {
          parametro_sub_categoria: {
            parametro: { descripcion },
          },
        }
      ) => <span> {descripcion} </span>,
    },
    {
      title: "Valor",
      dataIndex: "valor_almacenado",
      key: "valor_almacenado",
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "center",
      render: (_, record: Datos) => (
        <div style={{ display: "-webkit-flex", gap: "8px" }}>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              type="primary"
              size="middle"
              onClick={() => navigate(`editar-datos/${record.id}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <StyledCard title="Lista Datos">
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar Datos"
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("crear-Datos")}
            >
              Crear Datos
            </Button>
          </Col>
        </Row>
        <Text>Total Registros: {pagination?.total}</Text>
        <Table
          bordered
          rowKey={(record) => record.id.toString()} // Asegurar que rowKey sea un string
          size="small"
          columns={columns}
          dataSource={filteredDatos}
          loading={loaderTable}
          pagination={{
            total: pagination?.total,
            pageSize: pagination?.per_page,
            simple: true,
            onChange: (page: number) => {
              setCurrentPage(page);
            },
            hideOnSinglePage: true,
          }}
        />
      </StyledCard>
    </Layout>
  );
};
