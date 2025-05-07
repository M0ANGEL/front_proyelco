/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ModalPacientes } from "@/modules/documentos/pages/ventas/pages/dis/components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getCuotaModeradoras } from "@/services/maestras/cuotaModeradoraAPI";
import { searchDiagnosticos } from "@/services/maestras/diagnosticosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  DataTypeDispensaciones,
  DataTypePendientes,
} from "@/modules/documentos/pages/ventas/pages/dis/pages/FormDIS/types";
import { DataTypeLote } from "../../components/ModalPagoProductos/types";
import { validarAccesoDocumento } from "@/services/documentos/disAPI";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { StyledText } from "../../components/ModalProductos/styled";
import {
  getConveniosxNitBodega,
  searchConvenios,
} from "@/services/salud/conveniosAPI";
import { searchMedicos } from "@/services/maestras/medicosAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { KEY_EMPRESA, KEY_BODEGA } from "@/config/api";
import { useEffect, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import { DataType, DataTypePago } from "./types";
import {
  getCoincidenciasNumeroId,
  searchPacientes,
} from "@/services/maestras/pacientesAPI";
import {
  cambiarEstadoPend,
  crearPendiente,
  deleteItem,
  getInfoPend,
  updatePEND,
} from "@/services/documentos/pendApi";
import {
  getDispensacionTirillaPdf,
  getDispensacionPdf,
  crearDispensacion,
  searchEntidad,
  getDespachos,
} from "@/services/documentos/disAPI";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
  DeleteOutlined,
  CloseOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  IDPendiente,
  Concepto,
  Convenio,
  Paciente,
  TipoCons,
  Medico,
} from "@/services/types";
import {
  ModalPagoProductos,
  ModalProductos,
  ModalPaciente,
  ModalMedico,
} from "../../components";
import "./styles.css";
import {
  notification,
  InputNumber,
  SelectProps,
  DatePicker,
  Popconfirm,
  Typography,
  message,
  Tooltip,
  Button,
  Select,
  Input,
  Modal,
  Space,
  Form,
  Spin,
  Tabs,
  Col,
  Row,
  Alert,
} from "antd";
import { getBodega } from "@/services/maestras/bodegasAPI";
import { TbHandStop } from "react-icons/tb";

const { Title, Text } = Typography;
const { TextArea } = Input;

const { confirm } = Modal;

let timeout: ReturnType<typeof setTimeout> | null;

export const FormPend = () => {
  const [openModalPacientes, setOpenModalPacientes] = useState<boolean>(false);
  const [openModalPaciente, setOpenModalPaciente] = useState<boolean>(false);
  const [openModalMedico, setOpenModalMedico] = useState<boolean>(false);
  const [openModalPago, setOpenModalPago] = useState<boolean>(false);

  const [convenios, setConvenios] = useState<any[]>([]);
  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [editCuotaModeradora, setEditCuotaModeradora] =
    useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [detallePago, setDetallePago] = useState<DataTypePago[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [convenio, setConvenio] = useState<Convenio>();
  const [selectTipo, setSelectTipo] = useState<SelectProps["options"]>([]);
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [loaderUser, setLoaderUser] = useState<boolean>(false);
  const [loaderConvenio, setLoaderConvenio] = useState<boolean>(false);
  const [loaderDiagnostico, setLoaderDiagnostico] = useState<boolean>(false);
  const [loaderEntidades, setLoaderEntidades] = useState<boolean>(false);
  const [messageApi] = message.useMessage();
  const [selectEntidad, setSelectEntidad] = useState<SelectProps["options"]>(
    []
  );
  const [selectCuotaModeradora, setSelectCuotaModeradora] = useState<
    SelectProps["options"]
  >([]);
  const [selectDespacho, setSelectDespacho] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoEntidad, setSelectTipoEntidad] = useState<
    SelectProps["options"]
  >([]);
  const [dispensacionPaciente, setDispensacionPaciente] = useState<
    DataTypeDispensaciones[]
  >([]);
  const [pendientePaciente, setPendientePaciente] = useState<
    DataTypePendientes[]
  >([]);
  const [modalDispensacionVisible, setModalDispensacionVisible] =
    useState(false);
  const [convenioSeleccionado, setConvenioSeleccionado] = useState(false);
  const [selectDiagnostico, setSelectDiagnostico] = useState<
    SelectProps["options"]
  >([]);
  const [selectDiagnosticoRel, setSelectDiagnosticoRel] = useState<
    SelectProps["options"]
  >([]);
  const [selectConcepto, setSelectConcepto] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoConsulta, setSelectTipoConsulta] = useState<
    SelectProps["options"]
  >([]);
  const [detalleProcesado, setDetalleProcesado] = useState(false);
  const [documentoInfo, setDocumentoInfo] = useState<IDPendiente>();
  const [paciente, setPaciente] = useState<Paciente>();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medico, setMedico] = useState<Medico>();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [disableAddButton, setDisableAddButton] = useState<boolean>(false);
  const [camposErrorRegimen, setCamposErrorRegimen] = useState<string[]>([]);
  const [loaderMedico, setLoaderMedico] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [disabledConv, setDisabledConv] = useState(false);
  const toValue = accion === "create" ? ".." : "../..";
  const [url, setUrl] = useState<string[]>([]);
  const control = useForm({
    mode: "onChange",
  });
  const watchPaciente = control.watch("numero_identificacion");
  const watchRegimen = control.watch("regimen");
  const watchTipoRegimen = control.watch("tipo_regimen");
  const watchConcepto = control.watch("concepto_id");

  const bodega_id = getSessionVariable(KEY_BODEGA);

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    setLoader(true);

    if (
      !["pagar", "show", "cancelar", "anular", undefined].includes(accion) &&
      !id
    ) {
      setLoaderEntidades(true);
      searchEntidad("")
        .then(({ data: { data } }) => {
          if (data) {
            setSelectTipoEntidad(
              data.map((item) => ({
                value: item.id.toString(),
                label: `${item.entidad}`,
              }))
            );
          } else {
            setSelectTipoEntidad([]);
            notification.open({
              type: "error",
              message: "No existe la Entidad.",
            });
          }
        })
        .finally(() => setLoaderEntidades(false));

      setLoaderConvenio(true);
      searchConvenios("", getSessionVariable(KEY_BODEGA))
        .then(({ data: { data } }) => {
          if (data.length > 0) {
            setConvenios(data);
            setSelectTipo(
              data.map((item) => ({
                value: item.id,
                label: `${item.num_contrato} - ${item.descripcion}`,
              }))
            );
          } else {
            setSelectTipo([]);
            notification.open({
              type: "error",
              message: "No existen convenios vinculados a esta bodega.",
            });
          }
        })
        .finally(() => setLoaderConvenio(false));
    }

    getDespachos().then(({ data: { data } }) => {
      setSelectDespacho(
        data.map((despacho: any) => {
          return { value: parseInt(despacho.id), label: despacho.despacho };
        })
      );
    });

    getCuotaModeradoras().then(({ data: { data } }) => {
      setSelectCuotaModeradora(
        data
          .filter((item) => item.estado == "1")
          .map((item) => {
            return {
              label: `$ ${parseFloat(item.valor).toLocaleString("es-ES")}`,
              value: parseFloat(item.valor),
            };
          })
      );
    });

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      )
        .then(({ data: { data } }) => {
          if (data) {
            control.setValue("tipo_documento_id", data.documento_info.id);
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
            // if (data.modificar !== "1" && accion == "edit") {
            //   messageApi.open({
            //     type: "error",
            //     content: "No tienes permisos para modificar!",
            //   });
            //   setTimeout(() => {
            //     navigate(
            //       `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
            //     );
            //   }, 1500);
            //   return;
            // }
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
          if (id) {
            getInfoPend(id)
              .then(({ data: { data } }) => {
                setDocumentoInfo(data);
                control.setValue("tipo_documento_id", data.tipo_documento_id);
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
                      navigate(`/${url.at(1)}/${url.at(2)}/${url.at(3)}`);
                    }, 2500);
                    return;
                  }
                }
                const nombreCompleto = `${data.pacientes.nombre_primero} ${
                  data.pacientes.nombre_segundo
                    ? data.pacientes.nombre_segundo + " "
                    : ""
                }${data.pacientes.apellido_primero}${
                  data.pacientes.apellido_segundo
                    ? " " + data.pacientes.apellido_segundo
                    : ""
                }`;

                setSelectEntidad([
                  {
                    label: data.pacientes.eps.entidad,
                    value: data.pacientes.eps_id.toString(),
                  },
                ]);

                if (["pagar", "show", "cancelar", "anular"].includes(accion)) {
                  setSelectTipo([
                    {
                      label: `${data.convenios.num_contrato} - ${data.convenios.descripcion}`,
                      value: data.convenios.id,
                    },
                  ]);
                  // setSelectDespacho([
                  //   {
                  //     label: `${data.despacho_info.despacho}`,
                  //     value: data.despacho_info.id,
                  //   },
                  // ]);
                  setSelectTipoEntidad([
                    {
                      label: `${data.entidad_info.entidad}`,
                      value: data.entidad_info.id.toString(),
                    },
                  ]);
                  setSelectTipoConsulta([
                    {
                      label: `${data.tipo_consulta_info.nombre}`,
                      value: data.tipo_consulta_info.id.toString(),
                    },
                  ]);
                }

                if (["pagar"].includes(accion)) {
                  setDisableAddButton(true);
                  setDisabledConv(false);
                  setSelectTipo([]);
                  control.setValue("convenio_id", undefined);
                  getConveniosxNitBodega({
                    nit_convenio: data.convenios.nit,
                    bodega_id: getSessionVariable(KEY_BODEGA),
                  }).then(({ data: { data } }) => {
                    if (data.length > 0) {
                      setConvenios(data);
                      setSelectTipo(
                        data.map((item) => ({
                          value: item.id,
                          label: `${item.num_contrato} - ${item.descripcion}`,
                        }))
                      );
                    } else {
                      notificationApi.info({
                        message:
                          "Esta bodega no tiene convenios disponibles para realizar el pago del pendiente",
                      });
                    }
                  });
                } else {
                  setDisabledConv(true);
                  control.setValue("convenio_id", parseInt(data.convenio_id));
                }

                const nomCompletoMed = `${capitalizarPrimeraLetra(
                  data.medicos.nombre_primero
                )} ${capitalizarPrimeraLetra(
                  data.medicos.nombre_segundo
                )} ${capitalizarPrimeraLetra(
                  data.medicos.apellido_primero
                )} ${capitalizarPrimeraLetra(data.medicos.apellido_segundo)}`;

                control.setValue("observacion", data.observacion);
                control.setValue("motivo_cancelacion", data.motivo_cancelacion);
                control.setValue("paciente_id", data.paciente_id);
                control.setValue(
                  "numero_identificacion",
                  data.pacientes.numero_identificacion
                );
                control.setValue("nombre_completo", nombreCompleto);
                control.setValue("cuota_moderadora", data.cuota_moderadora);
                control.setValue(
                  "tipo_regimen",
                  data.pacientes.tipo_regimen
                    ? data.pacientes.tipo_regimen.nombre
                    : ""
                );
                form.setFieldValue(
                  "tipo_documento",
                  data.pacientes.tipo_identificacion
                );
                control.setValue(
                  "autorizacion_cabecera",
                  data.autorizacion_cabecera
                );
                control.setValue(
                  "regimen",
                  data.pacientes.cuotas_moderadoras.regimen
                );
                control.setValue(
                  "categoria",
                  data.pacientes.cuotas_moderadoras.categoria
                );
                control.setValue(
                  "valor",
                  data.convenios.cuota_mod == "1"
                    ? parseFloat(data.pacientes.cuotas_moderadoras.valor)
                    : 0
                );
                control.setValue(
                  "entidad",
                  capitalizarPrimeraLetra(data.entidad)
                ); // Eps
                control.setValue(
                  "numero_identificacion_m",
                  data.medicos.numero_identificacion
                );
                control.setValue("despacho_id", parseInt(data.despacho));
                control.setValue("concepto_id", parseInt(data.concepto_id));
                setSelectConcepto([
                  { label: data.conceptos.nombre, value: data.conceptos.id },
                ]);
                control.setValue("fecha_formula", data.fecha_formula);
                control.setValue("numero_formula", data.numero_formula);
                control.setValue("lugar_formula", data.lugar_formula);
                control.setValue("tipo_consulta", data.tipo_consulta);
                control.setValue(
                  "diagnostico_id",
                  parseInt(data.diagnostico_id)
                );
                setSelectDiagnostico([
                  {
                    label: `${data.diagnosticos.codigo} ${data.diagnosticos.descripcion}`,
                    value: data.diagnosticos.id,
                  },
                ]);
                if (data.diagnostico_rel) {
                  control.setValue(
                    "diagnostico_rel_id",
                    parseInt(data.diagnostico_rel_id)
                  );
                  setSelectDiagnosticoRel([
                    {
                      label: `${data.diagnostico_rel.codigo} ${data.diagnostico_rel.descripcion}`,
                      value: data.diagnostico_rel.id,
                    },
                  ]);
                }
                control.setValue("bodega_id", data.bodega_id);
                control.setValue("medico_id", data.medico_id);
                control.setValue("nombre_medico", nomCompletoMed); //nombre_medico

                function capitalizarPrimeraLetra(cadena: any) {
                  return cadena
                    ? cadena.charAt(0).toUpperCase() + cadena.slice(1)
                    : "";
                }

                const fecha = new Date(data.created_at);
                const dia = fecha.getDate();
                const mes = fecha.getMonth() + 1;
                const año = fecha.getFullYear();

                const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
                  mes < 10 ? "0" + mes : mes
                }/${año}`;
                control.setValue("fecha", fechaFormateada);
                setConvenio(data.convenios);

                //RECORDAR: formatear DataType, y campos
                if (!detalleProcesado) {
                  const detalle: any[] = data.detalle.map((item) => {
                    return {
                      key: item.id,
                      id: item.producto_id,
                      descripcion: item.producto.descripcion,
                      cantidad_entregada: parseInt(item.cantidad_entregada),
                      cant_sol: item.cantidad_solicitada,
                      cantidad: item.cantidad_saldo,
                      precio_lista: item.precio_venta,
                      precio_subtotal: item.precio_subtotal,
                      iva: item.precio_iva,
                      precio_total: item.precio_venta_total,
                      editable: false,
                      cod_padre: item.producto.cod_padre,
                      cantidad_pagada: item.cantidad_pagada,
                      dias_tratamiento: parseInt(item.dias_tratamiento),
                      estado: ["show", "pagar"].includes(accion)
                        ? item.estado
                        : undefined,
                    };
                  });
                  handleSetDetalle(detalle);
                  // Marcamos que el detalle ha sido procesado
                  setDetalleProcesado(true);
                }
              })
              .finally(() => setLoader(false));
          }
        })
        .finally(() => {
          !id ? setLoader(false) : null;
        });
    }
  }, [id]);

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
    if (["pagar"].includes(accion)) {
      setDisableButton(!(detallePago.length > 0));
      control.setValue("detalle", detallePago);
      setDisabledConv(detallePago.length > 0);
    } else {
      setDisableButton(!(dataSource.length > 0));
      control.setValue("detalle", dataSource);
    }
  }, [dataSource, detallePago]);

  useEffect(() => {
    let subtotal = 0;
    let impuesto = 0;
    let total = 0;
    detallePago.forEach((item) => {
      subtotal += item.precio_subtotal;
      impuesto += item.precio_iva;
      total += item.precio_total;
    });
    control.setValue("subtotal", subtotal);
    control.setValue("impuesto", impuesto);
    control.setValue("total", total);
  }, [detallePago]);

  useEffect(() => {
    if (watchPaciente == "") {
      setPaciente(undefined);
      control.setValue("nombre_completo", "");
    } else if (
      (paciente && paciente.cuotasmoderadoras) ||
      paciente?.cuotas_moderadoras
    ) {
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

  const watchMedico = control.watch("numero_identificacion_m");

  useEffect(() => {
    if (watchMedico == "") {
      setMedico(undefined);
      control.setValue("nombre_medico", "");
    } else if (medico) {
      const nombre_completo = `${medico.nombre_primero} ${
        medico.nombre_segundo ? medico.nombre_segundo + " " : ""
      }${medico.apellido_primero}${
        medico.apellido_segundo ? " " + medico.apellido_segundo : ""
      }`;
      control.setValue("medico_id", medico.id);
      control.setValue("nombre_medico", nombre_completo);
    }
  }, [watchMedico, medico]);

  // Validacion de que el convenio, regimen, tipo_regimen y concepto coincidan por las palabras contributivo o subsidiado
  useEffect(() => {
    if (
      convenio &&
      ["subsidiado", "contributivo"].includes(convenio.reg_conv.toLowerCase()) &&
      !['5'].includes(convenio.id_mod_contra)
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

  const handleSetConvenio = (value: string) => {
    try {
      const convenioData = convenios.find((item) => item.id == value); // Accedemos al primer objeto en el array
      const convenioCompleto = `${convenioData.num_contrato} - ${convenioData.descripcion}`;

      const cuotaModeradora = convenioData.cuota_mod == "1" ? "SI" : "NO";
      if (!["pagar"].includes(accion)) {
        control.setValue("convenio_id", convenioCompleto);
        control.setValue("cuota_moderadora", cuotaModeradora);
        setSelectTipoConsulta(
          convenioData.tipo_consulArray.map((tipo_consul: TipoCons) => {
            return { value: tipo_consul.id, label: tipo_consul.nombre };
          })
        );

        setSelectConcepto(
          convenioData.conceptosArray.map((conceptos: Concepto) => {
            return { value: conceptos.id, label: conceptos.nombre };
          })
        );
      } else {
        control.setValue("convenio_id", convenioData.id);
        setDisableAddButton(false);
      }

      setConvenio(convenioData);
      if (!["pagar"].includes(accion)) {
        setDisabledConv(true);
        setConvenioSeleccionado(true);
      }
    } catch (error) {
      console.error("Error fetching dispensaciones:", error);
    }

    // control.setValue("autorizacion_cabecera", convenio?.cuota_moderadora);
    // Marcamos que el detalle ha sido procesado
    setDetalleProcesado(true);
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
        timeout = setTimeout(() => {
          let alert = false;
          if (query != paciente?.numero_identificacion) {
            alert = true;
          }
          setLoaderUser(true);
          searchPacientes(query, tipo_documento)
            .then(({ data: { data, pendiente } }) => {
              if (
                data &&
                data.dispensaciones_30 &&
                data.dispensaciones_30.length > 0 &&
                alert
              ) {
                setPaciente(data);
                if (
                  data.dispensaciones_30 &&
                  data.dispensaciones_30.length > 0
                ) {
                  const detalleDispensacion: DataTypeDispensaciones[] = [];
                  data.dispensaciones_30.forEach((cabecera) => {
                    cabecera.detalle.forEach((item) => {
                      detalleDispensacion.push({
                        key: item.id,
                        fecha_dispensacion: dayjs(item.created_at).format(
                          "DD-MM-YYYY HH:mm"
                        ),
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
                }
                if (
                  pendiente?.pendientes_30 &&
                  pendiente?.pendientes_30.length > 0
                ) {
                  const detallePendiente: DataTypePendientes[] = [];
                  pendiente.pendientes_30.forEach((cabecera) => {
                    cabecera.detalle.forEach((item) => {
                      detallePendiente.push({
                        key: item.id,
                        fecha_pendiente: dayjs(item.created_at).format(
                          "DD-MM-YYYY HH:mm"
                        ),
                        consecutivo: cabecera.consecutivo,
                        observaciones: cabecera.observacion,
                        dispensacion: cabecera.dispensacion.consecutivo
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
                }

                openDispensacionModal();
              } else {
                if (data) {
                  // mostrar una modal aqui pintando el arreglo de
                  setPaciente(data);
                  setSelectEntidad([
                    { label: data.eps.entidad, value: data.eps.id.toString() },
                  ]);
                  control.setValue("paciente_id", data.id.toString());
                  const nombre_completo = `${paciente?.nombre_primero} ${
                    paciente?.nombre_segundo
                      ? paciente?.nombre_segundo + " "
                      : ""
                  }${paciente?.apellido_primero}${
                    paciente?.apellido_segundo
                      ? " " + paciente?.apellido_segundo
                      : ""
                  }`;
                  control.setValue("nombre_completo", nombre_completo);
                  control.setValue("entidad", data.eps_id);
                  control.setValue("regimen", data.cuotasmoderadoras.regimen);
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
                clearValues();
              }
            )
            .finally(() => setLoaderUser(false));
        }, 200);
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
      control.setValue("categoria", paciente.cuotasmoderadoras.categoria);
      if (control.getValues("cuota_moderadora") == "NO") {
        control.setValue("valor", 0);
      } else {
        control.setValue("valor", parseFloat(paciente.cuotasmoderadoras.valor));
      }
      control.setValue("paciente_id", paciente.numero_identificacion);

      closeDispensacionModal();
    }
  };

  const openDispensacionModal = () => {
    setModalDispensacionVisible(true);
  };

  const closeDispensacionModal = () => {
    setModalDispensacionVisible(false);
  };

  const handleSearchMedico = (event: any) => {
    const query = event.target.value.toString();
    //setLoaderMedico(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        setLoaderMedico(true);
        searchMedicos(query)
          .then(({ data: { data } }) => {
            if (data) {
              control.setValue("medico_id", data.id.toString());
              const nombre_completo = `${data.nombre_primero} ${data.nombre_segundo} ${data.apellido_primero} ${data.apellido_segundo}`;
              control.setValue("nombre_medico", nombre_completo);
              setMedico(data);
            } else {
              setMedico(undefined);
              control.setValue("nombre_medico", "");
              message.info("Médico no existe, por favor registrarlo");
              setOpenModalMedico(true);
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
      }, 200);
    }
  };

  const handleSearchDiagnostico = (query: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        setLoaderDiagnostico(true);
        searchDiagnosticos(query)
          .then(({ data: { data } }) => {
            if (data.data.length > 0) {
              setDiagnosticos(data.data);
              setSelectDiagnostico(
                data.data.map((item) => ({
                  value: item.id,
                  label: `${item.codigo} - ${item.descripcion}`,
                }))
              );
              setSelectDiagnosticoRel(
                data.data.map((item) => ({
                  value: item.id,
                  label: `${item.codigo} - ${item.descripcion}`,
                }))
              );
            } else {
              notificationApi.open({
                type: "error",
                message:
                  "No se encuentran diagnósticos bajo el criterio de búsqueda",
              });
            }
          })
          .finally(() => setLoaderDiagnostico(false));
      }, 200);
    }
  };

  const handleSelectDiagnostico = (value: string) => {
    const diagnostico = diagnosticos.find((item) => item.id == value);
    control.setValue("diagnostico", diagnostico.descripcion);
  };

  // Funcion para realizar el cambio de texto a input en la tabla de detalle, ya sea en cantidades o en el valor
  const handleChangeEdit = (key: React.Key, accion: string) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (accion) {
        case "cantidad":
          //target.editable = true; // Hacer el campo editable
          break;
        case "precio":
          target.editablePrecio = true; // Hacer el campo editablePrecio
          break;
      }
      setDataSource(newData);
    }
  };

  const calcularSubtotal = (cantidad: any, precio_lista: any) => {
    return cantidad * precio_lista;
  };

  const calcularIva = (cantidad: any, precio_lista: any, valorIva: any) => {
    return cantidad * precio_lista * (valorIva / 100);
  };

  const calcularTotal = (cantidad: any, precio_lista: any, valorIva: any) => {
    return cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100);
  };

  const cambiarEstado = () => {
    setLoader(true);
    let data: any = {
      pend_id: id,
      accion: accion,
    };

    if (["cancelar"].includes(accion)) {
      control.getValues("detalle").map((item: any, index: number) => {
        if (!item.estado) {
          control.setError(`detalle.${index}.estado`, {
            message: "Estado es necesario",
          });
        }
      });
      if (
        ["", undefined, null].includes(control.getValues("motivo_cancelacion"))
      ) {
        control.setError("motivo_cancelacion", {
          message: "Se requiere llenar un motivo de cancelación",
        });
        setLoader(false);
        return;
      } else {
        if (control.getFieldState("detalle").invalid) {
          setLoader(false);
          return;
        }
        data = {
          ...data,
          motivo_cancelacion: control.getValues("motivo_cancelacion"),
          detalle: control.getValues("detalle"),
        };
      }
    }
    cambiarEstadoPend(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha cambiado de estado el documento con exito!`,
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

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    const duplicateProducts: DataType[] = [];

    productos.forEach((producto: any) => {
      const existingProduct = selectedProducts.find(
        (p: any) =>
          p.key.toString() === producto.key &&
          p.lote === producto.lote &&
          p.fvence === producto.fvence ||
          p.cod_padre === producto.cod_padre
      );

      if (existingProduct) {
        duplicateProducts.push(producto);
      } else {
        const iva = calcularIva(
          producto.cantidad,
          producto.precio_lista,
          producto.iva
        );
        const subtotal = calcularSubtotal(
          producto.cantidad,
          producto.precio_lista
        );
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

  const descripcionStyles = {
    fontSize: "12px",
  };

  const generarPDF = (dispensacion_id: any) => {
    getDispensacionPdf(dispensacion_id.toString()).then((data) => {
      const file = new Blob([data.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  };

  const columnsTableDispensacion: ColumnsType<any> = [
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

  const columnsTablePendiente: ColumnsType<any> = [
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

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handleOpenChange = (
    value: boolean,
    key: React.Key,
    itemFromModal: boolean
  ) => {
    if (!value) {
      setDeletingRow([]);
    }
    if (["create"].includes(accion) || itemFromModal) {
      handleDeleteProducto(key, itemFromModal);
    } else {
      setDeletingRow([...deletingRow, key]);
    }
  };

  const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
    if (["edit"].includes(accion) && dataSource.length == 1) {
      notificationApi.open({
        type: "error",
        message: "El detalle no debe quedar vacío",
      });
      return;
    }
    if (["create"].includes(accion) || itemFromModal) {
      setDataSource(dataSource.filter((item) => item.key != key));
      setSelectedProducts(selectedProducts.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      deleteItem({
        pen_id: id,
        producto_id: key,
      })
        .then(() => {
          notificationApi.open({
            type: "success",
            message: `Item removido del detalle!`,
          });
          setDataSource(dataSource.filter((item) => item.key != key));
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
        .finally(() => {
          setDeleteLoader(false);
          setDeletingRow([]);
        });
    }
  };

  // Columnas de la modal listar pendientes
  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      align: "center",
      fixed: "left",
      width: 80,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      fixed: "left",
      width: 250,
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
      render: (currentValue, { dias_tratamiento, key }) => {
        return (
          <>
            {["create"].includes(accion) ? (
              <InputNumber
                min={0}
                size="small"
                controls={false}
                defaultValue={dias_tratamiento}
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
                    // control.setValue("detalle", data);
                  } else {
                    const data = dataSource.map((item) => {
                      if (item.key == key) {
                        return { ...item, dias_tratamiento: 0 };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(data);
                    // control.setValue("detalle", data);
                  }
                }}
              />
            ) : (
              <Text>{currentValue}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Cantidad Pendiente",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 100,
      render: (
        currentValue,
        record: {
          key: React.Key;
          cantidad: number;
        }
      ) => {
        return (
          <Space direction="vertical">
            {["create", "pagar", "edit"].includes(accion) ? (
              <>
                <StyledText
                  style={descripcionStyles}
                  onClick={() => handleChangeEdit(record.key, "cantidad")}
                >
                  {record.cantidad}
                </StyledText>
              </>
            ) : (
              <Text> {currentValue}</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Cantidad Pagada",
      dataIndex: "cantidad_pagada",
      key: "cantidad_pagada",
      align: "center",
      width: 80,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      align: "center",
      width: 140,
      hidden: !["cancelar", "show"].includes(accion),
      render: (value, record) => {
        let estado = "";
        switch (value) {
          case "1":
            estado = "Activo";
            break;
          case "7":
            estado = "Cancelado";
            break;
        }
        if (["cancelar"].includes(accion)) {
          const indexProduto = control
            .getValues("detalle")
            .findIndex((item: any) => item.key == record.key);
          return (
            <Controller
              control={control.control}
              name={`detalle.${indexProduto}.estado`}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem>
                  <Select
                    {...field}
                    options={[
                      { label: "Activo", value: "1" },
                      { label: "Cancelado", value: "7" },
                    ]}
                    status={error && "error"}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          );
        } else {
          return estado;
        }
      },
    },
  ];

  ["create", "edit"].includes(accion)
    ? columns.push({
        title: "Acciones",
        dataIndex: "acciones",
        key: "acciones",
        align: "center",
        fixed: "right",
        render: (_, { key, cantidad_entregada, cantidad_pagada, editable }) => {
          return (
            <Tooltip
              title={
                cantidad_entregada > 0
                  ? "No se puede remover el item ya que viene de una Dispensación"
                  : "Remover item"
              }
            >
              <Popconfirm
                title="¿Desea eliminar este item?"
                open={deletingRow.includes(key)}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                description={
                  <Space direction="vertical" size={1}>
                    <Text>
                      {`Al eliminarlo se quitará directamente del documento`}
                    </Text>
                  </Space>
                }
                okButtonProps={{
                  loading: deleteLoader,
                  danger: true,
                }}
                okText="Si"
                cancelText="No"
                onConfirm={() => handleDeleteProducto(key, editable)}
                onCancel={() => setDeletingRow([])}
                onOpenChange={(value: boolean) =>
                  handleOpenChange(value, key, editable)
                }
                disabled={deletingRow.length > 0}
              >
                <Button
                  danger
                  size="small"
                  type="primary"
                  disabled={cantidad_entregada > 0 || cantidad_pagada > 0}
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
          );
        },
        width: 100,
      })
    : null;

  const columnsPago: ColumnsType<DataTypePago> = [
    {
      title: "Código",
      key: "id",
      dataIndex: "id",
      width: 90,
      align: "center",
      fixed: "left",
    },
    {
      title: "Descripción",
      key: "desc_producto",
      dataIndex: "desc_producto",
      fixed: "left",
    },
    {
      title: "Días Tratamiento",
      key: "dias_tratamiento",
      dataIndex: "dias_tratamiento",
      width: 100,
      align: "center",
      render: (currentValue, { dias_tratamiento, key }) => {
        return (
          <>
            {["pagar"].includes(accion) ? (
              <InputNumber
                min={0}
                size="small"
                controls={false}
                defaultValue={dias_tratamiento}
                onChange={(value: any) => {
                  if (value) {
                    const data = detallePago.map((item) => {
                      if (item.key == key) {
                        return { ...item, dias_tratamiento: value };
                      } else {
                        return item;
                      }
                    });
                    setDetallePago(data);
                  } else {
                    const data = detallePago.map((item) => {
                      if (item.key == key) {
                        return { ...item, dias_tratamiento: 0 };
                      } else {
                        return item;
                      }
                    });
                    setDetallePago(data);
                  }
                }}
              />
            ) : (
              <Text>{currentValue}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      width: 100,
      align: "center",
    },
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      width: 100,
      align: "center",
    },
    {
      title: "Fecha Vencimiento",
      key: "fecha_vencimiento",
      dataIndex: "fecha_vencimiento",
      width: 100,
      align: "center",
    },
    {
      title: "Acciones",
      key: "acciones",
      dataIndex: "acciones",
      width: 100,
      align: "center",
      render: (_, { key }) => {
        return (
          <>
            <Space>
              <Tooltip title="Remover item">
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setDetallePago(
                      detallePago.filter((item) => item.key != key)
                    )
                  }
                />
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  if (convenio?.aut_detalle == "1") {
    columnsPago.splice(1, 0, {
      title: "Autorización",
      dataIndex: "autDet",
      key: "autDet",
      align: "center",
      fixed: "left",
      width: 130,
      render: (_, { key, autDet }) => {
        return (
          <>
            <Input
              defaultValue={autDet ? autDet : ""}
              maxLength={parseInt(convenio.num_caracter_det)}
              onChange={(value: any) =>
                setDetallePago(
                  detallePago.map((item) => {
                    if (key == item.key) {
                      return { ...item, autDet: value.target.value };
                    } else {
                      return item;
                    }
                  })
                )
              }
            />
          </>
        );
      },
    });
  }

  const clearValues = () => {
    control.setValue("paciente_id", "");
    control.setValue("nombre_completo", "");
    control.setValue("tipo_regimen", null);
    form.setFieldValue("nombre_completo", null);
    form.setFieldValue("regimen", null);
    form.setFieldValue("categoria", null);
    form.setFieldValue("valor", null);
    form.setFieldValue("entidad", null);
    setPaciente(undefined);
  };

  const clearValuesMedico = () => {
    control.setValue("medico_id", "");
    control.setValue("nombre_medico", "");
    form.setFieldValue("nombre_completo_m", null);
  };

  const handleSetDetallePago = (lotes: DataTypeLote[]) => {
    const newData: DataTypePago[] = lotes.map((item) => {
      const precio_subtotal = item.cantidad * item.precio_lista;
      let precio_iva = 0;
      if (convenio?.iva == "1") {
        precio_iva = precio_subtotal * (item.iva / 100);
      }
      const precio_total = precio_subtotal + precio_iva;
      return {
        ...item,
        cantSol: item.cantidad,
        autDet: null,
        precio_subtotal,
        precio_iva,
        precio_total,
      };
    });
    setDetallePago(detallePago.concat(newData));
  };

  const onFinishPendiente: SubmitHandler<any> = async (data: any) => {
    setDisableButton(true);
    data.pendiente_id = id; // Id del pendiente para almacenar en la dispensacion
    data.dispensacion = documentoInfo;
    setLoader(true);

    if (accion == "pagar") {
      data.ivaConv = convenio?.iva;
      data.dispensacion = null;
      // Se toma La bodega en donde estoy logeado para generar el consecutivo de la DISPENSACION de pago
      data.bodega_id = getSessionVariable(KEY_BODEGA);

      if (convenio?.aut_detalle == "1") {
        const isAutDetFieldEmpty = data.detalle.some(
          (item: DataTypePago) => !item.autDet?.trim()
        );
        if (isAutDetFieldEmpty) {
          notificationApi.open({
            type: "error",
            message:
              'El campo "Autorización Detalle" debe ser llenado en todas las filas.',
          });
          setLoader(false);
          return;
        }
      }

      crearDispensacion(data)
        .then(({ data: { data } }) => {
          const message = `La dispensación con ID ${data[0]?.consecutivo} se creó exitosamente.`;
          notificationApi.open({
            type: "success",
            message: message,
          });

          const dispensacion_id = data[0]?.id;

          if (data[0].consecutivo_recaudo) {
            getDispensacionTirillaPdf(dispensacion_id.toString()).then(
              (data) => {
                const file = new Blob([data.data], { type: "application/pdf" });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
              }
            );
          }

          confirm({
            icon: <QuestionCircleOutlined />,
            cancelText: "No",
            cancelButtonProps: { danger: true, type: "primary" },
            content: (
              <div style={{ textAlign: "center" }}>
                ¿Desea imprimir la dispensación?
              </div>
            ),
            okButtonProps: {
              type: "primary",
              style: { background: "#f9af11", borderColor: "#f9af11" },
            },
            okText: "Sí",
            onOk() {
              generarPDF(dispensacion_id);
              setTimeout(() => {
                navigate(`/${url[1]}/${url[2]}/${url[3]}`);
              }, 2500);
            },
            onCancel() {
              setTimeout(() => {
                navigate(`/${url[1]}/${url[2]}/${url[3]}`);
              }, 2500);
            },
          });
        })
        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data.message,
          });
          setLoader(false);
        })
        .finally(() => {
          setDisableButton(false);
        });
    } else if (accion == "create") {
      data.bodega_id = getSessionVariable(KEY_BODEGA);
      data.convenio_id2 = convenio?.id;
      data.flag = 1;
      // data.flag_update = 1;
      data.paciente_id = paciente?.id;
      // data.disId = data.dispensacion.id;
      data.diagId = documentoInfo?.diagnosticos.id;
      data.despa = documentoInfo?.despacho;
      data.concep = documentoInfo?.conceptos.id;
      data.fecha_formula = dayjs(data.fecha_formula).format("YYYY-MM-DD");
      crearPendiente(data)
        .then(({ data: { data } }) => {
          const message = `El pendiente con ID ${data[0]?.consecutivo} se creó exitosamente.`;
          notificationApi.open({
            type: "success",
            message: message,
          });

          setTimeout(() => {
            navigate(`/${url[1]}/${url[2]}/${url[3]}`);
          }, 2500);
        })
        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data.message,
          });
          setLoader(false);
        })
        .finally(() => {
          setDisableButton(false);
        });
    } else if (accion == "edit") {
      updatePEND(data, id)
        .then(() => {
          message.open({
            type: "success",
            content: "Documento actualizado correctamente!",
          });
          setTimeout(() => {
            navigate(`/${url[1]}/${url[2]}/${url[3]}`);
          }, 2500);
        })
        .catch((error) => {
          if (error.response) {
            const responseData = error.response.data;
            const errorMessage = responseData.message;

            setTimeout(() => {
              message.open({
                type: "error",
                content: errorMessage,
              });
            }, 3000);
          } else {
            console.error("Error:", error.message);
          }
          setLoader(false);
        })
        .finally(() => {
          setDisableButton(false);
        });
    }
  };

  return (
    <>
      {contextHolder}
      <ModalProductos
        open={openFlag}
        setOpen={(value: boolean) => setOpenFlag(value)}
        key="modalProductos"
        onSetDataSource={(productos: any[]) => handleSetDetalle(productos)}
        convenio={convenio}
        bodega_id={bodega_id}
      />
      <ModalPaciente
        open={openModalPaciente}
        setOpen={(value: boolean) => setOpenModalPaciente(value)}
        paciente={paciente}
        setPaciente={(value: Paciente) => {
          setPaciente(value);
          control.setValue("paciente_id", value.id);
        }}
        numero_identificacion={control.getValues("numero_identificacion")}
        tipo_documento={form.getFieldValue("tipo_documento")}
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
      <ModalMedico
        open={openModalMedico}
        setOpen={(value: boolean) => setOpenModalMedico(value)}
        medico={medico}
        setMedico={(value: Medico) => {
          setMedico(value);
          control.setValue("medico_id", value.id);
        }}
        numero_identificacion={control.getValues("numero_identificacion_m")}
      />
      {["pagar"].includes(accion) ? (
        <ModalPagoProductos
          open={openModalPago}
          setOpen={(value: boolean) => setOpenModalPago(value)}
          productos={dataSource.filter((item) => item.estado == "1")}
          pendiente_id={id}
          convenio={convenio}
          handleSetDetalle={(lotes: DataTypeLote[]) =>
            handleSetDetallePago(lotes)
          }
          detalle={detallePago}
          dispensacionesPagadas={documentoInfo?.dispensaciones_pagadas}
        />
      ) : null}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              {accion === "create"
                ? "Nuevo Documento Pendientes"
                : "Pendiente Id:"}{" "}
              {id && documentoInfo ? ` ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout={"vertical"}
            form={form}
            onKeyDown={(e: any) => checkKeyDown(e)}
            onFinish={control.handleSubmit(onFinishPendiente)}
          >
            <Row gutter={[12, 12]}>
              {camposErrorRegimen.length > 0 &&
              ["create", "pagar"].includes(accion) ? (
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
                            Los siguientes campos no coinciden con el régimen del
                            convenio, por favor validar y corregir:
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
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={24} md={24} lg={12}>
                    <Controller
                      name="convenio_id"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Convenio:"}>
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
                              onSelect={handleSetConvenio}
                              notFoundContent={null}
                              options={selectTipo}
                              status={error && "error"}
                              disabled={disabledConv}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
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
                  <Col xs={24} sm={12} md={12} lg={6}>
                    {convenio && convenio.aut_cabecera == "1" ? (
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
                              disabled={
                                !convenioSeleccionado &&
                                documentoInfo?.autorizacion_cabecera != null
                              }
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : null}
                  </Col>
                </Row>
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
                              <Input placeholder="Tipo Documento" disabled />
                            </StyledFormItem>
                          </Col>
                        ) : null}
                        <Col
                          xs={24}
                          md={["show", "anular"].includes(accion) ? 12 : 24}
                        >
                          <Controller
                            name="numero_identificacion"
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message: "Documento Paciente es requerido",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem
                                required
                                label={"Documento paciente:"}
                              >
                                {accion === "edit" ||
                                accion === "anular" ||
                                accion === "pagar" ? (
                                  <Input {...field} disabled />
                                ) : (
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
                                        control.setValue("categoria", "");
                                        control.setValue("valor", "");
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
                                      // handleSearchUser(event);
                                      checkCoincidenciasPaciente(event);
                                    }}
                                    onBlur={(event: any) => {
                                      // handleSearchUser(event);
                                      checkCoincidenciasPaciente(event);
                                    }}
                                    status={error && "error"}
                                    disabled={!convenioSeleccionado}
                                  />
                                )}
                                <Text type="danger">{error?.message}</Text>
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
                        <StyledFormItem label={"Nombre Completo Paciente:"}>
                          <Space.Compact style={{ width: "100%" }}>
                            <Input {...field} disabled />
                            {["create", "edit"].includes(accion) ? (
                              <Button
                                type="primary"
                                onClick={() => setOpenModalPaciente(true)}
                                disabled={!convenioSeleccionado}
                              >
                                {paciente ? <EditOutlined /> : <PlusOutlined />}
                              </Button>
                            ) : null}
                          </Space.Compact>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={12}>
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
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Controller
                      name="valor"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Cuota Moderadora:"}>
                          <Space.Compact style={{ width: "100%" }}>
                            <Select
                              {...field}
                              suffixIcon={
                                ["create", "edit", "pagar"].includes(accion) &&
                                control.getValues("cuota_moderadora") ==
                                  "SI" ? (
                                  <DownOutlined />
                                ) : null
                              }
                              defaultOpen={true}
                              open={editCuotaModeradora}
                              onSelect={() => setEditCuotaModeradora(false)}
                              status={error && "error"}
                              options={selectCuotaModeradora}
                              disabled={!editCuotaModeradora}
                            />
                            {["create", "pagar"].includes(accion) &&
                            control.getValues("cuota_moderadora") == "SI" ? (
                              <Button
                                type="primary"
                                onClick={() => {
                                  setEditCuotaModeradora(!editCuotaModeradora);
                                  control.setFocus("valor");
                                }}
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
                  <Col xs={24} sm={12} md={12} lg={6}>
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
                        <StyledFormItem label={"Documento médico:"} required>
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
                              disabled={!convenioSeleccionado}
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
                                onClick={() => setOpenModalMedico(true)}
                                disabled={!convenioSeleccionado}
                              >
                                {medico ? <EditOutlined /> : <PlusOutlined />}
                              </Button>
                            ) : null}
                          </Space.Compact>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={24}>
                    <Controller
                      name="diagnostico_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Diagnóstico Principal es requerida",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label={"Diagnóstico Médico Principal:"}
                        >
                          <Spin
                            spinning={loaderDiagnostico}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              suffixIcon={null}
                              filterOption={false}
                              placeholder={
                                "Buscar Diagnóstico Médico Principal"
                              }
                              onSearch={handleSearchDiagnostico}
                              onSelect={handleSelectDiagnostico}
                              notFoundContent={null}
                              options={selectDiagnostico}
                              status={error && "error"}
                              disabled={!convenioSeleccionado}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={24}>
                    <Controller
                      name="diagnostico_rel_id"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Diagnostico Relacionado:"}>
                          <Spin
                            spinning={loaderDiagnostico}
                            indicator={<LoadingOutlined spin />}
                            style={{
                              backgroundColor: "rgb(251 251 251 / 70%)",
                            }}
                          >
                            <Select
                              {...field}
                              showSearch
                              suffixIcon={null}
                              filterOption={false}
                              placeholder={"Buscar Diagnóstico Relacionado"}
                              onSearch={handleSearchDiagnostico}
                              onSelect={handleSelectDiagnostico}
                              notFoundContent={null}
                              options={selectDiagnosticoRel}
                              status={error && "error"}
                              disabled={!convenioSeleccionado}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Controller
                      name="fecha_formula"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Fecha de formula es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Fecha formula:"}>
                          {accion !== "create" ? (
                            <Input
                              {...field}
                              disabled
                              status={error && "error"}
                            />
                          ) : (
                            <DatePicker
                              {...field}
                              style={{ width: "100%" }}
                              placeholder="Fecha Formula"
                              maxDate={dayjs()}
                              format={"DD/MM/YYYY"}
                              disabled={!convenioSeleccionado}
                              status={error && "error"}
                            />
                          )}
                        </StyledFormItem>
                      )}
                    />
                  </Col>
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
                        <StyledFormItem required label={"Numero formula:"}>
                          <Input
                            {...field}
                            disabled={!convenioSeleccionado}
                            placeholder="Número formula"
                            status={error && "error"}
                          />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
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
                          label={"Centro Clínico Formula:"}
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
                                  .includes(input.toString().toLowerCase())
                              }
                              popupMatchSelectWidth={400}
                              placeholder={"Buscar Centro Clínico"}
                              notFoundContent={null}
                              options={selectTipoEntidad}
                              disabled={!convenioSeleccionado}
                              status={error && "error"}
                            />
                          </Spin>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <Controller
                      name="despacho_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Despacho es requerido",
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
                            disabled={["show", "anular", "cancelar"].includes(
                              accion
                            )}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="concepto_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Concepto es requerida",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Concepto:"}>
                          <Select
                            {...field}
                            showSearch
                            filterOption={(input, option: any) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            placeholder={"Buscar concepto medico"}
                            notFoundContent={null}
                            options={selectConcepto}
                            status={error && "error"}
                            disabled={!convenioSeleccionado}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Controller
                      name="tipo_consulta"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Tipo Consulta es requerida",
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
                            placeholder={"Buscar tipo de  consulta"}
                            notFoundContent={null}
                            options={selectTipoConsulta}
                            status={error && "error"}
                            disabled={!convenioSeleccionado}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  {["cancelar", "show"].includes(accion) ? (
                    <Col xs={24} sm={24}>
                      <Controller
                        name="motivo_cancelacion"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required
                            label={"Motivo de Cancelación:"}
                          >
                            <Select
                              {...field}
                              placeholder="Motivo de cancelacion"
                              status={error && "error"}
                              options={[
                                {
                                  label:
                                    "PACIENTE NUNCA RECLAMO O NO AUTORIZO DOMICILIO DE LOS MEDICAMENTOS",
                                  value:
                                    "PACIENTE NUNCA RECLAMO O NO AUTORIZO DOMICILIO DE LOS MEDICAMENTOS",
                                },
                                {
                                  label:
                                    "SE PAGO EL PENDIENTE CON UNA CANTIDAD DIFERENTE POR PRESENTACION DEL MEDICAMENTO",
                                  value:
                                    "SE PAGO EL PENDIENTE CON UNA CANTIDAD DIFERENTE POR PRESENTACION DEL MEDICAMENTO",
                                },
                                {
                                  label:
                                    "PACIENTE NO RECIBE LOS MEDICAMENTOS PENDIENTES Y RECLAMA CON FORMULA NUEVA",
                                  value:
                                    "PACIENTE NO RECIBE LOS MEDICAMENTOS PENDIENTES Y RECLAMA CON FORMULA NUEVA",
                                },
                                {
                                  label:
                                    "USUARIO NO CUENTA CON AUTORIZACIÓN VIGENTE",
                                  value:
                                    "USUARIO NO CUENTA CON AUTORIZACIÓN VIGENTE",
                                },
                                {
                                  label:
                                    "USUARIO NO CUENTA CON SOPORTE DE FÓRMULA MÉDICA Y TAMPOCO ESTÁ DIGITALIZADA EN EL APLICATIVO SEBTHI",
                                  value:
                                    "USUARIO NO CUENTA CON SOPORTE DE FÓRMULA MÉDICA Y TAMPOCO ESTÁ DIGITALIZADA EN EL APLICATIVO SEBTHI",
                                },
                                {
                                  label:
                                    "PENDIENTE PAGADO POR OPERADOR LOGISTICO",
                                  value:
                                    "PENDIENTE PAGADO POR OPERADOR LOGISTICO",
                                },
                                {
                                  label:
                                    "PENDIENTE REALIZADO CON REGISTRO MEDICO",
                                  value:
                                    "PENDIENTE REALIZADO CON REGISTRO MEDICO",
                                },
                                {
                                  label:
                                    "PENDIENTE REALIZADO CON DATOS INCORRECTOS (DIAGNOSTICO)",
                                  value:
                                    "PENDIENTE REALIZADO CON DATOS INCORRECTOS (DIAGNOSTICO)",
                                },
                                {
                                  label:
                                    "CORRECCIÓN DE DATOS DE PRESCRIPTOR POR ERROR EN DIGITACIÓN",
                                  value:
                                    "CORRECCIÓN DE DATOS DE PRESCRIPTOR POR ERROR EN DIGITACIÓN",
                                },
                              ]}
                              disabled={["show"].includes(accion)}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                  ) : null}

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
                              ["pagar"].includes(accion)
                                ? false
                                : !convenioSeleccionado
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[12, 12]}>
                  {["create", "edit", "pagar"].includes(accion) ? (
                    <Col
                      xs={24}
                      md={{ offset: 12, span: 12 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          switch (accion) {
                            case "create":
                            case "edit":
                              setOpenFlag(true);
                              break;
                            case "pagar":
                              setOpenModalPago(true);
                              break;
                          }
                        }}
                        style={{ color: "white" }}
                        disabled={disableAddButton}
                      >
                        <Text style={{ color: "white" }}>
                          <PlusOutlined /> Agregar Item
                        </Text>
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </Col>
              <Col span={24}>
                {["pagar"].includes(accion) ? (
                  <Table
                    dataSource={detallePago}
                    columns={columnsPago}
                    size="small"
                    pagination={{
                      hideOnSinglePage: true,
                      simple: false,
                      pageSize: 10,
                    }}
                  />
                ) : (
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    size="small"
                    pagination={{
                      hideOnSinglePage: true,
                      simple: false,
                      pageSize: 10,
                    }}
                  />
                )}
              </Col>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  <Link to={toValue} relative="path">
                    <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                      Volver
                    </Button>
                  </Link>
                  {/* {accion == "pagar" ? (
                    <Button
                      type="primary"
                      icon={<UnorderedListOutlined />}
                      onClick={handleOpenModalPendientes}
                    >
                      Listar detalle
                    </Button>
                  ) : null} */}
                  {!flagAcciones ? (
                    <>
                      {["create", "edit", "pagar"].includes(accion) ? (
                        <Button
                          htmlType="submit"
                          type="primary"
                          disabled={
                            disableButton || camposErrorRegimen.length > 0
                          }
                          icon={<SaveOutlined />}
                        >
                          Guardar
                        </Button>
                      ) : null}
                      {accion == "anular" ? (
                        <Popconfirm
                          title="¿Desea anular este documento?"
                          onConfirm={() => cambiarEstado()}
                          placement="left"
                          //disabled={false}
                          disabled={false} // Deshabilita si no se puede eliminar
                        >
                          <Tooltip title="Anular">
                            <Button htmlType="button" type="primary" danger>
                              <StopOutlined />
                              Cancelar
                            </Button>
                          </Tooltip>
                        </Popconfirm>
                      ) : null}
                      {accion == "cancelar" ? (
                        <Popconfirm
                          title="¿Desea cancelar este documento?"
                          onConfirm={() => cambiarEstado()}
                          placement="left"
                          disabled={false}
                        >
                          <Tooltip title="Cancelar">
                            <Button htmlType="button" type="primary" danger>
                              <CloseOutlined />
                              Cancelar
                            </Button>
                          </Tooltip>
                        </Popconfirm>
                      ) : null}
                    </>
                  ) : null}
                </Space>
              </Col>
            </Row>
          </Form>
        </StyledCard>
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
          onCancel={closeDispensacionModal}
          closeIcon={false}
          style={{ top: 10 }}
          width={1200}
          destroyOnClose={true}
          maskClosable={false}
          footer={[
            <div key="footer" style={{ textAlign: "center" }}>
              <Button type="primary" onClick={dispensarPaciente}>
                Sí
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => window.location.reload()}
              >
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
                    <p style={{ color: "red" }}>
                      El Paciente ha tenido dispensaciones en los últimos 30
                      días
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
      </Spin>
    </>
  );
};
