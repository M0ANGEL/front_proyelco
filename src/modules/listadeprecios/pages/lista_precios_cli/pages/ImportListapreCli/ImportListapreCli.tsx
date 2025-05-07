import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, SaveOutlined, UploadOutlined, CheckOutlined, ArrowLeftOutlined, PlusOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
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
  InputNumber,
  Modal,
  notification,
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
import { getDataImportCli } from "@/services/maestras/listaPreciosAPI";
import './styles.css';
import { getNitTercero } from "@/services/salud/conveniosTipoAPI";
import { SearchBar } from "../ListaPreciosCli/styled";


const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ImportListapreCli = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loader, setLoader] = useState<boolean>(false);
  const { getSessionVariable } = useSessionStorage();
  const methods = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [notificationApi] = notification.useNotification();


  const [, setLoaderSave] = useState<boolean>(true);
  const [fileList, setFileList] = useState([]);
  //const [priceList, setPriceList] = useState([]);
  const [excelData, setExcelData] = useState([]);
  // const [emptyRows, setEmptyRows] = useState<number[]>([]); // Almacena los índices de las filas vacías
  const [emptyRows, setEmptyRows] = useState<number[]>([]); // Estado para almacenar los índices de las filas vacías
  const [editingRow, setEditingRow] = useState(null);
  const [priceList, setPriceList] = useState<ListaPrecios[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchCodeNit, setSearchCodeNit] = useState('');
  const [searchNameNit, setSearchNameNit] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsListNit, setResultsListNit] = useState<SelectProps["options"]>([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [idNit, setIdNit] = useState({});
  const [value, setValue] = useState<string>("");
  const [selectedNit, setSelectedNit] = useState('');
  const [selectedNomNit, setSelectedNomNit] = useState('');
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchNitTercero();
  }, []);

  const fetchNitTercero = (query = "", page = 1) => {
    getNitTercero(page, query)
      .then(({ data: { data } }) => {
        // setPagination(data);
        const nitList = data.map((item) => {
          return {
            id: item.id.toString(),
            code: item.nit,
            name: item.razon_soc
          };
        });
        setResultsListNit(nitList);

        console.log('nit===> ', nitList);
        // setDataSource(pacientes);
        // setLoadingRow([]);
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
              notificationApi.open({
                type: "error",
                message: error,
                duration: 4,
              });
            }
          } else {
            notificationApi.open({
              type: "error",
              message: response.data.message,
              duration: 4,
            });
          }
        }
      )
      .finally(() => {
        // setLoaderTable(false);
      });
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoader(true);

        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(jsonData);

        const productos = jsonData.slice(1).reduce((acc, row, index) => {
          const [codigo, precio] = row;
          const hasEmptyField = row.some((field) => !field); // Verificar si hay algún campo vacío en la fila
          if (hasEmptyField) {
            setEmptyRows((prevEmptyRows) => [...prevEmptyRows, index]); // Agregar el índice de la fila vacía al estado emptyRows
          }

          const existingIndex = acc.findIndex((item) => item.codigo === codigo);

          if (existingIndex !== -1) {
            // Reemplazar la fila existente con la última fila
            acc[existingIndex] = { codigo, precio, hasEmptyField };
          } else {
            acc.push({ codigo, precio, hasEmptyField });
          }

          return acc;
        }, []);


        // se itera sobre los productos y se realiza la petición al backend para obtener la descripción del producto
        // const producto_descripcion = await Promise.all(
        //   productos.map(async (producto) => {
        //     const { codigo } = producto;

        //     // Realizar la petición al backend para obtener la descripción
        //     try {
        //       const response = await getProducto(codigo);
        //       console.log("res", response)
        //       const descripcion = response.data.data.descripcion;

        //       // se agrega la descripción al objeto del producto
        //       return { ...producto, desc: descripcion };

        //     } catch (error) {
        //       console.error(`Error al obtener descripción para el código ${codigo}:`, error);
        //       // En caso de error, puedes manejarlo de acuerdo a tus necesidades
        //       return producto;
        //     }
        //   })
        // );
        setLoader(false);

        // setPriceList(producto_descripcion);
        setPriceList(productos);

        // Actualiza el estado para indicar que se ha cargado un archivo
        setFileUploaded(true);

        // Limpia la lista de archivos anteriorG
        setFileList([info.file]);

        // Restablece el estado de fileUploaded después de 3 segundos (3000 milisegundos)
        setTimeout(() => {
          setFileUploaded(false);
        }, 3000);

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

      const columnIdentifiers = ['codigo_producto', 'precio']; //Identificadores válidos para le backend
      // Validar campos vacíos en las filas
      const productos = priceList.map((row, rowIndex) => {
        const { codigo, nit, precio } = row;

        // Convertir el campo precio a un número decimal
        // const precioDecimal = parseFloat(precio);

        if (!codigo || !precio) {
          hasEmptyFields = true;
          setEmptyRows((prevEmptyRows: number[]) => [...prevEmptyRows, rowIndex]);
          return { codigo, precio, isEmpty: true };
        }
        return row;
      });

      if (hasEmptyFields) {
        message.error('Hay campos vacíos en la tabla. Por favor, completa todos los campos.');
        return;
      }

      const payload = [{ listName: listName, listDes: listDes, nit: idNit }, ...productos]

      // Antes de enviar la solicitud al backend, activa el loader
      setLoader(true);

      getDataImportCli(payload)
        .then(() => {
          setLoader(false);
          message.open({
            type: "success",
            content: `Importación exitosa!`,
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
                message.open({
                  type: "error",
                  content: error,
                });
              }
            } else {
              message.open({
                type: "error",
                content: response.data.message,
              });
            }
            setLoader(false);
          }
        );

      // console.log(response.data);

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
    if (lastLine && (lastLine.codigo === '' || lastLine.precio === '')) {
      message.error('No se puede agregar una nueva línea si la línea anterior tiene campos vacíos.');
      return;
    }
    const newLine = { codigo: '', precio: '', hasEmptyField: true };
    setPriceList((prevPriceList) => [...prevPriceList, newLine]);
    setEditingIndex(priceList.length); // Establecer el índice de la fila recién agregada

  };

  const handleSearch = () => {
    const filteredResults = resultsListNit.filter(
      (item) =>
        item.code.includes(searchCodeNit) &&
        item.name.toLowerCase().includes(searchNameNit.toLowerCase())
    );
    console.log('filter=> ', filteredResults)
    setSearchResults(filteredResults);
    setCurrentPage(1);
    setModalVisible(true);
    setSearchNameNit(''); // Restablecer el valor de searchNameNit
    setSearchCodeNit('');
  };

  const columnsNit = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

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
    // {
    //   title: 'Descripción',
    //   dataIndex: 'desc',
    //   key: 'desc',
    //   align: 'center',
    //   render: (text: string, record: any, index: number) =>
    //     editingIndex === index ? (
    //       <Input
    //         value={record.nit}
    //         onChange={(e) => {
    //           const updatedProduct = { ...record, desc: e.target.value };
    //           const updatedList = [...priceList];
    //           updatedList.splice(index, 1, updatedProduct);
    //           setPriceList(updatedList);
    //         }}
    //       />
    //     ) : (
    //       text
    //     ),
    // },
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
            {/* <Button onClick={() => handleEdit(index)}>Editar</Button>
            <span style={{ marginRight: "8px" }}></span> Espacio de 8 píxeles */}
            <Button onClick={() => handleDelete(index)} danger>
              <DeleteOutlined />
            </Button>
          </>
        ),
    },
  ];

  const handleLineSelect = (line) => {
    setSelectedLine(line);
    setModalVisible(false);
    setSearchCodeNit(line.code);
    setSearchNameNit(line.name);
    setIdNit(line.code);

    setSelectedNit(line.code); // Guarda el NIT seleccionado
    setSelectedNomNit(line.name); // Guarda el nombre del NIT seleccionado
  };

  const customPaginationTexts = {
    // Personaliza el texto para el selector de tamaño de página
    items_per_page: '/ Página',
  };

  const filteredTableData = resultsListNit?.filter((o: any) =>
    Object.keys(o).some((k) =>
      String(o[k]).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const { Title, Text } = Typography;
  return (
    <>
      <Spin
        spinning={loader}
        indicator={
          <LoadingOutlined spin style={{ fontSize: 40, color: "#f4882a" }} />
        }
        style={{ backgroundColor: "rgb(251 251 251 / 70%)" }}
      >

        <StyledCard
          className="styled-card-documents"
          title={
            <Title level={4}>
              <UploadOutlined /> Importar Lista de Precios

            </Title>
          }
        >
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
                  <Input placeholder="Ingrese el nombre de la lista" showCount maxLength={30} />
                </StyledFormItem>
              </Col>
              <Col span={12}>
                <StyledFormItem
                  label="Archivo .xlsx, .xls:"
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

                    {/* <Button icon={<UploadOutlined />} type="primary" >
                      Subir Archivo
                    </Button> */}
                    <Button
                      icon={<UploadOutlined />}
                      type={fileUploaded ? 'success' : 'primary'} // Cambia el color del botón a verde si se ha cargado un archivo
                    >
                      {fileUploaded ? 'Archivo Cargado' : 'Subir Archivo'}
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
                  <Input.TextArea placeholder="Ingrese la descripción de la lista" showCount maxLength={50} />
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
              <Col span={12}>
                <StyledFormItem required label="Nit Terceror:">
                  <Space.Compact style={{ width: "100%" }}>
                    <>
                      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}></Button>
                      <Modal
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        title="Búsqueda Nit"
                      >
                        <SearchBar>
                          <Input placeholder="Buscar" onChange={(e) => setSearchText(e.target.value)} />
                        </SearchBar>
                        <Table
                          // dataSource={getPaginatedData()}
                          dataSource={filteredTableData}
                          columns={columnsNit}
                          rowKey="id"
                          onRow={(record) => ({
                            onClick: () => handleLineSelect(record),
                          })}
                          pagination={{
                            showTotal: (total: number) => {
                              return (
                                <>
                                  <Text>Total Registros: {total}</Text>
                                </>
                              );
                            },
                            showSizeChanger: true,
                            locale: customPaginationTexts,

                          }}
                        />
                      </Modal>
                    </>
                    <>
                      <Controller
                        name="nit"
                        control={methods.control}
                        render={({ field }) => (
                          <Space>
                            <Input
                              {...field}
                              placeholder="Nit"
                              // value={convenio ? convenio[0].nit : searchCodeNit}
                              value={selectedNit}
                              // onChange={(e) => setSearchCodeNit(e.target.value)}
                              onChange={(e) => setSelectedNit(e.target.value)}
                              style={{ textAlign: "center", maxWidth: 150 }}
                            />
                          </Space>
                        )}
                      />
                      <Input
                        value={"-"}
                        disabled
                        style={{ textAlign: "center", maxWidth: 40 }}
                      />
                      <Controller
                        name="nom_nit"
                        control={methods.control}
                        render={({ field }) => (
                          <Space>
                            <Input
                              {...field}
                              placeholder="Nombre"
                              // value={convenio ? convenio[0].razon_soc : searchNameNit}
                              // onChange={(e) => setSearchNameNit(e.target.value)}
                              value={selectedNomNit} // Usar el nombre del NIT seleccionado
                              onChange={(e) => setSelectedNomNit(e.target.value)} // Actualizar el estado en caso de cambios manuales
                            />
                          </Space>
                        )}
                      />
                    </>
                  </Space.Compact>
                </StyledFormItem>
              </Col>
            </Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "right", marginTop: "20px", marginBottom: "20px" }}
            >
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={priceList.length === 0}
                >
                  <SaveOutlined />
                  Guardar
                </Button>
                <Button onClick={handleAddLine} icon={<PlusOutlined />} style={{ border: '2px solid orange', padding: '3px', }} disabled={priceList.length === 0}>Agregar línea</Button>
              </Space>

            </Col>
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

            {/* <Row gutter={16}>
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
          </Row> */}

            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
            >
              <Space>
                <Link to={".."} relative="path">
                  <Button type="primary" icon={<ArrowLeftOutlined />} danger>
                    Volver
                  </Button>
                </Link>
                {/* <Button
                  type="primary"
                  htmlType="submit"
                  disabled={priceList.length === 0}
                >
                  <SaveOutlined />
                  Guardar
                </Button>
                <Button onClick={handleAddLine} icon={<PlusOutlined />} style={{ border: '2px solid orange', padding: '3px', }} disabled={priceList.length === 0}>Agregar línea</Button> */}
              </Space>
            </Col>
          </Form>
          {contextHolder}
        </StyledCard>
      </Spin>
    </>
  );
};
