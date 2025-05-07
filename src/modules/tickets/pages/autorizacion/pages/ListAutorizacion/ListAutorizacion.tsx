import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Input, notification, Tag, Typography } from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import { getTkTicketAutorizar } from "@/services/tickets/autorizacionAPI";
import { TicketModalAutorizacion } from "../components/modalEstado/TicketModalAutorizacion";
import dayjs from "dayjs";
import { DescargaDocTk } from "../../../adminTickets";

//datos tipos
interface DataType {
  key: number;
  id: number;
  numero_ticket: string;
  autorizacion: string;
  detalle: string;
  created_at: string;
  estado: string;
  categoria: string;
  subcategoria: string;
  bodega: string;
  creador_ticket: string;
  documento: number;
  nombre_proceso: string;
}

const { Text } = Typography;

//estados
export const ListAutorizacion = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //ejecucion
  useEffect(() => {
    fetchTicketsAutorizacion();
  }, []);

  const fetchTicketsAutorizacion = () => {
    setLoading(true);
    getTkTicketAutorizar().then(({ data: { data } }) => {
      const tikects = data.map((tikect) => {
        return {
          key: tikect?.id,
          id: tikect?.id,
          numero_ticket: tikect?.numero_ticket,
          detalle: tikect?.detalle,
          autorizacion: tikect?.autorizacion,
          estado: tikect?.estado,
          categoria: tikect?.categoria,
          subcategoria: tikect?.subcategoria,
          bodega: tikect?.bodega,
          creador_ticket: tikect?.creador_ticket,
          created_at: dayjs(tikect.created_at).format("DD-MM-YYYY HH:mm"),
          nombre_proceso: tikect?.nombre_proceso,
          documento: tikect?.documento,
        };
      });

      setInitialData(tikects);
      setDataSource(tikects);
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

  //notificacion
  const pushNotification = ({ title }: { title: string }) => {
    notification.success({
      message: "Notificación",
      description: title,
      placement: "topRight",
    });
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
     //creador del ticket
     {
      title: "Creador ticket",
      dataIndex: "creador_ticket",
      key: "creador_ticket",
      sorter: (a, b) => a.creador_ticket.localeCompare(b.creador_ticket),
    },
     //proceso del creador del ticket
     {
      title: "Proceso ",
      dataIndex: "nombre_proceso",
      key: "nombre_proceso",
      sorter: (a, b) => a.nombre_proceso.localeCompare(b.nombre_proceso),
    },
    //estado tickets
    {
      title: "Estado",
      dataIndex: "autorizacion",
      key: "autorizacion",
      align: "center",
      render: (_, record: { key: React.Key; autorizacion: string }) => {
        let estadoString = "";
        let color;
        //estado del ticket
        if (record.autorizacion === "1") {
          estadoString = "PENDIENTE POR AUTORIZAR";
          color = "red";
        } else {
          estadoString = "AUTORIZADO";
          color = "blued";
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
        return (
          <>
            <TicketModalAutorizacion
              pushNotification={pushNotification}
              dataTicket={record}
              fetchList={() => fetchTicketsAutorizacion()}
            />
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
    <StyledCard title={"Lista de ticktets autorizacion"}>
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
      />
    </StyledCard>
  );
};
