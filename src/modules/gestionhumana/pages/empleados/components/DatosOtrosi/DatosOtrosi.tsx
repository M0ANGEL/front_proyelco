import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { EditOutlined } from "@ant-design/icons";
import { Props } from "../types";
import { SearchBar } from "../../pages/ListEmpleados/styled";
import { getOtrosis } from "@/services/gestion-humana/otrosiAPI";
import { ColumnsType } from "antd/es/table";

const dateFormat = "DD/MM/YYYY";
const { Text } = Typography;
interface DataType {
  key: number;
  empleado: string;
  rh_convenio: string;
  contrato_laboral: string;
  cargo: string;
  salario: string;
  old_rh_convenio: string;
  old_contrato_laboral: string;
  old_cargo: string;
  old_salario: string;
  fecha_otrosi: string;
  user_created: string;
  user_updated: string;
}

export const DatosOtrosi = ({ empleado }: Props) => {
  const methods = useFormContext();
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    if (empleado) {
      fetchOtrosis(empleado.id);
    }
    setLoading(false);
  }, [empleado]);

  const fetchOtrosis = (id: number) => {
    getOtrosis(id).then(({ data: { data } }) => {
      const otrosis: DataType[] = data.map((otrosi) => {
        return {
          key: otrosi.id,
          empleado: otrosi.empleado,
          rh_convenio: otrosi.rh_convenio,
          contrato_laboral: otrosi.contrato_laboral,
          cargo: otrosi.cargo,
          salario: otrosi.salario,
          old_rh_convenio: otrosi.old_rh_convenio_id,
          old_contrato_laboral: otrosi.old_contrato_laborale_id,
          old_cargo: otrosi.old_cargo_id,
          old_salario: otrosi.old_salario,
          fecha_otrosi: otrosi.fecha_otrosi,
          user_created: otrosi.user_created,
          user_updated: otrosi.user_updated,
        };
      });
      setInitialData(otrosis);
      setDataSource(otrosis);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Empleado",
      dataIndex: "empleado",
      key: "empleado",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Convenio",
      dataIndex: "rh_convenio",
      key: "rh_convenio",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Tipo Contrato",
      dataIndex: "contrato_laboral",
      key: "contrato_laboral",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Salario",
      dataIndex: "salario",
      key: "salario",
      render: (text) => {
        return new Intl.NumberFormat("es-ES").format(text);
      },
    },
    {
      title: "Convenio anterior",
      dataIndex: "old_rh_convenio",
      key: "old_rh_convenio",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Tip_Contra_Anterior",
      dataIndex: "old_contrato_laboral",
      key: "old_contrato_laboral",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Cargo anterior",
      dataIndex: "old_cargo",
      key: "old_cargo",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
      title: "Salario anterior",
      dataIndex: "old_salario",
      key: "old_salario",
      render: (text) => {
        return new Intl.NumberFormat("es-ES").format(text);
      },
    },
    {
      title: "Fecha Otrosi",
      dataIndex: "fecha_otrosi",
      key: "fecha_otrosi",
    },
    {
      title: "Creado",
      dataIndex: "user_created",
      key: "user_created",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 20 ? `${text.substring(0, 20)}...` : text}
          </Tooltip>
        ) : null,
    },
    {
        title: "Actualizado",
        dataIndex: "user_updated",
        key: "user_updated",
        render: (text) =>
          text ? (
            <Tooltip title={text}>
              {text.length > 20 ? `${text.substring(0, 20)}...` : text}
            </Tooltip>
          ) : null,
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
  ];

  return (
    empleado ? (
      <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_otrosi"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                label={<span style={{ color: 'red' }}>Fecha Otrosí / Registrar solo si está creando un otrosí.</span>}
              >
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  format={dateFormat}
                  placeholder="Fecha Otrosi"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>

      <StyledCard
        title={"Lista de otrosí"}
        // extra={
        //   <Link to={`${location.pathname}/create`}>
        //     <Button type="primary">Crear</Button>
        //   </Link>
        // }
      >
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>

        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          scroll={{ x: 1600 }}
          dataSource={dataSource ?? initialData}
          columns={columns}
          loading={loading}
          pagination={{
            total: initialData?.length,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ["5", "15", "30"],
            showTotal: (total: number) => {
              return <Text>Total Registros: {total}</Text>;
            },
          }}
          bordered
        />
      </StyledCard>
    </>
    ) : null
  );
};
