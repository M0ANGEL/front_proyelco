import { Badge, Button, Card, Descriptions, GetProps, Input, notification, Spin, Tooltip, Typography } from "antd";
import {
  StyledCard
} from "@/modules/common/layout/DashboardLayout/styled";
import type { DescriptionsProps } from 'antd';
import { GoDesktopDownload } from "react-icons/go";
import { ImNotification } from "react-icons/im";
import { descargarTxt, getCuv, statusApi } from "@/services/radicacion/ripsAPI";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Search } = Input;
type SearchProps = GetProps<typeof Input.Search>;

export const ListCuv = () => {
  const [dataResponse, setDataResponse] = useState<any>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);

  useEffect(() => {

    const testApi = async () => {
      const disponible = await statusApi();
  
      if (!disponible) {
        notification.error({
          message: "Error de conexión",
          description: "No se pudo establecer conexión con la API.",
        });
      } else {
        notification.success({
          message: "API disponible",
          description: "Conexión establecida correctamente.",
        });
      }
    };
    testApi();
  },[]);

  const onSearch: SearchProps['onSearch'] = (value) => {

    const cuv = value.trim();
    const cuvJson = { codigoUnicoValidacion: cuv };
    if (value.length == 0) {
      notificationApi.open({
        type: "error",
        message: "No has ingresado ningun cuv!",
      });
      setTimeout(() => {
        //
      }, 1500);
      return;
    }
    setLoading(true);

    getCuv(cuvJson)
      .then(({ data: { response } }) => {
        setDataResponse(response[0]);
        notificationApi.open({
          type: "success",
          message: `Archivo enviado con éxito!`,
        });
      })
      .catch((error) => {
        notificationApi.open({
          type: "error",
          message: "Error al consultar el CUV",
        });
      })
      .finally(() => {
        setLoading(false);
      });

  };

  const generarTxt = async () => {
    try {
      const blob = await descargarTxt(dataResponse);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Resultados_MSPS_${dataResponse.numeroDocumento}_ID${dataResponse.procesoId}_A_CUV.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      notificationApi.open({
        type: "error",
        message: "Ocurrió un error al intentar descargar el archivo.",
      });
    }
  }


  const items: DescriptionsProps['items'] = dataResponse ? [
    {
      key: 'ProcesoId',
      label: 'ProcesoId',
      children: dataResponse.procesoId,
    },
    {
      key: 'NumFactura',
      label: 'NumFactura',
      children: dataResponse.numeroDocumento,
    },
    {
      key: 'totalFactura',
      label: 'Total Factura',
      children: dataResponse.totalFactura,
    },
    {
      key: 'CodigoUnicoValidacion',
      label: 'CodigoUnicoValidacion',
      children: dataResponse.codigoUnicoValidacion,
      span: 3,
    },
    {
      key: 'FechaRadicacion',
      label: 'Fecha Radicacion',
      children: dataResponse.fechaValidacion,
    },
    {
      key: 'fechaEmision',
      label: 'Fecha Emision',
      children: dataResponse.fechaEmision,
      span: 2,
    },
    {
      key: 'ResultState',
      label: 'ResultState',
      children: dataResponse.esValido ? (
        <Badge status="success" text="true" size="default" />
      ) : (
        <Badge status="error" text="false" size="default" />
      ),
      span: 3,
    },
    {
      key: 'ResultadosValidacion',
      label: 'Resultados Validacion',
      children: (
        <>
          {dataResponse.resultadosValidacion?.map((item: any, index: any) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <b>Clase:</b> {item.Clase} <ImNotification color="rgb(246, 173, 16)" />
              <br />
              <b>Código:</b> {item.Codigo}
              <br />
              <b>Descripción:</b> {item.Descripcion}
              <br />
              <b>Observaciones:</b> {item.Observaciones}
              <br />
              <b>PathFuente:</b> {item.PathFuente}
              <br />
              <b>Fuente:</b> {item.Fuente}
              <br />
            </div>
          ))}
        </>
      ),
      span: 2,
    },
    {
      key: 'Generar',
      label: 'Generar Resultado txt',
      children: (
        <>
          <Tooltip title="Descarga" color={"rgb(246, 173, 16)"} >
            <Button type="primary" icon={<GoDesktopDownload />} size={"large"} onClick={generarTxt} />
          </Tooltip>

        </>
      ),
      span: 1,
    },
  ] : [];


  return (
    <>
      {contextHolder}
      <StyledCard title={<Title level={4}>CONSULTA CUV</Title>}>
        <Card>
          <Card type="inner" title="Codigo Unico de Validacion">
            <Search placeholder="Ingrese codigo cuv" onSearch={onSearch} enterButton />
          </Card>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Spin tip="Consultando CUV..." size="large" />
            </div>
          ) : (
            <Descriptions
              style={{ marginTop: 16 }}
              size="small"
              title="Resultados"
              bordered
              items={items}
            />
          )}
        </Card>
      </StyledCard>
    </>
  );
}