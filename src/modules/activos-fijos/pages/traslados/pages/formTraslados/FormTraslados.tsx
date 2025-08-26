import {
  Button,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa6";
import { ActivosData } from "@/services/types";
import TextArea from "antd/es/input/TextArea";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getActiUsers } from "@/services/activosFijos/CrearActivosAPI";
import { getActiBodegas, getActiObras } from "@/services/activosFijos/BodegasAPI";
import { trasladarActiActivo } from "@/services/activosFijos/TrasladosActivosAPI";

interface GenerarQRProps {
  data: ActivosData;
  fetchList: () => void;
}

interface DataSelect {
  label: string | null;
  value: number | null;
}

export const FormTraslados = ({ data, fetchList }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [usuarios, setUsuarios] = useState<DataSelect[]>([]);
  const [bodegas, setBodegas] = useState<DataSelect[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string[]>([]);
  const [bodegaSelecionadaDestino, setBodegaSelecionadaDestino] = useState<
    number | null
  >(null);
  const [observacionActivo, setObservacionActivo] = useState<string>("");
    const [tipoUbicacion, setTipoUbicacion] = useState<number | null>(null);
  

  useEffect(() => {
    if (visible) {
      fetchUsuarios();
    }
  }, [visible]);

   useEffect(() => {
      if (visible && tipoUbicacion) {
        if (tipoUbicacion === 1) {
          // Administrativas
          getActiBodegas().then(({ data: { data } }) => {
            const opciones = data.map((item) => ({
              label: item.nombre.toUpperCase(),
              value: item.id,
            }));
            setBodegas(opciones);
          });
        } else if (tipoUbicacion === 2) {
          // Obras
          getActiObras().then(({ data: { data } }) => {
            const opciones = data.map((item) => ({
              label: item.nombre.toUpperCase(),
              value: item.id,
            }));
            setBodegas(opciones);
          });
        }
      }
    }, [visible, tipoUbicacion]);
  

  //llamado de usuarios
  const fetchUsuarios = () => {
    getActiUsers().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setUsuarios(categoriasPadres);
    });
  };

  //llamado de ubicaciones
  const fetchUbicaciones = () => {
    getActiBodegas().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setBodegas(categoriasPadres);
    });
  };

  //trasladar

  const trasladarActivo = () => {
    const rechazoTicket = {
      id: data.key,
      observacion: observacionActivo,
      ubicacion_destino: bodegaSelecionadaDestino,
      usuarios: usuarioSeleccionado,
    };

    trasladarActiActivo(rechazoTicket)
      .then(() => {
        notification.success({
          message: "El activo fue trasladado",
          description: "El activo fue trasladado correctamente.",
          placement: "topRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error al trasladar activo",
          description: err.message || "Ocurrió un error inesperado.",
          placement: "topRight",
        });
      })
      .finally(() => {
        fetchList();
        setVisible(false);
      });
  };

  return (
    <>
      <Tooltip title="Trasladar Activo">
        <Button
          icon={<FaUserCheck />}
          type="primary"
          size="small"
          onClick={() => setVisible(true)}
          style={{ marginLeft: "5px", background: "#17ae00ff" }}
        />
      </Tooltip>

      <Modal
        title={`Traslado del activo ${data.numero_activo}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <>
            <Button
              key="close"
              onClick={() => setVisible(false)}
              style={{
                marginLeft: "5px",
                color: "white",
                background: "#ce2222ff",
              }}
            >
              Cerrar
            </Button>
            <Button
              key="close"
              onClick={() => trasladarActivo()}
              style={{
                marginLeft: "5px",
                color: "white",
                background: observacionActivo.length !== 0 ? "#003daeff" : "#adc0e4ff",
              }}
              disabled={observacionActivo.length === 0}
            >
              Trasladar Activo
            </Button>
          </>,
        ]}
        centered
      >
        <Row gutter={24}>
          {/* categoria */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Categoría Padre" labelCol={{ span: 24 }}>
              <Input value={data.categoria} disabled />
            </StyledFormItem>
          </Col>

          {/* subacategoria  */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Subategoría" labelCol={{ span: 24 }}>
              <Input value={data.subcategoria} disabled />
            </StyledFormItem>
          </Col>

          {/* valor del activo */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Valor Activo" labelCol={{ span: 24 }}>
              <Input value={data.valor} disabled />
            </StyledFormItem>
          </Col>

          {/* descripcion */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Descripción" labelCol={{ span: 24 }}>
              <TextArea value={data?.descripcion || "..."} disabled />
            </StyledFormItem>
          </Col>

          {/* campo de ubicacion actual activo */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <StyledFormItem label="Ubicacion Actual" labelCol={{ span: 24 }}>
              <Input value={data.bodega_actual} disabled />
            </StyledFormItem>
          </Col>

           {/* tipo de ubicaciones */}
                    <Col xs={24} sm={12}>
                      <StyledFormItem label="Tipo Ubicaciones" labelCol={{ span: 24 }}>
                        <Select
                          showSearch
                          allowClear
                          options={[
                            { value: 1, label: "Administrativas" },
                            { value: 2, label: "Obras" },
                          ]}
                          onChange={(value) => setTipoUbicacion(value)} // 👈 se guarda y dispara useEffect
                        />
                      </StyledFormItem>
                    </Col>

          {/* ubicacion destino activo */}
          <Col xs={24} sm={24}>
            <StyledFormItem
              label="Ubicación destino del activo"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                allowClear
                options={bodegas}
                onChange={(value) => setBodegaSelecionadaDestino(value)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label ?? "").toString().toLowerCase()
                    )
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
              />
            </StyledFormItem>
          </Col>

          {/* campo de usuarios  */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem
              label="Usuarios para asignación"
              labelCol={{ span: 24 }}
            >
              <Select
                mode="multiple"
                showSearch
                allowClear
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .localeCompare(
                      (optionB?.label ?? "").toString().toLowerCase()
                    )
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                options={usuarios}
                onChange={(value) =>
                  setUsuarioSeleccionado(value.map((v) => String(v)))
                }
              />
            </StyledFormItem>
          </Col>

          {/* observacion */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem label="Observacion" labelCol={{ span: 24 }}>
              <TextArea
                allowClear
                required
                placeholder="Escribe una observacion del activo"
                rows={5}
                value={observacionActivo}
                onChange={(e) => setObservacionActivo(e.target.value)}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
