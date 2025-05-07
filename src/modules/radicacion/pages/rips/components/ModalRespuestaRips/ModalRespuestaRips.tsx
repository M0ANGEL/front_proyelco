/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Table,
  Typography,
} from "antd";
// import { buscarProducto } from "@/services/maestras/productosAPI";
import { DataType, Props } from "./types";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import * as XLSX from 'xlsx';
// import { StyledText } from "./styled";

const { Search } = Input;
const { Text } = Typography;

export const ModalRespuestaRips = ({ open, setOpen, onSetDataSource, dataResponse }: Props) => {



  const columns: ColumnsType<any> = [
    {
      title: "Factura",
      dataIndex: "NumFactura",
      key: "NumFactura",
      align: "center",
      width: 100,
    },
    {
      title: "Codigo CUV",
      dataIndex: "CodigoUnicoValidacion",
      key: "CodigoUnicoValidacion",
      // sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
    },
    {
      title: "Rechazos",
      dataIndex: "ResultadosValidacion",
      key: "ResultadosValidacion",
      render: (text, dataResponse) => {
        return (
          <div>
            {dataResponse.dataResponse || []
              .filter((resultado: any) => resultado.Clase === 'RECHAZADO')
              .map((resultado: any, index: any) => {
                const { Clase, Codigo, Descripcion, Observaciones } = resultado;
                return (
                  <div key={index}>
                    <p>Código: {Codigo}</p>
                    <p>Descripción: {Descripcion}</p>
                    {/* <p>Observaciones: {Observaciones}</p> */}
                    <hr />
                  </div>
                );
              })}
          </div>
        );
      },
    },
    {
      title: "Notificaciones",
      dataIndex: "ResultadosValidacion",
      key: "ResultadosValidacion",
      render: (text, record) => {
        return (
          <div>
            {record.ResultadosValidacion || []
              .filter((resultado: any) => resultado.Clase === 'NOTIFICACION')
              .map((resultado: any, index: any) => {
                const { Clase, Codigo, Descripcion, Observaciones } = resultado;
                return (
                  <div key={index}>
                    <p>Código: {Codigo}</p>
                    <p>Descripción: {Descripcion}</p>
                    {/* <p>Observaciones: {Observaciones}</p> */}
                    <hr />
                  </div>
                );
              })}
          </div>
        );
      },
    },

  ];
  const downloadExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(dataResponse);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'Resultados.xlsx');
  };

  return (
    <Modal
      open={open}
      footer={[
        <Button
          key={"btnCancelar"}
          type="primary"
          danger
          onClick={() => {
            setOpen(false);
            onSetDataSource([]);
          }}
        >
          Cancelar
        </Button>,
        <Button
          key={"btnDescarga"}
          type="primary"
          onClick={downloadExcel}
        >
          Descargar
        </Button>,
      ]}
      destroyOnClose
      maskClosable={false}
      closable={false}
      width={900}
      style={{ top: 20 }}
      key="modalProductos"
    >
      <Row>
        <Divider style={{ marginBlock: 15 }} />
        <Col span={24}>
          <Table
            // rowKey={(record) => record.key}
            size="small"
            dataSource={dataResponse}
            columns={columns}
            scroll={{ y: 300 }}
            pagination={{
              simple: true,
            }}
            bordered
          />
        </Col>
      </Row>
    </Modal>
  );
};
