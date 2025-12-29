// src/rules/nutrientThresholds.js
export const NUTRIENT_RULES = {
  azucares_g: {
    critical: true,
    green: 5,
    yellow: 10,
  },
  sodio_mg: {
    critical: true,
    green: 120,
    yellow: 300,
  },
  grasas_saturadas_g: {
    critical: true,
    green: 1.5,
    yellow: 5,
  },

  // Informativos (sin semáforo)
  energia_kcal: { critical: false },
  proteinas_g: { critical: false },
  grasas_totales_g: { critical: false },
  carbohidratos_g: { critical: false },
};
