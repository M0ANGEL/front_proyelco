import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Select, Input, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Tipo {
  value: number;
  label: string;
  tipoValidacion?: string;
  valor?: string;
}

interface Props {
  tipos: Tipo[];
  value: number | null;
  onSelect: (id: number) => void;
  onChangeTipos: (nuevosTipos: Tipo[]) => void;
}

export const TipoProyectoRectangles = ({
  tipos,
  value,
  onSelect,
  onChangeTipos,
}: Props) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [disponibles, setDisponibles] = useState<Tipo[]>([]);
  const [confirmados, setConfirmados] = useState<Tipo[]>([]);

  useEffect(() => {
    setDisponibles(tipos);
    setConfirmados([]); // Si quieres precargar valores, cámbialo aquí
  }, [tipos]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === "disponibles" ? disponibles : confirmados;
    const destList =
      destination.droppableId === "disponibles" ? disponibles : confirmados;

    const [movedItem] = [...sourceList].splice(source.index, 1);

    // Si es dentro de la misma lista (reordenar)
    if (source.droppableId === destination.droppableId) {
      const reordered = [...sourceList];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      if (source.droppableId === "disponibles") {
        setDisponibles(reordered);
      } else {
        setConfirmados(reordered);
        onChangeTipos(reordered); // Actualiza orden en el padre
      }
    } else {
      // Mover entre listas
      const newSource = [...sourceList];
      const newDest = [...destList];
      const [moved] = newSource.splice(source.index, 1);
      newDest.splice(destination.index, 0, moved);

      if (source.droppableId === "disponibles") {
        setDisponibles(newSource);
        setConfirmados(newDest);
        onChangeTipos(newDest);
      } else {
        setDisponibles(newDest);
        setConfirmados(newSource);
        onChangeTipos(newSource);
      }
    }
  };

  const actualizarCampo = (
    index: number,
    campo: "tipoValidacion" | "valor",
    nuevoValor: string
  ) => {
    const nuevos = [...confirmados];
    nuevos[index][campo] = nuevoValor;
    setConfirmados(nuevos);
    onChangeTipos(nuevos);
  };

  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderTarjeta = (tipo: Tipo, index: number, isConfirmado: boolean) => (
    <Draggable key={tipo.value} draggableId={String(tipo.value)} index={index}>
      {(providedDraggable) => (
        <div
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
          style={{
            marginBottom: 12,
            ...providedDraggable.draggableProps.style,
          }}
        >
          <Card
            style={{
              cursor: "pointer",
              backgroundColor: isConfirmado ? "#e6f7ff" : "#f5f5f5",
              borderColor: value === tipo.value ? "#1890ff" : undefined,
            }}
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  onClick={() => onSelect(tipo.value)}
                  style={{ fontWeight: 600, flex: 1 }}
                >
                  {`${index + 1}. ${tipo.label}`}
                </span>
                <Button
                  icon={<SettingOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen(tipo.value);
                  }}
                />
              </div>
            }
          >
            {isConfirmado && openId === tipo.value && (
              <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                <Select
                  placeholder="Tipo validación"
                  value={tipo.tipoValidacion}
                  onChange={(val) =>
                    actualizarCampo(index, "tipoValidacion", val)
                  }
                  style={{ width: 200 }}
                >
                  <Option value="0">Por Piso</Option>
                  <Option value="1">Por Apt</Option>
                  <Option value="2">Confirmación</Option>
                </Select>
                <Input
                  placeholder="Valor"
                  value={tipo.valor}
                  onChange={(e) =>
                    actualizarCampo(index, "valor", e.target.value)
                  }
                  style={{ width: 200 }}
                />
              </div>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Disponibles */}
        <Droppable droppableId="disponibles">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                flex: 1,
                padding: 8,
                background: "#fafafa",
                border: "1px solid #d9d9d9",
                borderRadius: 8,
              }}
            >
              <h4>Procesos disponibles</h4>
              {disponibles.map((tipo, index) =>
                renderTarjeta(tipo, index, false)
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Seleccionados */}
        <Droppable droppableId="confirmados">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                flex: 1,
                padding: 8,
                background: "#e6f7ff",
                border: "1px solid #91d5ff",
                borderRadius: 8,
              }}
            >
              <h4>Procesos seleccionados</h4>
              {confirmados.map((tipo, index) => (
                <div key={tipo.value}>
                  {renderTarjeta(tipo, index, true)}

                  {/* Inputs ocultos para enviar en el formulario padre */}
                  <input
                    type="hidden"
                    name={`tipos[${index}][tipoValidacion]`}
                    value={tipo.tipoValidacion || ""}
                  />
                  <input
                    type="hidden"
                    name={`tipos[${index}][valor]`}
                    value={tipo.valor || ""}
                  />
                </div>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
