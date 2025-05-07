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
import { getConvenios, getListzip, downZip } from "@/services/radicacion/ripsAPI";
import { DataType, Pagination } from "./types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";



const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const ListDescargaZip = () => {
    const [initialData, setInitialData] = useState<DataType[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [loader, setLoader] = useState<boolean>(false);
    const [selectConvenios, setSelectConvenios] = useState<
        SelectProps["options"]
    >([]);
    const [ripsOption, setRipsOption] = useState<boolean>(false);
    const [rowSelect, setRowselect] = useState<React.Key[]>([]);
    const [rowSelectString, setRowselectString] = useState<number>();
    const [loaderTable, setLoaderTable] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [rowselectRows, setRowselectRows] = useState<string[]>([]);
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectFlag, setSelectFlag] = useState<boolean>(false);
    const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [detalle, setDetalle] = useState<DataType[]>([]);
    const [openFlag, setOpenFlag] = useState<boolean>(false);
    const [dataResponse, setDataResponse] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>("");
    const [pagination, setPagination] = useState<Pagination>({
        data: [],
        per_page: 10,
        total: 0,
        page: 1,
    });

    const control = useForm({
        defaultValues: {
            fechas_rango: undefined,
            convenio: [],
            fechaInicio: "",
            fechaFin: "",
        },
    });

    useEffect(() => {
        setLoader(true);
        getConvenios()
            .then(({ data: { data } }) => {
                setSelectConvenios(
                    data.filter((item) => item.id_tipo_conv === "1")
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
        // setSelectedRowKeys(detalle.map((item) => item.key));
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
    const submitFetch =() => {
        setSearchInput("");
        setCurrentPage(1);
        fetchDocumentos("");
    };
    const fetchDocumentos = (value=searchInput,page=currentPage) => {
        setLoaderTable(true);
        const data = {
            data: {
                convenio: control.getValues("convenio"),
                fechaInicio: control.getValues("fechaInicio"),
                fechaFin: control.getValues("fechaFin"),
                rowSelect,
                rowSelectString,
                page,
                value
            }
        };
        getListzip(data).then(({ data: { data } }) => {

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
                    fecha_emision: item.fecha_facturacion ?? item.created_at,
                    fecha_vencimiento: item.fecha_vencimiento ?? item.fecha_pago,
                    num_contrato: item.descripcion,
                    numero_factura_vta: item.numero_factura_vta,
                    numero_fve: item.numero_fve ?? item.consecutivo,
                    tercero: item.nit + ' - ' + item.razon_soc,
                };
            });
            setInitialData(listaConsultaDoc);
            setDetalle(listaConsultaDoc);
            setLoaderTable(false);
            setRowselect(listaConsultaDoc.map((item) => item.key));
            setRowselectString(0);
        });
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "Numero Factura",
            dataIndex: "numero_factura_vta",
            key: "numero_factura_vta",
            width: 60,
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
            title: "Fecha Facturacion",
            dataIndex: "fecha_emision",
            key: "fecha_emision",
            width: 60,
        },
        {
            title: "SubTotal",
            dataIndex: "subtotal",
            key: "subtotal",
            width: 70,
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
            width: 70,
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
            width: 70,
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

    const envRowSelect = () => {
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
                // fechas_rango: control.getValues('fechas_rango'),
                convenio: control.getValues('convenio'),
            }
        ];

        setLoader(true);
        downZip(newData)
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
    };


    return (
        <>
            {contextHolder}
            <StyledCard title={<Title level={4}>DESCARGA ZIP</Title>}>
                <Row>
                    <Col span={24} style={{ marginBottom: 10 }}>
                        <Form layout={"vertical"} form={form}>
                            <Row gutter={[12, 12]}>
                                <Col span={24}>
                                    <Row gutter={12}>
                                        <>
                                            <Col xs={{ span: 12 }} md={{ span: 12 }}>
                                                <Controller
                                                    control={control.control}
                                                    name="convenio"
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
                                                                placeholder="Convenios"
                                                                showSearch
                                                                mode="multiple"
                                                                maxTagCount={4}
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
                                            <Col xs={{ span: 24 }} sm={{ span: 8, offset: 3 }}>
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
                                        </>
                                    </Row>
                                </Col>
                                <Col sm={{ span: 12, order: 7, offset: 10 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        disabled={rowSelection.onChange.length == 0 ? true : false}
                                        onClick={control.handleSubmit(submitFetch)}
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
                                onPressEnter={(event) => {
                                    const {
                                        target: { value },
                                    }: any = event;
                                    setCurrentPage(1);
                                    fetchDocumentos(value);
                                    setSearchInput(value);
                                }}
                            />
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
                            pagination={{
                                onChange: (page: number) => {
                                    fetchDocumentos(searchInput, page);
                                    setCurrentPage(page);
                                  },
                                total: pagination?.total,
                                pageSize: pagination?.per_page,
                                hideOnSinglePage: true,
                                current: currentPage,
                                showSizeChanger: false,
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
                        <Space >
                            <>
                                <GreenButton
                                    // htmlType="submit"
                                    type="primary"
                                    // disabled={true}
                                    icon={<SaveOutlined />}
                                    onClick={() => envRowSelect()}
                                >
                                    Generar Zip
                                </GreenButton>
                            </>
                        </Space>
                    </Col>
                </Row>
            </StyledCard>
        </>
    );
};