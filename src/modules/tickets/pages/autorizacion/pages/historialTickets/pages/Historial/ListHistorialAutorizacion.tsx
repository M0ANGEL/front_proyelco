import { useEffect, useState } from "react";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Input,
  notification,
  Popconfirm,
  Tooltip,
  Tag,
  Typography,
} from "antd";
import { SearchBar } from "@/modules/gestionhumana/pages/empleados/pages/ListEmpleados/styled";
import Table, { ColumnsType } from "antd/es/table";
import {
  ActivarAutorizacion,
  getTkAutorizacionHistorial,
} from "@/services/tickets/autorizacionAPI";
import { TicketModalEstado } from "../components/modalEstado/TicketModalEstado";
import dayjs from "dayjs";
import { DataType } from "./types";
import { DescargaDocTk } from "@/modules/tickets/pages/adminTickets";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { SyncOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const ListHistorialAutorizacion = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRow, setLoadingRow] = useState<any>([]);

  //ejecucion
  useEffect(() => {
    fetchTicketsAutorizacionHistorial();
  }, []);

  const fetchTicketsAutorizacionHistorial = () => {
    setLoading(true);
    getTkAutorizacionHistorial().then(({ data: { data } }) => {
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
          fin_autorizacion: dayjs(tikect.fin_autorizacion).format(
            "DD-MM-YYYY HH:mm"
          ),
          respuesta_autorizacion: tikect?.respuesta_autorizacion,
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

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);

    ActivarAutorizacion(id)
      .then(() => {
        fetchTicketsAutorizacionHistorial();
      })
      .catch(() => {
        setLoadingRow([]); // Detener el estado de carga si hay un error

        // Mostrar notificación de error usando Ant Design
        notification.error({
          message: "Error",
          description:
            "No se puede cambiar el estado de la autorización, el ticket está cerrado, en gestion o fue rechazado por el moderador.",
          placement: "topRight", 
        });
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
    //fecha de autorizacion
    {
      title: "Fecha Autorizacion",
      dataIndex: "fin_autorizacion",
      key: "fin_autorizacion",
      sorter: (a, b) => a.fin_autorizacion.localeCompare(b.fin_autorizacion),
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

        switch (record.autorizacion) {
          case "2":
            estadoString = "AUTORIZADO";
            color = "green";
            break;

          case "3":
            estadoString = "AUTORIZACIÓN RECHAZADA";
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
    //cambiar el estado del rechazo del ticket
    {
      title: "Restaurar autorizacion",
      dataIndex: "autorizacion",
      key: "autorizacion",
      align: "center",
      render: (_, record: { key: React.Key; autorizacion: string }) => {
        const estadoString = "RESTABLECER";
        const color = "green";

        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tooltip title="Cambiar estado ">
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
    //estado tickets recorrdio
    {
      title: "Acciones ",
      align: "center",
      key: "acciones",
      render: (_, record: DataType) => {
        return (
          <>
            <TicketModalEstado dataTicket={record} />
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
    <StyledCard title={"Historial de ticktets autorizados"}>
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
