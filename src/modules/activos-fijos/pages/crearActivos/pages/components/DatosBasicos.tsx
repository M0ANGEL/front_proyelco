import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  SelectProps,
  Typography,
  UploadProps,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import TextArea from "antd/es/input/TextArea";
import { getActiCategorias } from "@/services/activosFijos/CategoriasAPI";
import { getActiSubcategoriaID } from "@/services/activosFijos/SubCategoriasAPI";
import { CustomUpload } from "./styled";
import { CameraOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getActiBodegas } from "@/services/activosFijos/BodegasAPI";

const { Text } = Typography;

interface DataSelect {
  label: string | null;
  value: number | null;
}

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const [selectCategorias, setSelectCategorias] = useState<
    SelectProps["options"]
  >([]);
  const [subcategorias, setSubcategorias] = useState<DataSelect[]>([]);
  const [bodegas, setBodegas] = useState<DataSelect[]>([]);

  const methods = useFormContext();

  useEffect(() => {
    if (TkCategoria) {
      methods.setValue("numero_activo", TkCategoria?.numero_activo);
      methods.setValue("categoria_id", TkCategoria?.categoria_id);
      methods.setValue("subcategoria_id", TkCategoria?.subcategoria_id);
      methods.setValue("descripcion", TkCategoria?.descripcion);
      methods.setValue("ubicacion_actual", TkCategoria?.ubicacion_actual_id);
      methods.setValue("valor", TkCategoria?.valor);
      fetchSubcategorias(Number(TkCategoria?.categoria_id));

      // Conversión de fecha
      methods.setValue(
        "fecha_fin_garantia",
        TkCategoria?.fecha_fin_garantia
          ? dayjs(TkCategoria.fecha_fin_garantia)
          : null
      );

      methods.setValue("condicion", TkCategoria?.condicion);
      methods.setValue("marca", TkCategoria?.marca);
      methods.setValue("serial", TkCategoria?.serial);
      methods.setValue("observacion", TkCategoria?.observacion);
    } else {
      fetchCategorias();
      fetchUbicaciones();
    }
  }, [TkCategoria]);

  //llamdo de categorias
  const fetchCategorias = () => {
    getActiCategorias().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
  };

  //llamado de subcategorias por id de categoria 3
  const fetchSubcategorias = async (categoriaId: number) => {
    if (!categoriaId) {
      setSubcategorias([]);
      return;
    }
    try {
      const response = await getActiSubcategoriaID(categoriaId);
      const subcategorias = response?.data?.data || [];
      setSubcategorias(
        subcategorias.map((item) => ({
          label: item.nombre.toUpperCase(),
          value: Number(item.id),
        }))
      );
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  };

  //llamado de ubicaciones
  const fetchUbicaciones = () => {
    getActiBodegas().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setBodegas(categoriasPadres);
    });
  };

  return (
    <Row gutter={24}>
      {/* campo de nombre de la categorias padre para la seleccion*/}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="categoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Categoria pafre requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Categoria Padre">
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
                options={selectCategorias}
                onSelect={(value) => {
                  methods.resetField("subcategoria_id");
                  fetchSubcategorias(value);
                }}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de nombre de la sucategorias */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="subcategoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Subcategoria  requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Subcategoria">
              <Select
                {...field}
                showSearch
                allowClear
                disabled={!subcategorias?.length}
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
                options={subcategorias}
                placeholder={
                  subcategorias?.length
                    ? ""
                    : "NO HAY DATOS PARA ESTA CATEGORIA"
                }
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* numero de activo, unico */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="numero_activo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Numero de activo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Numero de activo">
              <Input
                {...field}
                maxLength={50}
                placeholder="PL-02"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de ubicacion actual activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="ubicacion_actual"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "la ubicacion es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ubicacion actual">
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
                options={bodegas}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* valor de activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="valor"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Valor de activo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Valor de activo">
              <Input
                {...field}
                maxLength={50}
                placeholder="0"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* fecha donde termina la garantia del activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="fecha_fin_garantia"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Fecha de garantía de activo es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Fecha fin garantía">
              <DatePicker
                style={{ width: "100%" }}
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* estado del activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="condicion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La condición del activo es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Condición del Activo">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: 1, label: "Bueno" },
                  { value: 2, label: "Regular" },
                  { value: 3, label: "Malo" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* marca de activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="marca"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Marca de activo">
              <Input
                {...field}
                maxLength={50}
                placeholder="LG"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* serial de activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="serial"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Serial de activo">
              <Input
                {...field}
                maxLength={50}
                placeholder="LG-20345"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* subir archivo */}
      {/* <Col xs={24} sm={24}>
        <Controller
          control={methods.control}
          name="file"
          render={({ field, fieldState: { error } }) => {
            const uploadProps: UploadProps = {
              maxCount: 1,
              accept: ".jpg, .jpeg, .png, .pdf, .xls, .xlsx, .docx",
              beforeUpload: (file) => {
                field.onChange(file); // 🔹 Guardar en react-hook-form
                return false; // evitar subida automática
              },
              onRemove: () => {
                field.onChange(null); // limpiar en react-hook-form
              },
            };

            return (
              <StyledFormItem label="Archivo:">
                <CustomUpload {...uploadProps}>
                  <Button block ghost type="primary" icon={<UploadOutlined />}>
                    Seleccionar archivo
                  </Button>
                </CustomUpload>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            );
          }}
        />
      </Col> */}

      <Col xs={24} sm={24}>
        <Controller
          control={methods.control}
          name="file"
          render={({ field, fieldState: { error } }) => {
            const uploadProps: UploadProps = {
              maxCount: 1,
              accept: ".jpg, .jpeg, .png",
              beforeUpload: (file) => {
                field.onChange(file);
                return false;
              },
              onRemove: () => {
                field.onChange(null);
              },
            };

            const cameraProps: UploadProps = {
              maxCount: 1,
              accept: "image/*",
              capture: "environment", // cámara trasera
              beforeUpload: (file) => {
                field.onChange(file);
                return false;
              },
              onRemove: () => {
                field.onChange(null);
              },
            };

            return (
              <StyledFormItem label="Archivo o Foto:">
                <Row gutter={8}>
                  {/* Botón subir archivo */}
                  <Col span={12}>
                    <CustomUpload
                      {...uploadProps}
                      accept="image/png, image/jpeg"
                    >
                      <Button
                        block
                        ghost
                        type="primary"
                        icon={<UploadOutlined />}
                      >
                        Subir archivo
                      </Button>
                    </CustomUpload>
                  </Col>

                  {/* Botón tomar foto */}
                  <Col span={12}>
                    <CustomUpload
                      {...cameraProps}
                      accept="image/png, image/jpeg"
                    >
                      <Button
                        block
                        ghost
                        type="primary"
                        icon={<CameraOutlined />}
                      >
                        Tomar foto
                      </Button>
                    </CustomUpload>
                  </Col>
                </Row>
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            );
          }}
        />
      </Col>

      {/* descripcion */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="descripcion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La descripcion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Descripcion">
              <TextArea
                {...field}
                maxLength={200}
                placeholder="Color* ETC"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
