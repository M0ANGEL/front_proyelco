/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getTrasladosPdf } from "@/services/documentos/trsAPI";
import { getListaTRS } from "@/services/documentos/trsAPI";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { KEY_BODEGA, KEY_ROL } from "@/config/api";
import { SearchBar } from "./styled";
import {
  SearchOutlined,
  FilePdfFilled,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  Typography,
  Tooltip,
  Button,
  Space,
  Input,
  Row,
  Col,
} from "antd";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { FaExchangeAlt } from "react-icons/fa";
import { UserData } from "@/services/types";
import { ModalCambioDestino } from "../ModalCambioDestino";

const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [openModalCambioDestino, setOpenModalCambioDestino] =
    useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasFuente, setHasFuente] = useState<boolean>(true);
  const [consecutivo, setConsecutivo] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserData>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const [trsID, setTrsID] = useState<React.Key>();
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      setUserInfo(userData);
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  useEffect(() => {
    setLoaderTable(true);
    const controller = new AbortController();
    const { signal } = controller;
    fetchDocumentos(value, currentPage, signal);
    return () => controller.abort();
  }, [value, currentPage]);

  const fetchDocumentos = (query = "", page = 1, abort?: AbortSignal) => {
    let estado = "";
    switch (tab) {
      case "pendientes":
        estado = "1";
        break;
      case "cerrado":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
    }
    getListaTRS(page, getSessionVariable(KEY_BODEGA), estado, query, abort)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          return {
            key: item.id,
            trs_id: item.trs_id,
            bod_origen: item.bod_origen.bod_nombre,
            numero_servinte: item.numero_servinte,
            bod_destino: item.bod_destino.bod_nombre,
            user: item.user.username,
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
            user_acepta: item.user_acepta
              ? item.user_acepta.username
              : "Sin aceptar",
            user_anula: item.user_anula
              ? item.user_anula.username
              : "Sin aceptar",
          };
        });
        setDataSource(documentos);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => {
          if (errors) {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              notificationApi.open({
                type: "error",
                message: error,
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        setLoaderTable(false);
      });
  };

  const handlePdfClick = async (id: any) => {
    try {
      const response = await getTrasladosPdf(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error mostrando el PDF:", error);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "trs_id",
      key: "trs_id",
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Número Servinte",
      dataIndex: "numero_servinte",
      key: "numero_servinte",
      hidden: hasFuente ? false : true,
      align: "center",
      fixed: "left",
      width: 120,
    },
    {
      title: "Bodega Origen",
      dataIndex: "bod_origen",
      key: "bod_origen",
    },
    {
      title: "Bodega Destino",
      dataIndex: "bod_destino",
      key: "bod_destino",
    },
    {
      title: "Usuario Elaboró",
      dataIndex: "user",
      key: "user",
      align: "center",
    },
    {
      title: "Fecha Realizado",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, { key, trs_id }) => {
        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <>
                <Tooltip title="Descargar Pdf">
                  <Button size="small" onClick={() => handlePdfClick(key)}>
                    <FilePdfFilled className="icono-rojo" />
                  </Button>
                </Tooltip>
                <Tooltip title="Ver documento">
                  <Link to={`${location.pathname}/show/${key}`}>
                    <Button key={key + "consultar"} size="small">
                      <SearchOutlined />
                    </Button>
                  </Link>
                </Tooltip>
              </>
            ) : null}
            {privilegios?.modificar == "1" && tab == "pendientes" ? (
              <Tooltip title="Editar documento">
                <Link to={`${location.pathname}/edit/${key}`}>
                  <Button type="primary" size="small" key={key + "modificar"}>
                    <EditOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {hasFuente &&
            ["pendientes"].includes(tab) &&
            ["administrador", "regente_farmacia"].includes(user_rol) ? (
              <Tooltip title="Cambiar destinatario">
                <Button
                  type="primary"
                  size="small"
                  key={key + "destino"}
                  onClick={() => {
                    setOpenModalCambioDestino(true);
                    setTrsID(key);
                    setConsecutivo(trs_id);
                  }}
                >
                  <FaExchangeAlt />
                </Button>
              </Tooltip>
            ) : null}
            {privilegios?.anular == "1" && tab == "pendientes" ? (
              <Tooltip title="Anular documento">
                <Link to={`${location.pathname}/anular/${key}`}>
                  <Button
                    danger
                    type="primary"
                    size="small"
                    key={key + "anular"}
                  >
                    <StopOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
      width: 70,
    },
  ];

  if (tab === "cerrado") {
    columns.splice(5, 0, {
      title: "Usuario Aceptó",
      dataIndex: "user_acepta",
      key: "user_acepta",
    });
  }
  return (
    <>
      {contextHolder}
      <ModalCambioDestino
        open={openModalCambioDestino}
        setOpen={(value: boolean) => {
          setOpenModalCambioDestino(value);
          setTrsID(undefined);
        }}
        userData={userInfo}
        trsID={trsID}
        consecutivo={consecutivo}
      />
      <Row gutter={12}>
        <Col span={24}>
          <SearchBar>
            <Input
              placeholder={`Busqueda por consecutivo${
                hasFuente ? ` o número de servinte` : null
              }, debes presionar Enter para buscar`}
              onKeyUp={(e: any) => {
                const {
                  key,
                  target: { value },
                } = e;
                if (key == "Enter") {
                  setValue(value);
                  setCurrentPage(1);
                }
              }}
            />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            columns={columns}
            dataSource={dataSource}
            loading={loaderTable}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: false,
              onChange: (page: number) => setCurrentPage(page),
              hideOnSinglePage: true,
              showSizeChanger: false,
              current: currentPage,
              showTotal: () => {
                return (
                  <>
                    <Text>Total Registros: {pagination?.total}</Text>
                  </>
                );
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};
