/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import "./CustomList.css";
import { Typography, Tooltip, Input, Card, List, Col, Row, Spin } from "antd";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { getGestionProyecto } from "@/services/proyectos/gestionProyectoAPI";
import { ModalInforme } from "../ListGestionProyecto/ModalInforme";

export const ListGestioNueva = () => {
  const [showActiveConvenios, setShowActiveConvenios] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  /* modal de proceso proyecto */

  const location = useLocation();

  useEffect(() => {
    fetchConvenios();
  }, []);

  const fetchConvenios = () => {
    getGestionProyecto().then(({ data: { data, data_casas } }) => {
      // Mapear proyectos normales
      const convenios = data.map((convenio: any) => ({
        // key: `apt-${convenio.id}`, // prefijo para diferenciar
        key: convenio.id,
        tipo: "Apartamento",
        nombreEncargado: (convenio.nombresEncargados || []).join(", "),
        nombreIngeniero: (convenio.nombresIngenieros || []).join(", "),
        descripcion_proyecto: convenio.descripcion_proyecto,
        emp_nombre: convenio.emp_nombre,
        estado: convenio.estado.toString(),
        fec_ini: convenio.fecha_inicio,
        fec_fin: convenio.fec_fin,
        codigo_proyecto: convenio.codigo_proyecto,
        porcentaje: convenio.porcentaje,
        avance: convenio.avance,
      }));

      // Mapear proyectos de casas
      const conveniosCasas = data_casas.map((casa: any) => ({
        // key: `casa-${casa.id}`, // prefijo diferente
        key: casa.id,
        tipo: "Casa",
        nombreEncargado: (casa.nombresEncargados || []).join(", "),
        nombreIngeniero: (casa.nombresIngenieros || []).join(", "),
        descripcion_proyecto: casa.descripcion_proyecto,
        emp_nombre: casa.emp_nombre,
        estado: casa.estado.toString(),
        fec_ini: casa.fecha_inicio,
        fec_fin: casa.fec_fin,
        codigo_proyecto: casa.codigo_proyecto,
        porcentaje: casa.porcentaje,
        avance: casa.avance,
      }));

      // Unir todo
      const todosConvenios = [...convenios, ...conveniosCasas];

      setInitialData(todosConvenios);
      setLoading(false);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const filterConvenios = () => {
    return initialData.filter((convenio) => {
      const matchesSearch: any = Object.keys(convenio).some((key: any) =>
        String(convenio[key]).toLowerCase().includes(searchValue.toLowerCase())
      );

      if (showActiveConvenios === true) {
        return matchesSearch && convenio.estado === "1";
      } else if (showActiveConvenios === false) {
        return matchesSearch && convenio.estado === "0";
      }
      return matchesSearch;
    });
  };

  return (
    <>
      <StyledCard title={"Lista de Proyectos"}>
        {loading ? (
          // Loader centrado mientras carga
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" tip="Cargando proyectos..." />
          </div>
        ) : (
          <>
            <Row gutter={12}>
              <Col xs={24} sm={24}>
                <SearchBar>
                  <Input placeholder="Buscar" onChange={handleSearch} />
                </SearchBar>
              </Col>
            </Row>

            <List
              grid={{
                gutter: 10,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              dataSource={filterConvenios()}
              renderItem={(item: any) => (
                <List.Item key={item.key}>
                  <Card className="custom-card pastel-theme">
                    <div className="card-content-wrapper">
                      {/* Sección izquierda con gráficos circulares */}
                      <div className="progress-section">
                        <div className="circle-progress-container">
                          <div className="circle-progress-wrapper">
                            <div className="circle-progress">
                              <div
                                className="circle-progress-fill"
                                style={{
                                  background: `conic-gradient(#97D8B4 ${item.avance}%, #F0F0F0 ${item.avance}% 100%)`,
                                }}
                              ></div>
                              <div className="circle-progress-text">
                                <span>{item.avance}%</span>
                              </div>
                            </div>
                          </div>
                          <span className="circle-progress-label">Avance</span>
                        </div>

                        <div className="circle-progress-container">
                          <div className="circle-progress-wrapper">
                            <div className="circle-progress">
                              <div
                                className="circle-progress-fill"
                                style={{
                                  background: `conic-gradient(#FFB7B7 ${item.porcentaje}%, #F0F0F0 ${item.porcentaje}% 100%)`,
                                }}
                              ></div>
                              <div className="circle-progress-text">
                                <span>{item.porcentaje}%</span>
                              </div>
                            </div>
                          </div>
                          <span className="circle-progress-label">Atraso</span>
                        </div>
                      </div>

                      {/* Sección derecha con información */}
                      <div className="info-section">
                        <List.Item.Meta
                          title={
                            <span className="title-text">
                              {item.descripcion_proyecto.toUpperCase()}
                            </span>
                          }
                          description={
                            <>
                              <Typography.Text
                                className="razon-soc"
                                strong
                                style={{ color: "#FFB380" }}
                              >
                                <span>CLIENTE: {item.emp_nombre}</span>
                              </Typography.Text>
                              <br />
                              <Typography.Text className="nombre" strong>
                                <span>
                                  INGENIEROS:{" "}
                                  {item.nombreIngeniero.toUpperCase()}
                                </span>
                              </Typography.Text>
                              <br />
                              <Typography.Text className="nombre" strong>
                                <span>
                                  ENCARGADOS:{" "}
                                  {item.nombreEncargado.toUpperCase()}
                                </span>
                              </Typography.Text>
                              <br />
                              <Typography.Text
                                className="codigo_proyecto"
                                strong
                                style={{ color: "#FF9D9D" }}
                              >
                                <span>
                                  CODIGO PROYECTO:{" "}
                                  {item.codigo_proyecto.toUpperCase()}
                                </span>
                              </Typography.Text>
                            </>
                          }
                        />
                        <div className="actions-container">
                          {item.tipo == "Casa" ? (
                            <>
                              <div className="status-container">
                                <Tooltip title="Ver Proceso Proyecto">
                                  <Link
                                    to={`${location.pathname}/proceso-casa/${item.key}`}
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
                                    >
                                      <AiOutlineExpandAlt />
                                    </ButtonTag>
                                  </Link>
                                </Tooltip>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="status-container">
                                <Tooltip title="Ver Proceso Proyecto">
                                  <Link
                                    to={`${location.pathname}/proceso/${item.key}`}
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
                                    >
                                      <AiOutlineExpandAlt />
                                    </ButtonTag>
                                  </Link>
                                </Tooltip>
                              </div>
                            </>
                          )}

                          {item.tipo == "Casa" ? (
                            <></>
                          ) : (
                            <>
                              <div className="status-container">
                                <ModalInforme proyecto={item} />
                              </div>
                            </>
                          )}
                        </div>
                        <span
                          style={{ color: "red", fontSize: 15, marginTop: 5 }}
                          className="title-text"
                        >
                          {item.tipo}
                        </span>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
              pagination={{
                pageSize: 8, // cantidad de cards por página
                showSizeChanger: true, // permite cambiar el tamaño de página
                pageSizeOptions: ["4", "8", "12", "20"], // opciones de items por página
                showTotal: (total: number, range: [number, number]) =>
                  `Mostrando ${range[0]}-${range[1]} de ${total} registros`,
              }}
            />
          </>
        )}
      </StyledCard>
    </>
  );
};
