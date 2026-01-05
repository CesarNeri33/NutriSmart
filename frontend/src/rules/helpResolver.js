// src/rules/helpResolver.js

//console.log('HELP RESOLVER FILE LOADED');

// src/rules/helpResolver.js

export function resolveHelps({
  productEvaluation,
  ayudas,
  ayudaNutrienteMap,
  nutrientPadecimientoMap,
  userPadecimientos = [],
}) {
  const criticalAlerts = []; 
  const recommendations = []; 
  const added = new Set();

  // 1️⃣ Normalizar padecimientos del usuario a Números para comparación segura
  const userPadecimientosIds = userPadecimientos.map(Number);

  // 2️⃣ Identificar nutrientes con nivel crítico (rojo o amarillo)
  const criticalNutrients = Object.entries(productEvaluation)
    .filter(([_, data]) => data?.level === 'rojo' || data?.level === 'amarillo')
    .map(([nutriente]) => nutriente);

  // 3️⃣ Filtrar Alertas Críticas (Cruce Nutriente + Padecimiento Usuario)
  criticalNutrients.forEach((nutrienteCode) => {
    // Obtenemos padecimientos ligados a este nutriente (ej: Sodio -> [26, 31, 48])
    const padecimientosRelacionados = nutrientPadecimientoMap[nutrienteCode] || [];
    
    // Verificamos si hay coincidencia con los del usuario (usando Number para seguridad)
    const usuarioTienePadecimiento = padecimientosRelacionados.some((p) =>
      userPadecimientosIds.includes(Number(p))
    );

    if (usuarioTienePadecimiento) {
      ayudas
        .filter((h) => 
          h.tipo === 'PADECIMIENTO' && 
          ayudaNutrienteMap[h.ayuda_id]?.includes(nutrienteCode)
        )
        .forEach((h) => {
          if (!added.has(h.ayuda_id)) {
            criticalAlerts.push(h);
            added.add(h.ayuda_id);
          }
        });
    }
  });

  // 4️⃣ Filtrar Recomendaciones (Nutrientes y Generales que no son alertas)
  ayudas.forEach((h) => {
    if (added.has(h.ayuda_id)) return;

    const esNutrienteRelevante = h.tipo === 'NUTRIENTE' && 
      ayudaNutrienteMap[h.ayuda_id]?.some(n => criticalNutrients.includes(n));

    if (esNutrienteRelevante || h.tipo === 'GENERAL') {
      recommendations.push(h);
      added.add(h.ayuda_id);
    }
  });

  return { criticalAlerts, recommendations };
}