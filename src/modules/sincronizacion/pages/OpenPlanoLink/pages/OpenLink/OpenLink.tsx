/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { enviarSyncProductos } from '@/services/syncContabilidad/syncAPI';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {notification} from "antd";
import Lottie from 'react-lottie';
import sync from '../../../../../../../public/lotties/sync.json'



export const OpenPlanoLink = () => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        enviarSyncProductos().then((data) => {
            notificationApi.open({
                type: "success",
                message: `Documento sincronizado con exito!`,
              });
              setTimeout(() => {
                setLoading(false);
                navigate('/sincronizacioncontabilidad/sincronizacion');
              }, 1500);
        })
      
    }, []);

    return (
        <>
        {contextHolder}
            {loading && (
                <Lottie
                    options={{
                        loop: true, // Reproduce la animación en bucle
                        autoplay: true, // Inicia la reproducción automáticamente
                        animationData: sync, // Archivo JSON de la animación
                        renderer: 'svg', // Renderizador de la animación (svg, canvas)

                    }}
                    height={500} // Altura de la animación
                    width={400} // Ancho de la animación
                />)}
        </>
    );


};
