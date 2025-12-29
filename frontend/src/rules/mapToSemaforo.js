// src/rules/mapToSemaforo.js

export function mapProductToSemaforo(evaluation) {
  return {
    azucar: evaluation.azucares_g?.level,
    sodio: evaluation.sodio_mg?.level,
    grasas: evaluation.grasas_saturadas_g?.level,
  };
}

export function mapProductValues(producto) {
  return {
    azucar: producto.azucares_g,
    sodio: producto.sodio_mg,
    grasas: producto.grasas_saturadas_g,
  };
}