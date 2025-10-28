import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export const ModuloNoDisponilble = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Oops! La página que buscas no esta disponible."
      icon={<FrownOutlined style={{ fontSize: "80px", color: "#1976d2" }} />}
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      }
    />
  );
};
