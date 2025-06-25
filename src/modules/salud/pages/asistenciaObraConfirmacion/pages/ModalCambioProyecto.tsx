import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  CambioProyectoAsistencia,
  getProyectosCambioObra,
} from "@/services/talento-humano/confirmarAsistenciasAPI";
import { AiOutlineDrag } from "react-icons/ai";

interface DataId {
  dataTicket: DataType;
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
}

interface DataType {
  key: number;
  id: number;
  fecha_confirmacion: string;
  detalle: string;
  nombres: string;
  apellidos: string;
  proyecto_id: string;
  descripcion_proyecto: string;
  personal_id: string;
}

export const ModalCambioProyecto = ({
  dataTicket,
  fetchList,
  pushNotification,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [proyectos, setProyectos] = useState<SelectProps["options"]>([]);
  const [selectedProyecto, setSelectedProyecto] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (dataTicket?.proyecto_id) {
      setSelectedProyecto(dataTicket.proyecto_id.toString());
    }
  }, [open]);

  const showLoading = () => {
    fetchProyectos();
    setOpen(true);
  };

  //llamada de los proyectos activos
  const fetchProyectos = async () => {
    const response = await getProyectosCambioObra();
    const usuariosproce = response?.data?.data || [];
    setProyectos(
      usuariosproce.map((item) => ({
        label: item.descripcion_proyecto,
        value: item.id.toString(),
      }))
    );
  };

  const CambioDeObra = () => {
    const cambioProyecto = {
      id: Number(dataTicket.id),
      proyecto_id: selectedProyecto,
    };

    CambioProyectoAsistencia(cambioProyecto)
      .then(() => {
        pushNotification({
          title: "Cambio de personal Confirmada",
          type: "info",
        });
      })
      .catch((err) => {
        pushNotification({
          title: err.message,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        fetchList();
      });
  };

  return (
    <>
      <Tooltip title="Trasladar a otra Obra">
        <Button
          type="primary"
          onClick={showLoading}
          size="small"
          style={{ marginLeft: 8, background: "blue" }}
        >
          <AiOutlineDrag />
        </Button>
      </Tooltip>

      <Modal
        title={<p>CONFIRMAR ASISTENCIA</p>}
        footer={
          <>
            <Button type="primary" onClick={CambioDeObra}>
              Confirmar Cambio De Obra
            </Button>
          </>
        }
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

          {/* proyecto */}
          <Col xs={24} sm={8}>
            <StyledFormItem label="Proyecto Traslado" labelCol={{ span: 24 }}>
              <Select
                value={selectedProyecto}
                onChange={(value) => setSelectedProyecto(value)}
                showSearch
                allowClear
                options={proyectos}
                placeholder="Seleccione un proyecto"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
