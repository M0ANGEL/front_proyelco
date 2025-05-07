/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Props } from "./types";
import { Col, Row } from "antd";

export const FooterTable = ({ data }: Props) => {
  const [valorTotal, setValorTotal] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const total: number = data.reduce(
        (accumulador, item) => accumulador + parseFloat(item.total),
        0
      );
      setValorTotal(total);
    }
  }, [data]);

  return (
    <>
      <Row>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          Valor total: ${valorTotal.toLocaleString("es-CO")}
        </Col>
      </Row>
    </>
  );
};
