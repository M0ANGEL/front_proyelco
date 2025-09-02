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
  const [selectedPiso, setSelectedPiso] = useState<number | null>(null);
  const [nomenclaturaInicio, setNomenclaturaInicio] = useState("");
  const [nomenclaturaFin, setNomenclaturaFin] = useState("");
  const [nuevoInicio, setNuevoInicio] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [nomenclaturas, setNomenclaturas] = useState<RawData[]>([]);
  const [erroRango, setErrorRango] = useState<boolean>(false);

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
  const pisoData = torreData?.pisos.find((p) => p.piso === selectedPiso);
  const apartamentos = pisoData ? pisoData.consecutivos : [];

  const EnvioNomenclatura = () => {
    if (!id) return;
    setLoading(true);
    const data = {
      id: Number(nomenclaturas?.[0]?.proyecto_id),
      torre: selectedTorre,
      piso: selectedPiso,
      apt_inicio: nomenclaturaInicio,
      apt_fin: nomenclaturaFin,
      nuevo_inicio: nuevoInicio,
    };

    actualizarNomenclatura(data)
      .then(() => {
        notification.success({
          message: "Nomenclaturas actualizadas con éxito!",
        });
        setErrorRango(false);
        fetchNomenclaturas(); // 🔄 refresca después de actualizar
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.response?.data?.message || err.message,
        });
        setErrorRango(true);
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
              setSelectedPiso(null);
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
          <Col span={8}>
            <label>Piso</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione piso"
              value={selectedPiso ?? undefined}
              onChange={(value) => setSelectedPiso(value)}
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

      {/* Inputs adicionales */}
      {selectedPiso && (
        <Card style={{ marginTop: "24px" }} title="Opciones de Nomenclatura">
          <Row gutter={16}>
            <Col span={8}>
            <span>
                Consecutivo Inicio{" "}
                <Tooltip title="Rango incial que se va a modificar">
                  <InfoCircleOutlined
                    style={{ color: "#faad14", cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
              <Input
                placeholder="Nomenclatura inicio"
                value={nomenclaturaInicio}
                onChange={(e) =>
                  setNomenclaturaInicio(e.target.value.replace(/\D/g, ""))
                }
                style={{ borderColor: erroRango ? "red" : "" }}
              />
              <Text type="danger">
                {erroRango ? "Validar rango de apartamentos " : ""}
              </Text>
            </Col>

            <Col span={8}>
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
                value={nomenclaturaFin}
                onChange={(e) =>
                  setNomenclaturaFin(e.target.value.replace(/\D/g, ""))
                }
                style={{ borderColor: erroRango ? "red" : "" }}
              />
              <Text type="danger">
                {erroRango ? "Validar rango de apartamentos " : ""}
              </Text>
            </Col>

            <Col span={8}>
              <span>
                Consecutivos Nuevos{" "}
                <Tooltip title="Este es el numero desde donde va a iniciar los nuevos consecutivos, si tenemos 101, 102, al poner de consecutivo nuevo el 120, 101=>120 | 102=>121">
                  <InfoCircleOutlined
                    style={{ color: "#faad14", cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
              <Input
                placeholder="Nuevo inicio"
                value={nuevoInicio}
                onChange={(e) =>
                  setNuevoInicio(e.target.value.replace(/\D/g, ""))
                }
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Render apartamentos */}
      {selectedPiso && (
        <Card
          style={{ marginTop: "24px" }}
          title="Apartamentos"
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
        </Card>
      )}

      <Button
        style={{ marginTop: 20 }}
        type="primary"
        disabled={!selectedPiso}
        loading={loading}
        onClick={EnvioNomenclatura}
      >
        Actualizar Nomenclaturas
      </Button>
    </div>
  );
};
