import styled from "styled-components";
import { Form, Table } from "antd";

export const StyledFormItemGlosas = styled(Form.Item)<{
  inputNumber?: number;
  column?: string;
  isDirty?: boolean;
}>`
  margin-bottom: 5px;  

  .ant-form-item-label {
    padding-bottom: 0px;
    margin-bottom: 5px;
    border-radius: 5px;
    label {
      font-size: 7pt !importnat;
      width: 100%;
      text-align: center;
      h5 {
        color: ${({ column }) => {
          let color = "black";
          switch (column) {
            case "glosa":
              color = "black";
              break;
            case "rpta":
            case "rat":
            case "rpta_rat":
            case "conc":
              color = "white";
              break;
          }
          return color;
        }};
        padding: 2px 30px;
        width: 100%;
        margin 0px;
        font-size: 9pt;
      }
    }
    background-color: ${({ inputNumber, column }) => {
      let color = "";
      switch (true) {
        case inputNumber == 1 && column == "glosa":
          color = "rgb(250, 173, 20)";
          break;
        case inputNumber == 2 && column == "glosa":
          color = "rgb(245, 209, 102)";
          break;
        case inputNumber == 3 && column == "glosa":
          color = "rgb(250, 207, 121)";
          break;
        case inputNumber == 1 && column == "rpta":
          color = "rgb(0, 12, 175)";
          break;
        case inputNumber == 2 && column == "rpta":
          color = "rgb(50, 58, 175)";
          break;
        case inputNumber == 3 && column == "rpta":
          color = "rgb(71, 79, 197)";
          break;
        case inputNumber == 1 && column == "rat":
          color = "rgb(9, 180, 180)";
          break;
        case inputNumber == 2 && column == "rat":
          color = "rgb(52, 201, 201)";
          break;
        case inputNumber == 3 && column == "rat":
          color = "rgb(102, 207, 207)";
          break;
        case inputNumber == 1 && column == "rpta_rat":
          color = "rgb(114, 46, 209)";
          break;
        case inputNumber == 2 && column == "rpta_rat":
          color = "rgb(125, 65, 209)";
          break;
        case inputNumber == 3 && column == "rpta_rat":
          color = "rgb(136, 88, 204)";
          break;
        case inputNumber == 1 && column == "conc":
          color = "rgb(49, 155, 35)";
          break;
        case inputNumber == 2 && column == "conc":
          color = "rgb(21, 177, 0)";
          break;
        case inputNumber == 3 && column == "conc":
          color = "rgb(89, 189, 76)";
          break;
      }
      return color;
    }}
  }
`;

export const CustomTableGlosas = styled(Table)`
  background-color: black;
`;
