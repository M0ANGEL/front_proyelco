import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { getGrafiaPoryectos } from '@/services/graficasDashboard/proyectosAPI';

interface TorreData {
  torre: string;
  total: number;
}

interface EstadoData {
  estado: string;
  total: number;
}

export  function DashboardProyectos() {
  const [proyectosTotales, setProyectosTotales] = useState(0);
  const [torres, setTorres] = useState<TorreData[]>([]);
  const [estados, setEstados] = useState<EstadoData[]>([]);

  useEffect(() => {
    getGrafiaPoryectos()
      .then(response => {
        setProyectosTotales(response.data.proyectos_totales);
        setTorres(response.data.torres);
        setEstados(response.data.estados);
      });
  }, []);

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Dashboard de Proyectos</h2>

      <h3>Total de Proyectos: {proyectosTotales}</h3>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h4>Proyectos por Torre</h4>
          <BarChart width={400} height={300} data={torres}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="torre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>

        <div>
          <h4>Distribución por Estado</h4>
          <PieChart width={400} height={300}>
            <Pie
              dataKey="total"
              data={estados}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {estados.map((_, index) => (
                <Cell key={index} fill={colores[index % colores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
