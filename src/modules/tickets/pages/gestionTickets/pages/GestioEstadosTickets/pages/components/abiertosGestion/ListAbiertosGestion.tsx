import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Typography, notification } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { getTkTicketAdministracionGestion } from "@/services/tickets/administracionAPI";
import { ModalAbiertos } from "./ModalAbiertos";
import dayjs from "dayjs";
import { DescargaDocTk } from "../descargaArchivos/DescargaDocTk";
import { HistorialTicket } from "@/modules/tickets/pages/adminTickets/pages/estadosTickets/pages/components/historialTicket";

//datos tipos
interface DataType {
  key: number;
  id: number;
  created_at: string;
  prioridad: string;
  detalle: string;
  estado: string;
  numero_ticket: string;
  autorizacion: string;
  nombre_autorizador: string | null;
  respuesta_autorizacion: string | null;
  userSoluciona_id: number | null;
  categoria: string;
  subcategoria: string;
  creador_ticket: string;
  bodega: string;
  idLogueado: number;
  documento: number;
  usuarioGestiona: string | null;
  Tiempovencido: string | null;
  nombre_proceso: string;
  observacion: string;
  vencido: boolean;
  tiempo_gestion: string;
  tiempo_restante: string;
  farmacia: string;
  puntosTicket: string;
}

const { Text } = Typography;

//funcion
export const ListAbiertosGestion = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //ejecucion
  useEffect(() => {
    fetchTicketsAbiertosGestion();
  }, []);

  //servicio de tickets list
  const fetchTicketsAbiertosGestion = () => {
    setLoading(true);
    getTkTicketAdministracionGestion().then(({ data: { data } }) => {
      const tikects = data.map((tikect) => {
        return {
          key: tikect?.id,
          id: tikect?.id,
          prioridad: tikect?.prioridad,
          detalle: tikect?.detalle,
          estado: tikect?.estado,
          numero_ticket: tikect?.numero_ticket,
          autorizacion: tikect?.autorizacion,
          nombre_autorizador: tikect?.nombre_autorizador,
          respuesta_autorizacion: tikect?.respuesta_autorizacion,
          userSoluciona_id: tikect?.userSoluciona_id,
          categoria: tikect?.categoria,
          subcategoria: tikect?.subcategoria,
          puntosTicket: tikect?.puntosTicket,
          creador_ticket: tikect?.creador_ticket,
          bodega: tikect?.bodega,
          idLogueado: tikect?.idLogueado,
          usuarioGestiona: tikect?.usuarioGestiona,
          nombre_proceso: tikect?.nombre_proceso,
          documento: tikect?.documento,
          Tiempovencido: tikect?.Tiempovencido,
          vencido: tikect?.vencido,
          observacion: tikect?.observacion,
          tiempo_gestion: tikect?.tiempo_gestion,
          tiempo_restante: tikect?.tiempo_restante,
          farmacia: tikect?.farmacia,
          created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
        };
      });

      setInitialData(tikects);
      setDataSource(tikects);
      setLoading(false);
    });
  };

  //barra de busqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  //notificacion
  const pushNotification = ({ title }: { title: string }) => {
    notification.success({
      message: "Notificación",
      description: title,
      placement: "topRight",
    });
  };

  //columnas de la tabla con sus datos
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
    //bodega solicica
    {
      title: "Sede",
      dataIndex: "bodega",
      key: "bodega",
      sorter: (a, b) => a.bodega.localeCompare(b.bodega),
    },
    //estado tickets autorizacion
    {
      title: "Prioridad",
      dataIndex: "prioridad",
      key: "prioridad",
      align: "center",
      render: (_, record: { key: React.Key; prioridad: string }) => {
        let estadoString = "";
        //estado del ticket

        switch (record.prioridad) {
          case "1":
            estadoString = "BAJA";
            break;

          case "2":
            estadoString = "MEDIA";
            break;

          case "3":
            estadoString = "ALTA";
            break;

          default:
            break;
        }

        return <p key={estadoString}>{estadoString.toUpperCase()}</p>;
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
    //numero de ticket
    {
      title: "Ticket",
      dataIndex: "numero_ticket",
      key: "numero_ticket",
      sorter: (a, b) => a.numero_ticket.localeCompare(b.numero_ticket),
    },
    //quien envia el ticket
    {
      title: "Solicitante del Ticket",
      dataIndex: "creador_ticket",
      key: "creador_ticket",
      sorter: (a, b) => a.creador_ticket.localeCompare(b.creador_ticket),
    },
    //proceso de quien envia el ticket
    {
      title: "Proceso",
      dataIndex: "nombre_proceso",
      key: "nombre_proceso",
      sorter: (a, b) => a.nombre_proceso.localeCompare(b.nombre_proceso),
    },
    //estado tickets autorizacion
    {
      title: "Autorizacion",
      dataIndex: "autorizacion",
      key: "autorizacion",
      align: "center",
      render: (_, record: { key: React.Key; autorizacion: string }) => {
        let estadoString = "";
        //estado del ticket

        switch (record.autorizacion) {
          case "0":
            estadoString = "NO NECESITA";
            break;

          case "1":
            estadoString = "SIN AUTORIZAR";
            break;

          case "2":
            estadoString = "AUTORIZADO";
            break;
          case "3":
            estadoString = "AUTORIZACIÓN RECHAZA";
            break;

          default:
            break;
        }

        return <p key={estadoString}>{estadoString.toUpperCase()}</p>;
      },
      sorter: (a, b) => a.autorizacion.localeCompare(b.autorizacion),
    },
    //estado tickets
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
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
          if (isNaN(tiempo) || tiempo <= 0) return "00:00:00"; // Manejar valores inválidos

          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;

          return `${horas.toString().padStart(2, "0")}:${minutos
            .toString()
            .padStart(2, "0")}:00`;
        }
      },
      sorter: (a, b) => Number(a.tiempo_gestion) - Number(b.tiempo_gestion), // Comparar como números
    },

    //timpo restante del ticket
    {
      title: "Tiempo Restante",
      dataIndex: "tiempo_restante",
      key: "tiempo_restante",
      render: (text, record) => {
        if (
          !record.tiempo_restante ||
          record.tiempo_restante === "0" ||
          record.tiempo_restante === "00:00:00"
        ) {
          return "00:00:00";
        } else {
          const tiempo = Number(record.tiempo_restante); // Convertir a número
          if (isNaN(tiempo) || tiempo <= 0) return "00:00:00"; // Validar si es un número válido

          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;

          return `${horas.toString().padStart(2, "0")}:${minutos
            .toString()
            .padStart(2, "0")}:00`;
        }
      },
      sorter: (a, b) => Number(a.tiempo_restante) - Number(b.tiempo_restante), // Comparar como números
    },
    //Tiempo que lleva de vencido
    {
      title: "Tiempo Vencido",
      dataIndex: "Tiempovencido",
      key: "Tiempovencido",
      render: (text, record) => {
        if (record.vencido) {
          const tiempo = Number(record.Tiempovencido); // Convertir a número
          if (isNaN(tiempo) || tiempo <= 0) return "00:00:00"; // Manejar valores inválidos

          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;

          return `${horas.toString().padStart(2, "0")}:${minutos
            .toString()
            .padStart(2, "0")}:00`;
        }
        return "No vencido";
      },
      sorter: (a, b) => Number(a.Tiempovencido) - Number(b.Tiempovencido), // Comparar como números
    },
    //gestionar tickets
    {
      title: "Accion ",
      align: "center",
      key: "center",

      render: (_, record: DataType) => {
        return (
          <>
            <ModalAbiertos
              dataTicket={record}
              pushNotification={pushNotification}
              fetchList={() => fetchTicketsAbiertosGestion()}
            />

            <HistorialTicket id_ticket={record.key} />
            {record.documento === 1 ? (
              <DescargaDocTk
                id={record.id}
                pushNotification={pushNotification}
              />
            ) : null}
          </>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
  ];

  return (
    <StyledCard title={"Panel de admistracion de tickets Abiertos"}>
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
          defaultPageSize: 30,
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
        rowClassName={(record) => (record.vencido ? "red-row" : "")}
      />
    </StyledCard>
  );
};
