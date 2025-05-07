import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { GrView } from "react-icons/gr";
import { DataId } from "../abiertosGenerados/types";
import { useState } from "react";

export const TicketModalEstado = ({ ticket }: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [editarDetalle, setEditarDetalle] = useState<string>(ticket.detalle); //campo donde guardo lo escrito

  const showLoading = () => {
    setEditarDetalle(ticket.detalle);
    setOpen(true);
  };

  return (
    <>
      <Tooltip title={"Ver Ticket"}>
        <Button size="small" type="primary" onClick={showLoading}>
          <GrView />
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            INFORMACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>{ticket?.numero_ticket}</span>{" "}
          </p>
        }
        footer={<></>}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem required label="Categoria" labelCol={{ span: 24 }}>
              <Input
                value={ticket.categoria}
                disabled={true}
                style={{ textTransform: "uppercase" }}
              />
            </StyledFormItem>
          </Col>

          {/* subcategoria */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem
              required
              label="Subcategoria"
              labelCol={{ span: 24 }}
            >
              <Input
                value={ticket.subcategoria}
                disabled={true}
                style={{ textTransform: "uppercase" }}
              />
            </StyledFormItem>
          </Col>

          {/* detalle del ticket */}
          <Col xs={24} style={{ marginTop: "15px", marginBottom: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <TextArea
              allowClear
              maxLength={994}
              rows={4}
              style={{ textTransform: "uppercase" }}
              value={editarDetalle}
              disabled
              onChange={(e) => setEditarDetalle(e.target.value.toUpperCase())}
            />
          </Col>

          {/* respuesta de autorizacion del ticket */}
          {ticket?.respuesta_autorizacion ? (
            <div style={{ width: "100%", marginTop: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Observacion de autorizacion
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  autoSize
                  value={ticket?.respuesta_autorizacion}
                />
              </Col>
            </div>
          ) : (
            ""
          )}

          {/* respuesta de gestion del ticket */}
          {ticket?.rechazo ? (
            <div style={{ width: "100%", marginTop: "15px" }}>
              <h4 style={{ textAlign: "center" }}>
                Observacion de cierre del ticket
              </h4>
              <Col xs={24} sm={24}>
                <TextArea
                  allowClear
                  disabled
                  autoSize
                  value={ticket?.rechazo}
                />
              </Col>
            </div>
          ) : (
            ""
          )}
        </Row>
      </Modal>
    </>
  );
};
