/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { generarInformePHPPuro } from "@/services/informes/reportesAPI";
import { searchDispensaciones } from "@/services/documentos/disAPI";
import { SearchBar, BalloonContainer, GreenButton } from "./styled";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { GlobalContext } from "@/router/GlobalContext";
import { FormAUD } from "../../pages/FormAUD/FormAUD";
import { KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { EstadosAuditoria } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import { FaFileDownload } from "react-icons/fa";
import fileDownload from "js-file-download";
import {
  getReportAuditoria,
  getTrazabilidad,
  getEstadosAud,
} from "@/services/auditar/auditarAPI";
import { DataType } from "./types";
import {
  ModalCambioEstadoMasivo,
  ModalConsecutivos,
  FiltroPanel,
} from "../../components/index";
import {
  CheckCircleTwoTone,
  PaperClipOutlined,
  HistoryOutlined,
  LoadingOutlined,
  EditOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./styles.css";
import {
  notification,
  Timeline,
  Skeleton,
  Tooltip,
  Button,
  Input,
  Modal,
  Space,
  Spin,
  Tag,
  Col,
  Row,
} from "antd";

const estadosBloqueados = [6, 9, 13];

export const ListarDocumentos = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useContext debe usarse dentro de un GlobalProvider");
  }
  const { userGlobal } = context;

  const [estadosAuditoria, setEstadosAuditoria] = useState<EstadosAuditoria[]>(
    []
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<React.Key>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectedConveniosForm, setSelectedConveniosForm] = useState([]);
  const [selectedBodegasForm, setSelectedBodegasForm] = useState([]);
  const [selectedEstadosForm, setSelectedEstadosForm] = useState([]);
  const [selectedFechasForm, setSelectedFechaForms] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [openFormAUD, setOpenFormAUD] = useState<boolean>(false);
  const [showInforme, setShowInforme] = useState<boolean>(false);
  const [consecutivosAlerta, setConsecutivosAlerta] = useState<
    { consecutivo: string; estado: string }[]
  >([]);
  const [openModalEstadosMasivos, setOpenModalEstadosMasivos] =
    useState<boolean>(false);
  const [loadingRep, setLoadingRep] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loadTraza, setLoadTraza] = useState<boolean>(false);
  const [openModalConsecutivos, setOpenModalConsecutivos] =
    useState<boolean>(false);
  const [buttonReport, setButtonReport] = useState(true);
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const { getSessionVariable } = useSessionStorage();
  const [upModal, setUpModal] = useState<number>(0);
  const { stringToArrayBuffer } = useArrayBuffer();
  const [resData, setResData] = useState<any>();
  const [pageSize, setPageSize] = useState(10);
  const componentJustMounted = useRef(true);
  const [allDis, setAllDis] = useState<
    {
      devolucion_dis: string;
      id: React.Key;
    }[]
  >([]);

  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const empresa_id = getSessionVariable(KEY_EMPRESA);

  useEffect(() => {
    getEstadosAud().then(({ data: { data } }) => {
      setEstadosAuditoria(data);
    });
  }, []);

  useEffect(() => {
    fetchData("paginador");
    componentJustMounted.current = false;
  }, [pageSize, selectedPage]);

  useEffect(() => {
    if (userGlobal && empresa_id) {
      const perfil = userGlobal.perfiles.find(
        (item) => item.id_empresa == empresa_id.toString()
      )?.nom_perfil;
      if (perfil) {
        if (
          [
            "ADMINISTRADOR",
            "COORDINADOR DE AUDITORIA",
            "LIDER DE AUDITORIA",
          ].includes(perfil)
        ) {
          setShowInforme(true);
        } else {
          setShowInforme(false);
        }
      } else {
        setShowInforme(false);
      }
    } else {
      setShowInforme(false);
    }
  }, [userGlobal, empresa_id]);

  const fetchData = async (origen = "consulta") => {
    if (!selectedFechasForm || selectedFechasForm.length === 0) {
      return;
    }

    const searchData = {
      pageSize: pageSize,
      selectedPage: selectedPage,
      selectedConveniosForm,
      selectedBodegasForm,
      selectedEstadosForm,
      selectedFechasForm,
      searchValue: searchValue,
    };

    try {
      setLoadingData(true);
      const estadosResponse = await getEstadosAud();
      const estadosData = estadosResponse?.data?.data;

      const estadosPermitidos = estadosData
        .filter((item) => item.rol_consulta?.includes(user_rol))
        .map((item) => item.estado);

      const { data: responseData } = await searchDispensaciones(searchData);

      setAllDis(responseData.all);
      setResData(responseData.data);
      if (origen == "consulta") {
        setSelectedPage(1);
      }

      const disData = responseData.data.data
        .filter((item) => {
          return estadosPermitidos.includes(item.estado_auditoria);
        })
        .map((item) => ({
          key: item.id,
          bod_solicitante: item.bod_nombre,
          num_docu: item.numero_identificacion,
          nompaciente: `${item.nombre_primero} ${
            item.nombre_segundo ? item.nombre_segundo : ""
          }`,
          apepaciente: `${item.apellido_primero} ${
            item.apellido_segundo ? item.apellido_segundo : ""
          }`,
          fecha: dayjs(item.dispensacion_created_at).format("YYYY-MM-DD HH:mm"),
          consecutivo: item.consecutivo,
          estado_auditoria: item.estado_auditoria,
          tiene_imagen: item.tiene_imagen_documento,
          devolucion_dis: item.devolucion_dis,
          fecha_last_cargue: item.fecha_last_cargue
            ? dayjs(item.fecha_last_cargue).format("YYYY-MM-DD HH:mm")
            : "Sin fecha",
          is_pago_pendiente: item.pendiente_id ? true : false,
        }));
      setDataSource(disData);

      if (selectedFechasForm.length > 0) {
        setButtonReport(false);
      } else {
        setButtonReport(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
    return;
  };

  useMemo(() => {
    if (selectedRowKeys.length > 0) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [selectedRowKeys]);

  const handleVerTrazabilidadClick = (documentId: React.Key) => {
    setModalVisible(true);
    setTimelineData([]);
    setLoadTraza(true);
    getTrazabilidad(documentId)
      .then(({ data: { data } }) => {
        setTimelineData(data);
        setLoadTraza(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos de trazabilidad:", error);
      });
    setLoadTraza(false);
  };

  const handlePageChange = (page: number) => {
    setLoadingData(true);
    setSelectedPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setLoadingData(true);
    setPageSize(size);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectedBodegasChange = (selectedBodegas: any) => {
    setSelectedBodegasForm(selectedBodegas);
  };

  const handleConvenioChange = (value: any) => {
    setSelectedConveniosForm(value);
  };

  const handleDateChange = (dateStrings: any) => {
    setSelectedFechaForms(dateStrings);
  };

  const handleEstadoChange = (value: any) => {
    setSelectedEstadosForm(value);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "N° Remisión",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      fixed: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            {record.tiene_imagen === "1" && (
              <Tooltip title="Documento adjunto">
                <PaperClipOutlined style={{ marginRight: 5, color: "blue" }} />
              </Tooltip>
            )}
            {text}
          </>
        );
      },
    },
    {
      title: "N° Documento",
      dataIndex: "num_docu",
      key: "num_docu",
      width: 100,
    },
    {
      title: "Nombre Paciente",
      dataIndex: "nompaciente",
      key: "nompaciente",
      width: 120,
    },
    {
      title: "Apellido Paciente",
      dataIndex: "apepaciente",
      key: "apepaciente",
      width: 120,
    },
    {
      title: "Bodega",
      dataIndex: "bod_solicitante",
      key: "bod_solicitante",
      width: 90,
      align: "center",
    },
    {
      title: "Fecha Remisión",
      dataIndex: "fecha",
      key: "fecha",
      width: 100,
      align: "center",
    },
    {
      title: "Último Cargue Soporte",
      dataIndex: "fecha_last_cargue",
      key: "fecha_last_cargue",
      width: 100,
      align: "center",
    },
    {
      title: "Estado Auditoria",
      dataIndex: "estado_auditoria",
      key: "estado_auditoria",
      align: "center",
      width: 200,
      render: (value, { is_pago_pendiente }) => {
        let nombre_estado = "DESCONOCIDO";
        const estadoInfo = estadosAuditoria.find(
          (item) => item.id.toString() === value
        );
        if (estadoInfo) {
          nombre_estado = estadoInfo.nombre_estado;
        }

        if (is_pago_pendiente && nombre_estado == "DOMICILIO") {
          nombre_estado = "DOMICILIO (PENDIENTE)";
        }
        return (
          <Tag color={"gray"}>
            <Space>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              {nombre_estado}
            </Space>
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (
        _,
        record: { key: React.Key; fecha: string; estado_auditoria: string }
      ) => {
        return (
          <Space>
            <Tooltip title="Cambiar Estado">
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setSelectedDocumentId(record.key);
                  setOpenFormAUD(true);
                }}
              >
                <SwapOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Ver Trazabilidad">
              <Button
                type="primary"
                size="small"
                style={{ background: "#5fb15f" }}
                onClick={() => {
                  handleVerTrazabilidadClick(record.key);
                  setModalVisible(true);
                  setLoadTraza(true);
                }}
              >
                <HistoryOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
      width: 70,
    },
  ];

  const handleModalClose = () => {
    setOpenFormAUD(false);
    setSelectedDocumentId(undefined);
    setUpModal(0);
  };

  const generateColor = (index: any) => {
    const colors = [
      "#90C641",
      "#FC5D36",
      "#FFCD32",
      "#48B9EA",
      "gray",
      "#00CCFF",
    ];
    return colors[index % colors.length];
  };

  const customLocale = {
    items_per_page: "/ página",
    jump_to: "Ir a",
    page: "Página",
  };

  const totalTextStyle = {
    fontWeight: "bold",
    color: "orange",
  };

  return (
    <>
      {contextHolder}
      <ModalConsecutivos
        open={openModalConsecutivos}
        setOpen={(value: boolean) => {
          setOpenModalConsecutivos(value);
          setConsecutivosAlerta([]);
        }}
        consecutivos={consecutivosAlerta}
      />
      <ModalCambioEstadoMasivo
        open={openModalEstadosMasivos}
        setOpen={(value: boolean, origen: string) => {
          setOpenModalEstadosMasivos(value);
          if (origen == "formulario") {
            setSelectedRowKeys([]);
            fetchData();
          }
        }}
        userGlobal={userGlobal}
        idsSeleccionados={selectedRowKeys.map(String)}
      />
      <Modal
        title="Trazabilidad del Documento"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[]}
        centered
      >
        {!loadTraza ? (
          <Timeline
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {timelineData.map((item) => (
              <Timeline.Item key={item.id} color={generateColor(item.id)}>
                <BalloonContainer color={generateColor(item.id)}>
                  <b>N° Remisión:</b> {item.consecutivo} <br />
                  <b>Estado:</b> {item.nombre_estado} <br />
                  {item.nombre_estado === "CON HALLAZGO" ||
                  item.nombre_estado === "DEVOLUCION" ? (
                    <>
                      <b>Motivos:</b> {item.motivos_auditoria} <br />
                      {item.id_aud_observacion ? (
                        <>
                          <b>Observación:</b>{" "}
                          {item.aud_observacion_info.aud_observacion} <br />
                        </>
                      ) : null}
                    </>
                  ) : null}
                  <b>Usuario:</b> {item.username} <br />
                  <b>Fecha:</b>{" "}
                  {dayjs(item.created_at).format("DD-MM-YYYY HH:mm:ss")}
                </BalloonContainer>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Skeleton active />
        )}
      </Modal>
      <Modal
        open={openFormAUD}
        footer={[]}
        onCancel={handleModalClose}
        destroyOnClose
        width={1100}
        style={{ top: 10 }}
        maskClosable={false}
      >
        <FormAUD
          documentId={selectedDocumentId}
          updateDataSource={() => {
            fetchData();
            setOpenFormAUD(false);
          }}
          upModal={upModal}
          estadosBloqueados={estadosBloqueados}
        />
      </Modal>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={24} lg={{ offset: 1, span: 22 }}>
          <FiltroPanel
            handleDateChange={handleDateChange}
            handleConvenioChange={handleConvenioChange}
            handleEstadoChange={handleEstadoChange}
            handleSelectedBodegasChange={handleSelectedBodegasChange}
            handleSearchButtonClick={fetchData}
          />
        </Col>
        <Col span={24}>
          <SearchBar>
            <Input
              placeholder="Buscar"
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelectedPage(1);
                  fetchData();
                }
              }}
            />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={showInforme ? 6 : 8}>
              <Button
                type="primary"
                disabled={!isButtonActive}
                block
                onClick={() => {
                  setOpenModalEstadosMasivos(true);
                }}
              >
                <EditOutlined /> Cambiar Estado Auditoría
              </Button>
            </Col>
            <Col xs={24} md={showInforme ? 6 : 8}>
              <Spin
                spinning={loadingRep}
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              >
                <GreenButton
                  type="primary"
                  // onClick={() => {
                  //   const searchData = {
                  //     selectedConveniosForm,
                  //     selectedBodegasForm,
                  //     selectedEstadosForm,
                  //     selectedFechasForm,
                  //     searchValue,
                  //     typeReport: 1,
                  //   };
                  //   setLoadingRep(true);

                  //   // Convierto el objeto a una cadena JSON
                  //   const searchDataJSON = JSON.stringify(searchData);

                  //   window
                  //     .open(
                  //       `https://farmartltda.com/reportes/reporteGeneralAuditoriaSQL.php?searchData=${searchDataJSON}`,
                  //       "_blank"
                  //     )
                  //     ?.focus();

                  //   setLoadingRep(false);
                  // }}
                  icon={<FaFileDownload />}
                  disabled={buttonReport}
                  onClick={() => {
                    setLoadingRep(true);
                    const data = {
                      selectedConveniosForm,
                      selectedBodegasForm,
                      selectedEstadosForm,
                      selectedFechasForm,
                      searchValue,
                    };

                    generarInformePHPPuro(
                      data,
                      "auditoria/reporteGeneralAuditoriaSQL"
                    )
                      .then(({ data }) => {
                        fileDownload(
                          stringToArrayBuffer(data),
                          `AUDITORIA_GENERAL.xls`
                        );
                        notificationApi.open({
                          type: "success",
                          message: "Reporte generado con exito!",
                        });
                      })
                      .catch(({ request: { response } }) => {
                        notificationApi.open({
                          type: "error",
                          message: response,
                        });
                      })
                      .finally(() => {
                        setLoadingRep(false);
                      });
                  }}
                  block
                >
                  Informe General Estados
                </GreenButton>
              </Spin>
            </Col>
            {showInforme ? (
              <>
                <Col xs={24} md={6}>
                  <Spin
                    spinning={loadingRep}
                    indicator={
                      <LoadingOutlined spin style={{ color: "white" }} />
                    }
                  >
                    <GreenButton
                      type="primary"
                      icon={<FaFileDownload />}
                      disabled={buttonReport}
                      onClick={() => {
                        setLoadingRep(true);
                        const data = {
                          selectedConveniosForm,
                          selectedBodegasForm,
                          selectedEstadosForm,
                          selectedFechasForm,
                          searchValue,
                        };

                        generarInformePHPPuro(
                          data,
                          "auditoria/reporteTrazabilidadAuditoriaSQL"
                        )
                          .then(({ data }) => {
                            fileDownload(
                              stringToArrayBuffer(data),
                              `Informe Trazabilidad.xls`
                            );
                            notificationApi.open({
                              type: "success",
                              message: "Reporte generado con exito!",
                            });
                          })
                          .catch(({ request: { response } }) => {
                            notificationApi.open({
                              type: "error",
                              message: response,
                            });
                          })
                          .finally(() => {
                            setLoadingRep(false);
                          });
                      }}
                      block
                    >
                      Informe Trazabilidad
                    </GreenButton>
                  </Spin>
                </Col>
              </>
            ) : null}
            <Col xs={24} md={showInforme ? 6 : 8}>
              <Spin
                spinning={loadingRep}
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              >
                <GreenButton
                  type="primary"
                  onClick={() => {
                    const searchData = {
                      selectedConveniosForm,
                      selectedBodegasForm,
                      selectedEstadosForm,
                      selectedFechasForm,
                      searchValue,
                      typeReport: 2,
                    };
                    setLoadingRep(true);
                    getReportAuditoria(searchData)
                      .then(({ data }) => {
                        fileDownload(data, "ReporteHallazgos.xlsx");
                      })
                      .finally(() => {
                        setLoadingRep(false);
                      });
                  }}
                  icon={<FaFileDownload />}
                  disabled={buttonReport}
                  block
                >
                  Informe Hallazgos y Dv.
                </GreenButton>
              </Spin>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            bordered
            rowKey={(record) => record.key}
            size="small"
            loading={loadingData}
            columns={columns}
            scroll={{ x: 1400 }}
            dataSource={dataSource}
            rowSelection={{
              preserveSelectedRowKeys: true,
              selectedRowKeys,
              onSelectAll: (value: boolean) => {
                if (value) {
                  setSelectedRowKeys(
                    allDis
                      .filter((item) => item.devolucion_dis == "0")
                      .map((item) => item.id)
                  );
                } else {
                  setSelectedRowKeys([]);
                }
              },
              onSelect: ({ key }: DataType, selected: boolean) => {
                let newSelectedRows: React.Key[] = [];
                if (selected) {
                  if (selectedRowKeys.length == 0) {
                    newSelectedRows.push(key);
                  } else {
                    newSelectedRows = [...selectedRowKeys, key];
                  }
                } else {
                  newSelectedRows = selectedRowKeys.filter(
                    (item: React.Key) => item != key
                  );
                }
                setSelectedRowKeys(newSelectedRows);
              },
              getCheckboxProps: (record) => {
                return {
                  disabled:
                    [6, 9, "6", "9"].includes(record.estado_auditoria) ||
                    record.devolucion_dis == "1",
                };
              },
            }}
            pagination={{
              current: selectedPage,
              total: resData?.total ?? 0,
              showSizeChanger: true,
              onShowSizeChange: (_page, pageSize) =>
                handlePageSizeChange(pageSize),
              showTotal: (total, range) => (
                <span>
                  {`${range[0]}-${range[1]} de un total de `}
                  <span style={totalTextStyle}>{total}</span> registros
                </span>
              ),
              onChange: handlePageChange,
              locale: customLocale,
            }}
          />
        </Col>
      </Row>
    </>
  );
};
