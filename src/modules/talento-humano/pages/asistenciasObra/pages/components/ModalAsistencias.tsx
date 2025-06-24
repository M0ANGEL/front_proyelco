import { Button, Col, Input, Modal, Row } from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import TextArea from "antd/es/input/TextArea";

interface DataId {
  dataTicket: DataType;
}

interface DataType {
  key: number;
  id: number;
  fecha_confirmacion: string;
  detalle: string;
  nombres: string;
  apellidos: string;
}

export const ModalAsistencias = ({ dataTicket }: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const showLoading = () => {
    setOpen(true);
  };

  return (
    <>
      <Button type="primary" onClick={showLoading} size="small">
        CONFIRMADO
      </Button>

      <Modal
        title={<p>INFORMACIÓN DE ASISTENCIA</p>}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Nombres" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.nombres} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Apellidos" labelCol={{ span: 24 }}>
              <Input allowClear disabled value={dataTicket?.apellidos} />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={8} style={{ width: "100%" }}>
            <StyledFormItem label="Fecha Confiracion" labelCol={{ span: 24 }}>
              <Input
                allowClear
                disabled
                value={dataTicket?.fecha_confirmacion}
              />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Detalle" labelCol={{ span: 24 }}>
              <TextArea
                allowClear
                disabled
                value={
                  dataTicket?.detalle ? dataTicket?.detalle : "Sin detalle"
                }
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
