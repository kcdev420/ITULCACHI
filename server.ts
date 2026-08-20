import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Itulcachi Vecinal System" });
});

// Gemini Assistant Endpoint for community tasks (Actas, Convocatorias, Oficios al Municipio, Análisis de balances)
app.post("/api/gemini/assist", async (req, res) => {
  const { action, topic, details, communityData } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback generator when API key is not configured
      const fallbackResponse = generateLocalFallback(action, topic, details);
      return res.json({ text: fallbackResponse, source: "template" });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `Eres el Asesor y Secretario Virtual Oficial del Barrio Itulcachi (Pichincha, Ecuador).
Tu tarea es redactar documentos formales de alta calidad comunitaria, actas de asambleas y mingas, oficios para el GAD Parroquial / Municipio de Quito, o analizar presupuestos barriales.
El Barrio Itulcachi cuenta con socios naturales (residentes, familias) y socios jurídicos (empresas del sector industrial y agropecuario).
Escribe en un tono formal, legalmente estructurado, respetuoso y claro en idioma Español. Utiliza formato Markdown con títulos, viñetas y espacios para firmas.`;

    const prompt = `Acción solicitada: ${action}
Tema/Asunto: ${topic || "Gestión Comunitaria de Itulcachi"}
Detalles y contexto provisto: ${JSON.stringify(details || {})}
Datos adicionales del barrio: ${JSON.stringify(communityData || {})}

Por favor genera el documento o análisis completo, listo para imprimir, firmar o enviar a los socios y autoridades.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text || "No se pudo generar el contenido.", source: "gemini" });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const fallbackResponse = generateLocalFallback(action, topic, details);
    res.json({ text: fallbackResponse, source: "template-fallback", error: error.message });
  }
});

function generateLocalFallback(action: string, topic: string, details: any): string {
  const dateStr = new Date().toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (action === "convocatoria_minga") {
    return `### 📢 CONVOCATORIA OFICIAL: MINGA COMUNITARIA BARRIAL
**DIRECTIVA CENTRAL DEL BARRIO ITULCACHI**
**Fecha de emisión:** ${dateStr}

Estimados Socios Naturales y Representantes de Socios Jurídicos del Barrio Itulcachi:

Por medio de la presente, en uso de las atribuciones conferidas por los Estatutos Comunitarios, se convoca de manera obligatoria a la:

### 🛠️ **MINGA GENERAL DE TRABAJO COMUNITARIO**
- **Objetivo:** ${topic || "Limpieza de cunetas, mantenimiento vial y adecentamiento de áreas comunales"}
- **Fecha de realización:** ${details?.date || "Próximo Sábado"}
- **Hora de inicio:** ${details?.time || "07:30 AM"} (Puntual asistencia)
- **Lugar de concentración:** ${details?.location || "Casa Barrial de Itulcachi (Cancha Central)"}
- **Herramientas requeridas:** Palas, picos, machetes, guantes, escobas y costales.

**Disposiciones Generales:**
1. Se realizará la toma de asistencia digital al inicio (07:30 AM) y al cierre de la jornada (12:30 PM).
2. Los socios naturales podrán enviar un delegado mayor de edad en caso de fuerza mayor.
3. Los socios jurídicos (empresas e industrias) deberán enviar su cuadrilla designada o cumplir con la alícuota sustitutiva reglamentaria.
4. Conforme al reglamento barrial vigente, la inasistencia injustificada generará un recargo automático en la planilla mensual de expensas ($15.00 socios naturales / $35.00 socios jurídicos).

Agradecemos su compromiso constante por el desarrollo y progreso de nuestro querido Barrio Itulcachi.

Atentamente,

_____________________________               _____________________________
**Presidente del Barrio Itulcachi**          **Secretario(a) de Actas**`;
  }

  if (action === "oficio_gad") {
    return `### 🏛️ OFICIO FORMAL COMUNITARIO
**Oficio Nro:** ITULCACHI-DIR-${new Date().getFullYear()}-042
**Itulcachi,** ${dateStr}

**Señores:**
**GAD PARROQUIAL DE PIFO / MUNICIPIO DEL DISTRITO METROPOLITANO DE QUITO**
Presente.-

**De mi mayor consideración:**

Reciba un cordial y atento saludo de parte de la Directiva y de todos los moradores y empresas que conformamos el **Barrio Itulcachi**.

Por medio del presente instrumento, nos dirigimos a su digna autoridad para exponer la siguiente necesidad prioritaria de nuestra comunidad:

**ASUNTO:** ${topic || "Solicitud de Mantenimiento y Bacheo de la Vía Principal de Acceso a Itulcachi"}

**ANTECEDENTES Y JUSTIFICACIÓN:**
${details?.justification || "El Barrio Itulcachi cuenta con un importante flujo vehicular de transporte pesado de carga hacia el Parque Industrial, así como tránsito constante de familias y transporte escolar. En la actualidad, varios tramos presentan hundimientos y falta de señalización, lo que pone en riesgo la seguridad de peatones y conductores."}

**PETICIÓN CONCRETA:**
1. Inspección técnica por parte del personal de obras públicas.
2. Maquinaria para motoniveladora, compactación y material asfáltico/adoquín.
3. Reposición de luminarias comunales en puntos críticos de seguridad.

Seguros de contar con su oportuna atención y pronta respuesta en beneficio del bienestar colectivo, nos suscribimos.

Atentamente,

_____________________________               _____________________________
**Directiva Central Itulcachi**              **Comité de Obras y Veeduría**`;
  }

  return `### 📋 INFORME Y ACTA DE GESTIÓN COMUNITARIA
**BARRIO ITULCACHI - GESTIÓN MODERNA**
**Fecha:** ${dateStr}
**Tema:** ${topic || "Informe de Actividades y Balance Vecinal"}

**1. Resumen de Actividades:**
Se procedió a la revisión integral de las finanzas comunitarias, recaudación de expensas de socios naturales y jurídicos, y planificación de las obras viales.

**2. Acuerdos y Resoluciones:**
- Se mantiene el llamado a la puntualidad en los pagos de alícuotas mensuales.
- Se aprueba el cronograma de mingas para el cuidado del entorno ecológico e industrial.
- Se publican los balances financieros de ingresos y egresos para libre fiscalización de todos los socios.

Firmado para constancia: Directiva del Barrio Itulcachi.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
