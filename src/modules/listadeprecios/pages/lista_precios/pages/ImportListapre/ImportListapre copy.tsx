import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/trsAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, SaveOutlined, UploadOutlined, CheckOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Col,
  Divider,
  Form,
  Row,
  message,
  Input,
  Button,
  Space,
  Spin,
  Table,
  Tooltip,
  Select,
  SelectProps,
  DatePicker,
  Upload,
  InputNumber
} from "antd";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType } from "./types";
import { Bodega, ListaPrecios, Traslados } from "@/services/types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import { getDataImport } from "@/services/maestras/listaPreciosAPI";
import './styles.css';


const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ImportListapre = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const control = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const [, setLoaderSave] = useState<boolean>(true);
  const [fileList, setFileList] = useState([]);
  //const [priceList, setPriceList] = useState([]);
  const [excelData, setExcelData] = useState([]);
  // const [emptyRows, setEmptyRows] = useState<number[]>([]); // Almacena los índices de las filas vacías
  const [emptyRows, setEmptyRows] = useState<number[]>([]); // Estado para almacenar los índices de las filas vacías
  const [editingRow, setEditingRow] = useState(null);
  const [priceList, setPriceList] = useState<ListaPrecios[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(jsonData);

        const productos = jsonData.slice(1).reduce((acc, row, index) => {
          const [codigo, nit, precio] = row;
          const hasEmptyField = row.some((field) => !field); // Verificar si hay algún campo vacío en la fila
          if (hasEmptyField) {
            setEmptyRows((prevEmptyRows) => [...prevEmptyRows, index]); // Agregar el índice de la fila vacía al estado emptyRows
          }

          const existingIndex = acc.findIndex((item) => item.codigo === codigo);

          if (existingIndex !== -1) {
            // Reemplazar la fila existente con la última fila
            acc[existingIndex] = { codigo, nit, precio, hasEmptyField };
          } else {
            acc.push({ codigo, nit, precio, hasEmptyField });
          }

          return acc;
        }, []);

        setPriceList(productos);

        // Realizar la petición al backend para importar los datos
        /*const response = await getDataImport(jsonData);
        console.log(response.data);
        if (response.data.status === 'bandera_fila') {
          message.error('Hay campos vacíos en la tabla. Por favor, completa todos los campos.');
          return;
        }*/

      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const handleUpload = () => {
    const productos = excelData.map((row) => {
      const [codigo, nit, precio] = row;
      return { codigo, nit, precio };
    });
    setPriceList(productos);
  };

  const handleSave = async (index: number) => {
    try {
      let hasEmptyFields = false; // Bandera para identificar filas con campos vacíos
      const updatedProduct = priceList[index];

      //Obtener el valor del input listName
      const listName = form.getFieldValue('listName');
      const listDes = form.getFieldValue('listDes');

      console.log(listName, "holaaa :D")
      if (!listName) {
        message.error('Por favor ingrese el nombre de la lista de precios');
        return;
      }

      console.log('Fila actualizada:', updatedProduct);

      setEditingIndex(null);

      const columnIdentifiers = ['codigo_producto', 'nit', 'precio']; //Identificadores válidos para le backend
      // Validar campos vacíos en las filas
      const productos = priceList.map((row, rowIndex) => {
        const { codigo, nit, precio } = row;
        if (!codigo || !nit || !precio) {
          hasEmptyFields = true;
          setEmptyRows((prevEmptyRows: number[]) => [...prevEmptyRows, rowIndex]);
          return { codigo, nit, precio, isEmpty: true };
        }
        return row;
      });

      if (hasEmptyFields) {
        message.error('Hay campos vacíos en la tabla. Por favor, completa todos los campos.');
        return;
      }

      // Construir el payload en el formato deseado
      /*const payload = productos.map((row) => {
        const { codigo, nit, precio } = row;
        return [codigo, nit, precio];
      });

      // Añadir los identificadores de columna en la primera posición del payload
      payload.unshift(columnIdentifiers);
*/
      const payload = [{ listName: listName, listDes: listDes, }, ...productos]
      // Realizar la petición al backend para importar los datos
      const response = await getDataImport(payload);
      console.log("en");
        
      if (response.data.status === 'success') {
        // Mostrar un mensaje de éxito
        console.log("en");
        messageApi.open({
          type: "success",
          content: `Importación exitosa!`,
        });
        setTimeout(() => {
          navigate(-1);
        }, 800);
        
      } else {
        // La llamada no fue exitosa, manejar el error según sea necesario
        message.error('Error en la importación');
        // ...
      }
      
      console.log(response.data);

      // ...
    } catch (error) {
      console.error(error);
      // Manejar errores
    }
  };

  const handleDelete = (index) => {
    // Verificar si la fila está en edición
    if (editingRow === index) {
      // Si la fila está en edición, guardar los cambios antes de eliminarla
      //handleSave();
    } else {
      // Si la fila no está en edición, eliminarla directamente
      const updatedPriceList = priceList.filter((_, i) => i !== index);
      setPriceList(updatedPriceList);
    }
  };

  const handleEdit = (index) => {
    //setEditingRow(index);
    setEditingIndex(index);
    setEmptyRows([]); // Limpiar el estado de las filas vacías
  };

  const handleFieldChange = (value, index, field) => {
    setPriceList((prevPriceList) =>
      prevPriceList.map((row, rowIndex) => {
        if (rowIndex === index) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const renderCell = (value: any, row: any, index: number, dataIndex: string) => {
    const isEditing = editingIndex === index;

    if (isEditing) {
      return (
        <Form.Item
          name={dataIndex}
          initialValue={value}
          rules={[
            {
              required: true,
              message: 'Este campo es obligatorio',
            },
          ]}
        >
          <InputNumber min={0} precision={2} />
        </Form.Item>
      );
    }

    return value;
  };

  const handleAddLine = () => {
    const lastLine = priceList[priceList.length - 1];
    if (lastLine && (lastLine.codigo === '' || lastLine.nit === '' || lastLine.precio === '')) {
      message.error('No se puede agregar una nueva línea si la línea anterior tiene campos vacíos.');
      return;
    }
    const newLine = { codigo: '', nit: '', precio: '', hasEmptyField: true };
    setPriceList((prevPriceList) => [...prevPriceList, newLine]);
    setEditingIndex(priceList.length); // Establecer el índice de la fila recién agregada

  };

  const columns: ColumnsType<any> = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      align: 'center',
      render: (text: string, record: any, index: number) =>
        editingIndex === index ? (
          <Input
            value={record.codigo}
            onChange={(e) => {
              const updatedProduct = { ...record, codigo: e.target.value };
              const updatedList = [...priceList];
              updatedList.splice(index, 1, updatedProduct);
              setPriceList(updatedList);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'NIT',
      dataIndex: 'nit',
      key: 'nit',
      align: 'center',
      render: (text: string, record: any, index: number) =>
        editingIndex === index ? (
          <Input
            value={record.nit}
            onChange={(e) => {
              const updatedProduct = { ...record, nit: e.target.value };
              const updatedList = [...priceList];
              updatedList.splice(index, 1, updatedProduct);
              setPriceList(updatedList);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      align: 'center',
      render: (text: string, record: any, index: number) =>
        editingIndex === index ? (
          <Input
            value={record.precio}
            onChange={(e) => {
              const updatedProduct = { ...record, precio: e.target.value };
              const updatedList = [...priceList];
              updatedList.splice(index, 1, updatedProduct);
              setPriceList(updatedList);
            }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record, index) =>
        editingIndex === index ? (
          <>
            <Button onClick={() => handleSave(index)} type="primary" style={{ background: '#91c990' }}
            className="hoverable-button">
            <CheckOutlined />
            </Button>
            <span style={{ marginRight: "8px" }}></span> {/* Espacio de 8 píxeles */}
            <Button onClick={handleCancelEdit} danger>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => handleEdit(index)}>Editar</Button>
            <span style={{ marginRight: "8px" }}></span> {/* Espacio de 8 píxeles */}
            <Button onClick={() => handleDelete(index)} danger>
            <DeleteOutlined />
            </Button>
          </>
        ),
    },
  ];

  return (
    <StyledCard>
      <Typography.Title level={3}>Importar Lista de Precios</Typography.Title>
      <Divider />

      <Form layout="vertical" form={form} onFinish={handleSave}>
        <Row gutter={24}>
          <Col span={12} style={{ marginBottom: "12px" }}>
            <StyledFormItem
              label="Nombre de la lista:"
              name="listName"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre de la lista de precios",
                },
              ]}
            >
              <Input placeholder="Ingrese el nombre de la lista" />
            </StyledFormItem>
          </Col>
          <Col span={12}>
            <StyledFormItem
              label="Archivo excel:"
              name="file"
              rules={[
                {
                  required: true,
                  message: "Por favor sube un archivo",
                },
              ]}
            >
              <Upload
                accept=".xlsx, .xls"
                multiple={false}
                fileList={fileList}
                onChange={(info) => {
                  setFileList(info.fileList);
                  handleFileChange(info); // Llamar a handleFileChange en el evento onChange
                }}
              >

                <Button icon={<UploadOutlined />} type="default" style={{ background: '#ffeac7' }}>
                  Subir archivo
                </Button>
              </Upload>
            </StyledFormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} style={{ marginBottom: "12px" }}>
            <StyledFormItem
              label="Descripción:"
              name="listDes"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la descripción de la lista de precios",
                },
              ]}
            >
              <Input.TextArea placeholder="Ingrese la descripción de la lista" />
            </StyledFormItem>
          </Col>

          <Col span={12}>
            <StyledFormItem label="Fecha Realizado:">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={dayjs()}
                disabled
              />

            </StyledFormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Table
              dataSource={priceList}
              columns={columns}
              pagination={{
                simple: false,
              }}
              rowKey={(record) => record.codigo}
              rowClassName={(record, index) => (emptyRows.includes(index) ? 'empty-row' : '')} // Agregar la clase 'empty-row' a las filas vacías
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={priceList.length === 0}
              >
                <SaveOutlined />
                Guardar
              </Button>
              <Button onClick={handleAddLine}>Agregar línea</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {contextHolder}
    </StyledCard>
  );
};
