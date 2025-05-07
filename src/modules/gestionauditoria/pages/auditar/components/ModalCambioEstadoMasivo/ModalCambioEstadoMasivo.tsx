/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getAudObservaciones } from "@/services/maestras/audObservacionesAPI";
import { getMotivosAud } from "@/services/maestras/motivosAuditoriaAPI";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  actualizarEstados,
  getEstadosAud,
} from "@/services/auditar/auditarAPI";
import { Props } from "./types";
import {
  notification,
  SelectProps,
  Typography,
  Button,
  Select,
  Modal,
  Form,
  Spin,
  Col,
  Row,
} from "antd";
import { AudObservacion } from "@/services/types";

const { Text, Title } = Typography;

export const ModalCambioEstadoMasivo = ({
  open,
  setOpen,
  userGlobal,
  idsSeleccionados,
}: Props) => {
  const [selectEstados, setSelectEstados] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [observacionesAuditoria, setObservacionesAuditoria] = useState<
    AudObservacion[]
  >([]);
  const [disabledInputs, setDisabledInputs] = useState<boolean>(true);
  const [motivosAuditoria, setMotivosAuditoria] = useState<
    SelectProps["options"]
  >([]);
  const [_selectObservacionesAuditoria, setSelectObservacionesAuditoria] =
    useState<SelectProps["options"]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const control = useForm();

  const watchEstado = control.watch("estado");
  const watchMotivos = control.watch("motivos");

  useEffect(() => {
    if (["3", "8"].includes(watchEstado)) {
      setDisabledInputs(false);
    } else {
      setDisabledInputs(true);
    }
  }, [watchEstado]);

  useEffect(() => {
    if (watchMotivos && ["3", "8"].includes(watchEstado)) {
      const observacionesOptions: SelectProps["options"] =
        observacionesAuditoria
          .filter((observacion) => {
            return JSON.parse(observacion.aud_motivos).find((motivo: any) =>
              watchMotivos.find(
                (motivoSelect: any) => motivoSelect == motivo.toString()
              )
            );
          })
          .map((item) => ({
            value: item.id.toString(),
            label: item.aud_observacion,
          }));
      setSelectObservacionesAuditoria(observacionesOptions);
      if (
        !observacionesOptions
          .map((item) => item.value)
          .includes(control.getValues("id_aud_observacion"))
      ) {
        control.setValue("id_aud_observacion", undefined);
      }
    }
  }, [watchEstado, watchMotivos, observacionesAuditoria]);

  useEffect(() => {
    if (open && userGlobal) {
      const fetchInputsData = async () => {
        await getEstadosAud().then(({ data: { data } }) => {
          const opcionesRolEstado = data
            .filter(
              (item) =>
                item.rol_estado &&
                JSON.parse(item.rol_estado).includes(userGlobal.rol) &&
                ["2", 2, "5", 5, "3", 3].includes(item.id)
            )
            .map((item) => ({
              value: item.id.toString(),
              label: item.nombre_estado,
            }));
          setSelectEstados(opcionesRolEstado);
        });

        await getMotivosAud().then(({ data: { data } }) => {
          const opcionesMotivos = data
            .filter((item) => item.estado == "1")
            .map((item) => ({
              value: item.id,
              label: `${item.codigo} - ${item.motivo}`,
            }));
          setMotivosAuditoria(opcionesMotivos);
        });

        await getAudObservaciones().then(({ data: { data } }) => {
          setObservacionesAuditoria(data.filter((item) => item.estado == "1"));
          // const opcionesObservaciones = data
          //   .filter((item) => item.estado == "1")
          //   .map((item) => ({
          //     value: item.id,
          //     label: `${item.aud_observacion}`,
          //   }));
          // setObservacionesAuditoria(opcionesObservaciones);
        });
      };
      setLoader(true);
      fetchInputsData().then(() => setLoader(false));
    }
  }, [open, userGlobal]);

  const clearValues = (origen = "modal") => {
    setOpen(false, origen);
    control.reset();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    actualizarEstados(
      idsSeleccionados,
      data.estado,
      data.motivos,
      data.id_aud_observacion
    )
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Actualización exitosa`,
        });
        clearValues("formulario");
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
        onCancel={() => clearValues()}
        title={
          <Title level={4} style={{ width: "100%", textAlign: "center" }}>
            Cambiar Estados
          </Title>
        }
        maskClosable={!loader}
        closable={!loader}
        keyboard={!loader}
        width={800}
        footer={[
          <Button
            key={"btn-cancelar-modal"}
            type="primary"
            danger
            onClick={() => clearValues()}
            disabled={loader}
          >
            Cancelar
          </Button>,
          <Button
            key={"btn-guardar-modal"}
            type="primary"
            onClick={control.handleSubmit(onFinish)}
            disabled={loader}
          >
            Guardar
          </Button>,
        ]}
      >
        <Spin spinning={loader}>
          <Form layout="vertical">
            <Row gutter={[12, 12]} style={{ paddingBottom: 12 }}>
              <Col span={24}>
                <Controller
                  name="estado"
                  control={control.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Estado Auditoría es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Estado Auditoría: ">
                      <Select
                        {...field}
                        options={selectEstados}
                        status={error && "error"}
                        placeholder="Seleccionar Estado"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col span={24}>
                <Controller
                  name="motivos"
                  control={control.control}
                  rules={{
                    required: {
                      value: !disabledInputs,
                      message: "Motivos es requerido",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Motivo:">
                      <Select
                        {...field}
                        mode="multiple"
                        maxTagCount={6}
                        maxTagTextLength={25}
                        placeholder="Seleccionar Motivo(s)"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={motivosAuditoria}
                        disabled={disabledInputs}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {/* <Col span={24}>
                <Controller
                  name="id_aud_observacion"
                  control={control.control}
                  rules={{
                    required: {
                      value: !disabledInputs,
                      message: "Observación es requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label="Observación:">
                      <Select
                        {...field}
                        placeholder="Observación"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={selectObservacionesAuditoria}
                        disabled={disabledInputs}
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col> */}
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
