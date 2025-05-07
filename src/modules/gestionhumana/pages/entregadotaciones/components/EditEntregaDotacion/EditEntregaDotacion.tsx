import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
  Upload,
  UploadFile,
  message,
} from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { EntregaDotacion } from "@/services/types";
import dayjs from "dayjs";

const { Text } = Typography;
interface DatosBasicosProps {
  selectDotacion: SelectProps["options"];
  selectEmpleado: SelectProps["options"];
  entregaDotacion?: EntregaDotacion;
}

const dateFormat = "DD/MM/YYYY";

export const EditEntregaDotacion = ({
  selectDotacion,
  selectEmpleado,
  entregaDotacion,
}: DatosBasicosProps) => {
  const methods = useFormContext();
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (entregaDotacion) {
      methods.setValue("empleado_id", entregaDotacion.empleado_id);
      methods.setValue("dotacion_id", entregaDotacion.dotacione_id);
      methods.setValue("cantidad", entregaDotacion.cantidad);
      methods.setValue("fecha_entrega", dayjs(entregaDotacion.fecha_entrega));
      methods.setValue("observacion", entregaDotacion.observacion);
      setLoader(false);
    }
  }, [entregaDotacion]);

  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
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
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectEmpleado}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="dotacion_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dotación es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dotación">
              <Spin spinning={loader} indicator={<LoadingOutlined spin />}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .localeCompare(
                        (optionB?.label ?? "").toString().toLowerCase()
                      )
                  }
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toString().toLowerCase())
                  }
                  options={selectDotacion}
                  status={error && "error"}
                />
              </Spin>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cantidad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Cantidad es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cantidad">
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
            <StyledFormItem label="Observación">
              <TextArea
                {...field}
                placeholder="Observación"
                status={error && "error"}
                autoSize={{ minRows: 4, maxRows: 6 }}
                maxLength={250}
                showCount
              />

              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="documento"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Documento soporte (PDF)">
              <Upload
                fileList={fileList}
                beforeUpload={(file) => {
                  const isPDF = file.type === "application/pdf";
                  if (!isPDF) {
                    message.error("Solo puedes subir archivos PDF.");
                  }
                  return isPDF || Upload.LIST_IGNORE;
                }}
                maxCount={1}
                onChange={(info) => {
                  handleChange(info);
                  field.onChange(info.fileList);
                }}
                onRemove={() => {
                  setFileList([]);
                  field.onChange([]);
                }}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
              </Upload>
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
