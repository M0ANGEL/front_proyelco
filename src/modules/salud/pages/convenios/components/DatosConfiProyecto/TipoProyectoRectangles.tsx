import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";

interface Tipo {
  value: number;
  label: string;
  tipoValidacion?: string;
  valor?: string;
}

interface Props {
  tipos: Tipo[];
  onChangeTipos: (nuevosTipos: Tipo[]) => void;
}

export const TipoProyectoRectangles = ({ tipos, onChangeTipos }: Props) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [disponibles, setDisponibles] = useState<Tipo[]>([]);
  const [confirmados, setConfirmados] = useState<Tipo[]>([]);
  const methods = useFormContext();

  useEffect(() => {
    setDisponibles(tipos);
    setConfirmados([]);
  }, [tipos]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === "disponibles" ? disponibles : confirmados;
    const destList =
      destination.droppableId === "disponibles" ? disponibles : confirmados;

    const [movedItem] = [...sourceList].splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      const reordered = [...sourceList];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      if (source.droppableId === "disponibles") {
        setDisponibles(reordered);
      } else {
        setConfirmados(reordered);
        onChangeTipos(reordered);
      }
    } else {
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
              borderColor: "#1890ff",
            }}
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, flex: 1 }}>
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
              <div style={{ marginTop: 5, width:'100%' }}>
                <Controller
                  name={`procesos[${index}].valor`}
                  control={methods.control}
                  render={({ field }) => (
                    <StyledFormItem required label="Nombre de validacion para pasar a la siguiente actividad:">
                      <TextArea
                        {...field}
                        placeholder="Texto dinámico para pregunta de validación"
                        maxLength={200}
                        onChange={(e) => {
                          field.onChange(e);
                          actualizarCampo(index, "valor", e.target.value);
                        }}
                        value={field.value}
                      />
                    </StyledFormItem>
                  )}
                />

                {/* <Controller
                  name={`procesos[${index}].pisosPorProceso`}
                  control={methods.control}
                  rules={{
                    required: "Pisos por proceso es requerido",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Pisos Cambio Proceso:">
                      <Input
                        {...field}
                        status={error && "error"}
                        placeholder="00"
                        onChange={(e) => {
                          field.onChange(e);
                          actualizarCampo(index, "tipoValidacion", e.target.value);
                        }}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                /> */}
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
              {confirmados.map((tipo, index) =>
                renderTarjeta(tipo, index, true)
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
