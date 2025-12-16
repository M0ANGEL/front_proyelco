import { useState, useEffect } from "react";

const AnalicisIAProyectos = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [analisis, setAnalisis] = useState("");
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Cargar voces disponibles al montar el componente
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Cargar voces inmediatamente si están disponibles
    loadVoices();

    // Algunos navegadores cargan voces de forma asíncrona
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Limpiar al desmontar
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Función para limpiar el texto de markdown y caracteres especiales
  const cleanTextForSpeech = (text) => {
    if (!text) return "";

    let cleaned = text;

    // Eliminar markdown y caracteres especiales
    cleaned = cleaned.replace(/#{1,6}\s*/g, ""); // Eliminar #, ##, ###, etc.
    cleaned = cleaned.replace(/\*\*/g, ""); // Eliminar **
    cleaned = cleaned.replace(/\*/g, ""); // Eliminar *
    cleaned = cleaned.replace(/_{2,}/g, ""); // Eliminar __
    cleaned = cleaned.replace(/---+/g, ""); // Eliminar ---
    cleaned = cleaned.replace(/_{1,}/g, ""); // Eliminar _

    // Reemplazar barras por "de"
    cleaned = cleaned.replace(/\//g, " de ");

    // Limpiar múltiples espacios
    cleaned = cleaned.replace(/\s+/g, " ");

    // Formatear porcentajes para que suenen mejor
    cleaned = cleaned.replace(/(\d+)%/g, "$1 por ciento");

    // Formatear fechas para que suenen mejor
    cleaned = cleaned.replace(/(\d{2})\/(\d{2})\/(\d{4})/g, "$1 de $2 de $4");

    // Formatear horas UTC
    cleaned = cleaned.replace(
      /(\d{2}):(\d{2}):(\d{2}) UTC/g,
      "$1 horas $2 minutos $3 segundos UTC"
    );

    // Asegurar puntos al final de los párrafos
    cleaned = cleaned.replace(/\n\s*\n/g, ".\n\n");

    // Reemplazar puntos suspensivos
    cleaned = cleaned.replace(/\.{3,}/g, ".");

    // Eliminar espacios al inicio y final
    cleaned = cleaned.trim();

    return cleaned;
  };

  // Función para convertir texto a audio
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      setError("Tu navegador no soporta la funcionalidad de texto a voz");
      return;
    }

    // Cancelar cualquier audio en reproducción
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance();

    // Usar el texto limpiado para el audio
    const textForSpeech = cleanTextForSpeech(text);
    speech.text = textForSpeech;

    speech.rate = 1.0; // Velocidad normal (0.1 - 10)
    speech.pitch = 1.0; // Tono normal (0 - 2)
    speech.volume = 1.0; // Volumen máximo (0 - 1)

    // Configurar idioma español
    speech.lang = "es-ES";

    // Buscar la mejor voz en español
    const spanishVoices = voices.filter(
      (voice) => voice.lang.includes("es") || voice.lang.includes("ES")
    );

    if (spanishVoices.length > 0) {
      // Preferir voces nativas de español
      const preferredVoice = spanishVoices.find(
        (voice) => voice.lang === "es-ES" || voice.lang === "es-MX"
      );
      speech.voice = preferredVoice || spanishVoices[0];
    }

    // Eventos para controlar el estado
    speech.onstart = () => {
      setIsSpeaking(true);
      setError(""); // Limpiar errores anteriores
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = (event) => {
      setIsSpeaking(false);
      console.error("Error en síntesis de voz:", event);
      setError("Error al reproducir el audio. Intenta de nuevo.");
    };

    // Iniciar la reproducción
    window.speechSynthesis.speak(speech);
  };

  // Función para detener el audio
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Alternar entre reproducir y pausar
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (analisis) {
      speakText(analisis);
    }
  };

  // Función para formatear el texto para visualización (manteniendo formato pero sin afectar audio)
  const formatForDisplay = (text) => {
    if (!text) return "";

    let formatted = text;

    // Mantener los asteriscos para negritas visuales pero limpiar los extras
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convertir listas con bullets
    formatted = formatted.replace(/^\s*-\s*(.*)$/gm, "• $1");

    // Mantener secciones con encabezados visuales
    formatted = formatted.replace(
      /^\s*###\s*(.*)$/gm,
      '<h3 style="color: #2563eb; margin-top: 20px;">$1</h3>'
    );
    formatted = formatted.replace(
      /^\s*##\s*(.*)$/gm,
      '<h2 style="color: #1e40af; margin-top: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">$1</h2>'
    );
    formatted = formatted.replace(
      /^\s*#\s*(.*)$/gm,
      '<h1 style="color: #111827; font-size: 20px; margin-top: 30px;">$1</h1>'
    );

    // Separadores visuales (mantener solo para display)
    formatted = formatted.replace(
      /---+/g,
      '<hr style="border: none; border-top: 2px dashed #d1d5db; margin: 20px 0;" />'
    );

    // Formatear porcentajes para mejor visualización
    formatted = formatted.replace(
      /(\d+\.?\d*)%/g,
      '<span style="color: #059669; font-weight: bold;">$1%</span>'
    );

    // Formatear números importantes
    formatted = formatted.replace(
      /(\d+\/\d+)/g,
      '<span style="color: #7c3aed;">$1</span>'
    );

    // Convertir saltos de línea a <br> para HTML
    formatted = formatted.replace(/\n/g, "<br />");

    return formatted;
  };

  const handleAnalizar = async () => {
    setLoading(true);
    setAnalisis("");
    setError("");
    stopSpeaking(); // Detener audio si está reproduciendo

    try {
      const response = await fetch(
        `${import.meta.env.VITE_OPENROUTER_BASE_URL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Analizador Proyectos",
            Accept: "application/json",
          },
          body: JSON.stringify({
            model: "amazon/nova-2-lite-v1:free",
            messages: [
              {
                role: "system",
                content: `Eres un experto analista. Analiza profundamente la información y dame un resumen corto sobre el estado de las torres, sus porcentajes.
                    IMPORTANTE: Para el formato de respuesta:
                    1. NO uses markdown (#, *, **, __, ---)
                    2. NO uses caracteres especiales que suenen mal en audio
                    3. Usa un formato claro y natural para ser leído en voz alta
                    4. Separa secciones con párrafos claros
                    5. Usa lenguaje natural y fluido

                    Ejemplo de formato correcto:
                    Resumen del Estado de las Torres

                    Fecha de consulta: 02 de diciembre de 2025

                    Torre A
                    Avance total: 68.61 por ciento
                    Porcentaje de retraso: 4.17 por ciento
                    Apartamentos realizados (procesos): 414 de 720 
                    Estado: En buen progreso, con bajo retraso y alta completación.

                    [Y así sucesivamente...]

                    Responde únicamente con texto natural para voz, sin formato.`,
              },
              {
                role: "user",
                content: `Analiza esta data:\n${JSON.stringify(data, null, 2)}`,
              },
            ],
          }),
        }
      );

      const rawText = await response.text();

      if (!rawText) {
        throw new Error("La API respondió vacía. Revisa headers o la URL.");
      }

      const result = JSON.parse(rawText);
      const contenido =
        result.choices?.[0]?.message?.content || "Sin contenido";
      setAnalisis(contenido);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos
  const containerStyle = {
    width: "100%",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
    position: "relative",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "12px",
    backgroundColor: loading ? "#60a5fa" : "#2563eb",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const audioButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px 20px",
    borderRadius: "10px",
    backgroundColor: isSpeaking ? "#ef4444" : "#10b981",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const audioButtonDisabledStyle = {
    ...audioButtonStyle,
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  };

  const errorStyle = {
    marginTop: "16px",
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderLeft: "4px solid #f87171",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  };

  const resultStyle = {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
    color: "#374151",
    width: "100%",
    fontSize: "15px",
    lineHeight: "1.6",
  };

  const resultHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e5e7eb",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "20px",
    color: "#111827",
    textAlign: "center",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
    textAlign: "center",
    fontStyle: "italic",
  };

  const voiceInfoStyle = {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
    textAlign: "center",
    padding: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "6px",
  };


  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🔍 Análisis Inteligente con IA</h2>
      <p style={subtitleStyle}>
        Genera un análisis detallado y escúchalo en voz alta
      </p>

      <button onClick={handleAnalizar} disabled={loading} style={buttonStyle}>
        {loading ? (
          <>
            <span style={{ fontSize: "18px" }}>⏳</span>
            Analizando datos...
          </>
        ) : (
          <>
            <span style={{ fontSize: "18px" }}></span>
            Generar análisis con IA
          </>
        )}
      </button>

      {error && (
        <div style={errorStyle}>
          <span style={{ marginRight: "10px", fontSize: "18px" }}>⚠️</span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {analisis && (
        <div style={resultStyle}>
          <div style={resultHeaderStyle}>
            <div>
              <strong style={{ fontSize: "18px", color: "#111827" }}>
                📊 Resultado del Análisis:
              </strong>
            </div>
            <button
              onClick={toggleSpeech}
              disabled={!analisis}
              style={!analisis ? audioButtonDisabledStyle : audioButtonStyle}
              title={isSpeaking ? "Detener audio" : "Escuchar análisis"}
            >
              {isSpeaking ? (
                <>
                  <span style={{ fontSize: "16px" }}>⏸️</span>
                  Pausar Audio
                </>
              ) : (
                <>
                  <span style={{ fontSize: "16px" }}>🔊</span>
                  Escuchar
                </>
              )}
            </button>
          </div>

          {/* Mostrar el texto formateado visualmente */}
          <div
            style={{ padding: "10px 0" }}
            dangerouslySetInnerHTML={{ __html: formatForDisplay(analisis) }}
          />

          {voices.length > 0 && (
            <div style={voiceInfoStyle}>
              <em>
                🔈 Voz disponible:{" "}
                {voices.find((v) => v.lang.includes("es"))?.name ||
                  "Sintetizador predeterminado"}
                {isSpeaking && " - Reproduciendo..."}
              </em>
            </div>
          )}
        </div>
      )}

      {/* Información sobre compatibilidad */}
      {!("speechSynthesis" in window) && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#fef3c7",
            borderRadius: "10px",
            border: "1px solid #fbbf24",
            fontSize: "14px",
            color: "#92400e",
          }}
        >
          <strong>ℹ️ Nota:</strong> Tu navegador no soporta la función de texto
          a voz. Para usar esta función, actualiza a la última versión de
          Chrome, Firefox, Safari o Edge.
        </div>
      )}
    </div>
  );
};

export default AnalicisIAProyectos;
