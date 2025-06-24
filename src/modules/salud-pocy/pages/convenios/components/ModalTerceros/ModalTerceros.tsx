/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Props } from "./types";
import { Col, Input, Modal, Row, Table } from "antd";
import { getCLientesNIT } from "@/services/salud/conveniosTipoAPI";
import { SearchBar } from "@/modules/common/components/FormDocuments/styled";
import { AmClientes } from "@/services/types";

export const ModalTerceros = ({
  open,
  setOpen,
  handleSelectTercero,
}: Props) => {
  const [dataSource, setDataSource] = useState<AmClientes[]>([]);
  const [initialData, setInitialData] = useState<AmClientes[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setDataSource([]);
      setInitialData([]);
      setLoader(true);
      getCLientesNIT().then(({ data: { data } }) => {
        setDataSource(data);
        setInitialData(data);
        setLoader(false);
      });
    }
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

  return (
    <>
      <Modal
        open={open}
        footer={[]}
        width={800}
        title="Terceros"
        keyboard={false}
        onCancel={() => {
          setOpen(false);
        }}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Row gutter={12}>
          <Col span={24} style={{marginBottom: 10}}>
            <SearchBar>
              <Input
                placeholder="Buscar"
                onChange={handleSearch}
                disabled={loader}
              />
            </SearchBar>
          </Col>
          <Col span={24}>
            <Table
              size="small"
              dataSource={dataSource}
              loading={loader}
              columns={[
                { title: "Nit", dataIndex: "nit", key: "nit", align: "center" },
                {
                  title: "Cliente",
                  dataIndex: "emp_nombre",
                  key: "emp_nombre",
                },
              ]}
              rowKey="id"
              onRow={({ nit, emp_nombre }) => ({
                onClick: () => handleSelectTercero(nit.toString(), emp_nombre),
              })}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
