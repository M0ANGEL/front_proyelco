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
import { crearModulo, getModulo, updateModulo } from "@/services/administrarUsuarios/modulosAPI";
import useSerialize from "@/hooks/useUpperCase";
import { Modulo } from "@/types/auth.types";

export const FormModulo = () => {
  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const isDataLoaded = useRef(false);

  // Formulario
  const control = useForm({
    defaultValues: {
      cod_modulo: "",
      nom_modulo: "",
      desc_modulo: "",
      estado: "1",
    },
  });

  // Cargar módulo si es edición
  const loadModulo = useCallback(async () => {
    if (!id || isDataLoaded.current) return;
    setLoading(true);

    try {
      const response = await getModulo(id);
      const moduloData = response?.data;
      setModulo(moduloData);

      if (moduloData) {
        control.reset({
          cod_modulo: moduloData.cod_modulo || "",
          nom_modulo: moduloData.nom_modulo || "",
          desc_modulo: moduloData.desc_modulo || "",
          estado: moduloData.estado?.toString() || "1",
        });
      }

      isDataLoaded.current = true;
    } catch (error: any) {
      notify.error("Error al cargar módulo", error.message || "Revise la conexión");
    } finally {
      setLoading(false);
    }
  }, [id, control]);

  useEffect(() => {
    loadModulo();
  }, [loadModulo]);

  // Enviar formulario
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["cod_modulo", "nom_modulo", "desc_modulo"]);
    setLoading(true);

    try {
      if (modulo) {
        // Editar
        await updateModulo(data, id);
        notify.success("Módulo actualizado", "Se ha actualizado correctamente");
        navigate("..");
      } else {
        // Crear
        await crearModulo(data);
        notify.success("Módulo creado", "Se ha creado correctamente");
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
            title={`${modulo ? "Editar" : "Crear"} módulo`}
            extra={
              <Space>
                <SaveButton loading={loading} />
                <Link to={modulo ? "../.." : ".."} relative="path">
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
                  children: <DatosBasicos modulo={modulo} /> 
                },
              ]}
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </LoadingSpinner>
  );
};