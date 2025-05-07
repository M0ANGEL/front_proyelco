import { useEffect, useState } from "react";
import { Descriptions, Divider, Modal, Tooltip } from "antd";
import { Props } from "./types";
import { getEmpleado } from "@/services/gestion-humana/empleadosAPI";
import { EmpleadoShow, Otrosi } from "@/services/types";
import React from "react";

export const ModalVerEmpleado = ({ open, setOpen, id_empleado }: Props) => {
  const [empleado, setEmpleado] = useState<EmpleadoShow>();
  const [otrosis, setOtrosis] = useState<Otrosi[]>([]);

  useEffect(() => {
    if (open && id_empleado) {
      getEmpleado(id_empleado.toString()).then((response) => {
        setEmpleado(response.data.data);
        setOtrosis(response.data.otrosis);
      });
    }
  }, [id_empleado]);

  const datosAprendiz = () => {
    if (empleado?.contrato == "APRENDIZAJE") {
      return (
        <Descriptions
          title="Datos Aprendizaje"
          bordered
          column={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          size="small"
        >
          <Descriptions.Item label="Especialiadad">
            {empleado?.especialidad_curso ? (
              <Tooltip title={empleado.especialidad_curso}>
                {empleado.especialidad_curso.length > 25
                  ? `${empleado.especialidad_curso.substring(0, 25)}...`
                  : empleado.especialidad_curso}
              </Tooltip>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Instituto">
            {empleado?.instituto_formacion ? (
              <Tooltip title={empleado.instituto_formacion}>
                {empleado.instituto_formacion.length > 25
                  ? `${empleado.instituto_formacion.substring(0, 25)}...`
                  : empleado.instituto_formacion}
              </Tooltip>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Nit Instituto">
            {empleado?.nit_instituto_formacion}
          </Descriptions.Item>
          <Descriptions.Item label="Centro Formación">
            {empleado?.centro_formacion ? (
              <Tooltip title={empleado.centro_formacion}>
                {empleado.centro_formacion.length > 25
                  ? `${empleado.centro_formacion.substring(0, 25)}...`
                  : empleado.centro_formacion}
              </Tooltip>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
        </Descriptions>
      );
    }
  };

  return (
    <Modal
      open={open}
      destroyOnClose
      width="80%"
      onCancel={() => setOpen(false)}
      title={"DETALLES EMPLEADO"}
      key={`modal-empleado`}
      footer={[]}
      style={{ top: 10 }}
    >
      <Descriptions
        title="Información Personal"
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        size="small"
      >
        <Descriptions.Item label="Nombre Completo">
          {empleado?.nombre_completo ? (
            <Tooltip title={empleado.nombre_completo}>
              {empleado.nombre_completo.length > 25
                ? `${empleado.nombre_completo.substring(0, 25)}...`
                : empleado.nombre_completo}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Cédula">{empleado?.cedula}</Descriptions.Item>
        <Descriptions.Item label="Teléfono">
          {empleado?.telefono}
        </Descriptions.Item>
        <Descriptions.Item label="Correo">
          {empleado?.correo ? (
            <Tooltip title={empleado.correo}>
              {empleado.correo.length > 25
                ? `${empleado.correo.substring(0, 25)}...`
                : empleado.correo}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Nacimiento">
          {empleado?.fecha_nacimiento}
        </Descriptions.Item>
        <Descriptions.Item label="Ciudad de Nacimiento">
          {empleado?.ciudad_nacimiento}
        </Descriptions.Item>
        <Descriptions.Item label="Ciudad de Residencia">
          {empleado?.ciudad_residencia}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {empleado?.direccion_residencia ? (
            <Tooltip title={empleado.direccion_residencia}>
              {empleado.direccion_residencia.length > 25
                ? `${empleado.direccion_residencia.substring(0, 25)}...`
                : empleado.direccion_residencia}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Contacto de Emergencia">
          {empleado?.contacto_emergencia ? (
            <Tooltip title={empleado.contacto_emergencia}>
              {empleado.contacto_emergencia.length > 25
                ? `${empleado.contacto_emergencia.substring(0, 25)}...`
                : empleado.contacto_emergencia}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title="Información Afiliaciones"
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        size="small"
      >
        <Descriptions.Item label="Pensiones">
          {empleado?.pensiones ? (
            <Tooltip title={empleado.pensiones}>
              {empleado.pensiones.length > 25
                ? `${empleado.pensiones.substring(0, 25)}...`
                : empleado.pensiones}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Cesantías">
          {empleado?.cesantias ? (
            <Tooltip title={empleado.cesantias}>
              {empleado.cesantias.length > 25
                ? `${empleado.cesantias.substring(0, 25)}...`
                : empleado.cesantias}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="EPS">{empleado?.eps}</Descriptions.Item>
        <Descriptions.Item label="Caja Compensaciones">
          {empleado?.caja_compensaciones}
        </Descriptions.Item>
        <Descriptions.Item label="Riesgo ARL">
          {empleado?.riesgo_arl ? (
            <Tooltip title={empleado.riesgo_arl}>
              {empleado.riesgo_arl.length > 25
                ? `${empleado.riesgo_arl.substring(0, 25)}...`
                : empleado.riesgo_arl}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Inclusiones Caja">
          {empleado?.inclusiones_caja}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title="Información Laboral"
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        size="small"
      >
        <Descriptions.Item label="Tipo Contrato">
          {empleado?.contrato}
        </Descriptions.Item>
        <Descriptions.Item label="Convenio">
          {empleado?.rh_convenio ? (
            <Tooltip title={empleado.rh_convenio}>
              {empleado.rh_convenio.length > 25
                ? `${empleado.rh_convenio.substring(0, 25)}...`
                : empleado.rh_convenio}
            </Tooltip>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Cargo">{empleado?.cargo}</Descriptions.Item>
        <Descriptions.Item label="Salario">
          ${empleado?.salario}
        </Descriptions.Item>
        <Descriptions.Item label="Banco">{empleado?.banco}</Descriptions.Item>
        <Descriptions.Item label="Número de Cuenta">
          {empleado?.numero_cuenta}
        </Descriptions.Item>
        <Descriptions.Item label="Sede">{empleado?.sede}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Inicio">
          {empleado?.fecha_inicio}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Fin">
          {empleado?.fecha_fin}
        </Descriptions.Item>
        <Descriptions.Item label="Auxilio Rodamiento/Viáticos">
          ${empleado?.auxilio}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions
        title="Otros Datos"
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        size="small"
      >
        <Descriptions.Item label="Tipo Sangre">
          {empleado?.tipo_sangre}
        </Descriptions.Item>
        <Descriptions.Item label="Talla Camisa">
          {empleado?.talla_camisa}
        </Descriptions.Item>
        <Descriptions.Item label="Talla Pantalón">
          {empleado?.talla_pantalon}
        </Descriptions.Item>
        <Descriptions.Item label="Talla Zapatos">
          {empleado?.talla_zapatos}
        </Descriptions.Item>
        <Descriptions.Item label="Estrato">
          {empleado?.estrato}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {otrosis.length > 0 && (
        <>
          {otrosis.map((otrosi, index) => (
            <React.Fragment key={otrosi.id}>
              <Descriptions
                title="Información Otrosís"
                bordered
                column={{
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 2,
                  xl: 3,
                }}
                size="small"
              >
                {/* <Descriptions.Item label="Convenio">
                  {otrosi?.rh_convenio ? (
                    <Tooltip title={otrosi.rh_convenio}>
                      {otrosi.rh_convenio.length > 25
                        ? `${otrosi.rh_convenio.substring(0, 25)}...`
                        : otrosi.rh_convenio}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item> */}
                <Descriptions.Item label="Contrato">
                  {otrosi?.contrato_laboral ? (
                    <Tooltip title={otrosi.contrato_laboral}>
                      {otrosi.contrato_laboral.length > 25
                        ? `${otrosi.contrato_laboral.substring(0, 25)}...`
                        : otrosi.contrato_laboral}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Cargo">
                  {otrosi?.cargo ? (
                    <Tooltip title={otrosi.cargo}>
                      {otrosi.cargo.length > 20
                        ? `${otrosi.cargo.substring(0, 20)}...`
                        : otrosi.cargo}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Salario">
                  ${otrosi.salario}
                </Descriptions.Item>

                {/* <Descriptions.Item label="Conv_ant">
                  {otrosi?.old_rh_convenio ? (
                    <Tooltip title={otrosi.old_rh_convenio}>
                      {otrosi.old_rh_convenio.length > 20
                        ? `${otrosi.old_rh_convenio.substring(0, 20)}...`
                        : otrosi.old_rh_convenio}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item> */}
                <Descriptions.Item label="Cont_ant">
                  {otrosi?.old_contrato_laboral ? (
                    <Tooltip title={otrosi.old_contrato_laboral}>
                      {otrosi.old_contrato_laboral.length > 25
                        ? `${otrosi.old_contrato_laboral.substring(0, 25)}...`
                        : otrosi.old_contrato_laboral}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Carg_ant">
                  {otrosi?.old_cargo ? (
                    <Tooltip title={otrosi.old_cargo}>
                      {otrosi.old_cargo.length > 20
                        ? `${otrosi.old_cargo.substring(0, 20)}...`
                        : otrosi.old_cargo}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Sala_ant">
                  ${otrosi.old_salario}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha Otrosí">
                  {otrosi.fecha_otrosi}
                </Descriptions.Item>
                <Descriptions.Item label="Creado Por">
                  {otrosi?.user_created ? (
                    <Tooltip title={otrosi.user_created}>
                      {otrosi.user_created.length > 20
                        ? `${otrosi.user_created.substring(0, 20)}...`
                        : otrosi.user_created}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Editado Por">
                  {otrosi?.user_updated ? (
                    <Tooltip title={otrosi.user_updated}>
                      {otrosi.user_updated.length > 20
                        ? `${otrosi.user_updated.substring(0, 20)}...`
                        : otrosi.user_updated}
                    </Tooltip>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
              </Descriptions>
              {index < otrosis.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </>
      )}
      {datosAprendiz()}
    </Modal>
  );
};
