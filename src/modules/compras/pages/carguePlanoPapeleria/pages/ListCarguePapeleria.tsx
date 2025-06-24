import { useState } from "react";
import {
  UploadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import {
  Upload,
  Spin,
  Typography,
  notification,
  Button,
  Card,
  Space,
  Modal,
} from "antd";
import * as XLSX from "xlsx";
import { BASE_URL } from "@/config/api";
import { DescargaPlantillaPapeleria } from "../components/DescargarPlantilla";

const { Text } = Typography;

type DataType = {
  key: string;
  codigo_insumo: string;
  insumo_descripcion: string;
  unidad: string;
  mat_requerido: string;
  agrupacion_descripcion: number;
  nombre_tercero: number;
};

export const ListCarguePapeleria = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [erroresPlano, setErroresPlano] = useState<string[]>([]);
  const [openModalErrores, setOpenModalErrores] = useState<boolean>(false);

  const handleExcelUpload = (file: File) => {
    setLoader(true);
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map((item, index) => ({
          key: `${index}`,
          codigo_insumo: item.codigo_insumo || "",
          insumo_descripcion: item.insumo_descripcion || "",
          unidad: item.unidad || "",
          mat_requerido: item.mat_requerido || "",
          agrupacion_descripcion: item.agrupacion_descripcion || "",
          nombre_tercero: item.nombre_tercero || "",
        }));

        setDataSource(formattedData);
        setFileToUpload(file);
        setPreviewMode(true);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        notificationApi.error({
          message: "Error al procesar el archivo",
          description: "El formato del archivo no es válido",
          duration: 5,
        });
      }
    };

    reader.onerror = () => {
      setLoader(false);
      notificationApi.error({
        message: "Error al leer el archivo",
        duration: 5,
      });
    };

    reader.readAsArrayBuffer(file);
    return false; // Evita que se suba automáticamente
  };

  const handleConfirmUpload = async () => {
    if (!fileToUpload) return;

    setLoader(true);
    const formData = new FormData();
    formData.append("archivo", fileToUpload);

    try {
      const response = await fetch(`${BASE_URL}papeleria/archivo-plano`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok && response.status === 300) {
        throw new Error(data.message || "Error al subir el archivo");
      }

      if (data.errores && data.errores.length > 0) {
        setErroresPlano(data.errores);
        setOpenModalErrores(true);
        notificationApi.warning({
          message: "Archivo subido con errores",
          description: "Revise el modal para ver los detalles",
          duration: 5,
        });
      } else {
        notificationApi.success({
          message: "Archivo subido exitosamente",
          description: `Se han cargado ${dataSource.length} registros`,
          duration: 5,
        });
      }

      setPreviewMode(false);
      setDataSource([]);
      setFileToUpload(null);
    } catch (error: any) {
      notificationApi.error({
        message: "Error al subir el archivo",
        description: error.message,
        duration: 5,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleCancelUpload = () => {
    setPreviewMode(false);
    setDataSource([]);
    setFileToUpload(null);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Código",
      dataIndex: "codigo_insumo",
      key: "codigo_insumo",
    },
    {
      title: "Descripcion",
      dataIndex: "insumo_descripcion",
      key: "insumo_descripcion",
    },
    { title: "Unidad", dataIndex: "unidad", key: "unidad"},
    { title: "mat_requerido", dataIndex: "mat_requerido", key: "mat_requerido" },
    { title: "agrupacion_descripcion", dataIndex: "agrupacion_descripcion", key: "agrupacion_descripcion" },
    {
      title: "Tercero",
      dataIndex: "nombre_tercero",
      key: "nombre_tercero",
    },
  ];

  return (
    <>
      {contextHolder}
      <Card title="Cargue archivo de Cotizaciones">
        <Spin spinning={loader}>
          {!previewMode ? (
            <>
              <Upload
                accept=".xlsx"
                beforeUpload={handleExcelUpload}
                showUploadList={false}
              >
                <Button type="primary" icon={<UploadOutlined />}>
                  Seleccionar Archivo Excel
                </Button>
              </Upload>

              <DescargaPlantillaPapeleria />
            </>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>
                  Vista previa de los datos ({dataSource.length} registros)
                </Text>
                <Text type="secondary" style={{ marginLeft: 16 }}>
                  Revise los datos antes de confirmar el cargue
                </Text>
              </div>

              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1500 }}
                bordered
                rowKey="key"
                size="small"
              />

              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleConfirmUpload}
                >
                  Confirmar y Subir Archivo
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancelUpload}
                >
                  Cancelar Cargue Archivo
                </Button>
              </Space>
            </Space>
          )}
        </Spin>
      </Card>

      {/* Modal de Errores */}
      <Modal
        title="Errores en el archivo"
        open={openModalErrores}
        onCancel={() => setOpenModalErrores(false)}
        footer={[
          <Button key="close" onClick={() => setOpenModalErrores(false)}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {erroresPlano.map((error, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <Text type="danger">• {error}</Text>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
