import db from '../models/index.js';
import { generateAiBuild } from '../services/gemini.service.js';

export const createAiBuild = async (req, res) => {
  // Gracias al middleware 'protect', ya tenemos acceso a req.user.id
  const userId = req.user.id;
  const { budget, useCase, preferences, additionalInfo } = req.body;

  if (!budget || !useCase) {
    return res.status(400).json({ message: 'El presupuesto y el caso de uso son obligatorios.' });
  }

  // Iniciamos una transacción para asegurar la integridad de los datos
  const t = await db.sequelize.transaction();

  try {
    // 1. RAG: Pre-filtrado de componentes (versión simple para el prototipo)
    const candidates = await db.Component.findAll({
      where: { price: { [db.sequelize.Op.lte]: budget * 0.7 } } // Filtro básico
    });
    
    const curatedComponents = {
        cpus: candidates.filter(c => c.componentType === 'CPU'),
        gpus: candidates.filter(c => c.componentType === 'GPU'),
        // ... (añadir otros tipos de componentes)
    };

    // 2. Construcción del Prompt
    const prompt = `
      Actúa como un experto en hardware de PC. Tu tarea es crear la mejor configuración de PC posible que cumpla con los siguientes requisitos y que sea 100% compatible.
      - Presupuesto Máximo: $${budget}
      - Uso Principal: ${useCase.join(', ')}
      - Preferencias: ${preferences.join(', ')}
      - Peticiones Adicionales: "${additionalInfo || 'Ninguna'}"

      Usa SÓLO los componentes de las listas JSON que te proporciono. Debes devolver SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "buildName": "Un nombre creativo para la build",
        "totalPrice": <El precio total calculado>,
        "componentIds": [<una lista de los IDs de los componentes seleccionados>],
        "razonamiento": "Una breve explicación de por qué elegiste esta combinación."
      }
    `;

    // 3. Llamar al servicio de IA
    const aiResponse = await generateAiBuild(prompt, curatedComponents);

    // 4. Crear el Build y asociar los componentes en la base de datos
    const newBuild = await db.Build.create({
      userId: userId,
      buildName: aiResponse.buildName,
      totalPrice: aiResponse.totalPrice
    }, { transaction: t });

    // Asociamos los componentes usando los IDs que la IA nos devolvió
    await newBuild.setComponents(aiResponse.componentIds, { transaction: t });

    // Si todo fue bien, confirmamos la transacción
    await t.commit();

    // 5. Devolver la respuesta completa al cliente
    const finalBuild = await db.Build.findByPk(newBuild.id, {
      include: [db.User, db.Component] // Incluimos el usuario y los componentes para una respuesta completa
    });

    res.status(201).json({ build: finalBuild, razonamiento: aiResponse.razonamiento });

  } catch (error) {
    // Si algo falla, revertimos la transacción
    await t.rollback();
    console.error('Error en el proceso de creación de build con IA:', error);
    res.status(500).json({ message: 'Error interno al generar la configuración.' });
  }
};
