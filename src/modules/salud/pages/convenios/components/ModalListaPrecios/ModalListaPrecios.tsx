/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBar } from "@/modules/common/components/FormDocuments/styled";
import { getListapreCli } from "@/services/salud/conveniosTipoAPI";
import { Col, Input, Modal, Row, Table } from "antd";
import { ListaPrecios } from "@/services/types";
import { useEffect, useState } from "react";
import { Props } from "./types";

export const ModalListaPrecios = ({ open, setOpen, handleSelectLP }: Props) => {
  const [initialData, setInitialData] = useState<ListaPrecios[]>([]);
  const [dataSource, setDataSource] = useState<ListaPrecios[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setDataSource([]);
      setInitialData([]);
      setLoader(true);
      getListapreCli().then(({ data: { data } }) => {
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
        keyboard={false}
        onCancel={() => {
          setOpen(false);
        }}
        maskClosable={false}
        destroyOnClose={true}
        title="Listas De Precios"
      >
        <Row gutter={12}>
          <Col span={24}>
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
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  align: "center",
                  width: 100,
                },
                {
                  title: "Codigo",
                  dataIndex: "codigo",
                  key: "codigo",
                  align: "center",
                },
                {
                  title: "Descripción",
                  dataIndex: "descripcion",
                  key: "descripcion",
                },
              ]}
              rowKey="id"
              onRow={({ id, descripcion }) => ({
                onClick: () => handleSelectLP(id.toString(), descripcion),
              })}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
