/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  getReportUsuarios,
  getUsuarios,
  setStatusUser,
  getReportUsuariosPermisos,
  getReportPerfilesModulos,
} from "@/services/maestras/maestrasAPI";
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SyncOutlined, LoadingOutlined, EditOutlined } from "@ant-design/icons";
import { ButtonTag } from "./styled";
import fileDownload from "js-file-download";
import { FaFileDownload } from "react-icons/fa";
import { SearchBar } from "../../../perfiles/pages/ListPerfiles/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { KEY_EMPRESA } from "@/config/api";
import dayjs from "dayjs"


const { Text } = Typography;

interface DataType {
  key: number;
  name: string;
  cedula: string;
  username: string;
  rol: string;
  last_login: string;
  estado: string;
}

export const ListUsuarios = () => {
  const [loadingRep, setLoadingRep] = useState<boolean>(false);
  const [loadingRow, setLoadingRow] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const location = useLocation();
  const { getSessionVariable } = useSessionStorage();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getUsuarios().then(({ data: { data } }) => {
      const usersFilter = data.filter((element) =>
        element.empresa.some(
          (item) => item.id.toString() == getSessionVariable(KEY_EMPRESA)
        )
      );
      const users = usersFilter.map((user) => {
        return {
          key: user.id,
          name: user.nombre,
          cedula: user.cedula,
          username: user.username,
          rol: user.rol,
          last_login: dayjs(user?.last_login).format("DD-MM-YYYY HH:mm"), //cambio del formato de la hora
          estado: user.estado,
        };
      });
      setLoadingRow([]);
      setInitialData(users);
      setDataSource(users);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
    },
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",
      sorter: (a, b) => a.cedula.localeCompare(b.cedula),
    },
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Rol de usuario",
      dataIndex: "rol",
      key: "rol",
      sorter: (a, b) => a.rol.localeCompare(b.rol),
    },
    {
      title: "Último login",
      dataIndex: "last_login",
      key: "last_login",
      sorter: (a, b) =>
        a.last_login.toString().localeCompare(b.last_login.toString()),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      render: (_, record: { key: React.Key; estado: string }) => {
        let estadoString = "";
        let color;
        if (record.estado === "1") {
          estadoString = "ACTIVO";
          color = "green";
        } else {
          estadoString = "INACTIVO";
          color = "red";
        }
        return (
          <Popconfirm
            title="¿Desea cambiar el estado?"
            onConfirm={() => handleStatus(record.key)}
            placement="left"
          >
            <ButtonTag color={color}>
              <Tag
                color={color}
                key={estadoString}
                icon={
                  loadingRow.includes(record.key) ? <SyncOutlined spin /> : null
                }
              >
                {estadoString.toUpperCase()}
              </Tag>
            </ButtonTag>
          </Popconfirm>
        );
      },
      sorter: (a, b) => a.estado.localeCompare(b.estado),
      width: 90,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
      fixed: "right",
      width: 70,
    },
  ];

  const handleStatus = (id: React.Key) => {
    setLoadingRow([...loadingRow, id]);
    setStatusUser(id).then(() => {
      fetchUsers();
    });
  };
  return (
    <>
      <StyledCard
        title={"Lista de usuarios"}
        extra={
          <Link to={`${location.pathname}/create`}>
            <Button type="primary">Crear</Button>
          </Link>
        }
      >
        <Row gutter={12}>
          <Col xs={24} sm={14}>
            <SearchBar>
              <Input placeholder="Buscar" onChange={handleSearch} />
            </SearchBar>
          </Col>
          <Col xs={24} sm={5} style={{ marginBottom: 20 }}>
            <Spin
              spinning={loadingRep}
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            >
              <Button
                type="primary"
                onClick={() => {
                  setLoadingRep(true);
                  getReportUsuarios()
                    .then(({ data }) => {
                      fileDownload(data, "ReporteUsuarios.xlsx");
                    })
                    .finally(() => {
                      setLoadingRep(false);
                    });
                }}
                icon={<FaFileDownload />}
                block
              >
                Informe
              </Button>
            </Spin>
          </Col>
          <Col xs={24} sm={5} style={{ marginBottom: 20 }}>
            <Spin
              spinning={loadingRep}
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            >
              <Button
                type="primary"
                onClick={() => {
                  setLoadingRep(true);
                  getReportUsuariosPermisos()
                    .then(({ data }) => {
                      fileDownload(
                        data,
                        "ReporteUsuariosPermisosDocumentos.xlsx"
                      );
                    })
                    .finally(() => {
                      setLoadingRep(false);
                    });
                }}
                icon={<FaFileDownload />}
                block
              >
                Informe Usuario-Permisos
              </Button>
            </Spin>
          </Col>
          <Col xs={24} sm={5} style={{ marginBottom: 20 }}>
            <Spin
              spinning={loadingRep}
              indicator={<LoadingOutlined spin style={{ color: "white" }} />}
            >
              <Button
                type="primary"
                onClick={() => {
                  setLoadingRep(true);
                  getReportPerfilesModulos()
                    .then(({ data }) => {
                      fileDownload(data, "ReportePerfilesModulos.xlsx");
                    })
                    .finally(() => {
                      setLoadingRep(false);
                    });
                }}
                icon={<FaFileDownload />}
                block
              >
                Informe Perfiles-Modulos
              </Button>
            </Spin>
          </Col>
        </Row>
        <Table
          className="custom-table"
          size="small"
          dataSource={dataSource == null ? initialData : dataSource}
          columns={columns}
          loading={initialData.length == 0 ? true : false}
          scroll={{ x: 800 }}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return (
                <>
                  <Text>Total Registros: {total}</Text>
                </>
              );
            },
          }}
          style={{ textAlign: "center" }}
          bordered
        />
      </StyledCard>
    </>
  );
};
