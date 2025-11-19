import { Button, Col, Input, Modal, Row, Tooltip, Tag } from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { FaInfoCircle } from "react-icons/fa";
import { getActiInfo } from "@/services/activosFijos/TrasladosActivosAPI";
import { ActivosData } from "@/types/typesGlobal";
import { StyledFormItem } from "@/components/layout/styled";

interface GenerarQRProps {
  data: ActivosData;
}

export const ModalInfo = ({ data }: GenerarQRProps) => {
  const [visible, setVisible] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      fetchInformacion();
    }
  }, [visible]);

  const fetchInformacion = () => {
    getActiInfo(data.key).then((res) => {
      if (res?.data?.data && res.data.data.length > 0) {
        setInitialData(res.data.data[0]); // solo un registro
      }
    });
  };

  return (
    <>
      <Tooltip title="Información del Traslado">
        <Button
          icon={<FaInfoCircle />}
          type="primary"
          size="small"
          onClick={() => setVisible(true)}
        />
      </Tooltip>

      <Modal
        title={`Información del Traslado ${data.codigo_traslado}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={
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
        }
        centered
        width={800}
      >
        {initialData ? ( 
          <Row gutter={24}>

             {/* fecha creacion */} 
            <Col xs={24} sm={12}>
              <StyledFormItem label="Fecha Traslado" labelCol={{ span: 24 }}>
                <Input value={initialData.created_at} disabled />
              </StyledFormItem>
            </Col>
               {/* Usaior crea traslado */} 
            <Col xs={24} sm={12}>
              <StyledFormItem label="Usuario Crea Traslado" labelCol={{ span: 24 }}>
                <Input value={initialData.usuario} disabled />
              </StyledFormItem>
            </Col>
            {/* Número Activo */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Número Activo" labelCol={{ span: 24 }}>
                <Input value={initialData.numero_activo} disabled />
              </StyledFormItem>
            </Col>

            {/* Categoría */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Categoría" labelCol={{ span: 24 }}>
                <Input value={initialData.categoria} disabled />
              </StyledFormItem>
            </Col>

            {/* Subcategoría */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Subcategoría" labelCol={{ span: 24 }}>
                <Input value={initialData.subcategoria} disabled />
              </StyledFormItem>
            </Col>

            {/* Valor */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Valor" labelCol={{ span: 24 }}>
                <Input value={initialData.valor} disabled />
              </StyledFormItem>
            </Col>

            {/* Marca */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Marca" labelCol={{ span: 24 }}>
                <Input value={initialData.marca} disabled />
              </StyledFormItem>
            </Col>

            {/* Serial */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Serial" labelCol={{ span: 24 }}>
                <Input value={initialData.serial} disabled />
              </StyledFormItem>
            </Col>

            {/* Fecha Fin Garantía */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Fecha Traslado" labelCol={{ span: 24 }}>
                <Input value={initialData.created_at} disabled />
              </StyledFormItem>
            </Col>

            {/* Bodega Origen */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Bodega Origen" labelCol={{ span: 24 }}>
                <Input value={initialData.bodega_origen} disabled />
              </StyledFormItem>
            </Col>

            {/* Bodega Destino */}
            <Col xs={24} sm={12}>
              <StyledFormItem label="Bodega Destino" labelCol={{ span: 24 }}>
                <Input value={initialData.bodega_destino} disabled />
              </StyledFormItem>
            </Col>

            {/* Descripción */}
            <Col xs={24}>
              <StyledFormItem label="Descripción" labelCol={{ span: 24 }}>
                <TextArea value={initialData.descripcion || "..."} disabled />
              </StyledFormItem>
            </Col>

            {initialData.observacion_rachazo ? (
              <>
                {/* Descripción Rechazo */}
                <Col xs={24}>
                  <StyledFormItem
                    label="Descripción Rechazo"
                    labelCol={{ span: 24 }}
                  >
                    <TextArea
                      value={initialData.observacion_rachazo || "..."}
                      disabled
                    />
                  </StyledFormItem>
                </Col>
              </>
            ) : (
              ""
            )}

            {initialData.observacion_rachazo ? (
              <>
                <Col xs={24} sm={12}>
                  <StyledFormItem
                    label="Usuario Rechaza"
                    labelCol={{ span: 24 }}
                  >
                    <Input value={initialData.user_rechaza} disabled />
                  </StyledFormItem>
                </Col>
              </>
            ) : (
              <>
                {/* Usuarios Asignados */}
                <Col xs={24}>
                  <StyledFormItem
                    label="Usuarios Asignados"
                    labelCol={{ span: 24 }}
                  >
                    {initialData.usuariosAsignados?.length > 0 ? (
                      initialData.usuariosAsignados.map(
                        (u: string, i: number) => (
                          <Tag color="blue" key={i}>
                            {u}
                          </Tag>
                        )
                      )
                    ) : (
                      <Tag color="default">Ninguno</Tag>
                    )}
                  </StyledFormItem>
                </Col>

                {/* Usuarios que Aceptaron */}
                <Col xs={24}>
                  <StyledFormItem
                    label="Usuarios que Aceptaron"
                    labelCol={{ span: 24 }}
                  >
                    {initialData.usuariosAceptaron?.length > 0 ? (
                      initialData.usuariosAceptaron.map(
                        (u: string, i: number) => (
                          <Tag color="green" key={i}>
                            {u}
                          </Tag>
                        )
                      )
                    ) : (
                      <Tag color="default">Ninguno</Tag>
                    )}
                  </StyledFormItem>
                </Col>
              </>
            )}
          </Row>
        ) : (
          <p>Cargando información...</p>
        )}
      </Modal>
    </>
  );
};
