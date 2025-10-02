import { Button, Modal, Tooltip, Table, Spin } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { Proyectodetallado } from "@/services/proyectos/gestionProyectoAPI";
import { DescargarInforme } from "./descargaArchivos";

interface DataId {
  proyecto: DataTypeA;
}

interface DataTypeA {
  key: number;
  descripcion_proyecto: string;
}

interface ReporteFila {
  proceso: string;
  [key: string]: string;
}

export const ModalInforme = ({ proyecto }: DataId) => {
  const [open, setOpen] = useState(false);
  const [reporte, setReporte] = useState<ReporteFila[]>([]);
  const [torres, setTorres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [IdProyecto, setIdProyecto] = useState<number>(0);

  const showLoading = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      Proyectodetallado(Number(proyecto.key))
        .then(({ data }) => {
          if (data.success) {
            setReporte(data.data.reporte);
            setTorres(data.data.torres);
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
  }, [open]);


  const columns = [
    {
      title: "Proceso",
      dataIndex: "proceso",
      key: "proceso",
      fixed: "left",
    },
    ...torres.map((torre) => ({
      title: `Torre ${torre}`,
      dataIndex: torre,
      key: `torre_${torre}`,
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
              dataSource={reporte}
              columns={columns}
              pagination={false}
              rowKey="proceso"
              bordered
              scroll={{ x: true }}
            />
            <DescargarInforme id={IdProyecto} />
          </>
        )}
      </Modal>
    </>
  );
};
