// src/graphql/mutations.js
import { gql } from "@apollo/client";

export const REGISTER_USUARIO = gql`
  mutation RegisterUsuario(
    $nombre: String!,
    $email: String!,
    $password_hash: String!,
    $foto_perfil: String
  ) {
    insert_usuario_one(object: {
      nombre: $nombre,
      email: $email,
      password_hash: $password_hash,
      foto_perfil: $foto_perfil
    }) {
      usuario_id
      nombre
      email
    }
  }
`;

export const AD_UPDATE_USUARIO = gql`
  mutation AD_UPDATE_USUARIO(
    $usuario_id: Int!
    $changes: usuario_set_input!
  ) {
    update_usuario_by_pk(
      pk_columns: { usuario_id: $usuario_id }
      _set: $changes
    ) {
      usuario_id
      nombre
      email
      rol
      foto_perfil
      fecha_registro
    }
  }
`;

export const AD_DELETE_USUARIO = gql`
mutation DeleteUsuario($usuario_id: Int!) {
  delete_usuario_by_pk(usuario_id: $usuario_id) {
    usuario_id
  }
}
`;

export const UPDATE_USUARIO = gql`
  mutation UpdateUsuario(
    $usuario_id: Int!
    $nombre: String!
    $email: String!
    $password_hash: String
  ) {
    update_usuario_by_pk(
      pk_columns: { usuario_id: $usuario_id }
      _set: {
        nombre: $nombre
        email: $email
        password_hash: $password_hash
      }
    ) {
      usuario_id
      nombre
      email
      foto_perfil
      rol
    }
  }
`;

export const UPDATE_FOTO_PERFIL = gql`
  mutation UpdateFotoPerfil(
    $usuario_id: Int!
    $foto_perfil: String!
  ) {
    update_usuario_by_pk(
      pk_columns: { usuario_id: $usuario_id }
      _set: { foto_perfil: $foto_perfil }
    ) {
      usuario_id
      foto_perfil
    }
  }
`;

export const AD_UPDATE_FOTO_PERFIL = gql`
  mutation UpdateFotoPerfil(
    $usuario_id: Int!
    $foto_perfil: String
  ) {
    update_usuario_by_pk(
      pk_columns: { usuario_id: $usuario_id }
      _set: { foto_perfil: $foto_perfil }
    ) {
      usuario_id
      foto_perfil
    }
  }
`;

export const INSERT_USUARIO_PADECIMIENTO = gql`
  mutation InsertUsuarioPadecimiento(
    $usuario_id: Int!,
    $padecimiento_id: Int!
  ) {
    insert_usuario_padecimiento_one(
      object: {
        usuario_id: $usuario_id,
        padecimiento_id: $padecimiento_id
      }
    ) {
      usuario_id
      padecimiento_id
    }
  }
`;

export const DELETE_USUARIO_PADECIMIENTO = gql`
  mutation DeleteUsuarioPadecimiento(
    $usuario_id: Int!
    $padecimiento_id: Int!
  ) {
    delete_usuario_padecimiento(
      where: {
        usuario_id: { _eq: $usuario_id }
        padecimiento_id: { _eq: $padecimiento_id }
      }
    ) {
      affected_rows
    }
  }
`;

//Cosillas del moha

export const INSERT_AYUDA = gql`
  mutation InsertAyuda(
    $titulo: String!
    $descripcion: String!
    $tipo: String
  ) {
    insert_ayuda_one(object: {
      titulo: $titulo
      descripcion: $descripcion
      tipo: $tipo
    }) {
      ayuda_id
    }
  }
`;


export const DELETE_AYUDA = gql`
  mutation DeleteAyuda($ayuda_id: Int!) {
    delete_ayuda_by_pk(ayuda_id: $ayuda_id) {
      ayuda_id
    }
  }
`;

export const UPDATE_AYUDA = gql`
  mutation UpdateAyuda(
    $ayuda_id: Int!
    $titulo: String!
    $descripcion: String!
    $tipo: String!  # <--- Agregamos esta variable
  ) {
    update_ayuda_by_pk(
      pk_columns: { ayuda_id: $ayuda_id }
      _set: {
        titulo: $titulo
        descripcion: $descripcion
        tipo: $tipo    # <--- Actualizamos el campo
      }
    ) {
      ayuda_id
      tipo
    }
  }
`;

export const INSERT_AYUDA_NUTRIENTE = gql`
  mutation InsertAyudaNutriente(
    $ayuda_id: Int!
    $nutriente_id: Int!
  ) {
    insert_ayuda_nutriente_one(object: {
      ayuda_id: $ayuda_id
      nutriente_id: $nutriente_id
    }) {
      # Si no hay ID, pedimos los campos que componen la PK
      ayuda_id
      nutriente_id
    }
  }
`;

export const INSERT_AYUDA_PADECIMIENTO = gql`
  mutation InsertAyudaPadecimiento(
    $ayuda_id: Int!
    $padecimiento_id: Int!
  ) {
    insert_padecimiento_ayuda_one(object: {
      ayuda_id: $ayuda_id
      padecimiento_id: $padecimiento_id
    }) {
      id # Aquí sí lo dejamos porque dijiste que esta tabla sí tiene ID
    }
  }
`;

// Query para cargar la ayuda específica al editar
export const GET_AYUDA_DETALLE = gql`
  query GetAyudaDetalle($id: Int!) {
    ayuda_by_pk(ayuda_id: $id) {
      ayuda_id
      titulo
      descripcion
      tipo
      ayuda_nutrientes { nutriente_id }
      padecimiento_ayudas { padecimiento_id }
    }
  }
`;

// Mutación para limpiar relaciones (se usa antes de re-insertar)
export const DELETE_RELACIONES_AYUDA = gql`
  mutation DeleteRelacionesAyuda($ayuda_id: Int!) {
    delete_ayuda_nutriente(where: {ayuda_id: {_eq: $ayuda_id}}) { affected_rows }
    delete_padecimiento_ayuda(where: {ayuda_id: {_eq: $ayuda_id}}) { affected_rows }
  }
`;