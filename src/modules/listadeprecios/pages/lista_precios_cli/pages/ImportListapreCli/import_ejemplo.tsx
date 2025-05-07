/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/trsAPI";
// import { getBodDestino } from "@/services/maestras/bodegasAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import { DeleteOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import * as XLSX from 'xlsx';
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
} from "antd";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CamposEstados, DataType } from "./types";
import { Bodega, Traslados } from "@/services/types";
import { getBodega, getBodegas } from "@/services/maestras/bodegasAPI";
import { crearTRS, updateTRS } from "@/services/documentos/trsAPI";
import { ModalProductos } from "../../components";
import { ColumnsType } from "antd/es/table";
// import { Notification } from "@/modules/auth/pages/LoginPage/types";
import dayjs from "dayjs";
import axios from "@/../node_modules/axios/index";



const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ImportListapre = () => {
  const [camposEstados, setCamposEstados] = useState<CamposEstados[]>();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [estadosVisibles] = useState<string[]>(["0", "2"]);
  const [messageApi, contextHolder] = message.useMessage();
  const [openFlag, setOpenFlag] = useState<boolean>(false);
  const [bodegaInfo, setBodegaInfo] = useState<Bodega>();
  const [loader, setLoader] = useState<boolean>(true);
  const { getSessionVariable } = useSessionStorage();
  const control = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [optionsBodegas, setOptionsBodegas] = useState<SelectProps["options"]>(
    []
  );
  const [selectedProducts, setSelectedProducts] = useState<DataType[]>([]);
  const [precioTotal, setPrecioTotal] = useState(0); // Estado para almacenar el valor total
  const [, setLoaderSave] = useState<boolean>(true);
  const [trasladosalida] = useState<Traslados>();
  // const [api, contextHolder] = notification.useNotification();
  // const [selectedDateTime, setSelectedDateTime] = useState();
  const { id } = useParams<{ id: string }>();
  const [, setAccion] = useState<string>("");
  // const [, setFlagAcciones] = useState<boolean>(false);
  const [fileList, setFileList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [listName, setListName] = useState('');
  const [excelData, setExcelData] = useState([]);
/*
  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };
*/
  const handleImport = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file.originFileObj);
    });
    /*
        axios
          .post('http://sebthi.backend.test/api/listapre/import', formData)
          .then((response) => {
            setPriceList(response.data.priceList);
            setListName(response.data.listName);
            message.success('Price list imported successfully.');
          })
          .catch((error) => {
            message.error('Failed to import price list.');
          });*/
          
  };

  const handleSave = () => {
    // Implement save functionality to update the price list on the backend
  };
  /*
    const handleDelete = (index) => {
      const updatedList = [...priceList];
      updatedList.splice(index, 1);
      setPriceList(updatedList);
    };
  */
  const calcularPrecioTotal2 = () => {
    let total = 0;
    selectedProducts.forEach((producto) => {
      total +=
        parseFloat(producto.cantidad) * parseFloat(producto.precio_promedio);
    });
    return total;
  };

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
      // control.setValue("id_trs", id);
      // getInfoTRS(id).then(({ data: { data } }) => {
      //   // setDocumentoInfo(data);
      //   // Esta condicion funciona para identificar si el documento se encuentra en estado cerrado (3) o en estado anulado (4), en
      //   // caso de estar en alguno de los estados setea en true un flag para no mostrar algunos botones
      //   if (["2", "3", "4"].includes(data.estado)) {
      //     setFlagAcciones(true);
      //     const estado =
      //       data.estado == "2"
      //         ? "en proceso"
      //         : data.estado == "3"
      //         ? "cerrado"
      //         : "anulado";
      //     if (["create", "edit", "anular"].includes(accion)) {
      //       messageApi.open({
      //         type: "error",
      //         content: `Este documento se encuentra ${estado}, no es posible realizar modificaciones, solo consulta.`,
      //       });
      //       setTimeout(() => {
      //         navigate(
      //           `/${url_split.at(1)}/${url_split.at(2)}/${codigo_documento}`
      //         );
      //       }, 2500);
      //       return;
      //     }
      //   }
      //   setBodegaInfo(data.bod_destino);
      //   control.setValue("observacion", data.observacion);
      //   control.setValue("bod_destino", data.bod_origen);
      //   control.setValue("bod_origen", data.bod_origen);
      //   control.setValue("bod_des", data.bod_destino);
      //   setOptionsBodegas(data.bod_origen);
      //   //RECORDAR: formatear DataType, y campos
      //   const detalle: DataType[] = data.detalle.map((item) => {
      //     return {
      //       key: item.producto.id,
      //       cantidad: parseInt(item.cantidad),
      //       descripcion: item.producto.descripcion,
      //       precio_promedio: item.producto.precio_promedio,
      //       stock: item.stock,
      //       lote: item.lote,
      //       fvence: item.fecha_vencimiento,
      //       valor: item.valor,
      //     };
      //   });
      //   control.setValue("detalle", detalle);
      //   setSelectedProducts(detalle);
      //   setLoader(false);
      // });
    } else {
      getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
        setBodegaInfo(data);
        control.setValue("bod_origen", data.id);
      });

      getBodegas().then(({ data: { data } }) => {
        const bodegas = data
          .filter((item) => item.id_empresa == getSessionVariable(KEY_EMPRESA))
          .map((item) => {
            return { label: item.bod_nombre, value: item.id };
          });
        setOptionsBodegas(bodegas);
      });
    }
  }, []);

  useEffect(() => {
    getBodega(getSessionVariable(KEY_BODEGA)).then(({ data: { data } }) => {
      setBodegaInfo(data);
      control.setValue("bod_origen", data.id);
    });

    //control.setValue("detalle", selectedProducts);

    // Obtener usuario logueado y establecerlo en el campo de entrada
    //const usuarioLogueado = getUsuarioLogueado(); // Obtener el usuario logueado desde algún lugar
    //setUsuario(usuarioLogueado);
  }, []);

  useMemo(
    () => control.setValue("detalle", selectedProducts),
    [selectedProducts]
  );

  useMemo(() => {
    setPrecioTotal(calcularPrecioTotal2()); // Actualizar precio total
  }, [selectedProducts]);

  const handleSetDetalle = (productos: DataType[]) => {
    // const data: DataType[] = [];
    ///setPrecioTotal(calcularPrecioTotal());
    control.setValue("total", calcularPrecioTotal2());

    console.log("prod=>", productos);
    setDataSource(dataSource.concat(productos));
    setSelectedProducts([...selectedProducts, ...productos]);
    // Actualizar precio total

    //addProdForm(productos);

    control.setValue("detalle", selectedProducts.concat(productos));
    //setPrecioTotal(calcularPrecioTotal()); // Actualizar precio total
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key != key);
    setDataSource(newData);
    setSelectedProducts(selectedProducts.filter((item) => item.key !== key));
  };
  /*
    const columns: ColumnsType<DataType> = [
      {
        title: "Código",
        dataIndex: "key",
        key: "key",
        sorter: (a, b) => a.key.toString().localeCompare(b.key.toString()),
        align: "center",
        fixed: "left",
        width: 100,
      },
      {
        title: "Descripción",
        dataIndex: "descripcion",
        key: "descripcion",
        sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      },
      {
        title: "Cantidad",
        dataIndex: "cantidad",
        key: "cantidad",
        align: "center",
        fixed: "right",
        width: 100,
      },
      {
        title: "Stock",
        dataIndex: "stock",
        key: "stock",
        align: "center",
        fixed: "right",
        width: 90,
      },
      {
        title: "Precio Prom.",
        dataIndex: "precio_promedio",
        key: "precio_promedio",
        align: "center",
        fixed: "right",
        width: 100,
      },
      {
        title: "Lote",
        dataIndex: "lote",
        key: "lote",
        align: "center",
        fixed: "right",
        width: 90,
      },
      {
        title: "Fecha Vencimiento",
        dataIndex: "fvence",
        key: "fvence",
        sorter: (a, b) => a.fvence.localeCompare(b.fvence),
        align: "center",
        fixed: "right",
        width: 150,
      },
      {
        title: "Valor",
        dataIndex: "valor",
        key: "valor",
        align: "center",
        fixed: "right",
        width: 100,
      },
  
      {
        title: "Acciones",
        dataIndex: "acciones",
        key: "acciones",
        align: "center",
        fixed: "right",
        render: (_, record: { key: React.Key }) => {
          return (
            <Tooltip title="Editar">
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            </Tooltip>
          );
        },
        width: 100,
      },
    ];
    */

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      align: "center",
    },
    {
      title: 'NIT',
      dataIndex: 'nit',
      key: 'nit',
      align: "center",
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      align: "center",
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      align: "center",
      render: (_, record, index) => (
        <Button onClick={() => handleDelete(index)} danger>
          Delete
        </Button>
      ),
    },
  ];

  const handleCancel = () => {
    // Lógica para cancelar y restablecer el formulario o redirigir a otra página.
    navigate(-1);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const onFinish: SubmitHandler<any> = async (data) => {
    console.log(data);
    setLoaderSave(true);
    if (trasladosalida) {
      updateTRS(data, id).then(() => {
        messageApi.open({
          type: "success",
          content: "Traslado actualizado con exito!",
        });
        setTimeout(() => {
          navigate("..");
        }, 800);
      });
    } else {
      crearTRS(data)
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Traslado creado con exito!",
          });
          setTimeout(() => {
            navigate(-1);
          }, 800);
        })
        .catch(
          ({
            response: {
              data: { errors },
            },
          }) => {
            const errores: string[] = Object.values(errors);

            for (const error of errores) {
              messageApi.open({
                type: "error",
                content: error,
              });
            }

            setLoaderSave(false);
          }
        );
    }
  };

  return (
    <div>
    <input type="file" onChange={handleFileChange} />
    <div>
      {excelData.length > 0 && (
        <table>
          <thead>
            <tr>
              {excelData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
};
