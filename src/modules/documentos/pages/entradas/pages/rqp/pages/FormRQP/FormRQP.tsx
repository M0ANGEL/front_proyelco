/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import {
  cambiarEstadoRQP,
  crearRQP,
  downloadTemplate,
  getInfoRQP,
  updateRQP,
  validarAccesoDocumento,
} from "@/services/documentos/rqpAPI";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import {
  DeleteOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  Typography,
  Col,
  Form,
  Row,
  Input,
  Button,
  Spin,
  Table,
  Tooltip,
  Space,
  notification,
  InputNumber,
  DatePicker,
  SelectProps,
  Select,
} from "antd";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType } from "./types";
import { Rqp } from "@/services/types";
import { ModalProductos } from "../../components";
import { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/config/api";
import { CustomUpload, GreenButton, SearchBar, StyledText } from "./styled";
import dayjs from "dayjs";
import { fetchUserBodegas } from "@/services/auth/authAPI";
import { getBodega } from "@/services/maestras/bodegasAPI";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const FormRQP = () => {
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [detalleErrorMsg, setDetalleErrorMsg] = useState<string>("");
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [documentoInfo, setDocumentoInfo] = useState<Rqp>();
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString } = useArrayBuffer();
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const [accion, setAccion] = useState<string>("");
  const [url, setUrl] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const control = useForm({
    mode: "onChange",
  });
  const [btnExcel, setBtnExcel] = useState<boolean>(false);
  const [btnAgregarProducto, setBtnAgregarProducto] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const handleFileChange = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoader(true);
    // Realiza la solicitud POST a la ruta de tu API en Laravel
    await axios
      .post<{ data: DataType[] }>(
        `${BASE_URL}rqpExcel/cargar`, // ruta
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(({ data: { data } }) => {
        const detalle: DataType[] = data.map((item) => {
          return {
            key: item.key,
            descripcion: item.descripcion,
            cod_padre: item.cod_padre,
            desc_padre: item.desc_padre,
            cantidad: item.cantidad,
            precio_promedio: 0,
            editable: false,
          };
        });
        notificationApi.open({
          type: "success",
          message: `Archivo cargado con exito!`,
        });
        setLoader(false);
        setDataSource(detalle);
        setInitialData(detalle);
        control.setValue("detalle", detalle);
        setBtnExcel(true);
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
          setLoader(false);
          setDataSource([]);
          setInitialData([]);
        }
      );
  };

  useEffect(() => {
    if (dataSource.length == 0) {
      setBtnAgregarProducto(false);
      setBtnExcel(false);
    }
  }, [dataSource]);

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
          setCamposEstados(campos);
          control.setValue("tipo_documento_id", data.documento_info.id);
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
      getInfoRQP(id).then(({ data: { data } }) => {
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
        control.setValue("bod_solicitante", data.bodega.id.toString());
        setOptionsBodegas([
          { label: data.bodega.bod_nombre, value: data.bod_solicitante },
        ]);

        const detalle: DataType[] = data.detalle.map((item) => {
          return {
            key: item.producto.id,
            cantidad: parseInt(item.cantidad),
            descripcion: item.producto.descripcion,
            cod_padre: item.producto.cod_padre,
            desc_padre: item.producto.codigo_padre.descripcion,
            precio_promedio: parseFloat(item.producto.precio_promedio),
            editable: false,
          };
        });
        control.setValue("detalle", detalle);
        setDataSource(detalle);
        setInitialData(detalle);
        setLoader(false);
      });
    } else {
      if (
        ["administrador", "cotizaciones"].includes(getSessionVariable(KEY_ROL))
      ) {
        fetchUserBodegas().then(({ data: { data } }) => {
          setOptionsBodegas(
            data.bodega.map((item) => {
              return { label: item.bodega.bod_nombre, value: item.id_bodega };
            })
          );
          control.setValue("bod_solicitante", getSessionVariable(KEY_BODEGA));
          form.setFieldValue("fecha", dayjs(new Date()));
          setLoader(false);
        });
      } else {
        getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
          control.setValue("bod_solicitante", data.id.toString());
          form.setFieldValue("fecha", dayjs(new Date()));
          setOptionsBodegas([
            { label: data.bod_nombre, value: data.id.toString() },
          ]);
          setLoader(false);
        });
      }
    }
  }, []);

  const handleSetDetalle = (productos: DataType[]) => {
    const data: DataType[] = [];
    for (let x = 0; x < productos.length; x++) {
      const validarProducto = dataSource.find(
        (item) => item.key == productos[x].key
      );
      if (validarProducto) {
        notificationApi.open({
          type: "warning",
          message: `El item ${productos[x].key} / ${productos[x].descripcion} ya se encuentra en el detalle`,
          style: { width: 600 },
        });
      } else {
        const validarCodPadre = dataSource.find(
          (item) => item.cod_padre == productos[x].cod_padre
        );
        if (validarCodPadre) {
          notificationApi.open({
            type: "warning",
            message: `El item ${productos[x].key} / ${productos[x].descripcion} ya se encuentra en el detalle por PRINCIPIO ACTIVO ${productos[x].desc_padre}`,
            style: { width: 600 },
          });
        } else {
          data.push(productos[x]);
        }
      }
    }

    setDataSource(dataSource.concat(data));
    setInitialData(dataSource.concat(data));
    control.setValue("detalle", dataSource.concat(data));
    setBtnAgregarProducto(true);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    setInitialData(newData);
    control.setValue("detalle", newData);
  };

  const handleChangeAmount = (cantidad: number, key: React.Key) => {
    const newDataFilter = dataSource.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad: cantidad < 0 ? 0 : cantidad };
      } else {
        return item;
      }
    });
    setDataSource(newDataFilter);
    setInitialData(newDataFilter);
    control.setValue("detalle", newDataFilter);
  };

  const handleChangeEdit = (key: React.Key) => {
    const newData = [...dataSource];
    const target = newData.find((item) => item.key === key);
    if (target) {
      target.editable = target.editable ? false : true;
      setDataSource(newData);
      setInitialData(newData);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código", // titulo del encabezado de la columna
      dataIndex: "key", // nombre del campo en el arreglo datsource
      key: "key", // nombre del identificador unico
      sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
      align: "center",
      fixed: "left",
      width: 100,
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
      width: 140,
      render: (_, record) => {
        return (
          <>
            {record.editable &&
            ["create", "edit", "aprobar"].includes(accion) ? (
              <InputNumber
                autoFocus
                defaultValue={record.cantidad == 0 ? "" : record.cantidad}
                size="small"
                onBlur={() => handleChangeEdit(record.key)}
                onChange={(e: any) => handleChangeAmount(e, record.key)}
              />
            ) : (
              <StyledText onClick={() => handleChangeEdit(record.key)}>
                {record.cantidad}
              </StyledText>
            )}
          </>
        );
      },
    },
  ];

  if (["create", "edit", "aprobar"].includes(accion)) {
    columns.push({
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      render: (_, record: { key: React.Key }) => {
        return (
          <>
            {["create", "edit", "aprobar"].includes(accion) ? (
              <Tooltip title="Remover">
                <Button
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.key)}
                />
              </Tooltip>
            ) : null}
          </>
        );
      },
      width: 70,
    });
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
    let flagCantidadDetalle = false;
    for (let index = 0; index < data.detalle.length; index++) {
      if (data.detalle[index]["cantidad"] <= 0) {
        flagCantidadDetalle = true;
        notificationApi.open({
          type: "error",
          message: `El producto ${data.detalle[index]["descripcion"]} tiene cantidad menor o igual a cero, por favor ingresa el valor`,
        });
      }
    }

    if (!flagCantidadDetalle) {
      setDetalleErrorMsg("");
      setLoader(true);
      if (id) {
        if (accion == "aprobar") {
          data.flagAprobar = true;
        }
        updateRQP(data, id)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: `Documento modificado con exito!`,
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
      } else {
        crearRQP(data)
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
      }
    }
  };
  `/${url[1]}/${url[2]}/${url[3]}`;

  const anularDocumento = () => {
    setLoader(true);
    const data = {
      rpq_id: id,
      accion: accion,
    };
    cambiarEstadoRQP(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha aprobado el documento con exito!`,
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

  const aprobarDocumento = () => {
    setLoader(true);
    const data = {
      rpq_id: id,
      accion: accion,
    };

    let mensaje_accion = "";
    switch (accion) {
      case "anular":
        mensaje_accion = "anulado";
        break;
      case "aprobar":
        mensaje_accion = "aprobado";
        break;
      case "desaprobar":
        mensaje_accion = "desaprobado";
        break;
    }
    cambiarEstadoRQP(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Se ha ${mensaje_accion} el documento con exito!`,
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

  return (
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
            Requisicion de Pedido{" "}
            {id && documentoInfo ? `- ${documentoInfo?.consecutivo}` : null}
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
          detalle={dataSource}
        />
        <Form
          layout={"vertical"}
          form={form}
          onFinish={control.handleSubmit(onFinish)}
        >
          <Row gutter={[12, 6]}>
            <Col span={24}>
              <Row>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 6, order: 1 }}>
                  <Controller
                    name={"bod_solicitante"}
                    control={control.control}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Bodega:">
                        <Select
                          {...field}
                          showSearch
                          options={optionsBodegas}
                          status={error && "error"}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toString().toLowerCase()
                              )
                          }
                          disabled={
                            !["create"].includes(accion) ||
                            !["administrador", "cotizaciones"].includes(
                              getSessionVariable(KEY_ROL)
                            )
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col
                  xs={{ span: 24, order: 1 }}
                  sm={{ offset: 10, span: 8, order: 2 }}
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
                <Col span={24} order={3}>
                  {estadosVisibles.includes(
                    camposEstados?.filter((item) => item.id_campo == "3").at(0)
                      ?.estado ?? ""
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
                            disabled={
                              ["create", "edit", "aprobar"].includes(accion)
                                ? false
                                : true
                            }
                            maxLength={250}
                            showCount
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
                {["create", "edit", "aprobar"].includes(accion) ? (
                  <>
                    <Col sm={8} xs={24}>
                      <Button
                        icon={<DownloadOutlined />}
                        block
                        onClick={() => {
                          setLoader(true);
                          downloadTemplate(`ExampleUploadExcellRQP.xlsx`)
                            .then((response) => {
                              const url = window.URL.createObjectURL(
                                new Blob([response.data])
                              );
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute(
                                "download",
                                `ExampleUploadExcellRQP.xlsx`
                              ); // Utiliza el nombre del archivo proporcionado
                              document.body.appendChild(link);
                              link.click();
                            })
                            .catch(({ response: { data } }) => {
                              const message = arrayBufferToString(data).replace(
                                /[ '"]+/g,
                                " "
                              );
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
                      sm={8}
                      xs={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <CustomUpload
                        beforeUpload={(file) => {
                          handleFileChange(file);
                          return false; // Evita la carga automática del archivo
                        }}
                        maxCount={1}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          type="primary"
                          disabled={btnAgregarProducto}
                          block
                        >
                          Cargar Excel
                        </Button>
                      </CustomUpload>
                    </Col>
                    <Col
                      sm={8}
                      xs={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        type="primary"
                        htmlType="button"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setOpenFlag(true)}
                        disabled={btnExcel}
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
                        disabled={dataSource.length == 0 ? true : false}
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
                    {accion == "aprobar" ? (
                      <>
                        <Button htmlType="submit" type="primary">
                          Guardar cambios y Aprobar
                        </Button>
                        <GreenButton
                          htmlType="button"
                          onClick={aprobarDocumento}
                        >
                          Aprobar
                        </GreenButton>
                      </>
                    ) : null}
                    {accion == "desaprobar" ? (
                      <>
                        <Button
                          danger
                          type="primary"
                          htmlType="button"
                          onClick={aprobarDocumento}
                        >
                          Desaprobar
                        </Button>
                      </>
                    ) : null}
                  </>
                ) : null}
              </Space>
            </Col>
          </Row>
        </Form>
      </StyledCard>
    </Spin>
  );
};
