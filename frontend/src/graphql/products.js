// src/graphql/queries/products.js
import { gql } from '@apollo/client';

export const GET_PRODUCTOS = gql`
  query GetProductos {
    producto {
      producto_id
      nombre
      cantidad_envase
      unidad_envase
      foto_producto
      azucares_g
      sodio_mg
      grasas_saturadas_g
      activo
    }
  }
`;

export const GET_PRODUCTO_BY_ID = gql`
  query GetProductoById($id: Int!) {
    producto_by_pk(producto_id: $id) {
      producto_id
      nombre
      cantidad_envase
      unidad_envase
      foto_producto
      energia_kcal
      proteinas_g
      grasas_totales_g
      grasas_saturadas_g
      carbohidratos_g
      azucares_g
      sodio_mg
    }
  }
`;

export const GET_HELP_WITH_NUTRIENTS = gql`
  query GetHelpWithNutrients {
    ayuda {
      ayuda_id
      titulo
      descripcion
      tipo
      ayuda_nutrientes {
        nutriente
      }
    }
  }
`;