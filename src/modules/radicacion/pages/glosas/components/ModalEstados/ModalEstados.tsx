/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CustomSelect } from "@/modules/common/components/CustomSelect/CustomSelect";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { FacturaFVECabecera, FacturaFVEDetalle } from "@/services/types";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import { ReloadOutlined /*, SearchOutlined*/ } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import { useEffect /*, useRef*/, useState } from "react";
import { StyledFormItemGlosas } from "./styled";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import {
  cambiarEstadoGlosa,
  actualizarDetalle,
  getFacturaInfo,
} from "@/services/radicacion/glosasAPI";
import dayjs, { Dayjs } from "dayjs";
import { Props } from "./types";
import {
  //TableColumnType,
  notification,
  InputNumber,
  SelectProps,
  DatePicker,
  Typography,
  //InputRef,
  Button,
  Select,
  //Input,
  Modal,
  Space,
  Table,
  Form,
  Spin,
  Col,
  Row,
  Tag,
} from "antd";

const { Text, Title } = Typography;

export const ModalEstados = ({
  selectEstados,
  id_factura,
  facturas,
  setOpen,
  open,
}: Props) => {
  const [selectMotivos, setSelectMotivos] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loaderMotivos, setLoaderMotivos] = useState<boolean>(false);
  const [factura, setFactura] = useState<FacturaFVECabecera>();
  const [loader, setLoader] = useState<boolean>(false);
  //const searchInput = useRef<InputRef>(null);
  const control = useForm<{
    id_factura: React.Key | undefined;
    detalle: FacturaFVEDetalle[];
    estado: string | undefined;
    facturas: React.Key[];
    tipo_cambio: string;
    etapa: string;
    fecha: undefined | Dayjs;
  }>({
    defaultValues: {
      detalle: factura?.detalle,
      estado: undefined,
      tipo_cambio: "",
      id_factura,
      facturas,
      etapa: "",
      fecha: undefined,
    },
  });

  const watchEtapa = control.watch("etapa");
  const watchDetalle = control.watch("detalle");

  useEffect(() => {
    if (id_factura && open) {
      control.setValue("id_factura", id_factura);
      control.setValue("tipo_cambio", "individual");
      setLoader(true);
      setLoaderMotivos(true);
      getFacturaInfo(id_factura)
        .then(({ data: { data } }) => {
          setFactura(data);
          control.setValue("estado", data.estado_glosa);
          control.setValue("detalle", data.detalle);
          getMotivosAud()
            .then(({ data: { data } }) => {
              setSelectMotivos(
                data.map((item) => ({
                  value: item.id.toString(),
                  label: `${item.codigo} - ${item.motivo}`,
                }))
              );
            })
            .finally(() => setLoaderMotivos(false));
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
    } else {
      setLoader(false);
      control.setValue("facturas", facturas);
      control.setValue("tipo_cambio", "masivo");
    }
  }, [facturas, id_factura, open]);

  useEffect(() => {
    if (watchEtapa && factura) {
      switch (watchEtapa) {
        case "fecha_glosa":
          if (factura.radicacion.fecha_glosa) {
            control.setValue("fecha", dayjs(factura.radicacion.fecha_glosa));
            control.clearErrors("fecha");
          } else {
            control.setValue("fecha", undefined);
          }
          break;
        case "fecha_respuesta":
          if (factura.radicacion.fecha_respuesta) {
            control.setValue(
              "fecha",
              dayjs(factura.radicacion.fecha_respuesta)
            );
            control.clearErrors("fecha");
          } else {
            control.setValue("fecha", undefined);
          }
          break;
        case "fecha_ratificacion":
          if (factura.radicacion.fecha_ratificacion) {
            control.setValue(
              "fecha",
              dayjs(factura.radicacion.fecha_ratificacion)
            );
            control.clearErrors("fecha");
          } else {
            control.setValue("fecha", undefined);
          }
          break;
        case "fecha_conciliacion":
          if (factura.radicacion.fecha_conciliacion) {
            control.setValue(
              "fecha",
              dayjs(factura.radicacion.fecha_conciliacion)
            );
            control.clearErrors("fecha");
          } else {
            control.setValue("fecha", undefined);
          }
          break;

        default:
          control.setValue("fecha", undefined);
          break;
      }
    }
  }, [watchEtapa, factura]);

  useEffect(() => {
    if (watchDetalle && factura) {
      setFactura({ ...factura, detalle: watchDetalle });
    }
  }, [watchDetalle]);

  // const getColumnSearchProps = (
  //   dataIndex: keyof FacturaFVEDetalle
  // ): TableColumnType<FacturaFVEDetalle> => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Buscar ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => confirm()}
  //         style={{
  //           marginBottom: 8,
  //           display: "block",
  //           textTransform: "uppercase",
  //         }}
  //         disabled={false}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => confirm()}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //           disabled={false}
  //         >
  //           Buscar
  //         </Button>
  //         <Button
  //           onClick={() => {
  //             clearFilters && clearFilters();
  //             confirm();
  //           }}
  //           size="small"
  //           style={{ width: 90 }}
  //           disabled={false}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => {
  //     const filterProps = filtered
  //       ? { backgroundColor: "white", padding: 2, borderRadius: 10 }
  //       : null;
  //     return (
  //       <SearchOutlined
  //         style={{
  //           color: filtered ? "#1677ff" : "#f0a81d",
  //           fontSize: 15,
  //           ...filterProps,
  //         }}
  //       />
  //     );
  //   },
  //   onFilter: (value, record) => {
  //     let nestedValue = "";
  //     switch (dataIndex) {
  //       default:
  //         nestedValue = record[dataIndex]?.toString().toLowerCase() || "";
  //         break;
  //     }

  //     return nestedValue
  //       .toLowerCase()
  //       .includes((value as string).toLowerCase());
  //   },
  // });

  const columns: ColumnsType<FacturaFVEDetalle> = [
    {
      key: "codigo_producto",
      dataIndex: "codigo_producto",
      title: "Código",
      align: "center",
      width: 120,
      // ...getColumnSearchProps("codigo_producto"),
    },
    {
      key: "cum",
      dataIndex: "cum",
      title: "CUM",
      align: "center",
      width: 120,
      // ...getColumnSearchProps("cum"),
    },
    {
      key: "descripcion",
      dataIndex: "descripcion",
      title: "Descripción",
      width: 400,
      // ...getColumnSearchProps("descripcion"),
    },
    {
      key: "cantidad_entregada",
      dataIndex: "cantidad_entregada",
      title: "Cantidad",
      align: "center",
      width: 80,
    },
    {
      key: "precio_venta_total",
      dataIndex: "precio_venta_total",
      title: "Valor Total",
      align: "center",
      width: 200,
      render(value) {
        return (
          <Text style={{ fontSize: 12 }}>
            $ {parseFloat(value).toLocaleString("es-CO")}
          </Text>
        );
      },
    },
    {
      key: "motivos_glosa",
      dataIndex: "motivos_glosa",
      title: "Motivos Glosa",
      align: "center",
      width: 400,
      render(
        _,
        {
          precio_venta_total,
          motivo1_id,
          aclaracion1,
          motivo2_id,
          aclaracion2,
          motivo3_id,
          aclaracion3,
        },
        index
      ) {
        return (
          <Spin spinning={loaderMotivos}>
            <Space direction="vertical" style={{ width: "100%", gap: 0 }}>
              <StyledFormItemGlosas
                className="box-motivo-1"
                inputNumber={1}
                column={"glosa"}
                label={<Title level={5}>Motivo y aclaración 1:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo1_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion1`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Aclaración 1"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_glosado`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Glosado 1"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(motivo1_id) ||
                          [null, "", undefined].includes(aclaracion1)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={2}
                column={"glosa"}
                label={<Title level={5}>Motivo y aclaración 2:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo2_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion2`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Aclaración 2"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_glosado2`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Glosado 2"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(motivo2_id) ||
                          [null, "", undefined].includes(aclaracion2)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={3}
                column={"glosa"}
                label={<Title level={5}>Motivo y aclaración 3:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo3_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion3`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Aclaración 2"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_glosado3`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Glosado 3"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(motivo3_id) ||
                          [null, "", undefined].includes(aclaracion3)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
              </StyledFormItemGlosas>
            </Space>
          </Spin>
        );
      },
    },
    {
      key: "valor_glosado",
      dataIndex: "valor_glosado",
      title: "Valor Glosado",
      align: "center",
      hidden: true,
      width: 170,
      render(_, { precio_venta_total }, index) {
        return (
          <Controller
            name={`detalle.${index}.valor_glosado`}
            control={control.control}
            rules={{
              required: { value: true, message: "Debes ingresar un valor" },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItemGlosas>
                <Spin spinning={loaderMotivos}>
                  <InputNumber
                    {...field}
                    min={0}
                    maxLength={15}
                    controls={false}
                    placeholder="Valor Glosado"
                    status={error && "error"}
                    style={{ width: "100%" }}
                    max={parseFloat(precio_venta_total)}
                    prefix={"$"}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItemGlosas>
            )}
          />
        );
      },
    },
    {
      key: "motivos_respuesta",
      dataIndex: "motivos_respuesta",
      title: "Motivos Respuesta",
      align: "center",
      width: 400,
      render(
        _,
        {
          precio_venta_total,
          motivo_respuesta_id,
          aclaracion_respuesta,
          motivo2_respuesta_id,
          aclaracion2_respuesta,
          motivo3_respuesta_id,
          aclaracion3_respuesta,
        },
        index
      ) {
        return (
          <Spin spinning={loaderMotivos}>
            <Space direction="vertical" style={{ width: "100%", gap: 0 }}>
              <StyledFormItemGlosas
                inputNumber={1}
                column={"rpta"}
                label={<Title level={5}>Motivo y respuesta 1:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo_respuesta_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion_respuesta`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta 1"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_aceptado`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado 1"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(motivo_respuesta_id) ||
                          [null, "", undefined].includes(aclaracion_respuesta)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={2}
                column={"rpta"}
                label={<Title level={5}>Motivo y respuesta 2:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo2_respuesta_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion2_respuesta`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta 2"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_aceptado2`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado 2"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(
                            motivo2_respuesta_id
                          ) ||
                          [null, "", undefined].includes(aclaracion2_respuesta)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={3}
                column={"rpta"}
                label={<Title level={5}>Motivo y respuesta 3:</Title>}
              >
                <Controller
                  name={`detalle.${index}.motivo3_respuesta_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion3_respuesta`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta 3"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_aceptado3`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado 3"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(
                            motivo3_respuesta_id
                          ) ||
                          [null, "", undefined].includes(aclaracion3_respuesta)
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
            </Space>
          </Spin>
        );
      },
    },
    {
      key: "valor_aceptado",
      dataIndex: "valor_aceptado",
      title: "Valor Aceptado",
      align: "center",
      width: 170,
      hidden: true,
      render(value, { precio_venta_total }, index) {
        return (
          <Controller
            name={`detalle.${index}.valor_aceptado`}
            control={control.control}
            rules={{
              required: { value: true, message: "Debes ingresar un valor" },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem>
                <Spin spinning={loaderMotivos}>
                  <InputNumber
                    {...field}
                    min={0}
                    maxLength={15}
                    controls={false}
                    defaultValue={parseFloat(value)}
                    placeholder="Valor Aceptado"
                    status={error && "error"}
                    style={{ width: "100%" }}
                    max={parseFloat(precio_venta_total)}
                    prefix={"$"}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        );
      },
    },
    {
      key: "valor_ratificado",
      dataIndex: "valor_ratificado",
      title: "Valor Ratificado",
      align: "center",
      width: 400,
      render(_, { precio_venta_total }, index) {
        return (
          <Spin spinning={loaderMotivos}>
            <Space direction="vertical" style={{ width: "100%", gap: 0 }}>
              <StyledFormItemGlosas
                inputNumber={1}
                column={"rat"}
                label={<Title level={5}>Valor Ratificado 1:</Title>}
              >
                <Controller
                  name={`detalle.${index}.valor_ratificado`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Ratificado 1"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={2}
                column={"rat"}
                label={<Title level={5}>Valor Ratificado 2:</Title>}
              >
                <Controller
                  name={`detalle.${index}.valor_ratificado2`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Ratificado 2"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={3}
                column={"rat"}
                label={<Title level={5}>Valor Ratificado 3:</Title>}
              >
                <Controller
                  name={`detalle.${index}.valor_ratificado3`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Ratificado 3"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
            </Space>
          </Spin>
        );
      },
    },

    {
      key: "motivos_respuesta_ratificacion",
      dataIndex: "motivos_respuesta_ratificacion",
      title: "Motivos Respuesta Ratificación",
      align: "center",
      width: 400,
      render(
        _,
        {
          precio_venta_total,
          motivo_rpta_ratificacion_id,
          aclaracion_rpta_ratificacion,
          motivo2_rpta_ratificacion_id,
          aclaracion2_rpta_ratificacion,
          motivo3_rpta_ratificacion_id,
          aclaracion3_rpta_ratificacion,
        },
        index
      ) {
        return (
          <Spin spinning={loaderMotivos}>
            <Space direction="vertical" style={{ width: "100%", gap: 0 }}>
              <StyledFormItemGlosas
                inputNumber={1}
                column={"rpta_rat"}
                label={
                  <Title level={5}>Motivo y respuesta ratificación 1:</Title>
                }
              >
                <Controller
                  name={`detalle.${index}.motivo_rpta_ratificacion_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion_rpta_ratificacion`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta Ratificación 1"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_rpta_ratificacion`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado Ratificación 1"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(
                            motivo_rpta_ratificacion_id
                          ) ||
                          [null, "", undefined].includes(
                            aclaracion_rpta_ratificacion
                          )
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={2}
                column={"rpta_rat"}
                label={
                  <Title level={5}>Motivo y respuesta ratificación 2:</Title>
                }
              >
                <Controller
                  name={`detalle.${index}.motivo2_rpta_ratificacion_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.aclaracion2_rpta_ratificacion`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta Ratificación 2"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_rpta_ratificacion2`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado Ratificación 2"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(
                            motivo2_rpta_ratificacion_id
                          ) ||
                          [null, "", undefined].includes(
                            aclaracion2_rpta_ratificacion
                          )
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
              <StyledFormItemGlosas
                inputNumber={3}
                column={"rpta_rat"}
                label={
                  <Title level={5}>Motivo y respuesta ratificación 3:</Title>
                }
              >
                <Controller
                  name={`detalle.${index}.motivo3_rpta_ratificacion_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas style={{ maxWidth: 400 }}>
                      <CustomSelect
                        {...field}
                        options={selectMotivos}
                        placeholder="Motivo"
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.motivo3_rpta_ratificacion_id`}
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItemGlosas>
                      <TextArea
                        {...field}
                        rows={2}
                        autoSize
                        maxLength={500}
                        status={error && "error"}
                        placeholder="Observación Respuesta Ratificación 3"
                        style={{ width: "100%", fontSize: 13 }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItemGlosas>
                  )}
                />
                <Controller
                  name={`detalle.${index}.valor_aceptado3`}
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Debes ingresar un valor",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem>
                      <InputNumber
                        {...field}
                        min={0}
                        maxLength={15}
                        controls={false}
                        placeholder="Valor Aceptado Ratificación 3"
                        status={error && "error"}
                        style={{ width: "100%" }}
                        max={parseFloat(precio_venta_total)}
                        prefix={"$"}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled={
                          [null, "", undefined].includes(
                            motivo3_rpta_ratificacion_id
                          ) ||
                          [null, "", undefined].includes(
                            aclaracion3_rpta_ratificacion
                          )
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </StyledFormItemGlosas>
            </Space>
          </Spin>
        );
      },
    },
    {
      key: "valor_conciliado",
      dataIndex: "valor_conciliado",
      title: "Valor Conciliado",
      align: "center",
      width: 400,
      render(_, { precio_venta_total }, index) {
        return (
          <>
            <Spin spinning={loaderMotivos}>
              <Space direction="vertical" style={{ width: "100%", gap: 0 }}>
                <StyledFormItemGlosas
                  inputNumber={1}
                  column={"conc"}
                  label={<Title level={5}>Valor Conciliado 1:</Title>}
                >
                  <Controller
                    name={`detalle.${index}.valor_conciliado`}
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Debes ingresar un valor",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <InputNumber
                          {...field}
                          min={0}
                          maxLength={15}
                          controls={false}
                          placeholder="Valor Conciliado 1"
                          status={error && "error"}
                          style={{ width: "100%" }}
                          max={parseFloat(precio_venta_total)}
                          prefix={"$"}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </StyledFormItemGlosas>
                <StyledFormItemGlosas
                  inputNumber={2}
                  column={"conc"}
                  label={<Title level={5}>Valor Conciliado 2:</Title>}
                >
                  <Controller
                    name={`detalle.${index}.valor_conciliado2`}
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Debes ingresar un valor",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <InputNumber
                          {...field}
                          min={0}
                          maxLength={15}
                          controls={false}
                          placeholder="Valor Ratificado 2"
                          status={error && "error"}
                          style={{ width: "100%" }}
                          max={parseFloat(precio_venta_total)}
                          prefix={"$"}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </StyledFormItemGlosas>
                <StyledFormItemGlosas
                  inputNumber={3}
                  column={"conc"}
                  label={<Title level={5}>Valor Conciliado 3:</Title>}
                >
                  <Controller
                    name={`detalle.${index}.valor_conciliado3`}
                    control={control.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Debes ingresar un valor",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem>
                        <InputNumber
                          {...field}
                          min={0}
                          maxLength={15}
                          controls={false}
                          placeholder="Valor Conciliado 3"
                          status={error && "error"}
                          style={{ width: "100%" }}
                          max={parseFloat(precio_venta_total)}
                          prefix={"$"}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </StyledFormItemGlosas>
              </Space>
            </Spin>
          </>
        );
      },
    },
    {
      dataIndex: "acciones",
      key: "acciones",
      title: "Acciones",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, { id }) => (
        <Space>
          <Button
            type="primary"
            onClick={() =>
              guardarDetalle(
                control.getValues("detalle").find((item) => (item.id = id))
              )
            }
          >
            <ReloadOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const guardarDetalle = (data: any) => {
    setLoaderMotivos(true);
    actualizarDetalle(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: "Datos actualizados exitosamente.",
        });
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
      .finally(() => setLoaderMotivos(false));
  };

  const clearValues = (flagEnvio = false) => {
    setOpen(false, flagEnvio);
    control.reset();
    control.setValue("id_factura", undefined);
    control.setValue("facturas", []);
    control.setValue("estado", undefined);
    control.setValue("detalle", []);
    setFactura(undefined);
  };

  const onFinish = (data: any) => {
    if (data.tipo_cambio == "individual") {
      data.radicacion_id = factura?.radicacion.id;
    }
    data.fecha = dayjs(data.fecha).format("YYYY-MM-DD");
    setLoader(true);
    cambiarEstadoGlosa(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: !id_factura
            ? "Se ha cambiado el estado glosa a " +
              facturas.length +
              " facturas exitosamente."
            : "Cambio de estado exitoso.",
        });
        setTimeout(() => {
          clearValues(true);
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
    <>
      {contextHolder}
      <Modal
        open={open}
        onCancel={() => {
          clearValues();
        }}
        footer={[]}
        title={!id_factura ? "Cambio masivo de estados" : "Cambio de estado"}
        destroyOnClose={true}
        width={1800}
        style={{ top: 6 }}
      >
        <Spin spinning={loader}>
          <Form
            layout="vertical"
            onKeyDown={(e: any) =>
              e.key === "Enter" ? e.preventDefault() : null
            }
            onFinish={control.handleSubmit(onFinish)}
            size="small"
          >
            <Row gutter={[12, 0]}>
              {!id_factura ? (
                <Col
                  span={24}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>
                    Se afectaran un total de{" "}
                    <Tag color="cyan" style={{ fontSize: 14 }}>
                      {facturas.length}
                    </Tag>
                    facturas
                  </Text>
                </Col>
              ) : null}
              <Col xs={24} sm={{ offset: 6, span: 12 }}>
                <Controller
                  control={control.control}
                  name="estado"
                  rules={{
                    required: {
                      value: true,
                      message: "Debes seleccionar un estado",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required
                      label={"Estados:"}
                      extra={`Selecciona un estado de glosa para ${
                        !id_factura ? "las facturas" : "la factura"
                      }`}
                    >
                      <Spin spinning={loaderMotivos}>
                        <Select
                          {...field}
                          showSearch
                          popupMatchSelectWidth={false}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={selectEstados}
                          placeholder="Estado glosa"
                          status={error && "error"}
                        />
                      </Spin>
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {factura ? (
                <>
                  <Col xs={24} sm={{ span: 8 }}>
                    <StyledFormItem label="Fecha radicado:">
                      <DatePicker
                        style={{ width: "100%" }}
                        value={dayjs(factura.radicacion.fecha_radicado)}
                        disabled
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} sm={{ span: 8 }}>
                    <Controller
                      name="etapa"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Etapa del proceso es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <StyledFormItem required label="Etapa:">
                            <Select
                              {...field}
                              status={error && "error"}
                              options={[
                                {
                                  label: "Glosa Inicial",
                                  value: "fecha_glosa",
                                },
                                { label: "Devolución", value: "devolucion" },
                                {
                                  label: "Respuesta",
                                  value: "fecha_respuesta",
                                },
                                {
                                  label: "Ratificación",
                                  value: "fecha_ratificacion",
                                },
                                {
                                  label: "Respuesta Ratificación",
                                  value: "fecha_rpta_ratificacion",
                                },
                                {
                                  label: "Conciliación",
                                  value: "fecha_conciliacion",
                                },
                              ]}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        );
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={{ span: 8 }}>
                    <Controller
                      name="fecha"
                      control={control.control}
                      rules={{
                        required: {
                          value: true,
                          message: "Fecha de la etapa es requerida",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <StyledFormItem required label="Fecha notificación:">
                            <DatePicker
                              {...field}
                              status={error && "error"}
                              placeholder="Seleccionar fecha"
                              style={{ width: "100%" }}
                              maxDate={dayjs()}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        );
                      }}
                    />
                  </Col>
                </>
              ) : null}

              <Col xs={24} sm={24}>
                {factura ? (
                  <Table
                    rowKey={(record) => record.id}
                    bordered
                    size="small"
                    columns={columns}
                    dataSource={factura.detalle}
                    scroll={{ x: 2260, y: 550 }}
                    pagination={{ pageSize: 100, hideOnSinglePage: true }}
                    className="table-glosas"
                    rowClassName={(_, index) =>
                      index % 2 === 0 ? "fila-par" : "fila-impar"
                    }
                  />
                ) : null}
              </Col>
              <Col xs={24} sm={{ offset: 6, span: 12 }}>
                <Button htmlType="submit" type="primary" block>
                  Cambiar Estado
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
