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
import { getMenus } from "@/services/config/menuAPI";
import { crearSubMenu, getSubMenu, updateSubMenu } from "@/services/config/submenusAPI";
import useSerialize from "@/hooks/useUpperCase";
import { Menu, SubMenu } from "@/types/auth.types";

export const FormSubmenu = () => {
  const [submenu, setSubmenu] = useState<SubMenu | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const isDataLoaded = useRef(false);

  // Formulario
  const control = useForm({
    defaultValues: {
      nom_smenu: "",
      desc_smenu: "",
      link_smenu: "",
      id_menu: "",
    },
  });

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (isDataLoaded.current) return;
    
    setLoading(true);
    setLoadingMenus(true);

    try {
      // Cargar menús
      const menusResponse = await getMenus();
      setMenus(menusResponse?.data || []);

      // Cargar submenú si es edición
      if (id) {
        const response = await getSubMenu(id);
        const submenuData = response?.data;
        setSubmenu(submenuData);

        if (submenuData) {
          control.reset({
            nom_smenu: submenuData.nom_smenu || "",
            desc_smenu: submenuData.desc_smenu || "",
            link_smenu: submenuData.link_smenu || "",
            id_menu: submenuData.id_menu?.toString() || "",
          });
        }
      }

      isDataLoaded.current = true;
    } catch (error: any) {
      notify.error("Error al cargar datos", error.message || "Revise la conexión");
    } finally {
      setLoading(false);
      setLoadingMenus(false);
    }
  }, [id, control]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Enviar formulario
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nom_smenu", "desc_smenu"]);
    setLoading(true);

    try {
      if (submenu) {
        // Editar
        await updateSubMenu(data, id);
        notify.success("Submenú actualizado", "Se ha actualizado correctamente");
        navigate("..");
      } else {
        // Crear
        await crearSubMenu(data);
        notify.success("Submenú creado", "Se ha creado correctamente");
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
            title={`${submenu ? "Editar" : "Crear"} submenú`}
            extra={
              <Space>
                <SaveButton loading={loading} />
                <Link to={submenu ? "../.." : ".."} relative="path">
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
                  children: <DatosBasicos submenu={submenu} menus={menus} /> 
                },
              ]}
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </LoadingSpinner>
  );
};