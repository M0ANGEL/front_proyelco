import { Button, Modal, Space, notification, Typography } from "antd";
import { Props } from "./types";
import { Images } from "@/services/types";
import Table, { ColumnsType } from "antd/es/table";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteFile, downloadFile } from "@/services/documentos/disAPI";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import dayjs from "dayjs";

const { Text } = Typography;

export const ModalAdjuntos = ({ open, setOpen, adjuntos }: Props) => {
  const [dataSource, setDataSource] = useState<Images[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();

  useEffect(() => {
    setDataSource(adjuntos);
  }, [adjuntos]);

  const columns: ColumnsType<Images> = [
    {
      title: "Adjunto",
      dataIndex: "adjunto",
      key: "adjunto",
      render(_, { image }) {
        const urlSplit = image.split("/");
        const name = urlSplit[urlSplit.length - 1];

        return <>{name}</>;
      },
    },
    {
      title: "Fecha Cargue",
      dataIndex: "fecha_cargue",
      key: "fecha_cargue",
      align: "center",
      width: 150,
      render(value) {
        return value ? (
          <Text>{dayjs(value).format("YYYY-MM-DD HH:mm")}</Text>
        ) : (
          <Text>Sin fecha</Text>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      width: 150,
      render(_, { image: url, id, consecutivo }) {
        const urlSplit = url.split("/");
        const name = urlSplit[urlSplit.length - 1];
        return (
          <>
            <Space>
              <Button
                key={`button-${url}`}
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => {
                  setLoader(true);
                  downloadFile(name, consecutivo)
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
                  deleteFile(id)
                    .then(({ data: { message } }) => {
                      setDataSource(dataSource.filter((item) => item.id != id));
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
              ></Button>
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
        title={"Modal de Adjuntos"}
        key={`modalAdjuntos`}
        footer={[]}
        style={{ top: 10 }}
      >
        <Table
          rowKey={(record) => record.id}
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
