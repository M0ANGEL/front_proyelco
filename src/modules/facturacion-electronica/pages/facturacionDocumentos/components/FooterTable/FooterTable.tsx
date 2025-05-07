import { useEffect, useState } from "react";
import { Props } from "./types";
import { Col, Row } from "antd";

export const FooterTable = ({ data,selected }: Props) => {
  const [footerValue, setFooterValue] = useState<number|undefined>(0);

  useEffect(() => {
    // const sum: number =
    //   data?.reduce(
    //     (accumulador: number, item: any) =>
    //       accumulador + parseFloat(item.total),
    //     0
    //   ) ?? 0;
    setFooterValue(data);
  }, [data]);

  return (<>
  <Row>
    <Col sm={{ span:24}} style={{textAlign:"end" , paddingRight:"100px"}}>
    Valor Seleccionado : { `$ ${selected!=undefined || selected!=0 || selected!=null? selected?.toLocaleString("es-CO"):0}  De  $ ${footerValue?.toLocaleString("es-CO")}`}
    </Col>
  </Row>
 </>);
};
