import { useState, useEffect } from "react";
import { Modal, Button } from "antd";

export const CartaAmorAmistad = () => {
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
          background: "white",
          position: "relative",
        }}
      >
        {/* corazones decorativos con emojis */}
        <div className="absolute -top-4 -right-4 text-4xl">💖</div>
        <div className="absolute -bottom-4 -left-4 text-5xl">❤️</div>

        {/* contenido de la carta */}
        <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">
          💖 ¡Feliz Día del Amor y la Amistad! 💖
        </h2>
        <p className="text-gray-700 text-center leading-relaxed">
          Hoy celebramos la alegría de tener personas tan especiales en
          nuestras vidas.  
          Gracias por tu amistad, tu cariño y por compartir momentos que
          hacen la vida más bonita.  
        </p>

        <p className="text-center text-pink-500 font-semibold mt-4">
          Con todo mi aprecio 💕
        </p>

        {/* botón cerrar */}
        <div className="flex justify-center mt-6">
          <Button
            type="primary"
            shape="round"
            onClick={() => setOpen(false)}
            style={{ backgroundColor: "#ec4899", borderColor: "#ec4899" }}
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};
