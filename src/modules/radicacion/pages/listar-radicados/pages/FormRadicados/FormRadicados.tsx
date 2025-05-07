/* eslint-disable react-hooks/exhaustive-deps */
import { getRadicacionInfo } from "@/services/radicacion/radicacionAPI";
import {
  StyledFormItem,
  StyledCard,
} from "@/modules/common/layout/DashboardLayout/styled";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CustomTag } from "./styled";
import { DataType } from "./types";
import dayjs from "dayjs";
import {
  notification,
  InputNumber,
  Skeleton,
  Button,
  Input,
  Form,
  Col,
  Row,
  TableColumnType,
  InputRef,
  Space,
} from "antd";

export const FormRadicados = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const searchInput = useRef<InputRef>(null);
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      setLoader(true);
      getRadicacionInfo(id)
        .then(({ data: { data } }) => {
          form.setFieldsValue({
            fecha_radicado: data.fecha_radicado
              ? dayjs(data.fecha_radicado).format("YYYY-MM-DD")
              : "Sin fecha",
            fecha_glosa: data.fecha_glosa
              ? dayjs(data.fecha_glosa).format("YYYY-MM-DD")
              : "Sin fecha",
            fecha_respuesta: data.fecha_respuesta
              ? dayjs(data.fecha_respuesta).format("YYYY-MM-DD")
              : "Sin fecha",
            fecha_ratificacion: data.fecha_ratificacion
              ? dayjs(data.fecha_ratificacion).format("YYYY-MM-DD")
              : "Sin fecha",
            fecha_conciliacion: data.fecha_conciliacion
              ? dayjs(data.fecha_conciliacion).format("YYYY-MM-DD")
              : "Sin fecha",
            cta_radicado: data.cta_radicado,
            nro_radicado: data.nro_radicado,
            total: parseFloat(data.total),
            nit: data.nit,
          });
          setDataSource(
            data.facturas.map((item) => {
              return {
                key: item.id,
                consecutivo: item.dispensacion.consecutivo,
                descripcion: item.convenio.descripcion,
                fecha_facturacion: item.fecha_facturacion,
                numero_factura_vta: item.numero_factura_vta,
                estado_glosa: item.info_estado_glosa.nombre,
                grupo_glosa: item.info_estado_glosa.grupo,
                total: parseFloat(item.total),
                valor_glosado: item.detalle.reduce(
                  (accumulator, item) =>
                    accumulator + parseFloat(item.valor_glosado),
                  0
                ),
              };
            })
          );
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
          }
        )
        .finally(() => setLoader(false));
    }
  }, [id]);

  const getColumnSearchProps = (
    dataIndex: keyof DataType
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{
            marginBottom: 8,
            display: "block",
            textTransform: "uppercase",
          }}
          disabled={false}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            disabled={false}
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              clearFilters && clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
            disabled={false}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{ color: filtered ? "#1677ff" : "#f0a81d", fontSize: 15 }}
      />
    ),
    onFilter: (value, record) => {
      let nestedValue = "";
      switch (dataIndex) {
        default:
          nestedValue = record[dataIndex]?.toString().toLowerCase() || "";
          break;
      }

      return nestedValue
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      key: "fecha_facturacion",
      dataIndex: "fecha_facturacion",
      title: "Fecha Facturacion",
      align: "center",
      ...getColumnSearchProps("fecha_facturacion"),
    },
    {
      key: "numero_factura_vta",
      dataIndex: "numero_factura_vta",
      title: "Numero de FVE",
      align: "center",
      ...getColumnSearchProps("numero_factura_vta"),
    },
    {
      key: "consecutivo",
      dataIndex: "consecutivo",
      title: "Consecutivo",
      align: "center",
      ...getColumnSearchProps("consecutivo"),
    },
    {
      key: "descripcion",
      dataIndex: "descripcion",
      title: "Descripcion",
      ...getColumnSearchProps("descripcion"),
    },
    {
      key: "estado_glosa",
      dataIndex: "estado_glosa",
      title: "Estado",
      align: "center",
      width: 250,
      ...getColumnSearchProps("estado_glosa"),
      render(value: string, { grupo_glosa }) {
        let color = "";
        switch (grupo_glosa) {
          case "2":
            color = "gold-inverse";
            break;
          case "3":
            color = "orange-inverse";
            break;
          case "4":
            color = "blue-inverse";
            break;
          case "5":
            color = "cyan-inverse";
            break;
        }
        return <CustomTag color={color}>{value}</CustomTag>;
      },
    },
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
      align: "center",
      width: 100,
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
    {
      key: "valor_glosado",
      dataIndex: "valor_glosado",
      title: "Valor Glosado",
      align: "center",
      width: 100,
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <StyledCard title="Detalle de la Radicación">
        <Row gutter={[12, 12]}>
          <Col span={24}>
            {!loader ? (
              <Form layout="vertical" form={form}>
                <Row gutter={[12, 6]}>
                  <Col xs={24} md={12} lg={5}>
                    <StyledFormItem
                      name={"cta_radicado"}
                      label="Cuenta de Radicado o Número de Factura:"
                    >
                      <Input disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={5}>
                    <StyledFormItem
                      name={"nro_radicado"}
                      label="Número de Radicado:"
                    >
                      <Input disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={5}>
                    <StyledFormItem
                      name={"fecha_radicado"}
                      label={"Fecha de Radicado:"}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={5}>
                    <StyledFormItem name={"nit"} label="Nit:">
                      <Input disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <StyledFormItem name={"total"} label="Total:">
                      <InputNumber
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        style={{ width: "100%" }}
                        disabled
                      />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <StyledFormItem
                      name={"fecha_glosa"}
                      label={"Fecha de Glosa:"}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <StyledFormItem
                      name={"fecha_respuesta"}
                      label={"Fecha de Respuesta:"}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <StyledFormItem
                      name={"fecha_ratificacion"}
                      label={"Fecha de Ratificación:"}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </StyledFormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <StyledFormItem
                      name={"fecha_conciliacion"}
                      label={"Fecha de Conciliación:"}
                    >
                      <Input style={{ width: "100%" }} disabled />
                    </StyledFormItem>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Skeleton active />
            )}
          </Col>
          <Col>{`Número de facturas: ${dataSource.length}`}</Col>
          <Col span={24}>
            <Table
              bordered
              size={"small"}
              loading={loader}
              columns={columns}
              dataSource={dataSource}
              footer={() => {
                const total: number = dataSource.reduce(
                  (accumulador, item) => accumulador + item.total,
                  0
                );
                return (
                  <>
                    <Row>
                      <Col
                        span={24}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        Valor total: ${total.toLocaleString("es-CO")}
                      </Col>
                    </Row>
                  </>
                );
              }}
            />
          </Col>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Link to={"../.."} relative="path">
              <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                Volver
              </Button>
            </Link>
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};
