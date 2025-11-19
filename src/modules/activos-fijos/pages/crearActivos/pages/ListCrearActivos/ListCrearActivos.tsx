// import { useEffect, useState, useCallback } from "react";
// import {
//   Button,
//   Popconfirm,
//   Space,
//   Tag,
//   Tooltip,
//   message,
//   Typography,
//   Input,
//   Row,
//   Col
// } from "antd";
// import { Link, useLocation } from "react-router-dom";
// import { EditOutlined, SyncOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
// import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
// import dayjs from "dayjs";
// import {
//   DeleteActiActivos,
//   getActiActivos,
// } from "@/services/activosFijos/CrearActivosAPI";
// import { VerFoto } from "./VerFoto";
// import { GenerarQR } from "./GenerarQR";
// import { StyledCard } from "@/components/layout/styled";
// import { SearchBar } from "@/components/global/SearchBar";
// import { DataTable } from "@/components/global/DataTable";

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
//   usuariosAsignados: string[];
//   usuarios_confirmaron: string;
//   tipo_ubicacion: string;
//   ubicacion_actual_id: string;
//   usuarios_asignados: string;
//   aceptacion: string;
//   fecha_fin_garantia?: string;
// }

// interface Pagination {
//   current: number;
//   pageSize: number;
//   total: number;
// }

// interface ApiResponse {
//   status: string;
//   data: DataType[];
//   pagination: {
//     current_page: number;
//     per_page: number;
//     total: number;
//     last_page: number;
//     from: number;
//     to: number;
//   };
// }

// // ✅ Utilidad Debounce
// function debounce<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// }

// const { Text } = Typography;

// export const ListCrearActivos = () => {
//   const location = useLocation();
//   const [dataSource, setDataSource] = useState<DataType[]>([]);
//   const [initialData, setInitialData] = useState<DataType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingRow, setLoadingRow] = useState<number[]>([]);
//   const [searchText, setSearchText] = useState<string>("");
//   const [responsableSearch, setResponsableSearch] = useState<string>("");
//   const [pagination, setPagination] = useState<Pagination>({
//     current: 1,
//     pageSize: 50,
//     total: 0,
//   });

//   // Estados para filtros
//   const [estadoFilter, setEstadoFilter] = useState<string>();
//   const [condicionFilter, setCondicionFilter] = useState<string>();
//   const [tipoActivoFilter, setTipoActivoFilter] = useState<string>();
//   const [categoriaFilter, setCategoriaFilter] = useState<string>();
//   const [estadoTrasladoFilter, setEstadoTrasladoFilter] = useState<string>();

//   // ✅ Debounce para búsquedas
//   const debouncedSearch = useCallback(
//     debounce((search: string, responsable: string) => {
//       setPagination(prev => ({ ...prev, current: 1 }));
//       fetchActivos(1, pagination.pageSize, search, responsable);
//     }, 500),
//     [pagination.pageSize]
//   );

//   useEffect(() => {
//     fetchActivos(pagination.current, pagination.pageSize, searchText, responsableSearch);
//   }, []);

//   // ✅ Función principal para obtener activos
//   const fetchActivos = async (
//     page: number,
//     pageSize: number,
//     search: string = "",
//     responsable: string = ""
//   ) => {
//     setLoading(true);
//     try {
//       const { data: response } = await getActiActivos({
//         page,
//         per_page: pageSize,
//         search,
//         responsable
//       }) as { data: ApiResponse };

//       const formattedData = response.data.map((item) => ({
//         key: item.id,
//         id: item.id,
//         estado: item.estado.toString(),
//         numero_activo: item.numero_activo,
//         valor: Number(item.valor).toLocaleString("es-CO"),
//         condicion: item.condicion.toString(),
//         usuario: item.usuario,
//         categoria: item.categoria,
//         subcategoria: item.subcategoria,
//         created_at: dayjs(item?.created_at).format("DD-MM-YYYY HH:mm"),
//         updated_at: dayjs(item?.updated_at).format("DD-MM-YYYY HH:mm"),
//         fecha_fin_garantia: item.fecha_fin_garantia ? dayjs(item.fecha_fin_garantia).format("DD-MM-YYYY HH:mm") : '',
//         tipo_activo: item.tipo_activo.toString(),
//         origen_activo: item.origen_activo,
//         bodega_actual: item.bodega_actual,
//         usuariosAsignados: item.usuariosAsignados || [],
//         usuarios_confirmaron: item.usuarios_confirmaron,
//         tipo_ubicacion: item.tipo_ubicacion,
//         ubicacion_actual_id: item.ubicacion_actual_id,
//         usuarios_asignados: item.usuarios_asignados,
//         aceptacion: item.aceptacion.toString(),
//         descripcion: item.descripcion,
//         marca: item.marca,
//         serial: item.serial,
//         observacion: item.observacion,
//       }));

//       setDataSource(formattedData);
//       setInitialData(formattedData);
//       setPagination(prev => ({
//         ...prev,
//         current: response.pagination.current_page,
//         pageSize: response.pagination.per_page,
//         total: response.pagination.total,
//       }));
//     } catch (error) {
//       console.error("Error loading activos:", error);
//       message.error("Error al cargar los activos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Búsqueda global
//   const handleSearch = (value: string) => {
//     setSearchText(value);
//     debouncedSearch(value, responsableSearch);
//   };

//   // ✅ Búsqueda por responsable
//   const handleResponsableSearch = (value: string) => {
//     setResponsableSearch(value);
//     debouncedSearch(searchText, value);
//   };

//   // ✅ Limpiar búsqueda de responsable
//   const handleClearResponsableSearch = () => {
//     setResponsableSearch("");
//     debouncedSearch(searchText, "");
//   };

//   // ✅ Aplicar filtros combinados
//   const applyFilters = () => {
//     let filteredData = [...initialData];

//     // Filtro por estado
//     if (estadoFilter) {
//       filteredData = filteredData.filter(item => item.estado === estadoFilter);
//     }

//     // Filtro por condición
//     if (condicionFilter) {
//       filteredData = filteredData.filter(item => item.condicion === condicionFilter);
//     }

//     // Filtro por tipo de activo
//     if (tipoActivoFilter) {
//       filteredData = filteredData.filter(item => item.tipo_activo === tipoActivoFilter);
//     }

//     // Filtro por categoría
//     if (categoriaFilter) {
//       filteredData = filteredData.filter(item =>
//         item.categoria?.toLowerCase().includes(categoriaFilter.toLowerCase())
//       );
//     }

//     // Filtro por estado de traslado
//     if (estadoTrasladoFilter) {
//       filteredData = filteredData.filter(item => item.aceptacion === estadoTrasladoFilter);
//     }

//     setDataSource(filteredData);
//   };

//   // ✅ Limpiar todos los filtros
//   const handleResetFilters = () => {
//     setEstadoFilter(undefined);
//     setCondicionFilter(undefined);
//     setTipoActivoFilter(undefined);
//     setCategoriaFilter(undefined);
//     setEstadoTrasladoFilter(undefined);
//     setSearchText("");
//     setResponsableSearch("");
//     setPagination(prev => ({ ...prev, current: 1 }));
//     fetchActivos(1, pagination.pageSize, "", "");
//   };

//   // ✅ Aplicar filtros cuando cambien los valores
//   useEffect(() => {
//     applyFilters();
//   }, [estadoFilter, condicionFilter, tipoActivoFilter, categoriaFilter, estadoTrasladoFilter, initialData]);

//   const handleTableChange = (newPagination: TablePaginationConfig) => {
//     const { current = 1, pageSize = 50 } = newPagination;
//     setPagination(prev => ({ ...prev, current, pageSize }));
//     fetchActivos(current, pageSize, searchText, responsableSearch);
//   };

//   const handleStatus = async (id: number) => {
//     setLoadingRow(prev => [...prev, id]);
//     try {
//       await DeleteActiActivos(id);
//       message.success("Estado actualizado correctamente");
//       fetchActivos(pagination.current, pagination.pageSize, searchText, responsableSearch);
//     } catch (error) {
//       message.error("Error al actualizar el estado");
//     } finally {
//       setLoadingRow(prev => prev.filter(item => item !== id));
//     }
//   };

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Numero Activo",
//       dataIndex: "numero_activo",
//       key: "numero_activo",
//       sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
//       align: "center",
//       fixed: "left",
//       width: 120,
//     },
//     {
//       title: "Estado Activo",
//       dataIndex: "estado",
//       key: "estado",
//       align: "center",
//       width: 120,
//       render: (_, record) => {
//         let estadoString = "";
//         let color;

//         if (record.estado === "1") {
//           estadoString = "ACTIVO";
//           color = "green";
//         } else {
//           estadoString = "INACTIVO";
//           color = "red";
//         }

//         const isDisabled = !["0", "3"].includes(record.aceptacion);

//         return (
//           <Popconfirm
//             title="¿Desea cambiar el estado (Dar de baja)?"
//             onConfirm={() => handleStatus(record.key)}
//             placement="left"
//             disabled={isDisabled}
//           >
//             <Tooltip
//               title={
//                 isDisabled ? "No disponible para este activo" : "Dar de baja"
//               }
//             >
//               <Tag
//                 color={color}
//                 key={estadoString}
//                 icon={
//                   loadingRow.includes(record.key) ? (
//                     <SyncOutlined spin />
//                   ) : null
//                 }
//                 style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
//               >
//                 {estadoString.toUpperCase()}
//               </Tag>
//             </Tooltip>
//           </Popconfirm>
//         );
//       },
//     },
//     {
//       title: "Tipo Activo",
//       dataIndex: "tipo_activo",
//       key: "tipo_activo",
//       align: "center",
//       width: 100,
//       render: (_, record) => {
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
//       width: 150,
//     },
//     {
//       title: "Subcategoria",
//       dataIndex: "subcategoria",
//       key: "subcategoria",
//       sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
//       render: (text) => text?.toUpperCase(),
//       width: 150,
//     },
//     {
//       title: "Descripcion",
//       dataIndex: "descripcion",
//       key: "descripcion",
//       sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
//       render: (text) => text?.toUpperCase(),
//       width: 200,
//     },
//     {
//       title: "Ubicacion Actual",
//       dataIndex: "bodega_actual",
//       key: "bodega_actual",
//       sorter: (a, b) => a.bodega_actual.localeCompare(b.bodega_actual),
//       align: "center",
//       width: 150,
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Responsable",
//       dataIndex: "usuariosAsignados",
//       key: "usuariosAsignados",
//       align: "center",
//       width: 150,
//       render: (usuarios: string[]) =>
//         usuarios && usuarios.length > 0
//           ? usuarios.join(", ").toUpperCase()
//           : "SIN RESPONSABLE",
//     },
//     {
//       title: "Condición",
//       dataIndex: "condicion",
//       key: "condicion",
//       align: "center",
//       width: 100,
//       render: (_, record) => {
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
//       width: 120,
//       render: (_, record) => {
//         let estadoString;
//         let color;

//         if (record.aceptacion == "0") {
//           estadoString = "SIN TRASLADAR";
//           color = "yellow";
//         } else if (record.aceptacion == "1") {
//           estadoString = "PENDIENTE";
//           color = "red";
//         } else if (record.aceptacion == "2") {
//           estadoString = "ACEPTADO";
//           color = "green";
//         } else if (record.aceptacion == "3") {
//           estadoString = "SIN TRASLADAR";
//           color = "yellow";
//         } else if (record.aceptacion == "4") {
//           estadoString = "MANTENIMIENTO";
//           color = "blue";
//         } else {
//           estadoString = "MANTENIMIENTO";
//           color = "blue";
//         }

//         return (
//           <Tag color={color} key={estadoString}>
//             {estadoString}
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
//       width: 120,
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
//       width: 150,
//     },
//   ];

//   // Opciones para los filtros
//   const filterOptions = [
//     {
//       key: "estado",
//       label: "Estado Activo",
//       options: [
//         { label: "Activo", value: "1" },
//         { label: "Inactivo", value: "2" }
//       ],
//       value: estadoFilter,
//       onChange: setEstadoFilter
//     },
//     {
//       key: "condicion",
//       label: "Condición",
//       options: [
//         { label: "Bueno", value: "1" },
//         { label: "Regular", value: "2" },
//         { label: "Malo", value: "3" }
//       ],
//       value: condicionFilter,
//       onChange: setCondicionFilter
//     },
//     {
//       key: "tipo_activo",
//       label: "Tipo Activo",
//       options: [
//         { label: "Mayores", value: "1" },
//         { label: "Menores", value: "2" }
//       ],
//       value: tipoActivoFilter,
//       onChange: setTipoActivoFilter
//     },
//     {
//       key: "estado_traslado",
//       label: "Estado Traslado",
//       options: [
//         { label: "Sin Trasladar", value: "0" },
//         { label: "Pendiente", value: "1" },
//         { label: "Aceptado", value: "2" },
//         { label: "Mantenimiento", value: "4" }
//       ],
//       value: estadoTrasladoFilter,
//       onChange: setEstadoTrasladoFilter
//     }
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
//       {/* ✅ Barra de búsquedas mejorada */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col xs={24} md={12}>
//           <Input.Search
//             placeholder="Buscar en todos los campos..."
//             value={searchText}
//             onChange={(e) => handleSearch(e.target.value)}
//             allowClear
//             disabled
//             enterButton={<SearchOutlined />}
//           />
//         </Col>
//         <Col xs={24} md={12}>
//           <Input.Search
//             placeholder="Buscar por responsable..."
//             value={responsableSearch}
//             onChange={(e) => handleResponsableSearch(e.target.value)}
//             allowClear={{
//               clearIcon: <ClearOutlined onClick={handleClearResponsableSearch} />
//             }}
//             enterButton={<SearchOutlined />}
//           />
//         </Col>
//       </Row>

//       <SearchBar
//         onSearch={handleSearch}
//         onReset={handleResetFilters}
//         placeholder="Buscar en todos los campos..."
//         filters={filterOptions}
//         showFilterButton={false}
//       />

//       <DataTable
//         className="custom-table"
//         rowKey="key"
//         size="small"
//         dataSource={dataSource}
//         columns={columns}
//         loading={loading}
//         scroll={{ x: 1600 }}
//         pagination={{
//           current: pagination.current,
//           pageSize: pagination.pageSize,
//           total: pagination.total,
//           showSizeChanger: true,
//           pageSizeOptions: ["30", "50", "100"],
//           showTotal: (total, range) => (
//             <Text strong>
//               Mostrando {range[0]}-{range[1]} de {total} registros
//               {responsableSearch && ` - Filtrado por responsable: "${responsableSearch}"`}
//             </Text>
//           ),
//         }}
//         onChange={handleTableChange}
//         bordered
//       />
//     </StyledCard>
//   );
// };

/* NUEVA UI, SE AGREGA BODEGA RESPONSABLE */

import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  message,
  Typography,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  EditOutlined,
  SyncOutlined,
  SearchOutlined,
  ClearOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import {
  DeleteActiActivos,
  DeleteBodegaResponsable,
  getActiActivos,
  UpdateBodegaResponsable,
} from "@/services/activosFijos/CrearActivosAPI";
import { VerFoto } from "./VerFoto";
import { GenerarQR } from "./GenerarQR";
import { StyledCard } from "@/components/layout/styled";
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";
import { getActiBodegas } from "@/services/activosFijos/BodegasAPI";

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
  fecha_fin_garantia?: string;
  bodega_responsable?: number | null;
}

interface Bodega {
  id: number;
  nombre: string;
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

const { Text } = Typography;
const { Option } = Select;

export const ListCrearActivos = () => {
  const location = useLocation();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [responsableSearch, setResponsableSearch] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  // Estados para bodegas
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loadingBodegas, setLoadingBodegas] = useState<boolean>(false);

  // Estados para filtros
  const [estadoFilter, setEstadoFilter] = useState<string>();
  const [condicionFilter, setCondicionFilter] = useState<string>();
  const [tipoActivoFilter, setTipoActivoFilter] = useState<string>();
  const [categoriaFilter, setCategoriaFilter] = useState<string>();
  const [estadoTrasladoFilter, setEstadoTrasladoFilter] = useState<string>();

  // ✅ Cargar bodegas desde API
  const fetchBodegas = async () => {
    setLoadingBodegas(true);
    try {
      const {
        data: { data },
      } = await getActiBodegas();
      const bodegasFormateadas = data.map((item) => ({
        id: item.id,
        nombre: item.nombre.toUpperCase(),
      }));
      setBodegas(bodegasFormateadas);
    } catch (error) {
      console.error("Error loading bodegas:", error);
      message.error("Error al cargar las bodegas");
    } finally {
      setLoadingBodegas(false);
    }
  };

  // ✅ Debounce para búsquedas
  const debouncedSearch = useCallback(
    debounce((search: string, responsable: string) => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchActivos(1, pagination.pageSize, search, responsable);
    }, 500),
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchActivos(
      pagination.current,
      pagination.pageSize,
      searchText,
      responsableSearch
    );
    fetchBodegas();
  }, []);

  // ✅ Función principal para obtener activos
  const fetchActivos = async (
    page: number,
    pageSize: number,
    search: string = "",
    responsable: string = ""
  ) => {
    setLoading(true);
    try {
      const { data: response } = (await getActiActivos({
        page,
        per_page: pageSize,
        search,
        responsable,
      })) as { data: ApiResponse };

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
        fecha_fin_garantia: item.fecha_fin_garantia
          ? dayjs(item.fecha_fin_garantia).format("DD-MM-YYYY HH:mm")
          : "",
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
        // ✅ Asignar directamente el valor que viene del API (cualquier número o null)
        bodega_responsable: item.bodega_responsable,
      }));

      setDataSource(formattedData);
      setInitialData(formattedData);
      setPagination((prev) => ({
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

  // ✅ Manejar cambio de bodega responsable
  const handleBodegaChange = async (activoId: number, bodegaId: number | null) => {
    try {
      if (bodegaId === null) {
        // Si se limpia el select, liberar la bodega
        await handleLiberarBodega(activoId);
        return;
      }

      await UpdateBodegaResponsable({
        activo_id: activoId,
        bodega_id: bodegaId,
      });

      // Actualizar el estado local
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === activoId ? { ...item, bodega_responsable: bodegaId } : item
        )
      );

      message.success("Bodega responsable actualizada");
    } catch (error) {
      console.error("Error updating bodega:", error);
      message.error("Error al actualizar la bodega responsable");
    }
  };

  // ✅ Liberar bodega responsable
  const handleLiberarBodega = async (activoId: number) => {
    try {
      await DeleteBodegaResponsable(activoId);

      // Actualizar el estado local
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === activoId ? { ...item, bodega_responsable: null } : item
        )
      );

      message.success("Bodega liberada correctamente");
    } catch (error) {
      console.error("Error liberating bodega:", error);
      message.error("Error al liberar la bodega");
    }
  };

  // ✅ Verificar si el select debe estar deshabilitado
  const isBodegaSelectDisabled = (aceptacion: string): boolean => {
    return aceptacion !== "0"; // Deshabilitar si aceptacion es diferente de "0"
  };

  // ✅ Búsqueda global
  const handleSearch = (value: string) => {
    setSearchText(value);
    debouncedSearch(value, responsableSearch);
  };

  // ✅ Búsqueda por responsable
  const handleResponsableSearch = (value: string) => {
    setResponsableSearch(value);
    debouncedSearch(searchText, value);
  };

  // ✅ Limpiar búsqueda de responsable
  const handleClearResponsableSearch = () => {
    setResponsableSearch("");
    debouncedSearch(searchText, "");
  };

  // ✅ Aplicar filtros combinados
  const applyFilters = () => {
    let filteredData = [...initialData];

    // Filtro por estado
    if (estadoFilter) {
      filteredData = filteredData.filter(
        (item) => item.estado === estadoFilter
      );
    }

    // Filtro por condición
    if (condicionFilter) {
      filteredData = filteredData.filter(
        (item) => item.condicion === condicionFilter
      );
    }

    // Filtro por tipo de activo
    if (tipoActivoFilter) {
      filteredData = filteredData.filter(
        (item) => item.tipo_activo === tipoActivoFilter
      );
    }

    // Filtro por categoría
    if (categoriaFilter) {
      filteredData = filteredData.filter((item) =>
        item.categoria?.toLowerCase().includes(categoriaFilter.toLowerCase())
      );
    }

    // Filtro por estado de traslado
    if (estadoTrasladoFilter) {
      filteredData = filteredData.filter(
        (item) => item.aceptacion === estadoTrasladoFilter
      );
    }

    setDataSource(filteredData);
  };

  // ✅ Limpiar todos los filtros
  const handleResetFilters = () => {
    setEstadoFilter(undefined);
    setCondicionFilter(undefined);
    setTipoActivoFilter(undefined);
    setCategoriaFilter(undefined);
    setEstadoTrasladoFilter(undefined);
    setSearchText("");
    setResponsableSearch("");
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchActivos(1, pagination.pageSize, "", "");
  };

  // ✅ Aplicar filtros cuando cambien los valores
  useEffect(() => {
    applyFilters();
  }, [
    estadoFilter,
    condicionFilter,
    tipoActivoFilter,
    categoriaFilter,
    estadoTrasladoFilter,
    initialData,
  ]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 50 } = newPagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchActivos(current, pageSize, searchText, responsableSearch);
  };

  const handleStatus = async (id: number) => {
    setLoadingRow((prev) => [...prev, id]);
    try {
      await DeleteActiActivos(id);
      message.success("Estado actualizado correctamente");
      fetchActivos(
        pagination.current,
        pagination.pageSize,
        searchText,
        responsableSearch
      );
    } catch (error) {
      message.error("Error al actualizar el estado");
    } finally {
      setLoadingRow((prev) => prev.filter((item) => item !== id));
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
                  loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
                }
                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
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
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Responsable",
      dataIndex: "usuariosAsignados",
      key: "usuariosAsignados",
      align: "center",
      width: 150,
      render: (usuarios: string[]) =>
        usuarios && usuarios.length > 0
          ? usuarios.join(", ").toUpperCase()
          : "SIN RESPONSABLE",
    },
    {
      title: "Bodega Responsable",
      dataIndex: "bodega_responsable",
      key: "bodega_responsable",
      align: "center",
      width: 200,
      render: (bodegaId: number | null, record: DataType) => {
        const isDisabled = isBodegaSelectDisabled(record.aceptacion);
        
        return (
          <Space size="small">
            <Select
              placeholder="Seleccionar bodega"
              value={bodegaId} // ✅ Se muestra cualquier ID que llegue
              onChange={(value) => handleBodegaChange(record.id, value)}
              style={{ width: 150 }}
              loading={loadingBodegas}
              allowClear
              disabled={isDisabled} // ✅ Deshabilitado si aceptacion ≠ "0"
            >
              {bodegas.map((bodega) => (
                <Option key={bodega.id} value={bodega.id}>
                  {bodega.nombre}
                </Option>
              ))}
            </Select>

            {bodegaId !== null && bodegaId !== undefined && !isDisabled && (
              <Tooltip title="Liberar bodega">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  danger
                  size="small"
                  onClick={() => handleLiberarBodega(record.id)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
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
          estadoString = "SIN TRASLADAR";
          color = "yellow";
        } else if (record.aceptacion == "1") {
          estadoString = "PENDIENTE";
          color = "red";
        } else if (record.aceptacion == "2") {
          estadoString = "ACEPTADO";
          color = "green";
        } else if (record.aceptacion == "3") {
          estadoString = "SIN TRASLADAR";
          color = "yellow";
        } else if (record.aceptacion == "4") {
          estadoString = "MANTENIMIENTO";
          color = "blue";
        } else {
          estadoString = "MANTENIMIENTO";
          color = "blue";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString}
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

  // Opciones para los filtros
  const filterOptions = [
    {
      key: "estado",
      label: "Estado Activo",
      options: [
        { label: "Activo", value: "1" },
        { label: "Inactivo", value: "2" },
      ],
      value: estadoFilter,
      onChange: setEstadoFilter,
    },
    {
      key: "condicion",
      label: "Condición",
      options: [
        { label: "Bueno", value: "1" },
        { label: "Regular", value: "2" },
        { label: "Malo", value: "3" },
      ],
      value: condicionFilter,
      onChange: setCondicionFilter,
    },
    {
      key: "tipo_activo",
      label: "Tipo Activo",
      options: [
        { label: "Mayores", value: "1" },
        { label: "Menores", value: "2" },
      ],
      value: tipoActivoFilter,
      onChange: setTipoActivoFilter,
    },
    {
      key: "estado_traslado",
      label: "Estado Traslado",
      options: [
        { label: "Sin Trasladar", value: "0" },
        { label: "Pendiente", value: "1" },
        { label: "Aceptado", value: "2" },
        { label: "Mantenimiento", value: "4" },
      ],
      value: estadoTrasladoFilter,
      onChange: setEstadoTrasladoFilter,
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
      {/* ✅ Barra de búsquedas mejorada */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Input.Search
            placeholder="Buscar en todos los campos..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            disabled
            enterButton={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} md={12}>
          <Input.Search
            placeholder="Buscar por responsable..."
            value={responsableSearch}
            onChange={(e) => handleResponsableSearch(e.target.value)}
            allowClear={{
              clearIcon: (
                <ClearOutlined onClick={handleClearResponsableSearch} />
              ),
            }}
            enterButton={<SearchOutlined />}
          />
        </Col>
      </Row>

      <SearchBar
        onSearch={handleSearch}
        onReset={handleResetFilters}
        placeholder="Buscar en todos los campos..."
        filters={filterOptions}
        showFilterButton={false}
      />

      <DataTable
        className="custom-table"
        rowKey="key"
        size="small"
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        scroll={{ x: 1900 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["30", "50", "100"],
          showTotal: (total, range) => (
            <Text strong>
              Mostrando {range[0]}-{range[1]} de {total} registros
              {responsableSearch &&
                ` - Filtrado por responsable: "${responsableSearch}"`}
            </Text>
          ),
        }}
        onChange={handleTableChange}
        bordered
      />
    </StyledCard>
  );
};