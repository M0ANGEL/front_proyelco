/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Form, Row, Select, Spin, Typography } from "antd";
import { Options, Props } from "./types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LoginButton } from "../../pages/LoginPage/styled";
import { LoginFormInput } from "../../pages/LoginPage/types";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import useToken from "@/modules/common/hooks/useToken";
import { logout } from "@/services/auth/authAPI";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { KEY_BODEGA, KEY_EMPRESA } from "@/config/api";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
const { Text } = Typography;

export const FormEmpresa = ({
  user,
  spin,
  onChangeLoginStep,
  onFetch,
  onPushNotification,
}: Props) => {
  const [selectEmpresa, setSelectEmpresa] = useState<Options[]>();
  const [selectBodega, setSelectBodega] = useState<Options[]>();
  const { control, setValue, handleSubmit, getValues } =
    useForm<LoginFormInput>();
  const navigate = useNavigate();
  const { removeToken } = useToken();

  const { setSessionVariable } = useSessionStorage();

  const handleSelectEmp = useCallback(
    (value: string | number, flag = false) => {
      const options: Options[] | any = user?.bodega
        .filter((bodega) => {
          return bodega.bodega.id_empresa == value;
        })
        .map((bodega) => ({
          value: bodega.id_bodega.toString(),
          label: bodega.bodega.bod_nombre,
          disabled: bodega.estado == "0" ? true : false,
        }));
      setSelectBodega(options);
      setValue(
        "bodega",
        options.filter((item: any) => !item.disabled)[0].value
      );
      options.filter((item: any) => !item.disabled).length == 1 && flag
        ? onFinish(getValues())
        : null;
    },
    [user, setSelectBodega, setValue]
  );

  useEffect(() => {
    const options: Options[] | any = user?.empresas.map((empresa) => ({
      value: empresa.id_empresa.toString(),
      label: empresa.empresa.emp_nombre,
      disabled: empresa.estado == "0" ? true : false,
    }));
    setSelectEmpresa(options);
    setValue("empresa", options[0].disabled ? "" : options[0].value);
    setTimeout(() => {
      options.length == 1
        ? handleSelectEmp(options[0].value, true)
        : handleSelectEmp(options[0].value);
    }, 200);
  }, [user, handleSelectEmp, setSelectEmpresa, setValue]);

  const onFinish: SubmitHandler<any> = (data) => {
    onFetch(true);
    setTimeout(() => {
      onFetch(false);
      setSessionVariable(KEY_EMPRESA, data.empresa ? data.empresa : 1 );
      setSessionVariable(KEY_BODEGA, data.bodega);
      navigate(`/dashboard`);
    }, 1500);
  };

  return (
    <>
      <Form
        initialValues={{ remember: true }}
        size="large"
        onFinish={handleSubmit(onFinish)}
      >
        <Controller
          name="empresa"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Empresa es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Form.Item>
              <Select
                {...field}
                options={selectEmpresa}
                showSearch
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                status={error && "error"}
                onSelect={(value) => handleSelectEmp(value)}
              />
              <Text type="danger">{error?.message}</Text>
            </Form.Item>
          )}
        />
        <Controller
          name="bodega"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Bodega es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Form.Item>
              <Select
                {...field}
                showSearch
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toString().toLowerCase())
                }
                options={selectBodega}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </Form.Item>
          )}
        />
        <Form.Item>
          <Row>
            {!spin ? (
              <Col span={5}>
                <LoginButton
                  type="primary"
                  icon={<ArrowLeftOutlined />}
                  danger
                  block
                  size={"large"}
                  onClick={() => {
                    onFetch(true);
                    logout()
                      .then(() => {
                        onFetch(false);
                        onChangeLoginStep(0);
                        removeToken();
                      })
                      .catch((error) => {
                        onPushNotification({
                          type: "error",
                          title: error.code,
                          description: error.message,
                        });
                      });
                  }}
                />
              </Col>
            ) : (
              <></>
            )}
            <Col
              offset={spin ? 0 : 2}
              flex="auto"
              style={{ transition: "all .5s" }}
            >
              <LoginButton
                block
                size={"large"}
                htmlType="submit"
                disabled={spin}
              >
                {!spin ? (
                  <>Iniciar Sesion</>
                ) : (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 26, color: "white" }}
                        spin
                      />
                    }
                  />
                )}
              </LoginButton>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};
