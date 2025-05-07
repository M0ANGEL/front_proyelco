import { Button, Col, Modal, Row, Select, SelectProps, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  AsignarTkTicket,
} from "@/services/tickets/administracionAPI";
import { GiAges } from "react-icons/gi";
import { TkUsers } from "@/services/types";
import TextArea from "antd/es/input/TextArea";

// Interfaces
interface DataId {
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
  dataTicket: DataTypeA;
  dataUsuarios: TkUsers[];
}

interface DataTypeA {
  key: number;
  id: number;
  numero_ticket: string;
  detalle: string;
  autorizacion: string;
  usuarioAsignado: string | null;
}

export const ModalAsignacion = ({
  fetchList,
  pushNotification,
  dataTicket,
  dataUsuarios
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectUsuarios, setSelectUsuarios] = useState<SelectProps["options"]>(
    []
  );
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null); // Estado para almacenar el usuario seleccionado
  const [asignar, setAsignar] = useState<boolean>(false); // Estado para almacenar el usuario seleccionado

  // Mostrar el modal
  const showLoading = () => {
    UsuariosAsignarServicio();
    setOpen(true);
  };

  useEffect(()=>{
    if(dataTicket.usuarioAsignado !== null){
      setAsignar(true)
    }
  },[dataTicket])

  // Asignar ticket
  const AsinamientoTicket = () => {
    if (!usuarioSeleccionado) {
      pushNotification({
        title: "Por favor, seleccione un usuario.",
        type: "warning",
      });
      return;
    }

    const asignacionData = { id: dataTicket.id, my_ticketsgestion_id: usuarioSeleccionado };
     
    AsignarTkTicket(asignacionData)
      .then(() => {
        pushNotification({
          title: "Ticket Asignado ",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: `Error: ${err.message} El ticket esta asiganado a otro usuario`,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  //tomo usuarios pasados por el padre de la lista de usuarios
  const UsuariosAsignarServicio =() =>{
    const usuarios = dataUsuarios.map((item: TkUsers) => ({
      label: item.nombre,
      value: Number(item.id),
    }));
    setSelectUsuarios(usuarios);

  }


  return (
    <>
      <Tooltip title={asignar ||  dataTicket.autorizacion === "3" ? "Ticket Asignado o la autorizacion fue rechazada" : "Asignar Ticket"}>  
        <Button
          type="primary"
          style={{ background: "#1638a2", marginLeft: "5px" }}
          onClick={showLoading}
          size="small"
          disabled={asignar || dataTicket.autorizacion === "3" ? true : false}
        >
          <GiAges />
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            USUARIO A ASIGNAR EL TICKET{" "}
            <span style={{ color: "#23840d" }}>
              {dataTicket?.numero_ticket}
            </span>{" "}
          </p>
        }
        footer={
          <Button
            style={{ background: "#19796b" }}
            type="primary"
            onClick={AsinamientoTicket}
          >
            Confirmar Asignacion
          </Button>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
           {/* motivo de ticket */}
           <div
            style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
          >
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                rows={5}
                value={dataTicket?.detalle}
              />
            </Col>
          </div>
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem required>
              <Select
                options={selectUsuarios}
                onChange={(value) => setUsuarioSeleccionado(value)} // Guardar el usuario seleccionado
                placeholder="Seleccione un usuario"
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
