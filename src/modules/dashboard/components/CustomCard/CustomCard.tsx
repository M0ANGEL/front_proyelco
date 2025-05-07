import { ReactNode } from "react";
import { ButtonCard } from "./styled";
import { Space, Typography } from "antd";
import { FaReact } from "react-icons/fa";

const { Text } = Typography;

interface props {
  bgColor: string;
  title: string;
  path: string;
  icon?: ReactNode;
}

export const CustomCard = ({
  bgColor,
  title,
  path,
  icon = <FaReact />,
}: props) => {
  return (
    <>
      <ButtonCard to={path} color={bgColor}>
        <Space direction="vertical" align="center">
          {icon}
          <Text>{title}</Text>
        </Space>
      </ButtonCard>
    </>
  );
};
