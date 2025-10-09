import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Input, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
// import { SearchBar } from "@/modules/common/components/FormDocuments/styled"
import { SearchBar } from "@/modules/gestion-empresas/pages/empresas/pages/ListEmpresas/styled";
import Table, { ColumnsType } from "antd/es/table";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getGestionProyectoEncargado,
  IniciarProyecto,
} from "@/services/proyectos/gestionProyectoAPI";
import { ModalInforme } from "./ModalInforme";
import { KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { IniciarProyectoCasas } from "@/services/proyectos/casasProyectosAPI";
import { ModalInformeCasa } from "../../../convenios/pages/ListConvenios/ModalInformeCasa";

interface DataType {
  key: number;
  tipoPoryecto_id: string;
  cliente_id: string;
  usuario_crea_id: string;
  encargado_id: string;
  descripcion_proyecto: string;
  fecha_inicio: string;
  fecha_ini_proyecto: string;
  codigo_proyecto: string;
  torres: string;
  cant_pisos: string;
  apt: string;
  pisoCambiarProceso: string;
  estado: string;
  nombre_tipo: string;
  emp_nombre: string;
  porcentaje: string;
  avance: string;
  avance_pisos: string;
  total_apartamentos: string;
  apartamentos_realizados: string;
  created_at: string;
  updated_at: string;
}

const { Text } = Typography;

const ListGestionEncargadoObra = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);

  useEffect(() => {
    fetchCategorias();
  }, []);

  // const fetchCategorias = () => {
  //   getGestionProyectoEncargado().then(({ data: { data } }) => {
  //     const categorias = data.map((categoria) => {
  //       return {
  //         key: categoria.id,
  //         tipoPoryecto_id: categoria.tipoPoryecto_id,
  //         estado: categoria.estado.toString(),
  //         cliente_id: categoria.cliente_id,
  //         usuario_crea_id: categoria.usuario_crea_id,
  //         encargado_id: categoria.encargado_id,
  //         descripcion_proyecto: categoria.descripcion_proyecto,
  //         fecha_inicio: categoria.fecha_inicio,
  //         codigo_proyecto: categoria.codigo_proyecto,
  //         torres: categoria.torres,
  //         cant_pisos: categoria.cant_pisos,
  //         avance_pisos: categoria.avance_pisos,
  //         apt: categoria.apt,
  //         pisoCambiarProceso: categoria.pisoCambiarProceso,
  //         fecha_ini_proyecto: categoria.fecha_ini_proyecto,
  //         nombre_tipo: categoria.nombre_tipo,
  //         emp_nombre: categoria.emp_nombre,
  //         porcentaje: categoria.porcentaje.toString(),
  //         avance: categoria.avance,
  //         total_apartamentos: categoria.total_apartamentos,
  //         apartamentos_realizados: categoria.apartamentos_realizados,
  //         created_at: dayjs(categoria?.created_at).format("DD-MM-YYYY HH:mm"),
  //         updated_at: dayjs(categoria?.updated_at).format("DD-MM-YYYY HH:mm"),
  //       };
  //     });

  //     setInitialData(categorias);
  //     setDataSource(categorias);
  //     setLoadingRow([]);
  //     setLoading(false);
  //   });
  // };

  const fetchCategorias = () => {
    getGestionProyectoEncargado().then(({ data: { data, data_casas } }) => {
      // 🔹 Unimos apartamentos y casas
      const proyectos = [...(data || []), ...(data_casas || [])];

      const categorias = proyectos.map((categoria) => {
        return {
          key: categoria.id,
          tipoPoryecto_id: categoria.tipoPoryecto_id,
          estado: categoria.estado?.toString(),
          cliente_id: categoria.cliente_id,
          usuario_crea_id: categoria.usuario_crea_id,
          encargado_id: categoria.encargado_id,
          descripcion_proyecto: categoria.descripcion_proyecto,
          fecha_inicio: categoria.fecha_inicio,
          codigo_proyecto: categoria.codigo_proyecto,
          torres: categoria.torres ?? null,
          cant_pisos: categoria.cant_pisos ?? null,
          avance_pisos: categoria.avance_pisos,
          apt: categoria.apt,
          pisoCambiarProceso: categoria.pisoCambiarProceso,
          fecha_ini_proyecto: categoria.fecha_ini_proyecto,
          nombre_tipo: categoria.nombre_tipo,
          emp_nombre: categoria.emp_nombre,
          porcentaje: categoria.porcentaje?.toString(),
          avance: categoria.avance,
          total_apartamentos: categoria.total_apartamentos,
          apartamentos_realizados: categoria.apartamentos_realizados,
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

  //iniciar proyecto
  const iniciarProyectoAparamentos = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    IniciarProyecto(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  //iniciar proyecto casas
  const iniciarProyectoCasas = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    IniciarProyectoCasas(id)
      .then(() => {
        fetchCategorias();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      fixed: "left",
    },
    {
      title: "Tipo Proyecto",
      dataIndex: "nombre_tipo",
      align: "center",
      key: "nombre_tipo",
      sorter: (a, b) => a.nombre_tipo.localeCompare(b.nombre_tipo),
    },
    {
      title: "Atraso Proyecto",
      dataIndex: "porcentaje",
      key: "porcentaje",
      align: "center",
      sorter: (a, b) => a.porcentaje.localeCompare(b.porcentaje),
      render: (porcentaje) => <Tag color="blue">{porcentaje}%</Tag>,
    },
    {
      title: "Avance del Proyecto",
      dataIndex: "avance",
      key: "avance",
      align: "center",
      sorter: (a, b) => a.avance.localeCompare(b.avance),
      render: (avance) => <Tag color="green">{avance}%</Tag>,
    },
    {
      title: "Descripcion",
      dataIndex: "descripcion_proyecto",
      key: "descripcion_proyecto",
      align: "center",
    },
    {
      title: "Codigo Proyecto",
      dataIndex: "codigo_proyecto",
      key: "codigo_proyecto",
      align: "center",
    },
    {
      title: "Cliente",
      dataIndex: "emp_nombre",
      key: "emp_nombre",
      align: "center",
      sorter: (a, b) => a.emp_nombre.localeCompare(b.emp_nombre),
    },
    // {
    //   title: "Estado Proyecto",
    //   dataIndex: "fecha_ini_proyecto",
    //   key: "fecha_ini_proyecto",
    //   align: "center",
    //   render: (_, record: { key: React.Key; fecha_ini_proyecto: string }) => {
    //     let estadoString = "";
    //     let color;
    //     if (record.fecha_ini_proyecto !== null) {
    //       estadoString = "PROCESO";
    //       color = "green";
    //     } else {
    //       estadoString = "INICIAR";
    //       color = "#00a9e4";
    //     }
    //     return (
    //       <Popconfirm
    //         disabled={!["Encargado Obras"].includes(user_rol)}
    //         title="¿Desea inicar el proyecto?"
    //         onConfirm={() => iniciarProyectoAparamentos(record.key)}
    //         placement="left"
    //       >
    //         <ButtonTag
    //           color={color}
    //           disabled={
    //             !Number(record.fecha_ini_proyecto !== null) ? false : true
    //           }
    //         >
    //           <Tooltip title="Iniciar Proyecto">
    //             <Tag
    //               color={color}
    //               key={estadoString}
    //               icon={
    //                 loadingRow.includes(record.key) ? (
    //                   <SyncOutlined spin />
    //                 ) : null
    //               }
    //             >
    //               {estadoString.toUpperCase()}
    //             </Tag>
    //           </Tooltip>
    //         </ButtonTag>
    //       </Popconfirm>
    //     );
    //   },
    //   sorter: (a, b) => a.estado.localeCompare(b.estado),
    // },
    {
      title: "Estado Proyecto",
      dataIndex: "fecha_ini_proyecto",
      key: "fecha_ini_proyecto",
      align: "center",
      render: (
        _,
        record: {
          key: React.Key;
          fecha_ini_proyecto: string;
          nombre_tipo: string;
        }
      ) => {
        let estadoString = "";
        let color;
        if (record.fecha_ini_proyecto !== null) {
          estadoString = "PROCESO";
          color = "green";
        } else {
          estadoString = "INICIAR";
          color = "#00a9e4";
        }

        // 🔹 Función dinámica según el tipo
        const iniciarProyecto = (id: React.Key, tipo: string) => {
          if (tipo === "Apartamentos") {
            iniciarProyectoAparamentos(id);
          } else if (tipo === "Casa") {
            iniciarProyectoCasas(id);
          }
        };

        return (
          <Popconfirm
            disabled={!["Encargado Obras"].includes(user_rol)}
            title="¿Desea iniciar el proyecto?"
            onConfirm={() => iniciarProyecto(record.key, record.nombre_tipo)}
            placement="left"
          >
            <ButtonTag
              color={color}
              disabled={record.fecha_ini_proyecto !== null}
            >
              <Tooltip title="Iniciar Proyecto">
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
    {
      title: "Acciones",
      dataIndex: "fecha_ini_proyecto",
      key: "fecha_ini_proyecto",
      align: "center",
      render: (
        _,
        record: {
          key: React.Key;
          fecha_ini_proyecto: string;
          nombre_tipo: string;
        }
      ) => {
        // 🔹 Decidir la ruta según el tipo de proyecto
        const ruta =
          record.nombre_tipo === "Casa"
            ? `${location.pathname}/casas/${record.key}`
            : `${location.pathname}/${record.key}`;

        return (
          <>
            <Tooltip
              title={
                record.fecha_ini_proyecto === null
                  ? "Inicia el proyecto para Gestionar"
                  : "Gestionar"
              }
            >
              <Link to={ruta}>
                <Button
                  disabled={record.fecha_ini_proyecto === null}
                  icon={<EditOutlined />}
                  type="primary"
                />
              </Link>
            </Tooltip>
            {record.nombre_tipo === "Casa" ? (
              <>
                <div className="status-container">
                  <ModalInformeCasa proyecto={record} />
                </div>
              </>
            ) : (
              <>
                <div className="status-container">
                  <ModalInforme proyecto={record} />
                </div>
              </>
            )}
          </>
        );
      },
      fixed: "right",
      width: 70,
    },
  ];

  return (
    <StyledCard title={"Lista de Proyectos Asignados"}>
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

export default ListGestionEncargadoObra;
