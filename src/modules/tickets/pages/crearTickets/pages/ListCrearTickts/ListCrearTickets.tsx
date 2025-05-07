import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Input,
  notification,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { getTkTickets } from "@/services/tickets/ticketsAPI";
import { TicketModalEstado } from "../components/modalEstado/TicketModalEstado";
import { DataType } from "./types";
import dayjs from "dayjs";
import { DescargaDocTk } from "../../../adminTickets";
import { ObservacionModalCliente } from "../components/observacionCliente";
import { DescargaDocTkRespuesta } from "../components/descargaArchivosRespuesta/DescargaDocTkRespuesta";

const { Text } = Typography;

//estados
export const ListCrearTickets = () => {
  const location = useLocation();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [calificacionPendiente, setCalificacionPendiente] =
    useState<boolean>(false);

  //ejecucion
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    getTkTickets()
      .then(({ data: { data } }) => {
        const tikects = data.map((tikect) => {
          return {
            key: tikect?.id,
            id: tikect?.id,
            numero_ticket: tikect?.numero_ticket,
            categoria: tikect?.categoria,
            subcategoria: tikect?.subcategoria,
            detalle: tikect?.detalle,
            userSoluciona: tikect?.userSoluciona_id,
            rechazo: tikect?.rechazo,
            estado: tikect?.estado,
            prioridad: tikect?.prioridad,
            autorizacion: tikect?.autorizacion,
            proceso_id: tikect?.proceso_id,
            documento: tikect?.documento,
            documentoR: tikect?.documentoR,
            respuesta_autorizacion: tikect?.respuesta_autorizacion,
            usuarioAsignado: tikect?.usuarioAsignado,
            tiempo_gestion: tikect?.tiempo_gestion,
            observacion: tikect?.observacion,
            categoria_id: tikect?.categoria_id,
            subcategoria_id: tikect?.subcategoria_id,
            tiempo_restante: tikect?.tiempo_restante,
            vencido: tikect?.vencido,
            listo: tikect?.listo,
            created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
          };
        });

        setInitialData(tikects);
        setDataSource(tikects);
        setLoading(false);
        OpcionCrear(tikects);
      })
      .catch((err) => {
        console.log(err.mensagge);
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

  const pushNotification = ({ title }: { title: string }) => {
    notification.success({
      message: "Notificación",
      description: title,
      placement: "topRight",
    });
  };

  const OpcionCrear = (tikects: any) => {
    const PendienteCalifar = tikects;
    let PendienteCalifarCantidad = 0;

    for (let i = 0; i < PendienteCalifar.length; i++) {
      if (PendienteCalifar[i]?.estado === "Realizado") {
        PendienteCalifarCantidad++;
      }
    }

    if (PendienteCalifarCantidad >= 1) {
      setCalificacionPendiente(true);
    }
  };

  const columns: ColumnsType<DataType> = [
    //fecha de creacion
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    //categoria
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      sorter: (a, b) => a.categoria.localeCompare(b.categoria),
    },
    //subcategoria
    {
      title: "SubCategoria",
      dataIndex: "subcategoria",
      key: "subcategoria",
      sorter: (a, b) => a.subcategoria.localeCompare(b.subcategoria),
    },
    //numero de ticket
    {
      title: "Numero Ticket",
      dataIndex: "numero_ticket",
      key: "numero_ticket",
      sorter: (a, b) => a.numero_ticket.localeCompare(b.numero_ticket),
    },
    //estado tickets prioridad
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      align: "center",
      render: (_, record: { key: React.Key; prioridad: string }) => {
        let estadoString = "";
        let color;
        //estado del ticket

        switch (record.prioridad) {
          case "1":
            estadoString = "BAJA";
            color = "blue";
            break;

          case "2":
            estadoString = "MEDIA";
            color = "green";
            break;

          case "3":
            estadoString = "ALTA";
            color = "red";
            break;

          default:
            break;
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    //timpo de ticket
    {
      title: "Tiempo Estimado",
      dataIndex: "tiempo_gestion",
      key: "tiempo_gestion",
      render: (text, record) => {
        if (!record.tiempo_gestion || record.tiempo_gestion === "0") {
          return "No definido";
        } else {
          const tiempo = Number(record.tiempo_gestion); // Convertir a número
          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;
          return `${horas.toString().padStart(2, "0")}:${minutos
            .toString()
            .padStart(2, "0")}:00`;
        }
      },
    },
    //timpo restante del ticket
    {
      title: "Tiempo Restante",
      dataIndex: "tiempo_restante",
      key: "tiempo_restante",
      render: (text, record) => {
        if (!record.tiempo_restante || record.tiempo_restante === "0") {
          return "Tiempo Agotado";
        } else {
          const tiempo = Number(record.tiempo_restante); // Convertir a número
          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;

          return (
            <Tooltip title="Este tiempo va de la mano del horario laboral">
              <span>
                {horas.toString().padStart(2, "0")}:
                {minutos.toString().padStart(2, "0")}:00
              </span>
            </Tooltip>
          );
        }
      },

      sorter: (a: any, b: any) =>
        a.tiempo_restante.localeCompare(b.tiempo_restante),
    },
    //estado tickets
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    //usuairio asignado de ticket
    {
      title: "Asignado a",
      dataIndex: "usuarioAsignado",
      key: "usuarioAsignado",
      align: "center",
      render: (
        _,
        record: { key: React.Key; usuarioAsignado: string | null }
      ) => {
        let estadoString = "";
        //estado del ticket

        if (record.usuarioAsignado === null) {
          estadoString = "SIN ASIGNACIÓN";
        } else {
          estadoString = record.usuarioAsignado;
        }

        return <p key={estadoString}>{estadoString.toUpperCase()}</p>;
      },
      sorter: (a, b) => a.autorizacion.localeCompare(b.autorizacion),
    },
    //estado tickets autorizacion
    {
      title: "Autorizacion",
      dataIndex: "autorizacion",
      key: "autorizacion",
      align: "center",
      render: (_, record: { key: React.Key; autorizacion: string }) => {
        let estadoString = "";
        let color;
        //estado del ticket

        switch (record.autorizacion) {
          case "0":
            estadoString = "NO NECESITA";
            color = "blue";
            break;

          case "1":
            estadoString = "SIN AUTORIZAR";
            color = "red";
            break;

          case "2":
            estadoString = "AUTORIZADO";
            color = "green";
            break;

          case "3":
            estadoString = "AUTORIZACIÓN RECHAZA";
            color = "red";
            break;

          default:
            break;
        }

        return (
          <Tag color={color} key={estadoString}>
            {estadoString.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.autorizacion.localeCompare(b.autorizacion),
    },
    //estado tickets recorrdio
    {
      title: "Acciones ",
      align: "center",
      key: "acciones",
      render: (_, record: DataType) => {
        //estado del ticket
        return (
          <>
            <TicketModalEstado
              pushNotification={pushNotification}
              ticket={record}
              fetchList={() => fetchTickets()}
            />
            {record.documento === 1 ? (
              <DescargaDocTk
                id={record.id}
                pushNotification={pushNotification}
              />
            ) : null}
            <ObservacionModalCliente
              dataTicket={record}
              pushNotification={pushNotification}
              fetchList={() => fetchTickets()}
            />
             {record.documentoR === 1 ? (
              <DescargaDocTkRespuesta
                id={record.id}
                pushNotification={pushNotification}
              />
            ) : null}
            
          </>
        );
      },
    },
  ];

  return (
    <StyledCard
      title={"Lista de ticktets"}
      extra={
        <Tooltip
          title={
            calificacionPendiente
              ? "Se debe calificar los tickets que tienen logo de estrella, para poder seguir creando nuevos tickets"
              : "Crear Ticket"
          }
        >
          <Link to={`${location.pathname}/create`}>
            <Button disabled={calificacionPendiente} type="primary">
              {calificacionPendiente
                ? "Calificar para poder crear tickets"
                : "Crear"}{" "}
            </Button>
          </Link>
        </Tooltip>
      }
    >
      <div style={{ marginBottom: 10 }}>
        <Space direction="horizontal" align="center">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "orange",
                borderRadius: 2,
              }}
            ></div>
            <span>Envío de observación</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "blue",
                borderRadius: 2,
              }}
            ></div>
            <span>Entró en validación</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "red",
                borderRadius: 2,
              }}
            ></div>
            <span>Ticket vencido</span>
          </div>
        </Space>
      </div>
      <SearchBar>
        <Input placeholder="Buscar" onChange={handleSearch} />
      </SearchBar>
      <Table
        className="custom-table"
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
            return (
              <>
                <Text>Total Registros: {total}</Text>
              </>
            );
          },
        }}
        style={{ textAlign: "center" }}
        bordered
        rowClassName={(record) =>
          record.vencido
            ? "red-row"
            : record.estado === "En validacion"
            ? "cyan-row"
            : record.observacion !== null
            ? "yellow-row"
            : ""
        }
      />
    </StyledCard>
  );
};
