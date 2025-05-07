/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Input,
  Space,
  Table,
  Typography,
  Form,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  SelectProps,
  notification,
  Switch,
  Tooltip,
} from "antd";
import React, { useState, useEffect } from "react";
import { SearchBar, StyledFormItem } from "./styled";
import { DataType, FormTypes, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import {
  getGrupos,
  getListDocumentos,
  getTiposDocumentos,
  enviarSync,
  cambiarEstado,
  getEmpresa,
  getConvenios,
  getBodegas,
} from "@/services/syncContabilidad/syncAPI";
import { KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const FormSync = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [showImp, setShowImp] = useState(false);
  const [showNfact, setShowNfact] = useState(false);
  const [showFv, setShowFv] = useState(false);
  const [showNd, setShowNd] = useState(false);
  const { getSessionVariable } = useSessionStorage();
  const [empresa, setEmpresa] = useState<any>();
  const [watchEstado, setWatchEstado] = useState<boolean>();
  const [items_per_page, setItems_per_page] = useState<number>(500);
  const [value, setValue] = useState<string>("");

  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [optionsDocumentos, setOptionsDocumentos] = useState<
    SelectProps["options"]
  >([]);
  const [optionsGrupos, setOptionsGrupos] = useState<SelectProps["options"]>(
    []
  );
  const [pagination, setPagination] = useState<Pagination>();
  const control = useForm<FormTypes>(
    {
      defaultValues:
      {
        tipo_documento: [],
        grupo: [],
      }

    });
  const [rowSelect, setRowselect] = useState<React.Key[]>([]);
  const [rowselectRows, setRowselectRows] = useState<string[]>([]);
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [busquedaDoc, setBusquedaDoc] = useState<boolean>(false);
  const [rowSelectString, setRowselectString] = useState<number>();
  const [selectFlag, setSelectFlag] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);//
  const [optionsConvenios, setOptionsConvenios] = useState<SelectProps["options"]>([]);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>([]);
  const [bodegasConvenio, setBodegasConvenio] = useState<string[]>([]);




  const watchgrupos = control.watch("grupo");
  const watchDoc = control.watch("tipo_documento");
  const watchConv = control.watch("convenio");


  const selectCufe: SelectProps["options"] = [
    { label: "Con Cufe", value: "00" },
    { label: "Sin Cufe", value: "null" },
    { label: "Anulada", value: "5" },

  ];


  useEffect(() => {

    if (control.getValues("tipo_documento").length > 0) {
      const dataControl: any = {
        estado:control.getValues("estado"),
        fechaFin: control.getValues("fechaFin"),
        fechaInicio: control.getValues("fechaInicio"),
        tipo_documento: control.getValues("tipo_documento"),
        grupo: control.getValues("grupo"),
        rowSelect,
        rowSelectString,
        page: currentPage,
        search: value,
      };
      fetchDocumentos(dataControl);
    }
  }, [currentPage, value]);


  useEffect(() => {
    getGrupos().then(({ data }) => {
      const grupos = data.map((item: any) => {
        return { label: item.nombre, value: item.id };
      });
      setOptionsGrupos(grupos);
    });

    getEmpresa(getSessionVariable(KEY_EMPRESA)).then(({ data: { data } }) => {
      const emp = data.nit + " - " + data.emp_nombre;
      setEmpresa(emp);
    });

    getConvenios().then(({ data }) => {
      
      const convenios = data.data
        .filter((item: any) => item.id_tipo_conv == 1)
        .filter((item, index, self) =>
            index === self.findIndex((t) => t.nit === item.nit))
        .map((item: any) => {
          setBodegasConvenio(item.bodegas);
          return { label: item.nit, value: item.nit };
        });
       
      setOptionsConvenios(convenios);
    })
  }, []);

  useEffect(() => {

    getBodegas().then(({ data: { data } }) => {
      const bodegas = data
      //  .filter((item: any) => bodegasConvenio.includes(item.id) )
        .map((item) => {
          return { label: item.bod_nombre, value: item.id };
        });

      setOptionsBodegas(bodegas);
    });
  }, [watchConv]);

  useEffect(() => {

    if (watchgrupos.length === 0) {
      control.setValue("tipo_documento", []);
      if (dataSource) {
        setInitialData([]);
        setDataSource([]);
        setRowselect([]);
        setRowselectString(0);
      }
    }
  }, [watchgrupos]);

  useEffect(() => {
    if (dataSource) {
      setInitialData([]);
      setDataSource([]);
      setRowselect([]);
      setRowselectString(0);

    }
  }, [selectFlag]);

  useEffect(() => {
    setInitialData([]);
    setDataSource([]);
    setRowselect([]);
    setRowselectString(0);
    control.setValue('estado', "");
    if (["5"].some(value => watchDoc.includes(value))) {
      setShowImp(true);
    }
    else if (watchDoc != undefined && ["27", "56", "57"].some(value => watchDoc.includes(value))) {// [27, 56, 57].includes(watchDoc)) 

      setShowNfact(true);
      setWatchEstado(true)
    }
    else if (watchDoc != undefined && ["26", "60", "62"].some(value => watchDoc.includes(value))) {
      setShowFv(true);
      setWatchEstado(true)
    }
    else if (watchDoc != undefined && ["61"].some(value => watchDoc.includes(value))) {
      setShowNd(true);
      setWatchEstado(true)
    }

    else {
      setShowImp(false);
      setShowNfact(false);
      setShowFv(false);
      setShowNd(false);

    }
    watchDoc != undefined ? setWatchEstado(true) : null;

  }, [watchDoc]);

  const fetchDocumentos = (value: any) => {

    setLoaderTable(true);
    value.estado === "" ? value.estado = 0 : value.estado;
    (value.search = value.search ? value.search : "");
    const data = {
      page: currentPage,
      size: items_per_page,
      data: value,
      switch: selectFlag,
    };

    getListDocumentos(data).then(({ data: { data } }) => {

      const responseData = data.data.length == 0;
      if (responseData) {
        notificationApi.open({
          type: "warning",
          message: `No hay Datos En su Busqueda!`,
        });
      }
      const listaConsultaDoc: DataType[] = data.data.map((item) => {

        return {
          key: item.id,
          // consecutivo: item.consecutivos
          //   ? Object.values(item.consecutivos).join(", ")
          //   : "",
          bodega_id: item.bodega_id,
          bodega: item.bodega,
          consecutivo: item.consecutivo ?? item.numero_fve,
          created_at: item.created_at,
          descripcion: item.descripcion,
          docu_entrada: item.docu_entrada,
          docu_prestamo: item.docu_prestamo,
          docu_salida: item.docu_salida,
          docu_vinculado_id: item.docu_vinculado_id,
          estado: item.estado,
          fecha_cierre_contable: item.fecha_cierre_contable,
          id: item.id,
          impuesto: item.impuesto ?? parseInt(item.total) - parseInt(item.subtotal),
          motivo_id: item.motivo_id,
          observacion: item.observacion,
          subtotal: item.subtotal,
          tercero_id: item.tercero_id,
          tipo_documento_id: item.tipo_documento_id,
          total: item.total,
          updated_at: item.updated_at,
          user_id: item.user_id,
          codigo_homologacion: item.codigo_homologacion,
          sync: item.sync,
          bod_nombre: item.bod_nombre,
          nit: item.nit,
          razon_soc: item.razon_soc,
          nro_factura: item.nro_factura,
          factura_nro: item.factura_nro != '' ? item.factura_nro : item.nro_factura,
          numero_factura_vta: item.numero_factura_vta ?? item.nro_factura,
          numero_nota_credito: item.numero_nota_credito,
          ipoconsumo: item.ipoconsumo,
          codigo: item.codigo,
          numero_nota_debito: item.numero_nota_debito,
          nombre_estado: item.nombre_estado,
          estado_id: item.estado_id,
          status_code: item.status_code,
          convenio_id: item.convenio_id,
          convenio: item.convenio,
        };
      });
      setInitialData(listaConsultaDoc);
      setDataSource(listaConsultaDoc);
      setLoaderTable(false);
      setRowselect([]);
      setRowselectString(0);
      setPagination(data);
    });
  };


  const columns: ColumnsType<DataType> = [
    {
      title: "Tipo Documento",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 100,
    },
    {
      title: "Prefijo",
      dataIndex: "codigo_homologacion",
      key: "codigo_homologacion",
      width: 40,
      render(_, { codigo_homologacion, nro_factura, numero_factura_vta, consecutivo, numero_nota_credito, codigo, numero_nota_debito }) {


        const homologacion = codigo_homologacion.split(",");
        const nro: any = numero_nota_debito?.split("-") ?? (nro_factura?.split("-") ?? (numero_factura_vta?.split("-") ?? numero_nota_credito?.split("-")));
        const conse = nro === undefined ? (consecutivo?.split("-") ?? codigo) : "";

        // Combina los strings en un solo string JSON válido
        const jsonString = "[" + homologacion.join(",") + "]";

        // Convierte el string JSON en un objeto JavaScript
        const objeto = JSON.parse(jsonString);

        const cod = nro !== undefined ? objeto[0][nro[0]] : objeto[0][conse[0]];

        return (cod ?? objeto[0][""]);
      },
    },
    {
      title: "Factura Proveedor",
      dataIndex: "factura_nro",
      key: "factura_nro",
      width: 60,
    },
    {
      title: "Nota Credito",
      dataIndex: "numero_nota_credito",
      key: "numero_nota_credito",
      width: 60,
    },
    {
      title: "Factura",
      dataIndex: "numero_factura_vta",
      key: "numero_factura_vta",
      width: 60,
    },
    {
      title: "Nota Debito",
      dataIndex: "numero_nota_debito",
      key: "numero_nota_debito",
      width: 60,
    },
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      width: 80,
    },
    {
      title: "Estado Auditoria",
      dataIndex: "nombre_estado",
      key: "nombre_estado",
      width: 60,
      align: "center",
    },
    {
      title: "Tercero",
      dataIndex: "nit",
      key: "nit",
      width: 100,
      render(_, { nit, razon_soc }) {
        const tercero = nit ? nit + " - " + razon_soc : empresa;
        return (tercero);
      },
    },
    {
      title: "Bodega",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      width: 100,
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: 80,
    },
    {
      title: "Domicilio",
      dataIndex: "ipoconsumo",
      key: "ipoconsumo",
      align: "center",
      width: 80,
      render(_, { ipoconsumo }) {
        const dom = ipoconsumo != undefined ? ipoconsumo : "";
        return <>$ {parseFloat(dom).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      align: "center",
      width: 80,
      render(_, { subtotal }) {

        return <>$ {parseFloat(subtotal).toLocaleString("es-CO")}</>;
      },
    },

    {
      title: "Iva",
      dataIndex: "impuesto",
      key: "impuesto",
      align: "center",
      width: 60,
      render(_, { impuesto }) {

        return <>$ {parseFloat(impuesto).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Valor Total",
      dataIndex: "total",
      key: "total",
      align: "center",
      fixed: "right",
      width: 70,
      render(_, { total }) {
        return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
      },
    },
    {
      title: "Estado Sincronizacion",
      dataIndex: "sync",
      key: "sync",
      align: "center",
      fixed: "right",
      width: 70,
      render(_, { sync }) {
        const response = sync == "0" ? "Pendiente" : "Sincronizado";
        return <>{response}</>;
      },
    },
  ];

  if (selectFlag) {

    columns.push({
      title: "Acciones",
      key: "acciones",
      align: "center",
      fixed: "right",
      width: 60,
      render: (_, record) => {

        return (
          <Space>
            <Tooltip title="Cambiar Estado">
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  cambiarEstado({ record }).then(() => fetchDocumentos(control.getValues()));
                }}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
          </Space>
        );
      },
    });
  } if (watchEstado) {
    columns.splice(15, 0, {
      title: "Estado",
      key: "estado",
      align: "center",
      fixed: "right",
      width: 60,
      render: (_, record: any) => {

        const estados: any = {
          "00": "Con Cufe",
          null: "Sin Cufe",
          4: "Anulado",
          5: "activo",
          "0": "Abierto"
        }
        const tem: number = record.status_code === "00" || record.status_code === null ? record.status_code : record.estado;

        const resultado = estados[tem]

        return (<>
          {resultado}
        </>
        );
      },
    });
  }
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      const sum: number =
        selectedRows?.reduce(
          (accumulador: number, item: any) =>
            accumulador + parseFloat(item.total),
          0
        ) ?? 0;
      setRowselect(selectedRowKeys);
      setRowselectString(sum);
      setRowselectRows(selectedRows);
      selectedRowKeys.length == 0
        ? setBotonDeshabilitado(true)
        : setBotonDeshabilitado(false);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
    selectedRowKeys: rowSelect,
    selectedRows: rowSelectString,
  };
  const hasSelected = rowSelect.length > 0;

  const envRowSelect = () => {
    setBotonDeshabilitado(true);
    setLoaderTable(true);
    if (rowSelect.length == 0) {
      notificationApi.open({
        type: "error",
        message: "No has seleccionado ninguna fila!",
      });
      setLoaderTable(false);
      setTimeout(() => {
        //
      }, 1500);
      return;
    }

    const newData = {

      data: rowselectRows.map((item: any) => {
        return {
          consecutivo: item.consecutivo,
          id: item.id,
          tipoDocumento: item.tipo_documento_id ?? control.getValues('tipo_documento'),
          factura: item.nro_factura,
          notaC: item.numero_nota_credito,
          empresa: empresa,
          notaD: item.numero_nota_debito,
          page: 1,
          flag: 0,
        };
      }),
    };

    setLoaderTable(true);
    enviarSync(newData)
      .then(() => {
        let mensage = '';
        control.getValues('tipo_documento').includes('1') ? mensage = `Programado con exito !` : mensage = `Documento sincronizado con exito!`;
        notificationApi.open({
          type: "success",
          message: mensage,
        });
        setTimeout(() => {
          // control.reset();
          setRowselect([]);
          setDataSource([]);
          setRowselectString(0);
          setBotonDeshabilitado(false);
          setLoaderTable(false);
        }, 1500);
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
            if (response.data.exitosa !== false) {
              setRowselect([]);
              setDataSource([]);
              setRowselectString(0);
              setBotonDeshabilitado(false);
              setLoaderTable(false);
            }
          }

          setLoaderTable(false);
          setBotonDeshabilitado(false);
          setLoaderTable(false);
        }
      );
  };

  const handleComboBoxChange = () => {
    const grupo = { grupo: control.getValues("grupo") };
    getTiposDocumentos(grupo).then(({ data: { data } }) => {

      const documento = data
        .reduce<any[]>((acc, current) => {
          // Verificar si el objeto actual ya existe en el acumulador basado en el id
          const isFound = acc.some((item: any) => item.id === current.id);
          // Si no se encuentra, agregarlo al acumulador
          if (!isFound) {
            acc.push(current);
          }
          return acc;
        }, [])
        .map((item: any) => {
          return { label: item.descripcion, value: item.id };
        });
      setOptionsDocumentos(documento);
    });
  };

  let visibleColumns;

  if (showImp && !showNfact) {
    visibleColumns = columns.filter((column) => column.key !== 'numero_nota_credito' && column.key !== 'numero_factura_vta' && column.key !== 'numero_nota_debito' && column.key !== 'nombre_estado');//numero_factura_vta
  }
  else if (!showImp && showNfact) {
    visibleColumns = columns.filter((column) => column.key !== 'ipoconsumo' && column.key !== 'factura_nro' && column.key !== 'numero_factura_vta' && column.key !== 'numero_nota_debito' && column.key !== 'nombre_estado');
  }
  else if (showFv) {
    visibleColumns = columns.filter((column) => column.key !== 'ipoconsumo' && column.key !== 'factura_nro' && column.key !== 'numero_nota_credito' && column.key !== 'numero_nota_debito' && column.key !== 'nombre_estado');
  }

  else if (showNd) {
    visibleColumns = columns.filter((column) => column.key !== 'ipoconsumo' && column.key !== 'factura_nro' && column.key !== 'numero_nota_credito' && column.key !== 'numero_factura_vta' && column.key !== 'nombre_estado');
  }
  else if (["1"].some(value => watchDoc.includes(value))) {
    visibleColumns = columns.filter((column) => column.key !== 'ipoconsumo' && column.key !== 'factura_nro' && column.key !== 'numero_nota_credito' && column.key !== 'numero_factura_vta' && column.key !== 'numero_nota_debito');
  }
  else {
    visibleColumns = columns.filter((column) => column.key !== 'ipoconsumo' && column.key !== 'factura_nro' && column.key !== 'numero_nota_credito' && column.key !== 'numero_factura_vta' && column.key !== 'numero_nota_debito' && column.key !== 'nombre_estado');
  }


  return (
    <>
      {contextHolder}
      <StyledCard title={"Envio Documentos"}>
        <Row>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Form layout={"vertical"} form={form}>
              <Row gutter={[12, 6]}>
                <Col span={24}>
                  <Row gutter={12}>
                    <Col
                      xs={{ span: 24, order: 1 }}
                      sm={{ span: 6, order: 1 }}
                    // style={{ marginTop: 10 }}
                    >
                      <Controller
                        control={control.control}
                        name="fechas"
                        rules={{
                          required: {
                            value: busquedaDoc ? false : true,
                            message: "Rango de fechas es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={busquedaDoc ? false : true}
                            label="Rango de fechas:"
                          >
                            <RangePicker
                              {...field}
                              status={error && "error"}
                              style={{ width: "100%" }}
                              placeholder={["Inicio", "Fin"]}
                              onCalendarChange={(value: any) => {
                                if (value) {
                                  control.setValue(
                                    "fechaInicio",
                                    dayjs(value[0]).format("YYYY-MM-DD")
                                  );
                                  control.setValue(
                                    "fechaFin",
                                    dayjs(value[1]).format("YYYY-MM-DD")
                                  );
                                } else {
                                  control.setValue("fechaInicio", "");
                                  control.setValue("fechaFin", "");
                                }
                              }}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      xs={{ span: 6, order: 2 }}
                      sm={{ offset: 1, span: 6, order: 2 }}
                    >
                      <Controller
                        control={control.control}
                        name="grupo"
                        rules={{
                          required: {
                            value: true,
                            message: "Grupo es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required={true} label="Grupo :">
                            <Select
                              {...field}
                              allowClear
                              onBlur={(event: any) => {
                                handleComboBoxChange();
                              }}
                              mode="multiple"
                              placeholder="Grupo"
                              options={optionsGrupos}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      xs={{ span: 6, order: 3 }}
                      sm={{ offset: 1, span: 10, order: 3 }}
                    >
                      <Controller
                        control={control.control}
                        name="tipo_documento"
                        rules={{
                          required: {
                            value: true,
                            message: "Tipo Documento es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem
                            required={true}
                            label="Tipo Documento :"
                          >
                            <Select
                              {...field}
                              allowClear
                              mode="multiple"
                              maxTagCount="responsive"
                              placeholder="Tipo Documento"
                              options={optionsDocumentos}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      // span={12}
                      xs={{ span: 7, order: 4 }}
                      sm={{ span: 7, order: 4 }}
                    >
                      <Form.Item
                        label="Sincronizacion : "
                        name="fieldA" valuePropName="checked">
                        <Switch
                          onChange={() => setSelectFlag(selectFlag ? false : true)}
                        />
                      </Form.Item>
                    </Col>
                    {["26", "27", "56", "57", '60', "61", "62"].some(value => watchDoc.includes(value)) ? (
                      <Col
                        xs={{ span: 6, order: 4 }}
                        sm={{ span: 6, order: 4 }}
                      >
                        <Controller
                          control={control.control}
                          name="estado"
                          render={({ field, fieldState: { error } }) => (
                            <StyledFormItem label="Estado :">
                              <Select
                                {...field}
                                allowClear
                                placeholder="Estado"
                                options={selectCufe}
                              />
                              <Text type="danger">{error?.message}</Text>
                            </StyledFormItem>
                          )}
                        />
                      </Col>
                    ) : null}
                    {["1"].some(value => watchDoc.includes(value)) ? (
                      <>
                        <Col
                          xs={{ span: 6, order: 4 }}
                          sm={{ span: 6, order: 4 }}
                        >
                          <Controller
                            control={control.control}
                            name="convenio"
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label="Convenio :">
                                <Select
                                  {...field}
                                  allowClear
                                  maxTagCount={4}
                                  mode="multiple"
                                  placeholder="Convenio"
                                  options={optionsConvenios}
                                  filterOption={(input, option) =>
                                    (option?.label ?? "")
                                      .toString()
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                                  }
                                  status={error && "error"}
                                  // onChange={handleComboBoxChangeConv}
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                        <Col
                          xs={{ span: 6, order: 5 }}
                          sm={{ span: 10, order: 5, offset: 1 }}
                        >
                          <Controller
                            control={control.control}
                            name="bodega"
                            render={({ field, fieldState: { error } }) => (
                              <StyledFormItem label="Bodega :">
                                <Select
                                  {...field}
                                  allowClear
                                  placeholder="Bodega"
                                  options={optionsBodegas}
                                />
                                <Text type="danger">{error?.message}</Text>
                              </StyledFormItem>
                            )}
                          />
                        </Col>
                      </>
                    ) : null}
                  </Row>
                </Col>
                <Col sm={{ span: 12, order: 7, offset: 10 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={rowSelection.onChange.length == 0 ? true : false}
                    onClick={control.handleSubmit(fetchDocumentos)}
                  >
                    Listar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24}>
            <SearchBar>
              <Input placeholder="Buscar"
                onPressEnter={(event) => setValue(event.currentTarget.value)}
              />
              {/* <ExportExcel
              excelData={dataSource}
              fileName={"Syncronizacion"}
              /> */}
            </SearchBar>
          </Col>
          <Col style={{ marginLeft: 8 }}>
            {hasSelected
              ? `Seleccionados ${rowSelect.length} items de ${pagination?.total} `
              : dataSource.length != 0
                ? `items total : ${pagination?.total}`
                : ""}
          </Col>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Table
              rowSelection={{
                // type: selectionType,
                ...rowSelection,
              }}
              className="custom-table"
              rowKey={(record) => record.id}
              size="small"
              dataSource={dataSource}
              columns={visibleColumns}
              loading={loaderTable}
              scroll={{ x: 1500 }}
              pagination={{
                onChange: (page: number) => { setCurrentPage(page) },
                total: pagination?.total,
                pageSize: items_per_page,
                current: currentPage,
                hideOnSinglePage: true,
                simple: false,
                showTotal: (total = pagination?.total) => {
                  return (
                    <>
                      <Text>Total Registros: {total}</Text>
                    </>
                  );
                },
              }}
              bordered
            />
          </Col>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Space>
              <>
                <Button
                  // htmlType="submit"
                  type="primary"
                  disabled={
                    rowSelect.length == 0 || botonDeshabilitado == true || selectFlag == true
                      ? true
                      : false
                  }
                  icon={<SaveOutlined />}
                  onClick={envRowSelect}
                >
                  {!control.getValues('tipo_documento').includes('1') ? 'Enviar Documento' : 'Enviar Programación'}
                </Button>
              </>
            </Space>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
