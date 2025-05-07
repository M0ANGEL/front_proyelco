/* eslint-disable react-hooks/exhaustive-deps */
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";
import { notification, Typography, TabsProps, Button, Tabs, Alert } from "antd";
import { getAlertasDistCompras } from "@/services/distribucion/distComprasAPI";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { validarAccesoDocumento } from "@/services/documentos/trsAPI";
import { AlertaDistribucion, Privilegios } from "@/services/types";
import { FileOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KEY_BODEGA, KEY_EMPRESA, KEY_ROL } from "@/config/api";
import { useState, useEffect } from "react";
import {
  ModalAlertasDistribucion,
  ListDistribucionCompra,
} from "../../components";

const { Text } = Typography;

export const ListTRS = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [alertasDistribucion, setAlertasDistribucion] = useState<
    AlertaDistribucion[]
  >([]);
  const [openModalAlertas, setOpenModalAlertas] = useState<boolean>(false);
  const [privilegios, setPrivilegios] = useState<Privilegios>();
  const { getSessionVariable } = useSessionStorage();
  const user_rol = getSessionVariable(KEY_ROL);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const url_split = location.pathname.split("/");
    const codigo_documento = url_split[url_split.length - 1];
    if (codigo_documento) {
      validarAccesoDocumento(
        codigo_documento.toUpperCase(),
        getSessionVariable(KEY_EMPRESA)
      ).then(({ data: { data } }) => {
        if (data) {
          setPrivilegios(data);
        } else {
          notificationApi.open({
            type: "error",
            message: "No tienes permisos para acceder a este documento!",
          });
          setTimeout(() => {
            navigate(`/${url_split.at(1)}`);
          }, 1000);
        }
      });
    }
    if (["administrador", "regente", "cotizaciones"].includes(user_rol)) {
      getAlertasDistCompras({ bodega_id: getSessionVariable(KEY_BODEGA) }).then(
        ({ data: { data } }) => {
          setAlertasDistribucion(data);
        }
      );
    }
  }, []);

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Pendientes",
      children: (
        <ListarDocumentos privilegios={privilegios} tab={"pendientes"} />
      ),
    },
    {
      key: "3",
      label: "Cerrado",
      children: <ListarDocumentos privilegios={privilegios} tab={"cerrado"} />,
    },
    {
      key: "4",
      label: "Anulados",
      children: <ListarDocumentos privilegios={privilegios} tab={"anulados"} />,
    },
  ];

  if (["administrador", "regente", "cotizaciones"].includes(user_rol)) {
    tabs.push({
      key: "5",
      label: "Distribución Compra",
      children: <ListDistribucionCompra />,
    });
  }

  return (
    <>
      {contextHolder}
      <ModalAlertasDistribucion
        open={openModalAlertas}
        setOpen={(value: boolean) => setOpenModalAlertas(value)}
        alertasDistribucion={alertasDistribucion}
      />
      <StyledCard
        title={
          <Text>
            <FileTextOutlined />
            {" " + privilegios?.documento_info.descripcion}
          </Text>
        }
        extra={
          privilegios?.crear == "1" ? (
            <Link to={`${location.pathname}/create`}>
              <Button type="primary" icon={<FileOutlined />}>
                Crear
              </Button>
            </Link>
          ) : (
            <></>
          )
        }
      >
        {["administrador", "regente", "cotizaciones"].includes(user_rol) &&
        alertasDistribucion.length > 0 ? (
          <Alert
            banner
            type="info"
            message={
              "Tienes un total de " +
              alertasDistribucion.length +
              " items con ingresos y pendientes por trasladar "
            }
            action={
              <Button type="text" onClick={() => setOpenModalAlertas(true)}>
                Ver detalles
              </Button>
            }
          />
        ) : null}

        <Tabs items={tabs} animated />
      </StyledCard>
    </>
  );
};
