/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonTag } from "@/modules/admin-usuarios/pages/usuarios/pages/ListUsuarios/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { actualizarEstados } from "@/services/auditar/auditarAPI";
import { KEY_BODEGA, BASE_URL, KEY_ROL } from "@/config/api";
import { DataType, Pagination, Props } from "./types";
import { Link, useLocation } from "react-router-dom";
import { ButtonUpload, SearchBar } from "./styled";
import Table, { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { Images } from "@/services/types";
import {
  getDispensacionTirillaPdf,
  getDispensacionPdf,
  getPaginateDis,
  getImages,
} from "@/services/documentos/disAPI";
import { ModalAdjuntos } from "..";
import {
  CloudServerOutlined,
  CheckCircleTwoTone,
  FileImageOutlined,
  RollbackOutlined,
  SearchOutlined,
  UploadOutlined,
  FilePdfFilled,
  EditOutlined,
  StopOutlined,
  SwapOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import {
  notification,
  Typography,
  Tooltip,
  Button,
  Upload,
  Input,
  Space,
  Col,
  Row,
  Tag,
} from "antd";
import type { UploadProps } from "antd";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { GreenButton } from "@/modules/common/components/ExportExcel/styled";
const { Text } = Typography;

export const ListarDocumentos = ({ privilegios, tab }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderTable, setLoaderTable] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [adjuntos, setAdjuntos] = useState<Images[]>([]);
  const { getSessionVariable } = useSessionStorage();
  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const [value, setValue] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
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
      case "abiertos":
        estado = "1";
        break;
      case "cerrados":
        estado = "3";
        break;
      case "anulados":
        estado = "4";
        break;
      case "auditoria":
      case "domicilios":
        estado = tab;
        break;
    }
    getPaginateDis(page, getSessionVariable(KEY_BODEGA), estado, query, abort)
      .then(({ data: { data } }) => {
        setPagination(data);
        const documentos: DataType[] = data.data.map((item) => {
          const motivos_auditoria = item.motivos_auditoria.map(
            (item) => item.codigo
          );
          return {
            key: item.id,
            fuente: item.fuente ? item.fuente.prefijo : "",
            numero_servinte: item.numero_servinte,
            bodega: item.bodegas.bod_nombre,
            num_docu: item.pacientes.numero_identificacion,
            nompaciente: `${item.pacientes.nombre_primero}${
              item.pacientes.nombre_segundo
                ? " " + item.pacientes.nombre_segundo
                : ""
            }`,
            apepaciente: `${item.pacientes.apellido_primero}${
              item.pacientes.apellido_segundo
                ? " " + item.pacientes.apellido_segundo
                : ""
            }`,
            usuario: item.usuarios.username,
            fecha: dayjs(item.created_at).format("YYYY-MM-DD HH:mm"),
            consecutivo: item.consecutivo,
            flag_devolucion: item.devolucion_dis,
            flag_pendientes: item.flag_pendientes,
            estado_auditoria: item.estado_auditoria,
            vlr_cuota: parseFloat(item.valor),
            motivos_auditoria,
          };
        });

        setDataSource(documentos);
        setLoaderTable(false);
      })
      .catch(({ response }) => {
        if (response) {
          if (response.data.errors) {
            const errores: string[] = Object.values(response.data.errors);

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
          setLoaderTable(false);
        }
      });
  };

  const handleFileChangeImages = async (file: File, id: React.Key) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notificationApi.error({
        message: "El archivo no puede superar las 2MB.",
      });
      return isLt2M;
    }

    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("id", id.toString());
    formData.append("bodega", getSessionVariable(KEY_BODEGA));

    setLoaderTable(true);
    // Realiza la solicitud POST a la ruta de tu API en Laravel
    await axios
      .post<{ data: DataType[] }>(
        `${BASE_URL}dispensaciones-formula`, // ruta
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Archivo cargado con exito!`,
        });
        setLoaderTable(false);
        if (["domicilios"].includes(tab)) {
          fetchDocumentos();
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
          setLoaderTable(false);
        }
      );
  };

  const getAdjuntos = (consecutivo: string) => {
    setLoaderTable(true);
    getImages(consecutivo)
      .then(({ data: { data } }) => {
        if (data.length > 0) {
          setAdjuntos(data);
          setOpenModal(true);
        } else {
          notificationApi.open({
            type: "warning",
            message: `La dispensación con consecutivo ${consecutivo} no tiene adjuntos.`,
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
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
            });
          }
        }
      )
      .finally(() => setLoaderTable(false));
  };

  const generarPDF = (dispensacion_id: React.Key) => {
    setLoaderTable(true);
    getDispensacionPdf(dispensacion_id.toString())
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .finally(() => setLoaderTable(false));
  };

  const generarTirilla = (dispensacion_id: React.Key) => {
    setLoaderTable(true);
    getDispensacionTirillaPdf(dispensacion_id.toString())
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .finally(() => setLoaderTable(false));
  };

  const obtenerDatosDeLaConsulta = (estado_auditoria: string) => {
    // Aquí debes implementar la lógica real para obtener los datos de 'key' y 'label' desde la consulta.
    // Por ahora, simulamos la obtención de datos de manera estática.
    const datosEjemplo: any = {
      0: { key: "0", label: "SIN AUDITAR" },
      1: { key: "1", label: "DISPENSADO" },
      2: { key: "2", label: "REVISADO" },
      3: { key: "3", label: "CON HALLAZGO" },
      4: { key: "4", label: "SOLUCIONADO" },
      5: { key: "5", label: "PARA FACTURAR" },
      6: { key: "6", label: "FACTURADO" },
      7: { key: "7", label: "VALIDADO" },
      8: { key: "8", label: "DEVOLUCIÓN" },
      9: { key: "9", label: "PREFACTURADA" },
      10: { key: "10", label: "DOMICILIO" },
    };

    return datosEjemplo[estado_auditoria];
  };

  const allColumns: ColumnsType<DataType> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Fuente",
      dataIndex: "fuente",
      key: "fuente",
      hidden: hasFuente ? false : true,
      align: "center",
      fixed: "left",
      width: 60,
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
      title: "N° Documento",
      dataIndex: "num_docu",
      key: "num_docu",
      width: 120,
    },
    {
      title: "Nombres Paciente",
      dataIndex: "nompaciente",
      key: "nompaciente",
      width: 150,
    },
    {
      title: "Apellidos Paciente",
      dataIndex: "apepaciente",
      key: "apepaciente",
      width: 150,
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      align: "center",
      width: 150,
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      align: "center",
      width: 150,
    },
    {
      title: "Fecha Creación",
      dataIndex: "fecha",
      key: "fecha",
      align: "center",
      width: 150,
    },
    {
      title: "Estado Cantidades",
      dataIndex: "flag_pendientes",
      key: "flag_pendientes",
      align: "center",
      width: 200,
      render: (_, { flag_pendientes }) => {
        let estado = "";
        let color = "";
        if (flag_pendientes === "1") {
          estado = "Pendientes por entregar";
          color = "volcano";
        } else {
          estado = "Entrega Completa";
          color = "green";
        }
        return flag_pendientes == "1" ? (
          <Tag color={color}>
            <Space>
              <EyeOutlined />
              {estado}
            </Space>
          </Tag>
        ) : (
          <Tag color={color}>
            <Space>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              {estado}
            </Space>
          </Tag>
        );
      },
    },
    {
      title: "Estado Auditoria",
      dataIndex: "estado_auditoria",
      key: "estado_auditoria",
      align: "center",
      width: 300,
      render: (_, record) => {
        const consulta = obtenerDatosDeLaConsulta(record.estado_auditoria);
        const estadoInfo = consulta
          ? { key: consulta.key, label: consulta.label }
          : { key: "Desconocido", label: "Desconocido" };
        return record.estado_auditoria === "0" ? (
          <ButtonTag>
            <Tag color={"#CCCCCC"}>
              <Space>
                <EyeOutlined />
                {estadoInfo.label}
              </Space>
            </Tag>
          </ButtonTag>
        ) : (
          <Tag color={"gray"}>
            <Space>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              {estadoInfo.label}
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
      width: 280,
      render: (
        _,
        {
          key,
          consecutivo,
          flag_devolucion,
          vlr_cuota,
          motivos_auditoria,
          estado_auditoria,
          fuente,
          numero_servinte,
        }
      ) => {
        const estadoBotonModificar = false;
        let estadoBotonAud = true;
        if (
          ["regente", "usuario", "regente_farmacia", "administrador"].includes(
            user_rol
          )
        ) {
          estadoBotonAud = false;
        }

        const cantEditByMotivo = motivos_auditoria.some((motivo) =>
          ["701", "307-13", "307-14", "307-15", "307-16"].includes(motivo)
        );

        return (
          <Space>
            {privilegios?.consultar == "1" ? (
              <Tooltip title="Ver documento">
                <Link to={`${location.pathname}/show/${key}`}>
                  <Button key={key + "consultar"} size="small">
                    <SearchOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            {(privilegios?.modificar == "1" &&
              tab == "auditoria" &&
              flag_devolucion == "0" &&
              cantEditByMotivo &&
              [3, "3"].includes(estado_auditoria)) ||
            (privilegios?.modificar == "1" &&
              ![null, undefined, ""].includes(fuente) &&
              ![null, undefined, ""].includes(numero_servinte)) ? (
              <Tooltip
                title={
                  !estadoBotonModificar
                    ? "Editar documento"
                    : "Tiempo excedido para modificacion"
                }
              >
                <Button
                  type="primary"
                  size="small"
                  key={key + "modificar"}
                  disabled={estadoBotonModificar}
                >
                  <Link to={`${location.pathname}/edit/${key}`}>
                    <EditOutlined />
                  </Link>
                </Button>
              </Tooltip>
            ) : null}
            <Tooltip title="Generar PDF">
              <Button
                size="small"
                key={key + "pdf"}
                onClick={() => generarPDF(key)}
              >
                <FilePdfFilled className="icono-rojo" />
              </Button>
            </Tooltip>
            {tab == "auditoria" &&
            ["regente", "regente_farmacia", "administrador"].includes(
              user_rol
            ) ? (
              <Tooltip title="Cambiar Estado Auditoría">
                <Link to={`${location.pathname}/auditar/${key}`}>
                  <Button
                    type="primary"
                    key={key + "consultar"}
                    size="small"
                    disabled={estadoBotonAud}
                  >
                    <SwapOutlined />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
            <Tooltip title="Generar Tirilla">
              <Button
                size="small"
                key={key + "tirilla"}
                onClick={() => generarTirilla(key)}
                disabled={vlr_cuota == 0}
              >
                <FileImageOutlined className="icono-rojo" />
              </Button>
            </Tooltip>
            <Tooltip title="Ver soportes">
              <Button
                key={key + "consultar"}
                size="small"
                onClick={() => getAdjuntos(consecutivo)}
              >
                <CloudServerOutlined />
              </Button>
            </Tooltip>
            <Upload
              beforeUpload={(file) => {
                handleFileChangeImages(file, key);
                return false; // Evita la carga automática del archivo
              }}
              maxCount={10}
              accept=".pdf"
              showUploadList={false}
              multiple
            >
              <Tooltip title="Cargar soportes">
                <ButtonUpload size="small">
                  <UploadOutlined />
                </ButtonUpload>
              </Tooltip>
            </Upload>
            {tab == "domicilios" && flag_devolucion == "0" ? (
              <Tooltip title="Enviar a Devolución">
                <Button
                  key={key + "devolucion"}
                  size="small"
                  type="primary"
                  onClick={() => {
                    setLoaderTable(true);
                    actualizarEstados([key.toString()], "8", [99])
                      .then(() => {
                        notificationApi.open({
                          type: "success",
                          message: `Actualización exitosa`,
                        });
                        fetchDocumentos();
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
                              });
                            }
                          } else {
                            notificationApi.open({
                              type: "error",
                              message: response.data.message,
                            });
                          }
                          setLoaderTable(false);
                        }
                      );
                  }}
                >
                  <RollbackOutlined />
                </Button>
              </Tooltip>
            ) : null}

            {privilegios?.anular == "1" &&
            tab == "abiertos" &&
            flag_devolucion == "0" ? (
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
    },
  ];

  const columns = allColumns.filter((column: any) => {
    // Filtra las columnas según la condición de `tab`
    if (["auditoria", "domicilios"].includes(tab)) {
      return true; // Todas las columnas son visibles en "auditoria"
    } else {
      // Excluye la columna "Nueva Columna" si no estás en "auditoria"
      return column.dataIndex !== "estado_auditoria";
    }
  });

  const rowClassName = ({ flag_devolucion }: DataType) => {
    return flag_devolucion == "1" ? "orange-row" : "";
  };

  const props: UploadProps = {
    name: "dipensaciones",
    showUploadList: false,
    action: `${BASE_URL}dispensaciones/cargar-plano`,
    data: {
      convenio: "dick",
    },
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".xlsx",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file: any) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xlsx",
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info: any) {
      // setLoader(true);
      if (info.file.status !== "uploading") {
        // setLoader(false);
      }
      if (info.file.status === "removed") {
        // setLoader(false);
      }
      if (info.file.status === "done") {
        const {
          file: { response },
        } = info;
        const data: any = response;
        if (data.errores.length > 0) {
          // setErroresPlano(data.errores);
          // setOpenModalErroresPlano(true);
          // setLoader(false);
        }
        // fetchPacientes();
        // setLoader(false);
        notificationApi.open({
          type: info.file.response.status,
          message: info.file.response.message,
          duration: 20,
        });
      } else if (info.file.status === "error") {
        // setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 20,
        });
      }
    },
  };

  return (
    <>
      {contextHolder}
      <ModalAdjuntos
        open={openModal}
        setOpen={(value: boolean) => setOpenModal(value)}
        adjuntos={adjuntos}
      />
      <SearchBar style={{ marginBottom: 10 }}>
        <Input
          placeholder={`Busqueda por consecutivo o número de identificación${
            hasFuente ? ` o número de servinte` : ""
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
      <Row style={{ alignItems: "center", marginBottom: 10 }}>
        {["administrador"].includes(user_rol) && (
          <Col xs={24} sm={14} md={10}>
            <Upload {...props} style={{ width: "100%" }}>
              <GreenButton type="primary" icon={<UploadOutlined />} block>
                Cargar Dispensaciones
              </GreenButton>
            </Upload>
          </Col>
        )}

        <Col
          xs={24}
          sm={["administrador"].includes(user_rol) ? 10 : 24}
          md={["administrador"].includes(user_rol) ? 14 : 24}
        >
          <div
            style={{ display: "flex", justifyContent: "flex-start", flex: 1 }}
          >
            <Text>
              Las dispensaciones marcadas con color naranja tienen una
              devolución activa{" "}
              <Tag color="#ffe3a7" style={{ color: "#f8aa00" }}>
                Naranja
              </Tag>
            </Text>
          </div>
        </Col>
      </Row>
      <Table
        bordered
        rowKey={(record) => record.key}
        scroll={{ x: 1100 }}
        size="small"
        columns={columns}
        dataSource={dataSource}
        loading={loaderTable}
        rowClassName={rowClassName}
        pagination={{
          total: pagination?.total,
          pageSize: pagination?.per_page,
          onChange: (page: number) => setCurrentPage(page),
          hideOnSinglePage: true,
          showSizeChanger: false,
          current: currentPage,
          showTotal: () => {
            return <Text>Total Registros: {pagination?.total}</Text>;
          },
        }}
      />
    </>
  );
};
