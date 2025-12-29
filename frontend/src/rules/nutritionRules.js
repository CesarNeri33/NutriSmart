// src/rules/nutritionRules.js
import { NUTRIENT_RULES } from './nutrientThresholds';

export function evaluateNutrient(nutrientKey, value) {
  const rule = NUTRIENT_RULES[nutrientKey];
  if (!rule) return null;

  if (!rule.critical) {
    return {
      level: 'info',
      critical: false,
    };
  }

  let level = 'rojo';
  if (value <= rule.green) level = 'verde';
  else if (value <= rule.yellow) level = 'amarillo';

  return {
    level,
    critical: true,
  };
}

export function evaluateProduct(producto) {
  const result = {};

  Object.keys(NUTRIENT_RULES).forEach((key) => {
    result[key] = evaluateNutrient(key, producto[key]);
  });

  return result;
}