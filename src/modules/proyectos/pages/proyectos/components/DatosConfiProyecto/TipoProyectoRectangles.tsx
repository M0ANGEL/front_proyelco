import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Input, Radio } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { StyledFormItem } from "@/components/layout/styled";

interface Tipo {
  value: number;
  label: string;
  tipoValidacion?: string;
  valor?: string;
  requiereValidacion?: "si" | "no";
  numCambioProceso?: string;
}

interface Props {
  tipos: Tipo[];
  tipoProyecto: string | null; // 👈 llega desde DatosConfigProyecto
  onChangeTipos: (nuevosTipos: Tipo[]) => void;
}

export const TipoProyectoRectangles = ({
  tipos,
  tipoProyecto,
  onChangeTipos,
}: Props) => {
  const [disponibles, setDisponibles] = useState<Tipo[]>([]);
  const [confirmados, setConfirmados] = useState<Tipo[]>([]);
  const methods = useFormContext();

  // 🔑 Configuración de procesos por tipo de proyecto
  const mapaTiposProyecto: Record<string, string[]> = {
    "1": [
      "fundida",
      "destapada",
      "prolongacion",
      "alambrada",
      "aparateada",
      "aparateada fase 2",
      "pruebas",
      "retie",
      "ritel",
      "entrega",
    ], //apartamentos
    "2": [
      "destapada",
      "prolongacion",
      "alambrada",
      "aparateada",
      "aparateada fase 2",
      "pruebas",
      "retie",
      "ritel",
      "entrega",
    ], //casas
  };

  // ⚡ Filtrado + preselección según tipoProyecto
  useEffect(() => {
    if (!tipoProyecto) return;

    const labelsPreSeleccionados = mapaTiposProyecto[tipoProyecto] || [];

    // ✅ Procesos confirmados (preseleccionados)
    const preSeleccionados: Tipo[] = [];
    labelsPreSeleccionados.forEach((label, i) => {
      const encontrado = tipos.find(
        (t) => t.label.toLowerCase() === label.toLowerCase()
      );
      if (encontrado) {
        preSeleccionados.push({
          ...encontrado,
          requiereValidacion: i === 0 ? "no" : undefined, // el primero sin validación
        });
      }
    });

    // ✅ Procesos disponibles (los que corresponden al tipoProyecto pero no están confirmados)
    const restantes = tipos.filter(
      (t) =>
        (mapaTiposProyecto[tipoProyecto] || []).includes(
          t.label.toLowerCase()
        ) && !labelsPreSeleccionados.includes(t.label.toLowerCase())
    );

    setConfirmados(preSeleccionados);
    setDisponibles(restantes);
    onChangeTipos(preSeleccionados);
  }, [tipoProyecto, tipos]);

  // 🔄 Drag & Drop
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === "disponibles" ? disponibles : confirmados;
    const destList =
      destination.droppableId === "disponibles" ? disponibles : confirmados;

    if (source.droppableId === destination.droppableId) {
      const reordered = [...sourceList];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      if (source.droppableId === "disponibles") {
        setDisponibles(reordered);
      } else {
        if (reordered.length > 0) reordered[0].requiereValidacion = "no";
        setConfirmados(reordered);
        onChangeTipos(reordered);
      }
    } else {
      const newSource = [...sourceList];
      const newDest = [...destList];
      const [moved] = newSource.splice(source.index, 1);

      newDest.splice(destination.index, 0, {
        ...moved,
        requiereValidacion: undefined,
      });

      if (source.droppableId === "disponibles") {
        setDisponibles(newSource);
        if (newDest.length > 0) newDest[0].requiereValidacion = "no";
        setConfirmados(newDest);
        onChangeTipos(newDest);
      } else {
        setDisponibles(newDest);
        if (newSource.length > 0) newSource[0].requiereValidacion = "no";
        setConfirmados(newSource);
        onChangeTipos(newSource);
      }
    }
  };

  // ✏️ Actualizar campos dentro de cada tarjeta
  const actualizarCampo = (
    index: number,
    campo: keyof Tipo,
    nuevoValor: string
  ) => {
    const nuevos = [...confirmados];
    nuevos[index][campo] = nuevoValor;

    if (campo === "requiereValidacion" && nuevoValor === "no") {
      nuevos[index].valor = "";
    }

    setConfirmados(nuevos);
    onChangeTipos(nuevos);
  };

  // 🎴 Render tarjeta
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
              cursor: isConfirmado ? "default" : "grab",
              backgroundColor: isConfirmado ? "#e6f7ff" : "#f5f5f5",
              borderColor: "#1890ff",
            }}
            title={<strong>{`${index + 1}. ${tipo.label}`}</strong>}
          >
            {isConfirmado && (
              <>
                <StyledFormItem
                  required
                  label="¿Este proceso requiere validación?"
                >
                  <Radio.Group
                    onChange={(e) =>
                      actualizarCampo(
                        index,
                        "requiereValidacion",
                        e.target.value
                      )
                    }
                    value={tipo.requiereValidacion}
                    disabled={tipoProyecto == "1" && index === 0}
                  >
                    <Radio value="si">Sí</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </StyledFormItem>

                {tipo.requiereValidacion === "si" && (
                  <Controller
                    name={`procesos[${index}].valor`}
                    control={methods.control}
                    rules={{
                      required:
                        "Este campo es obligatorio si se seleccionó 'Sí'",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem
                        required
                        label="Validación necesaria para iniciar:"
                      >
                        <TextArea
                          {...field}
                          placeholder="Ingrese la validación"
                          maxLength={200}
                          onChange={(e) => {
                            field.onChange(e);
                            actualizarCampo(index, "valor", e.target.value);
                          }}
                          value={field.value}
                          status={error ? "error" : ""}
                        />
                      </StyledFormItem>
                    )}
                  />
                )}

                {tipoProyecto == "1" && (
                  <>
                    {index > 0 && (
                      <Controller
                        name={`procesos[${index}].numCambioProceso`}
                        control={methods.control}
                        render={({ field }) => (
                          <StyledFormItem
                            required
                            label="Número de cambio de proceso"
                          >
                            <Input
                              {...field}
                              type="number"
                              placeholder="Ingrese el número"
                              onChange={(e) => {
                                field.onChange(e);
                                actualizarCampo(
                                  index,
                                  "numCambioProceso",
                                  e.target.value
                                );
                              }}
                              value={field.value}
                            />
                          </StyledFormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );

  // 🖼️ Render
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
                border: "1px solid rgb(172, 168, 168)",
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
