// import { useEffect, useState } from "react"
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
// import { Button, Input,  Popconfirm,  Tag,  Tooltip,  Typography } from "antd"
// import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled"
// import Table, { ColumnsType } from "antd/es/table"
// // import { DeleteTkCategoria } from "@/services/tickets/categoriasAPI"
// import dayjs from "dayjs"
// import { DeleteTelefono, getMaTelefonos } from "@/services/marcaciones-asistencias/ma_telefonoAPI"
// import { Link } from "react-router-dom"
// import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled"
// import { EditOutlined, SyncOutlined } from "@ant-design/icons"

// interface DataType {
//   key: number
//   marca: string
//   activo: string
//   serial_email: string
//   estado: string
//   bod_nombre: string
//   created_at: string
// }

// const { Text } = Typography

// export const ListTelefonos = () => {

//   const [initialData, setInitialData] = useState<DataType[]>([])
//   const [dataSource, setDataSource] = useState<DataType[]>([])
//   const [loadingRow, setLoadingRow] = useState<any>([])
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     fetchTelefonos()
//   }, [])

//   const fetchTelefonos = () => {
//     getMaTelefonos().then(({ data: { data } }) => {
//       const categorias = data.map((categoria) => {
//         return {
//           key: categoria.id,
//           marca: categoria.marca,
//           activo: categoria.activo,
//           estado: categoria.estado,
//           serial_email: categoria.serial_email,
//           bod_nombre: categoria.bod_nombre ? categoria.bod_nombre : "Sin sede",
//           created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
//         }
//       })

//       setInitialData(categorias)
//       setDataSource(categorias)
//       setLoadingRow([])
//       setLoading(false)
//     })
//   }

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     const filterTable = initialData?.filter((o: any) =>
//       Object.keys(o).some((k) =>
//         String(o[k]).toLowerCase().includes(value.toLowerCase())
//       )
//     )
//     setDataSource(filterTable);
//   }

//   // //cambio de estado
//   const handleStatus = (id: React.Key) => {
//     setLoadingRow([...loadingRow, id])
//     DeleteTelefono(id)
//       .then(() => {
//         fetchTelefonos()
//       })
//       .catch(() => {
//         setLoadingRow([])
//       })
//   }

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Marca",
//       dataIndex: "marca",
//       key: "marca",
//       sorter: (a, b) => a.marca.localeCompare(b.marca),
//     },
//     {
//       title: "Serial | Email",
//       dataIndex: "serial_email",
//       key: "serial_email",
//       sorter: (a, b) => a.serial_email.localeCompare(b.serial_email),
//     },

//     {
//       title: "# Activo",
//       dataIndex: "activo",
//       key: "activo",
//       sorter: (a, b) => a.activo.localeCompare(b.activo),
//     },
//     {
//       title: "Sede",
//       dataIndex: "bod_nombre",
//       key: "bod_nombre",
//       sorter: (a, b) => a.bod_nombre.localeCompare(b.bod_nombre),
//     },
//     {
//       title: "Fecha creacion",
//       dataIndex: "created_at",
//       key: "created_at",
//       sorter: (a, b) => a.created_at.localeCompare(b.created_at),
//     },
//     {
//       title: "Estado",
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
//         return (
//           <Popconfirm
//             title="¿Desea cambiar el estado?"
//             onConfirm={() => handleStatus(record.key)}
//             placement="left"
//           >
//             <ButtonTag color={color}>
//               <Tooltip title="Cambiar estado">
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
//       sorter: (a, b) => a.estado.localeCompare(b.estado),
//     },
//   ]

//   return (
//     <StyledCard
//       title={"Lista de telefonos"}
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
//         pagination={{
//           total: initialData?.length,
//           showSizeChanger: true,
//           defaultPageSize: 5,
//           pageSizeOptions: ["5", "15", "30"],
//           showTotal: (total: number) => {
//             return (
//               <Text>Total Registros: {total}</Text>
//             );
//           },
//         }}
//         bordered
//       />
//     </StyledCard>
//   )
// }

import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Popconfirm, Tag, Tooltip, Typography, Table } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  DeleteTelefono,
  getMaTelefonos,
} from "@/services/marcaciones-asistencias/ma_telefonoAPI";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { SyncOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Sede {
  id: string;
  bod_nombre: string;
}

interface TelefonoData {
  id: string;
  marca: string;
  activo: string;
  serial_email: string;
  estado: string;
  created_at: string;
  updated_at: string;
  sedes: Sede[] | string[];
}

interface DataType {
  key: string;
  marca: string;
  activo: string;
  serial_email: string;
  estado: string;
  created_at: string;
  sedes: Sede[] | string[];
}

export const ListTelefonos = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTelefonos();
  }, []);

  const fetchTelefonos = () => {
    getMaTelefonos().then(({ data: { data } }) => {
      const telefonos = data.map((telefono: TelefonoData) => {
        return {
          key: telefono.id,
          marca: telefono.marca,
          activo: telefono.activo,
          estado: telefono.estado,
          serial_email: telefono.serial_email,
          created_at: dayjs(telefono?.created_at).format("DD-MM-YYYY HH:mm"),
          sedes: telefono.sedes, // Aquí mantenemos el array de sedes
        };
      });

      setInitialData(telefonos);
      setDataSource(telefonos);
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

  const handleStatus = (id: string) => {
    setLoadingRow([...loadingRow, id]);
    DeleteTelefono(id)
      .then(() => {
        fetchTelefonos();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
      sorter: (a, b) => a.marca.localeCompare(b.marca),
    },
    {
      title: "Serial | Email",
      dataIndex: "serial_email",
      key: "serial_email",
      sorter: (a, b) => a.serial_email.localeCompare(b.serial_email),
    },
    {
      title: "# Activo",
      dataIndex: "activo",
      key: "activo",
      sorter: (a, b) => a.activo.localeCompare(b.activo),
    },
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: DataType) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title="Cambiar estado">
                <Tag
                  color={color}
                  key={estadoString}
                  icon={
                    loadingRow.includes(record.key) ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                >
                  {estadoString.toUpperCase()}
                </Tag>
              </Tooltip>
            </ButtonTag>
          </Popconfirm>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
  ];

  return (
    <StyledCard title={"Lista de teléfonos"}>
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
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              <h4>Sedes asociadas:</h4>
              {record.sedes && record.sedes.length > 0 ? (
                <ul>
                  {record.sedes.map((sede, index) => (
                    <li key={index}>
                      {typeof sede === "string" ? sede : sede.bod_nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay sedes asociadas</p>
              )}
            </div>
          ),
          rowExpandable: (record) => record.sedes && record.sedes.length > 0,
        }}
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
  );
};
