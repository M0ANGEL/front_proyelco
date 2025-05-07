import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { ModalCerradosProps } from "./types";
import { GrView } from "react-icons/gr";

export const ModalRechazados = ({ ticket }: ModalCerradosProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
            INFORMACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>{ticket.numero_ticket}</span>
          </p>
        }
        footer={<h5>Ticket Rechazados</h5>}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.categoria} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.subcategoria} />
            </StyledFormItem>
          </Col>

          <div
            style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
          >
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea allowClear disabled autoSize value={ticket.detalle} />
            </Col>
          </div>

          {ticket.respuesta_autorizacion ? (
            <div
              style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
            >
              <h4 style={{ textAlign: "center" }}>Detalle de autorizacion</h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  rows={3}
                  value={ticket.respuesta_autorizacion}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha de Creación" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.created_at} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Bodega Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.bodega} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Usuario Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.usuario_solicita} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Proceso" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={ticket.nombre_proceso} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem
              label="Usuario Cierra ticket"
              labelCol={{ span: 24 }}
            >
              <Input allowClear disabled value={ticket.usuario_soluciona} />
            </StyledFormItem>
          </Col>

          <div
            style={{ width: "100%", marginTop: "15px", marginBottom: "15px" }}
          >
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea allowClear  disabled rows={6} value={ticket.rechazo} />
            </Col>
          </div>
        </Row>
      </Modal>
    </>
  );
};
