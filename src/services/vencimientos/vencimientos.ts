import { client } from '../client';
import { ResponceVenciminetos } from '../types';

export const getListVencimientos = async (data:any): Promise<ResponceVenciminetos> => {
    return await client.post("vencimientos/seguimiento",data,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getListVencimientosDetalle = async (data:any) => {
    return await client.post(`vencimientos/detalle`,data,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getBodxusu = async (): Promise<any> => {
    return await client.get(`vencimientos/bodegas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };