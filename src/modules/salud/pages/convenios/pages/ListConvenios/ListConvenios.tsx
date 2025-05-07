/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { FaFileDownload } from "react-icons/fa";
import { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  getReportConvenios,
  setStatusConvenio,
  getConvenios,
} from "@/services/salud/conveniosAPI";
import { SearchBar } from "./styled";
import { DataType } from "./types";
import "./CustomList.css";
import {
  CheckCircleFilled,
  LoadingOutlined,
  SyncOutlined,
  EditFilled,
} from "@ant-design/icons";
import {
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Switch,
  Input,
  Card,
  List,
  Spin,
  Col,
  Row,
  Tag,
} from "antd";

const { Text } = Typography;

export const ListConvenios = () => {
  const [showActiveConvenios, setShowActiveConvenios] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<React.Key[]>([]);
  const [loadingRep, setLoadingRep] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchConvenios();
  }, []);

  const fetchConvenios = () => {
    setLoadingRep(true);
    getConvenios().then(({ data: { data } }) => {
      console.log(data);
      const convenios = data.map((convenio: any) => {
        return {
          key: convenio.id,
          nombre: convenio.descripcion,
          razon_soc: convenio.razon_soc,
          estado: convenio.estado,
          fec_ini: convenio.fec_ini,
          fec_fin: convenio.fec_fin,
        };
      });
      setInitialData(convenios);
      setLoadingRow([]);
      setLoadingRep(false);
    });
  };

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusConvenio(id)
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
        title={"Lista de convenios"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Row gutter={12}>
          <Col xs={24} sm={18}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          <Col xs={24} sm={6} style={{ marginBottom: 20 }}>
            <Spin
              spinning={loadingRep}
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            >
              <Button
                type="primary"
                onClick={() => {
                  setLoadingRep(true);
                  getReportConvenios()
                    .then(({ data }) => {
                      fileDownload(data, "ReporteConvenios.xlsx");
                    })
                    .finally(() => {
                      setLoadingRep(false);
                    });
                }}
                icon={<FaFileDownload />}
                block
                style={{ background: "#5fb15f" }}
              >
                Informe
              </Button>
            </Spin>
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
                    <Link
                      to={`${location.pathname}/edit/${item.key}`}
                      className="title-link"
                    >
                      <span className="title-text">
                        {item.nombre.toUpperCase()}
                      </span>
                      <span className="title-icon">
                        <EditFilled style={{ color: "#FF8C00" }} />
                      </span>
                    </Link>
                  }
                  description={
                    <Typography.Text
                      className="razon-soc"
                      strong
                      style={{ color: "#FF8C00" }}
                    >
                      {item.razon_soc}
                    </Typography.Text>
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
                </div>
                <div className="card-footer">
                  <Typography.Text type="secondary">
                    <span className="footer-label">Fecha de inicio:</span>{" "}
                    <br></br>
                    {item.fec_ini}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <span className="footer-label">Fecha de fin:</span>{" "}
                    <br></br>
                    {item.fec_fin}
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
      </StyledCard>
    </>
  );
};
