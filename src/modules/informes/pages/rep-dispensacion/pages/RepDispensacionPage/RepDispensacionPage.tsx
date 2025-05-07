/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import useDateFunctions from "@/modules/common/hooks/useDateFunctions";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/router/GlobalContext";
import { Controller, useForm } from "react-hook-form";
import { KEY_BODEGA, KEY_ROL } from "@/config/api";
import { Bodega, Convenio } from "@/services/types";
import fileDownload from "js-file-download";
import {
  generarReporteDispensacion,
  generarInformePHPPuro,
  getConveniosRep,
  validarTotalRegistros,
} from "@/services/informes/reportesAPI";
import { GreenButton } from "./styled";
import { TypesForm } from "./types";
import {
  LoadingOutlined,
  FileExcelFilled,
  SearchOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import {
  ModalPendientesPaciente,
  ModalEntregaPacientes,
  ModalProductos,
  ModalCodPadres,
} from "../../components";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Button,
  Select,
  Input,
  Space,
  Form,
  Spin,
  Col,
  Row,
  Switch,
  Divider,
  Modal,
} from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RepDispensacionPage = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [openModalProductos, setOpenModalProductos] = useState<boolean>(false);
  const [selectClientes, setSelectClientes] = useState<SelectProps["options"]>(
    []
  );
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [openModalCodPadre, setOpenModalCodPadre] = useState<boolean>(false);
  const [estadoConvenios, setEstadoConvenios] = useState<string>("1");
  const [openModaPendientesPaciente, setOpenModalPendientesPaciente] =
    useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const { arrayBufferToString, stringToArrayBuffer } = useArrayBuffer();
  const [entregaPaciente, setEntregaPaciente] = useState<string[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [conveniosField, setConveniosField] = useState<boolean>(true);
  const [pacienteField, setPacienteField] = useState<boolean>(true);
  const [aceptaGenerarReporte, setAceptaGenerarReporte] =
    useState<boolean>(false);
  const [searchConvenio, setSearchConvenio] = useState<string>("");
  const [clienteField, setClienteField] = useState<boolean>(true);
  const [openModaEntregaPaciente, setOpenModalEntregaPaciente] =
    useState<boolean>(false);
  const [searchBodega, setSearchBodega] = useState<string>("");
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [selectConvenios, setSelectConvenios] = useState<
    SelectProps["options"]
  >([]);
  const [modal, contextHolderModal] = Modal.useModal();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const { disabled62DaysDate } = useDateFunctions();
  const user_rol = getSessionVariable(KEY_ROL);
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const control = useForm<TypesForm>({
    defaultValues: {
      tipo_reporte: "",
      identificacion_paciente: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      convenios: [],
      codigo_producto: [],
      codigo_padre: [],
      clientes: [],
    },
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const watchTipoReporte = control.watch("tipo_reporte");

  const selectTipoReporte: SelectProps["options"] = [
    { label: "Dispensaciones Movimientos", value: "dis_movimientos" },
    { label: "Devoluciones General", value: "dev_movimientos" },
    { label: "Revisión Cuota Moderadora", value: "rev_cuota_moderadora" },
    { label: "Pendientes", value: "pendientes" },
    { label: "Consulta Entrega Paciente", value: "consulta_entrega_paciente" },
    {
      label: "Consulta Pendientes Paciente",
      value: "consulta_pendientes_paciente",
    },
    { label: "Resolución 1604", value: "resolucion_1604" },
    { label: "Cuota Moderadora Detallado", value: "dis_cuota_moderadora" },
    { label: "Dispensación Consolidada", value: "dispensacion_consolidada" },
  ];

  ["administrador", "quimico"].includes(user_rol)
    ? selectTipoReporte.push({
        label: "Seguimiento a Pendientes",
        value: "seguimiento_pendientes",
      })
    : null;

  ["administrador", "quimico", "regente_farmacia"].includes(user_rol)
    ? selectTipoReporte.push({
        label: "Movimientos Consolidado Controlados",
        value: "mv_consolidado_controlados",
      })
    : null;

  ["administrador", "quimico"].includes(user_rol)
    ? selectTipoReporte.push(
        {
          label: "Estadisticas Dispensacion",
          value: "estadisticas_dispensacion",
        },
        { label: "Dispensación Diaria FOMAG", value: "dispensacion_fomag" }
      )
    : null;

  if (
    [
      "administrador",
      "quimico",
      "regente",
      "regente_farmacia",
      "auditoria",
      "cotizaciones",
    ].includes(user_rol)
  ) {
    selectTipoReporte.push({
      label: "Movimientos MCE",
      value: "movimientos_mce",
    });
    selectTipoReporte.push({
      label: "Indicadores Operativos",
      value: "indicadores_operativos",
    });
  }

  ["administrador", "auditoria"].includes(user_rol)
    ? selectTipoReporte.push(
        { label: "Dispensación Genaral Huv", value: "dispensacion_huv" },
        { label: "Devoluciones General Huv", value: "devoluciones_huv" }
      )
    : null;

  ["administrador", "contabilidad", "revisor_compras"].includes(user_rol)
    ? selectTipoReporte.push({
        label: "Informe Costos",
        value: "informe_costos",
      })
    : null;

  // const selectEstados: SelectProps["options"] = [
  //   { label: "Abierto", value: "1" },
  //   { label: "Cerrado", value: "3" },
  //   { label: "Anulado", value: "4" },
  // ];

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setBodegas(data);
      setSelectBodegas(
        data.map((bodega) => {
          return { label: bodega.bod_nombre, value: bodega.id };
        })
      );
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    control.reset({
      tipo_reporte: watchTipoReporte,
      identificacion_paciente: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      convenios: [],
      codigo_producto: [],
      codigo_padre: [],
      clientes: [],
    });
    if (
      ["consulta_entrega_paciente", "consulta_pendientes_paciente"].includes(
        watchTipoReporte
      )
    ) {
      setPacienteField(true);
    } else {
      setPacienteField(false);
    }

    if (
      [
        "dis_movimientos",
        "dispensacion_consolidada",
        "seguimiento_pendientes",
        "estadisticas_dispensacion",
        "resolucion_1604",
        "indicadores_operativos",
      ].includes(watchTipoReporte)
    ) {
      setLoader(true);
      setConveniosField(true);
    } else {
      setConveniosField(false);
    }

    if (
      ["rev_cuota_moderadora", "dis_cuota_moderadora"].includes(
        watchTipoReporte
      )
    ) {
      setLoader(true);
      setClienteField(true);
    } else {
      setClienteField(false);
    }

    if (
      [
        "dis_movimientos",
        "dispensacion_consolidada",
        "seguimiento_pendientes",
        "estadisticas_dispensacion",
        "resolucion_1604",
        "rev_cuota_moderadora",
        "dis_cuota_moderadora",
        "indicadores_operativos",
      ].includes(watchTipoReporte)
    ) {
      getConveniosRep()
        .then(({ data: { data } }) => {
          setConvenios(data);
          const opciones: SelectProps["options"] = [];

          data.forEach((convenio) => {
            if (
              JSON.parse(convenio.bodegas).includes(parseInt(bodega_id)) &&
              convenio.estado == estadoConvenios
            ) {
              opciones.push({
                value: convenio.id,
                label: `${convenio.num_contrato} - ${convenio.descripcion}`,
              });
            }
          });

          setSelectConvenios(opciones);

          const conveniosAgrupados = Object.values(
            Object.groupBy(data, ({ nit }: any) => nit)
          );

          setSelectClientes(
            conveniosAgrupados.map((item) => {
              return {
                value: item ? item[0].nit : "",
                label: item
                  ? `${item[0].nit} - ${item[0].tercero.razon_soc}`
                  : "",
              };
            })
          );
        })
        .finally(() => setLoader(false));
    }
  }, [watchTipoReporte]);

  useEffect(() => {
    if (userGlobal) {
      if (
        ["movimientos_mce", "mv_consolidado_controlados"].includes(
          watchTipoReporte
        )
      ) {
        setSelectBodegas(
          userGlobal.bodega.map((item) => ({
            value: item.bodega.id,
            label: item.bodega.bod_nombre,
          }))
        );
      } else {
        setSelectBodegas(
          bodegas.map((item) => ({ value: item.id, label: item.bod_nombre }))
        );
      }
    }
  }, [userGlobal, watchTipoReporte]);

  useEffect(() => {
    const opciones: SelectProps["options"] = [];
    control.setValue("convenios", []);

    convenios.forEach((convenio) => {
      if (
        JSON.parse(convenio.bodegas).includes(parseInt(bodega_id)) &&
        convenio.estado == estadoConvenios
      ) {
        opciones.push({
          value: convenio.id,
          label: `${convenio.num_contrato} - ${convenio.descripcion}`,
        });
      }
    });

    setSelectConvenios(opciones);
  }, [estadoConvenios]);

  useEffect(() => {
    if (aceptaGenerarReporte) {
      buttonRef.current?.click();
    }
  }, [aceptaGenerarReporte]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    data.fechas_rango = [
      dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
      dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
    ];
    const filename = selectTipoReporte
      .find((item) => item.value == data.tipo_reporte)
      ?.label?.toString()
      .toUpperCase();
    data.filename = filename;
    generarReporteDispensacion(data)
      .then(({ data }) => {
        fileDownload(data, `${filename}.xlsx`);
        notificationApi.open({
          type: "success",
          message: "Reporte generado con exito!",
        });
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => setLoader(false));
  };

  const selectPaciente = (value: any) => {
    value.fechas_rango = [
      dayjs(value.fechas_rango[0]).format("YYYY-MM-DD"),
      dayjs(value.fechas_rango[1]).format("YYYY-MM-DD"),
    ];
    setEntregaPaciente(value);
    switch (control.getValues("tipo_reporte")) {
      case "consulta_entrega_paciente":
        setOpenModalEntregaPaciente(true);
        break;
      case "consulta_pendientes_paciente":
        setOpenModalPendientesPaciente(true);
        break;
    }
  };

  const handleSelectAll = (origin: string) => {
    switch (origin) {
      case "bodegas":
        if (selectBodegas) {
          if (
            selectBodegas.filter((item) => item.disabled != true).length ===
            control.getValues("bodegas").length
          ) {
            control.setValue("bodegas", []);
          } else {
            const opcionesSeleccionadas: any[] = [];
            selectBodegas.forEach((item) => {
              if (typeof item.value === "number" && item.disabled != true) {
                opcionesSeleccionadas.push(item.value);
              }
            });
            control.setValue("bodegas", opcionesSeleccionadas);
          }
        }
        break;
    }
  };

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <ModalProductos
        open={openModalProductos}
        setOpen={(value: boolean) => setOpenModalProductos(value)}
        productos={control.getValues("codigo_producto")}
        addProducto={(producto: string) => {
          const selectProductos = control.getValues("codigo_producto");
          if (Array.isArray(selectProductos)) {
            control.setValue("codigo_producto", [...selectProductos, producto]);
            setOpenModalProductos(false);
          }
        }}
      />
      <ModalCodPadres
        open={openModalCodPadre}
        setOpen={(value: boolean) => setOpenModalCodPadre(value)}
        padres={control.getValues("codigo_padre")}
        addPadre={(padre: string) => {
          const selectPadres = control.getValues("codigo_padre");
          if (Array.isArray(selectPadres)) {
            control.setValue("codigo_padre", [...selectPadres, padre]);
            setOpenModalCodPadre(false);
          }
        }}
      />
      <ModalEntregaPacientes
        open={openModaEntregaPaciente}
        setOpen={(value: boolean) => setOpenModalEntregaPaciente(value)}
        data={entregaPaciente}
      />
      <ModalPendientesPaciente
        open={openModaPendientesPaciente}
        setOpen={(value: boolean) => setOpenModalPendientesPaciente(value)}
        data={control.getValues()}
      />
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>REPORTES DE DISPENSACIÓN</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            {...([
              "consulta_entrega_paciente",
              "consulta_pendientes_paciente",
            ].includes(watchTipoReporte)
              ? control.handleSubmit(selectPaciente)
              : null)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="tipo_reporte"
                  rules={{
                    required: {
                      value: true,
                      message: "Tipo de Reporte es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Tipo de Reporte:"} required>
                      <Select
                        {...field}
                        showSearch
                        allowClear
                        placeholder="Tipo Reporte"
                        options={selectTipoReporte}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="fechas_rango"
                  rules={{
                    required: {
                      value: true,
                      message: "Rango de Fechas es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas:"} required>
                      <RangePicker
                        {...field}
                        placeholder={["Inicio", "Fin"]}
                        status={error && "error"}
                        picker={
                          ["mv_consolidado_controlados"].includes(
                            control.getValues("tipo_reporte")
                          )
                            ? "month"
                            : "date"
                        }
                        style={{ width: "100%" }}
                        maxDate={dayjs()}
                        minDate={
                          userGlobal &&
                          [1, "1"].includes(userGlobal.has_limite_reportes) &&
                          ![
                            "consulta_entrega_paciente",
                            "consulta_pendientes_paciente",
                            "estadisticas_dispensacion",
                            "rev_cuota_moderadora",
                            "dis_cuota_moderadora",
                            "pendientes",
                            "movimientos_mce",
                            "mv_consolidado_controlados",
                          ].includes(control.getValues("tipo_reporte"))
                            ? dayjs().subtract(1, "day")
                            : undefined
                        }
                        disabledDate={
                          [
                            "consulta_entrega_paciente",
                            "consulta_pendientes_paciente",
                            "mv_consolidado_controlados",
                          ].includes(control.getValues("tipo_reporte"))
                            ? undefined
                            : disabled62DaysDate
                        }
                        disabled={
                          control.getValues("tipo_reporte") ? false : true
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {conveniosField ? (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Controller
                      control={control.control}
                      name="convenios"
                      rules={{
                        required: {
                          value: true,
                          message: "Convenios es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label={
                            <Space>
                              <Text>Convenios: </Text>
                              <Switch
                                checked={estadoConvenios == "1"}
                                checkedChildren={"Activos"}
                                unCheckedChildren={"Inactivos"}
                                onChange={(value: boolean) =>
                                  setEstadoConvenios(value ? "1" : "0")
                                }
                              />
                            </Space>
                          }
                        >
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            placeholder="Convenios"
                            options={selectConvenios}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            maxTagCount={3}
                            searchValue={searchConvenio}
                            onSearch={(value: string) => {
                              setSearchConvenio(value);
                            }}
                            onBlur={() => {
                              setSearchConvenio("");
                            }}
                            popupMatchSelectWidth={false}
                            status={error && "error"}
                            disabled={
                              control.getValues("tipo_reporte") ? false : true
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </>
              ) : null}
              {clienteField ? (
                <>
                  <Col xs={{ span: 24 }} md={{ span: 24 }}>
                    <Controller
                      control={control.control}
                      name="clientes"
                      rules={{
                        required: {
                          value: true,
                          message: "Clientes es necesario",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Clientes:"}>
                          <Select
                            {...field}
                            allowClear
                            mode="multiple"
                            placeholder="Clientes"
                            options={selectClientes}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            maxTagCount={3}
                            searchValue={searchConvenio}
                            onSearch={(value: string) => {
                              setSearchConvenio(value);
                            }}
                            onBlur={() => {
                              setSearchConvenio("");
                            }}
                            popupMatchSelectWidth={false}
                            status={error && "error"}
                            disabled={
                              control.getValues("tipo_reporte") ? false : true
                            }
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </>
              ) : null}
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="bodegas"
                  rules={{
                    required: {
                      value: [
                        "movimientos_mce",
                        "mv_consolidado_controlados",
                      ].includes(control.getValues("tipo_reporte"))
                        ? true
                        : false,
                      message: "Bodegas es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required={[
                        "movimientos_mce",
                        "mv_consolidado_controlados",
                      ].includes(control.getValues("tipo_reporte"))}
                      label={"Bodegas:"}
                    >
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Bodegas"
                        options={selectBodegas}
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
                        maxTagCount={3}
                        searchValue={searchBodega}
                        onSearch={(value: string) => {
                          setSearchBodega(value);
                        }}
                        onBlur={() => {
                          setSearchBodega("");
                        }}
                        status={error && "error"}
                        dropdownRender={(menu) => (
                          <>
                            <div>
                              <Button
                                type="text"
                                shape="round"
                                onClick={() => handleSelectAll("bodegas")}
                              >
                                Seleccionar todos
                              </Button>
                            </div>
                            <Divider style={{ marginBlock: 5 }} />
                            {menu}
                          </>
                        )}
                        disabled={
                          control.getValues("tipo_reporte") ? false : true
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {watchTipoReporte == "dis_movimientos" ? (
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="estados"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Estados:"}>
                        <Select
                          {...field}
                          allowClear
                          mode="multiple"
                          placeholder="Estados"
                          options={[
                            { value: "1", label: "Abiertos" },
                            { value: "4", label: "Anulados" },
                          ]}
                          status={error && "error"}
                          disabled={
                            control.getValues("tipo_reporte") ? false : true
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}

              {["dis_movimientos"].includes(
                control.getValues("tipo_reporte")
              ) ? (
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="codigo_producto"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Código Producto:"}>
                        <Space.Compact style={{ width: "100%" }}>
                          <Select
                            {...field}
                            allowClear
                            mode="tags"
                            suffixIcon={null}
                            notFoundContent={null}
                            maxTagCount={3}
                            placeholder="Código Producto"
                            status={error && "error"}
                            style={{ width: "100%" }}
                            disabled={
                              control.getValues("tipo_reporte") ? false : true
                            }
                          />
                          <Button
                            icon={<SearchOutlined />}
                            onClick={() => setOpenModalProductos(true)}
                          />
                        </Space.Compact>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              {["pendientes"].includes(control.getValues("tipo_reporte")) ? (
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="codigo_padre"
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label={"Código Padre:"}>
                        <Space.Compact style={{ width: "100%" }}>
                          <Select
                            {...field}
                            allowClear
                            mode="tags"
                            suffixIcon={null}
                            notFoundContent={null}
                            maxTagCount={3}
                            placeholder="Código Padre"
                            status={error && "error"}
                            style={{ width: "100%" }}
                            disabled={
                              control.getValues("tipo_reporte") ? false : true
                            }
                          />
                          <Button
                            icon={<SearchOutlined />}
                            onClick={() => setOpenModalCodPadre(true)}
                          />
                        </Space.Compact>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              {pacienteField ? (
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="identificacion_paciente"
                    rules={{
                      required: {
                        value: true,
                        message: "Identificacion paciente es necesario",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        label={"Identificación Paciente:"}
                        required
                      >
                        <Input
                          {...field}
                          allowClear
                          placeholder="Identificación Paciente"
                          status={error && "error"}
                          disabled={
                            control.getValues("tipo_reporte") ? false : true
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
            </Row>
            <Row gutter={[12, 12]} style={{ marginTop: 15 }}>
              {[
                "consulta_entrega_paciente",
                "consulta_pendientes_paciente",
              ].includes(watchTipoReporte) ? (
                <Col
                  xs={{ span: 24 }}
                  sm={{
                    span: 10,
                    offset: 7,
                  }}
                  md={{
                    span: 6,
                    offset: 9,
                  }}
                >
                  <Button
                    type="primary"
                    block
                    icon={<BlockOutlined />}
                    htmlType="submit"
                    onClick={control.handleSubmit(selectPaciente)}
                    disabled={control.getValues("tipo_reporte") ? false : true}
                  >
                    Ver en Pantalla
                  </Button>
                </Col>
              ) : null}
              <Col
                xs={{ span: 24 }}
                sm={{
                  span: 10,
                  offset: 7,
                }}
                md={{
                  span: 6,
                  offset: 9,
                }}
              >
                <GreenButton
                  type="primary"
                  block
                  icon={<FileExcelFilled />}
                  disabled={control.getValues("tipo_reporte") ? false : true}
                  ref={buttonRef}
                  onClick={() => {
                    control.clearErrors();
                    setLoader(true);
                    if (!control.getValues("fechas_rango")) {
                      setLoader(false);
                      control.setError("fechas_rango", {
                        type: "required",
                        message: "Rango de Fechas es necesario",
                      });
                      return;
                    }
                    if (
                      [
                        "consulta_entrega_paciente",
                        "consulta_pendientes_paciente",
                      ].includes(control.getValues("tipo_reporte")) &&
                      control.getValues("identificacion_paciente").length == 0
                    ) {
                      setLoader(false);
                      control.setError("identificacion_paciente", {
                        type: "required",
                        message:
                          "Debes digitar el número de identifación del paciente",
                      });
                      return;
                    }
                    if (
                      ["seguimiento_pendientes"].includes(
                        control.getValues("tipo_reporte")
                      ) &&
                      control.getValues("convenios").length == 0
                    ) {
                      setLoader(false);
                      control.setError("convenios", {
                        type: "required",
                        message: "Debes seleccionar la menos un convenio",
                      });
                      return;
                    }
                    if (
                      ["rev_cuota_moderadora", "dis_cuota_moderadora"].includes(
                        control.getValues("tipo_reporte")
                      ) &&
                      control.getValues("clientes").length == 0
                    ) {
                      setLoader(false);
                      control.setError("clientes", {
                        type: "required",
                        message: "Debes seleccionar la menos un cliente",
                      });
                      return;
                    }
                    if (
                      [
                        "movimientos_mce",
                        "mv_consolidado_controlados",
                      ].includes(control.getValues("tipo_reporte")) &&
                      control.getValues("bodegas").length == 0
                    ) {
                      setLoader(false);
                      control.setError("bodegas", {
                        type: "required",
                        message: "Debes seleccionar la menos una bodega",
                      });
                      return;
                    }
                    const rango_fechas =
                      control.getValues("fechas_rango") ?? [];
                    let initialDate = dayjs(rango_fechas[0]).format(
                      "YYYY-MM-DD"
                    );
                    let endDate = dayjs(rango_fechas[1]).format("YYYY-MM-DD");
                    let lastMonthDay = "";
                    let nombre_archivo = "";
                    switch (control.getValues("tipo_reporte")) {
                      case "movimientos_mce":
                        nombre_archivo = "reporteMovimientosControladosSQL";
                        break;
                      case "informe_costos":
                        nombre_archivo = "reporteCostosContabilidadSQL";
                        break;
                      case "seguimiento_pendientes":
                        nombre_archivo = "reporteSeguimientoPendientesSQL";
                        break;
                      case "estadisticas_dispensacion":
                        nombre_archivo = "reporteEstadisticasDispensacionSQL";
                        break;
                      case "dispensacion_fomag":
                        nombre_archivo = "reporteDiarioDispensacionFomagSQL";
                        break;
                      case "dis_movimientos":
                        nombre_archivo = "reporteDispensacionMovimientosSQL";
                        break;
                      case "dispensacion_consolidada":
                        nombre_archivo = "reporteDispensacionConsolidadaSQL";
                        break;
                      case "pendientes":
                        nombre_archivo = "reportePendientesSQL";
                        break;
                      case "rev_cuota_moderadora":
                        nombre_archivo = "reporteRevisionCuotaModeradoraSQL";
                        break;
                      case "dis_cuota_moderadora":
                        nombre_archivo = "reporteCuotaModeradoraDetalladoSQL";
                        break;
                      case "consulta_entrega_paciente":
                        nombre_archivo = "reporteEntregaPacienteSQL";
                        break;
                      case "dev_movimientos":
                        nombre_archivo = "reporteDevolucionMovimientosSQL";
                        break;
                      case "resolucion_1604":
                        nombre_archivo = "reporteResolucion_1604SQL";
                        break;
                      case "consulta_pendientes_paciente":
                        nombre_archivo = "reportePendientesPacienteSQL";
                        break;
                      case "dispensacion_huv":
                        nombre_archivo = "reporteSalidasGralHuvSQL";
                        break;
                      case "devoluciones_huv":
                        nombre_archivo =
                          "reporteDevolucionesDispensacionHuvSQL";
                        break;
                      case "indicadores_operativos":
                        nombre_archivo = "reporteIndicadoresOperativosSQL";
                        break;
                      case "mv_consolidado_controlados":
                        initialDate = dayjs(rango_fechas[0])
                          .startOf("month")
                          .format("YYYY-MM-DD");
                        endDate = dayjs(rango_fechas[1])
                          .endOf("month")
                          .format("YYYY-MM-DD");
                        lastMonthDay = dayjs(rango_fechas[0])
                          .subtract(1, "month")
                          .endOf("month")
                          .format("YYYY-MM-DD");
                        nombre_archivo =
                          "dispensacion/reporteMovimientosConsolidadoControladosSQL";
                        break;
                    }

                    if (
                      ["dis_movimientos", "pendientes"].includes(
                        control.getValues("tipo_reporte")
                      ) &&
                      ["administrador", "compras", "cotizaciones"].includes(
                        user_rol
                      ) &&
                      !aceptaGenerarReporte
                    ) {
                      generarInformePHPPuro(
                        {
                          ...control.getValues(),
                          initialDate,
                          endDate,
                          user_rol,
                          lastMonthDay,
                          only_sql: true,
                        },
                        nombre_archivo
                      ).then(({ data }) => {
                        const sql = data;
                        notificationApi.info({
                          message: "Validando registros...",
                        });
                        validarTotalRegistros({ sql })
                          .then(({ data: { data } }) => {
                            modal.confirm({
                              title: "Generar Reporte",
                              content: `El reporte que estás intentando generar tiene ${data} filas, ¿Deseas generarlo?`,
                              onOk: () => {
                                setAceptaGenerarReporte(true);
                              },
                              onCancel: () => {
                                setAceptaGenerarReporte(false);
                              },
                              okText: "Si",
                              cancelText: "No",
                            });
                          })
                          .catch(({ request: { response } }) => {
                            notificationApi.open({
                              type: "error",
                              message: response,
                            });
                          })
                          .finally(() => {
                            setLoader(false);
                          });
                      });

                      return;
                    }
                    notificationApi.info({
                      message: "Generando reporte...",
                    });
                    generarInformePHPPuro(
                      {
                        ...control.getValues(),
                        initialDate,
                        endDate,
                        user_rol,
                        lastMonthDay,
                        has_fuentes: userGlobal
                          ? userGlobal.has_fuentes == "1"
                            ? true
                            : false
                          : false,
                      },
                      nombre_archivo
                    )
                      .then(({ data }) => {
                        const filename = selectTipoReporte
                          .find(
                            (item) =>
                              item.value == control.getValues("tipo_reporte")
                          )
                          ?.label?.toString()
                          .toUpperCase();
                        fileDownload(
                          stringToArrayBuffer(data),
                          `${filename}.xls`
                        );
                        notificationApi.open({
                          type: "success",
                          message: "Reporte generado con exito!",
                        });
                      })
                      .catch(({ request: { response } }) => {
                        notificationApi.open({
                          type: "error",
                          message: response,
                        });
                      })
                      .finally(() => {
                        setLoader(false);
                        setAceptaGenerarReporte(false);
                      });
                  }}
                >
                  Reporte General
                </GreenButton>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
