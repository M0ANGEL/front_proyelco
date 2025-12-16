import { Spin, Typography, Button, Progress, List, Tooltip, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  getProyectoDetalleGestion,
  InfoProyecto,
} from "@/services/proyectos/gestionProyectoAPI";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { AiOutlineExpandAlt } from "react-icons/ai";
import AnalicisIAProyectos from "../AnalicisIA/AnalicisIAProyectos";

const { Title, Text } = Typography;

export const ResumenTorres = () => {
  const [data, setData] = useState<any>({});
  const [porcetanjeTorre, setPorcetanjeTorre] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [infoProyecto, setInfoProyecto] = useState<any>({});
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  //modal de info de proceos
  const [modalProcesosOpen, setModalProcesosOpen] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    null
  );

  //data para api de ia
  const [dataIa, setDataIa] = useState<any>({});

  useEffect(() => {
    LlamadoData();
    InfoProyecto(Number(id)).then(({ data: { data } }) => {
      setInfoProyecto(data);
    });
  }, [id]);

  const LlamadoData = () => {
    setLoading(true);
    getProyectoDetalleGestion(Number(id)).then(({ data /* : { data }  */ }) => {
      setData(data.data);
      setPorcetanjeTorre(data.torreResumen);
      setDataIa({
        detallesTorres: data.data, // Array con detalles
        resumenTorres: data.torreResumen, // Objeto con porcentajes
        metadata: {
          totalTorres: data.data?.length || 0,
          fechaConsulta: new Date().toISOString(),
          idProyecto: id,
        },
      });

      setLoading(false);
    });
  };

  const torresUnicas = Object.keys(data);

  return (
    <>
      <div
        style={{
          padding: "20px",
          margin: "0 auto",
          background: "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
          width: "90%",
        }}
      >
        <div style={{ marginBottom: 15, textAlign: "right" }}>
          <Link to="../.." relative="path">
            <Button danger type="primary" icon={<ArrowLeftOutlined />}>
              Volver
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "32px",

            border: "none",
            position: "sticky",
            top: 60,
            zIndex: 100,
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#1a1a1a",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "32px",
                background: "linear-gradient(to bottom, #1890ff, #36cfc9)",
                borderRadius: "4px",
              }}
            ></span>
            Visual del Proyecto: {infoProyecto?.descripcion_proyecto}
          </Title>
          <Text type="secondary" style={{ marginLeft: "20px" }}>
            ID: {id} | Seleccione una torre para gestionar
          </Text>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <AnalicisIAProyectos data={dataIa} />
            <List
              itemLayout="horizontal"
              dataSource={torresUnicas}
              renderItem={(torre) => (
                <List.Item
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    padding: "16px 24px",
                    border: "2px solid transparent",
                    animation:
                      (porcetanjeTorre[torre]?.porcentaje_atraso || 0) >= 30
                        ? "pulseRed 2s infinite"
                        : "",
                  }}
                >
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      Torre{" "}
                      {porcetanjeTorre[torre]?.nombre_torre || `Torre ${torre}`}
                    </Title>
                  </div>

                  <div style={{ minWidth: "200px" }}>
                    <Text type="secondary">Atraso del proyecto</Text>
                    <Progress
                      percent={porcetanjeTorre[torre]?.porcentaje_atraso || 0}
                      strokeColor={
                        (porcetanjeTorre[torre]?.porcentaje_atraso || 0) <= 15
                          ? "blue"
                          : (porcetanjeTorre[torre]?.porcentaje_atraso || 0) <=
                            30
                          ? "yellow"
                          : "red"
                      }
                    />

                    <Text type="secondary">Avance del proyecto</Text>

                    <Progress
                      percent={porcetanjeTorre[torre]?.porcentaje_avance || 0}
                      strokeColor={{
                        "0%": "#102c9dff",
                        "100%": "#36cf55ff",
                      }}
                    />
                  </div>

                  <div
                    className="status-container"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    {porcetanjeTorre && (
                      <Button
                        type="primary"
                        onClick={() => {
                          setTorreSeleccionada(torre); // <-- aquí guardas el id/clave de la torre
                          setModalProcesosOpen(true);
                        }}
                      >
                        Ver Procesos y % de Atraso
                      </Button>
                    )}

                    <Tooltip title="Ver Proceso Proyecto">
                      <Link
                        to={`${location.pathname}/detalle`}
                        state={{
                          data,
                          porcetanjeTorre,
                          infoProyecto,
                          id,
                          torre,
                        }}
                      >
                        <ButtonTag
                          style={{
                            padding: 5,
                            borderRadius: 8,
                            width: 40,
                            backgroundColor: "#B5EAD7",
                            border: "none",
                            color: "#2C5F2D",
                          }}
                          type="primary"
                        >
                          <AiOutlineExpandAlt />
                        </ButtonTag>
                      </Link>
                    </Tooltip>
                  </div>
                </List.Item>
              )}
            />
          </>
        )}
      </div>
      

      {/* modal del procesos*/}
      <Modal
        open={modalProcesosOpen}
        onCancel={() => {
          setModalProcesosOpen(false);
          setTorreSeleccionada(null); // opcional: limpiar la selección al cerrar
        }}
        footer={null}
        title={`Procesos de ${
          torreSeleccionada
            ? porcetanjeTorre[torreSeleccionada]?.nombre_torre ||
              `Torre ${torreSeleccionada}`
            : "Torre"
        }`}
        centered
        width={700}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {torreSeleccionada &&
            Object.entries(data[torreSeleccionada] || {}).map(
              ([procesoKey, contenido]: any) => (
                <div
                  key={procesoKey}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(245,245,245,0.8)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ minWidth: "180px", fontWeight: 500 }}>
                    {contenido.nombre_proceso}
                  </div>
                  <Progress
                    percent={contenido.porcentaje_atraso}
                    status="active"
                    strokeColor={
                      contenido.porcentaje_atraso < 15
                        ? "#1890ff"
                        : contenido.porcentaje_atraso < 30
                        ? "#faad14"
                        : "#cf1322"
                    }
                    style={{ flex: 1 }}
                  />
                </div>
              )
            )}
        </div>
      </Modal>
    </>
  );
};
