import { useEffect, useState } from "react";
import { Props } from "./types";
import { Col, Row } from "antd";

export const FooterTable = ({ data,selected }: Props) => {
  const [footerValue, setFooterValue] = useState<number>(0);

  useEffect(() => {
    const sum: number =
      data?.reduce(
        (accumulador: number, item: any) =>
          accumulador + parseFloat(item.total),
        0
      ) ?? 0;
    setFooterValue(sum);
  }, [data]);

  return (<>
  <Row>
    <Col sm={{ span:24,offset:12}}>
    Valor Total Documentos: { `$ ${selected!=undefined? selected?.toLocaleString("es-CO"):0}  /  $ ${footerValue.toLocaleString("es-CO")}`}
    </Col>
  </Row>
 </>);
};
