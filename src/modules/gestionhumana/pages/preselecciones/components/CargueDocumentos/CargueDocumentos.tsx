import { useEffect } from "react";
import { Props } from "../types";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

export const CargueDocumentos = ({ preseleccion }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    if (preseleccion) {
      methods.reset({
        documento: preseleccion.documento,
        nombre: preseleccion.nombre,
      });
    } else {
      methods.reset();
    }
  }, [preseleccion]);

  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  };

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="documento"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Documento es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Documento">
              <Input
                {...field}
                status={error && "error"}
                readOnly
                {...methods.register("documento")}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre completo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre completo">
              <Input
                {...field}
                placeholder="Nombre completo"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
                {...methods.register("nombre")}
                readOnly
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="hv"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Hoja de vida (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cedula"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Cédula 150% (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="pension"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Certificado fondo de pensión (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="cesantia"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Certificado fondo de cesantias (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="diplomaBachiller"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Acta/Diploma bachiller (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="titulo"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Acta/Diploma Universitario, técnico (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="certificadoLaboral1"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Certificado laboral 1 (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="certificadoLaboral2"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Certificado laboral 2 (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="foto"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf", "image/png", "image/jpeg"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF, JPG o PNG.";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Foto fondo blanco 3X4 (PDF o Imagen)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="rethus"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Documento rethus solo farmacia (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="resolucion"
          control={methods.control}
          rules={{
            validate: {
              fileType: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return validateFileType(files[0], ["application/pdf"])
                  ? true
                  : "Archivo no válido. Solo se permiten PDF";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true; // Permite vacío
                return files[0].size <= 2 * 1024 * 1024
                  ? true
                  : "El archivo no debe superar los 2 MB.";
              },
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem label="Documento resolución solo farmacia (PDF)">
              <Input
                status={error && "error"}
                type="file"
                accept=".pdf"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
