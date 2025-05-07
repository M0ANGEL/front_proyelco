/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Modal, Row, Input, Table, Space, Button } from "antd";
import { DataType, Props } from "./types";
import { useEffect, useState } from "react";
import { getConceptosFact } from "@/services/facturacion/conceptosFactAPI";
import { ColumnsType } from "antd/es/table";

export const ModalConceptosMaestra = ({
  open,
  setOpen,
  handleSelectConcepto,
}: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loaderTable, setLoaderTable] = useState<boolean>(true);

  useEffect(() => {
    getConceptosFact().then(({ data: { data } }) => {
      const conceptos: DataType[] = [];

      data.forEach((concepto) => {
        if (concepto.estado == "1") {
          conceptos.push({
            key: concepto.id,
            concepto: concepto.descripcion,
          });
        }
      });

      setInitialData(conceptos);
      setDataSource(conceptos);
      setLoaderTable(false);
    });
  }, [open]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setDataSource(filterTable);
  };

  const clearModal = () => {
    setOpen(false);
    setDataSource([]);
    setInitialData([]);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      sorter: (a, b) => a.concepto.localeCompare(b.concepto),
    },
    {
      title: "Acciones",
      width: 130,
      align: "center",
      render(_, { concepto }) {
        return (
          <>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  handleSelectConcepto(concepto);
                  clearModal();
                }}
                size="small"
              >
                Seleccionar
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Conceptos"
        open={open}
        onCancel={() => clearModal()}
        destroyOnClose
        footer={[]}
        maskClosable={false}
        width={700}
        style={{ top: 20 }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Input
              type="primary"
              onChange={handleSearch}
              placeholder="Buscar Producto"
            />
          </Col>
          <Col span={24}>
            <Table
              size="small"
              columns={columns}
              dataSource={dataSource == null ? initialData : dataSource}
              pagination={{ pageSize: 7, simple: false }}
              loading={loaderTable}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
