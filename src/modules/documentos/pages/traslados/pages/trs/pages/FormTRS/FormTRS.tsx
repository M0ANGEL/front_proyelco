/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BASE_URL, KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CamposEstados, DataType, RespondeCarguePlano } from "./types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBodega, getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { downloadTemplate } from "@/services/documentos/otrosAPI";
import { Bodega, Traslados, UserData } from "@/services/types";
import { fetchUserProfile } from "@/services/auth/authAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useState, useEffect, useMemo } from "react";
import { ModalProductos } from "../../components";
import { ColumnsType } from "antd/es/table";
import { CustomUpload } from "./styled";
import {
  validarAccesoDocumento,
  cambiarEstadoTRS,
  getInfoEstadoTRS,
  getTrasladosPdf,
  updateTrsLote,
  getInfoTRS,
  updateTRS,
  crearTRS,
} from "@/services/documentos/trsAPI";
import {
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  UploadOutlined,
  FilePdfFilled,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Popconfirm,
  Typography,
  Tooltip,
  Button,
  Select,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Row,
  Col,
  UploadProps,
} from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormTRS = () => {
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [documentoInfo, setDocumentoInfo] = useState<Traslados>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [hasFuente, setHasFuente] = useState<boolean>(false);
  const [evitarEdicion, setEvitarEdicion] = useState(false);
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [botonClicado, setBotonClicado] = useState(false);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [bodegasInfo, setBodegasInfo] = useState<Bodega[]>([]);
  const [userInfo, setUserInfo] = useState<UserData>();
  const [loader, setLoader] = useState<boolean>(true);
  const [bodDestino, setBodDestino] = useState(null);
  const { getSessionVariable } = useSessionStorage();
  const [, setLoaderSave] = useState<boolean>(true);
  const { arrayBufferToString } = useArrayBuffer();
  const [accion, setAccion] = useState<string>("");
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const user_rol = getSessionVariable(KEY_ROL);
  const { id } = useParams<{ id: string }>();
  const control = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const watchBodegaDestino = control.watch("bod_des");

  useEffect(() => {
    setBodDestino(watchBodegaDestino);
  }, [watchBodegaDestino]);

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => setUserInfo(userData));
  }, []);

  useMemo(() => {
    if (
      ["usuario", "calidad", "regente_farmacia"].includes(user_rol) &&
      userInfo?.has_bodegas == "1"
    ) {
      const bodegas: SelectProps["options"] = [];
      if (optionsBodegas && userInfo) {
        optionsBodegas.forEach((item: any) => {
          if (
            userInfo?.bodegas_habilitadas.includes(item.value) ||
            (documentoInfo &&
              documentoInfo.bod_destino.id.toString() == item.value)
          ) {
            bodegas.push(item);
          }
        });
      }
      setOptionsBodegas(bodegas);
    }
  }, [userInfo, user_rol, bodegasInfo, documentoInfo]);

  const calcularPrecioTotal2 = () => {
    let total = 0;
    selectedProducts.forEach((producto) => {
      total +=
        parseFloat(producto.cantidad) * parseFloat(producto.precio_promedio);
    });
    return total;
  };

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    setLoader(true);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      )
        .then(({ data: { data } }) => {
          if (data) {
            const campos = data?.documento_info?.cabeceras?.map((item) => ({
              nombre_campo: item.campo.nombre_campo,
              id_campo: item.id_campo,
              estado: item.estado,
            }));
            setCamposEstados(campos);
            control.setValue("tipo_documento_id", data.documento_info.id);

            if (data.crear !== "1" && accion == "create") {
              notificationApi.open({
                type: "error",
                message: "No tienes permisos para crear documento!",
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
          setLoader(false);
        })
        .finally(() => {
          setLoader(false);
        });
    }

    if (id) {
      getInfoTRS(id).then(({ data: { data } }) => {
        setDocumentoInfo(data);
        //Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
        //caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
        if (["2", "3", "4"].includes(data.estado)) {
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
        control.setValue("observacion", data.observacion);
        control.setValue("bod_destino", data.bod_origen);
        control.setValue("bod_origen", data.bod_origen.id);
        control.setValue("bod_o", data.bod_origen.bod_nombre);
        control.setValue("bod_des", data.bod_destino.id);
        control.setValue("bod_des_id", data.bod_destino.id);
        control.setValue("numero_servinte", data.numero_servinte);

        control.setValue("estado", data.estados.estado.toUpperCase());
        if (["3", "4", "5", "6"].includes(data.estado)) {
          setBotonClicado(true);
          setEvitarEdicion(true);
        }
        getBodegasSebthi().then(({ data: { data } }) => {
          setBodegasInfo(data);
          const bodegas = data
            .filter(
              (item) =>
                item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
                item.estado === "1"
            )
            .map((item) => {
              return { label: item.bod_nombre, value: item.id };
            });
          setOptionsBodegas(bodegas);
        });

        const fecha = new Date(data.created_at);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
          mes < 10 ? "0" + mes : mes
        }/${año}`;
        control.setValue("fecha", fechaFormateada);

        const detalle: any[] = data.detalle.map((item: any) => {
          return {
            key: item.id,
            id: item.producto_id,
            cantidad: parseInt(item.cantidad),
            descripcion: item.producto.descripcion,
            codigo_servinte: item.producto.cod_huv,
            precio_promedio: item.producto.precio_promedio,
            stock: item.stock,
            lote: item.lote,
            fvence: item.fecha_vencimiento,
            valor: item.valor,
            editable: true,
          };
        });
        control.setValue("detalle", detalle);
        setSelectedProducts(detalle);
        setLoader(false);
      });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        control.setValue("bod_origen", data.id);
        control.setValue("bod_o", data.bod_nombre);
      });

      getBodegasSebthi().then(({ data: { data } }) => {
        setBodegasInfo(data);
        const bodegas = data
          .filter(
            (item) =>
              item.id_empresa == getSessionVariable(KEY_EMPRESA) &&
              item.estado === "1"
          )
          .map((item) => {
            return { label: item.bod_nombre, value: item.id };
          });
        setOptionsBodegas(bodegas);
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
    getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
      control.setValue("bod_origen", data.id);
      setBodegaInfo(data);
    });

    control.setValue("detalle", selectedProducts);
  }, []);

  useEffect(() => {
    fetchUserProfile().then(({ data: { userData } }) => {
      if (userData.has_fuentes == "1") {
        setHasFuente(true);
      } else {
        setHasFuente(false);
      }
    });
  }, []);

  useMemo(
    () => control.setValue("detalle", selectedProducts),
    [selectedProducts]
  );

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    const duplicateProducts: DataType[] = [];

    productos.forEach((producto) => {
      const existingProduct = selectedProducts.find(
        (p) =>
          p.key.toString() === producto.key &&
          p.lote === producto.lote &&
          p.fvence === producto.fvence
      );

      if (existingProduct) {
        duplicateProducts.push(producto);
      } else {
        data.push(producto);
      }
    });

    if (duplicateProducts.length > 0) {
      notificationApi.open({
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

    control.setValue("total", calcularPrecioTotal2());

    setDataSource(dataSource.concat(productos));
    setSelectedProducts([...selectedProducts, ...productos]);
    control.setValue("detalle", selectedProducts.concat(productos));
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };

  const handleUpLote = (
    id_pro: any,
    lote: any,
    fvence: any,
    cantidad: any,
    key: React.Key
  ) => {
    const data = {
      id: id_pro,
      lote: lote,
      fvence: fvence,
      bodega_id: getSessionVariable(KEY_BODEGA),
      cantidad: cantidad,
      encabezado_id: id,
    };

    const newDataSource = selectedProducts.filter(
      (item) => item.key !== id_pro
    );
    if (newDataSource.length > 1) {
      if (evitarEdicion) {
        notificationApi.open({
          type: "warning",
          message:
            "No se puede eliminar el producto debido al estado actual del traslado.",
        });
        setLoaderSave(false);
        return;
      }

      if (!evitarEdicion) {
        setLoader(true);
        updateTrsLote(data, id)
          .then(() => {
            handleDelete(key);
            notificationApi.open({
              type: "success",
              message: "Item removido correctamente!",
            });
          })
          .catch((error) => {
            if (error.response) {
              const responseData = error.response.data;
              const errorMessage = responseData.message;

              notificationApi.open({
                type: "error",
                message: errorMessage,
              });
            } else {
              console.error("Error:", error.message);
            }
          })
          .finally(() => setLoader(false));
      }
    } else {
      notificationApi.open({
        type: "error",
        message: "No puedes eliminar el último producto de la dispensación.",
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
      align: "center",
      fixed: "left",
      width: 100,
    },
    {
      title: "Código Servinte",
      dataIndex: "codigo_servinte",
      key: "codigo_servinte",
      sorter: (a, b) =>
        a.codigo_servinte
          .toString()
          .localeCompare(b.codigo_servinte.toString()),
      align: "center",
      fixed: "left",
      width: 100,
      hidden: !hasFuente,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      fixed: "right",
      width: 100,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      fixed: "right",
      width: 90,
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      fixed: "right",
      width: 150,
    },
  ];

  if (["create", "edit"].includes(accion)) {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        if (accion === "edit" && record.editable == true) {
          return (
            <Popconfirm
              title="¿Desea eliminar este item?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              description={
                <Space direction="vertical" size={1}>
                  <Text>
                    {`Al eliminarlo se devolverá la cantidad de ${record.cantidad} en los lotes correspondientes`}
                  </Text>
                </Space>
              }
              okText="Si"
              cancelText="No"
              onConfirm={() =>
                handleUpLote(
                  record.id,
                  record.lote,
                  record.fvence,
                  record.cantidad,
                  record.key
                )
              }
            >
              <Button
                danger
                size="small"
                type="primary"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          );
        } else if (accion === "edit" && record.editable == false) {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                size="small"
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                disabled={record.editable}
              />
            </Tooltip>
          );
        } else if (accion === "create") {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            </Tooltip>
          );
        }

        return null;
      },
      width: 100,
    });
  }

  const handleCancel = () => {
    if (id) {
      setLoader(true);
      getInfoTRS(id).then(({ data: { data } }) => {
        if (data.detalle.length == 0) {
          notificationApi.open({
            type: "info",
            message:
              "El detalle del traslado se encuentra vacío, debes guardar el documento primero.",
          });
          setLoader(false);
        } else {
          navigate(-1);
        }
      });
    }
  };

  const onFinish: SubmitHandler<any> = async (dataSend: any) => {
    setLoader(true);
    setBotonClicado(true);
    if (accion === "edit") {
      getInfoEstadoTRS(id).then(({ data: { dataEstado } }) => {
        if (dataEstado === "1") {
          dataSend.bod_des_id = dataSend.bod_des;
          setBotonClicado(true);

          updateTRS(dataSend, id)
            .then(() => {
              notificationApi.open({
                type: "success",
                message: "Traslado actualizado con éxito!",
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
                setBotonClicado(false);
              }
            )
            .finally(() => setLoader(false));
        } else {
          notificationApi.open({
            type: "warning",
            message:
              "No se puede actualizar el traslado debido a su estado actual, por favor, validar estado.",
          });
          setLoader(false);
          return;
        }
      });
    } else if (accion === "create") {
      if (bodDestino == "" || bodDestino == null) {
        notificationApi.open({
          type: "error",
          message: "Por favor, elige una bodega destino.",
        });
        setBotonClicado(false);
        return;
      }

      dataSend.bodDestino = bodDestino;
      crearTRS(dataSend)
        .then(({ data: { id } }) => {
          notificationApi.open({
            type: "success",
            message: "Traslado creado con éxito!",
          });
          setTimeout(() => {
            const url_split = location.pathname.split("/");

            const codigo_documento = id
              ? url_split[url_split.length - 3]
              : url_split[url_split.length - 2];
            codigo_documento.toUpperCase(), getSessionVariable(KEY_EMPRESA);
            navigate(
              `/${url_split[1]}/${url_split[2]}/${url_split[3]}/show/${id}`
            );
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
            setBotonClicado(false);
          }
        );
    }
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      trs_id: id,
      accion: accion,
      bod_origen: control.getValues("bod_origen"),
    };
    cambiarEstadoTRS(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con éxito!`,
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

  const generarPDF = async () => {
    setLoaderSave(true);
    try {
      if (id) {
        const response = await getTrasladosPdf(id).finally(() =>
          setLoaderSave(false)
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      setLoaderSave(false);
      console.error("Error mostrando el PDF:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "productos",
    showUploadList: false,
    action: `${BASE_URL}trs/cargar-plano-productos`,
    data: { bodega_id: bodegaInfo?.id },
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
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info) {
      setLoader(true);
      if (info.file.status !== "uploading") {
        // setDetalle([]);
        // setInitialData([]);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        const {
          file: { response },
        } = info;
        const data: RespondeCarguePlano = response;
        setSelectedProducts(
          data.items.map((item) => {
            const key = `${item.codigo_producto}_${item.lote}_${item.fecha_vencimiento}`;
            return {
              cantidad: item.cantidad,
              descripcion: item.descripcion,
              fvence: item.fecha_vencimiento,
              lote: item.lote,
              id: item.codigo_producto,
              key,
              precio_promedio: item.precio_promedio,
              valor: (
                parseInt(item.cantidad) * parseFloat(item.precio_promedio)
              ).toString(),
              stock: item.cantidad,
              id_lote: item.lote_id,
              codigo_servinte: "",
            };
          })
        );
        let total = 0;
        data.items.forEach((producto) => {
          total +=
            parseFloat(producto.cantidad) *
            parseFloat(producto.precio_promedio);
        });
        control.setValue("total", total);
        setLoader(false);
        notificationApi.open({
          type: info.file.response.status,
          message: info.file.response.message,
          duration: 10,
        });
      } else if (info.file.status === "error") {
        setSelectedProducts([]);
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 10,
        });
      }
    },
  };

  return (
    <>
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              Traslados Salida{" "}
              {id && documentoInfo ? `- ${documentoInfo.trs_id}` : null}
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
            hasFuente={hasFuente}
          />
          <Form
            layout={"vertical"}
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <Row gutter={12}>
                  <Col xs={24} md={8}>
                    <Controller
                      name="bod_o"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Bodega Origen:"}>
                          <Input {...field} disabled />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Controller
                      name="bod_des"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Bodega Destino:">
                          <Select
                            {...field}
                            allowClear
                            showSearch
                            placeholder="Selecciona una bodega"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label?.toString() ?? "")
                                .toLowerCase()
                                .includes(input.toString().toLowerCase())
                            }
                            options={optionsBodegas?.filter(
                              (item) =>
                                item.value != control.getValues("bod_origen")
                            )}
                            disabled={["anular", "show"].includes(accion)}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Controller
                      name="fecha"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Fecha:">
                          {accion === "show" ? (
                            <Input {...field} disabled />
                          ) : (
                            <DatePicker
                              {...field}
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              value={dayjs()}
                              style={{ width: "100%" }}
                              disabled
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Controller
                      name="estado"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Estado:"}>
                          {accion == "create" || accion == "edit" ? (
                            <Input {...field} disabled value="PENDIENTE" />
                          ) : (
                            <Input {...field} disabled />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  {hasFuente ? (
                    <>
                      <Col xs={24} md={4}>
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
                            <StyledFormItem required label={"Número Servinte:"}>
                              <Input
                                {...field}
                                placeholder="Número Servinte"
                                value={field.value}
                                onChange={(e) => {
                                  const onlyNums = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  field.onChange(onlyNums);
                                }}
                                status={error ? "error" : ""}
                                disabled={
                                  id
                                    ? ["show", "anular"].includes(accion)
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    </>
                  ) : null}

                  <Col xs={24} sm={24}>
                    {estadosVisibles.includes(
                      camposEstados
                        ?.filter((item) => item.id_campo == "3")
                        .at(0)?.estado ?? ""
                    ) ? (
                      <Controller
                        name="observacion"
                        control={control.control}
                        rules={{
                          required: {
                            value:
                              camposEstados
                                ?.filter((item) => item.id_campo == "3")
                                .at(0)?.estado === "2",
                            message: "Observación es requerido",
                          },
                        }}
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
                              maxLength={250}
                              showCount
                              disabled={
                                accion === "show" || accion === "anular"
                              }
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col xs={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  {["create", "edit"].includes(accion) ? (
                    <>
                      {["administrador", "quimico", "regente"].includes(
                        user_rol
                      ) ? (
                        <Col xs={24} md={12} lg={{ span: 10 }}>
                          <Space.Compact style={{ width: "100%" }}>
                            <Button
                              icon={<DownloadOutlined />}
                              block
                              onClick={() => {
                                setLoader(true);
                                downloadTemplate(
                                  `ExampleUploadPlanoProductosTraslado.xlsx`
                                )
                                  .then((response) => {
                                    const url = window.URL.createObjectURL(
                                      new Blob([response.data])
                                    );
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute(
                                      "download",
                                      `ExampleUploadPlanoProductosTraslado.xlsx`
                                    );
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
                              Descargar
                            </Button>
                            <CustomUpload {...uploadProps}>
                              <Button
                                type="primary"
                                size="middle"
                                icon={<UploadOutlined />}
                                block
                              >
                                Cargar
                              </Button>
                            </CustomUpload>
                          </Space.Compact>
                        </Col>
                      ) : null}

                      <Col
                        xs={24}
                        md={12}
                        lg={{
                          offset: [
                            "administrador",
                            "quimico",
                            "regente",
                          ].includes(user_rol)
                            ? 6
                            : 16,
                          span: 8,
                        }}
                      >
                        <Button
                          type="primary"
                          block
                          onClick={() => setOpenFlag(true)}
                        >
                          <Text strong style={{ color: "white" }}>
                            <PlusOutlined /> Agregar Producto
                          </Text>
                        </Button>
                      </Col>
                    </>
                  ) : null}
                  <Col xs={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 300 }}
                      pagination={{
                        simple: false,
                        showSizeChanger: false,
                        hideOnSinglePage: true,
                      }}
                      bordered
                      dataSource={selectedProducts}
                      columns={columns}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[12, 6]}>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                  justifyContent: "center",
                }}
              >
                <Row gutter={[12, 12]} justify="center">
                  <Col xs={24} md={8} lg={6}>
                    <Button
                      block
                      danger
                      type="primary"
                      onClick={
                        ["edit"].includes(accion)
                          ? handleCancel
                          : () => navigate(`/documentos/traslados/trs`)
                      }
                    >
                      <ArrowLeftOutlined />
                      Volver
                    </Button>
                  </Col>
                  {["show"].includes(accion) ? (
                    <Col xs={24} md={8} lg={4}>
                      <Button type="primary" block onClick={generarPDF}>
                        <FilePdfFilled />
                        Generar PDF
                      </Button>
                    </Col>
                  ) : null}
                  {["create", "edit"].includes(accion) ? (
                    <Col xs={24} md={8} lg={6}>
                      <Button
                        block
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        disabled={botonClicado || selectedProducts.length === 0}
                      >
                        Guardar
                      </Button>
                    </Col>
                  ) : null}
                  {["anular"].includes(accion) ? (
                    <Col xs={24} md={8} lg={6}>
                      <Button
                        block
                        danger
                        type="primary"
                        htmlType="button"
                        onClick={anularDocumento}
                      >
                        Anular
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
