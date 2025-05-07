/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DistribucionCabecera, ErroresPlano } from "@/services/types";
import { useScreenSize } from "@/modules/common/hooks/useScreenSize";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { CustomInputNumber, CustomUpload } from "./styled";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { ModalErroresPlano } from "../../components";
import {
  getPlantillaDistribucion,
  updateDistribucion,
  crearDistribucion,
  getDistribucion,
} from "@/services/distribucion/distComprasAPI";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { BASE_URL } from "@/config/api";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
  UploadOutlined,
  DeleteFilled,
  // PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  ResponsePlanoDistCompras,
  DistBodega,
  FormTypes,
  DataType,
} from "./types";
import {
  notification,
  SelectProps,
  UploadProps,
  Typography,
  Button,
  Select,
  Switch,
  Input,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Tooltip,
} from "antd";
import fileDownload from "js-file-download";

const { Text } = Typography;

export const FormDistCompras = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [erroresPlano, setErroresPlano] = useState<ErroresPlano[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [btnSaveDisabled, setBtnSaveDisabled] = useState<boolean>(false);
  const [flagFixedColumns, setFlagFixedColumns] = useState<boolean>(true);
  const [distCompra, setDistCompra] = useState<DistribucionCabecera>();
  const { id } = useParams<{ id: string }>();
  const control = useForm<FormTypes>();
  const { width } = useScreenSize();
  const navigate = useNavigate();

  const watchBodegas = control.watch("bodegas") ?? [];
  const watchDetalle = control.watch("detalle");

  useEffect(() => {
    setLoader(true);
    getBodegasSebthi()
      .then(({ data: { data } }) => {
        setSelectBodegas(
          data.map((bodega) => ({
            value: bodega.id,
            label: bodega.bod_nombre,
          }))
        );
        if (id) {
          getDistribucion(id)
            .then(({ data: { data } }) => {
              setDistCompra(data);
              control.setValue("nombre", data.nombre);
              control.setValue("descripcion", data.descripcion);
              control.setValue("bodegas", JSON.parse(data.bodegas));
              const detalle: DataType[] = data.detalle.map((item) => {
                const {
                  producto_id,
                  desc_producto,
                  rqp_id,
                  rqp_info: { consecutivo },
                  cantidad_max,
                } = item[0];
                let total_cantidad_distribucion = 0;
                let total_cantidad_trasladada = 0;
                const bodegas: DistBodega[] = item.map(
                  ({
                    bodega_id,
                    bodega: { bod_nombre },
                    cantidad_distribucion,
                    cantidad_trasladada,
                    has_alerta,
                  }) => {
                    total_cantidad_distribucion += parseInt(
                      cantidad_distribucion
                    );
                    total_cantidad_trasladada += parseInt(cantidad_trasladada);
                    return {
                      bodega_id: parseInt(bodega_id),
                      bodega_nombre: bod_nombre,
                      cantidad_distribucion: parseInt(cantidad_distribucion),
                      cantidad_trasladada: parseInt(cantidad_trasladada),
                      has_alerta: parseInt(has_alerta),
                      key: `${producto_id}_${bodega_id}`,
                    };
                  }
                );
                return {
                  key: producto_id,
                  producto_id,
                  descripcion: desc_producto,
                  total_cantidad_distribucion,
                  total_cantidad_trasladada,
                  bodegas,
                  cantidad_max,
                  rqp_id,
                  rqp_consec: consecutivo,
                };
              });
              control.setValue("detalle", detalle);
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
      .finally(() => (!id ? setLoader(false) : null));
  }, [id]);

  useEffect(() => {
    if (watchDetalle) {
      const newDetalle = watchDetalle.map((item) => {
        const total_cantidad_distribucion = item.bodegas.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.cantidad_distribucion,
          0
        );
        const total_cantidad_trasladada = item.bodegas.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.cantidad_trasladada,
          0
        );
        return {
          ...item,
          total_cantidad_distribucion,
          total_cantidad_trasladada,
        };
      });

      setDataSource(newDetalle);
    }
  }, [watchDetalle]);

  useEffect(() => {
    if (watchDetalle) {
      for (let index = 0; index < watchDetalle.length; index++) {
        const item = watchDetalle[index];
        const total_cantidad_distribucion = item.bodegas.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.cantidad_distribucion,
          0
        );
        if (total_cantidad_distribucion > item.cantidad_max) {
          setBtnSaveDisabled(true);
          break;
        } else {
          setBtnSaveDisabled(false);
        }
      }
    }
  }, [watchDetalle]);

  useEffect(() => {
    if (width > 1300) {
      setFlagFixedColumns(true);
    } else {
      setFlagFixedColumns(false);
    }
  }, [width]);

  const uploadProps: UploadProps = {
    name: "distribuciones",
    showUploadList: false,
    action: `${BASE_URL}distribucion/compras/cargar-plano`,
    // data: { bodegas: control.getValues("bodegas") },
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".xls",
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file) {
      // control.setValue("detalle", []);
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        "application/vnd.ms-excel";
      if (!isExcel) {
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xls",
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info) {
      setLoader(true);
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        setLoader(false);
        const {
          file: { response },
        } = info;
        const data: ResponsePlanoDistCompras = response;
        if (data.errores.length > 0) {
          setErroresPlano(data.errores);
          setOpenModalErroresPlano(true);
          setLoader(false);
          control.reset();
        } else {
          control.setValue("bodegas", data.bodegas_select);
          control.setValue("detalle", data.items);
        }
        notificationApi.open({
          type: info.file.response.status,
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

  const columns: ColumnsType<DataType> = [
    {
      key: "producto_id",
      dataIndex: "producto_id",
      title: "CODIGO",
      align: "center",
      width: 80,
      fixed: flagFixedColumns ? "left" : false,
      render(value) {
        return <Text style={{ fontSize: 11 }}>{value}</Text>;
      },
      filterSearch: true,
      onFilter: (value, record) =>
        record.producto_id.startsWith(value as string),
      filters: dataSource.map((item) => ({
        text: item.producto_id,
        value: item.producto_id,
      })),
    },
    {
      key: "descripcion",
      dataIndex: "descripcion",
      title: "PRODUCTO",
      width: 250,
      fixed: flagFixedColumns ? "left" : false,
      render(value, { cantidad_max, total_cantidad_distribucion }) {
        return (
          <Space direction="vertical">
            <Text style={{ fontSize: 11 }}>{value}</Text>
            {total_cantidad_distribucion > cantidad_max ? (
              <Text
                style={{ fontSize: 11, textAlign: "center" }}
                type="danger"
                strong
              >
                Cantidad de distribución supera la cantidad de la RQP (
                {cantidad_max})
              </Text>
            ) : null}
          </Space>
        );
      },
      filterSearch: true,
      onFilter: (value, record) =>
        record.descripcion.startsWith(value as string),
      filters: dataSource.map((item) => ({
        text: item.descripcion,
        value: item.descripcion,
      })),
    },
    {
      key: "totales",
      title: "TOTALES",
      align: "center",
      width: 140,
      fixed: flagFixedColumns ? "left" : false,
      children: [
        {
          key: "total_cantidad_distribucion",
          dataIndex: "total_cantidad_distribucion",
          title: <Text style={{ fontSize: 11, color: "#FFFFFF" }}>DISTR.</Text>,
          align: "center",
          width: 80,
          fixed: flagFixedColumns ? "left" : false,
        },
        {
          key: "total_cantidad_trasladada",
          dataIndex: "total_cantidad_trasladada",
          title: (
            <Text style={{ fontSize: 11, color: "#FFFFFF" }}>TRASLADOS</Text>
          ),
          align: "center",
          width: 80,
          hidden: distCompra ? false : true,
          fixed: flagFixedColumns ? "left" : false,
        },
      ],
    },
    {
      key: "rqp_consec",
      dataIndex: "rqp_consec",
      title: "RQP",
      align: "center",
      width: 100,
      fixed: flagFixedColumns ? "left" : false,
      render(value, { cantidad_max }) {
        return (
          <Space direction="vertical">
            <Text style={{ fontSize: 11 }}>{value}</Text>
            <Text style={{ fontSize: 10 }} type="danger" strong>
              Cantidad máxima: {cantidad_max}
            </Text>
          </Space>
        );
      },
    },
    {
      key: "bodegas",
      dataIndex: "bodegas",
      title: "BODEGAS",
      children:
        control.getValues("detalle") && control.getValues("detalle").length > 0
          ? control.getValues("detalle")[0].bodegas.map((bodega, index) => {
              return {
                key: "bodega",
                dataIndex: "bodega",
                title: bodega.bodega_nombre,
                align: "center",
                children: [
                  {
                    title: "Distr",
                    dataIndex: "distribucion",
                    align: "center",
                    width: 90,
                    render(_, record) {
                      const indexProducto = control
                        .getValues("detalle")
                        .findIndex((producto) => producto.key === record.key);
                      return (
                        <>
                          <Controller
                            name={`detalle.${indexProducto}.bodegas.${index}.cantidad_distribucion`}
                            control={control.control}
                            rules={{
                              required: {
                                value: true,
                                message:
                                  "La cantidad de distribución es necesaria",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => {
                              return (
                                <>
                                  <CustomInputNumber
                                    {...field}
                                    size="small"
                                    min={0}
                                    maxLength={15}
                                    controls={false}
                                    onChange={(value: any) => {
                                      const itemDetalle = record;
                                      const bodegaDetalle = bodega;
                                      const detalle: DataType[] = control
                                        .getValues("detalle")
                                        .map((item) => {
                                          const bodegas: DistBodega[] =
                                            item.bodegas.map((bodega) => {
                                              if (
                                                item.key == itemDetalle.key &&
                                                bodega.bodega_id ==
                                                  bodegaDetalle.bodega_id
                                              ) {
                                                return {
                                                  ...bodega,
                                                  cantidad_distribucion: value,
                                                };
                                              } else {
                                                return bodega;
                                              }
                                            });
                                          return { ...item, bodegas };
                                        });
                                      control.setValue("detalle", detalle);
                                    }}
                                    placeholder="Cantidad Distribucion"
                                    status={error && "error"}
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                  <Text type="danger">{error?.message}</Text>
                                </>
                              );
                            }}
                          />
                        </>
                      );
                    },
                  },
                  {
                    title: "Traslados",
                    dataIndex: "traslados",
                    align: "center",
                    hidden: distCompra ? false : true,
                    width: 90,
                    render(_, record) {
                      const indexProducto = control
                        .getValues("detalle")
                        .findIndex((producto) => producto.key === record.key);
                      return (
                        <>
                          <Controller
                            name={`detalle.${indexProducto}.bodegas.${index}.cantidad_trasladada`}
                            control={control.control}
                            render={({ field }) => {
                              return (
                                <>
                                  <CustomInputNumber
                                    {...field}
                                    size="small"
                                    min={0}
                                    maxLength={15}
                                    controls={false}
                                    placeholder="Cantidad Trasladada"
                                    style={{
                                      width: "100%",
                                    }}
                                    disabled
                                  />
                                </>
                              );
                            }}
                          />
                        </>
                      );
                    },
                  },
                  {
                    title: "Alerta",
                    dataIndex: "alerta",
                    align: "center",
                    width: 90,
                    render(_, record) {
                      const indexProducto = control
                        .getValues("detalle")
                        .findIndex((producto) => producto.key === record.key);
                      return (
                        <>
                          <Controller
                            name={`detalle.${indexProducto}.bodegas.${index}.has_alerta`}
                            control={control.control}
                            render={({ field }) => {
                              return (
                                <>
                                  <Switch
                                    size="small"
                                    defaultValue={
                                      field.value == 1 ? true : false
                                    }
                                    onClick={(value: boolean) => {
                                      const itemDetalle = record;
                                      const bodegaDetalle = bodega;
                                      const detalle: DataType[] = control
                                        .getValues("detalle")
                                        .map((item) => {
                                          const bodegas: DistBodega[] =
                                            item.bodegas.map((bodega) => {
                                              if (
                                                item.key == itemDetalle.key &&
                                                bodega.bodega_id ==
                                                  bodegaDetalle.bodega_id
                                              ) {
                                                return {
                                                  ...bodega,
                                                  has_alerta: value ? 1 : 0,
                                                };
                                              } else {
                                                return bodega;
                                              }
                                            });
                                          return { ...item, bodegas };
                                        });
                                      control.setValue("detalle", detalle);
                                    }}
                                  />
                                </>
                              );
                            }}
                          />
                        </>
                      );
                    },
                  },
                ],
              };
            })
          : [],
    },
    {
      key: "acciones",
      title: "Acciones",
      align: "center",
      width: 70,
      fixed: flagFixedColumns ? "right" : false,
      render(_, { key }) {
        return (
          <>
            <Space direction="horizontal">
              <Tooltip title="Remover producto">
                <Button
                  size="small"
                  type="primary"
                  danger
                  onClick={() => {
                    const detalle: DataType[] = control
                      .getValues("detalle")
                      .filter((item) => item.key != key);
                    control.setValue("detalle", detalle);
                  }}
                >
                  <DeleteFilled />
                </Button>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  const generarPlantilla = () => {
    setLoader(true);
    const data = control.getValues();
    getPlantillaDistribucion(data)
      .then(({ data }) => {
        fileDownload(data, control.getValues("nombre") + ".xls");
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

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    if (distCompra) {
      updateDistribucion(data, id)
        .then(() => {
          notificationApi.success({
            message: "Distribución de compra actualizada con exito!",
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
          }
        );
    } else {
      crearDistribucion(data)
        .then(() => {
          notificationApi.success({
            message: "Distribución de compra creada con exito!",
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
          }
        );
    }
  };

  return (
    <>
      {contextHolder}
      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => {
          setErroresPlano([]);
          setOpenModalErroresPlano(value);
        }}
        errores={erroresPlano}
      />

      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          autoComplete="off"
          onKeyDown={(e: any) => checkKeyDown(e)}
        >
          <StyledCard
            title={
              (distCompra ? "Editar" : "Crear") +
              " Distribución de Compra" +
              (distCompra ? " - " + distCompra.consecutivo : "")
            }
            extra={
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SaveOutlined />}
                  disabled={btnSaveDisabled}
                >
                  Guardar
                </Button>

                {distCompra ? (
                  <Link to="../.." relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Volver
                    </Button>
                  </Link>
                ) : (
                  <Link to=".." relative="path">
                    <Button danger type="primary" icon={<ArrowLeftOutlined />}>
                      Volver
                    </Button>
                  </Link>
                )}
              </Space>
            }
          >
            <Row gutter={[12, 18]}>
              <Col xs={24} sm={12}>
                <Controller
                  name="nombre"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message:
                        "Nombre de la distribución de compra es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem required label={"Nombre:"}>
                        <Input
                          {...field}
                          placeholder="Nombre"
                          maxLength={50}
                          showCount
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Controller
                  name="bodegas"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Bodegas es requerido",
                    },
                    minLength: {
                      value: 1,
                      message: "Debes seleccionar al menos una bodega",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem required label={"Bodegas:"}>
                        <Select
                          {...field}
                          allowClear
                          mode="multiple"
                          maxTagCount={2}
                          placeholder="Bodegas"
                          options={selectBodegas}
                          style={{ width: "100%" }}
                          status={error && "error"}
                          onBlur={() => {
                            setSearchValueSelect("");
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onSearch={(value: string) => {
                            setSearchValueSelect(value);
                          }}
                          searchValue={searchValueSelect}
                          disabled
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              <Col xs={24} sm={24}>
                <Controller
                  name="descripcion"
                  control={control.control}
                  render={({ field }) => {
                    return (
                      <StyledFormItem label={"Descripción:"}>
                        <TextArea
                          {...field}
                          showCount
                          maxLength={250}
                          placeholder="Observación:"
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      </StyledFormItem>
                    );
                  }}
                />
              </Col>
              {!distCompra ? (
                <Col xs={24} md={8}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Button
                      block
                      icon={<DownloadOutlined />}
                      onClick={() => generarPlantilla()}
                    >
                      Generar Plantilla
                    </Button>
                    <CustomUpload {...uploadProps}>
                      <Button
                        block
                        size="middle"
                        type="primary"
                        icon={<UploadOutlined />}
                      >
                        Cargar
                      </Button>
                    </CustomUpload>
                  </Space.Compact>
                </Col>
              ) : null}

              <Col xs={24}>
                <Table
                  bordered
                  size="small"
                  columns={columns}
                  scroll={{
                    x:
                      (distCompra ? 650 : 490) +
                      (watchBodegas ? watchBodegas.length * 270 : 0),
                  }}
                  dataSource={dataSource}
                  pagination={{ hideOnSinglePage: true }}
                />
              </Col>
            </Row>
          </StyledCard>
        </Form>
      </Spin>
    </>
  );
};
