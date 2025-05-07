/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import {
  DollarCircleOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  Typography,
  Col,
  Form,
  Row,
  Input,
  Button,
  Space,
  Spin,
  Table,
  Tooltip,
  DatePicker,
  UploadProps,
  notification,
} from "antd";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DataType } from "./types";
import { ListaPrecios } from "@/services/types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getInfoDetLPC,
  getInfoLPC,
  updateLPC,
  updateDLPC,
  createLPC,
  deleteItemLP,
} from "@/services/maestras/listaPreciosAPI";
import "./styles.css";
import { Popconfirm } from "@/../node_modules/antd/es/index";
import { CustomUpload } from "./styled";
import { BASE_URL } from "@/config/api";
import { downloadTemplate } from "@/services/documentos/iaAPI";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";

const { Title, Text } = Typography;

export const EditListapreCli = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [priceList, setPriceList] = useState<ListaPrecios[]>([]);
  const [guardarDisabled, setGuardarDisabled] = useState(true);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [isListNameEmpty, setListNameEmpty] = useState(false);
  const [isListDescEmpty, setListDescEmpty] = useState(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");
  const { arrayBufferToString } = useArrayBuffer();
  const [accion, setAccion] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const [datef, setDatef] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const control = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const accion = id
      ? url_split[url_split.length - 2]
      : url_split[url_split.length - 1];

    setAccion(accion);
    if (id) {
      fetchPerfiles(id);
    }
  }, [id]);

  const fetchPerfiles = (id: string) => {
    setLoader(true);
    getInfoLPC(id).then(({ data }: any) => {
      control.setValue("listName", data.codigo);
      control.setValue("listDes", data.descripcion);
      control.setValue("nit", data.nit);
      const fecha = dayjs(data.created_at).format("DD/MM/YYYY");
      control.setValue("fecha", fecha);
      setDatef(fecha);

      getInfoDetLPC(id)
        .then(({ data }: any) => {
          const listaPre = data.map((listaPre: any) => {
            return {
              key: listaPre.id,
              codigo: listaPre.codigo,
              descripcion: listaPre.descripcion,
              precio: listaPre.precio,
            };
          });
          setEditingIndex(listaPre);
          setTableData(data);
        })
        .finally(() => setLoader(false));
    });
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    try {
      const updatedProduct = priceList[data];

      // Obtener el valor del input listName
      const listName = form.getFieldValue("listName");
      const listDes = form.getFieldValue("listDes");

      setEditingIndex(null);

      // Validar campos vacíos en las filas
      const productos = priceList.map((row) => {
        const { codigo, descripcion, precio } = row;
        if (!codigo || !descripcion || !precio) {
          return { codigo, descripcion, precio, isEmpty: true };
        }
        return row;
      });

      if (editingIndex !== null) {
        // Guardar la fila editada en el estado priceList
        const updatedList = [...priceList];
        updatedList[editingIndex] = updatedProduct;
        setPriceList(updatedList);
        setEditingIndex(null);
      }

      const modifiedRows = tableData.filter(
        (row: any) => row.flag_newRow === 1
      );
      const dataToSend = modifiedRows.map((row) => ({
        //id: row.key,
        codigo: row.codigo,
        descripcion: row.descripcion,
        precio: row.precio,
        flag_newRow: 1,
      }));

      const payload = {
        listName: listName,
        listDes: listDes,
        productos: productos,
      };

      if (id) {
        setLoader(true);
        updateLPC(data, id);
        updateDLPC(dataToSend, id)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: "Lista precios modificada con éxito!",
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
                  notificationApi.open({
                    type: "error",
                    message: error,
                  });
                }
              } else {
                notificationApi.open({
                  type: "error",
                  message: response.data.message,
                });
              }
              setGuardarDisabled(false);
              setLoader(false);
            }
          );
      } else {
        createLPC(payload)
          .then(() => {
            notificationApi.open({
              type: "success",
              message: "Lista de precios creada con éxito!",
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
                  notificationApi.open({
                    type: "error",
                    message: error,
                  });
                }
              } else {
                notificationApi.open({
                  type: "error",
                  message: response.data.message,
                });
              }

              setLoader(false);
            }
          );
      }

      // ...
    } catch (error) {
      console.error(error);
      // Manejar errores
    }
    setGuardarDisabled(true); // Deshabilitar el botón "Guardar" después de guardar los datos
  };

  const handleDeleteRow = (index: any, record: any) => {
    setLoader(true);

    if (record.flag_newRow === 1) {
      // Si es una fila nueva sin datos, simplemente elimínala de la tabla
      const updatedData = tableData.filter((_, i) => i !== index);
      setTableData(updatedData);
      setLoader(false);
    } else {
      // Si es una fila con datos existentes, realiza la eliminación en el servidor y luego actualiza la tabla
      deleteItemLP({
        id: id,
        producto_id: record.codigo,
      })
        .then(() => {
          const updatedData = tableData.filter((_, i) => i !== index);
          setTableData(updatedData);
          notificationApi.open({
            type: "success",
            message: "Producto eliminado con éxito!",
          });
        })
        .catch(
          ({
            response,
            response: {
              data: { errors },
            },
          }) => {
            if (errors) {
              const errores = Object.values(errors);

              for (const error of errores) {
                notificationApi.open({
                  type: "error",
                  message: `${error}`,
                });
              }
            } else {
              notificationApi.open({
                type: "error",
                message: response.data.message,
              });
            }
          }
        )
        .finally(() => {
          setLoader(false);
        });
    }
  };

  const newRow = {
    codigo: "",
    descripcion: "",
    precio: "",
    flag_newRow: 1,
  };

  const handleAddRow = () => {
    const filteredDataCopy: any = [newRow, ...filteredTableData];
    setSearchText("");
    setTableData(filteredDataCopy);
  };

  const handleInputChange = (index: any, value: any) => {
    const updatedData = [...tableData];
    updatedData[index].codigo = value;
    setTableData(updatedData);
    setGuardarDisabled(value === "");
  };

  const handleUpdateCab = (value: any) => {
    setGuardarDisabled(false);

    if (value.trim() === "") {
      setListNameEmpty(true);
      setGuardarDisabled(true);
    } else {
      setListNameEmpty(false);
      setGuardarDisabled(false);
    }
  };

  const handleUpdateDesc = (value: any) => {
    setGuardarDisabled(false);

    if (value.trim() === "") {
      setListDescEmpty(true);
      setGuardarDisabled(true);
    } else {
      setListDescEmpty(false);
      setGuardarDisabled(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={record.codigo}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder={"Ingrese un código de producto"}
        />
      ),
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      align: "center",
      render: (_, record, index) => (
        <Input
          value={record.descripcion}
          placeholder={"Ingrese alguna descripción"}
          onChange={(e) => {
            const updatedRow = { ...record, descripcion: e.target.value };
            const updatedData = [...tableData];
            updatedData.splice(index, 1, updatedRow);
            setTableData(updatedData);
            // setGuardarDisabled(false); // Habilitar el botón "Guardar" al editar el valor
          }}
        />
      ),
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      align: "center",
      render: (_, record, index) => (
        <Input
          placeholder={"0"}
          value={record.precio}
          prefix={<DollarCircleOutlined style={{ color: "rgba(0,0,0,.25)" }} />} // Agregar el ícono del signo de pesos
          onChange={(e) => {
            const updatedRow = { ...record, precio: e.target.value };
            const updatedData = [...tableData];
            updatedData.splice(index, 1, updatedRow);
            setTableData(updatedData);
            // setGuardarDisabled(false); // Habilitar el botón "Guardar" al editar el valor
          }}
        />
      ),
    },
    {
      title: "Acción",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      fixed: "left",
      width: 100,
      render: (_, record, index) => (
        <Space>
          <Popconfirm
            title="¿Desea eliminar este item?"
            onConfirm={() => {
              handleDeleteRow(index, record);
            }}
            placement="left"
            //disabled={!canDelete}
          >
            <Tooltip title="Regresar Item">
              <Button
                danger
                type="primary"
                size={"small"}
                icon={<DeleteOutlined />}
                //disabled={!canDelete}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredTableData = searchText
    ? tableData.filter(
        (record) =>
          record.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
          record.descripcion.toLowerCase().includes(searchText.toLowerCase())
      )
    : tableData;

  const uploadProps: UploadProps = {
    name: "productos",
    action: `${BASE_URL}listapreDetCli/cargar-productos`,
    data: { lista_precio_id: id },
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".xlsx",
    showUploadList: false,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file) {
      const isExcel =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        notificationApi.open({
          type: "error",
          message: "Solo se admite el formato .xlsx",
          duration: 20,
        });
      }
      return isExcel;
    },
    onChange(info) {
      setLoader(true);
      if (info.file.status !== "uploading") {
        // setDetalle([]);
        // setInitialData([]);
      }
      if (info.file.status === "removed") {
        setLoader(false);
      }
      if (info.file.status === "done") {
        setLoader(false);
        if (id) {
          fetchPerfiles(id);
        }
        notificationApi.open({
          type: "success",
          message: info.file.response.message,
          duration: 20,
        });
      } else if (info.file.status === "error") {
        setLoader(false);
        notificationApi.open({
          type: "error",
          message: info.file.response.message,
          duration: 20,
        });
      }
    },
  };

  return (
    <StyledCard
      className="styled-card-documents"
      title={
        <Title level={4}>
          <UploadOutlined /> Editar Lista de Precios
        </Title>
      }
    >
      <Spin spinning={loader}>
        <>
          <Form
            layout="vertical"
            form={form}
            onFinish={control.handleSubmit(onFinish)}
          >
            <Row gutter={24}>
              <Col span={12} style={{ marginBottom: "12px" }}>
                <Controller
                  name="listName"
                  control={control.control}
                  render={({ field }) => (
                    <StyledFormItem
                      label="Nombre de Lista de Precios:"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingresa el nombre de la lista de precios",
                        },
                      ]}
                    >
                      <Input
                        {...field}
                        placeholder="Ingrese el nombre de la lista"
                        onChange={(e) => {
                          field.onChange(e.target.value); // Use this to trigger the change event
                          handleUpdateCab(e.target.value);
                        }}
                      />
                      {isListNameEmpty && (
                        <Text type="danger">
                          * Éste campo no puede estar vacío.
                        </Text>
                      )}
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
                          required: true,
                          message: "Por favor escoge un proveedor",
                        },
                      ]}
                    >
                      <Input disabled={true} {...field} />
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
                  render={({ field }) => (
                    <StyledFormItem
                      label="Descripción:"
                      rules={[
                        {
                          required: true,
                          message:
                            "Por favor ingresa la descripción de la lista de precios",
                        },
                      ]}
                    >
                      <Input.TextArea
                        {...field}
                        placeholder="Ingrese la descripción de la lista"
                        onChange={(e) => {
                          field.onChange(e.target.value); // Use this to trigger the change event
                          handleUpdateDesc(e.target.value);
                        }}
                      />
                      {isListDescEmpty && (
                        <Text type="danger">
                          * Éste campo no puede estar vacío.
                        </Text>
                      )}
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
                        <Input {...field} value={datef} readOnly />
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
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  block
                  onClick={() => {
                    setLoader(true);
                    downloadTemplate(`ExampleProductosLP.xlsx`)
                      .then((response) => {
                        const url = window.URL.createObjectURL(
                          new Blob([response.data])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `ExampleProductosLP.xlsx`
                        ); // Utiliza el nombre del archivo proporcionado
                        document.body.appendChild(link);
                        link.click();
                      })
                      .catch(({ response: { data } }) => {
                        const message = arrayBufferToString(data).replace(
                          /[ '"]+/g,
                          " "
                        );
                        notificationApi.open({
                          type: "error",
                          message: message,
                        });
                      })
                      .finally(() => setLoader(false));
                  }}
                >
                  Descargar plantilla
                </Button>
                <CustomUpload {...uploadProps}>
                  <Button
                    type="primary"
                    size="middle"
                    icon={<UploadOutlined />}
                    block
                  >
                    Cargar Precios x Plano
                  </Button>
                </CustomUpload>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={guardarDisabled}
                >
                  <SaveOutlined />
                  Guardar
                </Button>
                <Button
                  onClick={handleAddRow}
                  icon={<PlusOutlined style={{ color: "orange" }} />}
                  style={{ border: "2px solid orange", padding: "3px" }}
                >
                  <Tooltip title="Limpia la barra de búsqueda para agregar una línea">
                    Agregar Línea
                  </Tooltip>
                </Button>
              </Space>
            </Col>
            <Row>
              <Col span={24}>
                <Input
                  placeholder="Buscar por código o descripción"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={
                    <SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  style={{ marginBottom: "16px" }}
                />
                <Table
                  size="small"
                  scroll={{ y: 300 }}
                  pagination={{
                    simple: false,
                  }}
                  dataSource={filteredTableData}
                  columns={columns}
                />

                <Col
                  span={24}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Space>
                    <Link to={"../.."} relative="path">
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        danger
                      >
                        Volver
                      </Button>
                    </Link>
                  </Space>
                </Col>
              </Col>
            </Row>
          </Form>

          {contextHolder}
        </>
      </Spin>
    </StyledCard>
  );
};
