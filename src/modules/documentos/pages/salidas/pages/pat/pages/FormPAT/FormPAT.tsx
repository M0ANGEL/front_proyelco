/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
  notification,
  Popconfirm,
  Modal,
  InputProps,
  List,
  Divider,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bodega, IDocumentos } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import {
  LoadingOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { StyledText } from "../../components/ModalProductos/styled";
import { ModalProductos } from "../../components";
import { CamposEstados, DataType } from "./types";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  updateDisLote,
  validarAccesoDocumento,
  anularDis,
  getDespachos,
} from "@/services/documentos/disAPI";
import { KEY_EMPRESA, KEY_BODEGA } from "@/config/api";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { anyTerceros, searchTercero } from "@/services/maestras/prestamosAPI";
import {
  anularDoc,
  crearDocumento,
  getInfoSalida,
  updatePrestamos,
} from "@/services/documentos/otrosAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormPAT = () => {
  const [estadosVisibles] = useState<string[]>(["0", "2"]);

  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [notificationApi, contextHolder2, contextHolder] =
    notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectTipo, setSelectTipo] = useState<SelectProps["options"]>([]);
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [messageApi] = message.useMessage();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [totalAcumulado, setTotalAcumulado] = useState(0);
  const [dataAutDet, setDataAutDet] = useState();
  const [selectDespacho, setSelectDespacho] = useState<SelectProps["options"]>(
    []
  );
  const [dataCantSol, setDataCantSol] = useState();
  const [terceroSeleccionado, setTerceroSeleccionado] = useState(false);
  const [disFromModal, setDisFromModal] = useState(true);

  const [selectRows, setSelectRows] = useState<DataType[]>([]);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const handleCancel = () => {
    // Lógica para cancelar y restablecer el formulario o redirigir a otra página.
    navigate(-1);
  };
  const [fileList, setFileList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [terceros, setTerceros] = useState<any[]>([]);
  const [dispensaciones, setDispensaciones] = useState([]); // Aquí deberías almacenar las dispensaciones recibidas
  const [selectedDispensacion, setSelectedDispensacion] = useState(null);
  const [agravado, setAgravado] = useState<any>();
  const [detalleProcesado, setDetalleProcesado] = useState(false);
  const isMounted = useRef(false);
  const [documentoInfo, setDocumentoInfo] = useState<IDocumentos>();
  const control = useForm({
    mode: "onChange",
  });

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTercero(null);
    setDispensaciones([]);
    setSelectedDispensacion(null);
  };

  const handleSearchTercero = (searchText) => {
    try {
      console.log("search ");
      anyTerceros(searchText).then(({ data: { data } }) => {
        setModalVisible(true);
        setSelectedTercero(true);
        setTerceros(data);
        setDispensaciones([]); // Limpiamos las dispensaciones al realizar una nueva búsqueda
        setSelectedDispensacion(null);
      });
    } catch (error) {
      console.error("Error fetching terceros:", error);
    }
  };

  const handleSelectTercero = (tercero) => {
    setSelectedTercero(tercero);

    try {
      searchTercero(tercero).then(({ data }) => {
        if (data) {
          const nomTer = data.nombre;
          const idTer = data.nit;
          setTerceros(data);
          setSelectedDispensacion(null);
          control.setValue("tercero_id", idTer);
          control.setValue("nombre_tercero", nomTer);
          setTerceroSeleccionado(false);
        }
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error fetching dispensaciones:", error);
    }
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

    // getDespachos().then(({ data: { data } }) => {
    //   setSelectDespacho(data.map((despacho: any) => {
    //     return { value: despacho.id, label: despacho.despacho }
    //   }));
    // });

    getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
      setBodegaInfo(data);
      control.setValue("bodega_id", data.bod_nombre);
    });
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      if (id) {
        getInfoSalida(id).then(({ data: { data } }) => {
          console.log("data ifno", data);
          setDocumentoInfo(data);
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
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 2500);
              return;
            }
          }

          control.setValue("observacion", data.observacion);
          control.setValue("tercero_id", data.tercero.nit);
          control.setValue("nombre_tercero", data.tercero.razon_soc);
          control.setValue("doc_prestamo", data.docu_prestamo);
          control.setValue("bodega_id", data.bodega.bod_nombre);

          const fecha = new Date(data.created_at);
          const dia = fecha.getDate();
          const mes = fecha.getMonth() + 1;
          const año = fecha.getFullYear();

          const fechaFormateada = `${dia < 10 ? "0" + dia : dia}/${
            mes < 10 ? "0" + mes : mes
          }/${año}`;
          control.setValue("fecha", fechaFormateada);

          //RECORDAR: formatear DataType, y campos
          if (!detalleProcesado) {
            const detalle: DataType[] = data.detalle.map((item, index) => {
              const uniqueKey = `${item.producto_id}-${index}-${item.created_at}`;
              setDataCantSol(item.cantidad_solicitada);
              return {
                key: index,
                id: item.producto_id,
                descripcion: item.producto.descripcion,
                cantRetorno: item.cantidad_retorno,
                cantidad: item.cantidad,
                //cantDev: item.cantidad_dev,
                fvence: item.fecha_vencimiento,
                lote: item.lote,
                precio_promedio: item.precio_promedio,
                precio_subtotal: item.precio_subtotal,
                iva: item.precio_iva,
                precio_total: item.precio_venta_total,
                editable: true,
              };
            });

            handleSetDetalle(detalle);
            // Marcamos que el detalle ha sido procesado
            setDetalleProcesado(true);
          }
        });
      }

      isMounted.current = true;
    }
  }, [id]);

  // Funcion para eliminar el item del detalle, es decir, del arreglo y se recalcula el subtotal y total del documento
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };

  const handleDeleteLast = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    if (newData.length > 1) {
      setDataSource(newData);
      setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
    }
  };

  // Funcion para realizar el cambio de texto a input en la tabla de detalle, ya sea en cantidades o en el valor
  const handleChangeEdit = (
    key: React.Key,
    accion: string,
    e: ChangeEvent<InputProps>
  ) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      switch (accion == "edit") {
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

  const calcularSubtotal = (cantidad, precio_lista) => {
    setSubtotal(parseFloat(cantidad * precio_lista));
    return cantidad * precio_lista;
  };

  const calcularIva = (cantidad, precio_lista, valorIva, agravado) => {
    let suma = 0;
    if (agravado === 1 || agravado === "1") {
      suma = cantidad * precio_lista * (valorIva / 100);
    }
    return suma;
  };

  const calcularTotal = (cantidad: any, precio_lista: any, valorIva: any) => {
    valorIva = 19;
    const sumaTotal =
      cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100);
    setTotal(sumaTotal);
    return parseFloat(
      cantidad * precio_lista + cantidad * precio_lista * (valorIva / 100)
    );
  };

  const handleUpdateTotal = (total) => {
    setTotalAcumulado(total);
  };

  const anularDocumento = () => {
    const data = {
      doc_id: id,
      accion: accion,
    };
    anularDoc(data)
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

      if (existingProduct) {
        duplicateProducts.push(producto);
      } else {
        const iva = calcularIva(
          producto.cantidad,
          producto.precio_promedio,
          19,
          1
        );
        const subtotal = calcularSubtotal(
          producto.cantidad,
          producto.precio_promedio
        );
        const total = calcularTotal(
          producto.cantidad,
          producto.precio_promedio,
          producto.iva
        );
        let precio = producto.precio_promedio;
        console.log("iva2", iva);
        // handleSetDataSource();
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
        description: (
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
      // Aquí puedes realizar acciones adicionales con newData si es necesario

      control.setValue("detalle", newData);

      return newData;
    });

    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = [...prevSelectedProducts, ...productos];
      return newSelectedProducts;
    });
  };

  const calcularTotalAcumulado = () => {
    const totalAcumulado = dataSource.reduce((total, producto) => {
      const precioTotal = parseFloat(producto.precio_total);
      return isNaN(precioTotal) ? total : total + precioTotal;
    }, 0);

    return `${totalAcumulado.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`; // Redondear a dos decimales si es necesario
  };

  // Estilo para el elemento "Totales:"
  const totalsStyle = {
    textAlign: "right",
    fontWeight: "bold",
  };

  // Estilo para tamaño de texto en columnas
  const descripcionStyles = {
    fontSize: "12px",
  };

  const onFinish: SubmitHandler<any> = async (data: any) => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    //setLoader(true);

    data.detalle.forEach((medicamento) => {
      if (!medicamento.hasOwnProperty("autDet")) {
        medicamento.autDet = dataAutDet; // Puedes inicializarlo con null u otro valor según tu lógica
      }
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

    data.bodega_id = getSessionVariable(KEY_BODEGA);
    data.empresa = getSessionVariable(KEY_EMPRESA);
    data.total = total;
    data.ivaConv = agravado;

    if (accion === "edit") {
      updatePrestamos(data, id)
        .then(() => {
          message.open({
            type: "success",
            content: "Documento actualizado exitosamente!",
          });
          setTimeout(() => {
            navigate("..");
          }, 800);
        })
        .catch((error) => {
          if (error.response) {
            // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
            const responseData = error.response.data;
            const errorMessage = responseData.message;
            // Cerrar la alerta después de 3 segundos (3000 milisegundos)
            setTimeout(() => {
              // Mostrar la alerta con el mensaje de error
              message.open({
                type: "error",
                content: errorMessage,
              });
            }, 3000);
          } else {
            // Error general
            console.error("Error:", error.message);
          }
        });
    } else if (accion === "create") {
      data.detalle.forEach((medicamento) => {
        if (!medicamento.hasOwnProperty("autDet")) {
          medicamento.autDet = dataAutDet; // Puedes inicializarlo con null u otro valor según tu lógica
        }
        if (!medicamento.hasOwnProperty("cantSol")) {
          medicamento.cantSol = dataCantSol; // Puedes inicializarlo con null u otro valor según tu lógica
        }

        const key = medicamento.key;
        const record = dataSource.find((producto) => producto.key === key);
        if (record) {
          medicamento.cantSol = record.cantSol; // Usar el valor de cant_sol de dataSource
        }
      });

      const isCantSolFieldEmpty = data.detalle.some((medicamento) => {
        const cantSolValue =
          medicamento.cantSol != null ? medicamento.cantSol.toString() : "";
        return typeof cantSolValue !== "string" || cantSolValue.trim() === "";
      });

      if (isCantSolFieldEmpty) {
        //showError('El campo "Cant. Solicitada" debe ser llenado en todas las filas.');
        //return; // Detener el proceso de guardar
      }

      data.bodega_id = getSessionVariable(KEY_BODEGA);
      data.empresa = getSessionVariable(KEY_EMPRESA);

      const formData = new FormData();

      fileList.forEach((file: any) => {
        formData.append("files[]", file?.originFileObj);
      });
      const additionalData = { ...data };

      formData.append("additionalData", JSON.stringify(additionalData));

      console.log("formData=>", data);
      crearDocumento(data)
        .then(({ data: { id } }) => {
          setDisableButton(true); // Deshabilitar el botón
          console.log(data);
          const message = `El préstamo a tercero se creó exitosamente.`;
          notificationApi.open({
            type: "success",
            message: message,
          });
          setTimeout(() => {
            const url_split = location.pathname.split("/");

            const codigo_documento = id
              ? url_split[url_split.length - 3]
              : url_split[url_split.length - 2];
            codigo_documento.toUpperCase(), getSessionVariable(KEY_EMPRESA);
            navigate(`/${url_split.at(1)}/${url_split.at(2)}/pat`);
          }, 800);
        })

        .catch(({ response: { data } }) => {
          notificationApi.open({
            type: "error",
            message: data.message,
          });
        });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
      align: "center",
      fixed: "left",
      width: 80, // Reducir el ancho de esta columna
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      fixed: "left",
      width: 250, // Reducir el ancho de esta columna
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
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      align: "center",
      width: 100, // Reducir el ancho de esta columna
      fixed: "left",
      render: (
        _,
        record: {
          key: React.Key;
          cantidad: number;
          editable: boolean;
          maxCantidad: number;
        }
      ) => {
        return (
          <Space direction="vertical">
            {["create", "edit"].includes(accion) ? (
              <>
                <>
                  <StyledText
                    style={descripcionStyles}
                    onClick={(e) => handleChangeEdit(record.key, "cantidad", e)}
                  >
                    {record.cantidad}
                  </StyledText>
                </>

                {/*<Text type="success" style={{ fontSize: 11 }}>
                  Stock: {record.stock}
            </Text>*/}
              </>
            ) : (
              <Text> {record.cantidad}</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Vence",
      dataIndex: "fvence",
      key: "fvence",
      sorter: (a, b) => a.fvence.localeCompare(b.fvence),
      align: "center",
      width: 90, // Reducir el ancho de esta columna
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      align: "center",
      width: 80, // Reducir el ancho de esta columna
    },
    {
      title: "Precio",
      dataIndex: "precio_promedio",
      key: "precio_promedio",
      align: "center",
      width: 100, // Reducir el ancho de esta columna
      render: (
        _,
        record: {
          key: React.Key;
          precio_promedio: number;
          editablePrecio: boolean;
          maxCantidad: number;
        }
      ) => {
        const precio = parseFloat(record.precio_promedio);
        if (!isNaN(precio)) {
          return (
            <>
              <Text style={descripcionStyles}>
                $
                {precio.toLocaleString("en-US", {
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
      render: (_, record) => {
        const subtotal = parseFloat(record.precio_subtotal);
        if (!isNaN(subtotal)) {
          return `$${subtotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return "-";
      },
    },
    {
      title: "IVA",
      dataIndex: "iva",
      key: "iva",
      width: 90, // Reducir el ancho de esta columna
      align: "center",
      render: (_, record) => {
        //console.log("prure", record)

        const ivaValue = parseFloat(record.iva);
        if (!isNaN(ivaValue)) {
          return `$${ivaValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return "-";
      },
    },
    {
      title: "Total",
      dataIndex: "precio_total",
      key: "precio_total",
      width: 100, // Reducir el ancho de esta columna
      align: "center",
      render: (_, record) => {
        const total = parseInt(record.precio_total);
        if (!isNaN(total)) {
          return `$${total.toLocaleString("en-US")}`;
        }
        return "-";
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        const canDelete = record.cantRetorno !== 0; // Verifica si se cumplen ambas condicionesconsole.log(record, "record")

        if (accion === "edit" && record.editable == true) {
          return (
            <Popconfirm
              title="¿Desea eliminar este item?"
              onConfirm={() =>
                handleUpLote(
                  record.id,
                  record.lote,
                  record.fvence,
                  record.cantidad,
                  record.key
                )
              }
              placement="left"
              disabled={!canDelete} // Deshabilita si no se puede eliminar
            >
              <Tooltip title="Eliminar Item">
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  disabled={!canDelete} // Deshabilita si no se puede eliminar
                />
              </Tooltip>
            </Popconfirm>
          );
        } else if (accion === "edit" && record.editable == false) {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                disabled={record.editable} // Deshabilita si no hay convenio seleccionado o no se puede eliminar
              />
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Eliminar Item">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteLast(record.key)}
                disabled={accion === "show" || accion === "anular"} // Deshabilita si no hay convenio seleccionado o no se puede eliminar
              />
            </Tooltip>
          );
        }

        return null; // No se muestra la columna si no se cumple la condición
      },
      width: 80, // Reducir el ancho de esta columna
    },
  ];

  const handleUpLote = (id_pro, lote, fvence, cantidad, key: React.Key) => {
    const data = {
      id: id_pro,
      lote: lote,
      fvence: fvence,
      bodega_id: getSessionVariable(KEY_BODEGA),
      cantidad: cantidad,
      cabecera_id: id,
    };

    const newDataSource = dataSource.filter((item) => item.key !== id_pro);
    if (newDataSource.length > 1) {
      // updateDocLote(data, id).then(() => {
      //   message.open({
      //     type: "success",
      //     content: "Documento Actualizado!",
      //   });

      // })
      //   .catch(error => {
      //     if (error.response) {
      //       // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
      //       const responseData = error.response.data;
      //       const errorMessage = responseData.message;

      //       // Cerrar la alerta después de 3 segundos (3000 milisegundos)
      //       setTimeout(() => {
      //         // Mostrar la alerta con el mensaje de error
      //         message.open({
      //           type: "error",
      //           content: errorMessage,
      //         });
      //       }, 3000);
      //     } else {
      //       // Error general
      //       console.error('Error:', error.message);
      //     }
      //   });

      handleDelete(key);
    } else {
      message.open({
        type: "error",
        content: "No puedes eliminar el último producto del documento.",
      });
    }
  };

  const handleSetDataSource = () => {
    // onSetDataSource(dataSource);
    console.log("pasa 2==>>");
    setDisFromModal(false);
  };

  return (
    <Spin
      spinning={loader}
      indicator={
        <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
      }
      style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
    >
      {contextHolder}
      <StyledCard
        className="styled-card-documents"
        title={
          <Title level={4}>
            <span className="color-card-title">
              {accion === "show" ? "Consecutivo: " : null}
            </span>

            {accion === "create" ? "Nuevo " : null}
            {accion === "anular" ? "Anular " : null}
            {accion === "edit" ? "Editar " : null}
            {accion !== "show" ? "Préstamo a Tercero " : null}

            {id && documentoInfo ? ` ${documentoInfo?.consecutivo}` : null}
          </Title>
        }
      >
        {contextHolder2}
        <ModalProductos
          open={openFlag}
          setOpen={(value: boolean) => setOpenFlag(value)}
          key="modalProductos"
          onSetDataSource={(productos: DataType[]) => {
            handleSetDetalle(productos);
            handleSetDataSource();
          }}
          onUpdateTotal={handleUpdateTotal}
        />

        {!loader ? (
          <Form
            layout={"vertical"}
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={[24, 12]}>
                  <Col xs={24} sm={12} style={{ marginBottom: "12px" }}></Col>
                  <Col xs={24} sm={6} style={{ marginBottom: "12px" }}>
                    <Controller
                      name="bodega_id"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Punto Entrega:"}>
                          {accion === "show" ? (
                            <Input {...field} readOnly />
                          ) : (
                            <Input
                              {...field}
                              disabled
                              value={bodegaInfo?.bod_nombre}
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={6} style={{ marginBottom: "12px" }}>
                    <Controller
                      name="fecha"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Fecha:">
                          {accion === "show" ? (
                            <Input {...field} readOnly />
                          ) : (
                            <DatePicker
                              {...field}
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              value={dayjs()}
                              disabled
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12} style={{ marginBottom: "12px" }}>
                    <Controller
                      name="tercero_id"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Tercero Id:"}>
                          {accion === "edit" || accion === "anular" ? (
                            <Input {...field} disabled />
                          ) : (
                            <Select
                              {...field}
                              showSearch
                              //showArrow={false}
                              suffixIcon={null}
                              filterOption={false}
                              placeholder={
                                "Introduce nit o Id. de tercero y presiona 'Enter'"
                              }
                              onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                  console.log("valor ", e.target.value);
                                  handleSearchTercero(e.target.value);
                                }
                              }}
                              notFoundContent={null}
                              options={selectTipo}
                              status={error && "error"}
                              disabled={
                                terceroSeleccionado ||
                                accion === "edit" ||
                                accion === "show"
                              }
                            />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Modal
                    title="Resultados de Terceros:"
                    open={modalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                  >
                    {selectedTercero ? (
                      <List
                        bordered
                        dataSource={terceros}
                        renderItem={(tercero) => (
                          <List.Item
                            onClick={() => handleSelectTercero(tercero.nit)}
                            className={
                              selectedTercero === tercero.numero_identificacion
                                ? "selected hovered-row"
                                : "hovered-row"
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <Text>
                              {tercero.nit} - {tercero.razon_soc}
                            </Text>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <List
                        bordered
                        renderItem={() => (
                          <List.Item>
                            <Text>Sin resultados</Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </Modal>
                  <Col xs={24} sm={12} style={{ marginBottom: "12px" }}>
                    <Controller
                      name="nombre_tercero"
                      control={control.control}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nombre:"}>
                          {accion == "create" || accion == "edit" ? (
                            <Input {...field} disabled={true} />
                          ) : (
                            <Input {...field} readOnly />
                          )}
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col span={24}>
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
                              placeholder="Escribe una observación"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              maxLength={500}
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
              {/*Inicia detalle*/}
              <Divider children={<Text type="secondary">Detalle</Text>} />
              <Col span={24}>
                <Row gutter={[12, 12]}>
                  {accion === "show" || accion === "anular" ? (
                    <></>
                  ) : (
                    <Col
                      span={4}
                      offset={20}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        type="primary"
                        block
                        onClick={() => setOpenFlag(true)}
                        disabled={terceroSeleccionado}
                      >
                        <Text style={{ color: "white" }}>
                          <PlusOutlined /> Agregar Item
                        </Text>
                      </Button>
                    </Col>
                  )}

                  <Col span={24}>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 300 }}
                      pagination={{
                        simple: false,
                      }}
                      bordered
                      dataSource={dataSource}
                      columns={columns}
                    ></Table>
                  </Col>
                </Row>
                {/* Elemento "Total:" fuera de la tabla */}
                <Row gutter={[12, 12]} justify="end" style={totalsStyle}>
                  <Col>
                    <Text>Total: ${calcularTotalAcumulado()}</Text>
                  </Col>
                </Row>
              </Col>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {accion === "show" || accion === "anular" ? (
                  <Row gutter={[12, 12]} justify="center">
                    <Col span={24}>
                      <Button type="primary" block onClick={handleCancel}>
                        Volver
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <Row gutter={[12, 12]} justify="center">
                    <Col span={12}>
                      <Button
                        type="primary"
                        block
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        disabled={disFromModal}
                      >
                        Guardar
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button block onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </Col>
                  </Row>
                )}
                {accion == "anular" ? (
                  <Row gutter={[12, 12]} justify="center">
                    <Col span={12}>
                      <Button
                        htmlType="button"
                        type="primary"
                        danger
                        onClick={anularDocumento}
                      >
                        Anular
                      </Button>
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Form>
        ) : (
          <Space style={{ width: "100%", textAlign: "center" }}>
            <Spin size="large" />
          </Space>
        )}
      </StyledCard>
    </Spin>
  );
};
