import { gql } from '@apollo/client';

export const GET_LISTAS_USUARIO = gql`
  query GetListasUsuario($usuario_id: Int!) {
    lista_compra(
      where: { usuario_id: { _eq: $usuario_id } }
      order_by: { created_at: desc }
    ) {
      lista_id
      nombre
      created_at
    }
  }
`;

export const GET_LISTA_BY_ID = gql`
  query GetListaById($lista_id: Int!) {
    lista_compra_by_pk(lista_id: $lista_id) {
      lista_id
      nombre
    }
  }
`;

export const INSERT_LISTA = gql`
  mutation InsertLista($nombre: String!, $usuario_id: Int!) {
    insert_lista_compra_one(object: {
      nombre: $nombre
      usuario_id: $usuario_id
    }) {
      lista_id
      nombre
    }
  }
`;

export const GET_PRODUCTOS_DE_LISTA = gql`
  query GetProductosDeLista($lista_id: Int!) {
  lista_producto(
    where: { lista_id: { _eq: $lista_id } }
    order_by: { producto: { nombre: asc } } 
  ) {
    id
    comprado
    cantidad
    producto {
      producto_id
      nombre
      cantidad_envase
      unidad_envase
      foto_producto
      grasas_saturadas_g
      azucares_g
      sodio_mg
    }
  }
}
`;

export const TOGGLE_PRODUCTO_COMPRADO = gql`
  mutation ToggleProductoComprado($id: Int!, $comprado: Boolean!) {
    update_lista_producto_by_pk(
      pk_columns: { id: $id }
      _set: { comprado: $comprado }
    ) {
      id
      comprado
    }
  }
`;

export const DELETE_PRODUCTO_DE_LISTA = gql`
  mutation DeleteProductoDeLista($id: Int!) {
    delete_lista_producto_by_pk(id: $id) {
      id
    }
  }
`;

export const DELETE_LISTA = gql`
  mutation DeleteLista($lista_id: Int!) {
    delete_lista_compra_by_pk(lista_id: $lista_id) {
      lista_id
    }
  }
`;

export const UPDATE_LISTA = gql`
  mutation UpdateLista($lista_id: Int!, $nombre: String!) {
    update_lista_compra_by_pk(
      pk_columns: { lista_id: $lista_id }
      _set: { nombre: $nombre }
    ) {
      lista_id
      nombre
    }
  }
`;

export const UPDATE_UNIDAD_PRODUCTO = gql`
  mutation UpdateUnidadProducto($id: Int!, $unidad: Int!) {
    update_lista_producto_by_pk(
      pk_columns: { id: $id }
      _set: { cantidad: $unidad }
    ) {
      id
      cantidad
    }
  }
`;

export const INSERT_PRODUCTO_A_LISTA = gql`
  mutation InsertProductoALista(
    $lista_id: Int!
    $producto_id: Int!
    $cantidad: Int!
  ) {
    insert_lista_producto_one(
      object: {
        lista_id: $lista_id
        producto_id: $producto_id
        cantidad: $cantidad
        comprado: false
      }
    ) {
      id
      cantidad
      comprado
    }
  }
`;