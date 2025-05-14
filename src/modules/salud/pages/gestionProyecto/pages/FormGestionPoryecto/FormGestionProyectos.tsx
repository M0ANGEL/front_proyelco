import { Card, Spin, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { getProyectoDetalle } from "@/services/proyectos/proyectosAPI";
import { useParams } from "react-router-dom";

const { Title } = Typography;

type Apartamento = {
  torre: string;
  piso: string;
  apartamento: string;
  estado: number;
};

export const FormGestionProyectos = () => {
  const [data, setData] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [torreSeleccionada, setTorreSeleccionada] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    getProyectoDetalle(Number(id)).then(({ data: { data } }) => {
      setData(data);
      setLoading(false);
    });
  }, [id]);

  const torresUnicas = Array.from(new Set(data.map((apto) => apto.torre)));

  const dataFiltrada = torreSeleccionada
    ? data.filter((d) => d.torre === torreSeleccionada)
    : [];

  const pisos = dataFiltrada.reduce((acc: any, apto) => {
    const { piso, apartamento, estado } = apto;
    if (!acc[piso]) acc[piso] = [];
    acc[piso].push({ apartamento, estado });
    return acc;
  }, {});

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
            <Card title={`Torre ${torreSeleccionada}`}>
              {Object.entries(pisos)
                .sort((a, b) => Number(b[0]) - Number(a[0])) // Piso más alto primero
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
                        <div
                          key={i}
                          style={{
                            backgroundColor: apt.estado === 1 ? "green" : "gray",
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
          )}
        </>
      )}
    </div>
  );
};
