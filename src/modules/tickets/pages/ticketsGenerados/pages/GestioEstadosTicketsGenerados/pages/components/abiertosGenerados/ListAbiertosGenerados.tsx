import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, notification, Tag, Typography } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
// import { TicketModalEstado } from "../components/modalEstado/TicketModalEstado";
import { DataType } from "./types";
import dayjs from "dayjs";
import { DescargaDocTk } from "../descargaArchivosGenerados";
import { getTkGeneradoAbiertos } from "@/services/tickets/ticketsGeneradosAPI";
import { TicketModalEstado } from "./ModalAbiertosGenerados";
// import { ObservacionModalCliente } from "../components/observacionCliente";

const { Text } = Typography;

//estados
export const ListAbiertosGenerados = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //ejecucion
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    getTkGeneradoAbiertos()
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
            respuesta_autorizacion: tikect?.respuesta_autorizacion,
            usuarioAsignado: tikect?.usuarioAsignado,
            tiempo_gestion: tikect?.tiempo_gestion,
            observacion: tikect?.observacion,
            categoria_id: tikect?.categoria_id,
            subcategoria_id: tikect?.subcategoria_id,
            tiempo_restante: tikect?.tiempo_restante,
            listo: tikect?.listo,
            usuarioCrear: tikect?.usuarioCrear,
            created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
          };
        });

        setInitialData(tikects);
        setDataSource(tikects);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.mensagge);
      });
  };

  //barra de busqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const filterTable = initialData?.filter(
      (o: any) =>
        o.usuarioCrear?.toLowerCase().includes(value.toLowerCase()) || // <- Usa "||" para combinar condiciones
        o.numero_ticket?.toLowerCase().includes(value.toLowerCase()) ||
        o.usuarioAsignado?.toLowerCase().includes(value.toLowerCase())
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

  const columns: ColumnsType<DataType> = [
    //usuario que crea el ticket
    {
      title: "Usuario ",
      dataIndex: "usuarioCrear",
      key: "usuarioCrear",
      sorter: (a, b) => a.usuarioCrear.localeCompare(b.usuarioCrear),
    },
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
        } else if (record.tiempo_restante) {
          const tiempo = Number(record.tiempo_restante); // Asegurar que sea un número
          const horas = Math.floor(tiempo / 60);
          const minutos = tiempo % 60;
          return `${horas.toString().padStart(2, "0")}:${minutos
            .toString()
            .padStart(2, "0")}:00`;
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
            {/* <ObservacionModalCliente
              dataTicket={record}
              pushNotification={pushNotification}
              fetchList={() => fetchTickets()}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <StyledCard title={"Lista de tickets generados por usuarios de mi proceso"}>
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
        // rowClassName={(record) => (record.listo ? "green-row" : "")}
      />
    </StyledCard>
  );
};
