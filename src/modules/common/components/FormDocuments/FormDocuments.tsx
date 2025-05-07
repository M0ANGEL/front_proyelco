/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL, BASE_URL } from "@/config/api";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { searchTerceros } from "@/services/admin-terceros/tercerosAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CustomUpload, SearchBar, StyledText } from "./styled";
import useSessionStorage from "../../hooks/useSessionStorage";
import { ModalProductosLotes } from "../ModalProductosLotes";
import useArrayBuffer from "../../hooks/useArrayBuffer";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { DocumentosCabecera } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import { ModalProductos } from "../ModalProductos";
import { CamposEstados, DataType } from "./types";
import { ColumnsType } from "antd/es/table";
import {
  validarAccesoDocumento,
  cambiarEstadoOtrDoc,
  downloadTemplate,
  updateOtrDoc,
  crearOtrDoc,
  getInfoSOB,
  deleteItem,
  getMotivos,
} from "@/services/documentos/otrosAPI";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  InputNumber,
  UploadProps,
  DatePicker,
  Popconfirm,
  Typography,
  Button,
  Select,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

let timeout: ReturnType<typeof setTimeout> | null;

export const FormDocuments = () => {
  const { id } = useParams<{ id: string; sun_id: string }>();
  const [selectProveedor, setSelectProveedor] = useState<
    SelectProps["options"]
  >([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [accion, setAccion] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const { arrayBufferToString } = useArrayBuffer();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [detalleErrorMsg, setDetalleErrorMsg] = useState<string>("");
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [disabledUpload, setDisabledUpload] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [deletingRow, setDeletingRow] = useState<React.Key[]>([]);
  const [contadorMaster, setContadorMaster] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [title, setTitle] = useState<string>("");
  const [codigoDocumento, setCodigoDocumento] = useState<string>("");
  const [documentoInfo, setDocumentoInfo] = useState<DocumentosCabecera>();
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [btnSave, setBtnSave] = useState<boolean>(true);
  const [openFlagLotes, setOpenFlagLotes] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [optionsMotivos, setOptionsMotivos] = useState<SelectProps["options"]>(
    []
  );
  const [texto, setTexto] = useState<string>("");
  const [, setFlagLote] = useState<boolean>(false);
  const [columPrecio, setColumPrecio] = useState<number>(0);
  const control = useForm({
    mode: "onChange",
    defaultValues: {
      detalle: detalle,
      tipo_documento_id: 0,
      bodega_id: "",
      observacion: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      documento: "",
      bodega: "",
      tercero_id: "",
      fechaCierre: dayjs() || undefined || "",
      motivo_id: "",
      precio_promedio: 0,
    },
  });
  const watchColumPrecio = control.watch("motivo_id");

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = url_split[4];

    setAccion(accion);

    const codigo_documento = url_split[3];
    setLoader(true);
    setCodigoDocumento(codigo_documento.toUpperCase());
    setDisabledUpload(false);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        if (data) {
          setTitle(data.documento_info.descripcion);
          const campos = data?.documento_info?.cabeceras?.map((item) => ({
            nombre_campo: item.campo.nombre_campo,
            id_campo: item.id_campo,
            estado: item.estado,
          }));
          setCamposEstados(campos);
          control.setValue("tipo_documento_id", data.documento_info.id);
          control.setValue("documento", data.documento_info.descripcion);

          // Aqui se valida cada permiso y en caso de no contar con el permiso segun la accion se realiza el debido control
          if (data.crear !== "1" && accion == "create") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para crear!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.modificar !== "1" && accion == "edit") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para modificar!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.consultar !== "1" && accion == "show") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para consultar!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
          if (data.anular !== "1" && accion == "anular") {
            notificationApi.open({
              type: "error",
              message: "No tienes permisos para anular!",
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 1500);
            return;
          }
        } else {
          notificationApi.open({
            type: "error",
            message: "No tienes permisos para acceder a este documento!",
          });
          setTimeout(() => {
            navigate(`/${url_split.at(1)}`);
            setLoader(false);
          }, 1500);
        }
      });
    }

    if (id) {
      getInfoSOB(id).then(({ data: { data } }) => {
        setDocumentoInfo(data);
        // Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
        // caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
        if (["2", "3", "4"].includes(data.estado)) {
          setFlagAcciones(true);
          const estado =
            data.estado == "2"
              ? "en proceso"
              : data.estado == "3"
              ? "cerrado"
              : "anulado";
          if (["create", "edit", "anular"].includes(accion)) {
            notificationApi.open({
              type: "error",
              message: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
            });
            setTimeout(() => {
              navigate(
                `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
              );
            }, 2500);
            return;
          }
        }

        form.setFieldValue("fecha", dayjs(data.created_at));
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id.toString());
        control.setValue("bodega", data.bodega.bod_nombre);
        control.setValue("tercero_id", data.tercero?.nit);
        control.setValue("fechaCierre", dayjs(data.fecha_cierre_contable));
        control.setValue(
          "motivo_id",
          data.motivos != null ? data.motivos.descripcion : ""
        );

        if (data && codigo_documento == "SUN") {
          const option = {
            value: data.tercero.id,
            label: `${data.tercero.nit} - ${data.tercero.razon_soc}`,
          };
          setSelectProveedor([option]);
          control.setValue("tercero_id", data.tercero.nit);
        }

        getBodegasSebthi().then(({ data: { data } }) => {
          const bodegas = data
            .filter(
              (item) => item.id_empresa == getSessionVariable(KEY_EMPRESA)
            )
            .map((item) => {
              return { label: item.bod_nombre, value: item.id };
            });
          setOptionsBodegas(bodegas);
        });

        getMotivos().then(({ data: { data } }) => {
          const documento = control.getValues("tipo_documento_id").toString();
          const motivos = data
            .filter((item: any) => item.tipo_documento_id.includes(documento))
            .map((item: any) => {
              return { label: item.descripcion, value: item.id };
            })
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setOptionsMotivos(motivos);
        });

        const detalle: DataType[] = data.detalle.map((item) => {
          const precio_subtotal =
            parseInt(item.cantidad) * parseFloat(item.precio_promedio);
          const precio_iva =
            parseFloat(precio_subtotal.toString()) *
            (parseFloat(item.iva) / 100);
          const precio_total = precio_subtotal + precio_iva;

          // }
          const key = `${item.producto_id}_${item.lote}_${item.fecha_vencimiento}`;

          return {
            key,
            id: item.producto.id,
            descripcion: item.producto.descripcion,
            cantidad: parseInt(item.cantidad),
            precio_promedio: parseFloat(item.precio_promedio),
            lote: item.lote,
            fvence: dayjs(item.fecha_vencimiento).format("YYYY-MM-DD"),
            iva: parseFloat(item.iva),
            precio_iva: precio_iva,
            precio_subtotal: precio_subtotal,
            precio_total: precio_total,
            itemFromModal: false,
            cantidad_devolver: item.cantidad,
          };
        });

        control.setValue("detalle", detalle);
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        setDataSource(detalle);
        setInitialData(detalle);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        control.setValue("bodega_id", data.id.toString());
        control.setValue("bodega", data.bod_nombre);
        form.setFieldValue("fecha", dayjs(new Date()));
        setLoader(false);
      });

      getBodegasSebthi().then(({ data: { data } }) => {
        const bodegas = data
          .filter((item) => item.id_empresa == getSessionVariable(KEY_EMPRESA))
          .map((item) => {
            return { label: item.bod_nombre, value: item.id.toString() };
          });
        setOptionsBodegas(bodegas);
      });
      getMotivos().then(({ data: { data } }) => {
        const documento = control.getValues("tipo_documento_id").toString();
        const motivos = data
          .filter((item: any) => item.tipo_documento_id.includes(documento))
          .map((item: any) => {
            return { label: item.descripcion, value: item.id };
          })
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setOptionsMotivos(motivos);
      });
    }
  }, []);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;

    dataSource.forEach(
      (item) => {
        if ([14].includes(columPrecio)) {
          subtotal += item.cantidad * item.precio_promedio;
          iva += item.precio_iva;
          total += subtotal + iva;
        } else {
          subtotal += item.precio_subtotal;
          iva += item.precio_iva;
          total += item.precio_total;
        }
      },
      [detalle]
    );

    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [dataSource]);

  useEffect(() => {
    control.setValue("detalle", dataSource);
    if (dataSource.length > 0) {
      setBtnSave(false);
    } else {
      setBtnSave(true);
    }
  }, [dataSource]);

  useEffect(() => {
    setColumPrecio(parseInt(control.getValues("motivo_id")));
  }, [watchColumPrecio]);

  const handleSetDetalle = (productos: DataType[]) => {
    let contador = contadorMaster;
    const data: DataType[] = [];

    for (let x = 0; x < productos.length; x++) {
      dataSource.find((item) => item.key == productos[x].key);
      data.push({ ...productos[x], key: `${productos[x].key}_${contador}` });
      contador++;
    }
    setContadorMaster(contador);
    setDataSource(dataSource.concat(data));
    setInitialData(dataSource.concat(data));
    control.setValue("detalle", dataSource.concat(data));
  };

  const handleChangeAmount = (value: any, key: React.Key, origen: string) => {
    const newDataFilter = dataSource.map((item) => {
      let llave;
      if (item.itemFromModal) {
        llave = key;
      } else {
        llave = key.toString().split("_")[0];
      }

      if (item.key === llave) {
        let cantidad = item.cantidad;
        let lote = item.lote;
        let fvence = item.fvence;
        let precio_promedio = item.precio_promedio;
        let precio_iva = item.precio_iva;
        switch (origen) {
          case "cantidad":
            cantidad = parseInt(value) > 0 ? parseInt(value) : cantidad;
            break;
          case "lote":
            lote = value.target.value.replace(/[^A-Za-z0-9-]/g, "");
            break;
          case "vencimiento":
            fvence = dayjs(value).format("YYYY-MM-DD");
            handleChangeEdit(key, "vencimiento");
            break;
          case "precio_promedio":
            precio_promedio =
              parseInt(value) > 0 ? parseInt(value) : precio_promedio;
            precio_iva = precio_promedio * (item.iva / 100) * item.cantidad;
            break;
          // default:
          //   break;
        }
        return { ...item, cantidad, lote, fvence, precio_promedio, precio_iva };
      } else {
        return item;
      }
    });

    setDataSource(newDataFilter);
    setInitialData(newDataFilter);
  };

  const handleChangeEdit = (key: React.Key, origen: string) => {
    const newData = [...dataSource];

    let target;
    if (["create", "edit"].includes(accion)) {
      target = newData.find((item) => item.key === key);
    } else {
      target = newData.find(
        (item) => item.key === key.toString().split("_")[0]
      );
    }

    if (target) {
      if (origen == "cantidad") {
        target.editable = target.editable ? false : true;
      } else if (origen == "lote") {
        target.editableLote = target.editableLote ? false : true;
      } else if (origen == "vencimiento") {
        target.editableVen = target.editableVen ? false : true;
      } else if (origen == "precio_promedio") {
        target.editablePre = target.editableVen ? false : true;
      }

      setDataSource(newData);
      setInitialData(newData);
    }
  };

  const handleDeleteProducto = (key: React.Key, itemFromModal: boolean) => {
    if (["create"].includes(accion) || itemFromModal) {
      setDataSource(dataSource.filter((item) => item.key != key));
    } else {
      setDeleteLoader(true);
      deleteItem({
        doc_id: id,
        producto_id: key.toString().split("_")[0],
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Código", // titulo del encabezado de la columna
      dataIndex: "id", // nombre del campo en el arreglo datsource
      key: "id", // nombre del identificador unico
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 70,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      // width: 300,
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 90,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editable && ["create", "edit"].includes(accion) ? (
                <InputNumber
                  autoFocus
                  defaultValue={record.cantidad == 0 ? "" : record.cantidad}
                  size="small"
                  onBlur={() => handleChangeEdit(record.key, "cantidad")}
                  onChange={(e: any) =>
                    handleChangeAmount(e, record.key, "cantidad")
                  }
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "cantidad")}
                >
                  {record.cantidad}
                </StyledText>
              )
            ) : (
              <Text>{record.cantidad}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      fixed: "right",
      width: 130,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editableLote && ["create", "edit"].includes(accion) ? (
                <Input
                  autoFocus
                  defaultValue={record.lote == "" ? "" : record.lote}
                  size="small"
                  onBlur={() => handleChangeEdit(record.key, "lote")}
                  onChange={(e: any) => {
                    handleChangeAmount(e, record.key, "lote");
                  }}
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "lote")}
                >
                  {record.lote}
                </StyledText>
              )
            ) : (
              <Text>{record.lote}</Text>
            )}
          </>
        );
      },
    },
    {
      title: "Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      align: "center",
      fixed: "right",
      width: 170,
      render: (_, record) => {
        return (
          <>
            {["SOB", "AEN"].includes(codigoDocumento) &&
            record.itemFromModal ? (
              record.editableVen && ["create", "edit"].includes(accion) ? (
                <DatePicker
                  inputReadOnly={true}
                  defaultValue={
                    record.fvence == ""
                      ? dayjs(new Date())
                      : dayjs(record.fvence)
                  }
                  allowClear={false}
                  format={"YYYY-MM-DD"}
                  placeholder="Vencimiento"
                  style={{ width: "100%" }}
                  defaultOpen={true}
                  onChange={(fecha: any) => {
                    setFlagLote(false);
                    handleChangeAmount(fecha, record.key, "vencimiento");
                  }}
                  // onBlur={() => handleChangeEdit(record.key, "vencimiento")}
                  disabledDate={
                    !["cotizaciones"].includes(user_rol)
                      ? (current) =>
                          current < dayjs().endOf("day").subtract(1, "day")
                      : undefined
                  }
                />
              ) : (
                <StyledText
                  onClick={() => handleChangeEdit(record.key, "vencimiento")}
                >
                  {record.fvence}
                </StyledText>
              )
            ) : (
              <Text>{record.fvence}</Text>
            )}
          </>
        );
      },
    },
  ];

  if (accion == "create" || accion == "edit") {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render(_, { key, itemFromModal, cantidad }) {
        return (
          <>
            {accion == "create" || accion == "edit" ? (
              <Popconfirm
                title="¿Desea eliminar este item?"
                open={deletingRow.includes(key)}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                description={
                  <Space direction="vertical" size={1}>
                    <Text>
                      {`Al eliminarlo se devolverá al inventario la cantidad de ${cantidad}`}
                    </Text>
                  </Space>
                }
                okButtonProps={{
                  loading: deleteLoader,
                  danger: true,
                }}
                okText="Si"
                cancelText="No"
                onConfirm={() => handleDeleteProducto(key, itemFromModal)}
                onCancel={() => setDeletingRow([])}
                onOpenChange={(value: boolean) =>
                  handleOpenChange(value, key, itemFromModal)
                }
                disabled={deletingRow.length > 0}
              >
                <Button type="primary" size="small" danger>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            ) : null}
          </>
        );
      },
      width: 70,
    });
    if (["14"].includes(columPrecio.toString())) {
      columns.splice(2, 0, {
        title: "Precio",
        dataIndex: "precio_promedio",
        key: "precio_promedio",
        align: "center",
        fixed: "right",
        width: 130,
        render: (_, record) => {
          return (
            <>
              {record.editablePre && ["create", "edit"].includes(accion) ? (
                <InputNumber
                  autoFocus
                  defaultValue={record.precio_promedio == 0 ? "" : record.precio_promedio}
                  size="small"
                  onBlur={() => handleChangeEdit(record.key, "precio_promedio")}
                  onChange={(e: any) =>
                    handleChangeAmount(e, record.key, "precio_promedio")
                  }
                />
              ) : (
                <StyledText
                  onClick={() =>
                    handleChangeEdit(record.key, "precio_promedio")
                  }
                >
                  {record.precio_promedio}
                </StyledText>
              )}
            </>
          );
        },
      });
    }
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDataSource(filterTable);
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    setBtnSave(true);
    let flagCantidadDetalle;
    const keyProducto: React.Key[] = [];
    for (let index = 0; index < data.detalle.length; index++) {
      const producto = `${data.detalle[index]["descripcion"]}`;
      const lote = `${data.detalle[index]["lote"]}`;
      const fechavence = `${data.detalle[index]["fvence"]}`;
      const precio_promedio = `${data.detalle[index]["precio_promedio"]}`;
      const idkey = `${producto}_${lote}_${fechavence}`;
      data.fechaCierre = dayjs(data.fechaCierre).format("YYYY-MM-DD");

      if (["14"].includes(columPrecio.toString())) {
        data.detalle[index]["precio_subtotal"] =
          parseFloat(precio_promedio) * data.detalle[index]["cantidad"];
        data.detalle[index]["precio_total"] =
          data.detalle[index]["precio_subtotal"] +
          data.detalle[index]["precio_iva"];
      }

      if (data.detalle[index]["cantidad"] <= 0) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${producto} tiene cantidad menor o igual a cero, por favor ingresa el valor`,
        });
        setBtnSave(false);
      } else if (data.detalle[index]["lote"] == "") {
        notificationApi.open({
          type: "error",
          message: `El producto ${producto} no registra lote, por favor ingresa el valor`,
        });
        setBtnSave(false);
      } else if (
        keyProducto.find(
          (element) =>
            element.toString().toUpperCase() === idkey.toString().toUpperCase()
        )
      ) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${producto}, con lote ${lote} y fecha vencimiento ${fechavence} se encuentra duplicado`,
        });
        setBtnSave(false);
      }
      keyProducto.push(idkey);
    }

    if (!flagCantidadDetalle) {
      setDetalleErrorMsg("");
      setLoader(true);
      if (id) {
        updateOtrDoc(data, id)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento modificado con exito!`,
            });
            setBtnSave(false);
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
              setBtnSave(false);
            }
          );
      } else {
        crearOtrDoc(data)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento creado con exito!`,
            });
            setBtnSave(false);
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
              setBtnSave(false);
            }
          );
      }
    }
  };

  const anularDocumento = () => {
    const data = {
      doc_id: id,
      accion: accion,
    };
    cambiarEstadoOtrDoc(data)
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

  const uploadProps: UploadProps = {
    name: "OtrosDoc",
    action: `${BASE_URL}otrosDocumentos/cargueDoc`,
    data: {
      bodega_id: control.getValues("bodega_id"),
      documento_id: control.getValues("tipo_documento_id"),
      motivo: control.getValues("motivo_id"),
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
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xlsx",
        });
      }
      console.log(isExcel);
      return isExcel;
    },
    onChange(info) {
      setLoader(true);
      setInitialData([]);
      setDataSource([]);
      setDetalle([]);
      if (info.file.status !== "uploading") {
        setLoader(false);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        handleSetDetalle(info.file.response.data);
        notificationApi.open({
          type: "success",
          message: info.file.response.message,
        });
      } else if (info.file.status === "error") {
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
        });
      }
    },
  };

  /*** Funcion que permite la validacion de expresiones regulares en el campo observacion */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevoTexto = e.target.value;
    // Expresión regular que permite solo letras, números y espacios
    const regex = /^[a-zA-Z0-9\s]+$/;

    if (regex.test(nuevoTexto) || nuevoTexto == "") {
      setTexto(nuevoTexto);
      control.setValue("observacion", nuevoTexto);
    }
  };

  // Funcion para buscar el proveedor por medio de un query, esta consulta busca por NIT y nombre del proveedor
  const handleSearchProveedor = (query: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (query.length > 0) {
      timeout = setTimeout(() => {
        searchTerceros(query).then(({ data: { data } }) => {
          setSelectProveedor(
            data.map((item) => ({
              value: item.nit,
              label: `${item.nit} - ${item.razon_soc}`,
            }))
          );
        });
      }, 500);
    }
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date); // Actualiza el estado con la nueva fecha seleccionada
  // };

  return (
    <>
      {contextHolder}
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
              {title}
              {id && documentoInfo ? ` - ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          {contextHolder}
          <ModalProductos
            open={openFlag}
            setOpen={(value: boolean) => setOpenFlag(value)}
            key="modalProductos"
            onSetDataSource={(productos: DataType[]) =>
              handleSetDetalle(productos)
            }
          />
          <ModalProductosLotes
            open={openFlagLotes}
            setOpen={(value: boolean) => setOpenFlagLotes(value)}
            key="modalProductosLotes"
            detalle={dataSource}
            handleAddProducts={(productos: DataType[]) =>
              handleSetDetalle(productos)
            }
          />
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            form={form}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={{ span: 24, order: 2 }} sm={{ span: 6, order: 1 }}>
                    <Controller
                      name="bodega_id"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Bodega es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Bodega :">
                          {accion !== "create" ||
                          ["VEA"].includes(codigoDocumento) ? (
                            <Input {...field} readOnly />
                          ) : (
                            <Select
                              {...field}
                              showSearch
                              allowClear
                              options={optionsBodegas}
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24, order: 3 }} sm={{ span: 6, order: 2 }}>
                    {["create", "edit"].includes(accion) &&
                    ["SUN"].includes(codigoDocumento) ? (
                      <Controller
                        name="tercero_id"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Proveedor es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem label={"Proveedor:"} required>
                            {/* Este Select lo que hace es buscar el proveedor de acuerdo a lo que se digita en el Input, asi mismo alimenta el select 
                        y permite seleccionar un proveedor dentro de los resultados */}
                            <Select
                              {...field}
                              showSearch
                              filterOption={false}
                              placeholder={"Buscar proveedor"}
                              onSearch={handleSearchProveedor}
                              notFoundContent={null}
                              options={selectProveedor}
                              status={error && "error"}
                              disabled={
                                (id && ["show", "anular"].includes(accion)) ||
                                (["SUN"].includes(codigoDocumento) &&
                                  ["edit"].includes(accion))
                                  ? true
                                  : false
                              }
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : null}
                  </Col>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ offset: 6, span: 6, order: 3 }}
                  >
                    <StyledFormItem label={"Fecha :"} name={"fecha"}>
                      <DatePicker
                        disabled
                        format={"YYYY-MM-DD HH:mm"}
                        style={{ width: "100%" }}
                        suffixIcon={null}
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={6} order={4}>
                    <Controller
                      name="documento"
                      control={control.control}
                      render={({ field }) => (
                        <StyledFormItem label="Documento :">
                          <Input disabled {...field} />
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col
                    xs={{ span: 24, order: 1 }}
                    sm={{ offset: 12, span: 6, order: 5 }}
                  >
                    <Controller
                      name="fechaCierre"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          label={"Fecha Ultimo Cierre Contable :"}
                        >
                          <DatePicker
                            {...field}
                            defaultValue={dayjs(new Date())}
                            disabled={dayjs().date() > 21 ? true : false}
                            placeholder={"Fecha cierre contable"}
                            format={"YYYY-MM-DD"}
                            style={{ width: "100%" }}
                            disabledDate={(current) =>
                              current < dayjs().endOf("day").subtract(6, "day")
                            }
                            // suffixIcon={null}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col span={24} order={5}>
                    {estadosVisibles.includes(
                      camposEstados
                        ?.filter((item) => item.id_campo == "3")
                        .at(0)?.estado ?? ""
                    ) &&
                    !["14", "16"].includes(columPrecio.toString()) &&
                    !["AEN", "SOB", "FAL", "ASA"].includes(codigoDocumento) ? (
                      <Controller
                        name="observacion"
                        control={control.control}
                        rules={
                          {
                            required: {
                              value:
                                camposEstados
                                  ?.filter((item) => item.id_campo == "3")
                                  .at(0)?.estado === "2",
                              message: "Observación es requerido",
                            },
                            pattern: {
                              value: /^[a-zA-Z0-9\s]+$/,
                              message: "No se permiten caracteres especiales",
                            },
                          }
                          // : {}
                        }
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2"
                            }
                            label={
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.nombre_campo
                            }
                          >
                            <TextArea
                              {...field}
                              placeholder="Observación:"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              disabled={
                                accion == "create" || accion == "edit"
                                  ? false
                                  : true
                              }
                              onChange={handleInputChange}
                              defaultValue={texto}
                              maxLength={250}
                              showCount
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : (
                      <Controller
                        name="motivo_id"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Observación es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label="Observación :">
                            <Select
                              {...field}
                              allowClear
                              options={optionsMotivos}
                              disabled={
                                (id && ["show", "anular"].includes(accion)) ||
                                (["SUN"].includes(codigoDocumento) &&
                                  ["edit"].includes(accion))
                                  ? true
                                  : false
                              }
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    )}
                  </Col>
                  <Col xs={{ span: 24, order: 7 }} sm={{ span: 24, order: 7 }}>
                    {["14", "16"].includes(columPrecio.toString()) ? (
                      <Controller
                        name="observacion"
                        control={control.control}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            // required={
                            //   camposEstados
                            //     ?.filter((item) => item.id_campo == "3")
                            //     .at(0)?.estado === "2"
                            // }
                            label={"Observacion ( opcional )"}
                          >
                            <TextArea
                              {...field}
                              placeholder="Observación:"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              disabled={
                                accion == "create" || accion == "edit"
                                  ? false
                                  : true
                              }
                              onChange={handleInputChange}
                              defaultValue={texto}
                              maxLength={250}
                              showCount
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : null}
                  </Col>
                </Row>
              </Col>
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  {["create", "edit"].includes(accion) ? (
                    <>
                      <Col xs={12} sm={5}>
                        <Button
                          icon={<DownloadOutlined />}
                          disabled={disabledUpload}
                          block
                          onClick={() => {
                            setLoader(true);
                            let ruta="";
                            if(["14"].includes(watchColumPrecio.toString()) ? ruta = `ExampleUploadOtrosDocumentosPrecio.xlsx`:ruta=`ExampleUploadOtrosDocumentos.xlsx`)
                              downloadTemplate(ruta)
                              .then((response) => {
                                const url = window.URL.createObjectURL(
                                  new Blob([response.data])
                                );
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  ruta
                                ); // Utiliza el nombre del archivo proporcionado
                                document.body.appendChild(link);
                                link.click();
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
                              .finally(() => setLoader(false));
                          }}
                        >
                          Descargar plantilla
                        </Button>
                      </Col>
                      <Col xs={12} sm={5}>
                        <CustomUpload {...uploadProps}>
                          <Button
                            type="primary"
                            size="middle"
                            icon={<UploadOutlined />}
                            disabled={disabledUpload}
                            block
                          >
                            Cargar Archivo
                          </Button>
                        </CustomUpload>
                      </Col>
                      <Col
                        sm={{ offset: 6, span: 8 }}
                        xs={{ span: 24 }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="primary"
                          htmlType="button"
                          block
                          icon={<PlusOutlined />}
                          onClick={() => {
                            if (["SOB", "AEN"].includes(codigoDocumento)) {
                              setOpenFlag(true);
                            } else if (
                              ["FAL", "ASA", "SUN", "VEA"].includes(
                                codigoDocumento
                              )
                            ) {
                              setOpenFlagLotes(true);
                            }
                          }}
                        >
                          Agregar Producto
                        </Button>
                      </Col>
                    </>
                  ) : null}
                  <Col span={24}>
                    <SearchBar>
                      <Input placeholder="Buscar" onChange={handleSearch} />
                    </SearchBar>
                  </Col>
                  <Col span={24}>
                    {detalleErrorMsg != "" ? (
                      <Text type="danger">{detalleErrorMsg}</Text>
                    ) : null}
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                      }}
                      bordered
                      dataSource={dataSource == null ? initialData : dataSource}
                      columns={columns}
                      style={{
                        border:
                          detalleErrorMsg.length > 0 ? "1px solid red" : "none",
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Space>
                  <Link to={id ? "../.." : ".."} relative="path">
                    <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                      Volver
                    </Button>
                  </Link>
                  {!flagAcciones ? (
                    <>
                      {accion == "create" || accion == "edit" ? (
                        <Button
                          htmlType="submit"
                          type="primary"
                          disabled={btnSave}
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
      </Spin>
    </>
  );
};
