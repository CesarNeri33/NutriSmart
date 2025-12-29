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