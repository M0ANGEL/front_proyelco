import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Input,
  Space,
  Tag,
  Typography,
} from "antd";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getActiActivosDeBaja,
} from "@/services/activosFijos/CrearActivosAPI";
import { VerFoto } from "@/modules/activos-fijos/pages/crearActivos/pages/ListCrearActivos/VerFoto";

interface DataType {
  key: number;
  id: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  ubicacion_id: string;
  valor: string;
  condicion: string;
  updated_at: string;
  created_at: string;
  marca: string;
  serial: string;
  observacion: string;
  estado: string;
  usuario: string;
  categoria: string;
  subcategoria: string;
  tipo_activo: string;
  origen_activo: string;
  bodega_actual: string;
  usuariosAsignados: string;
  usuarios_confirmaron: string;
  tipo_ubicacion: string;
  ubicacion_actual_id: string;
  usuarios_asignados: string;
  aceptacion: string;
}

const { Text } = Typography;

export const ListbajaActivos = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    getActiActivosDeBaja().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          usuario: categoria.usuario,
          categoria: categoria.categoria,
          subcategoria: categoria.subcategoria,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
            "DD-MM-YYYY HH:mm"
          ),
          tipo_activo: categoria.tipo_activo.toString(),
          origen_activo: categoria.origen_activo,
          bodega_actual: categoria.bodega_actual,
          usuariosAsignados: categoria.usuariosAsignados,
          usuarios_confirmaron: categoria.usuarios_confirmaron,
          tipo_ubicacion: categoria.tipo_ubicacion,
          ubicacion_actual_id: categoria.ubicacion_actual_id,
          usuarios_asignados: categoria.usuarios_asignados,
          aceptacion: categoria.aceptacion.toString(),
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

  //cambio de estado
  // const handleStatus = (id: React.Key) => {
  //   setLoadingRow([...loadingRow, id]);
  //   DeleteActiActivos(id)
  //     .then(() => {
  //       fetchCategorias();
  //     })
  //     .catch(() => {
  //       setLoadingRow([]);
  //     });
  // };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Baja",
      dataIndex: "updated_at",
      key: "updated_at",
      fixed: "left",
      sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Tipo Activo",
      dataIndex: "tipo_activo",
      key: "tipo_activo",
      align: "center",
      render: (_, record: { key: React.Key; tipo_activo: string }) => {
        let estadoString = "";
        let color = "";

        if (record.tipo_activo === "1") {
          estadoString = "MAYORES";
          color = "green";
        } else {
          estadoString = "MENORES";
          color = "blue";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
      align: "center",
    },
    {
      title: "Ubicacion Actual",
      dataIndex: "bodega_actual",
      key: "bodega_actual",
      sorter: (a, b) => a.bodega_actual.localeCompare(b.bodega_actual),
      align: "center",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      align: "center",
    },
    {
      title: "Estado Activo",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;

        if (record.estado === "0") {
          estadoString = "De Baja";
          color = "red";
        }
        // condición clara para habilitar

        return (
          <Tag
            color={color}
            key={estadoString}
            icon={
              loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
            }
          >
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Space>
          <VerFoto id={record.key} />
        </Space>
      ),
      fixed: "right",
      width: 120, //  aumenta el ancho para que quepan los botones
    },
  ];

  return (
    <StyledCard title={"Lista De Activos De Baja"}>
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
        scroll={{ x: 800 }}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 15,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return <Text>Total Registros: {total}</Text>;
          },
        }}
        style={{ textAlign: "center" }}
        bordered
      />
    </StyledCard>
  );
};
