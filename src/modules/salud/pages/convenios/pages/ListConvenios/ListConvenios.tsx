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
  DeleteProyectoCasa,
  getProyectos,
} from "@/services/proyectos/proyectosAPI";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { ModalInforme } from "../../../gestionProyecto/pages/ListGestionProyecto/ModalInforme";
import { ModalInformeCasa } from "./ModalInformeCasa";

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

  // const fetchConvenios = () => {
  //   getProyectos().then(({ data: { data } }) => {
  //     const convenios = data.map((convenio: any) => {
  //       return {
  //         key: convenio.id,
  //         nombreEncargado: (convenio.nombresEncargados || []).join(", "),
  //         nombreIngeniero: (convenio.nombresIngenieros || []).join(", "),
  //         descripcion_proyecto: convenio.descripcion_proyecto,
  //         emp_nombre: convenio.emp_nombre,
  //         estado: convenio.estado.toString(),
  //         fec_ini: convenio.fecha_inicio,
  //         fec_fin: convenio.fec_fin,
  //         codigo_proyecto: convenio.codigo_proyecto,
  //         porcentaje: convenio.porcentaje,
  //         avance: convenio.avance,
  //       };
  //     });
  //     setInitialData(convenios);
  //     setLoadingRow([]);
  //     setLoading(false);
  //   });
  // };

  const fetchConvenios = () => {
    getProyectos().then(({ data: { data, data_casas } }) => {
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
  const handleStatusCasas = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    DeleteProyectoCasa(id)
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
                      {/* <div className="info-section">
                        <List.Item.Meta
                          title={
                            item.estado == "1" ? (
                               {item.tipo == "Casa" ? (<>
                               <Link
                                to={`${location.pathname}/edit/${item.key}`} //editar de pende proyecto
                                className="title-link"
                              >
                                <span className="title-text">
                                  {item.descripcion_proyecto.toUpperCase()}
                                </span>
                                <span className="title-icon">
                                  <EditFilled style={{ color: "#FFB380" }} />
                                </span>
                              </Link>
                               </>):(<>
                               <Link
                                to={`${location.pathname}/edit/${item.key}`} //editar de pende proyecto
                                className="title-link"
                              >
                                <span className="title-text">
                                  {item.descripcion_proyecto.toUpperCase()}
                                </span>
                                <span className="title-icon">
                                  <EditFilled style={{ color: "#FFB380" }} />
                                </span>
                              </Link>
                               </>)}
                              
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
                          <div className="status-container">
                            <Popconfirm
                              title="¿Desea cambiar el estado?"
                              onConfirm={
                                item.tipo === "Casa"
                                  ? () => handleStatusCasas(item.key)
                                  : () => handleStatus(item.key)
                              }
                              placement="left"
                            >
                              <ButtonTag className="custom-button-tag">
                                <Tooltip title="Cambiar estado">
                                  <Tag
                                    color={
                                      item.estado === "1"
                                        ? "#C2E5C2"
                                        : "#FFCCCB"
                                    }
                                    key={item.estado}
                                    style={{
                                      color:
                                        item.estado === "1"
                                          ? "#2E8B57"
                                          : "#D32F2F",
                                      border: "none",
                                    }}
                                    icon={
                                      loadingRow.includes(item.key) ? (
                                        <SyncOutlined spin />
                                      ) : (
                                        <CheckCircleFilled
                                          style={{
                                            color:
                                              item.estado === "1"
                                                ? "#2E8B57"
                                                : "#D32F2F",
                                          }}
                                        />
                                      )
                                    }
                                  >
                                    {item.estado === "1"
                                      ? "ACTIVO"
                                      : "INACTIVO"}
                                  </Tag>
                                </Tooltip>
                              </ButtonTag>
                            </Popconfirm>
                          </div>
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
                            <>
                              <div className="status-container">
                                <ModalInformeCasa proyecto={item} />
                              </div>
                            </>
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
                      </div> */}
                      <div className="info-section">
                        <List.Item.Meta
                          title={
                            item.estado === "1" ? (
                              <Link
                                // 🔹 El link cambia según el tipo de proyecto
                                to={`${location.pathname}/${
                                  item.tipo === "Casa" ? "edit-casa" : "edit"
                                }/${item.key}`}
                                className="title-link"
                              >
                                <span className="title-text">
                                  {item.descripcion_proyecto.toUpperCase()}
                                </span>
                                <span className="title-icon">
                                  <EditFilled style={{ color: "#FFB380" }} />
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
                                strong
                                style={{ color: "#FFB380" }}
                              >
                                CLIENTE: {item.emp_nombre}
                              </Typography.Text>
                              <br />
                              <Typography.Text strong>
                                INGENIEROS: {item.nombreIngeniero.toUpperCase()}
                              </Typography.Text>
                              <br />
                              <Typography.Text strong>
                                ENCARGADOS: {item.nombreEncargado.toUpperCase()}
                              </Typography.Text>
                              <br />
                              <Typography.Text
                                strong
                                style={{ color: "#FF9D9D" }}
                              >
                                CÓDIGO PROYECTO:{" "}
                                {item.codigo_proyecto.toUpperCase()}
                              </Typography.Text>
                            </>
                          }
                        />

                        <div className="actions-container">
                          {/* 🔹 Cambiar estado */}
                          <div className="status-container">
                            <Popconfirm
                              title="¿Desea cambiar el estado?"
                              onConfirm={() =>
                                item.tipo === "Casa"
                                  ? handleStatusCasas(item.key)
                                  : handleStatus(item.key)
                              }
                              placement="left"
                            >
                              <ButtonTag className="custom-button-tag">
                                <Tooltip title="Cambiar estado">
                                  <Tag
                                    color={
                                      item.estado === "1"
                                        ? "#C2E5C2"
                                        : "#FFCCCB"
                                    }
                                    key={item.estado}
                                    style={{
                                      color:
                                        item.estado === "1"
                                          ? "#2E8B57"
                                          : "#D32F2F",
                                      border: "none",
                                    }}
                                    icon={
                                      loadingRow.includes(item.key) ? (
                                        <SyncOutlined spin />
                                      ) : (
                                        <CheckCircleFilled
                                          style={{
                                            color:
                                              item.estado === "1"
                                                ? "#2E8B57"
                                                : "#D32F2F",
                                          }}
                                        />
                                      )
                                    }
                                  >
                                    {item.estado === "1"
                                      ? "ACTIVO"
                                      : "INACTIVO"}
                                  </Tag>
                                </Tooltip>
                              </ButtonTag>
                            </Popconfirm>
                          </div>

                          {/* 🔹 Ver proceso */}
                          <div className="status-container">
                            <Tooltip title="Ver Proceso Proyecto">
                              <Link
                                to={`${location.pathname}/${
                                  item.tipo === "Casa"
                                    ? "proceso-casa"
                                    : "proceso"
                                }/${item.key}`}
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

                          {/* 🔹 Modal de informe */}
                          <div className="status-container">
                            {item.tipo === "Casa" ? (
                              <ModalInformeCasa proyecto={item} />
                            ) : (
                              <ModalInforme proyecto={item} />
                            )}
                          </div>
                        </div>

                        {/* 🔹 Tipo de proyecto */}
                        <span
                          style={{ color: "red", fontSize: 15, marginTop: 5 }}
                        >
                          {item.tipo}
                        </span>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
              pagination={{
                pageSize: 100, // cantidad de cards por página
                showSizeChanger: true, // permite cambiar el tamaño de página
                pageSizeOptions: ["200", "300"], // opciones de items por página
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
