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
      categoria
      tipo_empaquetado
    }
  }
`;

export const GET_PRODUCTOS_BARCODE = gql`
  query GetProductos {
    producto {
      producto_id
      nombre
      cantidad_envase
      unidad_envase
      foto_producto
      codigo_barra
      azucares_g
      sodio_mg
      grasas_saturadas_g
      activo
      categoria
      tipo_empaquetado
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
      categoria
      tipo_empaquetado
    }
  }
`;

export const UPDATE_PRODUCT_PHOTO = gql`
  mutation UpdateProductPhoto($id: Int!, $foto: String!) {
    update_producto_by_pk(pk_columns: {producto_id: $id}, _set: {foto_producto: $foto}) {
      producto_id
      foto_producto
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

// 1. Borrar Producto
export const DELETE_PRODUCTO = gql`
  mutation DeleteProducto($id: Int!) {
    delete_producto_by_pk(producto_id: $id) {
      producto_id
      nombre
    }
  }
`;

// 2. Actualizar cualquier campo del producto
// Nota: Usamos producto_set_input que es el tipo estándar de Hasura para actualizaciones
export const UPDATE_PRODUCTO = gql`
  mutation UpdateProducto($id: Int!, $changes: producto_set_input!) {
    update_producto_by_pk(
      pk_columns: { producto_id: $id }, 
      _set: $changes
    ) {
      producto_id
      nombre
    }
  }
`;

// 3. (Extra) Insertar Producto nuevo
export const INSERT_PRODUCTO = gql`
  mutation InsertProducto($object: producto_insert_input!) {
    insert_producto_one(object: $object) {
      producto_id
      nombre
    }
  }
`;

export const GET_ALL_PRODUCTOS = gql`
  query GetAllProductos {
    producto {
      producto_id
      nombre
      cantidad_envase
      unidad_envase
      foto_producto
      codigo_barra
      energia_kcal
      proteinas_g
      grasas_totales_g
      grasas_saturadas_g
      carbohidratos_g
      azucares_g
      sodio_mg
      categoria
      tipo_empaquetado
    }
  }
`;