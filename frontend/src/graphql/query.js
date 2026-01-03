// src/graphql/query.js
import { gql } from "@apollo/client";

export const LOGIN_USUARIO = gql`
  query LoginUsuario($email: String!, $password_hash: String!) {
    usuario(
      where: {
        email: { _eq: $email },
        password_hash: { _eq: $password_hash }
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

export const GET_USUARIOS = gql`
  query GetUsuarios {
    usuario(order_by: { usuario_id: asc }) {
      usuario_id
      nombre
      email
      password_hash
      foto_perfil
      rol
      fecha_registro

      usuario_padecimientos {
        padecimiento {
          padecimiento_id
          nombre
          descripcion
        }
      }
    }
  }
`;

export const GET_USUARIO_PADECIMIENTOS = gql`
  query GetUsuarioPadecimientos($usuario_id: Int!) {
    usuario_padecimiento(
      where: { usuario_id: { _eq: $usuario_id } }
    ) {
      padecimiento {
        padecimiento_id
        nombre
        descripcion
      }
    }
  }
`;

export const GET_PADECIMIENTOS = gql`
  query GetPadecimientos {
    padecimiento(order_by: { nombre: asc }) {
      padecimiento_id
      nombre
      descripcion
    }
  }
`;

export const GET_HELP = gql`
    query GetHelp {
        ayuda(order_by: { ayuda_id: asc }) {
            ayuda_id
            titulo
            descripcion
            tipo
        }
    }
`;