import { useEffect, useState } from "react";
import {
  Select,
  Input,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  notification,
  Tooltip,
} from "antd";
import {
  actualizarNomenclatura,
  getNomenclaturas,
} from "@/services/proyectos/proyectosAPI";
import { useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type Torre = {
  torre: string;
  pisos: { piso: number; consecutivos: string[] }[];
};

type RawData = {
  id: number;
  proyecto_id: number;
  torre: string;
  piso: string;
  apartamento: string;
  consecutivo: string;
};

export const Nomenclaturas = () => {
  const [selectedTorre, setSelectedTorre] = useState<string>("");
  const [selectedPisos, setSelectedPisos] = useState<number[]>([]);
  const [inputsPorPiso, setInputsPorPiso] = useState<
    Record<number, { inicio: string; fin: string; nuevo: string }>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [nomenclaturas, setNomenclaturas] = useState<RawData[]>([]);
  const [errores, setErrores] = useState<Record<number, boolean>>({});

  // 🔄 Cargar nomenclaturas del backend
  const fetchNomenclaturas = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await getNomenclaturas(id);
      setNomenclaturas(data?.data || []);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error al cargar nomenclaturas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNomenclaturas();
  }, [id]);

  // 🔄 Transformar data plana en torres/pisos con consecutivos
  const transformarNomenclaturas = (data: RawData[] = []): Torre[] => {
    const torresMap: Record<string, Torre> = {};

    data.forEach((item) => {
      if (!torresMap[item.torre]) {
        torresMap[item.torre] = { torre: item.torre, pisos: [] };
      }

      const torre = torresMap[item.torre];
      const pisoNum = Number(item.piso);

      let pisoData = torre.pisos.find((p) => p.piso === pisoNum);
      if (!pisoData) {
        pisoData = { piso: pisoNum, consecutivos: [] };
        torre.pisos.push(pisoData);
      }

      pisoData.consecutivos.push(item.consecutivo);
    });

    // Ordenar pisos y consecutivos
    Object.values(torresMap).forEach((torre) => {
      torre.pisos.sort((a, b) => a.piso - b.piso);
      torre.pisos.forEach((p) =>
        p.consecutivos.sort((a, b) => Number(a) - Number(b))
      );
    });

    return Object.values(torresMap);
  };

  const torres = transformarNomenclaturas(nomenclaturas || []);
  const torreData = torres.find((t) => t.torre === selectedTorre);

  const handleInputChange = (
    piso: number,
    campo: "inicio" | "fin" | "nuevo",
    valor: string
  ) => {
    setInputsPorPiso((prev) => ({
      ...prev,
      [piso]: { ...prev[piso], [campo]: valor.replace(/\D/g, "") },
    }));
  };

  const EnvioNomenclatura = (piso: number) => {
    if (!id) return;
    setLoading(true);

    const { inicio, fin, nuevo } = inputsPorPiso[piso] || {};
    const data = {
      id: Number(nomenclaturas?.[0]?.proyecto_id),
      torre: selectedTorre,
      piso,
      apt_inicio: inicio,
      apt_fin: fin,
      nuevo_inicio: nuevo,
    };

    actualizarNomenclatura(data)
      .then(() => {
        notification.success({
          message: `Nomenclaturas de piso ${piso} actualizadas con éxito!`,
        });
        setErrores((prev) => ({ ...prev, [piso]: false }));
        fetchNomenclaturas(); // 🔄 refresca después de actualizar
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.response?.data?.message || err.message,
        });
        setErrores((prev) => ({ ...prev, [piso]: true }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: "4000px", margin: "0 auto", padding: "5px" }}>
      <Title level={2}>Gestión de Nomenclaturas</Title>

      {/* Filtros */}
      <Row gutter={26}>
        <Col span={8}>
          <label>Torre</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione torre"
            value={selectedTorre || undefined}
            onChange={(value) => {
              setSelectedTorre(value);
              setSelectedPisos([]);
            }}
          >
            {torres.map((t) => (
              <Option key={t.torre} value={t.torre}>
                Torre {t.torre}
              </Option>
            ))}
          </Select>
        </Col>

        {torreData && (
          <Col span={12}>
            <label>Pisos</label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Seleccione pisos"
              value={selectedPisos}
              onChange={(values) => setSelectedPisos(values)}
            >
              {torreData.pisos.map((p) => (
                <Option key={p.piso} value={p.piso}>
                  Piso {p.piso}
                </Option>
              ))}
            </Select>
          </Col>
        )}
      </Row>

      {/* Render pisos seleccionados */}
      {selectedPisos.map((pisoNum) => {
        const pisoData = torreData?.pisos.find((p) => p.piso === pisoNum);
        const apartamentos = pisoData ? pisoData.consecutivos : [];
        const inputs = inputsPorPiso[pisoNum] || {
          inicio: "",
          fin: "",
          nuevo: "",
        };

        return (
          <Card
            key={pisoNum}
            style={{ marginTop: "24px" }}
            title={`Piso ${pisoNum}`}
            bordered={true}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                overflowX: "auto",
                paddingBottom: "8px",
              }}
            >
              {apartamentos.map((apt) => (
                <Tag
                  key={apt}
                  color="blue"
                  style={{
                    padding: "6px 12px",
                    fontSize: "14px",
                    flex: "0 0 auto",
                  }}
                >
                  {apt}
                </Tag>
              ))}
            </div>

            <Row gutter={15}>
              <Col span={5}>
                <span>
                  Consecutivo Inicio{" "}
                  <Tooltip title="Rango inicial que se va a modificar">
                    <InfoCircleOutlined
                      style={{ color: "#faad14", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
                <Input
                  placeholder="Nomenclatura inicio"
                  value={inputs.inicio}
                  onChange={(e) =>
                    handleInputChange(pisoNum, "inicio", e.target.value)
                  }
                  style={{ borderColor: errores[pisoNum] ? "red" : "" }}
                />
                <Text type="danger">
                  {errores[pisoNum] ? "Validar rango de apartamentos " : ""}
                </Text>
              </Col>

              <Col span={5}>
                <span>
                  Consecutivo Final{" "}
                  <Tooltip title="Rango final que se va a modificar">
                    <InfoCircleOutlined
                      style={{ color: "#faad14", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
                <Input
                  placeholder="Nomenclatura fin"
                  value={inputs.fin}
                  onChange={(e) =>
                    handleInputChange(pisoNum, "fin", e.target.value)
                  }
                  style={{ borderColor: errores[pisoNum] ? "red" : "" }}
                />
              </Col>

              <Col span={5}>
                <span>
                  Consecutivos Nuevos{" "}
                  <Tooltip title="Número desde donde va a iniciar los nuevos consecutivos">
                    <InfoCircleOutlined
                      style={{ color: "#faad14", cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
                <Input
                  placeholder="Nuevo inicio"
                  value={inputs.nuevo}
                  onChange={(e) =>
                    handleInputChange(pisoNum, "nuevo", e.target.value)
                  }
                />
              </Col>
            </Row>

            <Button
              style={{ marginTop: 20 }}
              type="primary"
              loading={loading}
              onClick={() => EnvioNomenclatura(pisoNum)}
            >
              Actualizar Piso {pisoNum}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
