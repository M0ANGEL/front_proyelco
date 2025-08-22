/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import "./CustomList.css";
import { CheckCircleFilled, SyncOutlined, EditFilled } from "@ant-design/icons";
import {
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Input,
  Card,
  List,
  Col,
  Row,
  Tag,
  Switch,
  Spin,
} from "antd";
import {
  DeleteProyecto,
  getProyectos,
} from "@/services/proyectos/proyectosAPI";
import { AiOutlineExpandAlt } from "react-icons/ai";

const { Text } = Typography;

export const ListConvenios = () => {
  const [showActiveConvenios, setShowActiveConvenios] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  /* modal de proceso proyecto */

  const location = useLocation();

  useEffect(() => {
    fetchConvenios();
  }, []);

  const fetchConvenios = () => {
    getProyectos().then(({ data: { data } }) => {
      const convenios = data.map((convenio: any) => {
        return {
          key: convenio.id,
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
        };
      });
      setInitialData(convenios);
      setLoadingRow([]);
      setLoading(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeleteProyecto(id)
      .then(() => {
        fetchConvenios();
      })
      .catch(() => {
        setLoadingRow([]);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const toggleConvenioList = (checked: any) => {
    setShowActiveConvenios(checked ? true : false);
    fetchConvenios();
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
      <StyledCard
        title={"Lista de Proyectos"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
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
              <Col xs={24} sm={6} style={{ marginBottom: 20 }}>
                <Switch
                  checkedChildren="Mostrar Activos"
                  unCheckedChildren="Mostrar Inactivos"
                  checked={showActiveConvenios}
                  onChange={toggleConvenioList}
                />
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
                  <Card className="custom-card">
                    <List.Item.Meta
                      title={
                        item.estado == "1" ? (
                          <Link
                            to={`${location.pathname}/edit/${item.key}`}
                            className="title-link"
                          >
                            <span className="title-text">
                              {item.descripcion_proyecto.toUpperCase()}
                            </span>
                            <span className="title-icon">
                              <EditFilled style={{ color: "#FF8C00" }} />
                            </span>
                          </Link>
                        ) : (
                          <span className="title-text">
                            {item.descripcion_proyecto.toUpperCase()}
                          </span>
                        )
                      }
                      description={
                        <>
                          <Typography.Text
                            className="razon-soc"
                            strong
                            style={{ color: "#FF8C00" }}
                          >
                            <span>CLIENTE: {item.emp_nombre}</span>
                          </Typography.Text>
                          <br />
                          <Typography.Text className="nombre" strong>
                            <span>
                              INGENIEROS: {item.nombreIngeniero.toUpperCase()}
                            </span>
                          </Typography.Text>
                          <br />
                          <Typography.Text className="nombre" strong>
                            <span>
                              ENCARGADOS: {item.nombreEncargado.toUpperCase()}
                            </span>
                          </Typography.Text>
                          <br />
                          <Typography.Text
                            className="codigo_proyecto"
                            strong
                            style={{ color: "red" }}
                          >
                            <span>
                              CODIGO PROYECTO:{" "}
                              {item.codigo_proyecto.toUpperCase()}
                            </span>
                          </Typography.Text>
                        </>
                      }
                    />
                    <div className="card-content">
                      <div className="status-container">
                        <Popconfirm
                          title="¿Desea cambiar el estado?"
                          onConfirm={() => handleStatus(item.key)}
                          placement="left"
                        >
                          <ButtonTag className="custom-button-tag">
                            <Tooltip title="Cambiar estado">
                              <Tag
                                color={item.estado === "1" ? "green" : "red"}
                                key={item.estado}
                                icon={
                                  loadingRow.includes(item.key) ? (
                                    <SyncOutlined spin />
                                  ) : (
                                    <CheckCircleFilled
                                      style={{ color: "#a5eea0" }}
                                    />
                                  )
                                }
                              >
                                {item.estado === "1" ? "ACTIVO" : "INACTIVO"}
                              </Tag>
                            </Tooltip>
                          </ButtonTag>
                        </Popconfirm>
                      </div>
                      <div className="status-container">
                        {/* aqui abrir el modal del procesos del proyecto */}
                        <Tooltip title="Ver Proceso Proyecto">
                          <Link to={`${location.pathname}/proceso/${item.key}`}>
                            <ButtonTag
                              style={{
                                padding: 5,
                                borderRadius: 8,
                                width: 40,
                              }}
                              type="primary"
                            >
                              <AiOutlineExpandAlt />
                            </ButtonTag>
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="card-footer">
                      <Typography.Text type="secondary">
                        <span className="footer-label">Fecha de inicio:</span>{" "}
                        <br></br>
                        {item.fec_ini}
                      </Typography.Text>

                      {/* aqui traer calculo del procentaje de atrazo de la obra, calculo en el backend */}
                      <Typography.Text type="secondary">
                        <span className="footer-label">
                          Atraso del Proyecto
                        </span>{" "}
                        <br></br>
                        <span style={{ color: "blue" }}>
                          {" "}
                          <b>%{item.porcentaje}</b>{" "}
                        </span>
                      </Typography.Text>
                      {/* aqui traer calculo del procentaje de avance de la obra, calculo en el backend */}
                      <Typography.Text type="secondary">
                        <span className="footer-label">
                          Avance del Proyecto
                        </span>{" "}
                        <br></br>
                        <span style={{ color: "green" }}>
                          {" "}
                          <b>%{item.avance}</b>{" "}
                        </span>
                      </Typography.Text>
                    </div>
                  </Card>
                </List.Item>
              )}
              pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
                showTotal: (total: number) => {
                  return (
                    <>
                      <Text>Total Registros: {total}</Text>
                    </>
                  );
                },
              }}
            />
          </>
        )}
      </StyledCard>
    </>
  );
};
