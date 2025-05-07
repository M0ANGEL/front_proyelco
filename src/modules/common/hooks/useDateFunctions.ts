import { DatePickerProps } from "antd";
import { Dayjs } from "dayjs";

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

/* eslint-disable @typescript-eslint/no-explicit-any */
function useDateFunctions() {
  const disabled1MonthsDate: DatePickerProps["disabledDate"] = (
    current,
    { from }
  ) => {
    if (from) {
      const curMonth = current.year() * 12 + current.day();
      const fromMonth = from.year() * 12 + from.day();
      return Math.abs(fromMonth - curMonth) >= 30;
    }

    return false;
  };

  const disabled30DaysDate: DatePickerProps["disabledDate"] = (
    current,
    { from, type }
  ) => {
    if (from) {
      const minDate = from.add(-31, "days");
      const maxDate = from.add(-31, "days");

      switch (type) {
        case "year":
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );

        case "month":
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );

        default:
          return Math.abs(current.diff(from, "days")) >= 31;
      }
    }

    return false;
  };

  const disabled62DaysDate: DatePickerProps["disabledDate"] = (
    current,
    { from, type }
  ) => {
    if (from) {
      const minDate = from.add(-31, "days");
      const maxDate = from.add(-31, "days");

      switch (type) {
        case "year":
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );

        case "month":
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );

        default:
          return Math.abs(current.diff(from, "days")) >= 62;
      }
    }

    return false;
  };

  return {
    disabled1MonthsDate,
    disabled30DaysDate,
    disabled62DaysDate,
  };
}

export default useDateFunctions;
