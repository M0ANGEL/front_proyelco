import { Button, Modal, Space, notification } from "antd";
import { Props } from "./types";
import Table, { ColumnsType } from "antd/es/table";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { deleteOficio, downloadOficio } from "@/services/radicacion/glosasAPI";

export const ModalOficios = ({ open, setOpen, oficios }: Props) => {
  const [dataSource, setDataSource] = useState<
    { key: React.Key; ruta: string }[]
  >([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();

  useEffect(() => {
    if (oficios.length > 0) {
      setDataSource(
        oficios.map((item) => {
          return { key: item, ruta: item };
        })
      );
    }
  }, [oficios]);

  const columns: ColumnsType<{ key: React.Key; ruta: string }> = [
    {
      title: "Oficio",
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
      title: "Etapa",
      key: "ruta",
      dataIndex: "ruta",
      width: 400,
      render(value) {
        const urlSplit = value.split("/");
        const name = urlSplit[urlSplit.length - 2];

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
                  downloadOficio(ruta)
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
                  deleteOficio(ruta)
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
        title={"Modal de Oficios"}
        key={`modal-oficios`}
        footer={[]}
        style={{ top: 10 }}
        width={800}
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
