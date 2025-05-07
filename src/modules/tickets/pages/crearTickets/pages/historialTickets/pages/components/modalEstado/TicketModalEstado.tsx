import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { TkEstrellas } from "../CalicacionEstrellas/TkEstrellas";
import { GrView } from "react-icons/gr";

// Interfaces
interface ModalCerradosProps {
  ticket: DataType;
  calificaciones: DataPregunta[];
}

interface DataPregunta {
  key: number;
  id: number;
  IdCa: number;
  pregunta: string;
  calificacion: string;
}

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
  usuario_autoriza: string;
  motivo_cancelacion: string | null;
}

export const TicketModalEstado = ({
  ticket,
  calificaciones,
}: ModalCerradosProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const calificacionesFiltradas = calificaciones.filter(
    (calificacion) => calificacion.id === ticket.id
  );

  return (
    <>
      <Tooltip title="Ver Ticket">
        <Button size="small" type="primary" onClick={() => setOpen(true)}>
          <GrView />
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            INFORMACIÓN DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>{ticket.numero_ticket}</span>
          </p>
        }
        footer={<h5>Ticket Cerrado</h5>}
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <StyledFormItem label="Categoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.categoria} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.subcategoria} />
            </StyledFormItem>
          </Col>

          <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <TextArea allowClear disabled rows={3} value={ticket.detalle} />
          </Col>

          {ticket.respuesta_autorizacion && (
            <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
              <h4 style={{ textAlign: "center" }}>Detalle de autorización</h4>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={ticket.respuesta_autorizacion}
              />
            </Col>
          )}

          <Col xs={24} sm={12}>
            <StyledFormItem label="Fecha de Creación" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.created_at} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Usuario Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.usuario_solicita} />
            </StyledFormItem>
          </Col>

          {ticket.usuario_soluciona ? (
            <Col xs={24} sm={12}>
              <StyledFormItem
                label="Usuario Cierra ticket"
                labelCol={{ span: 24 }}
              >
                <Input allowClear disabled value={ticket.usuario_soluciona} />
              </StyledFormItem>
            </Col>
          ) : (
            ""
          )}

          {ticket.usuario_autoriza ? (
            <Col xs={24} sm={12}>
              <StyledFormItem
                label="Usuario Autoriza ticket"
                labelCol={{ span: 24 }}
              >
                <Input allowClear disabled value={ticket.usuario_autoriza} />
              </StyledFormItem>
            </Col>
          ) : (
            ""
          )}

          {ticket.rechazo ? (
            <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Detalle de cierre del ticket
              </h4>
              <TextArea allowClear disabled rows={3} value={ticket.rechazo} />
            </Col>
          ) : (
            ""
          )}

          {ticket.motivo_cancelacion ? (
            <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Detalle de la auto cancelacion del ticket
              </h4>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={ticket.motivo_cancelacion}
              />
            </Col>
          ) : (
            ""
          )}

          {/* Mostrar calificaciones filtradas */}
          {calificacionesFiltradas.length > 0 ? (
            calificacionesFiltradas.map((calificacion) => (
              <Col xs={24} sm={8} key={calificacion.IdCa}>
                <StyledFormItem required label={calificacion.pregunta}>
                  <TkEstrellas value={calificacion.calificacion} />
                </StyledFormItem>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <p style={{ textAlign: "center", color: "red" }}>
                No hay calificaciones para este ticket.
              </p>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};
