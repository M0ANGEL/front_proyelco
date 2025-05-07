import { Props } from "./types";
import { Button, Col, Row, Modal } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadProps } from "antd";
import { BASE_URL } from "@/config/api";
import useNotification from "antd/es/notification/useNotification";
import { useState } from "react";

const { Dragger } = Upload;

export const ModalUpLoad = ({ open, setOpen }: Props) => {
  const [notificationApi, ContextHolder] = useNotification();
  const [loader, setLoader] = useState<boolean>(false);

  const uploadProps: UploadProps = {
    name: "zip_file",
    multiple: false,
    action: `${BASE_URL}images-dispensaciones-upload`,
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    maxCount: 1,
    accept: ".zip",
    disabled: loader,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onChange(info) {
      const { status } = info.file;
      setLoader(true);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        notificationApi.open({
          type: "success",
          message: `Archivo ${info.file.name} cargado correctamente.`,
        });
        setLoader(false);
      } else if (status === "error") {
        notificationApi.open({
          type: "error",
          message: `Hubo un problema con la carga del archivo: ${info.file.name}`,
          description: info.file.response.message,
          duration: 4,
        });
        setLoader(false);
      }
    },
    style: {
      minHeight: 350,
    },
    // onDrop(e) {
    //   console.log("Dropped files", e.dataTransfer.files);
    // },
  };

  return (
    <>
      {ContextHolder}
      <Modal
        open={open}
        footer={[
          <Button
            key={"btnCancelar"}
            type="primary"
            danger
            onClick={() => {
              setOpen(false);
            }}
            disabled={loader}
          >
            Cancelar
          </Button>,
        ]}
        destroyOnClose
        maskClosable={false}
        closable={false}
        width={900}
        key="modalUpload"
      >
        <Row>
          <Col span={22} style={{ margin: 20 }}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Haga clic o arrastre el archivo a esta área para cargarlo,
                <br />
                Una vez seleccionado el archivo se cargará automáticamente.
              </p>
              <p className="ant-upload-hint">
                Soporte para una carga única o masiva. <br />
                Está estrictamente prohibido cargar datos personales.
              </p>
            </Dragger>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
