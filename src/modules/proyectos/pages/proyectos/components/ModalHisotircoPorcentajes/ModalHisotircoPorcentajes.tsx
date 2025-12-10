import { Button, Modal, Spin } from "antd";
import {  useState } from "react";
import { AiFillAlert } from "react-icons/ai";

interface DataId {
  proyecto: DataTypeA;
}

interface DataTypeA {
  key: number;
  descripcion_proyecto: string;
}



export const ModalHisotircoPorcentajes = ({ proyecto }: DataId) => {
  const [open, setOpen] = useState(false);

  const showLoading = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   if (open) {
     
  // }, [open]);



  return (
    <>
      {/* <Tooltip title="Informe detallado"> */}
        <Button
        disabled
          type="default"
          style={{ background: "#ea2121ff", color: 'white' }}
          onClick={showLoading}
          size="small"
        >
          <AiFillAlert />
        </Button>
      {/* </Tooltip> */}

      <Modal
        title={
          <p>
            HISTORIAL DE PORCENTAJES:{" "}
            <span style={{ color: "blue" }}>
              {proyecto.descripcion_proyecto.toUpperCase()}
            </span>
          </p>
        }
        open={open}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
          <Spin />
       
      </Modal>
    </>
  );
};
