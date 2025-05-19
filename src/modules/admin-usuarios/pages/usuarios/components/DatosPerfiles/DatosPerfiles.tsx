import { getPerfiles } from "@/services/maestras/perfilesAPI";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Perfil } from "@/services/types";
import { Usuario } from "../../types";
import { Col, Input, List, Row, Select, Typography, notification } from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

interface Props {
  usuario?: Usuario;
}

interface DataType {
  id_empresa: string;
  nom_empresa: string;
  id_perfil: string;
  perfiles: {
    value: string;
    label: string;
    data: Perfil;
  }[];
}

export const DatosPerfiles = ({ usuario }: Props) => {
  const methods = useFormContext();
  const [api, contextHolder] = notification.useNotification();
  const [empPerfiles, setEmpPerfiles] = useState<DataType[]>([]);
  const fieldArray = useFieldArray({
    control: methods.control,
    name: "perfiles",
  });

  useEffect(() => {
    setEmpPerfiles([]);
    getPerfiles()
      .then(({ data }) => {
        let perfiles: DataType[] = [];

        if (usuario !== undefined) {
          const perfilesUsu = usuario?.perfiles?.map((perfil) => {
            const perfilesEmp = data
              .filter(
                (value) =>
                  value.id_empresa === perfil.perfil.id_empresa &&
                  value.estado == "1"
              )
              .map((value) => ({
                value: value.id.toString(),
                label: value.nom_perfil,
                data: value,
              }));
            return {
              id_empresa: perfil.perfil.id_empresa,
              nom_empresa: perfil.perfil.empresa.emp_nombre,
              perfiles: perfilesEmp,
              id_perfil: perfil.id_perfil,
            };
          });

          let perfilesForm: DataType[] = [];
          if (
            methods.getValues("empresas") &&
            methods.getValues("bodegas").length > 0
          ) {
            perfilesForm = methods
              .getValues("empresas")
              .map((empresa: string) => {
                const perfilesEmp = data
                  .filter(
                    (perfil) =>
                      perfil.id_empresa === empresa && perfil.estado == "1"
                  )
                  .map((perfil) => ({
                    value: perfil.id.toString(),
                    label: perfil.nom_perfil,
                    data: perfil,
                  }));
                return {
                  id_empresa: empresa,
                  nom_empresa: perfilesEmp.at(0)?.data.empresa.emp_nombre,
                  perfiles: perfilesEmp,
                  id_perfil: "",
                };
              });
          }

          const valoresNoRepetidos = perfilesUsu?.filter(
            (perfilUsu: DataType) => {
              return !perfilesForm.some(
                (perfilForm: DataType) =>
                  perfilForm.id_empresa === perfilUsu.id_empresa
              );
            }
          );

          const valoresRepetido = perfilesUsu?.filter((perfilUsu: DataType) => {
            return perfilesForm.some(
              (perfilForm: DataType) =>
                perfilForm.id_empresa === perfilUsu.id_empresa
            );
          });

          const valoresNoRepetidosArreglo2 = perfilesForm.filter(
            (perfilForm: DataType) => {
              return !perfilesUsu?.some(
                (perfilUsu: DataType) =>
                  perfilUsu.id_empresa === perfilForm.id_empresa
              );
            }
          );

          perfiles = valoresNoRepetidos?.concat(
            valoresRepetido?.concat(valoresNoRepetidosArreglo2)
          );
          console.log(
            valoresNoRepetidos,
            valoresRepetido,
            valoresNoRepetidosArreglo2
          );
        } else {
          perfiles = methods.getValues("empresas").map((empresa: string) => {
            const perfilesEmp = data
              .filter(
                (perfil) =>
                  perfil.id_empresa === empresa && perfil.estado == "1"
              )
              .map((perfil) => ({
                value: perfil.id.toString(),
                label: perfil.nom_perfil,
                data: perfil,
              }));

            return {
              id_empresa: empresa,
              nom_empresa: perfilesEmp.at(0)?.data.empresa.emp_nombre,
              perfiles: perfilesEmp,
              id_perfil: "",
            };
          });
        }

        fieldArray.replace(
          perfiles.map((item: DataType) => ({
            id_empresa: item.id_empresa,
            id_perfil: item.id_perfil != "" ? item.id_perfil : "",
          }))
        );
        setEmpPerfiles(perfiles);
      })
      .catch((error) => {
        api["error"]({
          message: error.code,
          description: error.message,
          placement: "bottomRight",
        });
      });
  }, [usuario, methods.watch("empresas")]);

  return (
    <>
      {contextHolder}
      <List
        dataSource={empPerfiles}
        bordered={false}
        loading={empPerfiles?.length > 0 ? false : true}
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
                name={`perfiles.${index}.id_perfil`}
                rules={{
                  required: { value: true, message: "Campo requerido" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem label="Perfil:">
                    <Select
                      {...field}
                      showSearch
                      placeholder="Seleccione perfil"
                      options={item.perfiles}
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
