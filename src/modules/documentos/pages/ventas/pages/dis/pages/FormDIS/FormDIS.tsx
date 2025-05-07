/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getTiposDocumentosIdentificacion } from "@/services/maestras/tiposDocumentosIdentificacionAPI";
import { DataType, DataTypeDispensaciones, DataTypePendientes } from "./types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getCuotaModeradoras } from "@/services/maestras/cuotaModeradoraAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { searchDiagnostico } from "@/services/maestras/diagnosticosAPI";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { SearchBar } from "../../components/ListarDocumentos/styled";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { searchConvenios } from "@/services/salud/conveniosAPI";
import { getPendientePdf } from "@/services/documentos/pendApi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useSerialize from "@/modules/common/hooks/useUpperCase";
import { CustomSpaceMotivos, CustomUpload } from "./styled";
import { fetchUserProfile } from "@/services/auth/authAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import Table, { ColumnsType } from "antd/es/table";
import {
  getCoincidenciasNumeroId,
  searchPacientes,
  updatePaciente,
} from "@/services/maestras/pacientesAPI";
import {
  searchMedicos,
  updateMedico,
  crearMedico,
} from "@/services/maestras/medicosAPI";
import { KEY_ROL } from "@/config/api";
import {
  actualizarEstados,
  getEstadosAud,
} from "@/services/auditar/auditarAPI";
import {
  getDispensacionTirillaPdf,
  getTotalDispensaciones,
  validarAccesoDocumento,
  checkNumeroServinte,
  getDispensacionPdf,
  crearDispensacion,
  searchEntidad,
  getDespachos,
  getInfoDis,
  anularDis,
  updateDIS,
} from "@/services/documentos/disAPI";
import dayjs from "dayjs";
import {
  ModalDiagnosticos,
  ModalPacientes,
  ModalProductos,
  ModalPaciente,
} from "../../components";
import {
  KEY_CONVENIOS_DIS,
  KEY_ENTIDADES_DIS,
  KEY_DESPACHOS_DIS,
  KEY_CUOTAS_DIS,
  CONVENIOS_DIS,
  KEY_EMPRESA,
  KEY_BODEGA,
} from "@/config/api";
import {
  ExclamationCircleFilled,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  // WarningOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  WarningFilled,
  SaveOutlined,
  EditOutlined,
  PlusOutlined,
  SwapOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  CamposxTipoDispensacion,
  IDispensacion,
  TipoDocumento,
  Diagnostico,
  Convenio,
  Paciente,
  UserData,
  Medico,
  TipoRegimen,
  CuotaModeradora,
} from "@/services/types";
import {
  TableColumnType,
  notification,
  InputNumber,
  SelectProps,
  DatePicker,
  InputProps,
  Typography,
  InputRef,
  Tooltip,
  message,
  Button,
  Select,
  Alert,
  Input,
  Modal,
  Space,
  Form,
  Spin,
  Tabs,
  Col,
  Row,
} from "antd";
import { TbHandStop } from "react-icons/tb";
import { getTipoRegimen } from "@/services/maestras/tipoRegimenAPI";

dayjs.extend(customParseFormat);

const { Title, Text /*, Paragraph*/ } = Typography;
const dateFormat = "DD/MM/YYYY";
const { TextArea } = Input;
const { confirm } = Modal;

let timeout: ReturnType<typeof setTimeout> | null;

export const FormDIS = () => {
  const [autorizacionEnvioCorreo, setAutorizacionEnvioCorreo] =
    useState<boolean>(false);
  const [openModalPacientes, setOpenModalPacientes] = useState<boolean>(false);
  const [alertaAutorizacionRedLadera, setAlertaAutorizacionRedLadera] =
    useState<boolean>(false);
  const [openModalDiagnosticos, setOpenModalDiagnosticos] =
    useState<boolean>(false);
  const [selectDespacho, setSelectDespacho] = useState<SelectProps["options"]>(
    []
  );
  const [selectConcepto, setSelectConcepto] = useState<SelectProps["options"]>(
    []
  );
  const [selectEntidad, setSelectEntidad] = useState<SelectProps["options"]>(
    []
  );
  const [selectFuentes, setSelectFuentes] = useState<SelectProps["options"]>(
    []
  );
  const [tipoDocumentoInfo, setTipoDocumentoInfo] = useState<TipoDocumento>();
  const [tipoDiagnostico, setTipoDiagnostico] = useState<string>("principal");
  const [disabledAuditoria, setDisabledAuditoria] = useState<boolean>(false);
  const [openModalPaciente, setOpenModalPaciente] = useState<boolean>(false);
  const [loaderDiagnostico, setLoaderDiagnostico] = useState<boolean>(false);
  const [disabledConvenio, setDisabledConvenio] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [selectTipo, setSelectTipo] = useState<SelectProps["options"]>([]);
  const [convenioSeleccionado, setConvenioSeleccionado] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const autDetInputRef = useRef<{ [key: string]: InputProps | null }>({});
  const [loaderEntidades, setLoaderEntidades] = useState<boolean>(false);
  const [dispensacionPacienteInitial, setDispensacionPacienteInitial] =
    useState<DataTypeDispensaciones[]>([]);
  const [loaderConvenio, setLoaderConvenio] = useState<boolean>(false);
  const [diagnosticoRel, setDiagnosticoRel] = useState<Diagnostico>();
  const [documentoInfo, setDocumentoInfo] = useState<IDispensacion>();
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [blockBtnCuota, setBlockBtnCuota] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [selectTipoDocumento, setSelectTipoDocumento] = useState<
    SelectProps["options"]
  >([]);
  const [permisosCampos, setPermisosCampos] = useState<
    CamposxTipoDispensacion[]
  >([]);
  const [selectCuotaModeradora, setSelectCuotaModeradora] = useState<
    SelectProps["options"]
  >([]);
  const [addEditModalMedicoVisible, setAddEditModalMedicoVisible] =
    useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [loaderMedico, setLoaderMedico] = useState<boolean>(false);
  const [dispensacionPaciente, setDispensacionPaciente] = useState<
    DataTypeDispensaciones[]
  >([]);
  const [modalDispensacionVisible, setModalDispensacionVisible] =
    useState(false);
  const [detalleProcesado, setDetalleProcesado] = useState(false);
  const [pacienteIsEnable, setPacienteIsEnable] = useState(false);
  const [opcionesCambio, setOpcionesCambio] = useState("");
  const [estadosModalDet, setEstadosModalDet] = useState<any[]>([]);
  const [diagnostico, setDiagnostico] = useState<Diagnostico>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [selectTipoConsulta, setSelectTipoConsulta] = useState<
    SelectProps["options"]
  >([]);
  const [pendientePaciente, setPendientePaciente] = useState<
    DataTypePendientes[]
  >([]);
  const [pendientePacienteInitial, setPendientePacienteInitial] = useState<
    DataTypePendientes[]
  >([]);
  const [selectTipoEntidad, setSelectTipoEntidad] = useState<
    SelectProps["options"]
  >([]);
  const [dataCantSol, setDataCantSol] = useState<number>();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [urlSplit, setUrlSplit] = useState<string[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);
  const [modal, contextHolderModal] = Modal.useModal();
  const [paciente, setPaciente] = useState<Paciente>();
  const [convenio, setConvenio] = useState<Convenio>();
  const [loader, setLoader] = useState<boolean>(false);
  const [autDet, setAutDet] = useState<boolean>(false);

  const [tiposRegimen, setTiposRegimen] = useState<TipoRegimen[]>();
  const [cuotasModeradoras, setCuotasModeradoras] =
    useState<CuotaModeradora[]>();
  const [selectTipoRegimen, setSelectTipoRegimen] = useState<
    SelectProps["options"]
  >([]);
  const [selectCuotasModeradoras, setSelectCuotasModeradoras] = useState<
    SelectProps["options"]
  >([]);
  const [camposErrorRegimen, setCamposErrorRegimen] = useState<string[]>([]);
  const [firstView, setFirstView] = useState<boolean>(false);
  const { getSessionVariable, setSessionVariable, clearSessionVariable } =
    useSessionStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [accion, setAccion] = useState<string>("");
  const { transformToUpperCase } = useSerialize();
  const [listPrice, setListPrice] = useState({});
  const [medico, setMedico] = useState<Medico>();
  const [fileList, setFileList] = useState([]);
  const [user, setUser] = useState<UserData>();
  const { id } = useParams<{ id: string }>();
  const [messageApi] = message.useMessage();
  const [editMedicoForm] = Form.useForm();
  const [addMedicoForm] = Form.useForm();
  const [total, setTotal] = useState(0);
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const searchInput = useRef<InputRef>(null);

  const controlObservacion = useForm({
    mode: "onChange",
  });
  const controlCorreo = useForm({
    mode: "onChange",
  });
  const controlMedico = useForm({
    mode: "onChange",
  });
  const control = useForm({
    mode: "onChange",
  });

  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const watchRegimen = control.watch("regimen");
  const watchRegimenID = control.watch("regimen_id");
  const watchTipoRegimen = control.watch("tipo_regimen");
  const watchPaciente = control.watch("numero_identificacion");
  const watchDiagnostico = control.watch("codigo_diagnostico");
  const watchDiagnosticoRel = control.watch("codigo_diagnostico_relacionado");
  const watchCuotaModeradora = control.watch("valor");
  const watchConcepto = control.watch("concepto_id");

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    // setLoader(true);
    setUrlSplit(url_split);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      )
        .then(({ data: { data } }) => {
          if (data) {
            control.setValue("tipo_documento_id", data.documento_info.id);
            setTipoDocumentoInfo(data.documento_info);

            if (data.crear !== "1" && accion == "create") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para crear documento!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.modificar !== "1" && accion == "edit") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para modificar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.consultar !== "1" && accion == "show") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para consultar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.anular !== "1" && accion == "anular") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para anular!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
          } else {
            messageApi.open({
              type: "error",
              content: "No tienes permisos para acceder a este documento!",
            });
            setTimeout(() => {
              navigate(`/${url_split.at(1)}`);
              setLoader(false);
            }, 1500);
          }
          setLoader(false);
        })
        .finally(() => {
          setLoader(false);
        });
    }

    if (!getSessionVariable(KEY_DESPACHOS_DIS)) {
      getDespachos().then(({ data: { data } }) => {
        const options = data.map((despacho: any) => {
          return { value: despacho.id, label: despacho.despacho };
        });
        setSelectDespacho(options);
        setSessionVariable(KEY_DESPACHOS_DIS, JSON.stringify(options));
      });
    } else {
      setSelectDespacho(JSON.parse(getSessionVariable(KEY_DESPACHOS_DIS)));
    }
    if (!getSessionVariable(KEY_CUOTAS_DIS)) {
      getCuotaModeradoras().then(({ data: { data } }) => {
        const options = data
          .filter((item) => item.estado == "1" && item.regimen != "ESPECIAL")
          .map((item) => {
            return {
              key: item.id,
              label: `$ ${parseFloat(item.valor).toLocaleString("es-ES")}`,
              value: parseFloat(item.valor),
            };
          });
        setSelectCuotaModeradora(options);
        setCuotasModeradoras(data);
        setSessionVariable(KEY_CUOTAS_DIS, JSON.stringify(options));
      });
    } else {
      setSelectCuotaModeradora(JSON.parse(getSessionVariable(KEY_CUOTAS_DIS)));
    }

    getTiposDocumentosIdentificacion("medicos")
      .then(({ data: { data } }) => {
        setSelectTipoDocumento(
          data.map((item) => ({
            value: item.codigo,
            label: `${item.codigo} - ${item.descripcion}`,
          }))
        );
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
      );

    setLoaderConvenio(true);
    if (!getSessionVariable(KEY_CONVENIOS_DIS)) {
      searchConvenios("", getSessionVariable(KEY_BODEGA))
        .then(({ data: { data } }) => {
          if (data.length > 0) {
            setConvenios(data);
            const options = data.map((item) => ({
              value: item.id,
              label: `${item.num_contrato} - ${item.descripcion}`,
            }));
            setSelectTipo(options);
            setSessionVariable(KEY_CONVENIOS_DIS, JSON.stringify(options));
            setSessionVariable(CONVENIOS_DIS, JSON.stringify(data));
          } else {
            setSelectTipo([]);
            notification.open({
              type: "error",
              message: "No existen convenios vinculados a esta bodega.",
            });
          }
        })
        .finally(() => setLoaderConvenio(false));
    } else {
      setSelectTipo(JSON.parse(getSessionVariable(KEY_CONVENIOS_DIS)));
      setConvenios(JSON.parse(getSessionVariable(CONVENIOS_DIS)));
      setLoaderConvenio(false);
    }

    setLoaderEntidades(true);
    if (!getSessionVariable(KEY_ENTIDADES_DIS)) {
      searchEntidad("")
        .then(({ data: { data } }) => {
          if (data) {
            const options = data.map((item) => ({
              value: item.id.toString(),
              label: `${item.entidad}`,
            }));
            setSelectTipoEntidad(options);
            setSessionVariable(KEY_ENTIDADES_DIS, JSON.stringify(options));
          } else {
            setSelectTipoEntidad([]);
            notification.open({
              type: "error",
              message: "No existe la Entidad.",
            });
          }
        })
        .finally(() => setLoaderEntidades(false));
    } else {
      setSelectTipoEntidad(JSON.parse(getSessionVariable(KEY_ENTIDADES_DIS)));
      setLoaderEntidades(false);
    }

    control.setValue("bodega_id", getSessionVariable(KEY_BODEGA)); // aca manda la variable de la bodega del usuario que esta en inicio de session.

    // Lógica para validar si el usuario tiene fuentes o no
    fetchUserProfile().then(({ data: { userData } }) => {
      setUser(userData);
    });

    if (accion != "create") {
      getTipoRegimen()
        .then(({ data: { data } }) => {
          setTiposRegimen(data);
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
        );
      getCuotaModeradoras()
        .then(({ data: { data } }) => {
          const cuotas: SelectProps["options"] = [];
          data.forEach((item) => {
            if (["1", 1].includes(item.estado)) {
              cuotas.push({
                label: `${item.regimen.toUpperCase()} ${
                  !["SUBSIDIADO", "ESPECIAL"].includes(
                    item.regimen.toUpperCase()
                  )
                    ? ` - Categoria ${item.categoria} ($ ${parseFloat(
                        item.valor
                      ).toLocaleString("COP")})`
                    : ""
                }`,
                value: item.id.toString(),
              });
            }
          });
          setCuotasModeradoras(data);
          setSelectCuotasModeradoras(cuotas);
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
        );
    }
  }, []);

  useEffect(() => {
    if (accion && !["show"].includes(accion)) {
      setLoader(true);
      getBodega(bodega_id).then(({ data: { data } }) => {
        if (data.estado_inventario == "1") {
          setLoader(true);
          notificationApi.error({
            message:
              "La bodega se encuentra en inventario, no es posible realizar ningún movimiento.",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          return;
        }
      });
    }
  }, [accion]);

  useEffect(() => {
    control.setValue("detalle", dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (diagnostico) {
      if (diagnostico.has_alert == "1" && watchRegimen == "CONTRIBUTIVO") {
        confirm({
          title: `Alerta de diagnóstico ${diagnostico.codigo} - ${diagnostico.descripcion}`,
          icon: <ExclamationCircleFilled />,
          content:
            "Este diagnóstico tiene la marca de que no se le cobra cuota moderadora",
          okText: "Confirmar",
          cancelText: "Cancelar",
        });
      }
    }

    if (diagnosticoRel) {
      if (diagnosticoRel.has_alert == "1" && watchRegimen == "CONTRIBUTIVO") {
        confirm({
          title: `Alerta de diagnóstico ${diagnosticoRel.codigo} - ${diagnosticoRel.descripcion}`,
          icon: <ExclamationCircleFilled />,
          content:
            "Este diagnóstico tiene la marca de que no se le cobra cuota moderadora",
          okText: "Confirmar",
          cancelText: "Cancelar",
        });
      }
    }
  }, [watchRegimen, diagnostico, diagnosticoRel]);

  useEffect(() => {
    if (watchPaciente == "" && !paciente) {
      setPaciente(undefined);
      control.setValue("nombre_completo", "");
    } else if (
      (paciente && paciente.cuotasmoderadoras) ||
      paciente?.cuotas_moderadoras
    ) {
      if (watchPaciente == "") {
        control.setValue(
          "numero_identificacion",
          paciente.numero_identificacion
        );
      }
      setDisabledConvenio(true);
      const nombre_completo = `${paciente.nombre_primero} ${
        paciente.nombre_segundo ? paciente.nombre_segundo + " " : ""
      }${paciente.apellido_primero}${
        paciente.apellido_segundo ? " " + paciente.apellido_segundo : ""
      }`;
      const dataCuotas = paciente.cuotas_moderadoras
        ? paciente.cuotas_moderadoras
        : paciente.cuotasmoderadoras;
      control.setValue("paciente_id", paciente.id);
      control.setValue("nombre_completo", nombre_completo);
      control.setValue("regimen", dataCuotas.regimen);
      control.setValue(
        "tipo_regimen",
        paciente.tipo_regimen ? paciente.tipo_regimen.nombre : ""
      );
      control.setValue("categoria", dataCuotas.categoria);
      if (control.getValues("cuota_moderadora") == "NO") {
        control.setValue("valor", 0);
      } else {
        control.setValue("valor", parseFloat(dataCuotas.valor));
      }

      setSelectEntidad([
        { label: paciente.eps.entidad, value: paciente.eps_id },
      ]);
      control.setValue("entidad", paciente.eps_id);
    }
  }, [watchPaciente, paciente]);

  useEffect(() => {
    if (watchDiagnostico == "") {
      setDiagnostico(undefined);
      control.setValue("codigo_diagnostico", "");
      control.setValue("descripcion_diagnostico", "");
    } else if (diagnostico) {
      control.setValue("codigo_diagnostico", diagnostico.codigo);
      control.setValue("descripcion_diagnostico", diagnostico.descripcion);
    }
  }, [watchDiagnostico, diagnostico]);

  useEffect(() => {
    if (watchDiagnosticoRel == "") {
      setDiagnosticoRel(undefined);
      control.setValue("codigo_diagnostico_relacionado", "");
      control.setValue("descripcion_diagnostico_relacionado", "");
    } else if (diagnosticoRel) {
      control.setValue("codigo_diagnostico_relacionado", diagnosticoRel.codigo);
      control.setValue(
        "descripcion_diagnostico_relacionado",
        diagnosticoRel.descripcion
      );
    }
  }, [watchDiagnosticoRel, diagnosticoRel]);

  useEffect(() => {
    let subtotalDis = 0;
    let ivaDis = 0;
    let totalDis = 0;
    dataSource.forEach((item) => {
      subtotalDis = subtotalDis + item.precio_subtotal;
      ivaDis = ivaDis + item.iva;
      totalDis = totalDis + item.precio_total;
    });
    control.setValue("subtotal", subtotalDis);
    control.setValue("impuesto", ivaDis);
    control.setValue("gran_total", totalDis);
  }, [dataSource]);

  useEffect(() => {
    if (!["create", ""].includes(accion)) {
      getEstadosAud().then(({ data: { data } }) => {
        const opcionesRolEstado = data.map((item: any) => ({
          id: item.id.toString(),
          code: item.estado,
          name: item.nombre_estado,
        }));
        // Filtrar opciones para mostrar solo "devolución" y "con hallazgo"
        const opcionesFiltradas = opcionesRolEstado.filter(
          (option: any) => option.name === "SOLUCIONADO" //|| option.name === "CON HALLAZGO"
        );
        setEstadosModalDet(opcionesFiltradas);
      });
    }
  }, [user_rol, accion]);

  // Observador para marcar el valor_cuota, es decir el valor real de la cuota moderdaroda
  useEffect(() => {
    if (convenio && convenio.cuota_mod == "1" && accion == "create") {
      if (dataSource.length > 0) {
        // Logica para setear el valor_couta y enviarlo al backend para guardar el valor de cuota real cobrado
        const valor_total = dataSource.reduce(
          (acc, item) => acc + item.precio_total,
          0
        );
        if (watchCuotaModeradora > valor_total) {
          setBlockBtnCuota(true);
          control.setValue("valor_cuota", valor_total);
        } else {
          setBlockBtnCuota(false);
          control.setValue("valor_cuota", watchCuotaModeradora);
        }
      } else {
        setBlockBtnCuota(false);
      }

      // Logica para validar si autoriza el envío del correo o no.
      if (!autorizacionEnvioCorreo) modalAutorizacion();
    }
  }, [
    dataSource,
    watchCuotaModeradora,
    paciente,
    autorizacionEnvioCorreo,
    accion,
    convenio,
  ]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSessionVariable(KEY_CUOTAS_DIS);
      clearSessionVariable(KEY_ENTIDADES_DIS);
      clearSessionVariable(KEY_CONVENIOS_DIS);
      clearSessionVariable(KEY_DESPACHOS_DIS);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (user?.has_fuentes == "0") {
      setFirstView(true);
      setHasFuente(false);
    } else {
      setHasFuente(true);
    }
    if (user?.has_fuentes == "1" && control.getValues("convenio_id")) {
      setFirstView(true);
      const fuentes =
        user?.fuentes_info.filter(
          (item) => item.fuente.tipo_fuente == "dispensacion"
        ) ?? [];
      if (fuentes.length > 0 && ["create", "edit"].includes(accion)) {
        setSelectFuentes(
          fuentes.map((fuente) => ({
            value: fuente.fuente_id,
            label: fuente.fuente.prefijo,
          }))
        );
      }
      if (fuentes.length == 1 && ["create"].includes(accion)) {
        control.setValue("id_fuente", fuentes[0].fuente_id);
      }
    }
  }, [control.watch("convenio_id"), user]);

  useEffect(() => {
    if (!isMounted.current) {
      if (id) {
        getInfoDis(id).then(({ data: { data } }) => {
          setListPrice(data.convenios.id_listapre);
          setDocumentoInfo(data);
          setAgravado(data.convenios.iva);
          //Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
          //caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
          if (["2", "3", "4"].includes(data.estado)) {
            setFlagAcciones(true);
            const estado =
              data.estado == "2"
                ? "en proceso"
                : data.estado == "3"
                ? "cerrado"
                : "anulado";
            if (["create", "edit", "anular"].includes(accion)) {
              messageApi.open({
                type: "error",
                content: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
              });
              setTimeout(() => {
                navigate(`/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`);
              }, 2500);
              return;
            }
          }

          setConvenio(data.convenios);
          setPermisosCampos(data.convenios.tipo_dispensacion.campos);

          control.setValue("numero_servinte", data.numero_servinte);
          control.setValue("id_fuente", data.id_fuente);

          if (data.fuente) {
            setSelectFuentes([
              { value: data.id_fuente, label: data.fuente.prefijo },
            ]);
          }

          setSelectConcepto(
            data.convenios.conceptosArray.map((concepto: any) => {
              return { value: concepto.id, label: concepto.nombre };
            })
          );

          setSelectTipoConsulta(
            data.convenios.tipo_consulArray.map((tipo_consul: any) => {
              return { value: tipo_consul.id, label: tipo_consul.nombre };
            })
          );

          form.setFieldValue(
            "tipo_documento",
            data.pacientes.tipo_identificacion
          );

          form.setFieldValue("genero_paciente", data.pacientes.genero);
          form.setFieldValue(
            "fecha_nacimiento_paciente",
            data.pacientes.fecha_nacimiento
          );

          control.setValue("observacion", data.observacion);
          control.setValue("convenio_id", data.convenios.descripcion);
          control.setValue("cuota_moderadora", data.cuota_moderadora);
          control.setValue("autorizacion_cabecera", data.autorizacion_cabecera);
          control.setValue(
            "numero_identificacion",
            data.pacientes.numero_identificacion
          );
          setPacienteIsEnable(true);
          control.setValue("concepto_id", data.conceptos.nombre);
          control.setValue("fecha_formula", dayjs(data.fecha_formula));
          control.setValue("numero_formula", data.numero_formula);
          control.setValue("lugar_formula", data.lugar_formula);
          control.setValue("despacho_id", data.despacho_id);
          control.setValue("tipo_consulta", data.tipo_consulta.id);
          control.setValue("medico_id", data.medico_id);
          control.setValue("diagnostico_id", data.diagnostico_id);
          control.setValue("codigo_diagnostico", data.diagnosticos.codigo);
          control.setValue(
            "descripcion_diagnostico",
            data.diagnosticos.descripcion
          );
          control.setValue("diagnostico_rel_id", data.diagnostico_rel_id);
          if (data.diagnostico_rel) {
            control.setValue(
              "codigo_diagnostico_relacionado",
              data.diagnostico_rel.codigo
            );
            control.setValue(
              "descripcion_diagnostico_relacionado",
              data.diagnostico_rel.descripcion
            );
          }
          control.setValue("entidad", data.pacientes.eps_id);
          setSelectEntidad([
            {
              label: data.pacientes.eps.entidad,
              value: data.pacientes.eps.id.toString(),
            },
          ]);
          control.setValue("categoria", data.regimen_info.categoria);
          control.setValue("regimen", data.regimen_info.regimen);
          control.setValue(
            "tipo_regimen",
            data.tipo_regimen_info ? data.tipo_regimen_info.nombre : ""
          );
          control.setValue("regimen_id", data.regimen_id);
          control.setValue("tipo_regimen_id", data.tipo_regimen_id);
          control.setValue("valor", parseFloat(data.valor));
          control.setValue("valor_cuota", parseFloat(data.valor_cuota));
          control.setValue("bodega_id", data.bodega_id);
          control.setValue(
            "nombre_completo",
            `${data.pacientes.nombre_primero} ${
              data.pacientes.nombre_segundo
                ? data.pacientes.nombre_segundo + " "
                : ""
            }${data.pacientes.apellido_primero}${
              data.pacientes.apellido_segundo
                ? " " + data.pacientes.apellido_segundo
                : ""
            }`
          );
          control.setValue(
            "numero_identificacion_m",
            data.medicos.numero_identificacion
          );
          setMedico(data.medicos);
          control.setValue(
            "nombre_medico",
            `${data.medicos.nombre_primero} ${
              data.medicos.nombre_segundo
                ? data.medicos.nombre_segundo + " "
                : ""
            }${data.medicos.apellido_primero}${
              data.medicos.apellido_segundo
                ? " " + data.medicos.apellido_segundo
                : ""
            }`
          );
          const estadoAUD = data.estado_auditoria.nombre_estado;
          setOpcionesCambio(estadoAUD);

          if (estadoAUD !== "CON HALLAZGO") {
            setDisabledAuditoria(true);
          } else {
            setDisabledAuditoria(false);
          }

          const fecha = new Date(data.created_at);
          const dia = fecha.getDate();
          const mes = fecha.getMonth() + 1;
          const año = fecha.getFullYear();

          const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
            mes < 10 ? "0" + mes : mes
          }/${año}`;
          control.setValue("fecha", fechaFormateada);

          if (!detalleProcesado) {
            const detalle: DataType[] = data.detalle.map((item) => {
              setDataCantSol(parseInt(item.cantidad_solicitada));
              return {
                key: item.id,
                id: item.producto_id,
                descripcion: item.producto.descripcion,
                cod_mipres: item.producto.cod_mipres,
                cantSol: parseFloat(item.cantidad_solicitada),
                cantidad: parseFloat(item.cantidad_entregada),
                cantDev: parseFloat(item.cantidad_dev),
                fvence: item.productos_lotes.fecha_vencimiento,
                lote: item.productos_lotes.lote,
                precio_lista: parseFloat(item.precio_venta),
                precio_subtotal: parseFloat(item.precio_subtotal),
                iva: parseFloat(item.costo_impuesto),
                precio_total: parseFloat(item.precio_venta_total),
                editable: true,
                dias_tratamiento: parseInt(item.dias_tratamiento),
                codigo_servinte: item.producto.cod_huv,
              };
            });

            setDataSource(detalle);
            setDetalleProcesado(true);
          }
        });
      }

      isMounted.current = true;
    }
  }, [id]);

  useEffect(() => {
    if (convenios.length == 1 && ["create"].includes(accion)) {
      handleSelectConvenio(convenios[0].id);
      control.setValue("convenio_id", convenios[0].id);
    }
  }, [convenios]);

  // Validacion de que el convenio, regimen, tipo_regimen y concepto coincidan por las palabras contributivo o subsidiado
  useEffect(() => {
    if (
      convenio &&
      ["subsidiado", "contributivo"].includes(
        convenio.reg_conv.toLowerCase()
      ) &&
      !["5"].includes(convenio.id_mod_contra)
    ) {
      const palabra_coincidencia = convenio.reg_conv.toLowerCase();
      const campos_encontrados: string[] = [];
      // Campo Régimen
      if (
        watchRegimen &&
        !watchRegimen.toString().toLowerCase().match(palabra_coincidencia)
      ) {
        campos_encontrados.push("Régimen");
      }

      // Campo Tipo Régimen
      if (
        watchTipoRegimen &&
        !watchTipoRegimen.toString().toLowerCase().match(palabra_coincidencia)
      ) {
        campos_encontrados.push("Tipo Régimen");
      }

      // Campo Concepto (Servicio)
      // if (watchConcepto && selectConcepto) {
      //   const conceptoSeleccionado = selectConcepto.find(
      //     (item) => item.value == watchConcepto
      //   );
      //   if (
      //     conceptoSeleccionado &&
      //     !conceptoSeleccionado.label
      //       ?.toString()
      //       .toLowerCase()
      //       .match(palabra_coincidencia)
      //   ) {
      //     campos_encontrados.push("Concepto (Servicio)");
      //   }
      // }

      setCamposErrorRegimen(campos_encontrados);
    }
  }, [convenio, watchRegimen, watchTipoRegimen, watchConcepto, selectConcepto]);

  useEffect(() => {
    if (watchRegimenID && tiposRegimen && cuotasModeradoras) {
      if (hasFuente) {
        setSelectTipoRegimen(
          tiposRegimen.map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }))
        );
        return;
      }

      const regimen = cuotasModeradoras.find(
        (item) => item.id.toString() == watchRegimenID
      );
      if (regimen) {
        const options = tiposRegimen
          .filter((item) =>
            JSON.parse(regimen.tipo_regimen).includes(item.id.toString())
          )
          .map((item) => ({
            value: item.id.toString(),
            label: item.nombre,
          }));
        setSelectTipoRegimen(options);
      } else {
        setSelectTipoRegimen([]);
      }
    }
  }, [watchRegimenID, tiposRegimen, cuotasModeradoras, hasFuente, paciente]);

  const modalAutorizacion = () => {
    if (paciente && watchCuotaModeradora) {
      modal.confirm({
        title: "¿Autoriza el envío de la factura al correo electrónico?",
        okButtonProps: { type: "primary" },
        okText: "Sí",
        cancelButtonProps: { type: "primary", danger: true },
        cancelText: "No",
        keyboard: false,
        onCancel: () => {
          setAutorizacionEnvioCorreo(true);
          control.setValue("autoriza_envio", "0");
          notificationApi.info({
            message:
              "Si el paciente no aceptó que se envíe la factura electrónica, se debe dejar una observación.",
          });
          modal.info({
            title: "Observación de no envío de factura electrónica",
            footer: [],
            keyboard: false,
            width: 700,
            content: (
              <Form
                layout="vertical"
                onFinish={controlObservacion.handleSubmit((data: any) => {
                  if (paciente) {
                    control.setValue("observacion_no_aut", data.observacion);
                    Modal.destroyAll();
                  }
                })}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} style={{ marginBottom: 10 }}>
                    <Controller
                      name="observacion"
                      control={controlObservacion.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Observacion es obligatorio",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem>
                          <TextArea
                            {...field}
                            autoSize={{ minRows: 4, maxRows: 5 }}
                            placeholder="Observación"
                            status={error && "error"}
                            maxLength={255}
                            showCount
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button
                      type="primary"
                      danger
                      block
                      onClick={() => {
                        Modal.destroyAll();
                        modalAutorizacion();
                      }}
                    >
                      Cancelar
                    </Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button type="primary" block htmlType="submit">
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            ),
          });
        },
        onOk: () => {
          setAutorizacionEnvioCorreo(true);
          control.setValue("autoriza_envio", "1");
          if (["", null].includes(paciente.correo)) {
            notificationApi.error({
              message:
                "El paciente no tiene un correo electrónico registrado, por favor registrarlo.",
            });
            modal.info({
              title: "Actualizar correo del paciente",
              footer: [],
              keyboard: false,
              content: (
                <Form
                  layout="vertical"
                  onFinish={controlCorreo.handleSubmit((data: any) => {
                    if (paciente) {
                      updatePaciente(
                        {
                          ...paciente,
                          correo: data.correo,
                          eps: paciente.eps_id,
                        },
                        paciente.id
                      )
                        .then(() => {
                          notificationApi.success({
                            message: "Correo actualizado con éxito!",
                          });
                          Modal.destroyAll();
                          setAutorizacionEnvioCorreo(true);
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
                                notificationApi.error({
                                  type: "error",
                                  message: error,
                                });
                              }
                            } else {
                              if (response.data.code == "23000") {
                                notificationApi.error({
                                  type: "error",
                                  message:
                                    "Ya existe un paciente con esta combinación de tipo y número de documento",
                                });
                              } else {
                                notificationApi.error({
                                  type: "error",
                                  message: response.data.message,
                                });
                              }
                            }
                          }
                        );
                    }
                  })}
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24}>
                      <Controller
                        name="correo"
                        control={controlCorreo.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Correo Electrónico es obligatorio",
                          },
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Ingrese un correo válido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label="Correo Electrónico:">
                            <Input
                              {...field}
                              placeholder="Correo Electrónico"
                              status={error && "error"}
                              maxLength={60}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button
                        type="primary"
                        danger
                        block
                        onClick={() => {
                          Modal.destroyAll();
                          modalAutorizacion();
                        }}
                      >
                        Cancelar
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button type="primary" block htmlType="submit">
                        Guardar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ),
            });
            return;
          }
        },
      });
    }
  };

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const [agravado, setAgravado] = useState<any>();

  const generarPDF = (
    dispensacion_id: any,
    pendiente: any,
    pdfPend: boolean
  ) => {
    getDispensacionPdf(dispensacion_id.toString())
      .then((data) => {
        const file = new Blob([data.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .finally(() => {
        handleAdditionalConfirmation(pendiente, pdfPend);
      });
  };

  const generarPDFPendiente = (pen_id: any) => {
    getPendientePdf(pen_id.toString()).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  const generarTirillaPDF = (dispensacion_id: any) => {
    getDispensacionTirillaPdf(dispensacion_id.toString()).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  const onCreateMedico = (data: any) => {
    data = transformToUpperCase(data, [
      "nombre_primero",
      "nombre_segundo",
      "apellido_primero",
      "apellido_segundo",
      "entidad",
    ]);
    setLoaderMedico(true);
    if (medico) {
      updateMedico(data, medico.id)
        .then(({ data: { data } }) => {
          message.open({
            type: "success",
            content: "Medico actualizado con exito!",
          });
          setMedico(data);
          control.setValue("medico_id", data.id.toString());
          const nombre_completo = `${data.nombre_primero} ${
            data.nombre_segundo ? data.nombre_segundo + " " : ""
          }${data.apellido_primero}${
            data.apellido_segundo ? " " + data.apellido_segundo : ""
          }`;
          control.setValue("nombre_medico", nombre_completo);
          setAddEditModalMedicoVisible(false);
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
        .finally(() => setLoaderMedico(false));
    } else {
      crearMedico(data)
        .then(({ data: { data } }) => {
          message.open({
            type: "success",
            content: "Medico se creó exitosamente.",
          });
          setMedico(data);
          control.setValue("medico_id", data.id.toString());
          const nombre_completo = `${data.nombre_primero} ${
            data.nombre_segundo ? data.nombre_segundo + " " : ""
          }${data.apellido_primero}${
            data.apellido_segundo ? " " + data.apellido_segundo : ""
          }`;
          control.setValue("nombre_medico", nombre_completo);
          setAddEditModalMedicoVisible(false);
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
        .finally(() => setLoaderMedico(false));
    }
  };

  const dispensarPaciente = () => {
    if (paciente) {
      setSelectEntidad([
        { label: paciente.eps.entidad, value: paciente.eps.id.toString() },
      ]);
      control.setValue("paciente_id", paciente.id.toString());
      const nombre_completo = `${paciente.nombre_primero} ${
        paciente.nombre_segundo ? paciente.nombre_segundo + " " : ""
      }${paciente.apellido_primero}${
        paciente.apellido_segundo ? " " + paciente.apellido_segundo : ""
      }`;
      control.setValue("nombre_completo", nombre_completo);
      control.setValue("entidad", paciente.eps_id);
      control.setValue("regimen", paciente.cuotasmoderadoras.regimen);
      control.setValue(
        "tipo_regimen",
        paciente.tipo_regimen ? paciente.tipo_regimen.nombre : ""
      );
      control.setValue("categoria", paciente.cuotasmoderadoras.categoria);
      if (control.getValues("cuota_moderadora") == "NO") {
        control.setValue("valor", 0);
      } else {
        control.setValue("valor", parseFloat(paciente.cuotasmoderadoras.valor));
      }
      closeDispensacionModal();
    }
  };

  // Medico
  const handleOpenAddEditModalMedico = () => {
    if (medico) {
      controlMedico.setValue("tipo_identificacion", medico.tipo_identificacion);
      controlMedico.setValue(
        "numero_identificacion",
        medico.numero_identificacion
      );
      controlMedico.setValue("nombre_primero", medico.nombre_primero);
      controlMedico.setValue("nombre_segundo", medico.nombre_segundo);
      controlMedico.setValue("apellido_primero", medico.apellido_primero);
      controlMedico.setValue("apellido_segundo", medico.apellido_segundo);
      controlMedico.setValue("entidad", medico.entidad);
    } else {
      editMedicoForm.resetFields();
    }
    setAddEditModalMedicoVisible(true);
    // function empty
  };

  const openDispensacionModal = () => {
    setModalDispensacionVisible(true);
  };

  const closeDispensacionModal = () => {
    setModalDispensacionVisible(false);
  };

  const checkCoincidenciasPaciente = (event: any) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      setLoaderUser(true);
      getCoincidenciasNumeroId(query).then(({ data: { data } }) => {
        if (data.length == 1) {
          setPaciente(data[0]);
          handleSearchUser(
            { target: { value: query } },
            data[0].tipo_identificacion
          );
        } else if (data.length == 0) {
          setOpenModalPaciente(true);
          message.info("Paciente no existe, por favor registrarlo");
          setLoaderUser(false);
        } else {
          setOpenModalPacientes(true);
          setPacientes(data);
          setLoaderUser(false);
        }
      });
    }
  };

  const handleSearchUser = (event: any, tipo_documento: string) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      if (![undefined, ""].includes(tipo_documento)) {
        setLoaderUser(true);
        timeout = setTimeout(() => {
          let alert = false;
          if (query != paciente?.numero_identificacion) {
            alert = true;
          }
          searchPacientes(query, tipo_documento)
            .then(
              ({
                data: { data, pendiente, alerta_autorizacion_redladera },
              }) => {
                setAlertaAutorizacionRedLadera(alerta_autorizacion_redladera);
                setLoader(false);
                if (
                  data &&
                  data.dispensaciones_30 &&
                  data.dispensaciones_30.length > 0 &&
                  alert &&
                  !hasFuente
                ) {
                  if (data.dispensaciones_30.length > 0) {
                    setPaciente(data);
                    if (
                      data.dispensaciones_30 &&
                      data.dispensaciones_30.length > 0
                    ) {
                      const detalleDispensacion: DataTypeDispensaciones[] = [];
                      data.dispensaciones_30.forEach((cabecera) => {
                        cabecera.detalle.forEach((item) => {
                          detalleDispensacion.push({
                            key: item.id + item.producto.descripcion,
                            fecha_dispensacion: dayjs(
                              cabecera.created_at
                            ).format("DD-MM-YYYY HH:mm"),
                            consecutivo: cabecera.consecutivo,
                            observaciones: cabecera.observacion,
                            desc_producto: item.producto.descripcion,
                            cant_entregada: parseInt(item.cantidad_entregada),
                            cant_solicitada: parseInt(item.cantidad_solicitada),
                            cant_saldo: parseInt(item.cantidad_saldo),
                            bodega: cabecera.bodegas.bod_nombre,
                          });
                        });
                      });
                      setDispensacionPaciente(detalleDispensacion);
                      setDispensacionPacienteInitial(detalleDispensacion);
                    }
                    if (
                      pendiente?.pendientes_30 &&
                      pendiente?.pendientes_30.length > 0
                    ) {
                      const detallePendiente: DataTypePendientes[] = [];
                      pendiente.pendientes_30.forEach((cabecera) => {
                        cabecera.detalle.forEach((item) => {
                          detallePendiente.push({
                            key: item.id + item.producto.descripcion,
                            fecha_pendiente: dayjs(item.created_at).format(
                              "DD-MM-YYYY HH:mm"
                            ),
                            consecutivo: cabecera.consecutivo,
                            observaciones: cabecera.observacion,
                            dispensacion: cabecera.dispensacion
                              ? cabecera.dispensacion.consecutivo
                              : "",
                            desc_producto: item.producto.descripcion,
                            cant_entregada: parseInt(item.cantidad_entregada),
                            cant_solicitada: parseInt(item.cantidad_solicitada),
                            cant_saldo: parseInt(item.cantidad_saldo),
                            bodega: cabecera.bodegas.bod_nombre,
                          });
                        });
                      });
                      setPendientePaciente(detallePendiente);
                      setPendientePacienteInitial(detallePendiente);
                    }
                    // setModalDispensacionVisible(true)
                    openDispensacionModal();
                  }
                } else {
                  if (data) {
                    // mostrar una modal aqui pintando el arreglo de
                    setPaciente(data);
                    control.setValue("paciente_id", data.id.toString());
                    const nombre_completo = `${data.nombre_primero} ${
                      data.nombre_segundo ? data.nombre_segundo + " " : ""
                    }${data.apellido_primero}${
                      data.apellido_segundo ? " " + data.apellido_segundo : ""
                    }`;
                    control.setValue("nombre_completo", nombre_completo);
                    control.setValue("entidad", data.eps.entidad);
                    control.setValue("regimen", data.cuotasmoderadoras.regimen);
                    control.setValue(
                      "tipo_regimen",
                      data.tipo_regimen ? data.tipo_regimen.nombre : ""
                    );
                    control.setValue(
                      "categoria",
                      data.cuotasmoderadoras.categoria
                    );
                    if (control.getValues("cuota_moderadora") == "NO") {
                      control.setValue("valor", 0);
                    } else {
                      control.setValue(
                        "valor",
                        parseFloat(data.cuotasmoderadoras.valor)
                      );
                    }
                  } else {
                    setPaciente(undefined);
                    control.setValue("nombre_completo", "");
                    message.info("Paciente no existe, por favor registrarlo");
                    setOpenModalPaciente(true);
                  }
                }
              }
            )
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
                setLoader(false);
                clearValues();
              }
            )
            .finally(() => setLoaderUser(false));
        }, 400);
      } else {
        notificationApi.open({
          type: "warning",
          message: "No se ha seleccionado tipo de documento del paciente",
        });
      }
    } else {
      // setPacientes([]);
      // setSelectPaciente([]);
      // setDispensaciones([]);
    }
  };

  const handleSearchMedico = (event: any) => {
    const query = event.target.value.toString();
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      setLoaderMedico(true);
      timeout = setTimeout(() => {
        searchMedicos(query)
          .then(({ data: { data } }) => {
            if (data) {
              setMedico(data);
              control.setValue("medico_id", data.id.toString());
              const nombre_completo = `${data.nombre_primero} ${
                data.nombre_segundo ? data.nombre_segundo + " " : ""
              }${data.apellido_primero}${
                data.apellido_segundo ? " " + data.apellido_segundo : ""
              }`;
              control.setValue("nombre_medico", nombre_completo);
            } else {
              controlMedico.reset();
              setMedico(undefined);
              control.setValue("nombre_medico", null);
              message.info("Medico no existe, por favor registrarlo");
              setAddEditModalMedicoVisible(true);
              controlMedico.setValue(
                "numero_identificacion",
                control.getValues("numero_identificacion_m")
              );
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
              setLoader(false);
              clearValuesMedico();
            }
          )
          .finally(() => setLoaderMedico(false));
      }, 500);
    } else {
      // setPacientes([]);
      // setSelectPaciente([]);
      // setDispensaciones([]);
    }
  };

  const handleSelectConvenio = (value: number) => {
    const convenio: Convenio = convenios.find((item) => item.id == value);
    setPermisosCampos(convenio.tipo_dispensacion.campos);
    const today = dayjs().format("YYYY-MM-DD");
    const fecFin = dayjs(convenio.fec_fin).format("YYYY-MM-DD");
    const vencimiento = dayjs(fecFin).diff(today, "day");

    if (vencimiento == 0) {
      notification.open({
        type: "error",
        message: "El convenio tiene fecha de vencimiento el día de hoy.",
      });
    } else if (vencimiento <= 0) {
      notification.open({
        type: "error",
        message: `El convenio ya se encuentra vencido.`,
      });
      return;
    } else if (vencimiento <= 8) {
      notification.open({
        type: "warning",
        message: `Faltan ${vencimiento} días para que el convenio expire.`,
      });
    }

    if (convenio.estado == "0") {
      notification.open({
        type: "error",
        message: "El convenio está inactivo.",
      });
      return;
    }

    getTotalDispensaciones(convenio.id).then(({ data: { data } }) => {
      const convenioTotal = parseInt(convenio.valor_total);
      const porcentajeEjecucion = 0.8;
      const dispensacionTotal = parseInt(data.total_sum);

      const limiteConvenio = convenioTotal * porcentajeEjecucion;

      if (dispensacionTotal >= convenioTotal) {
        notification.open({
          type: "error",
          message: "El convenio se ejecuto en su totalidad.",
        });
        setConvenioSeleccionado(false);
        return;
      } else if (dispensacionTotal >= limiteConvenio) {
        notification.open({
          type: "warning",
          message:
            "El convenio se encuentra ejecutado en un 80% o mas de su totalidad.",
        });
      }
    });

    setListPrice(convenio.id_listapre);
    const agrav = convenio.iva;
    setAgravado(agrav); // 1 es SI; 0 es NO;

    control.setValue("descripcion_convenio", convenio.descripcion);
    const cuotaModeradora = convenio.cuota_mod == "1" ? "SI" : "NO";
    control.setValue("cuota_moderadora", cuotaModeradora);

    control.setValue("concepto_id", undefined);
    control.setValue("tipo_consulta", undefined);

    setSelectConcepto(
      convenio.conceptosArray.map((concepto: any) => {
        return { value: concepto.id, label: concepto.nombre };
      })
    );

    setSelectTipoConsulta(
      convenio.tipo_consulArray.map((tipo_consul: any) => {
        return { value: tipo_consul.id, label: tipo_consul.nombre };
      })
    );

    setConvenio(convenio);
    if (convenio.aut_cabecera != "1") {
      setConvenioSeleccionado(true);
    } else {
      setConvenioSeleccionado(true);
    }
    if (convenio.aut_detalle != "1") {
      setConvenioSeleccionado(true);
      setAutDet(false);
      if (convenios.length > 1) {
        setDataSource(
          dataSource.map((item) => {
            delete item.autDet;
            return item;
          })
        );
      }
    } else {
      setConvenioSeleccionado(true);
      setAutDet(true);
    }
  };

  const handleSearchDiagnostico = (
    event: any,
    tipo_diagnostico = "principal"
  ) => {
    const query = event.target.value.toString().toUpperCase();
    // setSelectDiagnostico([]);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        setLoaderDiagnostico(true);
        searchDiagnostico(query)
          .then(({ data: { data } }) => {
            setTipoDiagnostico(tipo_diagnostico);
            if (!Array.isArray(data) && data) {
              switch (tipo_diagnostico) {
                case "principal":
                  control.setValue("diagnostico_id", data.id);
                  control.setValue("descripcion_diagnostico", data.descripcion);
                  setDiagnostico(data);
                  break;
                case "relacionado":
                  control.setValue("diagnostico_rel_id", data.id);
                  control.setValue(
                    "descripcion_diagnostico_relacionado",
                    data.descripcion
                  );
                  setDiagnosticoRel(data);
                  break;
              }
            } else if (Array.isArray(data)) {
              switch (tipo_diagnostico) {
                case "principal":
                  if (!diagnostico) {
                    setOpenModalDiagnosticos(true);
                    setDiagnosticos(data);
                  }
                  break;
                case "relacionado":
                  if (!diagnosticoRel) {
                    setOpenModalDiagnosticos(true);
                    setDiagnosticos(data);
                  }
                  break;
              }
            } else {
              switch (tipo_diagnostico) {
                case "principal":
                  control.setValue("diagnostico_id", null);
                  control.setValue("descripcion_diagnostico", "");
                  setDiagnostico(undefined);
                  break;
                case "relacionado":
                  control.setValue("diagnostico_rel_id", null);
                  control.setValue("descripcion_diagnostico_relacionado", "");
                  setDiagnosticoRel(undefined);
                  break;
              }
              notificationApi.open({
                type: "error",
                message: "No se encuentra diagnóstico con este código",
              });
            }
          })
          .finally(() => setLoaderDiagnostico(false));
      }, 400);
    }
  };

  // Funcion para eliminar el item del detalle, es decir, del arreglo y se recalcula el subtotal y total del documento
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    control.setValue("detalle", newData);
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };

  // Funcion para realizar el cambio de texto a input en la tabla de detalle, ya sea en cantidades o en el valor
  const handleChangeEdit = (key: React.Key, origen: string) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (origen) {
        case "cantSol":
          target.editable = true; // Hacer el campo editable
          break;
        case "cantidad":
          target.editablePrecio = true; // Hacer el campo cantidad
          break;
      }
      setDataSource(newData);
      setSelectRows(newData);
    }
  };

  const calcularIva = (
    cantidad: any,
    precio_lista: any,
    valorIva: any,
    agravado: any
  ) => {
    let suma = 0;
    if (agravado === 1 || agravado === "1") {
      suma = cantidad * precio_lista * (valorIva / 100);
    }
    return suma;
  };

  const calcularTotal = (cantidad: any, precio_lista: any, valorIva: any) => {
    const sumaTotal =
      cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100);
    setTotal(sumaTotal);
    return cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100);
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      dis_id: id,
      accion: accion,
    };
    anularDis(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
        });
        setTimeout(() => {
          navigate(-1);
        }, 800);
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

          setLoader(false);
        }
      );
  };

  // Función para mostrar un mensaje de error usando Ant Design's message
  const showError = (error: string) => {
    message.error(error);
    // Hacer focus en el input cuando se muestre el mensaje de error
  };

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    const duplicateProducts: DataType[] = [];
    productos.forEach((producto) => {
      const existingProduct = selectedProducts.find(
        (p) =>
          p.id === producto.id &&
          p.lote === producto.lote &&
          p.fvence === producto.fvence
      );

      if (existingProduct && user && user.has_fuentes == "0") {
        duplicateProducts.push(producto);
      } else {
        let iva = producto.iva;
        if (!["show"].includes(accion)) {
          iva = calcularIva(
            producto.cantidad,
            producto.precio_lista,
            producto.iva,
            1
          );
        }
        const subtotal = producto.cantidad * producto.precio_lista;
        const total = calcularTotal(
          producto.cantidad,
          producto.precio_lista,
          producto.iva
        );
        const precio = producto.precio_lista;
        data.push({
          ...producto,
          iva,
          precio_subtotal: subtotal,
          precio_total: total,
          precio,
        });
      }
    });

    if (user && user.has_fuentes == "0") {
      if (duplicateProducts.length > 0) {
        notification.open({
          type: "warning",
          message: (
            <div>
              El/los siguiente(s) producto(s) ya se encuentra(n) en el detalle:{" "}
              <br />
              {duplicateProducts
                .map((producto) => `${producto.key} / ${producto.descripcion}`)
                .join(", ")}
            </div>
          ),
        });
        return;
      }
    }

    setDataSource((prevDataSource) => {
      const newData = prevDataSource.concat(data);
      return newData;
    });

    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = [...prevSelectedProducts, ...productos];
      return newSelectedProducts;
    });
    control.setValue("detalle", selectedProducts.concat(productos));
  };

  const calcularTotalAcumulado = () => {
    const totalAcumulado = dataSource.reduce((total, producto) => {
      const precioTotal = producto.precio_total;
      return isNaN(precioTotal) ? total : total + precioTotal;
    }, 0);

    return `${totalAcumulado.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`; // Redondear a dos decimales si es necesario
  };

  // Estilo para tamaño de texto en columnas
  const descripcionStyles = {
    fontSize: "12px",
  };

  const clearValues = () => {
    control.setValue("paciente_id", "");
    form.setFieldValue("nombre_completo", null);
    form.setFieldValue("regimen", null);
    form.setFieldValue("tipo_regimen", null);
    form.setFieldValue("categoria", null);
    form.setFieldValue("valor", null);
    form.setFieldValue("entidad", null);
    control.setValue("nombre_completo", null);
    control.setValue("regimen", null);
    control.setValue("tipo_regimen", null);
    control.setValue("categoria", null);
    control.setValue("valor", null);
    control.setValue("entidad", null);
    setPaciente(undefined);
    setAlertaAutorizacionRedLadera(false);
    setAutorizacionEnvioCorreo(false);
    controlCorreo.reset();
    controlObservacion.reset();
  };

  const clearForm = () => {
    control.reset();
    controlCorreo.reset();
    controlObservacion.reset();
    setAutorizacionEnvioCorreo(false);
    control.setValue("tipo_documento_id", tipoDocumentoInfo?.id);
    setDataSource([]);
    setSelectedProducts([]);
    setConvenioSeleccionado(false);
    form.resetFields();
    setPaciente(undefined);
    setAlertaAutorizacionRedLadera(false);
    setMedico(undefined);
    setDiagnostico(undefined);
    setDispensacionPaciente([]);
    setDispensacionPacienteInitial([]);
    setPendientePaciente([]);
    setPendientePacienteInitial([]);
    setDisableButton(false);
    setIsEditing(false);
    setPacienteIsEnable(false);
    setFileList([]);
    setDetalleProcesado(false);
    setModalDispensacionVisible(false);
    setDisabledConvenio(false);
    if (convenios.length == 1) {
      handleSelectConvenio(convenios[0].id);
      control.setValue("convenio_id", convenios[0].id);
    }
  };

  const clearValuesMedico = () => {
    control.setValue("medico_id", "");
    control.setValue("nombre_medico", "");
    form.setFieldValue("nombre_completo_m", null);
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish: SubmitHandler<any> = async (data: any) => {
    setLoader(true);
    setDisableButton(true);
    data = transformToUpperCase(data, ["observacion"]);
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);

    data.detalle.forEach((medicamento: any) => {
      if (!medicamento.hasOwnProperty("cantSol")) {
        medicamento.cantSol = dataCantSol; // Puedes inicializarlo con null u otro valor según tu lógica
      }

      const key = medicamento.key;
      const record = dataSource.find((producto) => producto.key === key);
      if (record) {
        medicamento.cantSol = record.cantSol; // Usar el valor de cant_sol de dataSource
      }
      //medicamento.cantSol = dataCantSol;
    });

    if (
      permisosCampos.find(
        ({ campo_dispensacion: { clave }, obligatoriedad }) =>
          clave == "cantidad_solicitada" && obligatoriedad != "oculto"
      )
    ) {
      // Valida si la columna de Autorización Detalle está habilitada
      if (autDet) {
        const isAutDetFieldEmpty = data.detalle.some(
          (medicamento: DataType) => !medicamento.autDet?.trim()
        );
        if (isAutDetFieldEmpty) {
          showError(
            'El campo "ID del Ciclo" debe ser llenado en todas las filas.'
          );
          setLoader(false);
          return; // Detener el proceso de guardar
        }
      }
    }

    data.bodega_id = getSessionVariable(KEY_BODEGA);
    data.empresa = getSessionVariable(KEY_EMPRESA);
    data.total = total;
    // if (paciente) {
    //   data.regimen_id = paciente.cuota_moderadora_id;
    //   data.tipo_regimen_id = paciente.tipo_regimen_id;
    // }

    data.ivaConv = agravado;

    if (accion === "edit") {
      updateDIS(data, id)
        .then(() => {
          message.open({
            type: "success",
            content: "Documento actualizado exitosamente!",
          });
          setTimeout(() => {
            navigate("..");
          }, 800);
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
            setLoader(false);
            setDisableButton(false);
          }
        );
    } else if (accion === "create") {
      data.detalle.forEach((medicamento: DataType) => {
        if (!medicamento.hasOwnProperty("cantSol")) {
          medicamento.cantSol = dataCantSol;
        }

        const key = medicamento.key;
        const record = dataSource.find((producto) => producto.key === key);
        if (record) {
          medicamento.cantSol = record.cantSol;
        }
      });
      if (
        permisosCampos.find(
          ({ campo_dispensacion: { clave }, obligatoriedad }) =>
            clave == "cantidad_solicitada" && obligatoriedad != "oculto"
        )
      ) {
        if (autDet) {
          const isAutDetFieldEmpty = data.detalle.some(
            (medicamento: DataType) => !medicamento.autDet?.trim()
          );
          if (isAutDetFieldEmpty) {
            showError(
              'El campo "Id del Ciclo" debe ser llenado en todas las filas.'
            );
            setLoader(false);
            return;
          }
        }

        const isCantSolFieldEmpty = data.detalle.some(
          (medicamento: DataType) => {
            const cantSolValue =
              medicamento.cantSol != null ? medicamento.cantSol.toString() : "";
            return (
              typeof cantSolValue !== "string" || cantSolValue.trim() === ""
            );
          }
        );

        if (isCantSolFieldEmpty) {
          showError(
            'El campo "Cant. Solicitada" debe ser llenado en todas las filas.'
          );
          setLoader(false);
          return;
        }
      }

      data.bodega_id = getSessionVariable(KEY_BODEGA);
      data.empresa = getSessionVariable(KEY_EMPRESA);

      if (
        permisosCampos.find(
          ({ campo_dispensacion: { clave }, obligatoriedad }) =>
            clave == "id_fuente" && obligatoriedad == "oculto"
        )
      ) {
        data.id_fuente = null;
      }
      if (
        permisosCampos.find(
          ({ campo_dispensacion: { clave }, obligatoriedad }) =>
            clave == "numero_servinte" && obligatoriedad == "oculto"
        )
      ) {
        data.numero_servinte = null;
      }
      if (
        permisosCampos.find(
          ({ campo_dispensacion: { clave }, obligatoriedad }) =>
            clave == "numero_fuente" && obligatoriedad == "oculto"
        )
      ) {
        data.numero_fuente = null;
      }

      data.observacion_no_aut = controlObservacion.getValues("observacion");
      data = transformToUpperCase(data, ["observacion"]);

      const formData = new FormData();

      fileList.forEach((file: any) => {
        formData.append("files[]", file?.originFileObj);
      });
      const additionalData = { ...data };

      formData.append("additionalData", JSON.stringify(additionalData));

      crearDispensacion(formData)
        .then(({ data: { data, pendiente } }) => {
          const message = `La dispensación con ID ${data[0]?.consecutivo} se creó exitosamente.`;
          notificationApi.open({
            type: "success",
            message: message,
          });
          const dispensacion_id = data[0]?.id;
          const valor_cuota = parseFloat(data[0].valor);

          if (valor_cuota > 0) {
            generarTirillaPDF(dispensacion_id);
          }

          modal.confirm({
            icon: <QuestionCircleOutlined />,
            cancelText: "No",
            cancelButtonProps: { danger: true, type: "primary" },
            content: (
              <div style={{ textAlign: "center" }}>
                ¿Desea imprimir{" "}
                {!pendiente
                  ? "la dispensación"
                  : "la dispensación y el pendiente generado"}
                ?
              </div>
            ),
            okButtonProps: {
              type: "primary",
              style: { background: "#f9af11", borderColor: "#f9af11" },
            },
            okText: "Sí",
            onOk() {
              generarPDF(dispensacion_id, pendiente, true);
              handleAdditionalConfirmation(pendiente, pendiente ? true : false);
            },
            onCancel() {
              handleAdditionalConfirmation(pendiente, false);
            },
          });
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (response.data.productos_dispensados) {
              modal.info({
                title: "Productos que no permiten realizar la dispensacion",
                width: 700,
                okText: "Confirmar",
                content: (
                  <>
                    <Table
                      size="small"
                      dataSource={response.data.productos_dispensados}
                      columns={[
                        {
                          title: "Descripción",
                          key: "descripcion",
                          dataIndex: "descripcion",
                        },
                      ]}
                      pagination={{ pageSize: 100, hideOnSinglePage: true }}
                    />
                  </>
                ),
              });
            }
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
            setLoader(false);
          }
        )
        .finally(() => {
          setDisableButton(false);
          setLoader(false);
        });
    }
  };

  const handleAdditionalConfirmation = (pendiente: any, pdfPend: boolean) => {
    if (pendiente) {
      if (pdfPend) {
        generarPDFPendiente(pendiente?.id);
      }
      modal.confirm({
        icon: <QuestionCircleOutlined />,
        cancelText: "No",
        okText: "Sí",
        content: (
          <div style={{ textAlign: "center" }}>
            ¿Desea agregar más pendientes?
          </div>
        ),
        cancelButtonProps: { danger: true },
        onOk() {
          // Redirigir a la pantalla de pendientes
          setLoader(true);
          setTimeout(() => {
            navigate(`/documentos/salidas/pen/edit/${pendiente?.id}`);
          }, 2500);
        },
        onCancel() {
          navigate(location.pathname);
          clearForm();
        },
      });
    } else {
      setTimeout(() => {
        clearForm();
        navigate(`/documentos/ventas/dis/create`);
      }, 500);
    }
  };

  const handleChangeState = () => {
    setLoader(true);
    actualizarEstados([id ? id : ""], control.getValues("estado_auditoria"))
      .then(({ data: { message } }) => {
        notificationApi.open({
          type: "success",
          message: message,
        });
        setTimeout(() => {
          navigate("../..", { relative: "path" });
        }, 800);
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
      .finally(() => setLoader(false));
  };

  const getColumnSearchProps = (
    dataIndex: keyof DataType
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) =>
      hasFuente ? (
        <SearchOutlined
          style={{ color: filtered ? "#1677ff" : "#f0a81d", fontSize: 15 }}
        />
      ) : null,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 100,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 100,
      hidden: !hasFuente,
      ...getColumnSearchProps("codigo_servinte"),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      fixed: "left",
      width: 250,
      ...getColumnSearchProps("descripcion"),
      render: (_, record) => {
        return (
          <>
            <Space>
              <Text style={descripcionStyles}>{record.descripcion}</Text>
            </Space>
          </>
        );
      },
    },
    {
      title: "Días Tratamiento",
      dataIndex: "dias_tratamiento",
      key: "dias_tratamiento",
      align: "center",
      width: 100,
      hidden:
        firstView && !hasFuente
          ? false
          : permisosCampos
          ? permisosCampos.find(
              ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                clave == "dias_tratamiento" && obligatoriedad != "oculto"
            )
            ? false
            : true
          : true,
      render: (_, { dias_tratamiento, editable, key }) => {
        return (
          <>
            <InputNumber
              min={0}
              size="small"
              maxLength={4}
              controls={false}
              defaultValue={dias_tratamiento}
              disabled={
                (!convenioSeleccionado && editable === true) ||
                !["create"].includes(accion)
              }
              style={{ width: "100%" }}
              onChange={(value: any) => {
                if (value) {
                  const data = dataSource.map((item) => {
                    if (item.key == key) {
                      return { ...item, dias_tratamiento: value };
                    } else {
                      return item;
                    }
                  });
                  setDataSource(data);
                  control.setValue("detalle", data);
                } else {
                  const data = dataSource.map((item) => {
                    if (item.key == key) {
                      return { ...item, dias_tratamiento: 0 };
                    } else {
                      return item;
                    }
                  });
                  setDataSource(data);
                  control.setValue("detalle", data);
                }
              }}
            />
          </>
        );
      },
    },
    {
      title: "Cant. Solicitada",
      dataIndex: "cantSol",
      key: "cantSol",
      align: "center",
      width: 100,
      hidden:
        firstView && !hasFuente
          ? false
          : permisosCampos
          ? permisosCampos.find(
              ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                clave == "cantidad_solicitada" && obligatoriedad != "oculto"
            )
            ? false
            : true
          : true,
      render: (_, record) => {
        return (
          <>
            <Space>
              <>
                <InputNumber
                  maxLength={4}
                  autoFocus
                  size="small"
                  disabled={
                    (!convenioSeleccionado && record.editable === true) ||
                    !["create"].includes(accion)
                  }
                  max={record.maxCantidad}
                  min={0}
                  style={{ width: "100%" }}
                  onBlur={(e) => {
                    handleChangeEdit(record.id, "cantSol");
                    const newData = [...dataSource];
                    const target = newData.find(
                      (item) => item.key === record.key
                    );
                    if (target) {
                      const cantidadSolicitada = parseInt(e.target.value);
                      const cantidadEntregada = record.cantidad;

                      if (cantidadSolicitada < cantidadEntregada) {
                        message.warning(
                          "La cantidad solicitada no debe ser menor que la cantidad entregada.",
                          3
                        );
                        setDisableButton(true);
                      } else {
                        setDisableButton(false);
                      }
                    }
                  }}
                  onChange={(e: any) => {
                    handleChangeAmount(e, record.key);
                    if (e) {
                      const cantidadSolicitada = parseInt(e);
                      const cantidadEntregada = record.cantidad;

                      if (cantidadSolicitada < cantidadEntregada) {
                        message.warning(
                          "La cantidad solicitada no debe ser menor que la cantidad entregada.",
                          3
                        );
                        setDisableButton(true);
                      } else {
                        setDisableButton(false);
                      }
                    }
                    setDataCantSol(e);
                  }}
                  defaultValue={record.cantSol}
                />
              </>
            </Space>
          </>
        );
      },
    },
    {
      title: "Cant. Entregada",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 100,
      render: (_, record) => {
        return (
          <Space direction="vertical">
            {["create"].includes(accion) ? (
              <>
                <Text>{record.cantidad}</Text>
                <Text type="success" style={{ fontSize: 11 }}>
                  Stock: {record.stock}
                </Text>
              </>
            ) : (
              <Text>{record.cantidad}</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "ID del ciclo",
      dataIndex: "autDet",
      key: "autDet",
      align: "center",
      width: 130,
      render: () => {
        if (autDet) {
          return (
            <Input
              name="autDet"
              placeholder="ID del Ciclo"
              disabled={!["create"].includes(accion)}
            />
          );
        } else {
          // Si autDet es false, no se muestra nada
          return null;
        }
      },
    },
    {
      title: "Vence",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      width: 100, // Reducir el ancho de esta columna
      ...getColumnSearchProps("fvence"),
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 100, // Reducir el ancho de esta columnafvencefvence
      ...getColumnSearchProps("lote"),
    },
    {
      title: "Precio",
      dataIndex: "precio_lista",
      key: "precio_lista",
      align: "center",
      width: 100, // Reducir el ancho de esta columna
      hidden: !["administrador"].includes(user_rol),
      render: (_, record) => {
        if (!isNaN(record.precio_lista)) {
          return (
            <>
              <Text style={descripcionStyles}>
                $
                {record.precio_lista.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </>
          );
        }
        return "-";
      },
    },
    {
      title: "SubTotal",
      dataIndex: "precio_subtotal",
      key: "precio_subtotal",
      width: 110, // Reducir el ancho de esta columna
      align: "center",
      hidden: !["administrador"].includes(user_rol),
      render: (_, record) => {
        // Obtener el valor del subtotal desde el registro actual
        // Verificar si es un número válido
        if (!isNaN(record.precio_subtotal)) {
          // Formatear el valor con el signo "$" usando toLocaleString()
          return `$${record.precio_subtotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        // Si no es un número válido, mostrar un guion
        return "-";
      },
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva",
      width: 90, // Reducir el ancho de esta columna
      align: "center",
      hidden: !["administrador"].includes(user_rol),
      render: (value) => {
        return `${value} %`;
      },
    },
    {
      title: "Total",
      dataIndex: "precio_total",
      key: "precio_total",
      width: 100, // Reducir el ancho de esta columna
      align: "center",
      hidden: !["administrador"].includes(user_rol),
      render: (_, record) => {
        if (!isNaN(record.precio_total)) {
          return `$${record.precio_total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return "-";
      },
    },
  ];
  if (["create"].includes(accion)) {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        if (["create"].includes(accion)) {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                disabled={!convenioSeleccionado} // Deshabilita si no hay convenio seleccionado o no se puede eliminar
              />
            </Tooltip>
          );
        }

        return null; // No se muestra la columna si no se cumple la condición
      },
      width: 80, // Reducir el ancho de esta columna
    });
  }

  if (["show", "anular"].includes(accion)) {
    columns.splice(2, 0, {
      title: "Cod Mipres",
      dataIndex: "cod_mipres",
      key: "cod_mipres",
      align: "center",
      fixed: "left",
      width: 100,
    });
  }

  const filteredColumns: ColumnsType<DataType> = columns.filter(
    (col: any) => autDet || col.key !== "autDet"
  );

  const modifiedColumns = filteredColumns.map((col: any) => {
    if (col.key === "autDet") {
      return {
        ...col,
        render: (_: any, record: any) => (
          <Input
            name="autDet"
            ref={(inputRef: any) =>
              (autDetInputRef.current[record.key] = inputRef)
            }
            disabled={!convenioSeleccionado}
            placeholder="ID del Ciclo"
            maxLength={convenio ? parseInt(convenio.num_caracter_det) : 0}
            onChange={(e: any) => {
              const { value } = e.target;
              setDisableButton(false);
              setDataSource(
                dataSource.map((item) => {
                  if (item.key == record.key) {
                    return { ...item, autDet: value };
                  } else {
                    return item;
                  }
                })
              );
            }}
          />
        ),
      };
    }
    return col;
  });

  const handleChangeAmount = (e: ChangeEvent<InputProps>, key: React.Key) => {
    const currentProductId = key;
    const cant_solicitada: number = parseInt(e.toString());

    if (cant_solicitada > 0) {
      const updatedDataSource = dataSource.map((producto) => {
        if (producto.key === currentProductId) {
          return {
            ...producto,
            cantSol: e,
          };
        } else {
          return producto;
        }
      });

      setDataSource(updatedDataSource);
    } else {
      // Aqui quita el registro de acuerdo a la key, ya que no se esta ingresando cantidad y es como si lo estuviera descartando
      const newDataSelect = selectRows.filter((item) => item.key != key);
      setSelectRows(newDataSelect);
    }
  };

  const columnsTableDispensacion: ColumnsType<DataTypeDispensaciones> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      width: 300,
    },
    {
      title: "Fecha Dispensacion",
      dataIndex: "fecha_dispensacion",
      key: "fecha_dispensacion",
    },
    {
      title: "Descripción",
      dataIndex: "desc_producto",
      key: "desc_producto",
      width: 300,
    },
    {
      title: "Cantidad solicitada",
      dataIndex: "cant_solicitada",
      key: "cant_solicitada",
    },
    {
      title: "Cantidad entregada",
      dataIndex: "cant_entregada",
      key: "cant_entregada",
    },
    {
      title: "Cantidad saldo",
      dataIndex: "cant_saldo",
      key: "cant_saldo",
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 100,
    },
  ];

  const columnsTablePendiente: ColumnsType<DataTypePendientes> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      width: 300,
    },
    {
      title: "Fecha Pendiente",
      dataIndex: "fecha_pendiente",
      key: "fecha_pendiente",
    },
    {
      title: "Dispensacion",
      dataIndex: "dispensacion",
      key: "dispensacion",
    },
    {
      title: "Descripción",
      dataIndex: "desc_producto",
      key: "desc_producto",
      width: 300,
    },
    {
      title: "Cantidad solicitada",
      dataIndex: "cant_solicitada",
      key: "cant_solicitada",
    },
    {
      title: "Cantidad entregada",
      dataIndex: "cant_entregada",
      key: "cant_entregada",
    },
    {
      title: "Cantidad saldo",
      dataIndex: "cant_saldo",
      key: "cant_saldo",
    },
    {
      title: "Bodega",
      dataIndex: "bodega",
      key: "bodega",
      width: 100,
    },
  ];

  const handleEstadoChange = (value: string) => {
    setOpcionesCambio(value);
  };

  const handleSearchDispensaciones = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const filterTable = dispensacionPacienteInitial?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDispensacionPaciente(filterTable);
  };

  const handleSearchPendientes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = pendientePacienteInitial?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setPendientePaciente(filterTable);
  };

  return (
    <Spin
      spinning={loader}
      indicator={
        <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
      }
      style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
    >
      {contextHolderModal}
      {contextHolder}
      <StyledCard
        className="styled-card-documents"
        title={
          <Title level={4}>
            Dispensación{" "}
            {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
          </Title>
        }
      >
        <ModalPaciente
          open={openModalPaciente}
          setOpen={(value: boolean) => setOpenModalPaciente(value)}
          paciente={paciente}
          setPaciente={(value: Paciente) => setPaciente(value)}
          numero_identificacion={control.getValues("numero_identificacion")}
          tipo_documento={form.getFieldValue("tipo_documento")}
          hasFuente={hasFuente}
        />
        <ModalProductos
          open={openFlag}
          setOpen={(value: boolean) => setOpenFlag(value)}
          key="modalProductos"
          listPrice={listPrice}
          onSetDataSource={(productos: any[]) => handleSetDetalle(productos)}
          hasFuente={hasFuente}
        />
        <ModalPacientes
          open={openModalPacientes}
          setOpen={(value: boolean) => setOpenModalPacientes(value)}
          pacientes={pacientes}
          setPaciente={(value: Paciente | undefined) => {
            if (value != undefined) {
              setPaciente(value);
              handleSearchUser(
                { target: { value: value.numero_identificacion } },
                value.tipo_identificacion
              );
            } else {
              clearValues();
            }
          }}
        />
        <ModalDiagnosticos
          open={openModalDiagnosticos}
          setOpen={(value: boolean) => setOpenModalDiagnosticos(value)}
          diagnosticos={diagnosticos}
          setDiagnostico={(value: Diagnostico) => {
            if (tipoDiagnostico == "principal") {
              setDiagnostico(value);
              control.setValue("diagnostico_id", value.id);
            } else {
              setDiagnosticoRel(value);
              control.setValue("diagnostico_rel_id", value.id);
            }
            setOpenModalDiagnosticos(false);
          }}
        />
        <Form
          layout={"vertical"}
          form={form}
          onKeyDown={(e: any) => checkKeyDown(e)}
          onFinish={control.handleSubmit((data: any) => {
            // if (
            //   data.cuota_moderadora == "SI" &&
            //   data.valor_cuota < data.valor
            // ) {
            //   modal.confirm({
            //     title: (
            //       <Title style={{ color: "#ffffff" }} level={4}>
            //         El valor de la dispensación es inferior a la cuota
            //         moderadora sugerida
            //       </Title>
            //     ),
            //     content: (
            //       <Paragraph style={{ color: "#ffffff" }}>
            //         El valor a pagar por los medicamentos es
            //         {" $ " +
            //           parseFloat(data.valor_cuota).toLocaleString("es-CO")}
            //         , por favor validar con el paciente si acepta pagar este
            //         valor
            //       </Paragraph>
            //     ),
            //     cancelText: "No",
            //     cancelButtonProps: {
            //       ghost: true,
            //     },
            //     width: 600,
            //     icon: (
            //       <Text style={{ fontSize: "100px", marginRight: 20 }}>
            //         <WarningOutlined style={{ color: "#FFFFFF" }} />
            //       </Text>
            //     ),
            //     okText: "Si",
            //     onOk: () => {
            //       onFinish(data);
            //     },
            //     styles: {
            //       content: {
            //         border: "3px solid red",
            //         backgroundColor: "#e64e4e",
            //         color: "#FFFFFF",
            //       },
            //       mask: {
            //         backgroundColor: "#1d1d1ddb",
            //       },
            //     },
            //   });
            //   return;
            // }
            // console.log(data)
            onFinish(data);
          })}
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Row gutter={12}>
                {alertaAutorizacionRedLadera &&
                convenio &&
                ["901021565"].includes(convenio.nit) ? (
                  <Col span={24} style={{ marginBottom: 10 }}>
                    <Alert
                      message="Alerta de autorizacion"
                      description="El paciente digitado pertenece a RED LADERA, por lo tanto requiere autorización de la entidad para poder realizar la dispensación."
                      type="error"
                      showIcon
                      icon={<WarningFilled />}
                    />
                  </Col>
                ) : null}
                {camposErrorRegimen.length > 0 &&
                ["create"].includes(accion) ? (
                  <Col span={24} style={{ marginBottom: 10 }}>
                    <Alert
                      message={
                        <Title
                          style={{ color: "#ffffff", marginTop: 0 }}
                          level={4}
                        >
                          Alerta de régimen
                        </Title>
                      }
                      description={
                        <>
                          <Space direction="vertical">
                            <Text style={{ color: "#FFFFFF" }}>
                              Los siguientes campos no coinciden con el régimen
                              del convenio, por favor validar y corregir:
                            </Text>
                            {camposErrorRegimen.map((item, index) => (
                              <Text
                                key={index}
                                strong
                                style={{ color: "#FFFFFF" }}
                              >
                                • {item}
                              </Text>
                            ))}
                          </Space>
                        </>
                      }
                      type="error"
                      showIcon
                      style={{
                        border: "3px solid red",
                        backgroundColor: "#e64e4e",
                      }}
                      icon={
                        <Text
                          style={{
                            fontSize: "100px",
                            marginRight: 20,
                            marginTop: 10,
                            color: "#FFFFFF",
                          }}
                        >
                          <TbHandStop />
                        </Text>
                      }
                    />
                  </Col>
                ) : null}
                <Col xs={24} md={24} lg={12}>
                  <Controller
                    name="convenio_id"
                    control={control.control}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label={"Convenio:"}>
                        {accion === "edit" ||
                        accion === "show" ||
                        accion === "auditar" ? (
                          <Input {...field} disabled />
                        ) : (
                          <Spin
                            spinning={loaderConvenio}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              placeholder={"Buscar convenio"}
                              popupMatchSelectWidth={false}
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                              onSelect={handleSelectConvenio} // Cuando selecciono un item de las opciones se ejecuta, toma el valor de 'value'
                              notFoundContent={null}
                              options={selectTipo}
                              status={error && "error"}
                              disabled={disabledConvenio}
                            />
                          </Spin>
                        )}
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                {firstView ? (
                  <>
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "cuota_moderadora" &&
                        obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} md={12} lg={6}>
                          <Controller
                            name="cuota_moderadora"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Recaudo de moderadora:"}>
                                <Input {...field} disabled />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                ) : null}

                {firstView ? (
                  <>
                    {permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "id_fuente" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} md={8} lg={4}>
                          <Controller
                            name="id_fuente"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Fuente es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem required label={"Fuente:"}>
                                <Select
                                  {...field}
                                  options={selectFuentes}
                                  popupMatchSelectWidth={false}
                                  status={error && "error"}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                ) : null}
                {firstView ? (
                  <>
                    {permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "numero_servinte" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} md={8} lg={8}>
                          <Controller
                            name="numero_servinte"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Número de Servinte es requerido",
                              },
                              pattern: {
                                value: /^[0-9]+$/, // Valida que solo se ingresen números
                                message: "Solo se permiten números",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Número de Servinte:"}
                              >
                                <Input
                                  {...field}
                                  placeholder="Numero Servinte"
                                  value={field.value}
                                  onChange={(e) => {
                                    const onlyNums = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    field.onChange(onlyNums);
                                  }}
                                  onPressEnter={({
                                    target: { value },
                                  }: any) => {
                                    setLoader(true);
                                    checkNumeroServinte(
                                      value,
                                      control.getValues("id_fuente")
                                    )
                                      .then(() => {
                                        setLoader(false);
                                      })
                                      .catch(
                                        ({
                                          response,
                                          response: {
                                            data: { errors },
                                          },
                                        }) => {
                                          if (errors) {
                                            const errores: string[] =
                                              Object.values(errors);
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
                                          setLoader(false);
                                        }
                                      );
                                  }}
                                  status={error ? "error" : ""}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                ) : null}

                <Col xs={24} md={12} lg={6}>
                  {convenio && convenio.aut_cabecera == "1" ? (
                    <>
                      {(firstView && !hasFuente) ||
                      permisosCampos.find(
                        ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                          clave == "autorizacion_cabecera" &&
                          obligatoriedad != "oculto"
                      ) ? (
                        <>
                          <Controller
                            name="autorizacion_cabecera"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Número de cabecera es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Autorización de cabecera:"}
                                required
                              >
                                <Input
                                  {...field}
                                  status={error && "error"}
                                  onKeyDown={(e) => {
                                    if (!/^[0-9]$/.test(e.key) &&
                                    e.key != "Backspace") {
                                      e.preventDefault();
                                    }
                                  }}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </>
                      ) : null}
                    </>
                  ) : null}
                </Col>
              </Row>
              <>
                {/* Fragmento de Paciente */}
                <>
                  {(firstView && !hasFuente) ||
                  permisosCampos.find(
                    ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                      clave == "paciente" && obligatoriedad != "oculto"
                  ) ? (
                    <>
                      <Row gutter={12}>
                        <Col xs={24} md={8}>
                          <Spin
                            spinning={loaderUser}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Row gutter={[12, 12]}>
                              {["show", "anular"].includes(accion) ? (
                                <Col xs={24} md={12}>
                                  <StyledFormItem
                                    label={"Tipo Documento:"}
                                    name={"tipo_documento"}
                                    required
                                  >
                                    <Input
                                      placeholder="Tipo Documento"
                                      disabled
                                    />
                                  </StyledFormItem>
                                </Col>
                              ) : null}

                              <Col
                                xs={24}
                                md={
                                  ["show", "anular"].includes(accion) ? 12 : 24
                                }
                              >
                                <Controller
                                  name="numero_identificacion"
                                  control={control.control}
                                  rules={{
                                    required: {
                                      value: true,
                                      message:
                                        "Número de paciente es requerido",
                                    },
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <StyledFormItem
                                      label={"Documento Paciente:"}
                                      required
                                    >
                                      <Input
                                        {...field}
                                        placeholder="Digite # documento completo"
                                        allowClear
                                        onChange={(e) => {
                                          if (e.target.value == "") {
                                            clearValues();
                                            control.setValue(
                                              "numero_identificacion",
                                              ""
                                            );
                                            control.setValue("paciente_id", "");
                                            control.setValue("regimen", "");
                                            control.setValue(
                                              "tipo_regimen",
                                              ""
                                            );
                                            control.setValue("categoria", "");
                                            control.setValue("valor", 0);
                                            control.setValue("entidad", "");
                                          } else {
                                            control.setValue(
                                              "numero_identificacion",
                                              e.target.value
                                            );
                                          }
                                        }}
                                        onPressEnter={(
                                          event: React.KeyboardEvent<HTMLInputElement>
                                        ) => {
                                          clearValues();
                                          checkCoincidenciasPaciente(event);
                                        }}
                                        onKeyDown={(event: any) => {
                                          if (event.key == "Tab") {
                                            clearValues();
                                            checkCoincidenciasPaciente(event);
                                          }
                                        }}
                                        status={error && "error"}
                                        disabled={
                                          !convenioSeleccionado ||
                                          pacienteIsEnable
                                        }
                                      />
                                      <Text type="danger">
                                        {error?.message}
                                      </Text>
                                    </StyledFormItem>
                                  )}
                                />
                              </Col>
                            </Row>
                          </Spin>
                        </Col>
                        <Col xs={24} md={16}>
                          <Controller
                            name="nombre_completo"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem
                                label={"Nombre Completo Paciente:"}
                              >
                                <Space.Compact style={{ width: "100%" }}>
                                  <Input {...field} disabled />
                                  {["create", "edit"].includes(accion) ? (
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        setOpenModalPaciente(true);
                                      }}
                                      disabled={
                                        !convenioSeleccionado ||
                                        pacienteIsEnable
                                      }
                                    >
                                      {paciente ? (
                                        <EditOutlined />
                                      ) : (
                                        <PlusOutlined />
                                      )}
                                    </Button>
                                  ) : null}
                                </Space.Compact>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                      {["show", "anular"].includes(accion) ? (
                        <>
                          <Row gutter={12}>
                            <Col xs={24} md={12}>
                              <StyledFormItem
                                label={"Genero:"}
                                name={"genero_paciente"}
                              >
                                <Input disabled />
                              </StyledFormItem>
                            </Col>
                            <Col xs={24} md={12}>
                              <StyledFormItem
                                label={"Fecha Nacimiento:"}
                                name={"fecha_nacimiento_paciente"}
                              >
                                <Input disabled />
                              </StyledFormItem>
                            </Col>
                          </Row>
                        </>
                      ) : null}
                      <Row gutter={12}>
                        {"create" == accion ? (
                          <>
                            <Col xs={24} sm={8} md={8} lg={5}>
                              <Controller
                                name="regimen"
                                control={control.control}
                                render={({ field }) => (
                                  <StyledFormItem label={"Régimen:"}>
                                    <Input {...field} disabled />
                                  </StyledFormItem>
                                )}
                              />
                            </Col>
                            <Col xs={24} sm={8} md={8} lg={5}>
                              <Controller
                                name="tipo_regimen"
                                control={control.control}
                                render={({ field }) => (
                                  <StyledFormItem label={"Tipo Régimen:"}>
                                    <Input {...field} disabled />
                                  </StyledFormItem>
                                )}
                              />
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col xs={24} sm={8} md={8} lg={5}>
                              <Controller
                                name="regimen_id"
                                control={control.control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Regimen es requerido",
                                  },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                  <StyledFormItem required label="Regimen:">
                                    <Select
                                      {...field}
                                      options={selectCuotasModeradoras}
                                      popupMatchSelectWidth={false}
                                      status={error && "error"}
                                      placeholder="Regimen"
                                      disabled={!["edit"].includes(accion)}
                                    />
                                    <Text type="danger">{error?.message}</Text>
                                  </StyledFormItem>
                                )}
                              />
                            </Col>
                            <Col xs={24} sm={8} md={8} lg={5}>
                              <Controller
                                name="tipo_regimen_id"
                                control={control.control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Tipo Regimen es requerido",
                                  },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                  <StyledFormItem
                                    required
                                    label="Tipo Regimen:"
                                  >
                                    <Select
                                      {...field}
                                      options={selectTipoRegimen}
                                      status={error && "error"}
                                      placeholder="Tipo Regimen"
                                      disabled={!["edit"].includes(accion)}
                                    />
                                    <Text type="danger">{error?.message}</Text>
                                  </StyledFormItem>
                                )}
                              />
                            </Col>
                          </>
                        )}

                        <Col xs={24} sm={8} md={8} lg={2}>
                          <Controller
                            name="categoria"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Categoría:"}>
                                <Input {...field} disabled />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col
                          xs={24}
                          sm={!["create"].includes(accion) ? 12 : 6}
                          md={!["create"].includes(accion) ? 12 : 6}
                          lg={!["create"].includes(accion) ? 4 : 6}
                        >
                          <Controller
                            name="valor"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message:
                                  "La cuota moderadora no puede estar en blanco",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Cuota Moderadora:"}>
                                <Space.Compact style={{ width: "100%" }}>
                                  <Select
                                    {...field}
                                    suffixIcon={
                                      ["create", "edit"].includes(accion) &&
                                      control.getValues("cuota_moderadora") ==
                                        "SI" ? (
                                        <DownOutlined />
                                      ) : null
                                    }
                                    status={error && "error"}
                                    options={selectCuotaModeradora}
                                    disabled={
                                      !isEditing || !paciente || blockBtnCuota
                                    }
                                  />
                                  {["create", "edit"].includes(accion) &&
                                  control.getValues("cuota_moderadora") ==
                                    "SI" &&
                                  permisosCampos.find(
                                    ({
                                      campo_dispensacion: { clave },
                                      obligatoriedad,
                                    }) =>
                                      clave == "cuota_moderadora" &&
                                      obligatoriedad != "oculto"
                                  ) ? (
                                    <Button
                                      type="primary"
                                      onClick={() => setIsEditing(!isEditing)}
                                      disabled={
                                        !convenioSeleccionado || blockBtnCuota
                                      }
                                    >
                                      <EditOutlined />
                                    </Button>
                                  ) : null}
                                </Space.Compact>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        {!["create"].includes(accion) ? (
                          <Col xs={24} sm={8} md={8} lg={3}>
                            <Controller
                              name="valor_cuota"
                              control={control.control}
                              render={({ field }) => (
                                <StyledFormItem label={"Cuota Cobrada:"}>
                                  <InputNumber
                                    {...field}
                                    disabled
                                    prefix={"$"}
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    style={{ width: "100%" }}
                                  />
                                </StyledFormItem>
                              )}
                            />
                          </Col>
                        ) : null}
                        <Col
                          xs={24}
                          sm={12}
                          md={12}
                          lg={!["create"].includes(accion) ? 5 : 6}
                        >
                          <Controller
                            name="entidad"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Eps:"}>
                                <Select
                                  options={selectEntidad}
                                  suffixIcon={null}
                                  {...field}
                                  disabled
                                />
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
                <>
                  {/* Fragmento del Medico */}
                  {(firstView && !hasFuente) ||
                  permisosCampos.find(
                    ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                      clave == "numero_identificacion_m" &&
                      obligatoriedad != "oculto"
                  ) ? (
                    <>
                      <Row gutter={12}>
                        <Col xs={24} md={8}>
                          <Controller
                            name="numero_identificacion_m"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Documento de médico es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Documento médico:"}
                                required
                              >
                                <Spin
                                  spinning={loaderMedico}
                                  indicator={<LoadingOutlined spin />}
                                  style={{
                                    backgroundColor: "rgb(251 251 251 / 70%)",
                                  }}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Digite # documento completo"
                                    allowClear
                                    onChange={(e) => {
                                      if (e.target.value == "") {
                                        clearValuesMedico();
                                        control.setValue(
                                          "numero_identificacion_m",
                                          ""
                                        );
                                      } else {
                                        control.setValue(
                                          "numero_identificacion_m",
                                          e.target.value
                                        );
                                      }
                                    }}
                                    onPressEnter={(
                                      event: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                      handleSearchMedico(event);
                                    }}
                                    onBlur={(event: any) => {
                                      handleSearchMedico(event);
                                    }}
                                    status={error && "error"}
                                    disabled={
                                      (!convenioSeleccionado &&
                                        ["create"].includes(accion)) ||
                                      ["show", "anular", "auditar"].includes(
                                        accion
                                      )
                                    }
                                  />
                                </Spin>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} md={16}>
                          <Controller
                            name="nombre_medico"
                            control={control.control}
                            render={({ field }) => (
                              <StyledFormItem label={"Nombre Completo Médico:"}>
                                <Space.Compact style={{ width: "100%" }}>
                                  <Input {...field} disabled />
                                  {["create", "edit"].includes(accion) ? (
                                    <Button
                                      type="primary"
                                      onClick={handleOpenAddEditModalMedico}
                                      disabled={
                                        (!convenioSeleccionado &&
                                          ["create"].includes(accion)) ||
                                        ["show", "anular"].includes(accion)
                                      }
                                    >
                                      {medico ? (
                                        <EditOutlined />
                                      ) : (
                                        <PlusOutlined />
                                      )}
                                    </Button>
                                  ) : null}
                                </Space.Compact>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
                <>
                  {/* Fragmento Diagnostico Principal */}
                  {(firstView && !hasFuente) ||
                  permisosCampos.find(
                    ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                      clave == "codigo_diagnostico" &&
                      obligatoriedad != "oculto"
                  ) ? (
                    <>
                      <Row gutter={12}>
                        <Col xs={24} md={8}>
                          <Controller
                            name="codigo_diagnostico"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message:
                                  "Código Diagnóstico Principal es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Código Diagnóstico Principal:"}
                              >
                                <Spin
                                  spinning={loaderDiagnostico}
                                  indicator={<LoadingOutlined spin />}
                                  style={{
                                    backgroundColor: "rgb(251 251 251 / 70%)",
                                  }}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Digite Código o Descripción de Diagnóstico"
                                    allowClear
                                    onPressEnter={(
                                      event: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                      handleSearchDiagnostico(event);
                                    }}
                                    // onBlur={(event: any) => {
                                    //   handleSearchDiagnostico(event);
                                    // }}
                                    status={error && "error"}
                                    disabled={
                                      (!convenioSeleccionado &&
                                        ["create"].includes(accion)) ||
                                      ["show", "anular", "auditar"].includes(
                                        accion
                                      )
                                    }
                                  />
                                </Spin>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} md={16}>
                          <Controller
                            name="descripcion_diagnostico"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Diagnóstico Principal es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Descripción Diagnóstico Principal:"}
                              >
                                <Input
                                  {...field}
                                  status={error && "error"}
                                  disabled
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
                <>
                  {/* Fragmento Diagnostico Principal */}
                  {(firstView && !hasFuente) ||
                  permisosCampos.find(
                    ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                      clave == "codigo_diagnostico_relacionado" &&
                      obligatoriedad != "oculto"
                  ) ? (
                    <>
                      <Row gutter={12}>
                        <Col xs={24} md={8}>
                          <Controller
                            name="codigo_diagnostico_relacionado"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Código Diagnóstico Relacionado:"}
                              >
                                <Spin
                                  spinning={loaderDiagnostico}
                                  indicator={<LoadingOutlined spin />}
                                  style={{
                                    backgroundColor: "rgb(251 251 251 / 70%)",
                                  }}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Digite Código o Descripción de Diagnóstico"
                                    allowClear
                                    onPressEnter={(
                                      event: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                      handleSearchDiagnostico(
                                        event,
                                        "relacionado"
                                      );
                                    }}
                                    // onBlur={(event: any) => {
                                    //   handleSearchDiagnostico(event, "relacionado");
                                    // }}
                                    status={error && "error"}
                                    disabled={
                                      (!convenioSeleccionado &&
                                        ["create"].includes(accion)) ||
                                      ["show", "anular", "auditar"].includes(
                                        accion
                                      )
                                    }
                                  />
                                </Spin>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col xs={24} md={16}>
                          <Controller
                            name="descripcion_diagnostico_relacionado"
                            control={control.control}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                label={"Descripción Diagnóstico Relacionado:"}
                              >
                                <Input
                                  {...field}
                                  status={error && "error"}
                                  disabled
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
                <Row gutter={12}>
                  <>
                    {/* Fragmento Fecha de Formula */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "fecha_formula" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={12} md={12} lg={6}>
                          <Controller
                            name="fecha_formula"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Fecha de Formula es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem required label={"Fecha Formula:"}>
                                <DatePicker
                                  {...field}
                                  style={{ width: "100%" }}
                                  placeholder="Fecha Formula"
                                  format={dateFormat}
                                  maxDate={dayjs()}
                                  onKeyDown={(e) => {
                                    if (!/^[0-9]$/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                  status={error && "error"}
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Numero de Formula */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "numero_formula" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={12} md={12} lg={6}>
                          <Controller
                            name="numero_formula"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Numero de formula es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Numero formula:"}
                              >
                                <Input
                                  {...field}
                                  placeholder="Número formula"
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                  status={error && "error"}
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Numero de Formula */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "lugar_formula" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={12} md={12} lg={6}>
                          <Controller
                            name="lugar_formula"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Centro Clínico Formula es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label="Centro Clínico Formula:"
                              >
                                <Spin
                                  spinning={loaderEntidades}
                                  indicator={<LoadingOutlined spin />}
                                  style={{
                                    backgroundColor: "rgb(251 251 251 / 70%)",
                                  }}
                                >
                                  <Select
                                    {...field}
                                    showSearch
                                    filterOption={(input, option) =>
                                      (option?.label?.toString() ?? "")
                                        .toLowerCase()
                                        .includes(
                                          input.toString().toLowerCase()
                                        )
                                    }
                                    popupMatchSelectWidth={400}
                                    placeholder={"Buscar Centro Clínico"}
                                    notFoundContent={null}
                                    options={selectTipoEntidad}
                                    disabled={
                                      (!convenioSeleccionado &&
                                        ["create"].includes(accion)) ||
                                      ["show", "anular", "auditar"].includes(
                                        accion
                                      )
                                    }
                                    status={error && "error"}
                                  />
                                </Spin>
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Despacho */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "despacho_id" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={12} md={12} lg={6}>
                          <Controller
                            name="despacho_id"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Despacho es requerido!",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem required label="Despacho:">
                                <Select
                                  {...field}
                                  showSearch
                                  filterOption={(input, option: any) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  popupMatchSelectWidth={false}
                                  placeholder={"Buscar sitio de despacho"}
                                  notFoundContent={null}
                                  options={selectDespacho}
                                  status={error && "error"}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Concepto (Servicio) */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "concepto_id" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={12}>
                          <Controller
                            name="concepto_id"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Concepto es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Concepto (Servicio):"}
                              >
                                <Select
                                  {...field}
                                  showSearch
                                  filterOption={(input, option: any) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  placeholder={"Seleccionar concepto"}
                                  notFoundContent={null}
                                  options={selectConcepto}
                                  status={error && "error"}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create", "edit"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Tipo Consulta */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "tipo_consulta" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        {" "}
                        <Col xs={24} sm={12}>
                          <Controller
                            name="tipo_consulta"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Tipo de Consulta es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem required label={"Tipo Consulta:"}>
                                <Select
                                  {...field}
                                  showSearch
                                  filterOption={(input, option: any) =>
                                    (option?.label ?? "")
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  placeholder={"Seleccionar tipo de consulta"}
                                  notFoundContent={null}
                                  options={selectTipoConsulta}
                                  status={error && "error"}
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>
                  <>
                    {/* Fragmento Observaciones */}
                    {(firstView && !hasFuente) ||
                    permisosCampos.find(
                      ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                        clave == "observacion" && obligatoriedad != "oculto"
                    ) ? (
                      <>
                        <Col xs={24} sm={24}>
                          <Controller
                            name="observacion"
                            control={control.control}
                            rules={{
                              required: {
                                value: false,
                                message: "Observaciones es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label={"Observaciones:"}>
                                <TextArea
                                  {...field}
                                  placeholder="Observación"
                                  autoSize={{ minRows: 4, maxRows: 6 }}
                                  maxLength={250}
                                  showCount
                                  disabled={
                                    (!convenioSeleccionado &&
                                      ["create"].includes(accion)) ||
                                    ["show", "anular", "auditar"].includes(
                                      accion
                                    )
                                  }
                                  className="upperCaseText"
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </>

                  {accion === "show" || accion === "auditar" ? (
                    <>
                      <Col xs={24} md={12}>
                        <Controller
                          name="estado_auditoria"
                          control={control.control}
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem label="Estado de auditoría:">
                              <Select
                                {...field}
                                placeholder="Seleccionar Estado"
                                style={{ width: "100%" }}
                                optionLabelProp="label"
                                onSelect={handleEstadoChange}
                                filterOption={(input, option) =>
                                  option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={
                                  !(accion === "auditar") || disabledAuditoria
                                }
                                value={opcionesCambio}
                              >
                                {estadosModalDet?.map((option) => (
                                  <Select.Option
                                    key={option.id}
                                    value={option.id}
                                    label={option.name}
                                  >
                                    {option.name}
                                  </Select.Option>
                                ))}
                              </Select>
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}
                  {documentoInfo &&
                  documentoInfo.motivos.length > 0 &&
                  ["show", "auditar", "edit"].includes(accion) ? (
                    <Col xs={24} md={["edit"].includes(accion) ? 24 : 12}>
                      <StyledFormItem label={"Motivos:"}>
                        <CustomSpaceMotivos direction="vertical">
                          {documentoInfo.motivos.map((motivo) => {
                            return `${motivo.codigo} - ${motivo.motivo}`;
                          })}
                        </CustomSpaceMotivos>
                      </StyledFormItem>
                      {!["", null].includes(
                        documentoInfo.ultimo_estado_aud.id_aud_observacion
                      ) ? (
                        <StyledFormItem label={"Observaciones Auditoria:"}>
                          <TextArea
                            value={
                              documentoInfo.ultimo_estado_aud
                                .aud_observacion_info.aud_observacion
                            }
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            disabled
                          />
                        </StyledFormItem>
                      ) : null}
                    </Col>
                  ) : null}
                  {accion === "auditar" &&
                  [
                    "usuario",
                    "regente",
                    "regente_farmacia",
                    "administrador",
                  ].includes(user_rol) &&
                  !disabledAuditoria ? (
                    <Col span={24}>
                      <Button
                        key="cambiar"
                        type="primary"
                        onClick={() => handleChangeState()}
                        disabled={control.getValues("estado_auditoria") == "8"}
                      >
                        <SwapOutlined />
                        Cambiar Estado
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </>
            </Col>
            <Col span={24}>
              <Row gutter={[12, 12]}>
                <Col sm={{ span: 12 }} xs={24}>
                  {firstView ? (
                    <>
                      {/* Fragmento Cargue Soportes */}
                      {(firstView && !hasFuente) ||
                      permisosCampos.find(
                        ({ campo_dispensacion: { clave }, obligatoriedad }) =>
                          clave == "soportes" && obligatoriedad != "oculto"
                      ) ? (
                        <>
                          {["create"].includes(accion) ? (
                            <Controller
                              name="formula_image"
                              control={control.control}
                              render={() => (
                                <StyledFormItem>
                                  <CustomUpload
                                    multiple
                                    fileList={fileList}
                                    onChange={handleFileChange}
                                    beforeUpload={() => {
                                      return false;
                                    }}
                                  >
                                    <Button
                                      icon={<UploadOutlined />}
                                      type="primary"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "12px",
                                      }}
                                      block
                                      disabled={!convenioSeleccionado}
                                    >
                                      Cargue Documentos
                                    </Button>
                                  </CustomUpload>
                                </StyledFormItem>
                              )}
                            />
                          ) : null}
                        </>
                      ) : null}
                    </>
                  ) : null}
                </Col>
                {!["edit", "show", "auditar"].includes(accion) ? (
                  <>
                    <Col
                      sm={{ span: 12 }}
                      xs={24}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "12px",
                      }}
                    >
                      <Button
                        type="primary"
                        block
                        onClick={() => setOpenFlag(true)}
                        style={{ color: "white" }}
                        disabled={!convenio || !paciente}
                      >
                        <Text style={{ color: "white" }}>
                          <PlusOutlined /> Agregar Item
                        </Text>
                      </Button>
                    </Col>
                  </>
                ) : null}
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Table
                    rowKey={(record) => record.key}
                    size="small"
                    scroll={{ y: 700 }}
                    pagination={{
                      simple: false,
                      hideOnSinglePage: true,
                    }}
                    bordered
                    dataSource={dataSource}
                    columns={modifiedColumns}
                  />
                </Col>
              </Row>
              {["administrador"].includes(user_rol) ? (
                <Row
                  gutter={[12, 12]}
                  justify="end"
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  <Col>
                    <Text>Total: ${calcularTotalAcumulado()}</Text>
                  </Col>
                </Row>
              ) : null}
            </Col>

            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Space>
                {accion == "create" ? (
                  <Link to={".."} relative="path">
                    <Button
                      type="primary"
                      icon={<ArrowLeftOutlined />}
                      disabled={convenioSeleccionado}
                      danger
                    >
                      Volver
                    </Button>
                  </Link>
                ) : (
                  <Link to={"../.."} relative="path">
                    <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                      Volver
                    </Button>
                  </Link>
                )}
                {!flagAcciones ? (
                  <>
                    {accion == "create" || accion == "edit" ? (
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={
                          dataSource.length === 0 ||
                          loader ||
                          disableButton ||
                          camposErrorRegimen.length > 0
                        }
                        icon={<SaveOutlined />}
                      >
                        Guardar
                      </Button>
                    ) : null}
                    {accion == "anular" ? (
                      <Button
                        htmlType="button"
                        type="primary"
                        danger
                        onClick={anularDocumento}
                        disabled={!documentoInfo || loader}
                      >
                        Anular
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </Space>
            </Col>
          </Row>
        </Form>
      </StyledCard>
      {/* Modal Medico */}
      <Modal
        title={medico ? "Editar medico" : "Agregar nuevo medico"}
        open={addEditModalMedicoVisible}
        onOk={() => {
          medico ? editMedicoForm.submit() : addMedicoForm.submit();
        }}
        onCancel={() => setAddEditModalMedicoVisible(false)}
      >
        <Spin
          spinning={loaderMedico}
          indicator={<LoadingOutlined spin />}
          style={{
            backgroundColor: "rgb(251 251 251 / 70%)",
          }}
        >
          <Form
            layout={"vertical"}
            form={medico ? editMedicoForm : addMedicoForm}
            onFinish={controlMedico.handleSubmit(onCreateMedico)}
          >
            <Row gutter={24}>
              <Col xs={24} sm={24} style={{ width: "100%" }}>
                <Controller
                  name="tipo_identificacion"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "tipo de documento es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Tipo de documento:">
                      <Select
                        {...field}
                        placeholder="Tipo de documento"
                        options={selectTipoDocumento}
                        filterOption={(input, option) =>
                          (option?.label?.toString() ?? "")
                            .toLowerCase()
                            .includes(input.toString().toLowerCase())
                        }
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="numero_identificacion"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "numero de identificacion es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Numero de identificacion:">
                      <Input
                        {...field}
                        placeholder="Numero de identificacion"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="nombre_primero"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "primer nombre es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Primer nombre:">
                      <Input
                        {...field}
                        placeholder="Primer nombre"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="nombre_segundo"
                  control={controlMedico.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Segundo nombre:">
                      <Input
                        {...field}
                        placeholder="Segundo nombre"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="apellido_primero"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "primer apellido es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Primer apellido:">
                      <Input
                        {...field}
                        placeholder="Primer apellido"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="apellido_segundo"
                  control={controlMedico.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Segundo apellido:">
                      <Input
                        {...field}
                        placeholder="Segundo apellido"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="entidad"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "entidad es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Entidad:">
                      <Input
                        {...field}
                        placeholder="Entidad"
                        status={error && "error"}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="estado"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Estado es requerido",
                    },
                  }}
                  defaultValue={"1"}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Estado">
                      <Select
                        {...field}
                        options={[
                          { value: "0", label: "INACTIVO" },
                          { value: "1", label: "ACTIVO" },
                        ]}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
                <Controller
                  name="rural"
                  control={controlMedico.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Medico Rural es requerido",
                    },
                  }}
                  defaultValue={"1"}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Medico Rural">
                      <Select
                        {...field}
                        options={[
                          { value: "0", label: "No" },
                          { value: "1", label: "Si" },
                        ]}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      {/* Modal consulta dispensaciones y pendientes pacientes */}
      <Modal
        title={
          <Text>
            <p style={{ color: "red", fontWeight: "600" }}>
              ¿Tenga en cuenta las dispensaciones y pendientes del paciente,
              Deseas dispensar?
            </p>
          </Text>
        }
        open={modalDispensacionVisible}
        closeIcon={false}
        style={{ top: 10 }}
        width={1200}
        footer={[
          <div key="footer" style={{ textAlign: "center" }}>
            <Button type="primary" onClick={dispensarPaciente}>
              Sí
            </Button>
            <Button danger type="primary" onClick={() => clearForm()}>
              No
            </Button>
          </div>,
        ]}
      >
        <Tabs
          items={[
            {
              key: "Dispensaciones",
              label: "Dispensaciones",
              children: (
                <>
                  <SearchBar style={{ marginBottom: 5 }}>
                    <Input
                      placeholder="Buscar"
                      onChange={handleSearchDispensaciones}
                    />
                  </SearchBar>
                  <p style={{ color: "red" }}>
                    El Paciente ha tenido dispensaciones en los últimos 30 días
                  </p>
                  <Table
                    dataSource={dispensacionPaciente}
                    columns={columnsTableDispensacion}
                    pagination={false}
                    size="small"
                    scroll={{ y: 320 }}
                    rowKey={(record) =>
                      `${record.consecutivo}_${record.desc_producto}`
                    }
                  />
                </>
              ),
            },
            {
              key: "Pendientes",
              label: "Pendientes",
              children: (
                <>
                  <SearchBar style={{ marginBottom: 5 }}>
                    <Input
                      placeholder="Buscar"
                      onChange={handleSearchPendientes}
                    />
                  </SearchBar>
                  <p style={{ color: "red" }}>
                    El Paciente ha tenido pendientes en los últimos 30 días
                  </p>
                  <Table
                    dataSource={pendientePaciente}
                    columns={columnsTablePendiente}
                    pagination={false}
                    size="small"
                    scroll={{ y: 320 }}
                    rowKey={(record) =>
                      `${record.consecutivo}_${record.desc_producto}`
                    }
                  />
                </>
              ),
            },
          ]}
        />
      </Modal>
      ;
    </Spin>
  );
};
