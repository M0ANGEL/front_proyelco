import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/trsAPI";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { DeleteOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
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
import { getDataImport, getInfoDetLP, getInfoLP, createLP, updateLP } from "@/services/maestras/listaPreciosAPI";
import './styles.css';
import { ModalProductos } from "../../components";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { Popconfirm } from "@/../node_modules/antd/es/index";


const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const FormListapre = () => {
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
  const [accion, setAccion] = useState<string>("");
  // const [, setFlagAcciones] = useState<boolean>(false);
  const [flagAcciones, setFlagAcciones] = useState<boolean>(false);
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [datef, setDatef] = useState("");
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [loadingRow, setLoadingRow] = useState<any>([]);

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    const codigo_documento = id
      ? url_split[url_split.length - 3]
      : url_split[url_split.length - 2];
    setLoader(true);

    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      )
        .then(({ data: { data } }) => {
          if (data) {
            const campos = data?.documento_info?.cabeceras?.map((item) => ({
              nombre_campo: item.campo.nombre_campo,
              id_campo: item.id_campo,
              estado: item.estado,
            }));
            setCamposEstados(campos);
            control.setValue("tipo_documento_id", data.documento_info.id);

            if (data.crear !== "1" && accion == "create") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para crear documento!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.modificar !== "1" && accion == "edit") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para modificar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.consultar !== "1" && accion == "show") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para consultar!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
            if (data.anular !== "1" && accion == "anular") {
              messageApi.open({
                type: "error",
                content: "No tienes permisos para anular!",
              });
              setTimeout(() => {
                navigate(
                  `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
                );
              }, 1500);
              return;
            }
          } else {
            messageApi.open({
              type: "error",
              content: "No tienes permisos para acceder a este documento!",
            });
            setTimeout(() => {
              navigate(`/${url_split.at(1)}`);
              setLoader(false);
            }, 1500);
          }
          setLoader(false);
        })
        .finally(() => {
          setLoader(false);
        });
    }

    if (id) {
      console.log("gooo2");
      //control.setValue("id_trs", id);
      getInfoDetLP(id)
        .then(({ data }) => {
          setTableData(data);
          console.log(response)
        })
        .catch(error => {
          console.error(error);
        });

     
      getInfoLP(id).then(({ data }) => {
        console.log("data ", data)

        control.setValue("listName", data.codigo);
        control.setValue("listDes", data.descripcion);
        control.setValue("nit", data.nit);

        control.setValue("estado", data.estado_label)

        const fecha = new Date(data.created_at);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        const fechaFormateada = `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${año}`;
        control.setValue("fecha", fechaFormateada)
        setDatef(fechaFormateada);

        //RECORDAR: formatear DataType, y campos
        const detalle: DataType[] = data.detalle.map((item) => {
          return {
            key: item.producto_id,
            codigo: item.codigo,
            descripcion: item.descripcion,
            precio: item.precio,
          };
        });
        control.setValue("detalle", detalle);
        //setSelectedProducts(detalle);
        setLoader(false);
      });
    }
  }
    , []);
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
      console.log(payload);
      //const response = await createLP(payload);

        createLP(payload)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Documento creado con exito!`,
            });
            setTimeout(() => {
              navigate(-1);
            }, 800);
          })
          .catch(
            ({
              response,
              response: {
                data: { errors },
              },
            }) => {
              if (errors) {
                const errores: string[] = Object.values(errors);

                for (const error of errores) {
                  messageApi.open({
                    type: "error",
                    content: error,
                  });
                }
              } else {
                messageApi.open({
                  type: "error",
                  content: response.data.message,
                });
              }

              setLoader(false);
            }
          );

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
    setEditingIndex(index);
    setEmptyRows([]); // Limpiar el estado de las filas vacías
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
      
            <Button onClick={handleCancelEdit} danger>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => handleEdit(index)}>Editar</Button>
            <Button onClick={() => handleDelete(index)}>Borrar</Button>
          </>
        ),
    },
  ];

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

  return (

    <StyledCard>
      {accion === "create" ? (
        <>
          <Typography.Title level={4}>Crear Lista de Precios</Typography.Title>
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


            </Row>
            <Divider children={<Text type="secondary">Detalle</Text>} />

            <Row gutter={16}>
              <Col span={24}>
                <Table
                  dataSource={priceList}
                  columns={columns}
                  pagination={false}
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
                    Guardar
                  </Button>
                  <Button onClick={handleAddLine}>Agregar línea</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {contextHolder}
        </>
      ) : (
        <>
          <Typography.Title level={4}>Lista de Precios</Typography.Title>
          <Divider />

          <Form layout="vertical" form={form} onFinish={handleSave}>
            <Row gutter={24}>
              <Col span={12} style={{ marginBottom: "12px" }}>
                <Controller

                  name="listName"
                  control={control.control}
                  render={({ field }) => (
                    <StyledFormItem
                      label="Nombre de la lista:"
                      rules={[
                        {
                          //required: true,
                          message: "Por favor ingresa el nombre de la lista de precios",
                        },
                      ]}
                    >
                      <Input {...field} placeholder="Ingrese el nombre de la lista" />

                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col span={12}>
                <Controller
                  name="nit"
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (

                    <StyledFormItem
                      label="Nit Proveedor:"

                      rules={[
                        {
                          //required: true,
                          message: "Por favor escoge un proveedor",
                        },
                      ]}
                    >
                      {accion === "create" ? (
                        <Input
                          {...field}
                        />



                      ) : (
                        <Input
                          {...field}
                          readOnly />
                      )}
                      <Text type="danger">{error?.message}</Text>

                    </StyledFormItem>
                  )}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12} style={{ marginBottom: "12px" }}>
                <Controller
                  name="listDes"
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (

                    <StyledFormItem
                      label="Descripción:"

                      rules={[
                        {
                          required: true,
                          message: "Por favor ingresa la descripción de la lista de precios",
                        },
                      ]}
                    >
                      <Input.TextArea
                        {...field}
                        placeholder="Ingrese la descripción de la lista" />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>

              <Col span={12}>
                <Controller
                  name="fecha"
                  control={control.control}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Fecha Realizado:">
                      {accion === "edit" ? (
                        <Input  {...field}
                          value={datef}
                          readOnly />
                      ) : (
                        <DatePicker
                          {...field}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          value={dayjs()}
                          disabled
                        />
                      )}
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </Row>
            <Divider children={<Text type="secondary">Detalle</Text>} />

            <Row gutter={16}>
              <Col span={24}>
                {accion === "edit" || accion == "show" ? (
                <Table
                    dataSource={tableData}
                  columns={columns}
                  pagination={{
                    total: initialData?.length,
                    showSizeChanger: true,
                    defaultPageSize: 5,
                    pageSizeOptions: ["5", "15", "30"],
                  }}
                    rowKey={(record) => record.codigo}
                    rowClassName={(record, index) => (emptyRows.includes(index) ? 'empty-row' : '')} // Agregar la clase 'empty-row' a las filas vacías
                  />
                ) : (
                  <Table
                    dataSource={priceList}
                    columns={columns}
                    pagination={{
                      simple: false,
                    }}
                    rowKey={(record) => record.codigo}
                    rowClassName={(record, index) => (emptyRows.includes(index) ? 'empty-row' : '')} // Agregar la clase 'empty-row' a las filas vacías
                />
                )}
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>

                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={priceList.length === 0}
                >
                  Guardar
                </Button>
                <Button onClick={handleAddLine}>Agregar línea</Button>

              </Col>
            </Row>
          </Form>
          {contextHolder}
        </>
      )}
    </StyledCard>
  );
};
