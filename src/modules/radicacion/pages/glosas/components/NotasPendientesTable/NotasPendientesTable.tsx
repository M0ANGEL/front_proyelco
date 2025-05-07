import { NotaCreditoFVEDisCabecera } from "@/services/types";
import { Alert, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Props } from "./types";

export const NotasPendientesTable = ({
  notasPendientes,
  loader,
  setNotaCreditoID,
}: Props) => {
  const columnsNotasPendientes: ColumnsType<NotaCreditoFVEDisCabecera> = [
    {
      title: "Consecutivo",
      dataIndex: "consecutivo",
      key: "consecutivo",
      align: "center",
      width: 140,
    },
    {
      title: "Numero Nota Crédito",
      dataIndex: "numero_nce",
      key: "numero_nce",
      align: "center",
      width: 140,
    },
    {
      title: "Estado",
      dataIndex: "status_code",
      key: "status_code",
      align: "center",
      width: 80,
    },
    {
      title: "Respuesta",
      dataIndex: "respuesta",
      key: "respuesta",
    },
    {
      title: "CUDE",
      dataIndex: "cufe",
      key: "cufe",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      fixed: "right",
      width: 100,
      align: "center",
      render(_, { id }) {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setNotaCreditoID(id.toString());
            }}
          >
            Solicitar
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Alert
        message="Alerta de Notas Crédito"
        description={`Tienes un total de ${notasPendientes.length} Notas Crédito sin CUDE efectivo, por favor solicitar de nuevo`}
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />
      <Table
        size="small"
        loading={loader}
        scroll={{ x: 1800 }}
        dataSource={notasPendientes}
        rowKey={(record) => record.id}
        columns={columnsNotasPendientes}
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};
