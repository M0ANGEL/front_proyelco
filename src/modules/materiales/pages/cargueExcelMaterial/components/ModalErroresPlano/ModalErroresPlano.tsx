import { Modal } from "antd";
import { List } from "antd";
import { Props } from "./types";

export const ModalErroresPlano = ({ open, setOpen, errores }: Props) => {
  const erroresValidos = Array.isArray(errores) ? errores : [];

   const erroresFaltantes = erroresValidos.find(err =>
    typeof err === "string" && err.includes("Faltan las siguientes columnas:")
  ) || "";

  const erroresAdicionales = erroresValidos.find(err =>
    typeof err === "string" && err.includes("Existen columnas adicionales no esperadas:")
  ) || "";

  // Errores relacionados con filas/celdas
  const erroresFilas = erroresValidos.filter(err =>
    typeof err === "string" && err.startsWith("Fila")
  );

  // Procesamos columnas faltantes y adicionales en arrays
  const columnasFaltantes = erroresFaltantes
    .replace("Faltan las siguientes columnas:", "")
    .split(",")
    .map(col => col.trim())
    .filter(col => col);

  const columnasAdicionales = erroresAdicionales
    .replace("Existen columnas adicionales no esperadas:", "")
    .split(",")
    .map(col => col.trim())
    .filter(col => col);

  return (
    <Modal
      open={open}
      footer={[]}
      title={"Listado Errores Archivo Plano Pacientes"}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      onCancel={() => {
        setOpen(false);
      }}
      width={800}
    >
       <div>
        {columnasFaltantes.length > 0 && (
          <>
            <h3>Columnas Faltantes</h3>
            <List
              bordered
              dataSource={columnasFaltantes}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </>
        )}

        {columnasAdicionales.length > 0 && (
          <>
            <h3>Columnas Adicionales</h3>
            <List
              bordered
              dataSource={columnasAdicionales}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </>
        )}

        {erroresFilas.length > 0 && (
          <>
            <h3>Errores en Filas</h3>
            <List
              bordered
              dataSource={erroresFilas}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </>
        )}

        {columnasFaltantes.length === 0 &&
          columnasAdicionales.length === 0 &&
          erroresFilas.length === 0 && (
            <p>No se encontraron errores.</p>
          )}
      </div>
    </Modal>
  );
};
