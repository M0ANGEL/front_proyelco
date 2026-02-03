import { Button, Col, Modal, notification, Row, Tooltip, Select, Form, Spin, Checkbox } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { exportarActivosExcel, obtenerCategorias, obtenerSubcategorias } from "@/services/activosFijos/TrasladosActivosAPI";
import { GreenButton, StyledFormItem } from "@/components/layout/styled";

interface Categoria {
  id: number;
  nombre: string;
  prefijo: string;
}

interface Subcategoria {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria_nombre?: string;
  categoria_prefijo?: string;
}

export const ModalExportacionActivos = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [cargando, setCargando] = useState(false);
  const [cargandoFiltros, setCargandoFiltros] = useState(false);
  const [exportarTodos, setExportarTodos] = useState(false);
  
  // Estados para datos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState<Subcategoria[]>([]);

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (visible) {
      cargarDatosIniciales();
    } else {
      // Resetear estados al cerrar
      form.resetFields();
      setCategoriasSeleccionadas([]);
      setExportarTodos(false);
    }
  }, [visible]);

  const cargarDatosIniciales = async () => {
    setCargandoFiltros(true);
    try {
      // Cargar categorías
      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData || []);
      
      // Cargar todas las subcategorías
      const subcategoriasData = await obtenerSubcategorias();
      // Enriquecer subcategorías con información de categorías
      const subcategoriasEnriquecidas = subcategoriasData.map(sub => {
        const categoria = categoriasData.find(cat => cat.id === sub.categoria_id);
        return {
          ...sub,
          categoria_nombre: categoria?.nombre,
          categoria_prefijo: categoria?.prefijo
        };
      });
      setSubcategorias(subcategoriasEnriquecidas || []);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar las categorías y subcategorías",
        placement: "topRight",
      });
    } finally {
      setCargandoFiltros(false);
    }
  };

  // Filtrar subcategorías cuando cambian las categorías seleccionadas
  useEffect(() => {
    if (categoriasSeleccionadas.length > 0) {
      const subcategoriasFiltradas = subcategorias.filter(subcat => 
        categoriasSeleccionadas.includes(subcat.categoria_id)
      );
      setSubcategoriasFiltradas(subcategoriasFiltradas);
    } else {
      setSubcategoriasFiltradas([]);
      form.setFieldValue('subcategoria_ids', []);
    }
  }, [categoriasSeleccionadas, subcategorias]);

  // Manejar cambio de categorías
  const handleCategoriaChange = (value: number[]) => {
    setCategoriasSeleccionadas(value);
    if (value.length === 0) {
      setExportarTodos(false);
    }
  };

  // Manejar cambio de checkbox "Exportar todos"
  const handleExportarTodosChange = (e: any) => {
    const checked = e.target.checked;
    setExportarTodos(checked);
    
    if (checked) {
      form.setFieldsValue({
        categoria_ids: [],
        subcategoria_ids: []
      });
      setCategoriasSeleccionadas([]);
    }
  };

  // Obtener los filtros para la API
  const obtenerFiltrosParaAPI = () => {
    const valores = form.getFieldsValue();
    const filtros: Record<string, any> = {};
    
    if (exportarTodos) {
      // Si se selecciona "Exportar todos", no enviamos filtros
      return {};
    }
    
    if (valores.categoria_ids?.length > 0) {
      filtros.categoria_id = valores.categoria_ids;
    }
    
    if (valores.subcategoria_ids?.length > 0) {
      filtros.subcategoria_id = valores.subcategoria_ids;
    }
    
    return filtros;
  };

  // Validar formulario
  const validarFormulario = () => {
    if (exportarTodos) {
      return true;
    }
    
    const valores = form.getFieldsValue();
    const tieneCategorias = valores.categoria_ids?.length > 0;
    const tieneSubcategorias = valores.subcategoria_ids?.length > 0;
    
    if (!tieneCategorias && !tieneSubcategorias) {
      notification.warning({
        message: "Selección requerida",
        description: "Debe seleccionar al menos una categoría, subcategoría o marcar 'Exportar todos'",
        placement: "topRight",
      });
      return false;
    }
    
    return true;
  };

  // Función para exportar activos
  const exportarActivos = async () => {
    try {
      // Validar formulario
      if (!validarFormulario()) {
        return;
      }
      
      setCargando(true);
      
      const filtros = obtenerFiltrosParaAPI();
      
      console.log("Filtros a enviar:", exportarTodos ? 'EXPORTAR TODOS' : filtros);
      
      // Llamar a la API de exportación
      const response = await exportarActivosExcel(filtros);
      
      // Crear un blob con el archivo Excel
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Crear un enlace para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener el nombre del archivo del header o usar uno por defecto
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'activos_exportados.xlsx';
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Limpiar memoria
      window.URL.revokeObjectURL(url);
      
      notification.success({
        message: "Exportación exitosa",
        description: `Los activos se han exportado correctamente.${exportarTodos ? ' (Todos los activos)' : ''}`,
        placement: "topRight",
      });
      
      // Cerrar el modal
      setVisible(false);
      
    } catch (err: any) {
      console.error("Error en exportación:", err);
      
      // Si es error de la API
      if (err.message) {
        notification.error({
          message: "Error en la exportación",
          description: err.message,
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Error en la exportación",
          description: "Ocurrió un error al exportar los activos.",
          placement: "topRight",
        });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Tooltip title="Exportar Excel">
        <GreenButton
          icon={<AiOutlineCheck />}
          type="default"
          size="small"
          onClick={() => setVisible(true)}
          style={{marginBottom: "5px"}}
        >
          Exportar
        </GreenButton>
      </Tooltip>

      <Modal
        title="Exportar Activos a Excel"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="cancelar"
            onClick={() => setVisible(false)}
            style={{
              color: "white",
              background: "#ce2222",
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="exportar"
            type="primary"
            onClick={exportarActivos}
            loading={cargando}
          >
            {cargando ? "Exportando..." : "Exportar Activos"}
          </Button>,
        ]}
        centered
        width={600}
      >
        <Spin spinning={cargandoFiltros}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              {/* Opción para exportar todos */}
              <Col xs={24}>
                <Form.Item name="exportar_todos" valuePropName="checked">
                  <Checkbox 
                    onChange={handleExportarTodosChange}
                    checked={exportarTodos}
                  >
                    Exportar todos los activos (sin filtros)
                  </Checkbox>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <div style={{ 
                  borderTop: '1px solid #d9d9d9', 
                  margin: '10px 0',
                  paddingTop: '10px' 
                }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                    O filtar por:
                  </p>
                </div>
              </Col>

              {/* Selección de Categorías */}
              <Col xs={24}>
                <StyledFormItem 
                  label="Categorías" 
                  name="categoria_ids"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    placeholder="Selecciona categorías"
                    onChange={handleCategoriaChange}
                    disabled={exportarTodos}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={categorias.map(cat => ({
                      value: cat.id,
                      label: `${cat.prefijo} - ${cat.nombre}`
                    }))}
                  />
                </StyledFormItem>
              </Col>

              {/* Selección de Subcategorías */}
              <Col xs={24}>
                <StyledFormItem 
                  label="Subcategorías" 
                  name="subcategoria_ids"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    placeholder={
                      categoriasSeleccionadas.length > 0 
                        ? "Selecciona subcategorías (opcional)" 
                        : exportarTodos ? "Deshabilitado - Exportar todos activado" : "Selecciona categorías primero"
                    }
                    disabled={categoriasSeleccionadas.length === 0 || exportarTodos}
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={subcategoriasFiltradas.map(sub => ({
                      value: sub.id,
                      label: `${sub.categoria_prefijo} - ${sub.nombre}`
                    }))}
                  />
                </StyledFormItem>
              </Col>

              {/* Información adicional */}
              <Col xs={24}>
                <div style={{ 
                  backgroundColor: '#f0f0f0', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <p style={{ margin: 0 }}>
                    <strong>Nota:</strong> Puedes seleccionar múltiples categorías y subcategorías.
                    Si seleccionas categorías sin subcategorías, se exportarán todos los activos de esas categorías.
                  </p>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};