import { Modal, notification, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { getActivos } from "@/services/activos/activosAPI"; // Asegúrate de importar correctamente getActivos
import {
  DepreciacionActivo,
  ResponseActivos,
} from "@/services/types";
import { getDepreciacion } from "@/services/activos/trazabilidadDepreciacionAPI";

interface DepreciationModalProps {
  idActivo: number; // Recibe el ID del activo como prop
  visible: boolean;
  onClose: () => void;
}


export const DepreciacionActivoModal: React.FC<DepreciationModalProps> = ({
  idActivo,
  visible,
  onClose,
}) => {
  const [activo, setActivo] = useState<ResponseActivos | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [responseDepreciacion, setResponseDepreciacion] =
    useState<DepreciacionActivo>(); 

  useEffect(() => {
    if (visible && idActivo) {
      const fetchActivo = async () => {
        setLoading(true);
        try {
          const activoData = await getActivos(idActivo);
          setActivo(activoData); 
          setLoading(false);
        } catch (err) {
          console.error("Error al obtener el activo:", err);
          setError("No se pudo obtener la información del activo.");
          setLoading(false);
        }
      };

      fetchActivo();
    }
  }, [idActivo, visible]);

  useEffect(() => {
    const calcularDepreciacion = async () => {
      if (activo && activo.data && activo.data.data.id) {
        try {
          const {
            data: { data },
          } = await getDepreciacion(idActivo);
          if (data) {
            // setDepreciacion(response.data.data.valor_presente);
            console.log(data);
            setResponseDepreciacion(data);

            setError(null);
          } else {
            setError("No se pudo calcular la depreciación.");
          }
        } catch (err) {
          console.error("Error al calcular la depreciación:", err);
          setError("No se pudo calcular la depreciación.");
        }
      } else {
        notification.error({ message: "Activo no valido o no definido" });
      }
    };

    if (activo) {
      calcularDepreciacion();
    }
  }, [activo]);

  useEffect(() => {}, [ responseDepreciacion]);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={`Depreciación Anual para ${
        activo?.data.data.nombre || "Activo ID: " + idActivo
      }`}
    >
      {loading ? (
        <Spin tip="Cargando información del activo..." />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <p>
            Costo Actual del activo al mes presente es{" "}
            <strong>{responseDepreciacion?.valor_presente}</strong>
          </p>
          <p>
            Vida útil presente:{" "}
            <strong>{responseDepreciacion?.vida_util_presente}</strong>
          </p>
        </div>
      )}
    </Modal>
  );
};
