import { Button, Modal, Tooltip, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import {
  ProyectodetalladoCasas,
} from "@/services/proyectos/gestionProyectoAPI";
// import { DescargarInforme } from "./descargaArchivos";

interface DataId {
  proyecto: DataTypeA;
}

interface DataTypeA {
  key: number;
  descripcion_proyecto: string;
}

interface ReporteFila {
  proceso: string;
  etapa: number; // etapa del proyecto
  piso: number;
  orden: number;
  [key: string]: string | number;
}

export const ModalInformeCasa = ({ proyecto }: DataId) => {
  const [open, setOpen] = useState(false);
  const [reporte, setReporte] = useState<ReporteFila[]>([]);
  const [manzanas, setManzanas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [IdProyecto, setIdProyecto] = useState<number>(0);

  const showLoading = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      ProyectodetalladoCasas(Number(proyecto.key))
        .then(({ data }) => {
          if (data.success) {
            setReporte(data.data.reporte);
            setManzanas(data.data.manzanas); // 👈 backend devuelve "manzanas"
            setIdProyecto(data.data.proyecto_id);
          }
        })
        .catch((error) => {
          console.error("Error cargando informe detallado", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, proyecto.key]);

  const columns = [
    {
      title: "Proceso",
      dataIndex: "proceso",
      key: "proceso",
      fixed: "left",
    },
    // {
    //   title: "Etapa", // 👈 encabezado corregido
    //   dataIndex: "etapa",
    //   key: "etapa",
    //   width: 80,
    // },
    {
      title: "Piso", // 👈 ahora mostramos también el piso
      dataIndex: "piso",
      key: "piso",
      width: 80,
    },
    ...manzanas.map((manzana) => ({
      title: `Manzana ${manzana}`, // 👈 nombres dinámicos de manzanas
      dataIndex: manzana,
      key: `manzana_${manzana}`,
    })),
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <>
      <Tooltip title="Informe detallado">
        <Button
          type="primary"
          style={{ background: "#1638a2" }}
          onClick={showLoading}
          size="small"
        >
          <AiOutlineFileAdd />
        </Button>
      </Tooltip>

      <Modal
        title={
          <p>
            INFORME DETALLADO DEL PROYECTO:{" "}
            <span style={{ color: "blue" }}>
              {proyecto.descripcion_proyecto.toUpperCase()}
            </span>
          </p>
        }
        open={open}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            <Table
              dataSource={[...reporte].sort((a, b) => {
                // primero por etapa
                if (a.etapa !== b.etapa) {
                  return a.etapa - b.etapa;
                }
                // luego por orden
                return a.orden - b.orden;
              })}
              columns={columns}
              pagination={false}
              rowKey={(record) =>
                `${record.proceso}-${record.etapa}-${record.piso}`
              } // 👈 clave única
              bordered
              scroll={{ x: true }}
            />
            {/* <DescargarInforme id={IdProyecto} /> */}
          </>
        )}
      </Modal>
    </>
  );
};
