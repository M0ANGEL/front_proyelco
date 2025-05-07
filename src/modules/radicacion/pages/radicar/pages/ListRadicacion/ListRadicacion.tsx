/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { downloadTemplate } from "@/services/documentos/otrosAPI";
import { Item } from "../../components/ModalCarguePlano/types";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Table, { ColumnsType } from "antd/es/table";
import {
  // getListaRadicacion,
  radicacion,
} from "@/services/radicacion/radicacionAPI";
import { StyledFormItem } from "./styled";
import { DataType } from "./types";
import {
  QuestionCircleFilled,
  CloseCircleOutlined,
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  ModalFacturasRadicadas,
  ModalCarguePlano,
  FooterTable,
} from "../../components";
import {
  TableColumnType,
  notification,
  InputNumber,
  DatePicker,
  Typography,
  InputRef,
  Button,
  Input,
  Modal,
  Space,
  Form,
  Spin,
  Col,
  Row,
} from "antd";

const { Text } = Typography;

export const ListRadicacion = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [openModalCarguePlano, setOpenModalCarguePlano] =
    useState<boolean>(false);
  const [openModalFacturasRadicadas, setOpenModalFacturasRadicadas] =
    useState<boolean>(false);
  const [detalle, setDetalle] = useState<DataType[]>([]);
  const [facturasRadicadas, setFacturasRadicadas] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, contextHolderModal] = Modal.useModal();
  const { arrayBufferToString } = useArrayBuffer();
  const searchInput = useRef<InputRef>(null);
  const control = useForm({
    defaultValues: {
      cta_radicado: "",
      nro_radicado: "",
      nit: "",
      fecha_radicado: undefined,
      total: 0,
      facturas: [],
    },
  });

  useEffect(() => {
    control.setValue("facturas", detalle as any);
    const totalSelect: number = detalle.reduce((accumulador, item) => {
      return accumulador + parseFloat(item.total);
    }, 0);
    control.setValue("total", totalSelect);
  }, [detalle]);

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
          style={{ marginBottom: 8, display: "block" }}
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<DataType> = [
    {
      key: "fecha_facturacion",
      dataIndex: "fecha_facturacion",
      title: "Fecha Facturacion",
      align: "center",
      width: 140,
    },
    {
      key: "numero_factura_vta",
      dataIndex: "numero_factura_vta",
      title: "Numero de FVE",
      align: "center",
      width: 140,
      ...getColumnSearchProps("numero_factura_vta"),
    },
    {
      key: "consecutivo",
      dataIndex: "consecutivo",
      title: "Consecutivo",
      align: "center",
      width: 140,
      ...getColumnSearchProps("consecutivo"),
    },
    {
      key: "cta_radicado",
      dataIndex: "cta_radicado",
      title: "Cta de Radicado",
      align: "center",
      width: 140,
    },
    {
      key: "descripcion",
      dataIndex: "descripcion",
      title: "Descripcion",
      ...getColumnSearchProps("descripcion"),
    },
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
      align: "center",
      width: 160,
      render(value) {
        return <>$ {parseFloat(value).toLocaleString("es-CO")}</>;
      },
    },
  ];

  const clearValues = () => {
    setDetalle([]);
    setLoading(false);
    control.reset();
  };

  const getPlantilla = (plantilla: string) => {
    setLoading(true);
    Modal.destroyAll();
    downloadTemplate(plantilla)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", plantilla);
        document.body.appendChild(link);
        link.click();
      })
      .catch(({ response: { data } }) => {
        const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
        notificationApi.open({
          type: "error",
          message: message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = (data: any) => {
    setLoading(true);
    radicacion(data)
      .then(() => {
        notificationApi.open({
          type: "success",
          message: `Radicación guardada con exito con exito!`,
        });
        setTimeout(() => {
          clearValues();
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
          setLoading(false);
        }
      );
  };

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <ModalCarguePlano
        open={openModalCarguePlano}
        setOpen={(value: boolean) => {
          setOpenModalCarguePlano(value);
        }}
        data_formulario={control.getValues()}
        setDetalle={(items) => {
          setDetalle(items);
          control.setValue("nit", items[0].nit);
        }}
        setFacturas={(items: Item[]) => {
          setOpenModalCarguePlano(false);
          setOpenModalFacturasRadicadas(true);
          setFacturasRadicadas(items);
        }}
      />
      <ModalFacturasRadicadas
        open={openModalFacturasRadicadas}
        setOpen={(value: boolean) => {
          setOpenModalFacturasRadicadas(value);
          setFacturasRadicadas([]);
          clearValues();
        }}
        facturas={facturasRadicadas}
      />
      <Spin spinning={loading}>
        <StyledCard title={"Radicar"}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form
                layout="vertical"
                onFinish={control.handleSubmit(onFinish)}
                onKeyDown={(e: any) =>
                  e.key === "Enter" ? e.preventDefault() : null
                }
                disabled={detalle.length > 0}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12} lg={8}>
                    <Controller
                      control={control.control}
                      name="cta_radicado"
                      rules={{
                        required: {
                          value: true,
                          message:
                            "Cuenta de Radicado o Número de Factura es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem
                          required
                          label="Cuenta de Radicado o Número de Factura:"
                        >
                          <Input
                            {...field}
                            status={error && "error"}
                            placeholder="Cuenta de Radicado o Número de Factura"
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <StyledFormItem label="Cargue por plano:">
                      <Space.Compact style={{ width: "100%" }}>
                        <Button
                          icon={<DownloadOutlined />}
                          block
                          onClick={() => {
                            modal.confirm({
                              title:
                                "Selecciona la plantilla que deseas descargar",
                              icon: <QuestionCircleFilled />,
                              content:
                                "Debes seleccionar la plantilla de acuerdo a la necesidad, si es cargue de radicado por factura o radicado por cuenta.",
                              footer: [
                                <Button
                                  key={`download-button-factura`}
                                  type="primary"
                                  style={{ margin: 5 }}
                                  onClick={() => {
                                    getPlantilla(
                                      "ExampleUploadPorFactura.csv"
                                    );
                                  }}
                                >
                                  Radicado por factura
                                </Button>,
                                <Button
                                  key={`download-button-cuenta`}
                                  type="primary"
                                  style={{ margin: 5 }}
                                  onClick={() => {
                                    getPlantilla("ExampleUploadPorCuenta.csv");
                                  }}
                                >
                                  Radicado por cuenta
                                </Button>,
                              ],
                            });
                          }}
                        >
                          Plantilla
                        </Button>
                        <Button
                          type="primary"
                          size="middle"
                          icon={<UploadOutlined />}
                          block
                          onClick={() => setOpenModalCarguePlano(true)}
                        >
                          Cargar
                        </Button>
                      </Space.Compact>
                    </StyledFormItem>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12} lg={6}>
                    <Controller
                      control={control.control}
                      name="nro_radicado"
                      rules={{
                        required: {
                          value: true,
                          message: "Número de Radicado es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Número de Radicado:">
                          <Input
                            {...field}
                            placeholder={"Número de Radicado"}
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <Controller
                      control={control.control}
                      name="fecha_radicado"
                      rules={{
                        required: {
                          value: true,
                          message: "Fecha de radicado es requerida",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label={"Fecha de Radicado:"}>
                          <DatePicker
                            {...field}
                            placeholder="Fecha de Radicado"
                            status={error && "error"}
                            style={{ width: "100%" }}
                            format={"YYYY-MM-DD"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <Controller
                      control={control.control}
                      name="nit"
                      rules={{
                        required: {
                          value: true,
                          message: "Nit es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Nit:">
                          <Input
                            {...field}
                            placeholder="Nit"
                            status={error && "error"}
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <Controller
                      control={control.control}
                      name="total"
                      rules={{
                        required: {
                          value: true,
                          message: "Total es requerido",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <StyledFormItem required label="Total:">
                          <InputNumber
                            {...field}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            }
                            status={error && "error"}
                            style={{ width: "100%" }}
                            disabled
                          />
                          <Text type="danger">{error?.message}</Text>
                        </StyledFormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={24} style={{ marginTop: 15 }}>
                    <Col>{`Número de facturas: ${detalle.length} `}</Col>
                    <Table
                      bordered
                      columns={columns}
                      dataSource={detalle}
                      size="small"
                      scroll={{ x: 1100 }}
                      footer={() => <FooterTable data={detalle} />}
                    />
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col
                    span={24}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <Space>
                      <Button
                        type="primary"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => clearValues()}
                        disabled={false}
                      >
                        Cancelar
                      </Button>
                      <Button
                        htmlType="submit"
                        type="primary"
                        icon={<SaveOutlined />}
                        disabled={detalle.length == 0}
                      >
                        Guardar Radicado
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </StyledCard>
      </Spin>
    </>
  );
};
