// src/graphql/helpQueries.js
import { gql } from '@apollo/client';

export const GET_HELP_WITH_NUTRIENTS = gql`
  query GetHelpWithNutrients {
    ayuda(order_by: { ayuda_id: asc }) {
      ayuda_id
      titulo
      descripcion
      tipo
      ayuda_nutrientes {
        nutriente {
          nutriente_id
          codigo
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
      }
    }
  }
`;

export const GET_PADECIMIENTO_NUTRIENTES = gql`
  query GetPadecimientoNutrientes {
    padecimiento {
      nombre
      padecimiento_nutrientes {
        nutriente {
          nutriente_id
          codigo
        }
      }
    }
  }
`;

export const GET_ADMIN_AYUDAS = gql`
query GetAyudasAdmin {
  ayuda {
    ayuda_id
    titulo
    descripcion
    tipo
    activo

    ayuda_nutrientes {
      nutriente {
        nutriente_id
        nombre
        codigo
        unidad
      }
    }
    padecimiento_ayudas {
      padecimiento {
        padecimiento_id
        nombre
        descripcion
      }
    }
  }
}
`;

export const GET_CATALOGOS = gql`
  query GetCatalogos {
    nutriente { nutriente_id nombre }
    padecimiento { padecimiento_id nombre }
  }
`;