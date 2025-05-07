/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  StyledCard,
  StyledFormItem,
} from "@/modules/common/layout/DashboardLayout/styled";
import { LoadingOutlined } from "@ant-design/icons";
import { FaFileDownload } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import {
  getLogBodegas,
  getLogEmpresas,
  getLogPerfilXUsu,
  getLogPerfiles,
  getLogUsuarios,
  getLogProductos,
  getLogProductoLotes,
  getLogTerceros,
  getLogUserSessions,
  getLogTrEntradas,
  getLogTrSalidas,
  getLogCuotasModeradoras,
  getLogPacientes,
  getLogConvenios,
  getLogsMotivosAUD,
} from "@/services/informes/logsAPI";
import fileDownload from "js-file-download";
import { getLogAuditoria } from "@/services/auditar/auditarAPI";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const optionsCheckbox = [
  { label: "Usuarios", value: "usuarios" },
  { label: "Empresas", value: "empresas" },
  { label: "Bodegas", value: "bodegas" },
  { label: "Perfiles", value: "perfiles" },
  { label: "Perfiles x Usuario", value: "perxemp" },
  { label: "Productos", value: "productos" },
  { label: "Productos - Lotes", value: "productoLotes" },
  { label: "Terceros", value: "terceros" },
  { label: "Usuarios - Sessiones", value: "usuarioSessiones" },
  { label: "Traslados - Entradas", value: "trEntradas" },
  { label: "Traslados - Salidas", value: "trSalidas" },
  { label: "Cuotas Moderadoras", value: "cuotasModeradora" },
  { label: "Pacientes", value: "pacientes" },
  { label: "Auditoría", value: "auditoria" },
  { label: "Convenios", value: "convenios" },
  { label: "Motivos Auditoría", value: "motivosAuditoria" },
];

export const LogsPage = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const control = useForm();

  const onFinish: SubmitHandler<any> = async (data) => {
    setLoader(true);
    console.log(data);
    const startDate = dayjs(data.fechas.at(0)).format("YYYY-MM-DD");
    const endDate = dayjs(data.fechas.at(1)).format("YYYY-MM-DD");
    console.log(startDate);
    switch (data.tipo_informe) {
      case "usuarios":
        getLogUsuarios(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsUsuarios.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "empresas":
        getLogEmpresas(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsEmpresas.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "bodegas":
        getLogBodegas(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsBodegas.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "perfiles":
        getLogPerfiles(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsPerfiles.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "perxemp":
        getLogPerfilXUsu(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsPerfilesXUsuario.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "productos":
        getLogProductos(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsProductos.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "productoLotes":
        getLogProductoLotes(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsProductoLotes.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "terceros":
        getLogTerceros(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsTerceros.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "usuarioSessiones":
        getLogUserSessions(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsUsuarioSessiones.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "trEntradas":
        getLogTrEntradas(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsTrEntradas.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "trSalidas":
        getLogTrSalidas(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsTrSalidas.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "cuotasModeradora":
        getLogCuotasModeradoras(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogscuotaModeradoras.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "pacientes":
        getLogPacientes(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsPacientes.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "auditoria":
        getLogAuditoria(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsAuditoria.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "convenios":
        getLogConvenios(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsConvenios.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
      case "motivosAuditoria":
        getLogsMotivosAUD(startDate, endDate)
          .then(({ data }) => {
            fileDownload(data, "LogsMotivosAUD.xlsx");
            setLoader(false);
          })
          .finally(() => setLoader(false));
        break;
    }
  };
  return (
    <>
      <StyledCard>
        <Form
          layout="vertical"
          onFinish={control.handleSubmit(onFinish)}
          autoComplete="off"
          size="large"
        >
          <Row gutter={[24, 12]}>
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <Controller
                control={control.control}
                name="fechas"
                rules={{
                  required: {
                    value: true,
                    message: "Rango de fechas es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Rango de fechas:">
                    <RangePicker
                      {...field}
                      status={error && "error"}
                      style={{ width: "100%" }}
                      placeholder={["Inicio", "Fin"]}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
            <Col xs={24} sm={12} style={{ width: "100%" }}>
              <Controller
                control={control.control}
                name="tipo_informe"
                rules={{
                  required: {
                    value: true,
                    message: "Tipo de informe es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Tipo de informe:">
                    <Select
                      {...field}
                      options={optionsCheckbox}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label?.toString() ?? "")
                          .toLowerCase()
                          .includes(input.toString().toLowerCase())
                      }
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>

            <Col xs={24} sm={24}>
              <Spin
                spinning={loader}
                indicator={<LoadingOutlined spin style={{ color: "white" }} />}
              >
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<FaFileDownload />}
                  block
                >
                  Generar
                </Button>
              </Spin>
            </Col>
          </Row>
        </Form>
      </StyledCard>
    </>
  );
};
