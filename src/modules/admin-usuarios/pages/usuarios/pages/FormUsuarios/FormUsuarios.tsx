/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { GlobalCard } from "@/components/global/GlobalCard";
import { DatosBasicos, DatosPerfiles } from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Space, Form } from "antd";
import { crearUsuario, getUsuario, updateUsuario } from "@/services/administrarUsuarios/usuariosAPI";
import { SaveButton } from "@/components/global/SaveButton";
import { BackButton } from "@/components/global/BackButton";
import { FormTabs } from "@/components/global/FormTabs";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";
import useSerialize from "@/hooks/useUpperCase";
import { Usuario } from "@/types/typesGlobal";
import { notify } from "@/components/global/NotificationHandler";


export const FormUsuarios = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transformToUpperCase } = useSerialize();
  const isDataLoaded = useRef(false);

  // Formulario
  const control = useForm({
    defaultValues: {
      empresas: [],
      cargos: [],
      perfiles: [],
      nombre: "",
      cedula: "",
      telefono: "",
      rol: "",
      username: "",
      correo: "",
      password: "",
      can_config_telefono: "0",
    },
  });

  // Cargar usuario si es edición
  const loadUsuario = useCallback(async () => {
    if (!id || isDataLoaded.current) return;
    setLoading(true);

    try {
      const response = await getUsuario(id);
      const userData = response?.data?.data || response?.data || response;
      setUsuario(userData);

      if (userData?.user) {
        const u = userData.user;
        control.reset({
          nombre: u.nombre || "",
          cedula: u.cedula || "",
          telefono: u.telefono || "",
          rol: u.rol || "",
          username: u.username || "",
          correo: u.correo || "",
          password: "",
          can_config_telefono: u.can_config_telefono?.toString() || "0",
          empresas: userData.empresas?.[0]?.id_empresa || [],
          perfiles: userData.perfiles?.[0]?.id_perfil || [],
          cargos: userData.cargos?.[0]?.id_cargo || [],
        });
      }

      isDataLoaded.current = true;
    } catch (error: any) {
      notify.error("Error al cargar usuario", error.message || "Revise la conexión");
    } finally {
      setLoading(false);
    }
  }, [id, control]);

  useEffect(() => {
    loadUsuario();
  }, [loadUsuario]);

  // Enviar formulario
  const onFinish: SubmitHandler<any> = async (data) => {
    data = transformToUpperCase(data, ["nombre"]);
    setLoading(true);

    try {
      if (usuario) {
        // Editar
        await updateUsuario(data, id);
        notify.success("Usuario actualizado", "Se ha actualizado correctamente");
        navigate("..");
      } else {
        // Crear
        await crearUsuario(data);
        notify.success("Usuario creado", "Se ha creado correctamente");
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
            title={`${usuario ? "Editar" : "Crear"} usuario`}
            extra={
              <Space>
                <SaveButton loading={loading} />
                <Link to={usuario ? "../.." : ".."} relative="path">
                  <BackButton />
                </Link>
              </Space>
            }
          >
            <FormTabs
              tabItems={[
                { key: "1", label: "Datos Básicos", children: <DatosBasicos usuario={usuario} /> },
                { key: "2", label: "Perfiles", children: <DatosPerfiles usuario={usuario} />, forceRender: true },
              ]}
            />
          </GlobalCard>
        </Form>
      </FormProvider>
    </LoadingSpinner>
  );
};
