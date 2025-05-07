import { Button, Col, Modal, Row, Table } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";

export const ModalAlertasPlano = ({ open, setOpen, alertas }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  useEffect(() => {
    if (open && alertas.length > 0) {
      const data: DataType[] = alertas.map((item, index) => {
        return {
          key: index + 1,
          celda: `${item.columna}${item.fila}`,
          mensaje: item.message,
        };
      });
      setDataSource(data);
    }
  }, [open, alertas]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Nro.",
      key: "key",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Celda",
      key: "celda",
      dataIndex: "celda",
      align: "center",
    },
    {
      title: "Mensaje",
      key: "mensaje",
      dataIndex: "mensaje",
    },
  ];

  return (
    <Modal
      open={open}
      footer={[
        <Button
          danger
          type="primary"
          onClick={() => {
            setOpen(false, []);
          }}
          key={"cancelButton"}
        >
          No
        </Button>,
        <Button
          type="primary"
          key={"confirmButton"}
          onClick={() => {
            setOpen(false, alertas);
          }}
        >
          Si
        </Button>,
      ]}
      title={
        "Alertas Plano Productos - ¿Deseas cambiar los productos homologados?"
      }
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      closable={false}
      onCancel={() => {
        setOpen(false, []);
      }}
      width={800}
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24}>
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={dataSource}
            pagination={{ simple: false, pageSize: 10, hideOnSinglePage: true }}
          />
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <ExportExcel
            excelData={dataSource.map((item) => ({
              Nro: item.key,
              Celda: item.celda,
              Mensaje: item.mensaje,
            }))}
            fileName={"ErroresPlano"}
          />
        </Col>
      </Row>
    </Modal>
  );
};
