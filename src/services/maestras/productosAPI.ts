/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Producto,
  ProductoLote,
  ResponseProPadre,
  ResponseProductos,
  ResponseProductos2,
  ResponseProductosLote,
  ResponseProductosLotePaginate,
  ResponseSearchProductos,
} from "../types";

export const getProductos = async (page = 1): Promise<ResponseProductos> => {
  return await client.get<{ data: any; status: string }>(
    `productos?page=${page}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusProducto = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`productos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getProducto = async (
  id: string
): Promise<{ data: { data: Producto } }> => {
  return await client.get(`productos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearProducto = async (data: any): Promise<any> => {
  return await client.post<any>("productos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateProducto = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`productos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getReportProductos = async (): Promise<any> => {
  return await client.get(`productos/reporte/all`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const buscarProducto = async (
  query: string
): Promise<ResponseSearchProductos> => {
  return await client.get<{ data: Producto[]; status: string }>(
    `buscar-productos/${encodeURIComponent(btoa(query))}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const buscarProductoLista = async (
  query: string,
  page = 1
): Promise<ResponseProductos> => {
  return await client.get<{ data: any; status: string }>(
    `buscar-productos-lista/${encodeURIComponent(btoa(query))}?page=${page}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductxLotes = async (
  query: string,
  bod: string
): Promise<ResponseProductosLote> => {
  return await client.get<{ data: ProductoLote[]; status: string }>(
    `buscar-produlote?descripcion=${encodeURIComponent(
      btoa(query)
    )}&bod=${bod}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductxLotesPrecio = async (
  query: string,
  bod: string,
  lista: number
): Promise<ResponseProductosLote> => {
  return await client.get<{ data: ProductoLote[]; status: string }>(
    `buscar-produlotelista-precios?descripcion=${encodeURIComponent(
      btoa(query)
    )}&bod=${bod}&lista=${lista}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const buscarProductosxCodigoPadre = async (
  codigoPadre: string
): Promise<ResponseSearchProductos> => {
  return await client.post<{ data: Producto[]; status: string }>(
    `buscar-productos-padre`,
    { codigoPadre },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductosxLP = async (
  query: string,
  bod: string,
  lp: number
): Promise<ResponseProductosLote> => {
  return await client.get<{ data: ProductoLote[]; status: string }>(
    `buscar-produLP?descripcion=${encodeURIComponent(
      btoa(query)
    )}&bod=${bod}&lp=${lp}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductosxPadreOtros = async (
  id: string
): Promise<ResponseProPadre> => {
  return await client.get<{ data: Producto[]; status: string }>(
    `getProductosPadre/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductLotexID = async (
  id: any,
  bod: any
): Promise<ResponseProductos2> => {
  return await client.get(`buscar-idprodulote?id=${id}&bod=${bod}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const productosLoteCod = async (
  page = 1,
  query?: string,
  bodega?: number
): Promise<ResponseProductosLotePaginate> => {
  return await client.get(
    `productosLoteCod?page=${page}&value=${encodeURIComponent(
      btoa(query!)
    )}&bodega=${bodega}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const productosInventario = async (
  searchParams: any
): Promise<ResponseProductosLotePaginate> => {
  const { page, value, bodegaSelect, lote, order_by } = searchParams;
  const encodedQuery = encodeURIComponent(btoa(value || ""));

  return await client.get(
    `productosInventario?page=${page}&value=${encodedQuery}&bodegaSelect=${bodegaSelect}&lote=${lote}&order_by=${order_by}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const productosInventario_mejora = async (searchParams: {
  page: number;
  query?: string;
  bodegaSelect?: number;
  lote?: string;
}): Promise<ResponseProductosLotePaginate> => {
  const { page, query, bodegaSelect, lote } = searchParams;
  return await client.get(
    `productosInventario?page=${page}&value=${query || ""}&bodegaSelect=${
      bodegaSelect || ""
    }&lote=${lote || ""}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const productosLoteCodVence = async (
  page = 1,
  query?: string,
  color?: string,
  bodega?: number,
  sortParams?: string
): Promise<ResponseProductosLotePaginate> => {
  return await client.get(
    `productosLoteCodVence?page=${page}&value=${encodeURIComponent(
      btoa(query!)
    )}&color=${color}&bodega_id=${bodega}&${sortParams}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getReportVencimiento = async (
  color?: string,
  bodega?: number
): Promise<any> => {
  return await client.get(
    `vencimientos/reporte/all?color=${color}&bodega=${bodega}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getReportInventario = async (searchParams: any): Promise<any> => {
  const { query, bodegaLogin, bodegaSelect, lote } = searchParams;
  return await client.get(
    `reportInventario?value=${query || ""}&bodegaLogin=${
      bodegaLogin || ""
    }&bodegaSelect=${bodegaSelect || ""}&lote=${lote || ""}`,
    {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
