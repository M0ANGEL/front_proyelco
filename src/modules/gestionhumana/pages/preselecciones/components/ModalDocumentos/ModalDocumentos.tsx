import { useEffect, useState } from "react";
import { Button, Modal, notification, Space, Table, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Props } from "./types";
import useArrayBuffer from "@/modules/common/hooks/useArrayBuffer";
import { ColumnsType } from "antd/es/table";
import { downloadSoporte } from "@/services/gestion-humana/empleadosAPI";

const { Text } = Typography;

const fileFields = [
  "hv",
  "cedula",
  "pension",
  "cesantia",
  "diplomaBachiller",
  "titulo",
  "certificadoLaboral1",
  "certificadoLaboral2",
  "foto",
  "rethus",
  "resolucion",
];

export const ModalDocumentos = ({ open, setOpen, soportes }: Props) => {
  const [dataSource, setDataSource] = useState<{ key: string; ruta?: string }[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState<boolean>(false);
  const { arrayBufferToString } = useArrayBuffer();

  useEffect(() => {
    const soportesDisponibles = soportes.map((ruta) => {
      const name = ruta.split("/").pop()?.split("_")[1]?.replace(".pdf", "");
      return { key: name || "", ruta };
    });

    const data = fileFields.map((file) => {
      const found = soportesDisponibles.find((s) => s.key === file);
      return found || { key: file };
    });

    setDataSource(data);
  }, [soportes]);

  const columns: ColumnsType<{ key: string; ruta?: string }> = [
    {
      title: "Soporte",
      dataIndex: "key",
      key: "key",
      render: (key, record) => (
        <Text type={record.ruta ? undefined : "danger"}>{key}</Text>
      ),
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      align: "center",
      render: (_, record) =>
        record.ruta ? (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              setLoader(true);
              downloadSoporte(record.ruta ?? "")
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  const fileName = record.ruta ? record.ruta.split("/").pop() || "documento.pdf" : "documento.pdf";
                  link.setAttribute("download", fileName);
                  document.body.appendChild(link);
                  link.click();
                })
                .catch(({ response: { data } }) => {
                  const message = arrayBufferToString(data).replace(/[ '"]+/g, " ");
                  notificationApi.open({
                    type: "error",
                    message: message,
                  });
                })
                .finally(() => setLoader(false));
            }}
          />
        ) : (
          <Text type="danger">No disponible</Text>
        ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        title="Modal de documentos"
        footer={null}
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
