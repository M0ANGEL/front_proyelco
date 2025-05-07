/* eslint-disable react-hooks/exhaustive-deps */
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Cargo, Usuario } from "../../types";
import { Col, Input, List, Row, Select, Typography, notification } from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { getCargos } from "@/services/maestras/cargosAPI";

const { Text } = Typography;

interface Props {
  usuario?: Usuario;
}

interface DataType {
  id_empresa: string;
  nom_empresa: string;
  id_cargo: string;
  cargos: {
    value: string;
    label: string;
    data: Cargo;
  }[];
}

export const DatosCargos = ({ usuario }: Props) => {
  const methods = useFormContext();
  const [api, contextHolder] = notification.useNotification();
  const [empCargos, setEmpCargos] = useState<DataType[]>([]);
  const fieldArray = useFieldArray({
    control: methods.control,
    name: "cargos",
  });

  useEffect(() => {
    setEmpCargos([]);
    getCargos()
      .then(({ data: { data } }) => {
        let cargos: DataType[] = [];
        
        if (usuario) {
          const cargosUsu = usuario.cargos.map((cargo) => {
            const cargosEmp = data
              .filter((value) => value.id_empresa === cargo.cargo.id_empresa && value.estado =="1" && cargo.cargo.estado=="1")
              .map((value) => ({
                value: value.id.toString(),
                label: value.nombre,
                data: value,
              }));
            return {
              id_empresa: cargo.cargo.id_empresa,
              nom_empresa: cargo.cargo.empresas.emp_nombre,
              cargos: cargosEmp,
              id_cargo: cargo.id_cargo,
            };
          });

          let cargosForm: DataType[] = [];
          if (
            methods.getValues("empresas") &&
            methods.getValues("bodegas").length > 0
          ) {
            cargosForm = methods
              .getValues("empresas")
              .map((empresa: string) => {
                const cargosEmp = data
                  .filter((cargo) => cargo.id_empresa === empresa && cargo.estado === "1")
                  .map((cargo) => ({
                    value: cargo.id.toString(),
                    label: cargo.nombre,
                    data: cargo,
                  }));
                return {
                  id_empresa: empresa,
                  nom_empresa: cargosEmp.at(0)?.data.empresas.emp_nombre,
                  cargos: cargosEmp,
                  id_cargo: "",
                };
              });
          }

          const valoresNoRepetidos: DataType[] = cargosUsu.filter(
            (cargoUsu: DataType) => {
              return !cargosForm.some(
                (perfilForm: DataType) =>
                  perfilForm.id_empresa === cargoUsu.id_empresa
              );
            }
          );

          const valoresRepetido: DataType[] = cargosUsu.filter(
            (cargoUsu: DataType) => {
              return cargosForm.some(
                (cargoForm: DataType) =>
                  cargoForm.id_empresa === cargoUsu.id_empresa
              );
            }
          );

          const valoresNoRepetidosArreglo2: DataType[] =
            cargosForm.filter((cargoForm: DataType) => {
              return !cargosUsu.some(
                (cargoUsu: DataType) =>
                  cargoUsu.id_empresa === cargoForm.id_empresa
              );
            }) ?? [];

          cargos = valoresNoRepetidos.concat(
            valoresRepetido?.concat(valoresNoRepetidosArreglo2)
          );
        } else {
          cargos = methods.getValues("empresas").map((empresa: string) => {
            const cargosEmp = data
              .filter((cargo) => cargo.id_empresa === empresa && cargo.estado==="1")
              .map((cargo) => ({
                value: cargo.id.toString(),
                label: cargo.nombre,
                data: cargo,
              }));
            return {
              id_empresa: empresa,
              nom_empresa: cargosEmp.at(0)?.data.empresas.emp_nombre,
              cargos: cargosEmp,
              id_cargo: "",
            };
          });
        }

        fieldArray.replace(
          cargos.map((item: DataType) => ({
            id_empresa: item.id_empresa,
            id_cargo: item.id_cargo != "" ? item.id_cargo : "",
          }))
        );
        setEmpCargos(cargos);
      })
      .catch((error) => {
        api["error"]({
          message: error.code,
          description: error.message,
          placement: "bottomRight",
        });
      });
  }, [usuario, methods.watch("empresas"), methods.watch("bodegas")]);

  return (
    <>
      {contextHolder}
      <List
        dataSource={empCargos}
        bordered={false}
        loading={empCargos?.length > 0 ? false : true}
        renderItem={(item, index) => (
          <Row style={{ padding: 10 }} gutter={12} key={index}>
            <Col xs={24} sm={12}>
              <StyledFormItem label="Empresa:">
                <Input value={item.nom_empresa} readOnly />
              </StyledFormItem>
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                control={methods.control}
                name={`cargos.${index}.id_cargo`}
                rules={{
                  required: { value: true, message: "Campo requerido" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Cargo:">
                    <Select
                      {...field}
                      showSearch
                      placeholder="Seleccione cargo"
                      options={item.cargos}
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
    </>
  );
};
