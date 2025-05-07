import { Menu } from "antd";
import styled from "styled-components";

export const LogoSider = styled.div`
  width: 100%;
  padding: 5px;
  img {
    width: 100%;
  }
`;

export const SiderMenu = styled(Menu)<{ white_space: string }>`
  .ant-menu-item > span {
    text-overflow: auto !important;
    line-height: 1.2;
    white-space: ${(props) => props.white_space};
  }
  .ant-menu-item-only-child > span {
    text-overflow: auto !important;
    line-height: 1.2;
    white-space: ${(props) => props.white_space};
  }

  .ant-menu-submenu > div > span {
    text-overflow: auto !important;
    line-height: 1.2;
    white-space: ${(props) => props.white_space};
  }
`;
