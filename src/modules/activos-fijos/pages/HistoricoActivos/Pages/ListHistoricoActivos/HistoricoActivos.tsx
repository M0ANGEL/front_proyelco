import { useState, useEffect } from "react";
import {
  notification,
  Row,
  Col,
  Layout,
  Select,
  Form,
  Card,
  Button,
} from "antd";
import {
  Activos,
  Categoria,
  ResponseActivoCompleto,
  SubCategoria,
} from "@/services/types";
import {
  getActivosFotos,
  getActivosXSubcategoria,
  solicitarHistoricoActivo,
} from "@/services/activos/activosAPI";
import { Controller, useForm } from "react-hook-form";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  getListaCategoriasActivas,
  getListaSubcategoriasxCategorias,
} from "@/services/activos/categoriaAPI";

const { Option } = Select;

export const ListHistoricoActivo = () => {
  const [activos, setActivos] = useState<Activos[]>([]);
  const [HistoricoActivo, setHistoricoActivo] =
    useState<ResponseActivoCompleto | null>(null);
  const [imagenesActivo, setImagenesActivo] = useState<string[]>([]);
  const [ActivoSeleccionado, setActivoSeleccionado] = useState<number | null>(
    null
  );

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<SubCategoria[]>([]);

  const { control, watch } = useForm();
  const selectedCategoria = watch("id_categoria");
  const selectedSubcategoria = watch("id_subcategoria");

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (selectedCategoria) {
      fetchSubcategorias(selectedCategoria);
    }
  }, [selectedCategoria]);

  useEffect(() => {
    if (selectedSubcategoria) {
      fetchActivos(selectedSubcategoria);
    }
  }, [selectedSubcategoria, ActivoSeleccionado]);

  useEffect(() => {
    if (ActivoSeleccionado) {
      fetchHistorico(ActivoSeleccionado);
    }
  }, [selectedSubcategoria, ActivoSeleccionado]);

  const fetchActivos = async (selectedSubcategoria: number) => {
    try {
      const response = await getActivosXSubcategoria(selectedSubcategoria);
      setActivos(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          "No se encontraron activos con la subcategoria seleccionada.",
      });
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await getListaCategoriasActivas();
      setCategorias(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Ocurrió un error al cargar las categorías.",
      });
    }
  };

  const fetchSubcategorias = async (idCategoria: number) => {
    try {
      const response = await getListaSubcategoriasxCategorias(idCategoria);
      setSubcategorias(response.data.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Ocurrió un error al cargar las subcategorías.",
      });
    }
  };

  const fetchHistorico = async (id_activo: number) => {
    try {
      const response = await solicitarHistoricoActivo(id_activo);
      setHistoricoActivo(response);
      const imagenesResponse = await getActivosFotos(id_activo);
      setImagenesActivo(
        imagenesResponse.data.data.map((img: any) => img.url) || []
      );
    } catch (error) {
      console.error("Error al obtener el histórico del activo:", error);
    }
  };

  // useEffect(() => {
  //   fetchActivo();
  // }, []);

  // const fetchActivo = async () => {
  //   try {
  //     const response = await getListaActivos();
  //     setActivos(response.data);
  //   } catch (error) {
  //     notification.error({
  //       message: "Error",
  //       description: "Ocurrió un error al cargar los activos.",
  //     });
  //   }
  // };

  const estadosPropiedadMap: Record<number, string> = {
    1: "Propio",
    2: "Alquilado",
    3: "Comodato",
  };

  const estadosActivosMap: Record<number, string> = {
    1: "Activo",
    0: "Inactivo",
  };

  // const handleSelectActivo = async (value: number) => {
  //   try {
  //     const response = await solicitarHistoricoActivo(value);
  //     setHistoricoActivo(response);
  //     const imagenesResponse = await getActivosFotos(value);
  //     console.log(imagenesResponse.data.data);
  //     setImagenesActivo(imagenesResponse.data.data.map((img: any) => img.url) || []);
  //   } catch (error) {
  //     console.error("Error al obtener el histórico del activo:", error);
  //   }
  // };

  const exportToPDF = async () => {
    if (!HistoricoActivo) return;
    const doc = new jsPDF();

    doc.text("Información del Activo", 20, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Campo", "Valor"]],
      body: [
        ["Nombre", HistoricoActivo?.data.activo.nombre || " N/A"],
        ["Observaciones", HistoricoActivo?.data.activo?.observaciones || "N/A"],
        [
          "Categoría",
          HistoricoActivo?.data.activo?.categoria?.descripcion || "N/A",
        ],
        [
          "Subcategoría",
          HistoricoActivo?.data.activo?.subcategoria?.descripcion || "N/A",
        ],
        ["Área", HistoricoActivo?.data.activo?.area?.descripcion || "N/A"],
        [
          "Localización",
          HistoricoActivo?.data.activo?.bodega_info?.bod_nombre || "N/A",
        ],
        [
          "Fecha de compra",
          HistoricoActivo?.data.activo?.fecha_compra
            ? new Date(
                HistoricoActivo.data.activo.fecha_compra
              ).toLocaleDateString()
            : "N/A",
        ],
        ["Estado", HistoricoActivo?.data.activo?.estado || "N/A"],
        [
          "Usuario Encargado",
          HistoricoActivo?.data?.activo?.usuarios
            ? HistoricoActivo.data.activo.usuarios
                .map((user: any) => user.nombre)
                .join(", ")
            : "N/A",
        ],
      ],
    });

    let nextY = (doc as any).lastAutoTable?.finalY || 30;

    if (HistoricoActivo?.data.trazabilidad?.length > 0) {
      doc.text("Trazabilidad del Activo", 20, nextY + 10);

      autoTable(doc, {
        startY: nextY + 15,
        head: [["Fecha", "Usuario", "Acción"]],
        body: HistoricoActivo?.data.trazabilidad?.map((traza) => [
          traza.fecha ? new Date(traza.fecha).toLocaleDateString() : "N/A",
          traza.user_info?.nombre || "N/A",
          traza.proceso || "N/A",
        ]),
      });

      nextY = (doc as any).lastAutoTable?.finalY || nextY + 30;
    }

    if (HistoricoActivo?.data.mantenimientos?.length > 0) {
      doc.text("Historial de Mantenimientos", 20, nextY + 10);

      autoTable(doc, {
        startY: nextY + 15,
        head: [
          ["Fecha Inicio", "Fecha Fin", "Tipo", "Descripción", "Responsable"],
        ],
        body: HistoricoActivo?.data.mantenimientos?.map((mantenimiento) => [
          mantenimiento.fecha_mantenimiento
            ? new Date(mantenimiento.fecha_mantenimiento).toLocaleDateString()
            : "N/A",
          mantenimiento.fecha_fin_mantenimiento
            ? new Date(
                mantenimiento.fecha_fin_mantenimiento
              ).toLocaleDateString()
            : "N/A",
          mantenimiento.tipo_mantenimiento || "N/A",
          mantenimiento.descripcion_mantenimiento || "N/A",
          mantenimiento.user_info?.nombre || "N/A",
        ]),
      });

      nextY = (doc as any).lastAutoTable?.finalY || nextY + 30;
    }

    if (imagenesActivo.length > 0) {
      doc.text("Imágenes del Activo", 20, nextY + 10);
      nextY += 15;

      try {
        const imagePromises = imagenesActivo.map(async (imgUrl) => {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        });

        const base64Images = await Promise.all(imagePromises);

        base64Images.forEach((base64Img) => {
          doc.addImage(base64Img, "JPEG", 20, nextY, 50, 50);
          nextY += 55;
        });

        doc.save("historico_activo.pdf");
      } catch (error) {
        console.error("Error cargando imágenes:", error);
        doc.save("historico_activo.pdf");
      }
    } else {
      doc.save("historico_activo.pdf");
    }
  };

  const exportToExcel = () => {
    if (!HistoricoActivo) return;

    const data = [
      ["Campo", "Valor"],
      ["Nombre", HistoricoActivo?.data.activo?.nombre || "N/A"],
      ["Observaciones", HistoricoActivo?.data.activo?.observaciones || "N/A"],
      [
        "Categoría",
        HistoricoActivo?.data.activo?.categoria?.descripcion || "N/A",
      ],
      [
        "Subcategoría",
        HistoricoActivo?.data.activo?.subcategoria?.descripcion || "N/A",
      ],
      ["Área", HistoricoActivo?.data.activo?.area?.descripcion || "N/A"],
      [
        "Localización",
        HistoricoActivo?.data.activo?.bodega_info?.bod_nombre || "N/A",
      ],
      [
        "Fecha de compra",
        HistoricoActivo?.data.activo?.fecha_compra?.toString() || "N/A",
      ],
      ["Estado", HistoricoActivo?.data.activo?.estado || "N/A"],
      [
        "Usuario Encargado",
        HistoricoActivo?.data?.activo?.usuarios
          ? HistoricoActivo.data.activo.usuarios
              .map((user: any) => user.nombre)
              .join(", ")
          : "N/A",
      ],
    ];

    // Agregar trazabilidad
    // Agregar trazabilidad
    data.push(["", ""]);
    data.push(["Fecha", "Usuario", "Acción"]);
    HistoricoActivo?.data.trazabilidad?.forEach((traza) => {
      data.push([
        traza.fecha ? new Date(traza.fecha).toLocaleDateString() : "N/A", // ✅ Convierte a string
        traza.user_info?.nombre || "N/A",
        traza.proceso || "N/A",
      ]);
    });

    if (imagenesActivo.length > 0) {
      data.push(["", ""]);
      data.push(["Imágenes del Activo", ""]);
      imagenesActivo.forEach((imgUrl) => {
        data.push(["Imagen URL", imgUrl]); // Se coloca la URL en la celda
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HistoricoActivo");
    XLSX.writeFile(wb, "historico_activo.xlsx");
  };

  console.log("datorro", HistoricoActivo);

  return (
    <Layout>
      <Form layout="vertical">
        <Card title="Histórico de Activos">
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Seleccionar Categoría">
                <Controller
                  name="id_categoria"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Filtrar por Categorías"
                      style={{ width: "100%" }}
                    >
                      {categorias.map((categoria) => (
                        <Option key={categoria.id} value={categoria.id}>
                          {categoria.descripcion}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
  <Form.Item label="Seleccionar Subcategoría">
    <Controller
      name="id_subcategoria"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          placeholder="Filtrar por Subcategorías"
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {subcategorias.map((subcategoria) => (
            <Option key={subcategoria.id} value={subcategoria.id}>
              {subcategoria.descripcion}
            </Option>
          ))}
        </Select>
      )}
    />
  </Form.Item>
</Col>


            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Seleccionar Activo">
                <Controller
                  name="id_activo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Filtrar por activo"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setActivoSeleccionado(value);
                        field.onChange(value);
                      }}
                    >
                      {activos.map((act) => (
                        <Option key={act.id} value={act.id}>
                          {`${act.id} - ${act.nombre}`}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {HistoricoActivo && (
            <>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={exportToPDF}
                    style={{ marginRight: 10 }}
                  >
                    Exportar a PDF
                  </Button>
                  <Button type="primary" onClick={exportToExcel}>
                    Exportar a Excel
                  </Button>
                </Col>
              </Row>

              <Card title="Información del Activo" style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p>
                      <strong>Nombre:</strong>{" "}
                      {HistoricoActivo?.data.activo?.nombre || "N/A"}
                    </p>
                    <p>
                      <strong>Usuario Encargado:</strong>{" "}
                      {HistoricoActivo?.data?.activo?.usuarios
                        ? Object.entries(HistoricoActivo.data.activo.usuarios)
                            .map(
                              ([, usuario]: [string, any]) =>
                                usuario.nombre || "Desconocido"
                            )
                            .join(", ")
                        : "N/A"}
                    </p>

                    <p>
                      <strong>Observaciones:</strong>{" "}
                      {HistoricoActivo?.data.activo?.observaciones || "N/A"}
                    </p>
                    <p>
                      <strong>Categoría:</strong>{" "}
                      {HistoricoActivo?.data.activo?.categoria?.descripcion ||
                        "N/A"}
                    </p>
                    <p>
                      <strong>SubCategoria:</strong>{" "}
                      {HistoricoActivo?.data.activo?.subcategoria
                        ?.descripcion || "N/A"}
                    </p>
                    <p>
                      <strong>Area:</strong>{" "}
                      {HistoricoActivo?.data.activo?.area?.descripcion || "N/A"}
                    </p>
                    <p>
                      <strong>Localizacion:</strong>{" "}
                      {HistoricoActivo?.data.activo?.bodega_info?.bod_nombre ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>Estado Propiedad:</strong>{" "}
                      {estadosPropiedadMap[
                        Number(HistoricoActivo?.data.activo?.estado_propiedad)
                      ] || "N/A"}
                    </p>

                    <p>
                      <strong>Estado:</strong>{" "}
                      {estadosActivosMap[
                        Number(HistoricoActivo?.data.activo?.estado)
                      ] || "N/A"}
                    </p>

                    <p>
                      <strong>Fecha Compra:</strong>{" "}
                      {HistoricoActivo?.data.activo?.fecha_compra
                        ? new Date(
                            HistoricoActivo.data.activo.fecha_compra
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <p>
                      <strong>Valor:</strong>{" "}
                      {HistoricoActivo?.data.activo?.valor_compra || "N/A"}
                    </p>

                    <p>
                      <strong>Armotizacion:</strong>{" "}
                      {HistoricoActivo?.data.activo?.amortizacion || "N/A"}
                    </p>

                    <p>
                      <strong>Parámetros:</strong>{" "}
                      {HistoricoActivo?.data.activo?.datos?.length
                        ? HistoricoActivo.data.activo.datos
                            .map(
                              (dato) =>
                                `${
                                  dato.parametro_sub_categoria?.parametro
                                    .descripcion || "Sin nombre"
                                }: ${dato.valor_almacenado || "N/A"}`
                            )
                            .join(", ")
                        : "N/A"}
                    </p>
                  </Col>
                </Row>
              </Card>

              <Card title="Trazabilidad del Activo" style={{ marginTop: 16 }}>
                {HistoricoActivo.data.trazabilidad.length > 0 ? (
                  HistoricoActivo.data.trazabilidad.map((traza, index) => (
                    <p key={index}>
                      <strong>
                        {new Date(traza.fecha).toLocaleDateString()}:
                      </strong>{" "}
                      {/* ✅ Convertir a string */}
                      {traza.user_info?.nombre || "N/A"} realizó la acción "
                      {traza.proceso || "N/A"}"
                    </p>
                  ))
                ) : (
                  <p>No hay registros de trazabilidad.</p>
                )}
              </Card>

              <Card title="Imágenes del Activo" style={{ marginTop: 16 }}>
                {imagenesActivo.length > 0 ? (
                  imagenesActivo.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: "200px",
                        height: "200px",
                        marginRight: "10px",
                      }}
                    />
                  ))
                ) : (
                  <p>No hay imágenes disponibles.</p>
                )}
              </Card>
            </>
          )}
        </Card>
      </Form>
    </Layout>
  );
};
