import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { GrView } from "react-icons/gr";
import { TkEstrellas } from "./CalicacionEstrellas/TkEstrellas";
import { ModalCerradosProps } from "./types";

export const ModalCalificados = ({
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
        <Button type="primary" onClick={() => setOpen(true)} size="small">
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
        footer={<h5>Ticket Calificado</h5>}
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
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
            <TextArea allowClear autoSize disabled value={ticket.detalle} />
          </Col>

          {ticket.respuesta_autorizacion && (
            <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
              <h4 style={{ textAlign: "center" }}>Detalle de autorización</h4>
              <TextArea
                allowClear
                disabled
                autoSize
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
            <StyledFormItem label="Bodega Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.bodega} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Proceso" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.nombre_proceso} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem label="Usuario Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.usuario_solicita} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12}>
            <StyledFormItem
              label="Usuario Cierra ticket"
              labelCol={{ span: 24 }}
            >
              <Input allowClear disabled value={ticket.usuario_soluciona} />
            </StyledFormItem>
          </Col>

          <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
            <h4 style={{ textAlign: "center" }}>
              Detalle de cierre del ticket
            </h4>
            <TextArea allowClear disabled rows={3} value={ticket.rechazo} />
          </Col>

          {/* Mostrar calificaciones filtradas */}
          {calificacionesFiltradas.length > 0 ? (
            calificacionesFiltradas.map((calificacion) => (
              <Col xs={24} sm={7} key={calificacion.IdCa}>
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
