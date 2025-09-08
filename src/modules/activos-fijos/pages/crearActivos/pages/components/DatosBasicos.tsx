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
import { Controller, useFormContext, useWatch } from "react-hook-form";
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
  const origen = useWatch({ control: methods.control, name: "origen_activo" });

  useEffect(() => {
    if (TkCategoria) {
      methods.setValue("origen_activo", TkCategoria?.origen_activo);
      methods.setValue("tipo_activo", TkCategoria?.tipo_activo);
      methods.setValue("proveedor_activo", TkCategoria?.proveedor_activo);
      methods.setValue("numero_activo", TkCategoria?.numero_activo);
      methods.setValue("categoria_id", TkCategoria?.categoria_id);
      methods.setValue("subcategoria_id", TkCategoria?.subcategoria_id);
      methods.setValue("descripcion", TkCategoria?.descripcion);
      methods.setValue(
        "ubicacion_actual",
        Number(TkCategoria?.ubicacion_actual_id)
      );
      methods.setValue("valor", TkCategoria?.valor);
      fetchSubcategorias(Number(TkCategoria?.categoria_id));

      // Conversión de fecha
      methods.setValue(
        "fecha_aquiler",
        TkCategoria?.fecha_aquiler ? dayjs(TkCategoria.fecha_aquiler) : null
      );
      methods.setValue(
        "fecha_compra",
        TkCategoria?.fecha_compra ? dayjs(TkCategoria.fecha_compra) : null
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

  //llamado de categorias
  const fetchCategorias = () => {
    getActiCategorias().then(({ data: { data } }) => {
      const categoriasPadres = data.map((item) => ({
        label: item.nombre.toUpperCase(),
        value: item.id,
      }));
      setSelectCategorias(categoriasPadres);
    });
  };

  //llamado de subcategorias por id de categoria
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
      {/* tipo del activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="tipo_activo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El tipo del activo es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Activo">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: 1, label: "MAYORES" },
                  { value: 2, label: "MENORES" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* campo de nombre de la categorias padre */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="categoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Categoria padre requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Categoria Padre">
              <Select
                {...field}
                showSearch
                allowClear
                filterSort={(a, b) =>
                  (a?.label ?? "").toString().localeCompare(b?.label ?? "")
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
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

      {/* campo de nombre de la subcategoria */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="subcategoria_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Subcategoria requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Subcategoria">
              <Select
                {...field}
                showSearch
                allowClear
                disabled={!subcategorias?.length}
                filterSort={(a, b) =>
                  (a?.label ?? "").toString().localeCompare(b?.label ?? "")
                }
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
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

      {/* numero de activo */}
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

      {/* ubicacion actual cuando se edite*/}
      {TkCategoria && (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="ubicacion_actual"
            control={methods.control}
            rules={{
              required: { value: true, message: "La ubicacion es requerida" },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Ubicacion actual">
                <Select {...field} showSearch allowClear options={bodegas} />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      )}

      {/* origen  del activo */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="origen_activo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El origen del activo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Origen">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: 1, label: "PROPIO" },
                  { value: 2, label: "ALQUILADO" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* si es propio (1) -> fecha de compra */}
      {origen === 1 && (
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="fecha_compra"
            control={methods.control}
            rules={{
              required: { value: true, message: "Fecha de compra requerida" },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Compra">
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
      )}

      {/* si es alquilado (2) -> fecha de alquiler */}
      {origen === 2 && (
        <>
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="fecha_aquiler"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Fecha de alquiler requerida",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Fecha Alquiler">
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

          {/* proveedor */}
          <Col xs={24} sm={12} style={{ width: "100%" }}>
            <Controller
              name="proveedor_activo"
              control={methods.control}
              rules={{
                required: { value: true, message: "Proveedor requerido" },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Proveedor de activo">
                  <Input
                    {...field}
                    maxLength={50}
                    status={error && "error"}
                    style={{ textTransform: "uppercase" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        </>
      )}

      {/* valor */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="valor"
          control={methods.control}
          rules={{
            required: { value: true, message: "Valor requerido" },
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

      {/* condicion */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="condicion"
          control={methods.control}
          rules={{
            required: { value: true, message: "Condición requerida" },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Condición del Activo">
              <Select
                {...field}
                showSearch
                allowClear
                options={[
                  { value: 1, label: "Bueno" },
                  { value: 2, label: "Reparado" },
                  { value: 3, label: "Malo" },
                ]}
                status={error ? "error" : ""}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* marca */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="marca"
          control={methods.control}
          rules={{
            required: { value: true, message: "Marca del activo es requerida" },
          }}
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

      {/* serial */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="serial"
          control={methods.control}
           rules={{
            required: { value: true, message: "Serial del activo es requerida" },
          }}
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

      {/* subir archivo o foto */}
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
                  <Col span={12}>
                    <CustomUpload {...uploadProps}>
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

                  <Col span={12}>
                    <CustomUpload {...cameraProps}>
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
      <Col xs={24} sm={24} style={{ width: "100%" }}>
        <Controller
          name="descripcion"
          control={methods.control}
          rules={{
            required: { value: true, message: "Descripcion requerida" },
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
