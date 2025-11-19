/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { GlobalCard } from "@/components/global/GlobalCard";
import { DatosBasicos } from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Space, Form } from "antd";
import { SaveButton } from "@/components/global/SaveButton";
import { BackButton } from "@/components/global/BackButton";
import { FormTabs } from "@/components/global/FormTabs";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";
import { notify } from "@/components/global/NotificationHandler";
import { crearCargo, getCargo, updateCargo } from "@/services/administrarUsuarios/carosAPI";
import useSerialize from "@/hooks/useUpperCase";
import { Cargo } from "@/types/typesGlobal";

export const FormCargos = () => {
  const [cargo, setCargo] = useState<Cargo | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const isDataLoaded = useRef(false);

  // Formulario
  const control = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_empresa: "",
      estado: "1",
    },
  });

  // Cargar cargo si es edición
  const loadCargo = useCallback(async () => {
    if (!id || isDataLoaded.current) return;
    setLoading(true);

    try {
      const response = await getCargo(id);
      const cargoData = response?.data;
      setCargo(cargoData);

      if (cargoData) {
        control.reset({
          nombre: cargoData.nombre || "",
          descripcion: cargoData.descripcion || "",
          id_empresa: cargoData.id_empresa?.toString() || "",
          estado: cargoData.estado?.toString() || "1",
        });
      }

      isDataLoaded.current = true;
    } catch (error: any) {
      notify.error("Error al cargar cargo", error.message || "Revise la conexión");
    } finally {
      setLoading(false);
    }
  }, [id, control]);

  useEffect(() => {
    loadCargo();
  }, [loadCargo]);

  // Enviar formulario
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nombre", "descripcion"]);
    setLoading(true);

    try {
      if (cargo) {
        // Editar
        await updateCargo(data, id);
        notify.success("Cargo actualizado", "Se ha actualizado correctamente");
        navigate("..");
      } else {
        // Crear
        await crearCargo(data);
        notify.success("Cargo creado", "Se ha creado correctamente");
        navigate(-1);
      }
    } catch (error: any) {
      notify.error("Error en la operación", error.message || "Intente nuevamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingSpinner spinning={loading}>
      <FormProvider {...control}>
        <Form layout="vertical" onFinish={control.handleSubmit(onFinish)} autoComplete="off">
          <GlobalCard
            title={`${cargo ? "Editar" : "Crear"} cargo`}
            extra={
              <Space>
                <SaveButton loading={loading} />
                <Link to={cargo ? "../.." : ".."} relative="path">
                  <BackButton />
                </Link>
              </Space>
            }
          >
            <FormTabs
              tabItems={[
                { 
                  key: "1", 
                  label: "Datos Básicos", 
                  children: <DatosBasicos cargo={cargo} /> 
                },
              ]}
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </LoadingSpinner>
  );
};