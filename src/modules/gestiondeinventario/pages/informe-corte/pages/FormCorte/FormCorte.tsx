/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generarInformeCorteInventario } from "@/services/informes/reportesAPI";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { LoadingOutlined, FileExcelFilled } from "@ant-design/icons";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
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
import dayjs from "dayjs";
import {
  notification,
  SelectProps,
  DatePicker,
  Typography,
  Select,
  Radio,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Title, Text } = Typography;

export const FormCorte = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No se encuentra el contexto GlobalContext");
  }
  const { userGlobal } = context;

  const [notificationApi, contextHolder] = notification.useNotification();
  const { getSessionVariable } = useSessionStorage();
  const { arrayBufferToString } = useArrayBuffer();

  const [selectBodegas, setSelectBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [searchBodega, setSearchBodega] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(true);

  const user_rol = getSessionVariable(KEY_ROL);

  const control = useForm({
    defaultValues: {
      bodegas: [],
      fecha_corte: undefined,
      con_ajustes: "Si",
    },
  });

  useEffect(() => {
    if (userGlobal) {
      getBodegasSebthi().then(({ data: { data } }) => {
        const options: SelectProps["options"] = [];
        const bodegasUsuarios = userGlobal.bodega.map((bodega) =>
          parseInt(bodega.id_bodega)
        );
        data.forEach((bodega) => {
          if (
            bodega.estado == "1" &&
            bodegasUsuarios.includes(bodega.id) &&
            bodega.estado_inventario == "0"
          ) {
            options.push({ label: bodega.bod_nombre, value: bodega.id });
          }
        });
        setSelectBodegas(options);
        setLoader(false);
      });
    }
  }, [userGlobal]);

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onFinish = (data: any) => {
    setLoader(true);
    data.fecha_corte = dayjs(data.fecha_corte).format("YYYY-MM-DD");
    if (!data.bodegas || data.bodegas.length === 0) {
      data.bodegas = selectBodegas?.map((item) => item.value);
    }
    generarInformeCorteInventario(data)
      .then(({ data }) => {
        const fecha_corte = dayjs(control.getValues("fecha_corte")).format(
          "YYYY-MM-DD"
        );
        fileDownload(data, `INVENTARIO-CORTE-${fecha_corte}.xlsx`);
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

  return (
    <>
      {contextHolder}
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)", marginTop: 200 }}
      >
        <StyledCard title={<Title level={4}>INVENTARIO AL CORTE</Title>}>
          <Form
            layout="vertical"
            onFinish={control.handleSubmit(onFinish)}
            onKeyDown={(e: any) => checkKeyDown(e)}
          >
            <Row gutter={[12, 12]}>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Controller
                  control={control.control}
                  name="fecha_corte"
                  rules={{
                    required: {
                      value: true,
                      message: "Fecha Corte es necesario",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem label={"Rango de Fechas:"} required>
                      <DatePicker
                        {...field}
                        placeholder={"Fecha Corte"}
                        disabledDate={(current) => {
                          const customDate = dayjs("2024-02-15");
                          return current && current < customDate;
                        }}
                        status={error && "error"}
                        style={{ width: "100%" }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
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
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              {["administrador"].includes(user_rol) ? (
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Controller
                    control={control.control}
                    name="con_ajustes"
                    rules={{
                      required: {
                        value: true,
                        message:
                          "Debes seleccionar si es necesario ajustes o no",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        required
                        label={
                          "Tener en cuenta los ajustes de los primeros 5 días?:"
                        }
                      >
                        <Radio.Group {...field}>
                          <Radio value={"Si"}>Si</Radio>
                          <Radio value={"No"}>No</Radio>
                        </Radio.Group>
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              ) : null}

              <Col
                xs={{ span: 24 }}
                sm={{
                  offset: 6,
                  span: 12,
                }}
                md={{
                  offset: 8,
                  span: 8,
                }}
              >
                <GreenButton
                  block
                  type="primary"
                  htmlType="submit"
                  icon={<FileExcelFilled />}
                >
                  Generar Informe Inventario
                </GreenButton>
              </Col>
            </Row>
          </Form>
        </StyledCard>
      </Spin>
    </>
  );
};
