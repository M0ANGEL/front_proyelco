import { useState, useEffect } from "react";
import { Modal, Button } from "antd";

export const CartaHallowen = () => {
  const [open, setOpen] = useState(false);

  // 👉 Al cargar el componente, se abre el modal automáticamente
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Modal
        open={open}
        footer={null}
        closable={false}
        onCancel={() => setOpen(false)}
        centered
        bodyStyle={{
          padding: "2rem",
          borderRadius: "1rem",
          background: "#1a1a1a", // fondo oscuro para halloween
          color: "white",
          position: "relative",
        }}
      >
        {/* decoraciones halloween con emojis */}
        <div className="absolute -top-4 -right-4 text-4xl">🎃</div>
        <div className="absolute -bottom-4 -right-4 text-3xl">👻</div>

        {/* contenido de la carta */}
        <h2 className="text-2xl font-bold text-orange-500 text-center mb-4">
          🎃 ¡Feliz Halloween! 👻
        </h2>
        <p className="text-gray-300 text-center leading-relaxed">
          Esta mes mágica, llena de misterio y diversión,  
          quiero desearte muchos sustos, dulces y sonrisas.  
          Que la luna ilumine tu camino y los fantasmas solo  
          te traigan alegría. 🕷️
        </p>

        <p className="text-center text-orange-400 font-semibold mt-4">
          Con todo el espíritu de Halloween, PROYELCO 🦇
        </p>

        {/* botón cerrar */}
        <div className="flex justify-center mt-6">
          <Button
            type="primary"
            shape="round"
            onClick={() => setOpen(false)}
            style={{ backgroundColor: "#f97316", borderColor: "#f97316" }}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};
