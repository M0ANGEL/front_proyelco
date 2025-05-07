/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  notification,
  Row,
  Col,
  Layout,
  Select,
  Form,
  Button,
  SelectProps,
} from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import {
  getBodegasLocalizaciones,
  getListaActivosFiltrados,
  getUsuariosLista,
} from "@/services/activos/activosAPI";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { getListaSubCategoriasActivas } from "@/services/activos/subCategoriaAPI";
import { getListaCategoriasActivas } from "@/services/activos/categoriaAPI";
import { getListaSubLocalizacionArea } from "@/services/activos/subLocalizacionAreaAPI";
import { AxiosError } from "axios";
import { StyledWrapper } from "./style";
import { getListaParametros } from "@/services/activos/parametrosAPI";

let timeout: ReturnType<typeof setTimeout> | null;

export const FormInformesActivos = () => {

  const [notificationApi, contextHolder] = notification.useNotification();

  const [optionsUsuarios, setOptionsUsuarios] = useState<
    SelectProps["options"]
  >([]);
  const [optionsCategoria, setOptionsCategoria] = useState<
    SelectProps["options"]
  >([]);
  const [optionsSubCategoria, setOptionsSubCategoria] = useState<
    SelectProps["options"]
  >([]);
  const [optionsBodega, setOptionsBodega] = useState<SelectProps["options"]>(
    []
  );
  const [optionsArea, setOptionsArea] = useState<SelectProps["options"]>([]);

  const [optionsParametros, setOptionsParametros] = useState<
    SelectProps["options"]
  >([]);

  const [, setLoaderTable] = useState<boolean>(true);
  const [searchInput] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
  const [selectedParametros, setSelectedParametros] = useState<string[]>([]);

  const [selectedEstado, setSelectedEstado] = useState<string[]>([]);
  const [selectedEstadoPropiedad, setSelectedEstadoPropiedad] = useState<
    string[]
  >([]);
  const [selectedBodegas, setSelectedBodegas] = useState<string[]>([]);

  const control = useForm();



  useEffect(() => {
    fetchGeneral();
  }, [
    searchInput,
    selectedCategories,
    selectedSubcategories,
    selectedBodegas,
    selectedUsuarios,
    selectedArea,
    selectedEstado,
    selectedEstadoPropiedad,
    selectedParametros,
  ]);

  const fetchGeneral = async () => {
    setLoaderTable(true);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(async () => {
      try {
        const [
          subcategoriasResponse,
          categoriasResponse,
          usuariosResponse,
          areaResponse,
          bodegasResponse,
          parametrosResponse,
        ] = await Promise.all([
          getListaSubCategoriasActivas(),
          getListaCategoriasActivas(),
          getUsuariosLista(),
          getListaSubLocalizacionArea(),
          getBodegasLocalizaciones(),
          getListaParametros()
        ]);

        setOptionsUsuarios(
          usuariosResponse.data.map((user) => ({
            value: user.id,
            label: user.nombre,
          }))
        );
        setOptionsCategoria(
          categoriasResponse.data.map((categoria) => ({
            value: categoria.id,
            label: categoria.descripcion,
          }))
        );
        setOptionsSubCategoria(
          subcategoriasResponse.data.map((subcategoria) => ({
            value: subcategoria.id,
            label: subcategoria.descripcion,
          }))
        );
        setOptionsBodega(
          bodegasResponse.data.map((bodega) => ({
            value: bodega.id,
            label: bodega.bod_nombre,
          }))
        );
        setOptionsArea(
          areaResponse.data.map((area) => ({
            value: area.id,
            label: area.descripcion,
          }))
        );

        setOptionsParametros(
          parametrosResponse.data.map((param) => ({
            value: param.id,
            label: param.descripcion,
          }))
        );

        } catch (error) {
        console.error(error);
        notificationApi.error({
          message: "Error",
          description: "Error al cargar los datos.",
        });
      } finally {
        setLoaderTable(false);
      }
    }, 800);
  };

  const handleGenerateReport = async () => {
    const filtros = {
      categorias: control.getValues("id_categoria"),
      subcategorias: control.getValues("id_subcategoria"),
      bodegas: control.getValues("id_bodega"),
      usuarios: control.getValues("id_usuario"),
      area: control.getValues("area"),
      estado: control.getValues("estado"),
      estadoPropiedad: control.getValues("estadoPropiedad"),
      parametros: control.getValues("id_parametro"),
    };

    try {
      const response = await getListaActivosFiltrados(filtros);
      console.log(response);
      exportToExcel(response.data, "Informe_Activos");

      // Notificación de éxito
      notificationApi.success({
        message: "Informe Generado",
        description: "El informe se ha generado correctamente.",
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Si hay una respuesta de error desde el backend, muestra el mensaje
        const { message } = error.response.data;
        notificationApi.error({
          message: `Error`,
          description: message || "Ocurrió un error en el servidor.",
        });
      } else {
        // Si es otro tipo de error
        notificationApi.error({
          message: "Error",
          description: "Ocurrió un error inesperado.",
        });
      }
    }
  };

  const estadoLabels = {
    0: "Inactivo",
    1: "Activo",
    3: "pendiente",
    4: "mantenimiento",
    5: "vencido",
  } as const;

  const estadoPropiedadLabels = {
    0: "Alquilado",
    1: "Propio",
  } as const;

  const exportToExcel = (data: any[], fileName: string) => {
    // Extraer todos los nombres de parámetros únicos
    const allParameterNames = Array.from(
      new Set(
        data.flatMap((activo) =>
          activo.parametros ? activo.parametros.map((p: any) => p.nombre) : []
        )
      )
    );
  
    const formattedData = data.map((activo) => {
      const parametrosObject = allParameterNames.reduce((acc, paramName) => {
        acc[paramName] =
          activo.parametros?.find((p: any) => p.nombre === paramName)?.valor ||
          "N/A";
        return acc;
      }, {} as Record<string, string>);


      const usuarioTrazabilidad = activo.trazabilidad
      ? activo.trazabilidad
          .map((t: any) => t.user_info?.nombre)
          .filter((nombre: string | undefined) => nombre) // Eliminar valores nulos
          .join(", ")
      : "N/A";

    
      return {
        "ID Activo": activo.id,
        Nombre: activo.nombre,
        Observaciones: activo.observaciones,
        Categoría: activo.categoria?.descripcion || "N/A",
        Subcategoría: activo.subcategoria?.descripcion || "N/A",
        Usuario: activo.usuarios
        ? Object.values(activo.usuarios)
            .map((u: any) => u.nombre)
            .join(", ") || "N/A"
        : "N/A",
        "Usuario creacion activo": usuarioTrazabilidad,
        Área: activo.area?.descripcion || "N/A",
        Bodega: activo.bodega_info?.bod_nombre || "N/A",
        ValorCompra: Number(activo.valor_compra) || 0,
        Estado:
          estadoLabels[activo.estado as keyof typeof estadoLabels] || "N/A",
        EstadoPropiedad:
          estadoPropiedadLabels[
            activo.estado_propiedad as keyof typeof estadoPropiedadLabels
          ] || "N/A",
        Cantidad: activo.cantidad || 1,
        ValorTotal:
          Number(activo.valor_total) || Number(activo.valor_compra) || 0,
        Amortización: activo.amortizacion || "N/A",
        ...parametrosObject, // Insertamos cada parámetro como una columna separada
      };
    });
  
    // Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
    // Estilos de formato numérico
    const columnFormats: { [key: string]: string } = {
      valorCompra: '"COP" #,##0.00',
      valorTotal: '"COP" #,##0.00',
      Cantidad: "0",
    };
  
    // Aplicar formato a las columnas específicas
    Object.keys(columnFormats).forEach((colKey) => {
      const colIndex = Object.keys(formattedData[0]).indexOf(colKey) + 1;
      if (colIndex > 0) {
        for (let i = 2; i <= formattedData.length + 1; i++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: i - 1,
            c: colIndex - 1,
          });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].t = "n";
            worksheet[cellAddress].z = columnFormats[colKey];
          }
        }
      }
    });
  
    // Crear el libro y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  
    // Guardar el archivo
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  

  return (
    <Layout>
      {contextHolder}
      <Form layout="vertical">
        <StyledCard title=" Informe Inventario">
          <StyledWrapper>
            <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por Categorías">
                  <Controller
                    name="id_categoria"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple" // Permite seleccionar varias opciones
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Seleccione categoría(s)"
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={optionsCategoria}
                        onChange={(values) => {
                          setSelectedCategories(values);
                          field.onChange(values);
                        }}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por Sub Categoría">
                  <Controller
                    name="id_subcategoria"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Filtrar por Subcategorías"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(values) => {
                          field.onChange(values);
                          setSelectedSubcategories(values);
                        }}
                        options={optionsSubCategoria}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por Bodega">
                  <Controller
                    name="id_bodega"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Filtrar por bodegas"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(values) => {
                          field.onChange(values);
                          setSelectedBodegas(values);
                        }}
                        options={optionsBodega}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por usuario">
                  <Controller
                    name="id_usuario"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Filtrar por usuarios"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(values) => {
                          field.onChange(values);
                          setSelectedUsuarios(values);
                        }}
                        options={optionsUsuarios}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por área">
                  <Controller
                    name="area"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Filtrar por área"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(values) => {
                          field.onChange(values);
                          setSelectedArea(values);
                        }}
                        options={optionsArea}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

            <Col xs={24} sm={12} md={8}>
  <Form.Item label="Filtrar por estado">
    <Controller
      name="estado"
      control={control.control}
      defaultValue={[]} // Inicializa como un array vacío
      render={({ field }) => (
        <Select
          {...field}
          mode="multiple"
          showSearch
          allowClear
          placeholder="Filtrar por estado"
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false
          }
          onChange={(values) => {
            field.onChange(values);
            setSelectedEstado(values);
          }}
          options={[
            { value: "0", label: "Inactivo" },
            { value: "1", label: "Activo" },
            { value: "3", label: "Pendiente" },
            { value: "4", label: "Mantenimiento" },
            { value: "5", label: "Vencido" }
          ]}
        />
      )}
    />
  </Form.Item>
</Col>



<Col xs={24} sm={12} md={8}>
  <Form.Item label="Filtrar por estado de propiedad">
    <Controller
      name="estadoPropiedad"
      control={control.control}
      defaultValue={[]}
      render={({ field }) => (
        <Select
          {...field}
          mode="multiple"
          showSearch
          allowClear
          placeholder="Filtrar por estado de propiedad"
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            String(option?.children ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onChange={(values: string[]) => {
            const parsedValues = values.map((val) => String(parseInt(val, 10)));
            field.onChange(parsedValues);
            setSelectedEstadoPropiedad(parsedValues);
          }}
          
          
        >
          {[
            { value: "0", label: "Alquilado" },
            { value: "1", label: "Propio" },
            { value: "2", label: "Comodato" },
          ].map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      )}
    />
  </Form.Item>
</Col>


              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Filtrar por parámetros">
                  <Controller
                    name="id_parametro"
                    control={control.control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        showSearch // Habilita la búsqueda
                        allowClear // Permite limpiar la selección
                        placeholder="Filtrar por parámetros"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(values) => {
                          field.onChange(values);
                          setSelectedParametros(values);
                        }}
                        options={optionsParametros}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Button
                  type="primary"
                  style={{ backgroundColor: "green", borderColor: "green" }} // Estilo para el botón verde
                  onClick={handleGenerateReport} // Método que se llamará al hacer clic
                >
                  Generar Informe
                </Button>
              </Col>
            </Row>
          </StyledWrapper>
        </StyledCard>
      </Form>
    </Layout>
  );
};
