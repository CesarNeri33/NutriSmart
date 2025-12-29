// src/rules/helpResolver.js

//console.log('HELP RESOLVER FILE LOADED');

export function resolveHelps({
  
  productEvaluation,
  ayudas,
  ayudaNutrienteMap,
  nutrientPadecimientoMap,
  userPadecimientos = [],
}) 
{
  //console.log('RESOLVE HELPS CALLED', productEvaluation,
  //ayudas,
  //ayudaNutrienteMap,
  //nutrientPadecimientoMap,
  //userPadecimientos = []);
  const padecimientoHelps = [];
  const nutrienteHelps = [];
  const generalHelps = [];

  const added = new Set();

  // =========================
  // 1️⃣ Detectar nutrientes críticos
  // =========================
  const criticalNutrients = Object.entries(productEvaluation)
    .filter(([_, data]) => data?.level === 'rojo' || data?.level === 'amarillo')
    .map(([nutriente]) => nutriente);
    //console.log('CRITICAL NUTRIENTS:', criticalNutrients);

  // =========================
  // 2️⃣ Ayudas de PADECIMIENTO
  // =========================
  criticalNutrients.forEach((nutriente) => {
    const padecimientosRelacionados =
      nutrientPadecimientoMap[nutriente] || [];

    const usuarioCoincide = padecimientosRelacionados.some((p) =>
      userPadecimientos.includes(p)
    );

    if (!usuarioCoincide) return;

    ayudas
      .filter(
        (h) =>
          h.tipo === 'PADECIMIENTO' &&
          ayudaNutrienteMap[h.ayuda_id]?.includes(nutriente)
      )
      .forEach((h) => {
        if (!added.has(h.ayuda_id)) {
          padecimientoHelps.push(h);
          added.add(h.ayuda_id);
        }
      });
  });

  // =========================
  // 3️⃣ Ayudas de NUTRIENTE
  // =========================
  criticalNutrients.forEach((nutriente) => {
    ayudas
      .filter(
        (h) =>
          h.tipo === 'NUTRIENTE' &&
          ayudaNutrienteMap[h.ayuda_id]?.includes(nutriente)
      )
      .forEach((h) => {
        if (!added.has(h.ayuda_id)) {
          nutrienteHelps.push(h);
          added.add(h.ayuda_id);
        }
      });
  });

  // =========================
  // 4️⃣ Ayudas GENERALES (siempre)
  // =========================
  ayudas
    .filter((h) => h.tipo === 'GENERAL')
    .forEach((h) => {
      if (!added.has(h.ayuda_id)) {
        generalHelps.push(h);
        added.add(h.ayuda_id);
      }
    });

  // =========================
  // 5️⃣ Orden final
  // =========================
  return [...padecimientoHelps, ...nutrienteHelps, ...generalHelps];
}