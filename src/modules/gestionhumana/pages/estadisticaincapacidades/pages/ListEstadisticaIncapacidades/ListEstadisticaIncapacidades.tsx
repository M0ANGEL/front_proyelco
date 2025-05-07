import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { StyledCardChart, ChartContainer, ChartGrid } from "@/modules/common/layout/DashboardLayout/styled";
import { getIncapacidadesEstadisticas } from "@/services/gestion-humana/incapacidadesAPI";

// Registrar los componentes que vas a utilizar
ChartJS.register(
  CategoryScale, // Eje X (categorías)
  LinearScale, // Eje Y (escala lineal)
  BarElement, // Barras
  Title, // Título
  Tooltip, // Tooltips
  Legend, // Leyenda
  ArcElement,
);

interface DataType {
  key: React.Key;
  mes: string;
  anio: string;
  cantidad: string;
}

interface Radicadas {
  estado_radicado: string;
  total: string;
}

interface IncapacidadPorSede {
  bod_nombre: string;
  total: string;
}

export const ListEstadisticaIncapacidades = () => {
  const [initialData, setInitialData] = useState<DataType[]>([]);
  const [incapacidadesRadicadas, setIncapacidadesRadicadas] = useState<Radicadas[]>([])
  const [incapacidadesPorSede, setIncapacidadesPorSede] = useState<IncapacidadPorSede[]>([])

  const fetchIncapacidades = () => {
    getIncapacidadesEstadisticas().then(({ data: { data, data2, data3 } }) => {

      const incapacidades = data.map((incapacidad) => {
        return {
          key: incapacidad.mes + "-" + incapacidad.año,
          mes: incapacidad.mes,
          anio: incapacidad.año,
          cantidad: incapacidad.cantidad,
        };
      });

      const radicadas = data2.map((radicada) => ({
        estado_radicado: radicada.estado_radicado,
        total: radicada.total,
      }));

      const incapacidadesPorSede = data3.map((incapacidad) => ({
        bod_nombre: incapacidad.bod_nombre,
        total: incapacidad.total,
      }));

      setInitialData(incapacidades);
      setIncapacidadesRadicadas(radicadas)
      setIncapacidadesPorSede(incapacidadesPorSede)
    });
  };

  useEffect(() => {
    fetchIncapacidades();
  }, []);

  // Prepara los datos para el gráfico
  const chartData = {
    labels: initialData.map((inc) => `${inc.mes}-${inc.anio}`), // Etiquetas en el eje X
    datasets: [
      {
        label: "INCAPACIDADES POR MES",
        data: initialData.map((inc) => inc.cantidad), // Datos en el eje Y
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepara los datos para los graficos radicados y no radicados
  const chartDataRadicados = {
    labels: incapacidadesPorSede.map((inc) => inc.bod_nombre), // Etiquetas en el eje X
    datasets: [
      {
        label: "INCAPACIDADES POR SEDE",
        data: incapacidadesPorSede.map((inc) => inc.total), // Datos en el eje Y
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de Dona/Torta
  const chartDataDoughnut = {
    labels: incapacidadesRadicadas.map((inc) => inc.estado_radicado), // Etiquetas (Radicadas o No Radicadas)
    datasets: [
      {
        label: "RADICADAS Y NO RADICADAS",
        data: incapacidadesRadicadas.map((inc) => inc.total), // Datos (Totales de radicadas y no radicadas)
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"], // Colores para cada tipo
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"], // Bordes para cada tipo
        borderWidth: 1,
      },
    ],
  };

  const optionsRadicados = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Escalado de los ticks en Y, para ajustarlo a la cantidad de incapacidades
        },
      },
    },
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Escalado de los ticks en Y, para ajustarlo a la cantidad de incapacidades
        },
      },
    },
  };

  return (
    <StyledCardChart title={"ESTADISTICAS INCAPACIDADES"}>
      <ChartGrid>
        <ChartContainer>
          <Bar data={chartData} options={options} />
        </ChartContainer>

        <ChartContainer>
          <Doughnut data={chartDataDoughnut} />
        </ChartContainer>

        <ChartContainer>
          <Bar data={chartDataRadicados} options={optionsRadicados} />
        </ChartContainer>
      </ChartGrid>
    </StyledCardChart>
  );
};
