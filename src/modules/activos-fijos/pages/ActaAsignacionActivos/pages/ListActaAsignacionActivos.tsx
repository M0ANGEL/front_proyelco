import React, { useState, useEffect, useRef } from "react";
import { Select, Table, Button } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getActivosXusuario, getUsuariosLista } from "@/services/activos/activosAPI";

const { Option } = Select;

export const ActaAsignacionActivo: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [activos, setActivos] = useState<any[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await getUsuariosLista();
        if (response.status && Array.isArray(response.data)) {
          setUsuarios(response.data);
        } else {
          console.error("Respuesta inesperada en usuarios:", response);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleUsuarioChange = async (idUsuario: number) => {
    setUsuarioSeleccionado(idUsuario);
    try {
      const response = await getActivosXusuario(idUsuario);
      if (Array.isArray(response.data.data)) {
        setActivos(response.data.data);
      } else {
        console.error("Respuesta inesperada en activos:", response.data.data);
        setActivos([]);
      }
    } catch (error) {
      console.error("Error al obtener activos:", error);
      setActivos([]);
    }
  };

  const generarPDF = () => {
    if (!usuarioSeleccionado || activos.length === 0) return;

    const usuario = usuarios.find(u => u.id === usuarioSeleccionado);
    if (!usuario) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Acta de Asignación de Activos", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Usuario: ${usuario.nombre}`, 20, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 30);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Nombre", "Observaciones", "Localización", "Categoría", "Subcategoría", "Área", "Fecha de Compra"]],
      body: activos.map(activo => [
        activo.id || "N/A",
        activo.nombre || "N/A",
        activo.observaciones || "N/A",
        activo.bodega?.bod_nombre || "N/A",
        activo.categoria?.descripcion || "N/A",
        activo.subcategoria?.descripcion || "N/A",
        activo.area?.descripcion || "N/A",
        activo.fecha_compra || "N/A"
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] }, // Azul fuerte con texto blanco
    });

    // Ajustar la posición de las firmas
    let finalY = (doc as any).lastAutoTable.finalY || 80;
    doc.text("Firma Entrega: ___________________", 20, finalY + 20);
    doc.text("Firma Recibe: ___________________", 120, finalY + 20);

    // Generar URL del PDF para la vista previa
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);

    // Ajustar el alto del iframe dinámicamente después de actualizar el PDF
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.style.height = "90vh"; // Ajustar para que se vea completo
      }
    }, 500);
  };

  return (
    <div>
      <h2>Acta de Asignación de Activo</h2>
      <Select
  style={{ width: 300, marginBottom: 20 }}
  placeholder="Seleccione un usuario"
  onChange={handleUsuarioChange}
  showSearch
  filterOption={(input, option) =>
    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
  }
>
  {usuarios.map(usuario => (
    <Option key={usuario.id} value={usuario.id}>{usuario.nombre}</Option>
  ))}
</Select>


      <Table
        dataSource={activos}
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Nombre", dataIndex: "nombre", key: "nombre" },
          { title: "Localización", dataIndex: ["bodega", "bod_nombre"], key: "localizacion" },
          { title: "Categoría", dataIndex: ["categoria", "descripcion"], key: "categoria" },
          { title: "Subcategoría", dataIndex: ["subcategoria", "descripcion"], key: "subcategoria" },
          { title: "Área", dataIndex: ["area", "descripcion"], key: "area" },
          { title: "Fecha De Compra", dataIndex: "fecha_compra", key: "fecha_compra" }
        ]}
        rowKey="id"
      />

      <Button 
        type="primary" 
        onClick={generarPDF} 
        disabled={!usuarioSeleccionado || activos.length === 0}
        style={{ marginTop: 10 }}
      >
        Generar Acta
      </Button>

      {pdfUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Vista previa del Acta</h3>
          <iframe 
            ref={iframeRef}
            src={pdfUrl} 
            width="100%" 
            height="90vh" // Asegura que se vea todo el documento
            style={{ border: "1px solid #ccc" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};
