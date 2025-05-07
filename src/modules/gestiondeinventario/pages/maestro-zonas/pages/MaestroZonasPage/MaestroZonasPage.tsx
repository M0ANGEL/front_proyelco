/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Col, Form, Input, notification, Row, Spin, Table } from "antd";
import { getBodega } from "@/services/maestras/bodegasAPI";
import { Bodega, ZonasBodega } from "@/services/types";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  updateZonaProducto,
  getZonasBodega,
} from "@/services/gestion-inventario/maestroZonasAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { KEY_BODEGA } from "@/config/api";
import { Controller, useForm } from "react-hook-form";

export const MaestroZonasPage = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [initialData, setInitialData] = useState<ZonasBodega[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [zonas, setZonas] = useState<ZonasBodega[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const bodega_id = getSessionVariable(KEY_BODEGA);
  const [bodega, setBodega] = useState<Bodega>();
  const control = useForm();

  useEffect(() => {
    if (bodega_id) {
      setLoader(true);
      getZonasBodega(bodega_id)
        .then(({ data: { data } }) => {
          const newZonas = data.map((item, index) => ({ ...item, key: index }));
          setZonas(newZonas);
          setInitialData(newZonas);
          control.setValue("zonas", newZonas);
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
      getBodega(bodega_id)
        .then(({ data: { data } }) => {
          setBodega(data);
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
        );
    }
  }, [bodega_id]);

  useEffect(() => {
    const filterTable = initialData
      ?.filter((o: any) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(searchValue.toLowerCase())
        )
      )
      .map((item) => {
        return { ...item, editable: false };
      });
    setZonas(filterTable);
  }, [searchValue]);

  const columns: ColumnsType<ZonasBodega> = [
    {
      title: "Producto",
      dataIndex: "producto_id",
      key: "producto_id",
      align: "center",
      width: 100,
    },
    {
      title: "Codigo HUV",
      dataIndex: "cod_huv",
      key: "cod_huv",
      align: "center",
      width: 100,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Zona",
      dataIndex: "zona",
      key: "zona",
      align: "center",
      width: 120,
      render(zona, { zona_id, producto_id }) {
        const indexProducto = initialData.findIndex(
          (zona) => zona.producto_id === producto_id
        );
        return (
          <>
            <Controller
              control={control.control}
              name={`zonas.${indexProducto}.zona`}
              render={({ field }) => {
                return (
                  <StyledFormItem>
                    <Input
                      {...field}
                      size="small"
                      onKeyUp={(e: any) => {
                        const {
                          key,
                          target: { value },
                        } = e;
                        if (key == "Enter")
                          handleChangeZona(zona_id, value, producto_id);
                      }}
                      onBlur={(e: any) => {
                        const {
                          target: { value },
                        } = e;
                        if (value != zona)
                          handleChangeZona(zona_id, value, producto_id);
                      }}
                      style={{ textAlign: "center" }}
                    />
                  </StyledFormItem>
                );
              }}
            />
          </>
        );
      },
    },
  ];

  const handleChangeZona = (
    zona_id: string,
    zona: string,
    producto_id: string
  ) => {
    setLoader(true);
    updateZonaProducto({ zona_id, zona, producto_id, bodega_id })
      .then(({ data: { message } }) => {
        notificationApi.open({ type: "success", message: message });
        const newZonas = control.getValues("zonas");
        setZonas(newZonas);
        setInitialData(newZonas);
        setSearchValue("");
        control.setValue("zonas", newZonas);
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

  return (
    <>
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >
        {contextHolder}
        <StyledCard title={`Maestro de Zonas de Inventario`}>
          <Row gutter={[12, 12]}>
            <Col sm={24} md={16} lg={18}>
              <Input
                value={searchValue}
                placeholder="Buscar producto..."
                onChange={(e: any) => {
                  setSearchValue(e.target.value);
                }}
                style={{ textAlign: "center" }}
              />
            </Col>
            <Col sm={24} md={8} lg={6}>
              {bodega ? (
                <ExportExcel
                  excelData={zonas.map((item) => ({
                    Producto: item.producto_id,
                    Descripcion: item.descripcion,
                    Zona: item.zona ? item.zona : "Sin zona asignada",
                  }))}
                  fileName={"ZonasBodega-" + bodega.bod_nombre}
                />
              ) : null}
            </Col>
            <Col span={24}>
              <Form>
                <Table size="small" dataSource={zonas} columns={columns} />
              </Form>
            </Col>
          </Row>
        </StyledCard>
      </Spin>
    </>
  );
};
