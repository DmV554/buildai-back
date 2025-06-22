import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos el cliente de la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Llama a la API de Gemini para generar una configuración de PC.
 * @param {string} prompt - El prompt detallado para la IA.
 * @param {object} curatedComponents - El objeto con las listas de componentes pre-filtrados.
 * @returns {Promise<object>} La configuración de PC generada por la IA en formato JSON.
 */
export const generateAiBuild = async (prompt, curatedComponents) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construimos la petición completa, combinando el prompt de texto y los datos JSON.
    const fullPrompt = `
      ${prompt}

      --- INICIO DE DATOS DE COMPONENTES DISPONIBLES (JSON) ---
      ${JSON.stringify(curatedComponents)}
      --- FIN DE DATOS DE COMPONENTES DISPONIBLES (JSON) ---
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // La IA debería devolver un bloque de código JSON. Lo extraemos.
    // Esta es una forma simple de hacerlo; en producción se podría usar una expresión regular más robusta.
    const jsonString = text.match(/```json\n([\s\S]*?)\n```/)[1];
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    throw new Error('No se pudo generar la configuración desde la IA.');
  }
};
