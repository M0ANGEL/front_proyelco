/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import useNotification from "antd/es/notification/useNotification";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { KEY_MOTIVOS_AUDITORIA, KEY_ROL } from "@/config/api";
import { GreenButton, SearchBar } from "./styled";
import { DataType, Pagination } from "./types";
import { UserAliados } from "@/services/types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import fileDownload from "js-file-download";
import {
  getListadoDispensacionesPag,
  generarInformeTrazabilidad,
  generarInformeGeneral,
  uploadSoportesAliados,
  getUserAliado,
  getAliados,
  getSoportes,
  downloadZipAliados,
} from "@/services/aliados/aliadosAPI";
import {
  CloudServerOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  HistoryOutlined,
  SearchOutlined,
  UploadOutlined,
  SwapOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  ModalTrazabilidad,
  ModalDetalle,
  ModalEstados,
  ModalSoportes,
  ModalCargueSoportes,
} from "../../components";
import {
  SelectProps,
  DatePicker,
  Typography,
  Tooltip,
  Button,
  Select,
  Upload,
  Input,
  Space,
  Table,
  Col,
  Row,
  Spin,
  Tag,
} from "antd";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const ListDispensaciones = () => {
  const { getSessionVariable, setSessionVariable, clearSessionVariable } =
    useSessionStorage();
  const [estadosDispensaciones, setEstadosDispensaciones] = useState<string[]>(
    []
  );
  const [selectAliados, setSelectAliados] = useState<SelectProps["options"]>(
    []
  );
  const [selectEstados, setSelectEstados] = useState<SelectProps["options"]>([
    { label: "CARGADO", value: "CARGADO" },
    { label: "RECARGADO", value: "RECARGADO" },
    { label: "RECHAZADO", value: "RECHAZADO" },
    { label: "PROCESADO", value: "PROCESADO" },
  ]);
  const [openModalCargueSoportes, setOpenModalCargueSoportes] =
    useState<boolean>(false);
  const [openModalSoportes, setOpenModalSoportes] = useState<boolean>(false);
  const [openModalDetalle, setOpenModalDetalle] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentItemsPage, setCurrentItemsPage] = useState<number>(10);
  const [dispensacionId, setDispensacionId] = useState<React.Key>();
  const [estadoDisModal, setEstadoDisModal] = useState<string>("");
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [loader, setLoder] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [aliadoInfo, setAliadoInfo] = useState<UserAliados>();
  const [allDis, setAllDis] = useState<{ id: string }[]>([]);
  const [notificationApi, contextHolder] = useNotification();
  const [searchInput, setSearchInput] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>();
  const [openModalCambioEstado, setOpenModalCambioEstado] =
    useState<boolean>(false);
  const [openModalTrazabilidad, setOpenModalTrazabilidad] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [consecutivo, setConsecutivo] = useState<string>();
  const [soportes, setSoportes] = useState<string[]>([]);
  const [aliados, setAliados] = useState<string[]>([]);
  const { arrayBufferToString } = useArrayBuffer();
  const [rangoFechas, setRangoFechas] = useState<{
    fecha_inicio: string;
    fecha_fin: string;
  }>();

  useEffect(() => {
    getAliados().then(({ data: { data } }) => {
      setSelectAliados(
        data.map((item) => ({
          label: item.aldo_nombre,
          value: item.id.toString(),
        }))
      );
    });
    if (!getSessionVariable(KEY_MOTIVOS_AUDITORIA)) {
      getMotivosAud().then(({ data: { data } }) => {
        setSessionVariable(
          KEY_MOTIVOS_AUDITORIA,
          JSON.stringify(
            data.map((item) => ({
              label: `${item.codigo} - ${item.motivo}`,
              value: item.id.toString(),
            }))
          )
        );
      });
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSessionVariable(KEY_MOTIVOS_AUDITORIA);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (
      !aliadoInfo &&
      ![
        "administrador",
        "auditoria",
        "quimico",
        "facturacion",
        "cotizaciones",
      ].includes(user_rol)
    ) {
      getUserAliado()
        .then(({ data: { data } }) => {
          if (data) {
            setAliadoInfo(data);
          } else {
            notificationApi.info({
              message:
                "No tienes un aliado asignado, por favor contacta con TI para asignación de un aliado.",
            });
          }
        })
        .finally(() => setLoder(false));
    } else {
      if (
        [
          "administrador",
          "auditoria",
          "quimico",
          "facturacion",
          "cotizaciones",
        ].includes(user_rol)
      ) {
        setSelectEstados(
          selectEstados?.concat([
            { label: "PRE-FACTURADA", value: "PRE-FACTURADA" },
            { label: "FACTURADO", value: "FACTURADO" },
            // { label: "PAGADO", value: "PAGADO" },
          ])
        );
        setLoder(false);
      } else {
        fetchAliados();
      }
    }
  }, [aliadoInfo]);

  // useEffect(() => {
  //   fetchAliados();
  // }, [currentPage, currentItemsPage]);

  // useEffect(() => {
  //   if (searchInput != "") {
  //     setLoaderTable(true);
  //     fetchAliados();
  //   }
  // }, [searchInput]);

  const fetchAliados = (
    searchValue = searchInput,
    page = currentPage,
    itemsPerPage = currentItemsPage
  ) => {
    setLoaderTable(true);
    setSelectedRowKeys([]);
    const dataSend = {
      page: page,
      paginate: itemsPerPage,
      searchInput: searchValue,
      aliado_id: aliadoInfo?.id_aliado,
      estados: estadosDispensaciones,
      aliados: aliados,
      fecha_inicio: rangoFechas?.fecha_inicio,
      fecha_fin: rangoFechas?.fecha_fin,
    };
    getListadoDispensacionesPag(dataSend).then(({ data: { data, all } }) => {
      setPagination(data);
      const dispensaciones: DataType[] = data.data.map((dispensacion) => {
        return {
          key: dispensacion.id,
          consecutivo: dispensacion.consecutivo,
          punto_entrega: dispensacion.punto_entrega,
          fecha_documento: dispensacion.fecha_documento,
          fecha_cargue: dayjs(dispensacion.created_at).format(
            "YYYY-MM-DD HH:mm"
          ),
          estado_auditoria: dispensacion.estado_auditoria,
          aliado_nombre: dispensacion.aliado
            ? dispensacion.aliado.aldo_nombre
            : "",
          aliado_id: dispensacion.aliado_id,
          observacion_auditoria: dispensacion.observacion_auditoria,
          has_files: dispensacion.files.length > 0,
        };
      });
      setDataSource(dispensaciones);
      setAllDis(all);
      setLoaderTable(false);
    });
  };

  const handleFileChangeImages = (file: File, id: React.Key) => {
    setLoaderTable(true);
    const formData = new FormData();
    formData.append("soportes", file);
    formData.append("id", id.toString());
    uploadSoportesAliados(formData)
      .then(() => {
        fetchAliados();
        notificationApi.open({
          type: "success",
          message: `Archivo cargado con exito!`,
        });
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
                duration: 5,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 5,
            });
          }
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      render: (value, { has_files }) => {
        return (
          <>
            {has_files && (
              <Tooltip title="Soportes cargados">
                <PaperClipOutlined style={{ marginRight: 5, color: "blue" }} />
              </Tooltip>
            )}
            {value}
          </>
        );
      },
    },
    {
      title: "Punto Entrega",
      dataIndex: "punto_entrega",
      key: "punto_entrega",
      align: "center",
    },
    {
      title: "Fecha Documento",
      dataIndex: "fecha_documento",
      key: "fecha_documento",
      align: "center",
    },
    {
      title: "Fecha Cargue",
      dataIndex: "fecha_cargue",
      key: "fecha_cargue",
      align: "center",
    },
    {
      title: "Estado",
      dataIndex: "estado_auditoria",
      key: "estado_auditoria",
      render: (value, { observacion_auditoria }) => {
        let color = "";
        switch (value) {
          case "CARGADO":
          case "RECARGADO":
            color = "cyan-inverse";
            break;
          case "RECHAZADO":
            color = "red-inverse";
            break;
          case "PROCESADO":
            color = "green-inverse";
            break;
          case "PRE-FACTURADA":
          case "FACTURADO":
          case "PAGADO":
            if (
              ![
                "administrador",
                "auditoria",
                "quimico",
                "facturacion",
                "cotizaciones",
              ].includes(user_rol)
            ) {
              value = "PROCESADO";
            }
            color = "green-inverse";
            break;
        }
        return (
          <Space>
            <Tag color={color} style={{ marginInlineEnd: 0 }}>
              {value}
              {["RECHAZADO", "PROCESADO"].includes(value) ? (
                <Tooltip title={observacion_auditoria}>
                  {" "}
                  <InfoCircleOutlined />
                </Tooltip>
              ) : null}
            </Tag>
          </Space>
        );
      },
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, { key, consecutivo, aliado_id, estado_auditoria }) => {
        return (
          <Space>
            <Tooltip
              title={
                ["administrador", "auditoria"].includes(user_rol)
                  ? "Cambiar estado"
                  : "Ver detalle"
              }
            >
              <Button
                icon={
                  ["administrador", "auditoria"].includes(user_rol) ? (
                    <SwapOutlined />
                  ) : (
                    <EyeOutlined />
                  )
                }
                type={
                  ["administrador", "auditoria"].includes(user_rol)
                    ? "primary"
                    : "default"
                }
                size="small"
                onClick={() => {
                  setOpenModalDetalle(true);
                  setDispensacionId(key);
                  setConsecutivo(consecutivo);
                }}
              />
            </Tooltip>
            <Upload
              beforeUpload={(file) => {
                handleFileChangeImages(file, key);
                return false;
              }}
              maxCount={10}
              accept=".pdf"
              showUploadList={false}
              multiple
            >
              <Tooltip title="Cargar archivos">
                <GreenButton
                  size="small"
                  disabled={
                    !["CARGADO", "RECARGADO"].includes(estado_auditoria)
                  }
                >
                  <UploadOutlined />
                </GreenButton>
              </Tooltip>
            </Upload>
            <Tooltip title="Ver soportes">
              <Button
                key={key + "soportes"}
                size="small"
                onClick={() => {
                  setLoaderTable(true);
                  getSoportes(consecutivo, aliado_id, key.toString())
                    .then(({ data: { data } }) => {
                      if (data.length > 0) {
                        setOpenModalSoportes(true);
                        setEstadoDisModal(estado_auditoria);
                        setSoportes(data);
                      } else {
                        notificationApi.open({
                          type: "error",
                          message:
                            "No existen soportes cargados para esta dispensación",
                          duration: 3,
                        });
                      }
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
                              duration: 5,
                            });
                          }
                        } else {
                          notificationApi.open({
                            type: "error",
                            message: response.data.message,
                            duration: 5,
                          });
                        }
                      }
                    )
                    .finally(() => setLoaderTable(false));
                }}
              >
                <CloudServerOutlined />
              </Button>
            </Tooltip>
            {["administrador", "auditoria"].includes(user_rol) ? (
              <Tooltip title="Ver Trazabilidad">
                <GreenButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    setDispensacionId(key);
                    setOpenModalTrazabilidad(true);
                  }}
                >
                  <HistoryOutlined />
                </GreenButton>
              </Tooltip>
            ) : null}
          </Space>
        );
      },
    },
  ];

  if (["administrador", "auditoria"].includes(user_rol)) {
    columns.splice(3, 0, {
      title: "Aliado",
      dataIndex: "aliado_nombre",
      key: "aliado_nombre",
      align: "center",
    });
  }

  return (
    <>
      {contextHolder}
      <ModalDetalle
        open={openModalDetalle}
        setOpen={(value: boolean, fetch: boolean) => {
          setOpenModalDetalle(value);
          setDispensacionId(undefined);
          setConsecutivo(undefined);
          if (fetch) {
            fetchAliados();
          }
        }}
        dispensacionId={dispensacionId}
        consecutivo={consecutivo}
      />
      <ModalTrazabilidad
        open={openModalTrazabilidad}
        setOpen={(value: boolean) => {
          setOpenModalTrazabilidad(value);
          setDispensacionId(undefined);
        }}
        id_dispensacion={dispensacionId}
      />
      <ModalEstados
        open={openModalCambioEstado}
        setOpen={(value: boolean, fetch: boolean) => {
          setOpenModalCambioEstado(value);
          if (fetch) {
            fetchAliados();
            setSelectedRowKeys([]);
          }
        }}
        dispensaciones={selectedRowKeys}
      />
      <ModalSoportes
        open={openModalSoportes}
        setOpen={(value: boolean) => {
          setOpenModalSoportes(value);
          setEstadoDisModal("");
        }}
        soportes={soportes}
        estado={estadoDisModal}
      />
      <ModalCargueSoportes
        open={openModalCargueSoportes}
        setOpen={(value: boolean) => {
          setOpenModalCargueSoportes(value);
        }}
        aliado_id={aliadoInfo?.id_aliado}
        selectAliados={selectAliados}
      />
      <Spin spinning={loader}>
        <StyledCard title={"Lista de dispensaciones"}>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col
              xs={24}
              sm={
                [
                  "administrador",
                  "auditoria",
                  "quimico",
                  "facturacion",
                  "cotizaciones",
                ].includes(user_rol)
                  ? 8
                  : 12
              }
            >
              <RangePicker
                allowClear
                style={{ width: "100%" }}
                placeholder={["Inicial", "Final"]}
                onChange={(_, dates) => {
                  setRangoFechas({
                    fecha_inicio: dates[0],
                    fecha_fin: dates[1],
                  });
                }}
              />
            </Col>
            <Col
              xs={24}
              sm={
                [
                  "administrador",
                  "auditoria",
                  "quimico",
                  "facturacion",
                  "cotizaciones",
                ].includes(user_rol)
                  ? 8
                  : 12
              }
            >
              <Select
                allowClear
                mode="multiple"
                maxTagCount={2}
                placeholder={"Estados"}
                style={{ width: "100%" }}
                defaultValue={estadosDispensaciones}
                onChange={(value: string[]) => {
                  setEstadosDispensaciones(value);
                }}
                options={selectEstados}
              />
            </Col>
            {[
              "administrador",
              "auditoria",
              "quimico",
              "facturacion",
              "cotizaciones",
            ].includes(user_rol) ? (
              <Col xs={24} sm={8}>
                <Select
                  allowClear
                  mode="multiple"
                  maxTagCount={2}
                  placeholder={"Aliados"}
                  style={{ width: "100%" }}
                  onChange={(value: string[]) => {
                    setAliados(value);
                  }}
                  options={selectAliados}
                />
              </Col>
            ) : null}
            <Col xs={24} sm={20}>
              <SearchBar>
                <Input
                  placeholder="Buscar"
                  onPressEnter={(event) => {
                    const {
                      target: { value },
                    }: any = event;
                    setCurrentPage(1);
                    fetchAliados(value, 1);
                    setSearchInput(value);
                  }}
                />
              </SearchBar>
            </Col>
            <Col xs={24} sm={4}>
              <Spin spinning={loaderTable}>
                <Button
                  block
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    setCurrentPage(1);
                    fetchAliados(searchInput, 1);
                  }}
                />
              </Spin>
            </Col>
            <Col span={24}>
              <Spin spinning={loaderTable}>
                <Row gutter={[12, 12]}>
                  {["administrador", "auditoria"].includes(user_rol) ? (
                    <Col xs={24} sm={24} lg={6}>
                      <Button
                        block
                        type="primary"
                        onClick={() => {
                          setOpenModalCambioEstado(true);
                        }}
                        disabled={selectedRowKeys.length == 0}
                      >
                        Cambiar estados
                      </Button>
                    </Col>
                  ) : null}
                  <Col
                    xs={24}
                    sm={8}
                    lg={{
                      offset: ["administrador", "auditoria"].includes(user_rol)
                        ? 0
                        : 6,
                      span: ["administrador", "auditoria"].includes(user_rol)
                        ? 4
                        : 6,
                    }}
                  >
                    <GreenButton
                      block
                      onClick={() => {
                        setLoaderTable(true);
                        const data = {
                          searchInput: searchInput,
                          aliado_id: aliadoInfo?.id_aliado,
                          estados: estadosDispensaciones,
                          aliados: aliados,
                          fecha_inicio: rangoFechas?.fecha_inicio,
                          fecha_fin: rangoFechas?.fecha_fin,
                        };
                        generarInformeGeneral(data)
                          .then(({ data }) => {
                            fileDownload(data, "INFORME GENERAL ALIADOS.xlsx");
                          })
                          .finally(() => setLoaderTable(false));
                      }}
                      disabled={dataSource.length == 0}
                    >
                      Generar Informe
                    </GreenButton>
                  </Col>
                  <Col
                    xs={24}
                    sm={8}
                    lg={
                      ["administrador", "auditoria"].includes(user_rol) ? 4 : 6
                    }
                  >
                    <Button
                      block
                      type="primary"
                      onClick={() => {
                        setOpenModalCargueSoportes(true);
                      }}
                      disabled={dataSource.length == 0}
                    >
                      Cargar Soportes
                    </Button>
                  </Col>
                  {["administrador", "auditoria"].includes(user_rol) ? (
                    <>
                      <Col xs={24} sm={8} lg={4}>
                        <Button
                          block
                          ghost
                          type="primary"
                          onClick={() => {
                            setLoaderTable(true);
                            downloadZipAliados({ seleccion: selectedRowKeys })
                              .then((response) => {
                                const url = window.URL.createObjectURL(
                                  new Blob([response.data])
                                );
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `dispensaciones_aliados.zip`
                                );
                                document.body.appendChild(link);
                                link.click();
                                notificationApi.open({
                                  type: "success",
                                  message: "Zip generado correctamente",
                                });
                              })
                              .catch(({ response: { data } }) => {
                                const message = arrayBufferToString(
                                  data
                                ).replace(/[ '"]+/g, " ");
                                notificationApi.open({
                                  type: "error",
                                  message: message,
                                });
                              })
                              .finally(() => setLoaderTable(false));
                          }}
                          disabled={selectedRowKeys.length == 0}
                        >
                          Descargar zip
                        </Button>
                      </Col>
                      <Col xs={24} sm={24} lg={6}>
                        <GreenButton
                          block
                          onClick={() => {
                            setLoaderTable(true);
                            const data = {
                              searchInput: searchInput,
                              aliado_id: aliadoInfo?.id_aliado,
                              estados: estadosDispensaciones,
                              aliados: aliados,
                              fecha_inicio: rangoFechas?.fecha_inicio,
                              fecha_fin: rangoFechas?.fecha_fin,
                            };
                            generarInformeTrazabilidad(data)
                              .then(({ data }) => {
                                fileDownload(
                                  data,
                                  "INFORME TRAZABILIDAD ALIADOS.xlsx"
                                );
                              })
                              .finally(() => setLoaderTable(false));
                          }}
                          disabled={dataSource.length == 0}
                        >
                          Generar Informe Trazabilidad
                        </GreenButton>
                      </Col>
                    </>
                  ) : null}
                </Row>
              </Spin>
            </Col>
          </Row>
          <Table
            bordered
            size="small"
            columns={columns}
            scroll={{ x: 1000 }}
            loading={loaderTable}
            dataSource={dataSource}
            className="custom-table"
            rowKey={(record) => record.key}
            pagination={{
              total: pagination?.total,
              pageSize: pagination?.per_page,
              simple: false,
              onChange: (page: number, pageSize: number) => {
                fetchAliados(searchInput, page, pageSize);
                setCurrentPage(page);
                setCurrentItemsPage(pageSize);
              },
              showSizeChanger: true,
              hideOnSinglePage: true,
              showTotal: () => {
                return (
                  <>
                    <Text>Total Registros: {pagination?.total}</Text>
                  </>
                );
              },
            }}
            rowSelection={
              ["administrador", "auditoria"].includes(user_rol)
                ? {
                    preserveSelectedRowKeys: true,
                    selectedRowKeys,
                    onSelectAll: (value: boolean) => {
                      if (value) {
                        setSelectedRowKeys(allDis.map((item) => item.id));
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
                  }
                : undefined
            }
          />
        </StyledCard>
      </Spin>
    </>
  );
};
