/* eslint-disable @typescript-eslint/no-explicit-any */
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { getConveniosActivos } from "@/services/salud/conveniosAPI";
import { getEstadosAud } from "@/services/auditar/auditarAPI";
import { getBodegasSebthi } from "@/services/maestras/bodegasAPI";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Convenio } from "@/services/types";
import { KEY_ROL } from "@/config/api";
import {
  SelectProps,
  DatePicker,
  Typography,
  Button,
  Select,
  Switch,
  Row,
  Col,
} from "antd";

const { RangePicker } = DatePicker;

export const FiltroPanel = ({
  handleDateChange,
  handleConvenioChange,
  handleEstadoChange,
  handleSelectedBodegasChange,
  handleSearchButtonClick,
}: any) => {
  const [estadosList, setEstadosList] = useState<SelectProps["options"]>([]);
  const [estadoConvenios, setEstadoConvenios] = useState<string>("activos");
  const [searchButtonDisabled, setSearchButtonDisabled] = useState(true);
  const [searchValueSelect, setSearchValueSelect] = useState<string>("");
  const [selectedConvenios, setSelectedConvenios] = useState<any[]>();
  const [bodList, setBodList] = useState<SelectProps["options"]>([]);
  const [conList, setConList] = useState<SelectProps["options"]>([]);
  const [selectedBodegas, setSelectedBodegas] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const { getSessionVariable } = useSessionStorage();

  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));

  useEffect(() => {
    getBodegasSebthi().then(({ data: { data } }) => {
      setBodList(
        data.map((item: any) => {
          return { value: item.id, label: item.bod_nombre };
        })
      );
    });

    getConveniosActivos().then(({ data: { data } }) => {
      setConvenios(data);
    });

    getEstadosAud().then(({ data: { data } }) => {
      setEstadosList(
        data
          .filter((item) => item.rol_consulta.includes(user_rol))
          .map((item) => ({
            value: item.id,
            label: item.nombre_estado,
          }))
      );
    });
  }, [user_rol]);

  useEffect(() => {
    setSearchButtonDisabled(
      selectedConvenios ? selectedConvenios.length === 0 : true
    );
  }, [selectedConvenios]);

  useEffect(() => {
    setSelectedConvenios([]);
    const options: SelectProps["options"] = [
      { label: "Todos", value: "todos" },
    ];
    switch (estadoConvenios) {
      case "activos":
        setConList(
          options.concat(
            convenios
              .filter((item) => item.estado == "1")
              .map((item) => ({
                label: item.descripcion,
                value: item.id,
              }))
          )
        );
        break;
      case "inactivos":
        setConList(
          options.concat(
            convenios
              .filter((item) => item.estado == "0")
              .map((item) => ({
                label: item.descripcion,
                value: item.id,
              }))
          )
        );
        break;
    }
  }, [estadoConvenios, convenios]);

  return (
    <>
      <div style={{ width: "100%" }}>
        <div
          style={{
            background: "#f0f2f5",
            width: "100%",
            marginBottom: "16px",
            padding: "16px",
            paddingBottom: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography.Title
            level={5}
            style={{
              textAlign: "center",
              color: "#6c757d",
              marginBottom: "16px",
            }}
          >
            <SearchOutlined style={{ marginRight: "8px" }} />
            Filtros de Búsqueda
          </Typography.Title>
          <Row gutter={[12, 24]}>
            <Col xs={24} lg={21}>
              <Select
                showSearch
                mode="multiple"
                style={{ width: "100%" }}
                options={conList}
                placeholder="Seleccionar Convenio(s)"
                optionFilterProp="children"
                maxTagCount={4}
                searchValue={searchValueSelect}
                onSearch={(value: string) => {
                  setSearchValueSelect(value);
                }}
                onBlur={() => {
                  setSearchValueSelect("");
                }}
                onChange={(selectedValues: any[]) => {
                  const isTodosSelected = selectedValues.includes("todos");
                  const updatedSelectedConvenios = isTodosSelected
                    ? conList?.map((item) => item.value)
                    : selectedValues;

                  setSelectedConvenios(updatedSelectedConvenios);
                  handleConvenioChange(updatedSelectedConvenios);
                }}
                value={selectedConvenios}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Col>
            <Col xs={24} lg={3}>
              <Switch
                checked={estadoConvenios == "activos"}
                checkedChildren={"Activos"}
                unCheckedChildren={"Inactivos"}
                onChange={(value: boolean) =>
                  setEstadoConvenios(value ? "activos" : "inactivos")
                }
              />
            </Col>
            <Col xs={24} lg={8}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Seleccionar Bodega(s)"
                onChange={(selectedValues) => {
                  setSelectedBodegas(selectedValues);
                  handleSelectedBodegasChange(selectedValues);
                }}
                optionLabelProp="label"
                value={selectedBodegas}
                options={bodList}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                maxTagCount={2}
                searchValue={searchValueSelect}
                onSearch={(value: string) => {
                  setSearchValueSelect(value);
                }}
                onBlur={() => {
                  setSearchValueSelect("");
                }}
              />
            </Col>
            <Col xs={24} lg={6}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Seleccionar Estado(s)"
                onChange={(value) => {
                  setSelectedEstados(value);
                  handleEstadoChange(value);
                }}
                optionLabelProp="label"
                value={selectedEstados}
                options={estadosList}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                maxTagCount={2}
                searchValue={searchValueSelect}
                onSearch={(value: string) => {
                  setSearchValueSelect(value);
                }}
                onBlur={() => {
                  setSearchValueSelect("");
                }}
              />
            </Col>
            <Col xs={24} lg={8}>
              <RangePicker
                style={{ width: "100%", marginRight: "16px" }}
                onChange={(_dates, dateStrings) =>
                  handleDateChange(dateStrings)
                }
                placeholder={["Fecha Inicial", "Fecha Final"]}
              />
            </Col>
            <Col xs={24} lg={2}>
              <Button
                block
                type="primary"
                icon={<SearchOutlined />}
                title={
                  searchButtonDisabled ? "Seleccionar convenio" : undefined
                }
                loading={loadingSearch}
                onClick={() => {
                  setLoadingSearch(true);
                  handleSearchButtonClick().finally(() => {
                    setLoadingSearch(false);
                  });
                }}
                disabled={searchButtonDisabled}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
