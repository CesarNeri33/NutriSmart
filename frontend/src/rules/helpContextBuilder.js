// src/rules/helpContextBuilder.js

/**
 * Construye el contexto de ayudas a partir de respuestas de Hasura
 */
export function buildHelpContext({
  ayudasData,
  padecimientoNutrienteData,
  usuarioPadecimientosData,
}) {
  // =========================
  // 1️⃣ Ayudas (array plano)
  // =========================
  const ayudas = ayudasData?.ayuda ?? [];

  // =========================
  // 2️⃣ ayuda_id → [nutrienteKey]
  // =========================
  const ayudaNutrienteMap = {};

  ayudas.forEach((ayuda) => {
    ayudaNutrienteMap[ayuda.ayuda_id] =
      ayuda.ayuda_nutrientes?.map(
        (rel) => rel.nutriente?.codigo
      ).filter(Boolean) || [];
  });

  // =========================
  // 3️⃣ nutrienteKey → [padecimientoNombre]
  // =========================
  const nutrientPadecimientoMap = {};

  padecimientoNutrienteData?.padecimiento?.forEach((p) => {
    p.padecimiento_nutrientes?.forEach((rel) => {
      const nutrientKey = rel.nutriente?.codigo;
      if (!nutrientKey) return;

      if (!nutrientPadecimientoMap[nutrientKey]) {
        nutrientPadecimientoMap[nutrientKey] = [];
      }

      nutrientPadecimientoMap[nutrientKey].push(p.nombre);
    });
  });

  // =========================
  // 4️⃣ Padecimientos del usuario
  // =========================

    const userPadecimientos =
    usuarioPadecimientosData?.usuario_padecimiento?.map(
      (up) => up.padecimiento?.nombre
    ).filter(Boolean) || [];

//console.log('AYUDAS:', ayudas);
//console.log('AYUDA NUTRIENTE MAP:', ayudaNutrienteMap);
//console.log('NUTRIENT PADECIMIENTO MAP:', nutrientPadecimientoMap);
//console.log('USER PADECIMIENTOS:', userPadecimientos);
  return {
    ayudas,
    ayudaNutrienteMap,
    nutrientPadecimientoMap,
    userPadecimientos,
  };
}