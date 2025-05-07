/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { CustomCalendar } from "./styled";
import { locale } from "@/config/es_ES";
import dayjs, { Dayjs } from "dayjs";
import { Col, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { getFestivos, updateFestivos } from "@/services/radicacion/festivosAPI";

export const Calendario = () => {
  const [festivos, setFestivos] = useState<string[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    getFestivos()
      .then(({ data: { data } }) => {
        setFestivos(data.map((item) => item.festivo_fecha));
      })
      .finally(() => setLoader(false));
  }, []);

  const fullCellRender = (value: Dayjs) => {
    const isWeekend = value.day() === 0 || value.day() === 6;
    const isSunday = value.day() === 0;
    const isHoliday = festivos.some(
      (holiday) => holiday == dayjs(value).format("YYYY-MM-DD")
    );

    let color = "";
    let backgroundColor = "";
    let cursor = "pointer";

    if (isHoliday) {
      color = "#ffffff";
      backgroundColor = "#ce1126";
    }

    if (isWeekend) {
      cursor = "not-allowed";
    }

    if (isSunday) {
      color = "#ce1126";
    }

    return (
      <div
        style={{
          backgroundColor,
          color,
          cursor,
          borderRadius: 5,
          margin: 2,
          paddingTop: "80%",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "start",
            position: "absolute",
            padding: 10,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        >
          {value.date()}
        </div>
      </div>
    );
  };

  const disabledDate = (currentDate: Dayjs) => {
    const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;
    if (isWeekend) {
      return true;
    }
    return false;
  };

  const onSelectDate = (selectedDate: Dayjs, { source }: SelectInfo) => {
    if (source == "date") {
      setLoader(true);
      const day = dayjs(selectedDate).format("YYYY-MM-DD");
      const isNew = festivos.includes(day);
      let newFestivos = [];
      if (isNew) {
        newFestivos = festivos.filter((festivo) => day != festivo);
      } else {
        newFestivos = [...festivos, day];
      }

      setFestivos(newFestivos);
      updateFestivos(newFestivos).finally(() => setLoader(false));
    }
  };

  return (
    <>
      <StyledCard title={"Calendario de días festivos"}>
        <Spin spinning={loader}>
          <Row>
            <Col
              xs={24}
              sm={24}
              md={{ offset: 2, span: 20 }}
              lg={{ offset: 3, span: 18 }}
            >
              <CustomCalendar
                fullCellRender={fullCellRender}
                disabledDate={disabledDate}
                onSelect={onSelectDate}
                locale={locale}
                onPanelChange={(value, mode) => console.log(value, mode)}
                headerRender={({ value, onChange }: any) => {
                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  let current = value.clone();
                  const localeData = value.localeData();
                  const months = [];
                  for (let i = 0; i < 12; i++) {
                    current = current.month(i);
                    months.push(localeData.monthsShort(current));
                  }

                  for (let i = start; i < end; i++) {
                    monthOptions.push({ value: i, label: months[i] });
                  }

                  const year = value.year();
                  const month = value.month();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push({ value: i, label: i });
                  }
                  return (
                    <div
                      style={{
                        padding: 8,
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Row gutter={8}>
                        <Col>
                          <Select
                            value={year}
                            onChange={(newYear) => {
                              const now = value.clone().year(newYear);
                              onChange(now);
                            }}
                            options={options}
                          />
                        </Col>
                        <Col>
                          <Select
                            value={month}
                            onChange={(newMonth) => {
                              const now = value.clone().month(newMonth);
                              onChange(now);
                            }}
                            options={monthOptions}
                          />
                        </Col>
                      </Row>
                    </div>
                  );
                }}
              />
            </Col>
          </Row>
        </Spin>
      </StyledCard>
    </>
  );
};
