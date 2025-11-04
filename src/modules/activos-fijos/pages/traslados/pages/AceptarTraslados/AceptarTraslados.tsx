import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  aceptarActivo,
  getActiActivosAceptar,
} from "@/services/activosFijos/TrasladosActivosAPI";
import { AiOutlineCheck } from "react-icons/ai";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { ModalRechazarActivo } from "./ModalRechazarActivo";

interface DataType {
  key: number;
  id: number;
  numero_activo: string;
  categoria_id: string;
  subcategoria_id: string;
  descripcion: string;
  ubicacion_id: string;
  valor: string;
  fecha_fin_garantia: string;
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
  codigo_traslado: string;
  bodega_origen: string;
  bodega_destino: string;
  mensajero: string;
  aceptacion: number;
}

const { Text } = Typography;

export const AceptarTraslados = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = () => {
    setLoading(true);
    getActiActivosAceptar().then(({ data: { data } }) => {
      const categorias = data.map((categoria) => {
        return {
          key: categoria.id,
          estado: categoria.estado.toString(),
          numero_activo: categoria.numero_activo,
          valor: categoria.valor,
          condicion: categoria.condicion.toString(),
          mensajero: categoria.mensajero.toString(),
          usuario: categoria.usuario,
          descripcion: categoria.descripcion,
          categoria: categoria.categoria,
          subcategoria: categoria.subcategoria,
          bodega_origen: categoria.bodega_origen,
          bodega_destino: categoria.bodega_destino,
          descripcion: categoria.descripcion,
          created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
          updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
          fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
            "DD-MM-YYYY HH:mm"
          ),
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

  //aceptar activo traslado
  const AceptarTraslado = (id: React.Key) => {
    aceptarActivo(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
      fixed: "left",
    },
    {
      title: "Area Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      render: (_, record: { key: React.Key; condicion: string }) => {
        let estadoString = "";
        let color = "";

        if (record.condicion === "1") {
          estadoString = "BUENO";
          color = "green";
        } else if (record.condicion === "2") {
          estadoString = "REGULAR";
          color = "yellow";
        } else {
          estadoString = "MALO";
          color = "red";
        }

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
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
    },
    {
      title: "Estado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      render: (_, record: { key: React.Key; aceptacion: number }) => {
        const estadoString = "PENDIENTE";
        const color = "red";

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
      sorter: (a, b) => a.aceptacion - b.aceptacion, // numeric sorter
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Space>
          {record.mensajero == "1" ? (
            <Tag color="orange" icon={<SyncOutlined spin />}>
              Esperando mensajero
            </Tag>
          ) : (
            <>
              <ModalRechazarActivo
                data={record}
                fetchList={() => fetchCategorias()}
              />

              <Tooltip title="Aceptar Traslado">
                <Popconfirm
                  title="¿Confirmar aceptación del traslado?"
                  description="¿Está seguro de que desea aceptar este traslado?"
                  onConfirm={() => AceptarTraslado(record.key)}
                  onCancel={() => {}}
                  okText="Sí, aceptar"
                  cancelText="Cancelar"
                  placement="leftTop"
                  okButtonProps={{
                    type: "primary",
                    danger: false,
                    style: { background: "#52c41a" },
                  }}
                >
                  <Button
                    icon={<AiOutlineCheck />}
                    size="small"
                    type="primary"
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  />
                </Popconfirm>
              </Tooltip>

              <VerFoto id={record.key} />
            </>
          )}
        </Space>
      ),
      fixed: "right",
      width: 180,
    },
  ];

  return (
    <StyledCard
      title={"Mis activos por aceptar"}
      extra={
        <Link to=".." relative="path">
          <Button danger type="primary" icon={<ArrowLeftOutlined />}>
            Volver
          </Button>
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
        bordered
      />
    </StyledCard>
  );
};
