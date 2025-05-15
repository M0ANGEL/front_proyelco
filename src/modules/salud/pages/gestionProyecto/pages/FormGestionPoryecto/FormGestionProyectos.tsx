import { Card, Spin, Select, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProyectoDetalleGestion } from "@/services/proyectos/gestionProyectoAPI";

const { Title } = Typography;

export const FormGestionProyectos = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(
    null
  );
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    getProyectoDetalleGestion(Number(id)).then(({ data: { data } }) => {
      setData(data);
      setLoading(false);
    });
  }, [id]);

  const torresUnicas = Object.keys(data);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Visual del Proyecto ID: {id}</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Select
            placeholder="Seleccione una torre"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(value) => setTorreSeleccionada(value)}
            value={torreSeleccionada || undefined}
            options={torresUnicas.map((torre) => ({
              label: `Torre ${torre}`,
              value: torre,
            }))}
          />

          {torreSeleccionada && (
            <div>
              <Title level={4}>Torre {torreSeleccionada}</Title>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {Object.entries(data[torreSeleccionada] || {}).map(
                  ([proceso, contenido]: any) => (
                    <Card
                      key={proceso}
                      title={`${proceso} - ${
                        contenido.nombre_proceso || "Proceso"
                      }`}
                      style={{ flex: "1 1 calc(50% - 16px)" }}
                    >
                      {Object.entries(contenido.pisos || {})
                        .sort((a, b) => Number(b[0]) - Number(a[0]))
                        .map(([piso, aptos]: any) => (
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
                                <Button
                                  key={i}
                                  style={{
                                    backgroundColor:
                                      apt.estado === "2"
                                        ? "green"
                                        : apt.estado === "1"
                                        ? "#fb8674"
                                        : "gray",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: 4,
                                  }}
                                >
                                  {apt.consecutivo}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </Card>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
