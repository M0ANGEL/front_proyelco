import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, Tag, Typography } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { TicketModalEstado } from "../components/modalEstado/TicketModalEstado";
import { getTkTicketsHistorial } from "@/services/tickets/ticketsAPI";
import dayjs from "dayjs";

//datos tipos
interface DataType {
  key: number;
  id: number;
  created_at: string;
  cierre_ticket: string;
  prioridad: string;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  respuesta_autorizacion: string;
  rechazo: string;
  usuario_solicita: string;
  usuario_soluciona: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  estado: string;
  usuario_autoriza: string;
  motivo_cancelacion: string | null;
}

interface DataPregunta {
  key: number;
  id: number;
  IdCa: number;
  pregunta: string;
  calificacion: string;
}

const { Text } = Typography;

//funcion
export const ListHistorialTickets = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataPregunta, setDataPregunta] = useState<DataPregunta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //ejecucion
  useEffect(() => {
    fetchTickesEstados();
  }, []);

  // Llama al servicio para los tickest con estado 3, cerrados
  const fetchTickesEstados = () => {
    setLoading(true);
    getTkTicketsHistorial()
      .then((response) => {
        const tikects = response.data.data.map((tikect) => ({
          key: tikect?.id,
          id: tikect?.id,
          cierre_ticket: dayjs(tikect.cierre_ticket).format("DD-MM-YYYY HH:mm"),
          prioridad: tikect?.prioridad,
          numero_ticket: tikect?.numero_ticket,
          autorizacion: tikect?.autorizacion,
          detalle: tikect?.detalle,
          respuesta_autorizacion: tikect?.respuesta_autorizacion,
          rechazo: tikect?.rechazo,
          usuario_solicita: tikect?.usuario_solicita,
          usuario_soluciona: tikect?.usuario_soluciona,
          categoria: tikect?.categoria,
          subcategoria: tikect?.subcategoria,
          bodega: tikect?.bodega,
          estado: tikect?.estado,
          usuario_autoriza: tikect?.usuario_autoriza,
          motivo_cancelacion: tikect?.motivo_cancelacion,
          created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
        }));

        const calificaciones = response.data.calificaciones.map(
          (calificacion) => ({
            key: calificacion?.id,
            id: calificacion?.id,
            IdCa: calificacion?.IdCa,
            pregunta: calificacion?.pregunta,
            calificacion: calificacion?.calificacion,
          })
        );

        setDataPregunta(calificaciones);
        setInitialData(tikects);
        setDataSource(tikects);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error en la petición:", err.message);
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

  //columnas de la tabla con sus datos
  const columns: ColumnsType<DataType> = [
    //fecha de creacion
    {
      title: "Fecha Creacion",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    //fecha de cierre
    {
      title: "Fecha Cierre",
      dataIndex: "cierre_ticket",
      key: "cierre_ticket",
      sorter: (a, b) => a.cierre_ticket.localeCompare(b.cierre_ticket),
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
    //estado tickets
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        //estado del ticket
        switch (record.estado) {
          case "3":
            estadoString = "REALIZADO";
            color = "green";
            break;

          case "4":
            estadoString = "CALIFICADO";
            color = "#06adbb";
            break;

          case "5":
            estadoString = "AUTO RECHAZADO";
            color = "#5d16a2";
            break;

          case "6":
            estadoString = "RECHAZADO";
            color = "#c40505";
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
    //numero de ticket
    {
      title: "Numero Ticket",
      dataIndex: "numero_ticket",
      key: "numero_ticket",
      sorter: (a, b) => a.numero_ticket.localeCompare(b.numero_ticket),
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
    //gestionar tickets
    {
      title: "Acciones ",
      align: "center",
      key: "center",

      render: (_, record: DataType) => {
        return (
          <TicketModalEstado ticket={record} calificaciones={dataPregunta} />
        );
      },

      sorter: (a, b) => a.estado.localeCompare(b.estado),
    },
  ];

  return (
    <StyledCard title={"Panel de admistracion de tickets Calificados"}>
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
          defaultPageSize: 5,
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
      />
    </StyledCard>
  );
};
