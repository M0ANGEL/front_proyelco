/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";
import { AlertasPlano, Aliado, Convenio, ErroresPlano } from "@/services/types";
import { ModalAlertasPlano, ModalErroresPlano } from "../../components";
import { getConveniosActivos } from "@/services/salud/conveniosAPI";
import { ProductosAliados, ResponsePlanoProductos } from "./types";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { downloadTemplate } from "@/services/documentos/otrosAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useForm } from "react-hook-form";
import { SearchBar } from "../ListAliados/styled";
import { useEffect, useState } from "react";
import { CustomUpload } from "./styled";
import { BASE_URL } from "@/config/api";
import {
  getAliadoInfo,
  updateAliado,
  crearAliado,
} from "@/services/aliados/aliadosAPI";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
  UploadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  notification,
  UploadProps,
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

const { Text } = Typography;

export const FormAliados = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [productosAliados, setProductosAliado] = useState<ProductosAliados[]>(
    []
  );
  const [initialData, setInitialData] = useState<ProductosAliados[]>([]);
  const [erroresPlano, setErroresPlano] = useState<ErroresPlano[]>([]);
  const [alertasPlano, setAlertasPlano] = useState<AlertasPlano[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [openModalAlertasPlano, setOpenModalAlertasPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();
  const [aliado, setAliado] = useState<Aliado>();
  const control = useForm({ mode: "onChange" });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoader(true);
      getAliadoInfo(id)
        .then(({ data: { data } }) => {
          setAliado(data);
          setLoader(false);
          control.reset({
            aldo_nombre: data.aldo_nombre,
            aldo_descripcion: data.aldo_descripcion,
            convenio_id: data.convenio_id,
            estado: data.estado,
          });
          const productos: ProductosAliados[] = data.productos.map((item) => {
            return {
              codigo_producto_aliado: item.codigo_aliado,
              codigo_producto_sebthi: item.producto_id,
              descripcion_sebthi: item.producto.descripcion,
              tarifa: parseFloat(item.tarifa),
            };
          });
          setProductosAliado(productos);
          setInitialData(productos);
        })
        .catch((error) => {
          notificationApi.error({
            message: error.code,
            description: error.message,
          });
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
    getConveniosActivos().then(({ data: { data } }) => {
      setConvenios(data);
    });
  }, [id]);

  const uploadProps: UploadProps = {
    name: "productos",
    showUploadList: false,
    action: `${BASE_URL}aliados/cargar-plano-productos`,
    data: { aliado_id: aliado ? aliado.id : null },
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
        const data: ResponsePlanoProductos = response;
        if (data.errores.length > 0) {
          setErroresPlano(data.errores);
          setProductosAliado([]);
          setInitialData([]);
          setOpenModalErroresPlano(true);
          setLoader(false);
        } else {
          if (data.alertas.length > 0) {
            setOpenModalAlertasPlano(true);
            setAlertasPlano(data.alertas);
          } else {
            setProductosAliado(data.items);
            setInitialData(data.items);
          }
          setLoader(false);
        }
        notificationApi.open({
          type: info.file.response.status,
          message: info.file.response.message,
          duration: 10,
        });
      } else if (info.file.status === "error") {
        setProductosAliado([]);
        setInitialData([]);
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 10,
        });
      }
    },
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setProductosAliado(filterTable);
  };

  const onFinish = (data: any) => {
    setLoader(true);
    if (initialData && initialData.length == 0) {
      notificationApi.error({
        message:
          "Se debe cargar los productos primero antes de guardar los datos del aliado.",
      });
      setLoader(false);
      return;
    }
    data.productos = initialData;
    if (aliado) {
      updateAliado(data, id)
        .then(() => {
          notificationApi.success({
            message: "Aliado actualizado con exito!",
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
      crearAliado(data)
        .then(() => {
          notificationApi.success({ message: "Aliado creado con exito!" });
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

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <>
      {contextHolder}

      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => setOpenModalErroresPlano(value)}
        errores={erroresPlano}
      />
      <ModalAlertasPlano
        open={openModalAlertasPlano}
        setOpen={(value: boolean, alertas: AlertasPlano[]) => {
          if (alertas.length > 0) {
            const productos = productosAliados.map((item) => {
              const alerta = alertas.find(
                (alerta) =>
                  alerta.producto_aliado.toString() ==
                  item.codigo_producto_aliado.toString()
              );
              if (alerta) {
                return {
                  ...item,
                  codigo_producto_sebthi: alerta.producto_sebthi,
                  tarifa: alerta.tarifa,
                };
              } else {
                return item;
              }
            });
            setProductosAliado(productos);
            setInitialData(productos);
            notificationApi.info({
              message:
                "Lista de productos actualizada, debes darle guardar para aplicar los cambios",
              duration: 10,
            });
          }
          setOpenModalAlertasPlano(value);
        }}
        alertas={alertasPlano}
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
            title={(aliado ? "Editar" : "Crear") + " aliado"}
            extra={
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<SaveOutlined />}
                >
                  Guardar
                </Button>

                {aliado ? (
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
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Controller
                  control={control.control}
                  name="aldo_nombre"
                  rules={{
                    required: {
                      value: true,
                      message: "Nombre del aliado es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem required label={"Nombre:"}>
                        <Input
                          {...field}
                          placeholder="Nombre"
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
                <Controller
                  control={control.control}
                  name="aldo_descripcion"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem label={"Descripción:"}>
                        <Input
                          {...field}
                          placeholder="Descripción"
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
                  control={control.control}
                  name="convenio_id"
                  rules={{
                    required: {
                      value: true,
                      message: "Convenio es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <StyledFormItem required label={"Convenio:"}>
                        <Select
                          {...field}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={convenios
                            .filter((item) => item.estado == "1")
                            .map((item) => ({
                              label: item.descripcion,
                              value: item.id.toString(),
                            }))}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    );
                  }}
                />
                <Controller
                  name="estado"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Estado es requerido",
                    },
                  }}
                  defaultValue={"1"}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Estado:">
                      <Select
                        {...field}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
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
              </Col>
              <Col xs={24} sm={{ offset: 12, span: 12 }}>
                <Space.Compact style={{ width: "100%" }}>
                  <Button
                    icon={<DownloadOutlined />}
                    block
                    onClick={() => {
                      setLoader(true);
                      downloadTemplate(
                        `ExampleUploadPlanoProductosAliados.xlsx`
                      )
                        .then((response) => {
                          const url = window.URL.createObjectURL(
                            new Blob([response.data])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            `ExampleUploadPlanoProductosAliados.xlsx`
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
              <Col xs={24}>
                <SearchBar>
                  <Input placeholder="Buscar" onChange={handleSearch} />
                  <ExportExcel
                    excelData={productosAliados.map((item) => ({
                      Codigo_Aliado: item.codigo_producto_aliado,
                      Codigo_Sebthi: item.codigo_producto_sebthi,
                      Descripcion_Sebthi: item.descripcion_sebthi,
                      Tarifa: item.tarifa,
                    }))}
                    fileName={"Productos Aliado - " + aliado?.aldo_nombre}
                  />
                </SearchBar>
                <Table
                  bordered
                  size="small"
                  rowKey={(record) =>
                    `${record.codigo_producto_aliado}_${record.codigo_producto_sebthi}`
                  }
                  dataSource={productosAliados}
                  columns={[
                    {
                      key: "codigo_producto_aliado",
                      dataIndex: "codigo_producto_aliado",
                      title: "Codigo Producto",
                      align: "center",
                    },
                    {
                      key: "codigo_producto_sebthi",
                      dataIndex: "codigo_producto_sebthi",
                      title: "Codigo Producto Sebthi",
                      align: "center",
                    },
                    {
                      key: "descripcion_sebthi",
                      dataIndex: "descripcion_sebthi",
                      title: "Descripción Producto Sebthi",
                    },
                    {
                      key: "tarifa",
                      dataIndex: "tarifa",
                      title: "Tarifa",
                      width: 100,
                      align: "center",
                      render(value: number) {
                        return <>$ {value.toLocaleString("es-CO")}</>;
                      },
                    },
                  ]}
                />
              </Col>
            </Row>
          </StyledCard>
        </Form>
      </Spin>
    </>
  );
};
