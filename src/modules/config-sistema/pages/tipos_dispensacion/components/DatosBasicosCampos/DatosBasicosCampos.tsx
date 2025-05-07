/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Col, Input, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { DataType, Props } from "./types";
import { List } from "@/../node_modules/antd/es/index";

const { Text } = Typography;

export const DatosBasicosCampos = ({ campos, tipoDispensacion }: Props) => {
  const [listaCabeceras, setListaCabeceras] = useState<DataType[]>([]);
  const methods = useFormContext();
  const fieldArray = useFieldArray({
    control: methods.control,
    name: "campos",
  });

  useEffect(() => {
    if (tipoDispensacion) {
      let data;
      if (tipoDispensacion.campos && tipoDispensacion.campos.length > 0) {
        data = tipoDispensacion.campos?.map((item) => {
          return {
            id: item.id_campo,
            nombre: item.campo_dispensacion.nombre,
            obligatoriedad: item.obligatoriedad,
          };
        });
      } else {
        data = campos;
      }
      setListaCabeceras(data);
      fieldArray.replace(data);
    } else {
      setListaCabeceras(campos);
    }
  }, [campos, tipoDispensacion]);

  return (
    <>
      <Row gutter={12}>
        <Col xs={24} sm={24} style={{ width: "100%" }}>
          <List
            dataSource={!listaCabeceras ? campos : listaCabeceras}
            loading={listaCabeceras?.length > 0 ? false : true}
            renderItem={(item, index) => (
              <Row style={{ padding: 10 }} gutter={12} key={index}>
                <Col xs={24} sm={12}>
                  <StyledFormItem label="Nombre:">
                    <Input value={item?.nombre} readOnly />
                    <Controller
                      control={methods.control}
                      name={`campos.${index}.id`}
                      defaultValue={item.id}
                      render={({ field }) => (
                        <Input
                          {...field}
                          defaultValue={item.id}
                          style={{ display: "none" }}
                        />
                      )}
                    />
                  </StyledFormItem>
                </Col>
                <Col xs={24} sm={12}>
                  <Controller
                    control={methods.control}
                    name={`campos.${index}.obligatoriedad`}
                    defaultValue={"obligatorio"}
                    rules={{
                      required: { value: true, message: "Campo requerido" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label="Obligatoriedad:">
                        <Select
                          {...field}
                          showSearch
                          placeholder="Seleccione obligatoriedad"
                          options={[
                            { value: "opcional", label: "Opcional" },
                            { value: "obligatorio", label: "Obligatorio" },
                            { value: "oculto", label: "Oculto" },
                          ]}
                          style={{ width: "100%" }}
                          status={error && "error"}
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
