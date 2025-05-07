/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BASE_URL, KEY_EMPRESA } from "@/config/api";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CamposEstados, DataType, SummaryProps } from "./types";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  Spin,
  notification,
  Typography,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Space,
  SelectProps,
  Select,
  UploadProps,
} from "antd";
import { getBodegasLotes } from "@/services/maestras/bodegasAPI";
import dayjs from "dayjs";
import {
  Bodega,
  InventarioAperturaCabecera,
  TipoDocumento,
} from "@/services/types";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ColumnsType } from "antd/es/table";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { CustomUpload, SearchBar } from "./styled";
import {
  crearIA,
  cambiarEstadoIA,
  downloadTemplate,
  validarAccesoDocumento,
  getInfoIA,
} from "@/services/documentos/iaAPI";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import useSerialize from "@/modules/common/hooks/useUpperCase";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const estadosVisibles = ["0", "2"];

export const FormIA = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString } = useArrayBuffer();
  const { transformToUpperCase } = useSerialize();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const { getSessionVariable } = useSessionStorage();
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [disabledUpload, setDisabledUpload] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  const [documentoInfo, setDocumentoInfo] =
    useState<InventarioAperturaCabecera>();
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [ellipsisRow, setEllipsisRow] = useState<React.Key[]>([]);
  const [accion, setAccion] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
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
    },
  });
  const watchBodega = control.watch("bodega_id");

  useEffect(() => {
    if (control.getValues("bodega_id") != "") {
      setDisabledUpload(false);
    } else {
      setDisabledUpload(true);
    }
  }, [watchBodega]);

  const summaryProps: SummaryProps = {
    firstCell: { index: 0, colSpan: 2, align: "right" },
    secondCell: { index: 2, colSpan: 7, align: "right" },
    thirdCell: { index: 8, align: "center" },
    fourthCell: { index: 9 },
  };

  useEffect(() => {
    const url_split = location.pathname.split("/");
    setUrl(url_split);

    const accion = url_split[4];

    setAccion(accion);

    const codigo_documento = url_split[3];
    setLoader(true);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        if (data) {
          const campos = data?.documento_info?.cabeceras?.map((item) => ({
            nombre_campo: item.campo.nombre_campo,
            id_campo: item.id_campo,
            estado: item.estado,
          }));
          setTipoDocumento(data.documento_info);
          setCamposEstados(campos);
          control.setValue("tipo_documento_id", data.documento_info.id);
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
      // Se valida que en la acciones EDIT, SHOW y ANULAR se capture el ID de la Orden de Compra ya creada para consultar su cabecera y detalle
      // e imprimirla en el formulario
      getInfoIA(id).then(({ data: { data } }) => {
        setDocumentoInfo(data);
        // Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
        // caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
        if (["3", "4"].includes(data.estado)) {
          setFlagAcciones(true);
          const estado =
            data.estado == "2"
              ? "en proceso"
              : data.estado == "3"
              ? "cerrado"
              : "anulado";
          if (["create", "anular"].includes(accion)) {
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
        const detalle: DataType[] = data.detalle.map((item) => {
          const key = `${item.producto_id}_${item.lote}_${item.fecha_vencimiento}`;
          return {
            key,
            cantidad: parseInt(item.cantidad),
            descripcion: item.descripcion,
            f_vencimiento: item.fecha_vencimiento,
            iva: parseFloat(item.iva),
            lote: item.lote,
            precio: parseFloat(item.precio_promedio),
            precio_iva: parseFloat(item.total) - parseFloat(item.subtotal),
            precio_subtotal: parseFloat(item.subtotal),
            precio_total: parseFloat(item.total),
            producto_id: item.producto_id,
          };
        });
        setBodegaInfo(data.bodega);
        control.setValue("observacion", data.observacion);
        control.setValue("bodega_id", data.bodega.id.toString());
        control.setValue("subtotal", parseFloat(data.subtotal));
        control.setValue(
          "iva",
          parseFloat(data.total) - parseFloat(data.subtotal)
        );
        control.setValue("total", parseFloat(data.total));
        setDetalle(detalle);
        form.setFieldValue("fecha", dayjs(data.created_at));
        setLoader(false);
      });
    } else {
      getBodegasLotes(false)
        .then(({ data: { data } }) => {
          form.setFieldValue("fecha", dayjs(new Date()));
          setSelectBodegas(
            data.map((bodega) => {
              return {
                value: bodega.id,
                label: `${bodega.prefijo} - ${bodega.bod_nombre}`,
              };
            })
          );
        })
        .finally(() => setLoader(false));
    }
  }, []);

  useEffect(() => {
    if (detalle.length > 0) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
    control.setValue("detalle", detalle);
  }, [detalle]);

  useMemo(() => {
    let subtotal = 0;
    let iva = 0;
    let total = 0;
    detalle.forEach(({ precio_subtotal, precio_iva, precio_total }) => {
      subtotal += precio_subtotal;
      iva += precio_iva;
      total += precio_total;
    });
    control.setValue("subtotal", subtotal);
    control.setValue("iva", iva);
    control.setValue("total", total);
  }, [detalle]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      key: "producto_id",
      dataIndex: "producto_id",
      align: "center",
      width: 60,
    },
    {
      title: "Producto",
      key: "descripcion",
      dataIndex: "descripcion",
      width: 400,
      render: (_, { key, descripcion }) => {
        return (
          <Row>
            <Col span={24}>
              <Paragraph
                ellipsis={
                  !ellipsisRow.includes(key)
                    ? {
                        rows: 1,
                        expandable: true,
                        symbol: "ver más",
                        onExpand: () => {
                          setEllipsisRow([...ellipsisRow, key]);
                        },
                      }
                    : false
                }
              >
                {descripcion}
              </Paragraph>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Lote",
      key: "lote",
      dataIndex: "lote",
      align: "center",
      width: 130,
    },
    {
      title: "Fecha Vencimiento",
      key: "f_vencimiento",
      dataIndex: "f_vencimiento",
      align: "center",
      width: 130,
    },
    {
      title: "IVA %",
      key: "iva",
      dataIndex: "iva",
      align: "center",
      width: 60,
    },
    {
      title: "Cantidad",
      key: "cantidad",
      dataIndex: "cantidad",
      align: "center",
      width: 100,
    },
    {
      title: "Precio",
      key: "precio",
      dataIndex: "precio",
      align: "center",
      width: 130,
      render: (_, { precio }) => {
        return (
          <>
            <Space direction="vertical">
              <Text>$ {precio.toLocaleString("es-CO")}</Text>
            </Space>
          </>
        );
      },
    },
    {
      title: "Subtotal",
      key: "precio_subtotal",
      dataIndex: "precio_subtotal",
      align: "center",
      width: 120,
      render: (_, { precio_subtotal }) => {
        return <>$ {precio_subtotal.toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "IVA",
      key: "precio_iva",
      dataIndex: "precio_iva",
      align: "center",
      width: 120,
      render: (_, { precio_iva }) => {
        return <>$ {precio_iva.toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Total",
      key: "precio_total",
      dataIndex: "precio_total",
      align: "center",
      width: 120,
      render: (_, { precio_total }) => {
        return <>$ {precio_total.toLocaleString("es-CO")}</>;
      },
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevoTexto = e.target.value;
    // Expresión regular que permite solo letras, números y espacios
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (regex.test(nuevoTexto) || nuevoTexto == "") {
      setTexto(nuevoTexto);
      control.setValue("observacion", nuevoTexto);
    }
  };

  const onFinish = (data: any) => {
    setLoader(true);
    data = transformToUpperCase(data, ["observacion"]);
    setDisabledButton(true);
    crearIA(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Documento creado con exito!`,
        });
        setTimeout(() => {
          navigate(`/${url[1]}/${url[2]}/${url[3]}`);
        }, 800);
      })
      .catch(
        ({
          response,
          response: {
            data: { errors },
          },
        }) => 
        {
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
          setDisabledButton(false)
        }
      );
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      ia_id: id,
      accion: accion,
    };
    cambiarEstadoIA(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha anulado el documento con exito!`,
        });
        setTimeout(() => {
          navigate(`/${url[1]}/${url[2]}/${url[3]}`);
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
    name: "productos",
    action: `${BASE_URL}documentos/inventario/productos`,
    data: { bodega_id: control.getValues("bodega_id") },
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
        setDetalle([]);
        setInitialData([]);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        handleSetDetalle(info.file.response.data);
        notificationApi.open({
          type: "success",
          message: info.file.response.message,
          duration: 20,
        });
      } else if (info.file.status === "error") {
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 20,
        });
      }
    },
  };

  const handleSetDetalle = (excelData: DataType[]) => {
    const items: DataType[] = excelData.map((item) => {
      const precio_subtotal = item.cantidad * item.precio;
      const precio_iva = precio_subtotal * (item.iva / 100);
      const precio_total = precio_subtotal + precio_iva;
      return {
        key: item.key,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        descripcion: item.descripcion,
        f_vencimiento: item.f_vencimiento,
        iva: item.iva,
        lote: item.lote,
        precio: item.precio,
        precio_iva,
        precio_subtotal,
        precio_total,
      };
    });
    setDetalle(items);
    setInitialData(items);
    setLoader(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDetalle(filterTable);
  };

  return (
    <>
      {contextHolder}
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
              {tipoDocumento?.descripcion}{" "}
              {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
            </Title>
          }
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
            form={form}
            disabled={["show", "anular"].includes(accion) ? true : false}
          >
            <Row gutter={[12, 6]}>
              <Col span={24}>
                <Row gutter={12}>
                  <Col xs={{ span: 24 }} sm={{ offset: 16, span: 8 }}>
                    <StyledFormItem label={"Fecha :"} name={"fecha"}>
                      <DatePicker
                        disabled
                        format={"YYYY-MM-DD HH:mm"}
                        style={{ width: "100%" }}
                        suffixIcon={null}
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                    {!["create"].includes(accion) ? (
                      <StyledFormItem label={"Bodega:"}>
                        <Input disabled value={bodegaInfo?.bod_nombre} />
                      </StyledFormItem>
                    ) : (
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
                          <StyledFormItem label={"Bodega:"} required>
                            <Select
                              {...field}
                              placeholder="Bodega"
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label?.toString() ?? "")
                                  .toLowerCase()
                                  .includes(input.toString().toLowerCase())
                              }
                              notFoundContent={"No hay bodegas sin inventario"}
                              popupMatchSelectWidth={350}
                              options={selectBodegas}
                              status={error && "error"}
                              disabled={!["create", "edit"].includes(accion)}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    )}
                  </Col>
                </Row>
                <Row gutter={12}>
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
                              placeholder="Observación:"
                              status={error && "error"}
                              autoSize={{ minRows: 4, maxRows: 6 }}
                              maxLength={250}
                              showCount
                              onChange={handleInputChange}
                              defaultValue={texto}
                              className="upperCaseText"
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
              <Col span={24} style={{ marginTop: 15 }}>
                <Row gutter={[12, 12]}>
                  {["create"].includes(accion) ? (
                    <>
                      <Col xs={24} sm={12}>
                        <Button
                          icon={<DownloadOutlined />}
                          disabled={disabledUpload}
                          block
                          onClick={() => {
                            setLoader(true);
                            downloadTemplate(`ExampleUploadInventario.xlsx`)
                              .then((response) => {
                                const url = window.URL.createObjectURL(
                                  new Blob([response.data])
                                );
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `ExampleUploadInventario.xlsx`
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
                      <Col
                        xs={24}
                        sm={12}
                        style={{
                          minHeight: 55,
                          maxHeight: 55,
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
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
                    </>
                  ) : null}
                  <Col span={24}>
                    <SearchBar>
                      <Input
                        placeholder="Buscar"
                        onChange={handleSearch}
                        disabled={false}
                      />
                    </SearchBar>
                    <Table
                      rowKey={(record) => record.key}
                      size="small"
                      scroll={{ y: 700, x: 1000 }}
                      pagination={{
                        simple: false,
                        pageSize: 10,
                        showTotal: (total: number) => {
                          let total_cantidades = 0;
                          detalle.forEach(
                            (item) => (total_cantidades += item.cantidad)
                          );
                          return (
                            <>
                              <Text>Total Registros: {total}</Text>
                              {" - "}
                              <Text>Total Cantidades: {total_cantidades}</Text>
                            </>
                          );
                        },
                        hideOnSinglePage: true,
                      }}
                      dataSource={detalle}
                      columns={columns}
                      bordered
                      summary={() => (
                        <>
                          {detalle.length > 0 ? (
                            <Table.Summary fixed={"bottom"}>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Subtotal:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("subtotal")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                                {["create", "edit"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    IVA:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("iva")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                                {["create", "edit"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
                              </Table.Summary.Row>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  {...summaryProps.firstCell}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  {...summaryProps.secondCell}
                                >
                                  <Text strong style={{ fontSize: 12 }}>
                                    Total:
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell {...summaryProps.thirdCell}>
                                  <Text strong style={{ fontSize: 12 }}>
                                    ${" "}
                                    {control
                                      .getValues("total")
                                      .toLocaleString("es-CO")}
                                  </Text>
                                </Table.Summary.Cell>
                                {["create", "edit"].includes(accion) ? (
                                  <Table.Summary.Cell
                                    {...summaryProps.fourthCell}
                                  ></Table.Summary.Cell>
                                ) : null}
                              </Table.Summary.Row>
                            </Table.Summary>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
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
                    <Button
                      type="primary"
                      icon={<ArrowLeftOutlined />}
                      danger
                      disabled={false}
                    >
                      Volver
                    </Button>
                  </Link>
                  {!flagAcciones ? (
                    <>
                      {accion == "create" || accion == "edit" ? (
                        <Button
                          htmlType="submit"
                          type="primary"
                          disabled={disabledButton}
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
                          disabled={false}
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
