import { gql } from "@apollo/client";

/**
 * 1. Query GENERAL
 * ¿Hasura ve la tabla usuario?
 */
export const TEST_USUARIOS_TODOS = gql`
  query TestUsuariosTodos {
    usuario {
      usuario_id
      nombre
      email
      password_hash
    }
  }
`;

/**
 * 2. Query por EMAIL
 * ¿El filtro simple funciona?
 */
export const TEST_USUARIO_POR_EMAIL = gql`
  query TestUsuarioPorEmail($email: String!) {
    usuario(where: { email: { _eq: $email } }) {
      usuario_id
      nombre
      email
      password_hash
    }
  }
`;

/**
 * 3. Query EMAIL + PASSWORD
 * ¿El problema es la contraseña?
 */
export const TEST_USUARIO_LOGIN = gql`
  query TestUsuarioLogin($email: String!, $password_hash: String!) {
    usuario(
      where: {
        email: { _eq: $email }
        password_hash: { _eq: $password_hash }
      }
    ) {
      usuario_id
      nombre
      nombre
      email
      password_hash
    }
  }
`;