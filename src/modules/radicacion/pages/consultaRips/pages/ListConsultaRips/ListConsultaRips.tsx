/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    StyledCard,
    StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, DatePicker, Form, Row, Select, SelectProps, Table, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import { GreenButton, SearchBar } from "./styled";
import { Convenio } from "@/services/types";
import {getListRips, downJson, dockerRips, getConvenios } from "@/services/radicacion/ripsAPI";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
// import { FooterTable } from "../../components";



const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const ListConsultaRips = () => {
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [loader, setLoader] = useState<boolean>(false);
    const [selectConvenios, setSelectConvenios] = useState<
        SelectProps["options"]
    >([]);
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [ripsOption, setRipsOption] = useState<boolean>(false);
    const [rowSelect, setRowselect] = useState<React.Key[]>([]);
    const [rowSelectString, setRowselectString] = useState<number>();
    const [loaderTable, setLoaderTable] = useState<boolean>(false);
    const [pagination, setPagination] = useState<Pagination>();
    const [form] = Form.useForm();
    const [rowselectRows, setRowselectRows] = useState<string[]>([]);
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectFlag, setSelectFlag] = useState<boolean>(false);
    const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [detalle, setDetalle] = useState<DataType[]>([]);



    const control = useForm({
        defaultValues: {
            fechas_rango: undefined,
            convenios: [],
            codigo_prestador: "",
        },
    });

    useEffect(() => {
        setLoader(true);
        getConvenios()
            .then(({ data: { data } }) => {
                setConvenios(data);
                setSelectConvenios(
                    data.map((item: any) => ({
                        value: item.id,
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


    const checkKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") e.preventDefault();
    };

    const fetchDocumentos = (value: any) => {
        setLoaderTable(true);
        const data = {
            page: 1,
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
            const listaConsultaDoc:DataType[] = data.data.map((item: any) => {
                return {
                    key: item.id,
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
                    fecha_emision: item.fecha_emision,
                    fecha_vencimiento: item.fecha_vencimiento,
                    num_contrato: item.num_contrato,
                    numero_factura_vta: item.numero_factura_vta,
                    numero_fve: item.numero_fve,
                    tercero: item.nit + ' - ' + item.razon_soc,
                };
            });
            setInitialData(listaConsultaDoc);
            setDetalle(listaConsultaDoc);
            setLoaderTable(false);
            setRowselect(listaConsultaDoc.map((item)=> item.key));
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
            title: "Numero FVE",
            dataIndex: "numero_fve",
            key: "numero_fve",
            width: 100,
            // render: ( _, record: { key: React.Key; numero_fve: string; tipoDoc: string, numero_factura_vta: string }
            // ) => {
            //     const partes: string[] = record.numero_fve.split("-");
            //     const doc: string = partes[0];
            //     let documento = "";
            //     doc == "FVC" ? documento = record.numero_factura_vta : documento = record.numero_fve;
            //     return <>{documento}</>;
            // },
        },
        {
            title: "Documento Origen",
            dataIndex: "consecutivo",
            key: "consecutivo",
            width: 100,
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
        setBotonDeshabilitado(true);
        setLoading(true);
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
            { seleccion: rowSelect,
                flag:params.flag,
            }
        ];

        setLoader(true);
        if(params.flag === 0){
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

                    setLoaderTable(false);
                    setBotonDeshabilitado(false);
                    setLoading(false);
                }
            );
        }else{
            dockerRips(newData).then(() => {
                notificationApi.open({
                    type: "success",
                    message: `Archivo enviado con exito!`,
                });
                setTimeout(() => {
                    // control.reset();
                    setRowselect([]);
                    setDetalle([]);
                    setRowselectString(0);
                    setBotonDeshabilitado(false);
                    setLoading(false);
                }, 1500);
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


    return (
        <>
            {contextHolder}
            <StyledCard title={<Title level={4}>Consulta Rips</Title>}>
                <Row>
                    <Col span={24} style={{ marginBottom: 10 }}>
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
                                                    <StyledFormItem label={"Rango de Fechas Envio Rips:"} required>
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
                                            <Col xs={{ span: 24 }} md={{ span: 24 }}>
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
                                                        <StyledFormItem required label={"Tercero:"}>
                                                            <Select
                                                                {...field}
                                                                allowClear
                                                                placeholder="Tercero"
                                                                mode="multiple"
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
                                            {/* <Col xs={{ span: 24 }} md={{ span: 8 }}>
                                                <Controller
                                                    control={control.control}
                                                    name="codigo_prestador"
                                                    rules={{
                                                        required: {
                                                            value: true,
                                                            message: "Código Prestador es necesario",
                                                        },
                                                    }}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <StyledFormItem required label={"Código Prestador:"}>
                                                            <Input
                                                                {...field}
                                                                placeholder="Código Prestador"
                                                                status={error && "error"}
                                                            />
                                                            <Text type="danger">{error?.message}</Text>
                                                        </StyledFormItem>
                                                    )}
                                                />
                                            </Col> */}
                                        </>
                                        {/* <Col
                                    xs={{ span: 24 }}
                                    sm={{ offset: 7, span: 10 }}
                                    md={{ offset: 9, span: 6 }}
                                >
                                    <Button type="primary" block htmlType="submit">
                                        Generar Json
                                    </Button>
                                </Col>
                                <Col
                                    xs={{ span: 24 }}
                                    sm={{ offset: 7, span: 10 }}
                                    md={{ offset: 9, span: 6 }}
                                >
                                    <GreenButton
                                        type="primary"
                                        block
                                        // icon={<FileExcelFilled />}
                                        disabled={true}
                                        onClick={() => {
                                            if (control.getValues("fechas_rango")) {
                                                console.log(control.getValues("fechas_rango"));
                                                const rango_fechas =
                                                    control.getValues("fechas_rango") ?? [];

                                                const initialDate = dayjs(rango_fechas[0]).format(
                                                    "YYYY-MM-DD"
                                                );
                                                const endDate = dayjs(rango_fechas[1]).format(
                                                    "YYYY-MM-DD"
                                                );
                                                let link = "";
                                                switch (control.getValues("tipo_reporte")) {
                                                    case "facturacion1":
                                                        if (["auditoria"].includes(user_rol)) {
                                                            link = `reporteFacturacion1AudSQL`;
                                                        } else {
                                                            link = `reporteFacturacion1SQL`;
                                                        }
                                                        break;
                                                    case "facturaciontotal":
                                                        link = `facturaciontotalSQL`;
                                                        break;
                                                    case "notascreditototal":
                                                        link = `NotasCreditototalSQL`;
                                                        break;
                                                    case "facturacionp":
                                                        link = `reporteFacturacionPutumayoSQL`;
                                                        break;

                                                    default:
                                                        break;
                                                }

                                                window
                                                    .open(
                                                        `https://farmartltda.com/reportes/${link}.php?initialDate=${initialDate}&endDate=${endDate}`,
                                                        "_blank"
                                                    )
                                                    ?.focus();
                                            } else {
                                                control.setError("fechas_rango", {
                                                    type: "required",
                                                    message: "Rango de Fechas es necesario",
                                                });
                                            }
                                        }}
                                    >
                                        Envio Json
                                    </GreenButton>
                                </Col> */}
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
                    {/* <Col span={24}>
                        <SearchBar>
                            <Input placeholder="Buscar" onChange={handleSearch} />
                        </SearchBar>
                    </Col> */}
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
                            // footer={() => (
                            //     <FooterTable
                            //       data={detalle}
                            //       selected={rowSelectString}
                            //     />
                            //   )}
                            pagination={{
                                total: pagination?.total,
                                pageSize: pagination?.per_page,
                                hideOnSinglePage: true,
                                // pageSizeOptions: ["5", "15", "30"],
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
                </Row>
            </StyledCard>
        </>
    );
};