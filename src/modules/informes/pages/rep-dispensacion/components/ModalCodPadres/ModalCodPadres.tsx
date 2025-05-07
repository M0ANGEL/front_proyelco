/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Props } from "./types";
import { ProductoPadre } from "@/services/types";
import { Button, Col, Modal, Row, Table } from "antd";
import Search from "antd/es/input/Search";
import { buscarPadre } from "@/services/maestras/productosPadreAPI";


export const ModalCodPadres = ({
    open,
    setOpen,
    addPadre,
    padres,
}: Props) => {
    const [dataSource, setDataSource] = useState<ProductoPadre[]>([]);
    const [loaderTable, setLoaderTable] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setDataSource([]);
            setLoaderTable(false);
        }
    }, [open]);

    const fetchPadres = (value: string) => {
        setLoaderTable(true);
        buscarPadre(value).then(({ data: { data } }) => {
            const newDataSource: ProductoPadre[] = [];
            data.forEach((padre) => {
                if (!padres.some((item) => item == padre.cod_padre.toString())) {
                    newDataSource.push(padre);
                }
            });
            setDataSource(newDataSource);
            setLoaderTable(false);
        });
    };

    const onSearch = (value: string) => {
        if (value.length > 0) {
            fetchPadres(value);
        }
    };

    return (
        <>
            <Modal
                open={open}
                footer={[]}
                destroyOnClose
                style={{ top: 5 }}
                onCancel={() => setOpen(false)}
                width={800}
            >
                <Row gutter={[12, 12]} style={{ marginTop: 30 }}>
                    <Col span={24}>
                        <Search
                            enterButton
                            type="primary"
                            onSearch={onSearch}
                            placeholder="Buscar Codigo Padre"
                        />
                    </Col>
                    <Col span={24}>
                        <Table
                            size="small"
                            dataSource={dataSource.map((item) => ({ ...item, key: item.id }))}
                            loading={loaderTable}
                            columns={[
                                {
                                    title: "Código Padre",
                                    key: "cod_padre",
                                    dataIndex: "cod_padre",
                                    align: "center",
                                },
                                {
                                    title: "Descripción",
                                    key: "descripcion",
                                    dataIndex: "descripcion",
                                },
                                {
                                    title: "Acciones",
                                    key: "acciones",
                                    dataIndex: "acciones",
                                    align: "center",
                                    render(_, { id,cod_padre }) {
                                        return (
                                            <>
                                                <Button
                                                    block
                                                    size="small"
                                                    type="primary"
                                                    onClick={() => {
                                                        addPadre(cod_padre.toString());
                                                    }}
                                                >
                                                    Seleccionar
                                                </Button>
                                            </>
                                        );
                                    },
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    )
};