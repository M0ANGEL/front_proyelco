import { Button, Modal, Space, notification } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { deleteSoporte, downloadSoporte } from "@/services/aliados/aliadosAPI";
import { Props } from "./types";

export const ModalSoportes = ({ open, setOpen, soportes, estado }: Props) => {
  const [dataSource, setDataSource] = useState<
    { key: React.Key; ruta: string }[]
  >([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();

  useEffect(() => {
    setDataSource(
      soportes.map((item) => {
        return { key: item, ruta: item };
      })
    );
  }, [soportes]);

  const columns: ColumnsType<{ key: React.Key; ruta: string }> = [
    {
      title: "Soporte",
      key: "ruta",
      dataIndex: "ruta",
      width: 400,
      render(value) {
        const urlSplit = value.split("/");
        const name = urlSplit[urlSplit.length - 1];

        return <>{name}</>;
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render(_, { ruta }) {
        const urlSplit = ruta.split("/");
        const name = urlSplit[urlSplit.length - 1];
        return (
          <>
            <Space>
              <Button
                key={`button-${ruta}`}
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => {
                  setLoader(true);
                  downloadSoporte(ruta)
                    .then((response) => {
                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", name);
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch(({ response: { data } }) => {
                      const message = arrayBufferToString(data).replace(
                        /[ '"]+/g,
                        " "
                      );
                      notificationApi.open({
                        type: "error",
                        message: message,
                      });
                    })
                    .finally(() => setLoader(false));
                }}
              />
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setLoader(true);
                  deleteSoporte(ruta)
                    .then(({ data: { message } }) => {
                      setDataSource(
                        dataSource.filter((item) => item.ruta != ruta)
                      );
                      notificationApi.open({
                        type: "success",
                        message: message,
                      });
                    })
                    .catch(
                      ({
                        response,
                        response: {
                          data: { errors },
                        },
                      }) => {
                        if (errors) {
                          const errores: string[] = Object.values(errors);
                          for (const error of errores) {
                            notificationApi.open({
                              type: "error",
                              message: error,
                            });
                          }
                        } else {
                          notificationApi.open({
                            type: "error",
                            message: response.data.message,
                          });
                        }
                      }
                    )
                    .finally(() => setLoader(false));
                }}
                disabled={!["CARGADO", "RECARGADO"].includes(estado)}
              />
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        title={"Modal de Soportes"}
        key={`modal-soportes`}
        footer={[]}
        style={{ top: 10 }}
      >
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          dataSource={dataSource}
          size="small"
          pagination={false}
          loading={loader}
        />
      </Modal>
    </>
  );
};
