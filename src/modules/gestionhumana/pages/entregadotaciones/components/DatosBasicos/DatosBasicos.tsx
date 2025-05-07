import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LoadingOutlined } from "@ant-design/icons";
import { getDotaciones } from "@/services/gestion-humana/dotacionesAPI";
import Table, { ColumnsType } from "antd/es/table";
import { SearchBar } from "../../../empleados/pages/ListEmpleados/styled";

interface Props {
  selectEmpleados: SelectProps["options"];
  id?: string;
  onSelectEmpleado: (idEmpleado: string) => void; 
}

interface DataType {
  key: number;
  id: number;
  tipo: string;
  talla: string;
  stock: string;
  cantidad?: number;
}

const { Text } = Typography;
const dateFormat = "DD/MM/YYYY";

export const DatosBasicos = ({ selectEmpleados, id, onSelectEmpleado  }: Props) => {
  const [loader, setLoader] = useState<boolean>(true);
  const methods = useFormContext();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  
  useEffect(() => {

    if (id) {
      methods.setValue('empleado_id', id);
    }
  }, [id])

  useEffect(() => {
    getDotaciones().then(({ data: { data } }) => {
      const dotaciones = data.map((dotacion, index) => {
        return {
          key: index,
          id: dotacion.id,
          tipo: dotacion.tipo,
          talla: dotacion.talla,
          stock: dotacion.stock,
        };
      });
      setInitialData(dotaciones);
      setDataSource(dotaciones);
      methods.setValue("dotacion", dotaciones);
      setLoader(false);
    });
  }, []);

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
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      sorter: (a, b) => a.tipo.localeCompare(b.tipo),
    },
    {
      title: "Talla",
      dataIndex: "talla",
      key: "talla",
      sorter: (a, b) => a.talla.localeCompare(b.talla),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock.localeCompare(b.stock),
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      render: (_, record) => (
        <Controller
          name={`dotacion.${record.key}.cantidad`}
          control={methods.control}
          rules={{
            validate: (value) => {
              if (parseInt(value) <= 0) {
                return "Cantidad devolución no puede ser menor o igual a 0";
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              maxLength={20}
              placeholder="Cantidad"
              status={error && "error"}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                field.onChange(value);
              }}
            />
          )}
        />
      ),
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="empleado_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Empleado es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Empleado">
                <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    filterSort={(optionA, optionB) => {
                      const labelA = typeof optionA?.label === "string" ? optionA.label.toLowerCase() : "";
                      const labelB = typeof optionB?.label === "string" ? optionB.label.toLowerCase() : "";
                      return labelA.localeCompare(labelB);
                    }}
                    filterOption={(input, option) =>
                      String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={selectEmpleados}
                    value={field.value || undefined} 
                    onChange={(value) => {
                      field.onChange(value); 
                      onSelectEmpleado(value);
                    }}
                    status={error ? "error" : undefined}
                    disabled={!!id} 
                  />
                </Spin>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_entrega"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha entrega es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha entrega">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  style={{ width: "100%" }}
                  // defaultValue={dayjs("01-01-2000", dateFormat)}
                  format={dateFormat}
                  placeholder="Fecha entrega"
                  // disabledDate={disabledDate}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="observacion"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem  label="Observación">
                <Input
                  {...field}
                  maxLength={80}
                  placeholder="Observación"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
      <StyledCard>
        <SearchBar>
          <Input placeholder="Buscar" onChange={handleSearch} />
        </SearchBar>
        <Table
          className="custom-table"
          rowKey={(record) => record.key}
          size="small"
          dataSource={dataSource ?? initialData}
          columns={columns}
          loading={loader}
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
  );
};
