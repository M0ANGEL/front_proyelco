/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Form, Col, Select, Row, Table, Tag, Spin } from "antd";
import type { SelectProps } from "antd";
import { TipoDocumento } from "@/services/types";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { getTipoDocumentoEmpresa } from "@/services/maestras/tiposDocumentosAPI";
import { Button } from "antd";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { DataTypeSource, Props } from "./types";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useParams } from "react-router-dom";
import {
  deleteUserTipoDocumento,
  saveUserTipoDocumento,
} from "@/services/maestras/usuariosAPI";

const plainOptions = ["crear", "modificar", "anular", "consultar"];
const defaultCheckedList: string[] = [];

export const DatosDocumentos = ({
  empresas,
  onPushNotification,
  usuario,
}: Props) => {
  // select empresas
  const [optionsEmpresas, setOptionsEmpresas] = useState<
    SelectProps["options"]
  >([]);

  // select documentos
  const [optionsDocumentos, setOptionsDocumentos] = useState<
    SelectProps["options"]
  >([]);
  const [loaderDocumentos, setLoaderDocumentos] = useState<boolean>(false);

  const [dataSource, setDataSource] = useState<DataTypeSource[]>([]);
  const [documentos, setDocumentos] = useState<TipoDocumento[]>([]);
  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultCheckedList);

  const methods = useFormContext();
  const fieldArray = useFieldArray({
    control: methods.control,
    name: "documentos",
  });
  const { id } = useParams<{ id: string }>();

  const [docsForm] = Form.useForm();

  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;
  const checkAll = plainOptions.length === checkedList.length;

  useEffect(() => {
    const newDocuments: any[] = [];
    if (dataSource.length > 0) {
      optionsDocumentos?.forEach((selectItem) => {
        if (
          dataSource.find(
            (item) => item.documento.toString() != selectItem.value
          )
        ) {
          newDocuments.push(selectItem);
        }
      });
      setOptionsDocumentos(newDocuments);
    } else {
      handleChange(docsForm.getFieldValue("empresa"));
    }
  }, [dataSource]);

  useEffect(() => {
    if (usuario) {
      const data = usuario.documentos.map((docu) => {
        const privilegios = [];
        if (docu.consultar == "1") {
          privilegios.push("consultar");
        }
        if (docu.crear == "1") {
          privilegios.push("crear");
        }
        if (docu.modificar == "1") {
          privilegios.push("modificar");
        }
        if (docu.anular == "1") {
          privilegios.push("anular");
        }
        return {
          key: docu.id,
          empresa: docu.id_empresa,
          documento: docu.documento_info.id,
          documentoInfo: docu.documento_info,
          empresaInfo: docu.empresa_info,
          privilegios: privilegios,
        };
      });
      setDataSource(data);
      fieldArray.replace(data);
    }
  }, [usuario]);

  useEffect(() => {
    docsForm.setFieldValue("empresa", null);
    let empresaOptions = [];
    let empresasUsu: SelectProps["options"] = [];
    if (usuario) {
      empresasUsu = usuario.empresas.map((empresa) => {
        return { label: empresa.empresa.emp_nombre, value: empresa.id_empresa };
      });
    }
    if (methods.getValues("empresas")) {
      empresaOptions = methods.getValues("empresas").map((item: string) => {
        const empresa = empresas
          ?.filter((value) => value.id.toString() == item)
          .at(0);
        return {
          label: empresa?.emp_nombre,
          value: item,
        };
      });
    }

    const opciones = empresasUsu
      .concat(empresaOptions)
      .filter(
        (objeto, indice, self) =>
          indice === self.findIndex((o) => o.value === objeto.value)
      );

    setOptionsEmpresas(opciones);
  }, [methods.watch("empresas")]);

  // Me trae la data de los tipos de documentos
  const handleChange = (value: string) => {
    getTipoDocumentoEmpresa(value).then(({ data: { data } }) => {
      setDocumentos(data);
      const documentos: any[] = [];
      data.forEach((documento) => {
        if (
          !dataSource.some(
            (item) => item.documento.toString() == documento.id.toString()
          ) && documento.estado == '1'
        ) {
          documentos.push({
            label: documento.codigo + " - " + documento.descripcion,
            value: documento.id,
          });
        }
      });
      setOptionsDocumentos(documentos);
    });
  };

  const agregarDocumento = () => {
    const data = docsForm.getFieldsValue();
    const addDocument = (flagKey: boolean, key?: React.Key) => {
      if (data.empresa && data.documento && data.privilegios) {
        const validDocto = dataSource.find(
          (item) =>
            item.empresa === data.empresa && item.documento === data.documento
        );
        if (!validDocto) {
          const empresaInfo = empresas?.find(
            (empresa) => empresa.id.toString() === data.empresa
          );
          const documentoInfo = documentos.find(
            (documento) => documento.id === data.documento
          );
          setDataSource([
            ...dataSource,
            {
              ...data,
              key: flagKey
                ? key
                : `${documentoInfo?.id}${documentoInfo?.id_empresa}`,
              empresaInfo,
              documentoInfo,
            },
          ]);
          fieldArray.append(data);
          docsForm.resetFields(["privilegios", "documento"]);
          setCheckedList([]);
        } else {
          onPushNotification({
            type: "error",
            title: "Este documento ya fue añadido!",
          });
        }
      } else {
        onPushNotification({
          type: "error",
          title: "Faltan datos por seleccionar",
        });
      }
    };
    let flagKey = false;
    let newKey = "";
    if (id) {
      setLoaderDocumentos(true);
      const dataFetch = {
        id_user: id,
        id_tipoDocu: data.documento,
        id_empresa: data.empresa,
        consultar: data.privilegios.includes("consultar") ? "1" : "0",
        crear: data.privilegios.includes("crear") ? "1" : "0",
        modificar: data.privilegios.includes("modificar") ? "1" : "0",
        anular: data.privilegios.includes("anular") ? "1" : "0",
      };
      saveUserTipoDocumento(dataFetch)
        .then(({ data }) => {
          flagKey = true;
          newKey = data.id;
          addDocument(flagKey, newKey);
          onPushNotification({
            type: "success",
            title: "Documento agregado exitosamente",
          });
        })
        .finally(() => setLoaderDocumentos(false));
    } else {
      addDocument(flagKey);
    }
  };

  const removerDocumento = (key: React.Key) => {
    if (id) {
      setLoaderDocumentos(true);
      deleteUserTipoDocumento(key.toString())
        .then(() => {
          setDataSource(dataSource.filter((item) => item.key != key));
          onPushNotification({
            type: "success",
            title: "Documento eliminado exitosamente",
          });
        })
        .finally(() => setLoaderDocumentos(false));
    } else {
      setDataSource(dataSource.filter((item) => item.key != key));
    }
  };

  const columns: ColumnsType<DataTypeSource> = [
    {
      title: "Empresa",
      dataIndex: "empresaInfo",
      key: "empresaInfo",
      render: (empresa) => <>{empresa.emp_nombre}</>,
    },
    {
      title: "Tipo documento",
      dataIndex: "documentoInfo",
      key: "documentoInfo",
      render: (documento) => (
        <>
          {documento.codigo} - {documento.descripcion}
        </>
      ),
    },
    {
      title: "Permisos",
      dataIndex: "privilegios",
      key: "privilegios",
      align: "center",
      render: (_, { privilegios }) => (
        <>
          {privilegios.map((item) => {
            let color = "";
            if (item === "consultar") {
              color = "cyan";
            } else if (item === "crear") {
              color = "green";
            } else if (item === "modificar") {
              color = "gold";
            } else if (item === "anular") {
              color = "red";
            }
            return (
              <Tag color={color} key={item}>
                {item.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, { key }) => (
        <>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => removerDocumento(key)}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    docsForm.setFieldValue("privilegios", e.target.checked ? plainOptions : []);
  };

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    docsForm.setFieldValue("privilegios", list);
  };

  return (
    <>
      <Spin
        spinning={loaderDocumentos}
        indicator={<LoadingOutlined spin />}
        style={{
          backgroundColor: "rgb(251 251 251 / 70%)",
        }}
      >
        <Form
          form={docsForm}
          layout="vertical"
          style={{ border: "1px solid #e5e5e5", padding: 10, borderRadius: 5 }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <StyledFormItem
                name={"empresa"}
                label="Seleccione empresa: "
                required
              >
                <Select onChange={handleChange} options={optionsEmpresas} />
              </StyledFormItem>
            </Col>
            <Col span={12}>
              <StyledFormItem
                name={"documento"}
                label="Seleccione tipo de documento: "
                required
              >
                <Select
                  showSearch
                  options={optionsDocumentos}
                  filterOption={(input, option) =>
                    (
                      option?.label?.toString().toLocaleLowerCase() ?? ""
                    ).includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                />
              </StyledFormItem>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginTop: 10 }}>
            <Col span={12}>
              <StyledFormItem
                name={"privilegios"}
                label="Seleccione permisos por el tipo de documento: "
                required
              >
                <Checkbox.Group
                  value={checkedList}
                  onChange={onChange}
                  style={{ width: "100%" }}
                >
                  <Row>
                    <Col span={6}>
                      <Checkbox value="consultar">Consultar</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="crear">Crear</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="modificar">Modificar</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="anular">Anular</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </StyledFormItem>
            </Col>
            <Col span={6}>
              <StyledFormItem label=" ">
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  Seleccionar todos
                </Checkbox>
              </StyledFormItem>
            </Col>
            <Col span={6}>
              <StyledFormItem
                style={{
                  display: "flex",
                  minHeight: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20,
                }}
              >
                <Button type="primary" onClick={() => agregarDocumento()}>
                  Agregar
                </Button>
              </StyledFormItem>
            </Col>
          </Row>
        </Form>
        <Table columns={columns} dataSource={dataSource} size="small" />
      </Spin>
      {/* <Row gutter={12}>
        <Table
          style={{ width: "100%" }}
          dataSource={dataSource}
          columns={columns}
        />
      </Row> */}
    </>
  );
};
