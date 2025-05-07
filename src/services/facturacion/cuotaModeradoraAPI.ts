import { client } from '../client';
import { ResponseListaDisCuotasModeradoras } from '../types'

export const getListaDisCuotaModeradora = async (data: any): Promise<ResponseListaDisCuotasModeradoras> => {
    return await client.post<any>("/listar-dispensacion-cuotas", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};

export const generarFVE = async (data: any): Promise<any> => {
    return await client.post<any>("/cuotas-moderadoras", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};


export const generarInformeGeneral = async (data: any): Promise<any> => {
    return await client.post(`informe-dis`, data, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};
