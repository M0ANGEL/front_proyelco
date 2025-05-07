import { useEffect, useState } from "react";
import { Col, Input, Row, Select, SelectProps, Spin, Typography, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getEntidades } from "@/services/maestras/entidadesAPI";
import { LoadingOutlined } from "@ant-design/icons";
import { Props } from "./types";
import { getPensionesActivas } from "@/services/gestion-humana/pensionesAPI";
import { getCesantiasActivas } from "@/services/gestion-humana/cesantiasAPI";
import { getCajaCompensacionActivas } from "@/services/gestion-humana/cajacompensacionAPI";
import { getRiesgoArlActivas } from "@/services/gestion-humana/riesgoarlAPI";
import { index as getArls } from "@/services/gestion-humana/arlAPI";

const { Text } = Typography;

export const DatosAfiliaciones = ({ empleado }: Props) => {

  const [selectEntidades, setSelectEntidades] = useState<SelectProps["options"]>([]);
  const [selectPensinesActivas, setSelectPensionesActivas] = useState<SelectProps["options"]>([])
  const [selectCesantiasActivas, setSelectCesantiasActivas] = useState<SelectProps["options"]>([])
  const [selectCajaCompensacion, setSelectCajaCompensacion] = useState<SelectProps["options"]>([])
  const [selectRiesgoArl, setSelectRiesgoArl] = useState<SelectProps["options"]>([])
  const [selecArl, setSelectArl] = useState<SelectProps["options"]>([])
  const [loaderEmp, setLoaderEmp] = useState<boolean>(true);
  const methods = useFormContext();

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (empleado) {
          methods.setValue('pension', empleado?.pensione_id);
          methods.setValue('cesantia', empleado?.cesantia_id);
          methods.setValue('eps', empleado?.eps);
          methods.setValue('caja_compensacion', empleado?.compensacione_id);
          methods.setValue('riesgo_arl', empleado?.riesgo_arl_id);
          methods.setValue('arl', empleado?.arl_id);
          methods.setValue('inclusiones_caja', empleado?.inclusiones_caja);
        }

        // Ejecutar todas las peticiones en paralelo
        const [entidades, pensiones, cesantias, cajas, riesgos, arls] = await Promise.all([
          getEntidades(),
          getPensionesActivas(),
          getCesantiasActivas(),
          getCajaCompensacionActivas(),
          getRiesgoArlActivas(),
          getArls(),
        ]);

        // Mapear los datos y actualizar los estados
        setSelectEntidades(entidades.data.data.map(item => ({ label: item.entidad, value: item.id.toString() })));
        setSelectPensionesActivas(pensiones.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectCesantiasActivas(cesantias.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectCajaCompensacion(cajas.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectRiesgoArl(riesgos.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
        setSelectArl(arls.data.data.map(item => ({ label: item.nombre, value: item.id.toString() })));
      } catch (error: any) {
        console.log("Error: ", error);
        if (error.response) {
          console.error("Error en la respuesta: ", error.response.data);
        } else if (error.request) {
          console.error("Error en la solicitud: ", error.request);
        } else {
          console.error("Error en el setup de la petición: ", error.message);
        }
        // Puedes manejar errores aquí, tal vez mostrar una notificación
      } finally {
        setLoaderEmp(false);
      }
    };

    fetchData();
  }, [empleado]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="pension"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fondo pensión requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fondo pensión">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectPensinesActivas}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cesantia"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cesantias requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cesantias">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectCesantiasActivas}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="eps"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "EPS es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="EPS">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectEntidades}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="caja_compensacion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Caja compensación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Caja compensación">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectCajaCompensacion}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="riesgo_arl"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Riesgo arl">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectRiesgoArl}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="arl"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "ARL es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="ARL">
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selecArl}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="inclusiones_caja"
          control={methods.control}
          // rules={{
          //   required: {
          //     value: true,
          //     message: "ARL es requerido",
          //   },
          // }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Inclusiones de caja">
              <Input
                {...field}
                maxLength={80}
                placeholder="Inclusiones de caja"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  )
}