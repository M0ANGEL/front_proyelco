import dayjs from "dayjs";

function useHolidays() {
  const getDiffBussinesDayWithHolidays = (
    fechaInicio: string,
    fechaFin: string,
    festivos: string[]
  ) => {
    const inicio = dayjs(fechaInicio, "YYYY-MM-DD");
    const fin = dayjs(fechaFin, "YYYY-MM-DD");
    let diasHabiles = 0;

    let current = inicio;
    while (current.isBefore(fin) || current.isSame(fin, "day")) {
      if (
        current.day() !== 0 &&
        current.day() !== 6 &&
        !festivos.includes(current.format("YYYY-MM-DD"))
      ) {
        diasHabiles++;
      }
      current = current.add(1, "day");
    }

    return diasHabiles;
  };

  return {
    getDiffBussinesDayWithHolidays,
  };
}

export default useHolidays;
