/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExportExcel } from "@/modules/common/components/ExportExcel/ExportExcel";
import { RepConsultaDocumentos } from "@/services/types";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Col, Input, Row, Table, Typography } from "antd";
import { Props } from "./types";
import { SearchBar } from "@/modules/common/components/FormDocuments/styled";

const { Text } = Typography;

export const RepConsultaDocumentosTable = ({ documentos, fileName }: Props) => {
  const [dataSource, setDataSource] = useState<RepConsultaDocumentos[]>([]);
  const [initialData, setInitialData] = useState<RepConsultaDocumentos[]>([]);

  useEffect(() => {
    setDataSource(documentos);
    setInitialData(documentos);
  }, [documentos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<RepConsultaDocumentos> = [
    {
      title: "Documento Origen",
      key: "CONSECUTIVO_DOCUMENTO_ORIGEN",
      dataIndex: "CONSECUTIVO_DOCUMENTO_ORIGEN",
      width: 160,
      align: "center",
      sorter: (a, b) =>
        a.CONSECUTIVO_DOCUMENTO_ORIGEN.length -
        b.CONSECUTIVO_DOCUMENTO_ORIGEN.length,
    },
    {
      title: "Tipo Documento",
      key: "NOMBRE_TIPO_DOCUMENTO",
      dataIndex: "NOMBRE_TIPO_DOCUMENTO",
      width: 150,
      align: "center",
      sorter: (a, b) =>
        a.NOMBRE_TIPO_DOCUMENTO.length - b.NOMBRE_TIPO_DOCUMENTO.length,
    },
    {
      title: "Consecutivo Documento",
      key: "CONSECUTIVO_DOCUMENTO",
      dataIndex: "CONSECUTIVO_DOCUMENTO",
      width: 160,
      align: "center",
      sorter: (a, b) =>
        a.CONSECUTIVO_DOCUMENTO.length - b.CONSECUTIVO_DOCUMENTO.length,
    },
    {
      title: "Codigo Producto",
      key: "CODIGO_PRODUCTO",
      dataIndex: "CODIGO_PRODUCTO",
      width: 120,
      align: "center",
      sorter: (a, b) => a.CODIGO_PRODUCTO.length - b.CODIGO_PRODUCTO.length,
    },
    {
      title: "Nombre Producto",
      key: "NOMBRE_PRODUCTO",
      dataIndex: "NOMBRE_PRODUCTO",
      width: 400,
      sorter: (a, b) => a.NOMBRE_PRODUCTO.length - b.NOMBRE_PRODUCTO.length,
    },
    {
      title: "Cantidad Documento",
      key: "CANTIDAD_DOCUMENTO",
      dataIndex: "CANTIDAD_DOCUMENTO",
      width: 100,
      align: "center",
      sorter: (a, b) =>
        parseInt(a.CANTIDAD_DOCUMENTO) - parseInt(b.CANTIDAD_DOCUMENTO),
    },
    {
      title: "Observación Documento",
      key: "OBSERVACION_DOCUMENTO",
      dataIndex: "OBSERVACION_DOCUMENTO",
      sorter: (a, b) =>
        a.OBSERVACION_DOCUMENTO.length - b.OBSERVACION_DOCUMENTO.length,
    },
    {
      title: "Nombre Tercero",
      key: "NOMBRE_TERCERO",
      dataIndex: "NOMBRE_TERCERO",
      width: 180,
      align: "center",
      sorter: (a, b) => a.NOMBRE_TERCERO.length - b.NOMBRE_TERCERO.length,
    },
    {
      title: "Lote",
      key: "LOTE",
      dataIndex: "LOTE",
      width: 120,
      align: "center",
      sorter: (a, b) => a.LOTE.length - b.LOTE.length,
    },
    {
      title: "Observaciones Producto",
      key: "OBSERVACIONES_PRODUCTO",
      dataIndex: "OBSERVACIONES_PRODUCTO",
      width: 120,
      align: "center",
      sorter: (a, b) =>
        a.OBSERVACIONES_PRODUCTO.length - b.OBSERVACIONES_PRODUCTO.length,
    },
    {
      title: "Codigo Paciente",
      key: "CODIGO_PACIENTE",
      dataIndex: "CODIGO_PACIENTE",
      width: 120,
      align: "center",
      sorter: (a, b) =>
        parseInt(a.CODIGO_PACIENTE) - parseInt(b.CODIGO_PACIENTE),
    },
    {
      title: "Telefono Paciente",
      key: "TELEFONO_PACIENTE",
      dataIndex: "TELEFONO_PACIENTE",
      width: 120,
      align: "center",
      sorter: (a, b) =>
        parseInt(a.TELEFONO_PACIENTE) - parseInt(b.TELEFONO_PACIENTE),
    },
    {
      title: "Codigo Diagnostico",
      key: "CODIGO_DIAGNOSTICO",
      dataIndex: "CODIGO_DIAGNOSTICO",
      width: 120,
      align: "center",
      sorter: (a, b) =>
        a.CODIGO_DIAGNOSTICO.length - b.CODIGO_DIAGNOSTICO.length,
    },
    {
      title: "Primer Nombre",
      key: "PRIMER_NOMBRE",
      dataIndex: "PRIMER_NOMBRE",
      width: 120,
      sorter: (a, b) => a.PRIMER_NOMBRE.length - b.PRIMER_NOMBRE.length,
    },
    {
      title: "Segundo Nombre",
      key: "SEGUNDO_NOMBRE",
      dataIndex: "SEGUNDO_NOMBRE",
      width: 120,
      sorter: (a, b) => a.SEGUNDO_NOMBRE.length - b.SEGUNDO_NOMBRE.length,
    },
    {
      title: "Primer Apellido",
      key: "PRIMER_APELLIDO",
      dataIndex: "PRIMER_APELLIDO",
      width: 120,
      sorter: (a, b) => a.PRIMER_APELLIDO.length - b.PRIMER_APELLIDO.length,
    },
    {
      title: "Segundo Apellido",
      key: "SEGUNDO_APELLIDO",
      dataIndex: "SEGUNDO_APELLIDO",
      width: 120,
      sorter: (a, b) => a.SEGUNDO_APELLIDO.length - b.SEGUNDO_APELLIDO.length,
    },
    {
      title: "Fecha Documento",
      key: "FECHA_DOCUMENTO",
      dataIndex: "FECHA_DOCUMENTO",
      width: 120,
      align: "center",
      sorter: (a, b) => a.FECHA_DOCUMENTO.length - b.FECHA_DOCUMENTO.length,
    },
    {
      title: "Hora Documento",
      key: "HORA_DOCUMENTO",
      dataIndex: "HORA_DOCUMENTO",
      width: 120,
      align: "center",
      sorter: (a, b) => a.HORA_DOCUMENTO.length - b.HORA_DOCUMENTO.length,
    },
    {
      title: "Bodega Origen",
      key: "BODEGA_ORIGEN",
      dataIndex: "BODEGA_ORIGEN",
      width: 120,
      align: "center",
      sorter: (a, b) => a.BODEGA_ORIGEN.length - b.BODEGA_ORIGEN.length,
    },
    {
      title: "Usuario Elaboro",
      key: "USUARIO_ELABORO",
      dataIndex: "USUARIO_ELABORO",
      width: 120,
      align: "center",
      sorter: (a, b) => a.USUARIO_ELABORO.length - b.USUARIO_ELABORO.length,
    },
  ];

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col
          xs={{ span: 24 }}
          sm={{ offset: 7, span: 10 }}
          md={{ offset: 9, span: 6 }}
        >
          <ExportExcel
            excelData={documentos.map((item) => {
              delete item.CREATED_AT;
              delete item.ID_BODEGA_ORIGEN;
              delete item.ID_TIPO_DOCUMENTO;
              delete item.ID_TIPO_DOCUMENTO_ORIGEN;
              return item;
            })}
            fileName={fileName}
          />
        </Col>
        <Col span={24}>
          <SearchBar style={{ marginBottom: 0 }}>
            <Input placeholder="Buscar" onChange={handleSearch} />
          </SearchBar>
        </Col>
        <Col span={24}>
          <Table
            size="small"
            bordered
            scroll={{ x: 3500 }}
            dataSource={dataSource.map((item, index) => ({
              ...item,
              row: index,
            }))}
            columns={columns}
            pagination={{
              simple: false,
              showTotal: (total, range) => (
                <>
                  {`${range[0]}-${range[1]} de un total de `}
                  <Text type="warning" strong>
                    {total}
                  </Text>{" "}
                  registros
                </>
              ),
              locale: {
                items_per_page: "/ página",
                jump_to: "Ir a",
                page: "Página",
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};
