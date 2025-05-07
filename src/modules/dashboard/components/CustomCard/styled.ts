import { Link } from "react-router-dom";
import styled from "styled-components";

export const ButtonCard = styled(Link)`
  background: ${(props) => props.color || "palevioletred"};
  border-radius: 5px;
  width: 100%;
  display: flex;
  place-items: center;
  margin-block: 20px;
  min-height: calc(35vh - 100px);

  div {
    gap: 1px !important;
  }
  div,
  div > span {
    width: 100%;
    text-align: center;
    color: #ffffff;
    font-size: 16pt;
    word-wrap: break-word;
    font-size-adjust: 0.5;
    margin-inline: 5px;
  }

  div > svg,
  div > svg > path {
    font-size: 36pt;
    color: #ffffff;
    stroke: #ffffff;
  }
`;
