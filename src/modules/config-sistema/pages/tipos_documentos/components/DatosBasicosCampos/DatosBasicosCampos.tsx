/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Col, Input, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { DataType, Props } from "./types";
import { List } from "@/../node_modules/antd/es/index";

const { Text } = Typography;

export const DatosBasicosCampos = ({ cabeceras, tipoDocumento }: Props) => {
  const [listaCabeceras, setListaCabeceras] = useState<DataType[]>([]);
  const methods = useFormContext();
  const fieldArray = useFieldArray({
    control: methods.control,
    name: "cabeceras",
  });

  useEffect(() => {
    if (tipoDocumento) {
      let data;
      if (tipoDocumento.cabeceras && tipoDocumento.cabeceras.length > 0) {
        data = tipoDocumento.cabeceras?.map((item) => {
          return {
            id: item.campo.id,
            nombre_campo: item.campo.nombre_campo,
            estado: item.estado,
          };
        });
      } else {
        data = cabeceras;
      }
      setListaCabeceras(data);
      fieldArray.replace(data);
    } else {
      setListaCabeceras(cabeceras);
    }
  }, [cabeceras, tipoDocumento]);

  return (
    <>
      <Row gutter={12}>
        <Col xs={24} sm={24} style={{ width: "100%" }}>
          <List
            dataSource={!listaCabeceras ? cabeceras : listaCabeceras}
            loading={listaCabeceras?.length > 0 ? false : true}
            renderItem={(item, index) => (
              <Row style={{ padding: 10 }} gutter={12} key={index}>
                <Col xs={24} sm={12}>
                  <StyledFormItem label="Nombre:">
                    <Input value={item?.nombre_campo} readOnly />
                    <Controller
                      control={methods.control}
                      name={`cabeceras.${index}.id`}
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
                    name={`cabeceras.${index}.estado`}
                    defaultValue={"1"}
                    rules={{
                      required: { value: true, message: "Campo requerido" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem label="Estado:">
                        <Select
                          {...field}
                          showSearch
                          placeholder="Seleccione estado"
                          options={[
                            { label: "Visible", value: "0" },
                            { label: "Oculto", value: "1" },
                            { label: "Obligatorio", value: "2" },
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
