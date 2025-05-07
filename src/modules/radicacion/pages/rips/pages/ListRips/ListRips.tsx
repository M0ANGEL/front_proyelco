/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    StyledCard,
    StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, DatePicker, Form, Input, Row, Select, SelectProps, Space, Table, Typography, notification } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GreenButton, SearchBar } from "./styled";
import { Convenio } from "@/services/types";
import { getListRips, downJson, dockerRips, getConvenios, getFvc } from "@/services/radicacion/ripsAPI";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import { FooterTable } from "../../components";
import { ModalRespuestaRips } from "../../components/ModalRespuestaRips";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";



const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const ListRips = () => {
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [loader, setLoader] = useState<boolean>(false);
    const [selectConvenios, setSelectConvenios] = useState<
        SelectProps["options"]
    >([]);
    const [selectConvenioRelcionado, setSelectConvenioRelacionado] = useState<
        SelectProps["options"]
    >([]);
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [ripsOption, setRipsOption] = useState<boolean>(false);
    const [rowSelect, setRowselect] = useState<React.Key[]>([]);
    const [rowSelectString, setRowselectString] = useState<number>();
    const [loaderTable, setLoaderTable] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [rowselectRows, setRowselectRows] = useState<string[]>([]);
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectFlag, setSelectFlag] = useState<boolean>(false);
    const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [detalle, setDetalle] = useState<DataType[]>([]);
    const [openFlag, setOpenFlag] = useState<boolean>(false);
    const [dataResponse, setDataResponse] = useState<any[]>([]);
    const [convenioSeleccionado, setConvenioSeleccionado] = useState<Convenio>();
    const { arrayBufferToString } = useArrayBuffer();
    const [pagination, setPagination] = useState<Pagination>({
        data: [],
        per_page: 10,
        total: 0,
        page: 1,
    });
    const [facturas, setFacturas] = useState<any[]>([]);

    const control = useForm({
        defaultValues: {
            fechas_rango: undefined,
            convenios: [],
            mod_contrato: "",
            convenioRelacionado: "",
            fac_relacionada:"",
        },
    });
    const watchConvenio = control.watch('convenios');
    const watchModContrato = control.watch('mod_contrato');

    const optionsTipoDoc = [
        { label: "Facturación Electrónica de Venta", value: "FEV" },
        { label: "Nota Crédito Parcial", value: "NCP" },
        { label: "Nota Crédito Total", value: "NCT" },
        { label: "Nota Débito", value: "ND" },
        { label: "Capita Inicial", value: "CPI" },
        { label: "Capita por Periodo", value: "CP" },
        { label: "Capita Final", value: "CPF" },
        { label: "Nota Crédito Capita", value: "NCC" },
        { label: "Nota Ajuste", value: "NA" },
        { label: "Nota Ajuste Capita", value: "NACP" },
    ];

    useEffect(() => {
        setLoader(true);
        getConvenios()
            .then(({ data: { data } }) => {
                setConvenios(data);
                setSelectConvenios(
                    data
                    // .filter((item) => item.id_tipo_conv === "1")
                        .map((item: any) => ({
                            value: item.id.toString(),
                            label: `${item.num_contrato} - ${item.descripcion}`,
                        }))
                );
                setSelectConvenioRelacionado(
                    data
                        .filter((item) => item.id_mod_contra === "3")
                        .map((item: any) => ({
                            value: item.id.toString(),
                            label: `${item.num_contrato} - ${item.descripcion}`,
                        }))
                );
            })
            .finally(() => setLoader(false));
        setRipsOption(true);

    }, []);

    useEffect(() => {
        setSelectedRowKeys(detalle.map((item) => item.key));

        if (!rowSelectString) {
            const sumatoria = detalle.reduce(
                (accumulator, item) => accumulator + parseFloat(item.total),
                0
            );
            setRowselectString(sumatoria);
        }
    }, [detalle]);

    useEffect(() => {
        if(watchModContrato==="CP" || watchModContrato==="NACP"){
            const data={convenio:[watchConvenio[0]],modContrato:watchModContrato};
            getFvc(data).then(({ data: { data } }) => {
             setFacturas(
                    data
                        .map((item: any) => ({
                            value: item.nro_factura,
                            label: `${item.nro_factura}`,
                        }))
                );
            })
            .finally(() => setLoader(false));
        }
    },[watchModContrato])

    // useEffect(() => {
    //     let con;
    //     if (convenios && watchConvenio) {
    //         con = convenios.find((item) => item.id.toString() === watchConvenio);
    //     }
    //     setConvenioSeleccionado(con);
    // }, [watchConvenio]);

    const checkKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault();
    };

    const fetchDocumentos = (value: any) => {
        setLoaderTable(true);
        const data = {
            page: value.page,
            data: value,
        };
        getListRips(data).then(({ data: { data } }) => {

            setPagination(data);
            const responseData = data.data.length == 0;
            if (responseData) {
                notificationApi.open({
                    type: "warning",
                    message: `No hay Datos En su Busqueda!`,
                });
            }
            const listaConsultaDoc: DataType[] = data.data.map((item: any) => {
                return {
                    key: item.key,
                    consecutivo: item.consecutivos
                        ? Object.values(item.consecutivos).join(", ")
                        : "",
                    bodega_id: item.bodega_id,
                    estado: item.estado,
                    id: item.id,
                    impuesto: item.impuesto ?? parseInt(item.total) - parseInt(item.subtotal),
                    motivo_id: item.motivo_id,
                    subtotal: item.subtotal,
                    tipo_documento_id: item.tipo_documento_id,
                    total: item.total,
                    updated_at: item.updated_at,
                    codigo: item.codigo,
                    bod_nombre: item.bod_nombre,
                    nit: item.nit,
                    razon_soc: item.razon_soc,
                    nro_factura: item.nro_factura,
                    factura_nro: item.factura_nro != '' ? item.factura_nro : item.nro_factura,
                    ipoconsumo: item.ipoconsumo,
                    estado_id: item.estado_id,
                    fecha_emision: item.fecha_emision ?? item.created_at,
                    fecha_vencimiento: item.fecha_vencimiento ?? item.fecha_pago,
                    num_contrato: item.num_contrato??item.convenio.num_contrato,
                    numero_factura_vta: item.numero_factura_vta,
                    numero_fve: item.numero_fve ?? item.consecutivo,
                    tercero: item.nit + ' - ' + item.razon_soc,
                    numero_nota_credito: item.numero_nota_credito??null,
                    fve_dis_id:item.fve_dis_id??null,
                    fve_cabecera:item.fve_cabecera??null,
                    convenio_id:item.convenio_id??null,
                    convenio:item.convenio??null,
                };
            });
            setInitialData(listaConsultaDoc);
            setDetalle(listaConsultaDoc);
            setLoaderTable(false);
            setRowselect(listaConsultaDoc.map((item) => item.key));
            setRowselectString(0);
        });
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const filterTable = initialData?.filter((o: any) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(value.toLowerCase())
            )
        );

        setDetalle(filterTable);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "Numero Documento",
            dataIndex: "numero_fve",
            key: "numero_fve",
            width: 100,
            render: (_, { numero_fve,numero_nota_credito,nro_factura }) => {
                if (numero_nota_credito) {
                    return <> {numero_nota_credito}</>;
                } else if(nro_factura)  {
                    return <>{nro_factura}</>;
                }else{
                    return <>{numero_fve}</>;
                }
            }
        },
        {
            title: "Documento Origen",
            dataIndex: "numero_fve",
            key: "numero_fve",
            width: 100,
            render: (_, { numero_nota_credito,numero_fve,fve_cabecera }) => {
                if (numero_nota_credito) {
                return <>{fve_cabecera?.numero_fve}</>;
            }else { return <>{numero_fve}</>;}
        },
        },
        {
            title: "Convenio",
            dataIndex: "num_contrato",
            key: "num_contrato",
            width: 100,
        },
        {
            title: "Cliente",
            dataIndex: "tercero",
            key: "tercero",
            width: 100,
            render: (_, { nit,razon_soc,convenio }) => {
                if (nit) {
                    return <>{ `${nit} - ${razon_soc}`}</>;
                }else { 
                    const nit=convenio?.nit;
                    return <>{`${nit} - `}</>;}
            },
        },
        {
            title: "Fecha Emision",
            dataIndex: "fecha_emision",
            key: "fecha_emision",
            width: 80,
        },
        {
            title: "Fecha Vencimiento",
            dataIndex: "fecha_vencimiento",
            key: "fecha_vencimiento",
            width: 80,
        },
        {
            title: "SubTotal",
            dataIndex: "subtotal",
            key: "subtotal",
            width: 80,
            align: "center",
            fixed: "right",
            render(_, { subtotal }) {
                return <>$ {parseFloat(subtotal).toLocaleString("es-CO")}</>;
            },
        },
        {
            title: "Impuesto",
            dataIndex: "impuesto",
            key: "impuesto",
            width: 80,
            align: "center",
            fixed: "right",
            render(_, { impuesto }) {
                return (
                    <>
                        ${" "}
                        {parseFloat(
                            impuesto
                        ).toLocaleString("es-CO")}
                    </>
                );
            },
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 80,
            align: "center",
            fixed: "right",
            render(_, { total }) {
                return <>$ {parseFloat(total).toLocaleString("es-CO")}</>;
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            selectedRowKeys;
            const sum: number =
                selectedRows?.reduce(
                    (accumulador: number, item: any) =>
                        accumulador + parseFloat(item.total),
                    0
                ) ?? 0;
            setRowselect(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
            setRowselectString(sum);
        },
    };

    const hasSelected = rowSelect.length > 0;

    const envRowSelect = (params: { flag: number }) => {
        setLoaderTable(true);
        setBotonDeshabilitado(true);
        if (rowSelect.length == 0) {
            notificationApi.open({
                type: "error",
                message: "No has seleccionado ninguna fila!",
            });
            setLoading(false);
            setTimeout(() => {
                //
            }, 1500);
            return;
        }


        const newData = [
            {
                seleccion: rowSelect,
                flag: params.flag,//convenios
                mod_contrato: control.getValues('mod_contrato'),
                fechas_rango: control.getValues('fechas_rango'),
                convenios: control.getValues('convenios'),
                fac_relacionada:control.getValues('fac_relacionada'),
            }
        ];

        setLoader(true);
        if (params.flag === 0) {
            downJson(newData)
                .then(() => {
                    notificationApi.open({
                        type: "success",
                        message: `Archivo descargado con exito!`,
                    });
                    setTimeout(() => {
                        // control.reset();
                        setRowselect([]);
                        setDetalle([]);
                        setRowselectString(0);
                        setBotonDeshabilitado(false);
                        setLoading(false);
                    }, 1500);
                    setLoaderTable(false);
                })
                .catch(({ response: { data } }) => {
                    const jsonString = arrayBufferToString(data);
                    const jsonObject = JSON.parse(jsonString);

                    const message = jsonObject.message || "Mensaje no disponible";

                    notificationApi.open({
                      type: "error",
                      message: message,
                    });
                    setBotonDeshabilitado(false);
                  })
                  .finally(() => setLoaderTable(false));
        } else {
            dockerRips(newData).then(({ data: { response } }) => {
                setDataResponse(response);
                notificationApi.open({
                    type: "success",
                    message: `Archivo enviado con exito!`,
                });

                setTimeout(() => {

                    setOpenFlag(true);
                    // control.reset();
                    setRowselect([]);
                    setDetalle([]);
                    setRowselectString(0);
                    setBotonDeshabilitado(false);
                    setLoading(false);
                    setLoaderTable(false);
                }, 1500);
                setLoaderTable(false);
            }).catch(
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

                    setLoaderTable(false);
                    setBotonDeshabilitado(false);
                    setLoading(false);
                }
            );
        }
    };

    const handleSetDetalle = (response: any) => {
        console.log(response);

    };
    const handlePageChange = (page: any) => {
        const dataControl: any = {
            convenios: control.getValues("convenios"),
            fechas_rango: control.getValues("fechas_rango"),
            mod_contrato: control.getValues("mod_contrato"),
            rowSelect,
            rowSelectString,
            page,
        };
        fetchDocumentos(dataControl);
    };


    return (
        <>
            {contextHolder}
            <StyledCard title={<Title level={4}>RIPS</Title>}>
                <Row>
                    <Col span={24} style={{ marginBottom: 10 }}>
                        {contextHolder}
                        <ModalRespuestaRips
                            open={openFlag}
                            setOpen={(value: boolean) => setOpenFlag(value)}
                            key="modalRespuestaRips"
                            onSetDataSource={(response) =>
                                handleSetDetalle(response)
                            }
                            dataResponse={dataResponse}
                        />
                        <Form layout={"vertical"} form={form}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Row gutter={12}>
                                        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                                            <Controller
                                                control={control.control}
                                                name="fechas_rango"
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: "Rango de Fechas es necesario",
                                                    },
                                                }}
                                                render={({ field, fieldState: { error } }) => (
                                                    <StyledFormItem label={"Rango de Fechas:"} required>
                                                        <RangePicker
                                                            {...field}
                                                            placeholder={["Inicio", "Fin"]}
                                                            status={error && "error"}
                                                            style={{ width: "100%" }}
                                                        />
                                                        <Text type="danger">{error?.message}</Text>
                                                    </StyledFormItem>
                                                )}
                                            />
                                        </Col>
                                        <>
                                            <Col xs={{ span: 24 }} md={{ span: 20 }}>
                                                <Controller
                                                    control={control.control}
                                                    name="convenios"
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: "Convenios es necesario",
                                                        },
                                                    }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <StyledFormItem required label={"Convenios:"}>
                                                            <Select
                                                                {...field}
                                                                allowClear
                                                                showSearch
                                                                mode="multiple"
                                                                maxTagCount={4}
                                                                placeholder="Convenios"
                                                                options={selectConvenios}
                                                                filterOption={(input, option) =>
                                                                    (option?.label ?? "")
                                                                        .toString()
                                                                        .toLowerCase()
                                                                        .includes(input.toLowerCase())
                                                                }
                                                                popupMatchSelectWidth={false}
                                                                status={error && "error"}
                                                            />
                                                            <Text type="danger">{error?.message}</Text>
                                                        </StyledFormItem>
                                                    )}
                                                />
                                            </Col>
                                            <Col xs={{ span: 6, order: 6 }} sm={{ span: 10, order: 5 }}>
                                                <Controller
                                                    control={control.control}
                                                    name="mod_contrato"
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: "Modalidad de Contrato es requerido",
                                                        },
                                                    }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <StyledFormItem
                                                            required={true}
                                                            label="Modalidad de Contrato :"
                                                        >
                                                            <Select {...field} options={optionsTipoDoc} />
                                                            <Text type="danger">{error?.message}</Text>
                                                        </StyledFormItem>
                                                    )}
                                                />
                                            </Col>
                                            { watchModContrato==="CP" || watchModContrato==="NACP"   ? (
                                            <Col xs={{ span: 6, order: 7 }} sm={{ span: 8, order: 6 }}>
                                                <Controller
                                                    control={control.control}
                                                    name="fac_relacionada"
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: "Factura Anterior Capita es requerido",
                                                        },
                                                    }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <StyledFormItem
                                                            required={true}
                                                            label="Factura Anterior Capita :"
                                                        >
                                                            <Select {...field} options={facturas} />
                                                            <Text type="danger">{error?.message}</Text>
                                                        </StyledFormItem>
                                                    )}
                                                />
                                            </Col>
                                            ):null}
                                        </>
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
                            <Input placeholder="Buscar" onChange={handleSearch} />
                        </SearchBar>
                    </Col>
                    <Col style={{ marginLeft: 8 }}>
                        {hasSelected
                            ? `Seleccionados ${rowSelect.length} items de ${detalle.length} `
                            : detalle.length != 0
                                ? `items total : ${detalle.length}`
                                : ""}
                    </Col>
                    <Col span={24} style={{ marginBottom: 10 }}>
                        <Table
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                                selectedRowKeys,
                            }}
                            className="custom-table"
                            rowKey={(record) => record.id}
                            size="small"
                            dataSource={detalle}
                            columns={columns}
                            loading={loaderTable}
                            scroll={{ x: 1500 }}
                            footer={() => (
                                <FooterTable
                                    data={detalle}
                                    selected={rowSelectString}
                                />
                            )}
                            pagination={{
                                onChange: handlePageChange,
                                total: pagination?.total,
                                pageSize: pagination?.per_page,
                                hideOnSinglePage: true,
                                pageSizeOptions: ["5", "15", "30"],
                                showTotal: () => {
                                    return (
                                        <>
                                            <Text>Total Registros: {pagination?.total}</Text>
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
                                    icon={<SaveOutlined />}
                                    onClick={() => envRowSelect({ flag: 0 })}
                                >
                                    Generar Json
                                </Button>
                            </>
                        </Space>
                        <Space >
                            <>
                                <GreenButton
                                    type="primary"
                                    disabled={botonDeshabilitado}
                                    icon={<SaveOutlined />}
                                    onClick={() => envRowSelect({ flag: 1 })}
                                >
                                    Enviar Json
                                </GreenButton>
                            </>
                        </Space>
                    </Col>
                </Row>
            </StyledCard>
        </>
    );
};