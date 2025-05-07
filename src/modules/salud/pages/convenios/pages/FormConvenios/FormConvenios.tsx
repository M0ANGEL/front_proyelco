/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  crearConvenio,
  getConvenio,
  updateConvenio,
} from "@/services/salud/conveniosAPI";
import { DatosBasicos, DatosFacturacion } from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getConceptos } from "@/services/maestras/conceptosAPI";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Convenio } from "@/services/types";
import {
  getTipoConsulta,
  getTipoConvenio,
  getModContrato,
  getCoberPlanB,
  getTipoFactu,
} from "@/services/salud/conveniosTipoAPI";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  Typography,
  Button,
  Space,
  Form,
  Spin,
  Tabs,
} from "antd";
import { getTiposDispensaciones } from "@/services/maestras/tiposDispensacionesAPI";

const { Text } = Typography;

export const FormConvenios = () => {
  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectTipoDispensaciones, setSelectTipoDispensaciones] = useState<
    SelectProps["options"]
  >([]);
  const [selectModalidadContratacion, setSelectModalidadContratacion] =
    useState<SelectProps["options"]>([]);
  const [selectTipoFacturacion, setSelectTipoFacturacion] = useState<
    SelectProps["options"]
  >([]);
  const [selectCoberturaPlan, setSelectCoberturaPlan] = useState<
    SelectProps["options"]
  >([]);
  const [selectTipoConvenio, setSelectTipoConvenio] = useState<
    SelectProps["options"]
  >([]);
  const [selectTipoConsulta, setSelectTipoConsulta] = useState<
    SelectProps["options"]
  >([]);
  const [selectConceptos, setSelectConceptos] = useState<
    SelectProps["options"]
  >([]);
  const [convenio, setConvenio] = useState<Convenio>();
  const [loader, setLoader] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const control = useForm();

  useEffect(() => {
    setLoader(true);
    const fetchSelects = async () => {
      await getTipoConvenio().then(({ data: { data } }) => {
        setSelectTipoConvenio(
          data.map((item) => ({ value: item.id, label: item.nombre }))
        );
      });
      await getCoberPlanB().then(({ data: { data } }) => {
        setSelectCoberturaPlan(
          data.map((item) => ({
            value: item.id,
            label: `(${item.id}) ${item.nombre}`,
          }))
        );
      });
      await getTipoConsulta().then(({ data: { data } }) => {
        setSelectTipoConsulta(
          data.map((item) => ({ value: item.id, label: item.nombre }))
        );
      });
      await getModContrato().then(({ data: { data } }) => {
        setSelectModalidadContratacion(
          data.map((item) => ({
            value: item.id,
            label: `(${item.id}) ${item.nombre}`,
          }))
        );
      });
      await getTipoFactu().then(({ data: { data } }) => {
        setSelectTipoFacturacion(
          data.map((item) => ({
            value: item.id,
            label: `(${item.id}) ${item.nombre}`,
          }))
        );
      });
      await getBodegasSebthi().then(({ data: { data } }) => {
        setSelectBodegas(
          data
            .filter((data) => ["1", 1].includes(data.estado))
            .map((item) => ({ value: item.id, label: item.bod_nombre }))
        );
      });
      await getConceptos().then(({ data: { data } }) => {
        setSelectConceptos(
          data
            .filter((data) => ["1", 1].includes(data.estado))
            .map((item) => ({ value: item.id, label: item.nombre }))
        );
      });
      await getTiposDispensaciones().then(({ data: { data } }) => {
        setSelectTipoDispensaciones(
          data.map((item) => ({ value: item.id, label: item.descripcion }))
        );
      });
    };
    fetchSelects()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  }, []);

  useEffect(() => {
    if (id) {
      getConvenio(id).then(({ data: { data } }) => {
        setConvenio(data);
        control.reset({
          tipo_id: parseInt(data.id_tipo_conv),
          estado: parseInt(data.estado),
          descripcion: data.descripcion,
          valor_total: parseInt(data.valor_total),
          regimen_conv: data.reg_conv,
          fechaini: dayjs(data.fec_ini),
          fechafin: dayjs(data.fec_fin),
          num_contrato: data.num_contrato,
          mod_contrato: parseInt(data.id_mod_contra),
          cober_pb: parseInt(data.id_cober_pb),
          auth_cabe: parseInt(data.aut_cabecera),
          tipo_consulta: JSON.parse(data.tipo_consul),
          auth_det: parseInt(data.aut_detalle),
          long_det: parseInt(data.num_caracter_det),
          nit: data.nit,
          nom_nit: data.tercero.razon_soc,
          cod_listapre: data.id_listapre,
          id_listapre: data.lista_precli ? data.lista_precli.descripcion : null,
          tipo_factu: parseInt(data.id_tipo_factu),
          centro_costo: data.centro_costo,
          etiqueta_rips: parseInt(data.etiqueta_rips),
          periodo_pago: parseInt(data.periodo_pago),
          bodegas: JSON.parse(data.bodegas),
          conceptos: JSON.parse(data.conceptos),
          cuota_mod: parseInt(data.cuota_mod),
          iva: parseInt(data.iva),
          redondeo_iva: parseInt(data.redondeo_iva),
          dto_cuota: parseInt(data.dto_cuota),
          id_tipo_dispensacion: data.id_tipo_dispensacion
            ? parseInt(data.id_tipo_dispensacion)
            : null,
        });
      });
    } else {
      control.reset({
        tipo_id: null,
        estado: 1,
        descripcion: null,
        valor_total: 0,
        regimen_conv: null,
        fechaini: null,
        fechafin: null,
        num_contrato: null,
        mod_contrato: null,
        cober_pb: null,
        auth_cabe: 1,
        tipo_consulta: null,
        auth_det: 1,
        long_det: 0,
        nit: "",
        nom_nit: "",
        cod_listapre: null,
        id_listapre: null,
        tipo_factu: null,
        centro_costo: null,
        periodo_pago: null,
        bodegas: [],
        conceptos: [],
        cuota_mod: 1,
        iva: 1,
        redondeo_iva: null,
        dto_cuota: 1,
        id_tipo_dispensacion: null,
        etiqueta_rips: null,
      });
    }
  }, [id]);

  const onFinish = (data: any) => {
    setLoader(true);
    if (convenio) {
      updateConvenio(data, id)
        .then(() => {
          notificationApi.success({
            message: "Convenio actualizado con éxito!",
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
      crearConvenio(data)
        .then(() => {
          notificationApi.success({
            message: "Convenio creado con éxito!",
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
    }
  };

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
        <FormProvider {...control}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            autoComplete="off"
          >
            <StyledCard
              title={(convenio ? "Editar" : "Crear") + " convenio"}
              extra={
                <Space>
                  <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Guardar
                  </Button>

                  {convenio ? (
                    <Link to="../.." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  ) : (
                    <Link to=".." relative="path">
                      <Button
                        danger
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                      >
                        Volver
                      </Button>
                    </Link>
                  )}
                </Space>
              }
            >
              {Object.keys(control.formState.errors).length > 0 ? (
                <Text type="danger">
                  Faltan campos por diligenciar o existen algunos errores
                </Text>
              ) : null}
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: (
                      <Text
                        type={
                          Object.keys(control.formState.errors).length > 0
                            ? "danger"
                            : undefined
                        }
                      >
                        Datos Básicos
                      </Text>
                    ),
                    children: (
                      <DatosBasicos
                        selectTipoDispensaciones={selectTipoDispensaciones}
                        selectTipoConvenio={selectTipoConvenio}
                        selectCoberturaPlan={selectCoberturaPlan}
                        selectTipoConsulta={selectTipoConsulta}
                        selectModalidadContratacion={
                          selectModalidadContratacion
                        }
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Space>
                        <Text
                          type={
                            Object.keys(control.formState.errors).length > 0
                              ? "danger"
                              : undefined
                          }
                        >
                          Datos Facturación
                        </Text>
                      </Space>
                    ),
                    children: (
                      <DatosFacturacion
                        selectTipoFacturacion={selectTipoFacturacion}
                        selectBodegas={selectBodegas}
                        selectConceptos={selectConceptos}
                      />
                    ),
                    forceRender: true,
                  },
                ]}
                animated
              />
            </StyledCard>
          </Form>
        </FormProvider>
      </Spin>
    </>
  );
};
