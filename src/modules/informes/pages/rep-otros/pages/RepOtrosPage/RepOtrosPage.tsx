/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConsultaDocumentos } from "@/services/informes/otrosDocumentosRepAPI";
import { ModalProductos, RepConsultaDocumentosTable } from "../../components";
import { getTiposDocumentos } from "@/services/maestras/tiposDocumentosAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { generarInformePHPPuro } from "@/services/informes/reportesAPI";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { RepConsultaDocumentos } from "@/services/types";
import { useContext, useEffect, useState } from "react";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { GlobalContext } from "@/router/GlobalContext";
import { Controller, useForm } from "react-hook-form";
import fileDownload from "js-file-download";
import { GreenButton } from "./styled";
import { KEY_ROL } from "@/config/api";
import { TypesForm } from "./types";
import {
  LoadingOutlined,
  FileExcelFilled,
  SearchOutlined,
} from "@ant-design/icons";
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
} from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const RepOtrosPage = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [openModalProductos, setOpenModalProductos] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<RepConsultaDocumentos[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectTipoDocumentos, setSelectTipoDocumentos] = useState<
    SelectProps["options"]
  >([]);
  const [loaderTipoDocumentos, setLoaderTipoDocumentos] =
    useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const control = useForm<TypesForm>({
    defaultValues: {
      tipo_reporte: "",
      bodegas: [],
      fechas_rango: undefined,
      consecutivos: [],
      productos: [],
      estados: [],
      documentos: [],
      documentos_origen: [],
      codigo_producto: [],
      lote: "",
      nombre_producto: "",
      codigo_paciente: "",
      apellido1_paciente: "",
    },
  });

  const watchTipoReporte = control.watch("tipo_reporte");
  const selectTipoReporte: SelectProps["options"] = [];

  if (["administrador", "quimico", "cotizaciones"].includes(user_rol)) {
    selectTipoReporte.push({
      label: "Consulta de Documentos",
      value: "consulta_documentos",
    });
  }

  if (["administrador", "cotizaciones"].includes(user_rol)) {
    selectTipoReporte.push({
      label: "Documentos Movimientos",
      value: "documentos_movimientos",
    });
  }

  const selectEstados: SelectProps["options"] = [
    { label: "Abierto", value: "0" },
    { label: "Pendientes", value: "1" },
    { label: "En Proceso", value: "2" },
    { label: "Cerrado", value: "3" },
    { label: "Anulado", value: "4" },
  ];

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setSelectBodegas(
        data.map((bodega) => {
          return { label: bodega.bod_nombre, value: bodega.id };
        })
      );
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (watchTipoReporte == "consulta_documentos") {
      setLoaderTipoDocumentos(true);
      getTiposDocumentos().then(({ data }) => {
        setSelectTipoDocumentos(
          data
            .filter(
              (item) =>
                ![
                  "FVE",
                  "FVC",
                  "NCE",
                  "NCC",
                  "NCV",
                  "ND",
                  "CR",
                  "TRP",
                ].includes(item.codigo)
            )
            .map((item) => ({
              value: item.id,
              label: `${item.codigo} - ${item.descripcion}`,
            }))
        );
        setLoaderTipoDocumentos(false);
      });
    }
  }, [watchTipoReporte]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    setDataSource([]);
    data.fechas_rango = [
      dayjs(data.fechas_rango[0]).format("YYYY-MM-DD"),
      dayjs(data.fechas_rango[1]).format("YYYY-MM-DD"),
    ];
    const filename = selectTipoReporte
      .find((item) => item.value == data.tipo_reporte)
      ?.label?.toString()
      .toUpperCase();
    data.filename = filename;
    switch (watchTipoReporte) {
      case "consulta_documentos":
        getConsultaDocumentos(data)
          .then(({ data: { data } }) => {
            setDataSource(data);
          })
          .catch(({ response: { data } }) => {
            notificationApi.open({
              type: "error",
              message: data,
            });
          })
          .finally(() => setLoader(false));
        break;

      default:
        break;
    }
  };

  return (
    <>
      {contextHolder}
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
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard
          title={<Title level={4}>REPORTES DE OTROS DOCUMENTOS</Title>}
        >
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 8]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
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
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
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
                        style={{ width: "100%" }}
                        maxDate={dayjs()}
                        minDate={
                          userGlobal &&
                          [1, "1"].includes(userGlobal.has_limite_reportes)
                            ? dayjs().subtract(1, "day")
                            : undefined
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{
                  span: ["consulta_documentos"].includes(
                    control.getValues("tipo_reporte")
                  )
                    ? 24
                    : 12,
                }}
              >
                <Controller
                  control={control.control}
                  name="bodegas"
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Bodegas:"}>
                      <Select
                        {...field}
                        allowClear
                        mode="multiple"
                        placeholder="Bodegas"
                        options={selectBodegas}
                        maxTagCount={4}
                        searchValue={searchValueSelect}
                        onSearch={(value: string) => {
                          setSearchValueSelect(value);
                        }}
                        onBlur={() => {
                          setSearchValueSelect("");
                        }}
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
              {["consulta_documentos"].includes(
                control.getValues("tipo_reporte")
              ) ? (
                <>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                    <Controller
                      control={control.control}
                      name="documentos_origen"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Tipo Documentos Origen:"}>
                          <Spin spinning={loaderTipoDocumentos}>
                            <Select
                              {...field}
                              allowClear
                              mode="multiple"
                              placeholder="Tipo Documentos Origen"
                              options={selectTipoDocumentos}
                              maxTagCount={4}
                              searchValue={searchValueSelect}
                              onSearch={(value: string) => {
                                setSearchValueSelect(value);
                              }}
                              onBlur={() => {
                                setSearchValueSelect("");
                              }}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              status={error && "error"}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                    <Controller
                      control={control.control}
                      name="documentos"
                      rules={{
                        required: {
                          value: true,
                          message:
                            "Debes seleccionar al menos un tipo de documento",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Tipo Documentos:"}>
                          <Spin spinning={loaderTipoDocumentos}>
                            <Select
                              {...field}
                              allowClear
                              mode="multiple"
                              placeholder="Tipo Documentos"
                              options={selectTipoDocumentos}
                              maxTagCount={4}
                              searchValue={searchValueSelect}
                              onSearch={(value: string) => {
                                setSearchValueSelect(value);
                              }}
                              onBlur={() => {
                                setSearchValueSelect("");
                              }}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              status={error && "error"}
                            />
                          </Spin>
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 8 }}>
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
                  <Col xs={{ span: 24 }} sm={{ span: 10 }}>
                    <Controller
                      control={control.control}
                      name="nombre_producto"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Nombre Producto:"}>
                          <Input
                            {...field}
                            allowClear
                            placeholder="Nombre Producto"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 6 }}>
                    <Controller
                      control={control.control}
                      name="lote"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Lote Producto:"}>
                          <Input
                            {...field}
                            allowClear
                            placeholder="Lote Producto"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                    <Controller
                      control={control.control}
                      name="codigo_paciente"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Código Paciente:"}>
                          <Input
                            {...field}
                            allowClear
                            placeholder="Código Paciente"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                    <Controller
                      control={control.control}
                      name="apellido1_paciente"
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem label={"Apellido1 Paciente:"}>
                          <Input
                            {...field}
                            allowClear
                            placeholder="Apellido1 Paciente"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </>
              ) : null}
              {["documentos_movimientos"].includes(
                control.getValues("tipo_reporte")
              ) ? (
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
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
                          options={selectEstados}
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}
              {["consulta_documentos"].includes(
                control.getValues("tipo_reporte")
              ) ? (
                <Col
                  xs={{ span: 24 }}
                  sm={{ offset: 7, span: 10 }}
                  md={{ offset: 9, span: 6 }}
                >
                  <Button type="primary" block htmlType="submit">
                    Consultar
                  </Button>
                </Col>
              ) : null}
              {["cotizaciones", "administrador"].includes(user_rol) &&
              ["documentos_movimientos"].includes(
                control.getValues("tipo_reporte")
              ) ? (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ offset: 8, span: 8 }}
                >
                  <GreenButton
                    type="primary"
                    block
                    icon={<FileExcelFilled />}
                    onClick={() => {
                      setLoader(true);
                      if (control.getValues("fechas_rango")) {
                        const rango_fechas =
                          control.getValues("fechas_rango") ?? [];
                        const initialDate = dayjs(rango_fechas[0]).format(
                          "YYYY-MM-DD"
                        );
                        const endDate = dayjs(rango_fechas[1]).format(
                          "YYYY-MM-DD"
                        );

                        if (
                          ["documentos_movimientos"].includes(
                            control.getValues("tipo_reporte")
                          )
                        ) {
                          let nombre_archivo = "";
                          switch (control.getValues("tipo_reporte")) {
                            case "documentos_movimientos":
                              nombre_archivo =
                                "reporteDocumentosMovimientosSinCostosSQL";
                              break;
                          }
                          generarInformePHPPuro(
                            { ...control.getValues(), initialDate, endDate },
                            nombre_archivo
                          )
                            .then(({ data }) => {
                              const filename = selectTipoReporte
                                .find(
                                  (item) =>
                                    item.value ==
                                    control.getValues("tipo_reporte")
                                )
                                ?.label?.toString()
                                .toUpperCase();
                              fileDownload(data, `${filename}.xls`);
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
                            });
                        }
                        // window
                        //   .open(
                        //     `https://farmartltda.com/reportes/reporteDocumentosMovimientosSinCostosSQL.php?initialDate=${initialDate}&endDate=${endDate}`,
                        //     "_blank"
                        //   )
                        //   ?.focus();
                      } else {
                        setLoader(false);
                        control.setError("fechas_rango", {
                          type: "required",
                          message: "Rango de Fechas es necesario",
                        });
                      }
                    }}
                  >
                    Reporte General
                  </GreenButton>
                </Col>
              ) : null}
              {["consulta_documentos"].includes(watchTipoReporte) &&
              dataSource.length > 0 ? (
                <Col span={24}>
                  <RepConsultaDocumentosTable
                    documentos={dataSource}
                    fileName={"Consulta Documentos"}
                  />
                </Col>
              ) : null}
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
