import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Tooltip, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getProyectosProyeciones } from "@/services/material/ProyeccionesAPI";

interface DataType {
  key: number;
  codigo_proyecto: string;
  descripcion_proyecto: string;
  tipo_proyecto: string;
  total_registros: number;
  fecha_ultimo_registro: string;
  fecha_primer_registro: string;
  cantidad_total: string;
  valor_total_sin_iva: string;
  usuario_carga: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

export const Proyeccion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getProyectosProyeciones().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          codigo_proyecto: categoria.codigo_proyecto,
          descripcion_proyecto: categoria.descripcion_proyecto,
          tipo_proyecto: categoria.tipo_proyecto,
          total_registros: categoria.total_registros,
          fecha_ultimo_registro: categoria.fecha_ultimo_registro,
          fecha_primer_registro: categoria.fecha_primer_registro,
          cantidad_total: categoria.cantidad_total,
          valor_total_sin_iva: Number(categoria.valor_total_sin_iva).toLocaleString("es-CO"),
          usuario_carga: categoria.usuario_carga,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(categorias);
      setDataSource(categorias);
      setLoadingRow([]);
      setLoading(false);
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

  // ✅ Función para navegar a cargar Excel con parámetros
  const handleCargarExcel = () => {
    navigate(`soliciudmaterial/cargar-excel`);
  };

  // ✅ Función para navegar a editar con código de proyecto
  const handleEditarProyeccion = (codigo_proyecto: string) => {
    navigate(`${location.pathname}/showproyeccion/${codigo_proyecto}`);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Proyecto",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      sorter: (a, b) => a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Código",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      sorter: (a, b) => a.codigo_proyecto.localeCompare(b.codigo_proyecto),
    },
    {
      title: "Tipo Proyecto",
      dataIndex: "tipo_proyecto",
      key: "tipo_proyecto",
      sorter: (a, b) => a.tipo_proyecto.localeCompare(b.tipo_proyecto),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Registros",
      dataIndex: "total_registros",
      key: "total_registros",
      sorter: (a, b) => a.total_registros - b.total_registros,
      render: (total) => total?.toLocaleString("es-CO"),
    },
    {
      title: "Fecha Cargue Excel",
      dataIndex: "fecha_ultimo_registro",
      key: "fecha_ultimo_registro",
      sorter: (a, b) => a.fecha_ultimo_registro.localeCompare(b.fecha_ultimo_registro),
      render: (fecha) => dayjs(fecha).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Valor Total",
      dataIndex: "valor_total_sin_iva",
      key: "valor_total_sin_iva",
      sorter: (a, b) => {
        const valA = parseFloat(a.valor_total_sin_iva.replace(/\./g, '').replace(',', '.'));
        const valB = parseFloat(b.valor_total_sin_iva.replace(/\./g, '').replace(',', '.'));
        return valA - valB;
      },
      render: (valor) => `$${valor}`,
    },
    {
      title: "Usuario",
      dataIndex: "usuario_carga",
      key: "usuario_carga",
      sorter: (a, b) => a.usuario_carga.localeCompare(b.usuario_carga),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: DataType) => {
        return (
          <Tooltip title="Editar Proyección">
            <Button 
              icon={<EditOutlined />} 
              type="primary" 
              onClick={() => handleEditarProyeccion(record.codigo_proyecto)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Lista de Proyecciones"}
      extra={
        <Button 
          type="primary" 
          icon={<UploadOutlined />}
          onClick={handleCargarExcel}
        >
          Cargar Proyección
        </Button>
      }
    >
      <SearchBar>
        <Input 
          placeholder="Buscar por proyecto, código, usuario..." 
          onChange={handleSearch} 
        //   style={{ width: 300 }}
        />
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
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30", "50"],
          showTotal: (total: number) => {
            return <Text>Total Proyectos: {total}</Text>;
          },
        }}
        bordered
      />
    </StyledCard>
  );
};