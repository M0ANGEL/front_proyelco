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
import { getModulos } from "@/services/administrarUsuarios/modulosAPI";
import { crearMenu, getMenu, updateMenu } from "@/services/config/menuAPI";
import useSerialize from "@/hooks/useUpperCase";
import { Menu, Modulo } from "@/types/auth.types";

export const FormMenu = () => {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingModulos, setLoadingModulos] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const isDataLoaded = useRef(false);

  // Formulario
  const control = useForm({
    defaultValues: {
      nom_menu: "",
      desc_menu: "",
      link_menu: "",
      id_modulo: "",
    },
  });

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (isDataLoaded.current) return;
    
    setLoading(true);
    setLoadingModulos(true);

    try {
      // Cargar módulos
      const modulosResponse = await getModulos();
      setModulos(modulosResponse?.data || []);

      // Cargar menú si es edición
      if (id) {
        const response = await getMenu(id);
        const menuData = response?.data;
        setMenu(menuData);

        if (menuData) {
          control.reset({
            nom_menu: menuData.nom_menu || "",
            desc_menu: menuData.desc_menu || "",
            link_menu: menuData.link_menu || "",
            id_modulo: menuData.id_modulo?.toString() || "",
          });
        }
      }

      isDataLoaded.current = true;
    } catch (error: any) {
      notify.error("Error al cargar datos", error.message || "Revise la conexión");
    } finally {
      setLoading(false);
      setLoadingModulos(false);
    }
  }, [id, control]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Enviar formulario
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nom_menu", "desc_menu"]);
    setLoading(true);

    try {
      if (menu) {
        // Editar
        await updateMenu(data, id);
        notify.success("Menú actualizado", "Se ha actualizado correctamente");
        navigate("..");
      } else {
        // Crear
        await crearMenu(data);
        notify.success("Menú creado", "Se ha creado correctamente");
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
            title={`${menu ? "Editar" : "Crear"} menú`}
            extra={
              <Space>
                <SaveButton loading={loading} />
                <Link to={menu ? "../.." : ".."} relative="path">
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
                  children: <DatosBasicos menu={menu} modulos={modulos} /> 
                },
              ]}
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </LoadingSpinner>
  );
};