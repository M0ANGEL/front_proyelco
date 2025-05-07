import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";
import { radicarMasivo } from "@/services/radicacion/radicacionAPI";
import { Item } from "../ModalCarguePlano/types";
import { ColumnsType } from "antd/es/table";
import { Props } from "./types";
import { useRef, useState } from "react";
import {
  CloseCircleOutlined,
  SearchOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  TableColumnType,
  notification,
  InputRef,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Col,
  Row,
  Spin,
} from "antd";
import { ErroresPlano } from "@/services/types";
import { ModalErroresPlano } from "../ModalErroresPlano";

export const ModalFacturasRadicadas = ({ open, setOpen, facturas }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [erroresPlano, setErroresPlano] = useState<ErroresPlano[]>([]);
  const [openModalErroresPlano, setOpenModalErroresPlano] =
    useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const searchInput = useRef<InputRef>(null);

  const clearValues = () => {
    setOpen(false);
  };

  const getColumnSearchProps = (
    dataIndex: keyof Item
  ): TableColumnType<Item> => ({
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
    onFilter: (value, record) => {
      let nestedValue = "";
      switch (dataIndex) {
        case "factura_info_consecutivo":
          nestedValue = record.factura_info?.dispensacion?.consecutivo || "";
          break;

        case "factura_info_convenio":
          nestedValue = record.factura_info?.convenio?.descripcion || "";
          break;

        case "factura_info_total":
          nestedValue = record.factura_info?.total?.toString() || "";
          break;

        default:
          nestedValue = record[dataIndex]?.toString() || "";
          break;
      }

      return nestedValue
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
  });

  const columns: ColumnsType<Item> = [
    {
      title: "Numero Radicado",
      key: "numero_radicado",
      dataIndex: "numero_radicado",
      align: "center",
      width: 140,
      ...getColumnSearchProps("numero_radicado"),
    },
    {
      title: "Consecutivo",
      key: "consecutivo",
      dataIndex: "consecutivo",
      align: "center",
      width: 140,
      render(
        _,
        {
          factura_info: {
            dispensacion: { consecutivo },
          },
        }
      ) {
        return consecutivo;
      },
      ...getColumnSearchProps("factura_info_consecutivo"),
    },
    {
      title: "Factura",
      key: "factura",
      dataIndex: "factura",
      align: "center",
      width: 140,
      ...getColumnSearchProps("factura"),
    },
    {
      title: "Fecha Radicado",
      key: "fecha_radicado",
      dataIndex: "fecha_radicado",
      align: "center",
      width: 140,
      ...getColumnSearchProps("fecha_radicado"),
    },
    {
      title: "Convenio",
      key: "convenio",
      dataIndex: "convenio",
      render(
        _,
        {
          factura_info: {
            convenio: { descripcion },
          },
        }
      ) {
        return descripcion;
      },
      ...getColumnSearchProps("factura_info_convenio"),
    },
    {
      title: "Valor",
      key: "valor",
      dataIndex: "valor",
      align: "center",
      width: 160,
      render(_, { factura_info: { total, dispensacion } }) {
        const valor_total =
          parseFloat(total) -
          (dispensacion.valor ? parseFloat(dispensacion.valor) : 0);
        return <>$ {valor_total.toLocaleString("es-CO")}</>;
      },
    },
  ];

  const saveRadicados = () => {
    try {
      setLoader(true);
      const data = {
        facturas: facturas.map((factura) => {
          return {
            factura: factura.factura,
            fecha_radicado: factura.fecha_radicado,
            numero_radicado: factura.numero_radicado,
            factura_info: {
              id: factura.factura_info.id,
              total: factura.factura_info.total,
              convenio: {
                nit: factura.factura_info.convenio.nit,
              },
            },
          };
        }),
      };
      radicarMasivo(data)
        .then(() => {
          notificationApi.open({
            type: "success",
            message: "Radicados guardados exitosamente",
          });
          clearValues();
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
              if (response.data.errores) {
                setErroresPlano(response.data.errores);
                setOpenModalErroresPlano(true);
              }
            }
          }
        )
        .finally(() => setLoader(false));
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  return (
    <>
      {contextHolder}
      <ModalErroresPlano
        open={openModalErroresPlano}
        setOpen={(value: boolean) => {
          setErroresPlano([]);
          setOpenModalErroresPlano(value);
        }}
        errores={erroresPlano}
      />
      <Modal
        open={open}
        onCancel={() => {
          clearValues();
        }}
        title="Facturas a radicar"
        footer={[
          <Button
            danger
            key={`cancel-button-radicados`}
            type="primary"
            style={{ margin: 5 }}
            icon={<CloseCircleOutlined />}
            onClick={() => {
              clearValues();
            }}
            disabled={loader}
          >
            Cancelar
          </Button>,
          <Button
            key={`confirm-button-radicados`}
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => {
              saveRadicados();
            }}
            disabled={loader}
          >
            Guardar Radicados
          </Button>,
        ]}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={1200}
        style={{ top: 5 }}
      >
        <Spin spinning={loader}>
          <Row gutter={[12, 12]}>
            <Col>{`Número de facturas: ${facturas.length}`}</Col>
            <Col xs={24} sm={24}>
              <Table
                rowKey={(record) => record.factura}
                bordered
                size="small"
                columns={columns}
                dataSource={facturas}
                scroll={{ x: 1100 }}
                pagination={{
                  simple: true,
                  pageSize: 10,
                  hideOnSinglePage: true,
                  showSizeChanger: false,
                }}
                footer={() => {
                  const total: number = facturas.reduce(
                    (accumulador, item) =>
                      accumulador +
                      (parseFloat(item.factura_info.total) -
                        (item.factura_info.dispensacion.valor
                          ? parseFloat(item.factura_info.dispensacion.valor)
                          : 0)),
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
            <Col xs={24}>
              <ExportExcel
                excelData={facturas.map((item) => ({
                  Numero_Radicado: item.numero_radicado,
                  Consecutivo: item.factura_info.dispensacion.consecutivo,
                  Factura: item.factura,
                  Fecha_Radicado: item.fecha_radicado,
                  Convenio: item.factura_info.convenio.descripcion,
                  Valor:
                    parseFloat(item.factura_info.total) -
                    (item.factura_info.dispensacion.valor
                      ? parseFloat(item.factura_info.dispensacion.valor)
                      : 0),
                }))}
                fileName={"ErroresPlano"}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>
    </>
  );
};
