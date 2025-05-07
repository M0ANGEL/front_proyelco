/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnsType } from "antd/es/table";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Button, Col, Form, notification, Row, Select, SelectProps, Space, Table, Typography } from "antd";
import { DataType, DataTypeChildren, Pagination } from "./types";
import React, { useEffect, useState } from "react";
import { getListVencimientos, getListVencimientosDetalle, getBodxusu } from "@/services/vencimientos/vencimientos";
import { TablaExpandida } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { StyledFormItem } from "./styled";


const { Text } = Typography;

export const ListSeguimiento = () => {
  const [form] = Form.useForm();
  const control = useForm();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [expandedRows, setExpandedRows] = useState<React.Key[]>([]);
  const [expandedData, setExpandedData] = useState<{ [key: string]: DataTypeChildren[] }>({});
  const [loaderTable, setLoaderTable] = useState<boolean>(false);
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>();
  const [items_per_page, setItems_per_page] = useState<number>(10);
  const [colors, setColors] = useState<string>('');


  useEffect(() => {

    getBodxusu().then(({ data: { data } }) => {
      const bodegas = data.map((item: any) => {
        return { label: item.bod_nombre, value: item.id };
      });
      setOptionsBodegas(bodegas);
    });

  }, []);

  useEffect(() => {

    if (control.getValues("bodega") > 0) {

      const dataControl: any = {
        bodega: control.getValues("bodega"),
        page: currentPage,
        per_page: items_per_page,
        colors: colors,
      };

      fetchVencimientos(dataControl,colors);
    }
  }, [currentPage]);

  const handleExpand = async (expanded: boolean, record: DataType) => {
    if (expanded) {
      // Cargar datos solo si no están ya cargados
      if (!expandedData[record.id]) {
        try {

          getListVencimientosDetalle(record).then(({ data: { data } }) => {

            const items = data.map((detalle: any) => {
              return {
                key: `${(detalle.id).toString()}-${detalle.lote}`,
                lote: detalle.lote,
                fecha_vencimiento: detalle.fecha_vencimiento,
                stock: detalle.stock,
              };
            })

            setExpandedData(prev => ({ ...prev, [record.id]: items }));
          });


        } catch (error) {
          console.error('Error fetching expanded row data:', error);
        }
      }
      setExpandedRows([...expandedRows, record.id]);
      // console.log(`Row with id ${record.id} was expanded.`);
    } else {
      setExpandedRows(expandedRows.filter(id => id !== record.id));
      // console.log(`Row with id ${record.id} was collapsed.`);
    }
  };

  const columns: ColumnsType<DataType> = [

    {
      title: "Descripcion",
      dataIndex: "padre_descripcion",
      key: "padre_descripcion",
      width: 100,
    },
    {
      title: "Bodega",
      dataIndex: "bod_nombre",
      key: "bod_nombre",
      width: 10,
      align: "center",
    },
    {
      title: "Bodegas con Pendientes",
      dataIndex: "Bodega_con_pendientes",
      key: "Bodega_con_pendientes",
      width: 150,
      // render: (_, { Bodega_con_pendientes},index) => {
      //   if (Bodega_con_pendientes) {
      //     const bodegas = Bodega_con_pendientes.split('- ').filter((item) => item !== '');
      //     return (
      //       <Space direction="vertical" size={"small"}>
      //         {bodegas.map((bodega) => {
      //           return (
      //             <Text key={'bodegas_'+bodega+index} >
      //               {bodega}
      //             </Text>
      //           )
      //         })}
      //       </Space>
      //     );
      //   } else {
      //     return (
      //       <Text> Sin Bodegas</Text>
      //     )
      //   }

      // },
    },
    {
      title: "Bodegas de Alta Rotacion",
      dataIndex: "Bodegas_con_dispensaciones",
      key: "Bodegas_con_dispensaciones",
      width: 100,
    },
  ];
  const rowClassName = (record: any) => {
    return record.DiferenciaEnMeses <= 6 ? "red-row-st" : "orange-row";
  };

  const fetchVencimientos = (value: any,colors:string) => {

    const data = {
      data: value,
      colors: colors,
      page: currentPage,
      per_page: items_per_page,

    };
    setLoaderTable(true);

    getListVencimientos(data).then(({ data: { data } }) => {

      const responseData = data.data.length == 0;
      if (responseData) {
        notificationApi.open({
          type: "warning",
          message: `No hay Datos En su Busqueda!`,
        });
      }

      const result: DataType[] = data.data.map((item) => {

        return {
          key: item.key,
          id: `${(item.id).toString()}-${item.producto_id}`,
          cod_padre: item.cod_padre,
          padre_descripcion: item.padre_descripcion,
          producto_descripcion: item.producto_descripcion,
          productos: item.productos,
          productos_lotes: item.productos_lotes,
          bod_nombre: item.bod_nombre,
          lotes: item.lotes,
          bodega_id: item.bodega_id,
          producto_id: item.producto_id,
          Bodega_con_pendientes: item.Bodega_con_pendientes,
          Bodegas_con_dispensaciones: item.Bodegas_con_dispensaciones,
          DiferenciaEnMeses: item.DiferenciaEnMeses,

        }
      })
      setDataSource(result);
      setLoaderTable(false);
      setPagination(data);
    });

  };

  return (
    <>
      {contextHolder}
      <StyledCard title={"Seguimiento Vencimientos"}>
        <Row>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Form layout={"vertical"} form={form}
            >
              <Row gutter={[12, 6]}>
                <Col span={24}>
                  <Row gutter={12}>
                    <Col xs={{ span: 24, order: 1 }} sm={{ span: 10, order: 1 }}>
                      <Controller
                        name="bodega"
                        control={control.control}
                        rules={{
                          required: {
                            value: true,
                            message: "Bodega es requerido",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <StyledFormItem required label="Bodega :">
                            <Select
                              {...field}
                              mode="multiple"
                              allowClear
                              options={optionsBodegas}
                              showSearch
                              optionFilterProp="label"
                              maxTagCount={4}
                            />
                            <Text type="danger">{error?.message}</Text>
                          </StyledFormItem>
                        )}
                      />
                    </Col>
                    <Col
                      sm={{ span: 16, order: 7, offset: 4 }}
                      xs={{ span: 24, order: 7 }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ backgroundColor: "#ff0000af", margin: "5px" }}
                          onClick={() =>
                            control.handleSubmit((data) => {
                              setColors("red");
                              fetchVencimientos(data,"red");
                            })()
                          }
                        >
                          0 - 6 MESES
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ backgroundColor: "#ffbb00e1", margin: "5px" }}
                          onClick={() =>
                            control.handleSubmit((data) => {
                              setColors("yellow");
                              fetchVencimientos(data,"yellow");
                            })()
                          }
                        >
                          7 - 12 MESES
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24} style={{ marginBottom: 10 }}>
            <Table
              rowClassName={rowClassName}
              rowKey={(record, index) => `${index}-${(record.id).toString()}-${record.producto_id}`}
              size="small"
              dataSource={dataSource}
              columns={columns}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <TablaExpandida
                      data={expandedData[record.id]}
                    />
                  );
                },
                defaultExpandedRowKeys: ["1"],
                onExpand: handleExpand,
              }}
              loading={loaderTable}
              scroll={{ x: 1000 }}
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
        </Row>
      </StyledCard>
    </>
  );
}
