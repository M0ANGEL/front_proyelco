// import { useEffect, useState } from "react";
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
// import { Input, Select, Row, Col, Tag, Typography } from "antd";
// import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
// import Table, { ColumnsType } from "antd/es/table";
// import { SyncOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { getActiHistorico } from "@/services/activosFijos/TrasladosActivosAPI";
// import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
// import { GenerarQR } from "../../../crearActivos/pages/ListCrearActivos/GenerarQR";
// import { ModalInfo } from "../../../traslados/pages/AceptarTraslados/ModalInfo";

// interface DataType {
//   key: number;
//   id: number;
//   numero_activo: string;
//   categoria_id: string;
//   subcategoria_id: string;
//   descripcion: string;
//   ubicacion_id: string;
//   valor: string;
//   fecha_fin_garantia: string;
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
//   codigo_traslado: string;
//   bodega_origen: string;
//   bodega_destino: string;
//   aceptacion: string;
// }

// const { Text } = Typography;

// export const ListKardex = () => {
//   const [initialData, setInitialData] = useState<DataType[]>([]);
//   const [dataSource, setDataSource] = useState<DataType[]>([]);
//   const [loadingRow, setLoadingRow] = useState<any>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // estados de filtros
//   const [filterTraslado, setFilterTraslado] = useState<string | null>(null);
//   const [filterActivo, setFilterActivo] = useState<string | null>(null);
//   const [filterBodegaDestino, setFilterBodegaDestino] = useState<string | null>(
//     null
//   );

//   useEffect(() => {
//     fetchCategorias();
//   }, []);

//   const fetchCategorias = () => {
//     getActiHistorico().then(({ data: { data } }) => {
//       const categorias = data.map((categoria) => {
//         return {
//           key: categoria.id,
//           codigo_traslado: categoria.codigo_traslado,
//           activo_id: categoria.activo_id,
//           user_id: categoria.user_id,
//           aceptacion: categoria.aceptacion,
//           bodega_origen: categoria.bodega_origen,
//           bodega_destino: categoria.bodega_destino,
//           usuario: categoria.usuario,
//           categoria: categoria.categoria,
//           subcategoria: categoria.subcategoria,
//           numero_activo: categoria.numero_activo,
//           valor: Number(categoria.valor).toLocaleString("es-CO"),
//           descripcion: categoria.descripcion,
//           condicion: categoria.condicion.toString(),
//           created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
//           updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
//           fecha_fin_garantia: dayjs(categoria?.fecha_fin_garantia).format(
//             "DD-MM-YYYY HH:mm"
//           ),
//           responsable: (categoria.usuariosAsignados || []).join(", "),

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

//   // aplicar filtros
//   useEffect(() => {
//     let filtered = [...initialData];

//     if (filterTraslado) {
//       filtered = filtered.filter((item) =>
//         item.codigo_traslado?.toString().includes(filterTraslado)
//       );
//     }

//     if (filterActivo) {
//       filtered = filtered.filter((item) =>
//         item.numero_activo?.toString().includes(filterActivo)
//       );
//     }

//     if (filterBodegaDestino) {
//       filtered = filtered.filter(
//         (item) =>
//           item.bodega_destino?.toLowerCase() ===
//           filterBodegaDestino.toLowerCase()
//       );
//     }

//     setDataSource(filtered);
//   }, [filterTraslado, filterActivo, filterBodegaDestino, initialData]);

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Numero Activo",
//       dataIndex: "numero_activo",
//       key: "numero_activo",
//       fixed: "left",
//       sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
//     },
//     {
//       title: "Numero Traslado",
//       dataIndex: "codigo_traslado",
//       key: "codigo_traslado",
//     },
//     {
//       title: "Categoria",
//       dataIndex: "categoria",
//       key: "categoria",
//       sorter: (a, b) => a.categoria.localeCompare(b.categoria),
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
//       title: "Area Origen",
//       dataIndex: "bodega_origen",
//       key: "bodega_origen",
//       sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Area Destino",
//       dataIndex: "bodega_destino",
//       key: "bodega_destino",
//       sorter: (a, b) => a.bodega_destino.localeCompare(b.bodega_destino),
//       render: (text) => text?.toUpperCase(),
//     },
//     {
//       title: "Responsable",
//       dataIndex: "responsable",
//       key: "responsable",
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
//           <Tag
//             color={color}
//             key={estadoString}
//             icon={
//               loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
//             }
//           >
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
//         } else {
//           estadoString = "Rechazado";
//           color = "red";
//         }

//         return (
//           <Tag color={color} key={estadoString}>
//             {estadoString.toUpperCase()}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Valor",
//       dataIndex: "valor",
//       key: "valor",
//       sorter: (a, b) => a.valor.localeCompare(b.valor),
//     },
//     {
//       title: "Acciones",
//       dataIndex: "acciones",
//       key: "acciones",
//       align: "center",
//       render: (_, record) => (
//         <>
//           <ModalInfo data={record} />
//           <VerFoto id={record.key} />
//           <GenerarQR id={record.key} numero_activo={record.numero_activo} />
//         </>
//       ),
//       fixed: "right",
//       width: 120,
//     },
//   ];

//   return (
//     <StyledCard title={"Lista de Activos Fijos para traslado"}>
//       <SearchBar>
//         <Row gutter={10}>
//           <Col>
//             <Input placeholder="Buscar general..." onChange={handleSearch} />
//           </Col>
//           <Col>
//             <Select
//               allowClear
//               placeholder="Filtrar por Traslado"
//               style={{ width: 180 }}
//               onChange={(value) => setFilterTraslado(value)}
//               options={[
//                 ...new Set(initialData.map((i) => i.codigo_traslado)),
//               ].map((v) => ({ label: v, value: v }))}
//             />
//           </Col>
//           <Col>
//             <Select
//               allowClear
//               placeholder="Filtrar por Activo"
//               style={{ width: 180 }}
//               onChange={(value) => setFilterActivo(value)}
//               options={[
//                 ...new Set(initialData.map((i) => i.numero_activo)),
//               ].map((v) => ({ label: v, value: v }))}
//             />
//           </Col>
//           <Col>
//             <Select
//               allowClear
//               placeholder="Filtrar por Bodega Destino"
//               style={{ width: 200 }}
//               onChange={(value) => setFilterBodegaDestino(value)}
//               options={[
//                 ...new Set(initialData.map((i) => i.bodega_destino)),
//               ].map((v) => ({ label: v, value: v }))}
//             />
//           </Col>
//         </Row>
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
//           pageSizeOptions: ["5", "15", "30", "100", "200"],
//           showTotal: (total: number) => {
//             return <Text>Total Registros: {total}</Text>;
//           },
//         }}
//         bordered
//       />
//     </StyledCard>
//   );
// };
import { useEffect, useState, useCallback } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Select, Row, Col, Tag, Typography, Table, message } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiHistorico } from "@/services/activosFijos/TrasladosActivosAPI";
import { VerFoto } from "../../../crearActivos/pages/ListCrearActivos/VerFoto";
import { GenerarQR } from "../../../crearActivos/pages/ListCrearActivos/GenerarQR";
import { ModalInfo } from "../../../traslados/pages/AceptarTraslados/ModalInfo";

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
  aceptacion: string;
  usuariosAsignados: string[];
  responsable: string;
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

export const ListKardex = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  // estados de filtros
  const [filterTraslado, setFilterTraslado] = useState<string | null>(null);
  const [filterActivo, setFilterActivo] = useState<string | null>(null);
  const [filterBodegaDestino, setFilterBodegaDestino] = useState<string | null>(
    null
  );

  // ✅ Debounce para búsqueda
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchHistorico(1, pagination.pageSize, search);
    }, 500),
    [pagination.pageSize]
  );

  useEffect(() => {
    fetchHistorico(pagination.current, pagination.pageSize, searchText);
  }, []);

  const fetchHistorico = async (
    page: number,
    pageSize: number,
    search: string = ""
  ) => {
    setLoading(true);
    try {
      const { data: response } = (await getActiHistorico({
        page,
        per_page: pageSize,
        search,
      })) as { data: ApiResponse };

      const formattedData = response.data.map((item) => ({
        key: item.id,
        codigo_traslado: item.codigo_traslado,
        activo_id: item.activo_id,
        user_id: item.user_id,
        aceptacion: item.aceptacion,
        bodega_origen: item.bodega_origen,
        bodega_destino: item.bodega_destino,
        usuario: item.usuario,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        numero_activo: item.numero_activo,
        valor: Number(item.valor).toLocaleString("es-CO"),
        descripcion: item.descripcion,
        condicion: item.condicion.toString(),
        created_at: dayjs(item?.created_at).format("DD-MM-YYYY HH:mm"),
        updated_at: dayjs(item?.updated_at).format("DD-MM-YYYY HH:mm"),
        fecha_fin_garantia: item.fecha_fin_garantia
          ? dayjs(item.fecha_fin_garantia).format("DD-MM-YYYY HH:mm")
          : "",
        usuariosAsignados: item.usuariosAsignados || [],
        responsable: (item.usuariosAsignados || []).join(", "),
      }));

      setDataSource(formattedData);
      setPagination((prev) => ({
        ...prev,
        current: response.pagination.current_page,
        pageSize: response.pagination.per_page,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Error loading historico:", error);
      message.error("Error al cargar el histórico");
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
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchHistorico(current, pageSize, searchText);
  };

  // ✅ Aplicar filtros locales (sin recargar del servidor)
  const filteredData = dataSource.filter((item) => {
    if (
      filterTraslado &&
      !item.codigo_traslado?.toString().includes(filterTraslado)
    ) {
      return false;
    }
    if (
      filterActivo &&
      !item.numero_activo?.toString().includes(filterActivo)
    ) {
      return false;
    }
    if (
      filterBodegaDestino &&
      item.bodega_destino?.toLowerCase() !== filterBodegaDestino.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Numero Activo",
      dataIndex: "numero_activo",
      key: "numero_activo",
      fixed: "left",
      width: 120,
      sorter: (a, b) => a.numero_activo.localeCompare(b.numero_activo),
    },
    {
      title: "Numero Traslado",
      dataIndex: "codigo_traslado",
      key: "codigo_traslado",
      width: 120,
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      width: 120,
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
    },
    {
      title: "Subcategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      width: 120,
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 150,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Area Origen",
      dataIndex: "bodega_origen",
      key: "bodega_origen",
      width: 120,
      sorter: (a, b) => a.bodega_origen.localeCompare(b.bodega_origen),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Area Destino",
      dataIndex: "bodega_destino",
      key: "bodega_destino",
      width: 120,
      sorter: (a, b) => a.bodega_destino.localeCompare(b.bodega_destino),
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "Responsable",
      dataIndex: "responsable",
      key: "responsable",
      width: 120,
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
    // {
    //   title: "Estado Traslado",
    //   dataIndex: "aceptacion",
    //   key: "aceptacion",
    //   align: "center",
    //   width: 120,
    //   render: (_, record) => {
    //     let estadoString;
    //     let color;

    //     if (record.aceptacion == "0") {
    //       estadoString = "Sin Trasladar";
    //       color = "yellow";
    //     } else if (record.aceptacion == "1") {
    //       estadoString = "Pendiente";
    //       color = "red";
    //     } else if (record.aceptacion == "2") {
    //       estadoString = "Aceptado";
    //       color = "green";
    //     } else {
    //       estadoString = "Rechazado";
    //       color = "red";
    //     }

    //     return (
    //       <Tag color={color} key={estadoString}>
    //         {estadoString.toUpperCase()}
    //       </Tag>
    //     );
    //   },
    //   sorter: (a, b) => a.aceptacion.localeCompare(b.aceptacion),
    // },
    {
      title: "Estado Traslado",
      dataIndex: "aceptacion",
      key: "aceptacion",
      align: "center",
      width: 120,
      render: (aceptacion, record) => {
        // Recibir el valor directamente
        let estadoString;
        let color;

        // Asegurar que sea string para las comparaciones
        const acepStr = String(aceptacion);

        if (acepStr === "0") {
          estadoString = "Sin Trasladar";
          color = "yellow";
        } else if (acepStr === "1") {
          estadoString = "Pendiente";
          color = "red";
        } else if (acepStr === "2") {
          estadoString = "Aceptado";
          color = "green";
        } else {
          estadoString = "Rechazado";
          color = "red";
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => Number(a.aceptacion) - Number(b.aceptacion),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      width: 100,
      sorter: (a, b) => a.valor.localeCompare(b.valor),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) => (
        <>
          <ModalInfo data={record} />
          <VerFoto id={record.key} />
          <GenerarQR id={record.key} numero_activo={record.numero_activo} />
        </>
      ),
      fixed: "right",
      width: 150,
    },
  ];

  return (
    <StyledCard title={"Histórico de Traslados de Activos"}>
      <SearchBar>
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Buscar por número, descripción, categoría..."
              onChange={handleSearch}
              value={searchText}
              allowClear
            />
          </Col>
          <Col xs={24} sm={5}>
            <Select
              allowClear
              placeholder="Filtrar por Traslado"
              style={{ width: "100%" }}
              onChange={(value) => setFilterTraslado(value)}
              options={Array.from(
                new Set(dataSource.map((i) => i.codigo_traslado))
              )
                .filter(Boolean)
                .map((v) => ({ label: v, value: v }))}
            />
          </Col>
          <Col xs={24} sm={5}>
            <Select
              allowClear
              placeholder="Filtrar por Activo"
              style={{ width: "100%" }}
              onChange={(value) => setFilterActivo(value)}
              options={Array.from(
                new Set(dataSource.map((i) => i.numero_activo))
              )
                .filter(Boolean)
                .map((v) => ({ label: v, value: v }))}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              allowClear
              placeholder="Filtrar por Bodega Destino"
              style={{ width: "100%" }}
              onChange={(value) => setFilterBodegaDestino(value)}
              options={Array.from(
                new Set(dataSource.map((i) => i.bodega_destino))
              )
                .filter(Boolean)
                .map((v) => ({ label: v, value: v }))}
            />
          </Col>
        </Row>
      </SearchBar>

      <Table
        className="custom-table"
        rowKey="key"
        size="small"
        dataSource={filteredData}
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
