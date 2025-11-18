import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Row, Select, Form, Typography, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Servicios
import { getCargos } from "@/services/administrarUsuarios/carosAPI";
import { getEmpresas } from "@/services/administrarUsuarios/empresaAPI";
import { getPerfiles } from "@/services/administrarUsuarios/perfilesAPI";

// Notificaciones

// Types
import { Usuario } from "@/types/typesGlobal";
import { notify } from "@/components/global/NotificationHandler";

const { Text } = Typography;

interface Props {
  usuario?: Usuario | null;
}

interface SelectOption {
  label: string;
  value: number;
}

export const DatosPerfiles: React.FC<Props> = ({ usuario }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [loading, setLoading] = useState(true);

  // Estados para las opciones
  const [empresas, setEmpresas] = useState<SelectOption[]>([]);
  const [perfiles, setPerfiles] = useState<SelectOption[]>([]);
  const [cargos, setCargos] = useState<SelectOption[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [empresasRes, perfilesRes, cargosRes] = await Promise.all([
          getEmpresas(),
          getPerfiles(),
          getCargos(),
        ]);

        if (!isMounted) return;

        // Transformar datos de empresas
        let empresasData: any[] = [];
        if (empresasRes?.data?.data) {
          empresasData = empresasRes.data.data;
        } else if (empresasRes?.data) {
          empresasData = Array.isArray(empresasRes.data)
            ? empresasRes.data
            : [empresasRes.data];
        } else if (Array.isArray(empresasRes)) {
          empresasData = empresasRes;
        }

        setEmpresas(
          empresasData.map((emp: any) => ({
            label: emp.emp_nombre,
            value: emp.id,
          }))
        );

        // Transformar datos de perfiles
        let perfilesData: any[] = [];
        if (perfilesRes?.data) {
          perfilesData = Array.isArray(perfilesRes.data)
            ? perfilesRes.data
            : [perfilesRes.data];
        } else if (Array.isArray(perfilesRes)) {
          perfilesData = perfilesRes;
        }

        setPerfiles(
          perfilesData.map((perf: any) => ({
            label: perf.nom_perfil,
            value: perf.id,
          }))
        );

        // Transformar datos de cargos
        let cargosData: any[] = [];
        if (cargosRes?.data?.data) {
          cargosData = cargosRes.data.data;
        } else if (cargosRes?.data) {
          cargosData = Array.isArray(cargosRes.data)
            ? cargosRes.data
            : [cargosRes.data];
        } else if (Array.isArray(cargosRes)) {
          cargosData = cargosRes;
        }

        setCargos(
          cargosData.map((cargo: any) => ({
            label: cargo.nombre,
            value: cargo.id,
          }))
        );

        notify.success("Opciones cargadas correctamente");
      } catch (error) {
        console.error("Error al cargar datos:", error);
        notify.error(
          "Error al cargar las opciones del formulario",
          "Verifica tu conexión o contacta con soporte."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
          size="large"
        />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Cargando opciones...</Text>
        </div>
      </div>
    );
  }

  return (
    <Row gutter={[24, 16]}>
      <Col xs={24} md={8}>
        <Form.Item
          label="Empresa"
          required
          validateStatus={errors.empresas ? "error" : ""}
          help={errors.empresas?.message as string}
        >
          <Controller
            name="empresas"
            control={control}
            rules={{ required: "Empresa es requerida" }}
            render={({ field }) => (
              <Select
                {...field}
                options={empresas}
                placeholder={
                  empresas.length > 0
                    ? "Seleccione empresa"
                    : "No hay empresas disponibles"
                }
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                loading={loading}
                disabled={loading || empresas.length === 0}
              />
            )}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label="Perfil"
          required
          validateStatus={errors.perfiles ? "error" : ""}
          help={errors.perfiles?.message as string}
        >
          <Controller
            name="perfiles"
            control={control}
            rules={{ required: "Perfil es requerido" }}
            render={({ field }) => (
              <Select
                {...field}
                options={perfiles}
                placeholder={
                  perfiles.length > 0
                    ? "Seleccione perfil"
                    : "No hay perfiles disponibles"
                }
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                loading={loading}
                disabled={loading || perfiles.length === 0}
              />
            )}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label="Cargo"
          required
          validateStatus={errors.cargos ? "error" : ""}
          help={errors.cargos?.message as string}
        >
          <Controller
            name="cargos"
            control={control}
            rules={{ required: "Cargo es requerido" }}
            render={({ field }) => (
              <Select
                {...field}
                options={cargos}
                placeholder={
                  cargos.length > 0
                    ? "Seleccione cargo"
                    : "No hay cargos disponibles"
                }
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                loading={loading}
                disabled={loading || cargos.length === 0}
              />
            )}
          />
        </Form.Item>
      </Col>

      {/* Información adicional */}
      <Col span={24}>
        <div
          style={{
            marginTop: 16,
            padding: "16px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
          }}
        >
          <Text type="secondary">
            💼 <strong>Nota:</strong> Estos permisos determinan el acceso del
            usuario a diferentes módulos y funcionalidades del sistema.
          </Text>
        </div>
      </Col>
    </Row>
  );
};
