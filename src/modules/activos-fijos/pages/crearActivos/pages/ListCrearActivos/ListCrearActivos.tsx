// import { useEffect, useState } from "react";
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// import {
//   Button,
//   Input,
//   Popconfirm,
//   Space,
//   Tag,
//   Tooltip,
//   Typography,
// } from "antd";
// import { Link, useLocation } from "react-router-dom";
// // import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
// import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
// import Table, { ColumnsType } from "antd/es/table";
// import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
// import { EditOutlined, SyncOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import {
//   DeleteActiActivos,
//   getActiActivos,
// } from "@/services/activosFijos/CrearActivosAPI";
// import { VerFoto } from "./VerFoto";
// import { GenerarQR } from "./GenerarQR";

// interface DataType {
//   key: number;
//   id: number;
//   numero_activo: string;
//   categoria_id: string;
//   subcategoria_id: string;
//   descripcion: string;
//   ubicacion_id: string;
//   valor: string;
//   condicion: string;
//   updated_at: string;
//   created_at: string;
//   marca: string;
//   serial: string;
//   observacion: string;
//   estado: string;
//   usuario: string;
//   categoria: string;
//   subcategoria: string;
//   tipo_activo: string;
//   origen_activo: string;
//   bodega_actual: string;
//   usuariosAsignados: string;
//   usuarios_confirmaron: string;
//   tipo_ubicacion: string;
//   ubicacion_actual_id: string;
//   usuarios_asignados: string;
//   aceptacion: string;
// }

// const { Text } = Typography;

// export const ListCrearActivos = () => {
//   const location = useLocation();
//   const [initialData, setInitialData] = useState<DataType[]>([]);
//   const [dataSource, setDataSource] = useState<DataType[]>([]);
//   const [loadingRow, setLoadingRow] = useState<any>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchCategorias();
//   }, []);

//   const fetchCategorias = () => {
//     getActiActivos().then(({ data: { data } }) => {
//       const categorias = data.map((categoria) => {
//         return {
//           key: categoria.id,
//           estado: categoria.estado.toString(),
//           numero_activo: categoria.numero_activo,
//           valor: Number(categoria.valor).toLocaleString("es-CO"),
//           condicion: categoria.condicion.toString(),
//           usuario: categoria.usuario,
//           categoria: categoria.categoria,
//           subcategoria: categoria.subcategoria,
//           created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
//           updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
//           fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
//             "DD-MM-YYYY HH:mm"
//           ),
//           tipo_activo: categoria.tipo_activo.toString(),
//           origen_activo: categoria.origen_activo,
//           bodega_actual: categoria.bodega_actual,
//           usuariosAsignados: categoria.usuariosAsignados,
//           usuarios_confirmaron: categoria.usuarios_confirmaron,
//           tipo_ubicacion: categoria.tipo_ubicacion,
//           ubicacion_actual_id: categoria.ubicacion_actual_id,
//           usuarios_asignados: categoria.usuarios_asignados,
//           aceptacion: categoria.aceptacion.toString(),
//           descripcion: categoria.descripcion,
//         };
//       });

//       setInitialData(categorias);
//       setDataSource(categorias);
//       setLoadingRow([]);
//       setLoading(false);
//     });
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     const filterTable = initialData?.filter((o: any) =>
//       Object.keys(o).some((k) =>
//         String(o[k]).toLowerCase().includes(value.toLowerCase())
//       )
//     );
//     setDataSource(filterTable);
//   };

//   //cambio de estado
//   const handleStatus = (id: React.Key) => {
//     setLoadingRow([...loadingRow, id]);
//     DeleteActiActivos(id)
//       .then(() => {
//         fetchCategorias();
//       })
//       .catch(() => {
//         setLoadingRow([]);
//       });
//   };

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Numero Activo",
//       dataIndex: "numero_activo",
//       key: "numero_activo",
//       sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
//       align: "center",
//       fixed: "left",
//     },
//     {
//       title: "Estado Activo",
//       dataIndex: "estado",
//       key: "estado",
//       align: "center",
//       render: (_, record: { key: React.Key; estado: string }) => {
//         let estadoString = "";
//         let color;

//         if (record.estado === "1") {
//           estadoString = "ACTIVO";
//           color = "green";
//         } else {
//           estadoString = "INACTIVO";
//           color = "red";
//         }

//         // condición clara para habilitar
//         const isDisabled = !["0", "3"].includes(record.aceptacion);

//         return (
//           <Popconfirm
//             title="¿Desea cambiar el estado (Dar de baja)?"
//             onConfirm={() => handleStatus(record.key)}
//             placement="left"
//             disabled={isDisabled} // 👈 también bloquea el Popconfirm
//           >
//             <ButtonTag color={color} disabled={isDisabled}>
//               <Tooltip
//                 title={
//                   isDisabled ? "No disponible para este activo" : "Dar de baja"
//                 }
//               >
//                 <Tag
//                   color={color}
//                   key={estadoString}
//                   icon={
//                     loadingRow.includes(record.key) ? (
//                       <SyncOutlined spin />
//                     ) : null
//                   }
//                 >
//                   {estadoString.toUpperCase()}
//                 </Tag>
//               </Tooltip>
//             </ButtonTag>
//           </Popconfirm>
//         );
//       },
      
//     },
//     {
//       title: "Tipo Activo",
//       dataIndex: "tipo_activo",
//       key: "tipo_activo",
//       align: "center",
//       render: (_, record: { key: React.Key; tipo_activo: string }) => {
//         let estadoString = "";
//         let color = "";

//         if (record.tipo_activo === "1") {
//           estadoString = "MAYORES";
//           color = "green";
//         } else {
//           estadoString = "MENORES";
//           color = "blue";
//         }

//         return (
//           <Tag color={color} key={estadoString}>
//             {estadoString.toUpperCase()}
//           </Tag>
//         );
//       },
//       sorter: (a, b) => a.tipo_activo.localeCompare(b.tipo_activo),
//     },
//     {
//       title: "Categoria",
//       dataIndex: "categoria",
//       key: "categoria",
//       sorter: (a, b) => a.categoria.localeCompare(b.categoria),
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Subcategoria",
//       dataIndex: "subcategoria",
//       key: "subcategoria",
//       sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Descripcion",
//       dataIndex: "descripcion",
//       key: "descripcion",
//       sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Ubicacion Actual",
//       dataIndex: "bodega_actual",
//       key: "bodega_actual",
//       sorter: (a, b) => a.bodega_actual.localeCompare(b.bodega_actual),
//       align: "center",
//     },
//     {
//       title: "Responsable",
//       dataIndex: "usuariosAsignados",
//       key: "usuariosAsignados",
//       align: "center",
//       render: (usuarios) =>
//         usuarios && usuarios.length > 0
//           ? usuarios.join(", ")
//           : "Sin Responsable",
//     },
//     {
//       title: "Condición",
//       dataIndex: "condicion",
//       key: "condicion",
//       align: "center",
//       render: (_, record: { key: React.Key; condicion: string }) => {
//         let estadoString = "";
//         let color = "";

//         if (record.condicion === "1") {
//           estadoString = "BUENO";
//           color = "green";
//         } else if (record.condicion === "2") {
//           estadoString = "REGULAR";
//           color = "yellow";
//         } else {
//           estadoString = "MALO";
//           color = "red";
//         }

//         return (
//           <Tag color={color} key={estadoString}>
//             {estadoString.toUpperCase()}
//           </Tag>
//         );
//       },
//       sorter: (a, b) => a.condicion.localeCompare(b.condicion),
//     },
//     {
//       title: "Estado Traslado",
//       dataIndex: "aceptacion",
//       key: "aceptacion",
//       align: "center",
//       render: (_, record: { key: React.Key; aceptacion: string }) => {
//         let estadoString;
//         let color;

//         if (record.aceptacion == "0") {
//           estadoString = "Sin Trasladar";
//           color = "yellow";
//         } else if (record.aceptacion == "1") {
//           estadoString = "Pendiente";
//           color = "red";
//         } else if (record.aceptacion == "2") {
//           estadoString = "Aceptado";
//           color = "green";
//         } else if (record.aceptacion == "3") {
//           estadoString = "Rechazado";
//           color = "red";
//         } else if (record.aceptacion == "4") {
//           estadoString = "Mantenimiento";
//           color = "blue";
//         } else {
//           estadoString = "Mantenimiento";
//           color = "blue";
//         }

//         return (
//           <Tag color={color} key={estadoString}>
//             {estadoString.toUpperCase()}
//           </Tag>
//         );
//       },
//       sorter: (a, b) => a.aceptacion.localeCompare(b.aceptacion),

//     },
//     {
//       title: "Valor",
//       dataIndex: "valor",
//       key: "valor",
//       sorter: (a, b) => a.valor.localeCompare(b.valor),
//       align: "center",
//     },
//     {
//       title: "Acciones",
//       dataIndex: "acciones",
//       key: "acciones",
//       align: "center",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Editar">
//             <Link to={`${location.pathname}/edit/${record.key}`}>
//               <Button icon={<EditOutlined />} type="primary" size="small" />
//             </Link>
//           </Tooltip>

//           <VerFoto id={record.key} />
//           <GenerarQR id={record.key} numero_activo={record.numero_activo} />
//         </Space>
//       ),
//       fixed: "right",
//       width: 120, //  aumenta el ancho para que quepan los botones
//     },
//   ];

//   return (
//     <StyledCard
//       title={"Lista de Activos Fijos"}
//       extra={
//         <Link to={`${location.pathname}/create`}>
//           <Button type="primary">Crear</Button>
//         </Link>
//       }
//     >
//       <SearchBar>
//         <Input placeholder="Buscar" onChange={handleSearch} />
//       </SearchBar>
//       <Table
//         className="custom-table"
//         rowKey={(record) => record.key}
//         size="small"
//         dataSource={dataSource ?? initialData}
//         columns={columns}
//         loading={loading}
//         scroll={{ x: 800 }}
//         pagination={{
//           total: initialData?.length,
//           showSizeChanger: true,
//           defaultPageSize: 100,
//           pageSizeOptions: ["30", "50", "100"],
//           showTotal: (total: number) => {
//             return <Text>Total Registros: {total}</Text>;
//           },
//         }}
//         style={{ textAlign: "center" }}
//         bordered
//       />
//     </StyledCard>
//   );
// };
import { useEffect, useState, useCallback } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
  Table,
  message
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import {
  DeleteActiActivos,
  getActiActivos,
} from "@/services/activosFijos/CrearActivosAPI";
import { VerFoto } from "./VerFoto";
import { GenerarQR } from "./GenerarQR";

const { Text } = Typography;

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
  usuariosAsignados: string[];
  usuarios_confirmaron: string;
  tipo_ubicacion: string;
  ubicacion_actual_id: string;
  usuarios_asignados: string;
  aceptacion: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface ApiResponse {
  status: string;
  data: DataType[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// ✅ Utilidad Debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const ListCrearActivos = () => {
  const location = useLocation();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  // ✅ Debounce para búsqueda
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchActivos(1, pagination.pageSize, search);
    }, 500),
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchActivos(pagination.current, pagination.pageSize, searchText);
  }, []);

  const fetchActivos = async (page: number, pageSize: number, search: string = "") => {
    setLoading(true);
    try {
      const { data: response } = await getActiActivos({ 
        page, 
        per_page: pageSize,
        search 
      }) as { data: ApiResponse };

      const formattedData = response.data.map((item) => ({
        key: item.id,
        id: item.id,
        estado: item.estado.toString(),
        numero_activo: item.numero_activo,
        valor: Number(item.valor).toLocaleString("es-CO"),
        condicion: item.condicion.toString(),
        usuario: item.usuario,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        created_at: dayjs(item?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(item?.updated_at).format("DD-MM-YYYY HH:mm"),
        fecha_fin_garantia: item.fecha_fin_garantia ? dayjs(item.fecha_fin_garantia).format("DD-MM-YYYY HH:mm") : '',
        tipo_activo: item.tipo_activo.toString(),
        origen_activo: item.origen_activo,
        bodega_actual: item.bodega_actual,
        usuariosAsignados: item.usuariosAsignados || [],
        usuarios_confirmaron: item.usuarios_confirmaron,
        tipo_ubicacion: item.tipo_ubicacion,
        ubicacion_actual_id: item.ubicacion_actual_id,
        usuarios_asignados: item.usuarios_asignados,
        aceptacion: item.aceptacion.toString(),
        descripcion: item.descripcion,
        marca: item.marca,
        serial: item.serial,
        observacion: item.observacion,
      }));

      setDataSource(formattedData);
      setPagination(prev => ({
        ...prev,
        current: response.pagination.current_page,
        pageSize: response.pagination.per_page,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Error loading activos:", error);
      message.error("Error al cargar los activos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 50 } = newPagination;
    setPagination(prev => ({ ...prev, current, pageSize }));
    fetchActivos(current, pageSize, searchText);
  };

  const handleStatus = async (id: number) => {
    setLoadingRow(prev => [...prev, id]);
    try {
      await DeleteActiActivos(id);
      message.success("Estado actualizado correctamente");
      fetchActivos(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      message.error("Error al actualizar el estado");
    } finally {
      setLoadingRow(prev => prev.filter(item => item !== id));
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Estado Activo",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 120,
      render: (_, record) => {
        let estadoString = "";
        let color;

        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }

        const isDisabled = !["0", "3"].includes(record.aceptacion);

        return (
          <Popconfirm
            title="¿Desea cambiar el estado (Dar de baja)?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
            disabled={isDisabled}
          >
            <Tooltip
              title={
                isDisabled ? "No disponible para este activo" : "Dar de baja"
              }
            >
              <Tag
                color={color}
                key={estadoString}
                icon={
                  loadingRow.includes(record.key) ? (
                    <SyncOutlined spin />
                  ) : null
                }
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                {estadoString.toUpperCase()}
              </Tag>
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      title: "Tipo Activo",
      dataIndex: "tipo_activo",
      key: "tipo_activo",
      align: "center",
      width: 100,
      render: (_, record) => {
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
      sorter: (a, b) => a.tipo_activo.localeCompare(b.tipo_activo),
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
      render: (text) => text?.toUpperCase(),
      width: 150,
    },
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
      width: 150,
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
      width: 200,
    },
    {
      title: "Ubicacion Actual",
      dataIndex: "bodega_actual",
      key: "bodega_actual",
      sorter: (a, b) => a.bodega_actual.localeCompare(b.bodega_actual),
      align: "center",
      width: 150,
    },
    {
      title: "Responsable",
      dataIndex: "usuariosAsignados",
      key: "usuariosAsignados",
      align: "center",
      width: 150,
      render: (usuarios: string[]) =>
        usuarios && usuarios.length > 0
          ? usuarios.join(", ")
          : "Sin Responsable",
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      align: "center",
      width: 100,
      render: (_, record) => {
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
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.condicion.localeCompare(b.condicion),
    },
    {
      title: "Estado Traslado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      width: 120,
      render: (_, record) => {
        let estadoString;
        let color;

        if (record.aceptacion == "0") {
          estadoString = "Sin Trasladar";
          color = "yellow";
        } else if (record.aceptacion == "1") {
          estadoString = "Pendiente";
          color = "red";
        } else if (record.aceptacion == "2") {
          estadoString = "Aceptado";
          color = "green";
        } else if (record.aceptacion == "3") {
          estadoString = "Sin Trasladar";
          color = "yellow";
        } else if (record.aceptacion == "4") {
          estadoString = "Mantenimiento";
          color = "blue";
        } else {
          estadoString = "Mantenimiento";
          color = "blue";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.aceptacion.localeCompare(b.aceptacion),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      sorter: (a, b) => a.valor.localeCompare(b.valor),
      align: "center",
      width: 120,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" size="small" />
            </Link>
          </Tooltip>

          <VerFoto id={record.key} />
          <GenerarQR id={record.key} numero_activo={record.numero_activo} />
        </Space>
      ),
      fixed: "right",
      width: 150,
    },
  ];

  return (
    <StyledCard
      title={"Lista de Activos Fijos"}
      extra={
        <Link to={`${location.pathname}/create`}>
          <Button type="primary">Crear</Button>
        </Link>
      }
    >
      <SearchBar>
        <Input 
          placeholder="Buscar por número, descripción o categoría..." 
          onChange={handleSearch}
          value={searchText}
          allowClear
          style={{ marginBottom: 16 }}
        />
      </SearchBar>

      <Table
        className="custom-table"
        rowKey="key"
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["30", "50", "100"],
          showTotal: (total, range) => 
            `Mostrando ${range[0]}-${range[1]} de ${total} registros`,
        }}
        onChange={handleTableChange}
        bordered
      />
    </StyledCard>
  );
};