import React, { useState } from 'react';
import { Form, DatePicker, Button, Select, Spin, Typography, notification, Space } from 'antd';
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import {
  LoadingOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const FormAUD = () => {
  const [form] = Form.useForm();
  const [closedDocuments, setClosedDocuments] = useState([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const handleFormSubmit = (values) => {
    // Aquí debes enviar los datos al backend (Laravel) para cerrar o abrir documentos
    // y guardar la fecha y el usuario que realizó la acción.

    // Luego, actualiza el estado de los documentos cerrados.
    setClosedDocuments([...closedDocuments, values]);

    // Mostrar notificación de éxito o error
    notificationApi.open({
      message: values.documentType === 'cerrar' ? "Documentos cerrados" : "Documentos abiertos",
      description: `Los documentos han sido ${values.documentType === 'cerrar' ? 'cerrados' : 'abiertos'} con éxito.`,
      icon: values.documentType === 'cerrar' ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
    });
  };

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  return (
    <Spin spinning={loader} indicator={<LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />} style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}>
    {contextHolder}
    <StyledCard className="styled-card-documents" title={<Title level={4}>{"Control de Vencimientos  "}
          </Title>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Title level={4}>Control de Vencimientos</Title>
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <Form.Item
              name="documentType"
              label="Selecciona una acción"
              rules={[{ required: true, message: 'Por favor selecciona una acción' }]}
            >
              <Select placeholder="Selecciona una acción">
                <Option value="cerrar">Cerrar Documentos</Option>
                <Option value="abrir">Abrir Documentos</Option>
              </Select>
            </Form.Item>
            <div>
              <p>Rango de Fechas:</p>
              <RangePicker onChange={handleDateRangeChange} />
            </div>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                Ejecutar Acción
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
    </StyledCard>
  </Spin>
  );
};
