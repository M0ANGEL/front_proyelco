import { FileExcelFilled } from "@ant-design/icons";
import * as FileSaver from "file-saver";
import { GreenButton } from "./styled";
import XLSX from "sheetjs-style";
import { Props } from "./types";
import { Spin, Tooltip } from "antd";
import { useState } from "react";

export const ExportExcel = ({ excelData, fileName }: Props) => {
  const [loader, setLoader] = useState<boolean>(false);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  };

  return (
    <>
      <Tooltip title={"Exportar a Excel"}>
        <Spin spinning={loader}>
          <GreenButton
            block
            type="primary"
            icon={<FileExcelFilled />}
            onClick={() => {
              exportToExcel();
              setLoader(true);
            }}
          >
            Exportar a Excel
          </GreenButton>
        </Spin>
      </Tooltip>
    </>
  );
};
