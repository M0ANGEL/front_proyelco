import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";
import { DataId } from "../../Historial/types";
import { GrView } from "react-icons/gr";


export const TicketModalEstado = ({ dataTicket }: DataId) => {
  const [open, setOpen] = useState<boolean>(false);

  const showLoading = () => {
    setOpen(true);
  };

  return (
    <>
      <Tooltip title="Ver Ticket">
        <Button type="primary" onClick={showLoading} size="small">
          <GrView />
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            INFORMACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>
              {dataTicket?.numero_ticket}
            </span>{" "}
          </p>
        }
        footer={<h4>Ticket Autorizado</h4>}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}

      >
        <Row gutter={24}>
          {/* Campo de Categoría Padre */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.categoria} />
            </StyledFormItem>
          </Col>

          {/* campo subcategoria */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subcategoria" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.subcategoria} />
            </StyledFormItem>
          </Col>

          {/* motivo de ticket */}
          <div style={{ width: "100%", marginTop: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle del ticket</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={dataTicket?.detalle}
              />
            </Col>
          </div>

          {/* fecha de solicitud */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha de creacion" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.created_at} />
            </StyledFormItem>
          </Col>

          {/* bodega de quien solicita */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Bodega Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.bodega} />
            </StyledFormItem>
          </Col>

          {/* usuario que solicita */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Usuario Solicita" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.creador_ticket} />
            </StyledFormItem>
          </Col>

           {/* procesos */}
           <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Proceso" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.nombre_proceso} />
            </StyledFormItem>
          </Col>

          {/* fecha se autoriza */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha autorizacion" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.fin_autorizacion} />
            </StyledFormItem>  
          </Col>

          {/* detalla de autorizacion */}
          <div style={{ width: "100%", marginTop: "15px" }}>
            <h4 style={{ textAlign: "center" }}>Detalle de autorizacion</h4>
            <Col xs={24} sm={24}>
              <TextArea
                allowClear
                disabled
                rows={3}
                value={dataTicket?.respuesta_autorizacion}
              />
            </Col>
          </div>
        </Row>
      </Modal>
    </>
  );
};
