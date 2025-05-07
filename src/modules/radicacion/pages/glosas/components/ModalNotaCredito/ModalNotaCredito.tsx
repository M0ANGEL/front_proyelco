/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { generacionCufe } from "@/services/facturacion/facturacionNotasCreditoAPI";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { getNotasPendientes } from "@/services/radicacion/glosasAPI";
import { NotasPendientesTable } from "../NotasPendientesTable";
import { NotaCreditoFVEDisCabecera } from "@/services/types";
import { FormNCG } from "@/modules/documentos";
import { useEffect, useState } from "react";
import { Props } from "./types";
import {
  notification,
  Button,
  Result,
  Modal,
  Steps,
  Col,
  Row,
  Space,
} from "antd";

export const ModalNotaCredito = ({ open, setOpen, info_factura }: Props) => {
  const [hasNotasPendientes, setHasNotasPendientes] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [stateCUFE, setStateCUFE] = useState<string>("solicitando");
  const [notaCreditoID, setNotaCreditoID] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [notasPendientes, setNotasPendientes] = useState<
    NotaCreditoFVEDisCabecera[]
  >([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      if (info_factura && currentStep === 0) {
        setLoader(true);
        getNotasPendientes(info_factura.numero_factura)
          .then(({ data: { data } }) => {
            if (data.length > 0) {
              setNotasPendientes(data);
              setHasNotasPendientes(true);
            }
            setLoader(false);
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
                    duration: 4,
                  });
                }
              } else {
                notificationApi.open({
                  type: "error",
                  message: response.data.message,
                  duration: 4,
                });
              }
              setLoader(false);
            }
          );
      }
      if (currentStep === 1 && notaCreditoID != "") {
        const data = [{ seleccion: [notaCreditoID] }, { documento: "NCG" }];
        solicitarCufe(data);
      }
    }
  }, [open, currentStep, notaCreditoID]);

  const clearValues = () => {
    setOpen(false);
    setCurrentStep(0);
    setNotaCreditoID("");
    setNotasPendientes([]);
    setHasNotasPendientes(false);
  };

  const solicitarCufe = (data: any) => {
    try {
      generacionCufe(data)
        .then(() => {
          setCurrentStep(2);
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
                  duration: 4,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
                duration: 4,
              });
            }
            setStateCUFE("error");
          }
        );
    } catch (error) {
      console.error(error);
    }
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
        title={"Generación de Nota Crédito Glosa"}
        destroyOnClose={true}
        width={1400}
        style={{ top: 5 }}
      >
        <Row>
          <Col span={24}>
            <Steps
              current={currentStep}
              items={[
                {
                  title: "Documento",
                },
                {
                  title: "Solicitud CUDE",
                },
                {
                  title: "Respuesta",
                },
              ]}
            />
          </Col>
          {open ? (
            <Col span={24}>
              <div style={{ marginTop: 20 }}>
                {currentStep == 0 && !hasNotasPendientes ? (
                  <FormNCG
                    info_factura={info_factura}
                    setNotaCreditoID={(nota_id: string) => {
                      setNotaCreditoID(nota_id);
                      setCurrentStep(1);
                    }}
                  />
                ) : null}
                {currentStep == 0 && hasNotasPendientes ? (
                  <>
                    <NotasPendientesTable
                      loader={loader}
                      notasPendientes={notasPendientes}
                      setNotaCreditoID={(value: string) => {
                        setNotaCreditoID(value);
                        setStateCUFE("solicitando");
                        setCurrentStep(1);
                      }}
                    />
                  </>
                ) : null}
                {currentStep == 1 ? (
                  <Result
                    icon={
                      stateCUFE == "solicitando" ? (
                        <LoadingOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    status={stateCUFE == "solicitando" ? "info" : "error"}
                    title={
                      stateCUFE == "solicitando"
                        ? "Solicitando CUFE..."
                        : "Hubo un error solicitando el CUFE"
                    }
                    extra={
                      stateCUFE != "solicitando" ? (
                        <Space>
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              setCurrentStep(0);
                              setNotaCreditoID("");
                            }}
                          >
                            Volver
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => {
                              if (currentStep === 1 && notaCreditoID != "") {
                                const data = [
                                  { seleccion: [notaCreditoID] },
                                  { documento: "NCG" },
                                ];
                                solicitarCufe(data);
                                setStateCUFE("solicitando");
                              }
                            }}
                          >
                            Intentar de nuevo
                          </Button>
                        </Space>
                      ) : null
                    }
                  />
                ) : null}
                {currentStep === 2 ? (
                  <Result status="success" title="CUDE generado con exito" />
                ) : null}
              </div>
            </Col>
          ) : null}
        </Row>
      </Modal>
    </>
  );
};
