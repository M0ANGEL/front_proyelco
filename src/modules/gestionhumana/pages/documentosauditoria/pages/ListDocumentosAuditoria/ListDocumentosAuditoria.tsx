import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Tooltip, Typography } from "antd"
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled"
import { getDocumentoAuditorias } from "@/services/gestion-humana/documentoAuditoriaAPI"
import Table, { ColumnsType } from "antd/es/table"
import { EditOutlined } from "@ant-design/icons"

interface DataType {
  key: number;
  elaborado_por: string;
  cargo_elaboro: string;
  revisado_por: string;
  cargo_reviso: string;
  aprobado_por: string;
  cargo_aprobo: string;
}

const { Text } = Typography

export const ListDocumentosAuditoria = () => {

  const location = useLocation()
  const [initialData, setInitialData] = useState<DataType[]>([])
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [loading, setLoading] = useState<boolean>(true)


  const fetchDocumentosAuditoria = () => {
    getDocumentoAuditorias().then(({ data: { data } }) => {
      const documentoAuditorias = data.map((documentoAuditoria) => {
        return {
          key: documentoAuditoria.id,
          elaborado_por: documentoAuditoria.elaborado_por,
          cargo_elaboro: documentoAuditoria.cargo_elaboro,
          revisado_por: documentoAuditoria.revisado_por,
          cargo_reviso: documentoAuditoria.cargo_reviso,
          aprobado_por: documentoAuditoria.aprobado_por,
          cargo_aprobo: documentoAuditoria.cargo_aprobo,
        };
      });
      setInitialData(documentoAuditorias);
      setDataSource(documentoAuditorias);
      setLoading(false);
    });
  };


  useEffect(() => {
      fetchDocumentosAuditoria();
    }, []);
  
  const columns: ColumnsType<DataType> = [
    {
      title: "Elaborado por",
      dataIndex: "elaborado_por",
      key: "elaborado_por",
      sorter: (a, b) => a.elaborado_por.localeCompare(b.elaborado_por),
    },
    {
      title: "Cargo elaboró",
      dataIndex: "cargo_elaboro",
      key: "cargo_elaboro",
      sorter: (a, b) => a.cargo_elaboro.localeCompare(b.cargo_elaboro),
    },
    {
      title: "Revisado por",
      dataIndex: "revisado_por",
      key: "revisado_por",
      sorter: (a, b) => a.revisado_por.localeCompare(b.revisado_por),
    },
    {
      title: "Cargo revisó",
      dataIndex: "cargo_reviso",
      key: "cargo_reviso",
      sorter: (a, b) => a.cargo_reviso.localeCompare(b.cargo_reviso),
    },
    {
      title: "Aprobado por",
      dataIndex: "aprobado_por",
      key: "aprobado_por",
      sorter: (a, b) => a.aprobado_por.localeCompare(b.aprobado_por),
    },
    {
      title: "Cargo aprobó",
      dataIndex: "cargo_aprobo",
      key: "cargo_aprobo",
      sorter: (a, b) => a.cargo_aprobo.localeCompare(b.cargo_aprobo),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record: { key: React.Key }) => {
        return (
          <Tooltip title="Editar">
            <Link to={`${location.pathname}/edit/${record.key}`}>
              <Button icon={<EditOutlined />} type="primary" />
            </Link>
          </Tooltip>
        );
      },
    },
  ]

  return (
    <StyledCard
    title={"DOCUMENTO AUDITORIA"}
    >
      <Table
        className="custom-table"
        rowKey={(record) => record.key}
        size="small"
        dataSource={dataSource ?? initialData}
        columns={columns}
        loading={loading}
        pagination={{
          total: initialData?.length,
          showSizeChanger: true,
          defaultPageSize: 5,
          pageSizeOptions: ["5", "15", "30"],
          showTotal: (total: number) => {
            return (
              <Text>Total Registros: {total}</Text>
            );
          },
        }}
        bordered
      />
    </StyledCard>
  )
}
