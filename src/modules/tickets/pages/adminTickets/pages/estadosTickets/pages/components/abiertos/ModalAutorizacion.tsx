import {
  Button,
  Col,
  Modal,
  Row,
  Select,
  SelectProps,
  Spin,
  Tooltip,
} from "antd";
import { useState } from "react";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { AsignarTkTicketAutorizar } from "@/services/tickets/administracionAPI";
import { HiArrowCircleRight } from "react-icons/hi";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getTkProcesosSub,
  getTkUsuariosProceso,
} from "@/services/tickets/subcategoriasAPI";

// Interfaces
interface DataId {
  fetchList: () => void;
  pushNotification: (message: { title: string; type?: string }) => void;
  dataTicket: DataTypeA;
}

interface DataTypeA {
  key: number;
  id: number;
  created_at: string;
  prioridad: string;
  detalle: string;
  estado: string;
  numero_ticket: string;
  autorizacion: string;
  nombre_autorizador: string | null;
  respuesta_autorizacion: string | null;
  userSoluciona_id: number | null;
  categoria: string;
  subcategoria: string;
  creador_ticket: string;
  bodega: string;
  idLogueado: number;
  usuarioGestiona: string | null;
  documento: number;
  nombre_proceso: string;
  vencido: boolean;
  usuarioAsignado: string | null;
}

export const ModalAutorizacion = ({
  fetchList,
  pushNotification,
  dataTicket,
}: DataId) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectProcesos, setSelectProcesos] = useState<SelectProps["options"]>(
    []
  );
  const [usuariosProceso, setUsuariosProceso] = useState<
    SelectProps["options"]
  >([]);
  const [loaderEmp, setLoaderEmp] = useState<boolean>(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<number[]>(
    []
  );

  //show
  const showLoading = () => {
    setOpen(true);
    fetchProcesos();
  };

  // Asignar ticket
  const AsinamientoTicket = () => {
    if (usuariosSeleccionados.length === 0) {
      pushNotification({
        title: "Debes seleccionar al menos un usuario",
        type: "warning",
      });
      return;
    }

    const asignacionData = {
      id: dataTicket.id,
      usuarios: usuariosSeleccionados,
    };

    let hasError = false;

    AsignarTkTicketAutorizar(asignacionData)
      .then(() => {
        pushNotification({
          title: "Ticket Asignado",
          type: "success",
        });
        fetchList();
      })
      .catch((err) => {
        hasError = true;

        let errorMessage = "Ocurrió un error inesperado";

        // Verificamos si la respuesta tiene un mensaje específico del backend
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        pushNotification({
          title: `❌ Error: ${errorMessage}`,
          type: "error",
        });
      })
      .finally(() => {
        if (!hasError) {
          setOpen(false); // Solo cierra el modal si no hubo error
        }
      });
  };

  //llamada para los usuarios del proceso
  const fetchUserProcesos = async (categoriaId: number) => {
    setLoaderEmp(true);
    if (!categoriaId) {
      setUsuariosProceso([]);
      return;
    }
    try {
      const response = await getTkUsuariosProceso(categoriaId);
      const usuariosproce = response?.data?.data || [];
      setUsuariosProceso(
        usuariosproce.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
      setLoaderEmp(false);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
    }
  };

  const fetchProcesos = () => {
    getTkProcesosSub().then(({ data: { data } }) => {
      const Procesos = data.map((item) => ({
        label: item.nombre_proceso,
        value: item.id,
      }));

      setSelectProcesos(Procesos);
    });
  };

  //retorno de boton
  const buttonRetorno = () => {
    return (
      <Tooltip title={"Solicitar autorizacion"}>
        <Button
          type="primary"
          style={{ background: "#830639" }}
          onClick={showLoading}
          size="small"
        >
          <HiArrowCircleRight />
        </Button>
      </Tooltip>
    );
  };

  //jsx
  return (
    <>
      {buttonRetorno()}
      <Modal
        title={
          <p>
            INFORMACION DEL TICKET{" "}
            <span style={{ color: "#23840d" }}>
              {dataTicket?.numero_ticket}
            </span>{" "}
          </p>
        }
        footer={
          <>
            {dataTicket?.estado === "Gestio" ||
            dataTicket?.usuarioAsignado !== null ? (
              <h4>
                Salir de gestion del ticket para poder solicitar autorizacion
              </h4>
            ) : (
              <Button
                style={{
                  background: "blue",
                  color: "white",
                }}
                type="primary"
                onClick={AsinamientoTicket}
              >
                Solicitar autorización
              </Button>
            )}
          </>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={800}
      >
        <Row gutter={24}>
          {/* campo selecion de proceso */}
          <Col xs={24} sm={24} style={{ width: "100%" }}>
            <StyledFormItem required label="Proceso" labelCol={{ span: 24 }}>
              <Select
                options={selectProcesos}
                onSelect={(value) => {
                  fetchUserProcesos(value);
                }}
              />
            </StyledFormItem>
          </Col>
          {/* campo selecion de usuarios que van proceso y podran autorizar autoriza */}
          <Col xs={24} sm={24}>
            <StyledFormItem
              required
              label="Usuario Autoriza"
              labelCol={{ span: 24 }}
            >
              <Spin spinning={loaderEmp} indicator={<LoadingOutlined spin />}>
                {/*  <Select
                  // mode="multiple" se quita el multiple mientras
                  showSearch
                  allowClear
                  options={usuariosProceso}
                  placeholder={
                    usuariosProceso?.length
                      ? "Selecciona uno o más usuarios"
                      : "NO HAY USUARIOS PARA ESTE PROCESO"
                  }
                  style={{ width: "100%" }}
                  onChange={(value) => setUsuariosSeleccionados(value)} // Capturar selección
                  tokenSeparators={[","]}
                /> */}

                <Select
                  showSearch
                  allowClear
                  options={usuariosProceso}
                  placeholder={
                    usuariosProceso?.length
                      ? "Selecciona un usuario"
                      : "NO HAY USUARIOS PARA ESTE PROCESO"
                  }
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    setUsuariosSeleccionados(value ? [value] : [])
                  } // Guardar como array
                  tokenSeparators={[","]}
                />
              </Spin>
            </StyledFormItem>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
