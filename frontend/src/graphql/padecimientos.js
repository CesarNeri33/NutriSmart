import { gql } from '@apollo/client';

export const GET_PADECIMIENTOS = gql`
  query GetPadecimientos {
    padecimiento(order_by: {padecimiento_id: desc}) {
      padecimiento_id
      nombre
      descripcion
      padecimiento_nutrientes {
        nutriente {
          nutriente_id
          nombre
        }
      }
      padecimiento_ayudas {
        ayuda {
          ayuda_id
          titulo
        }
      }
    }
  }
`;

export const GET_CATALOGOS = gql`
  query GetCatalogos {
    nutriente {
      nutriente_id
      nombre
    }
    ayuda {
      ayuda_id
      titulo
    }
  }
`;

export const INSERT_PADECIMIENTO = gql`
  mutation InsertPadecimiento($object: padecimiento_insert_input!) {
    insert_padecimiento_one(object: $object) {
      padecimiento_id
      nombre
    }
  }
`;

export const DELETE_PADECIMIENTO = gql`
  mutation DeletePadecimiento($id: Int!) {
    delete_padecimiento_by_pk(padecimiento_id: $id) {
      padecimiento_id
    }
  }
`;

export const UPDATE_PADECIMIENTO = gql`
  mutation UpdatePadecimiento($id: Int!, $changes: padecimiento_set_input!) {
    update_padecimiento_by_pk(pk_columns: {padecimiento_id: $id}, _set: $changes) {
      padecimiento_id
      nombre
    }
  }
`;