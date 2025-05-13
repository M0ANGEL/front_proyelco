import { Modal, Row, Col, Card, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getProyectoDetalle } from "@/services/proyectos/proyectosAPI";

type Apartamento = {
  torre: string;
  piso: string;
  apartamento: string;
  estado: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  proyectoId: number;
};

export const ModalProcesoProyecto = ({
  visible,
  onClose,
  proyectoId,
}: Props) => {
  const [data, setData] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(proyectoId);
  

  useEffect(() => {
    // if (visible && proyectoId) {
    //   setLoading(true);
    //   axios
    //     .get(`/api/proyectos/${proyectoId}/apartamentos`)
    //     .then((res) => {
    //       setData(res.data.data);
    //     })
    //     .catch((err) => {
    //       console.error("Error cargando datos", err);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // }

    getProyectoDetalle(proyectoId).then(({ data: { data } }) => {
      setData(data);
    });
  }, [visible, proyectoId]);

  // Agrupar por torre > piso > apartamentos
  const torres = data.reduce((acc: any, apto) => {
    const { torre, piso, apartamento, estado } = apto;
    if (!acc[torre]) acc[torre] = {};
    if (!acc[torre][piso]) acc[torre][piso] = [];
    acc[torre][piso].push({ apartamento, estado });
    return acc;
  }, {});

  return (
    <Modal
      title={`Visual del Proyecto ID: ${proyectoId}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {Object.entries(torres).map(([torre, pisos]: any) => (
            <Col span={12} key={torre}>
              <Card title={`Torre ${torre}`}>
                {Object.entries(pisos).map(([piso, aptos]: any) => (
                  <div key={piso} style={{ marginBottom: 10 }}>
                    <strong>Piso {piso}</strong>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      {aptos.map((apt: any, i: number) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor:
                              apt.estado === 1 ? "green" : "gray",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                          }}
                        >
                          Apto {apt.apartamento}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Modal>
  );
};
