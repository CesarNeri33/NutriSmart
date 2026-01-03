import React from "react";
import { useQuery } from "@apollo/client";
import { TEST_USUARIOS_TODOS } from "../../graphql/testQuery";
import { TEST_USUARIO_POR_EMAIL } from "../../graphql/testQuery";
import { TEST_USUARIO_LOGIN } from "../../graphql/testQuery";

const TestHasuraPage = () => {
  // const { data, loading, error } = useQuery(TEST_USUARIOS_TODOS);

  //const { data, loading, error } = useQuery(
  //TEST_USUARIO_POR_EMAIL,
  //{
  //  variables: {
  //    email: "Cesar33Orozco@outlook.es"
  //  }
  //}
  //);

  const { data, loading, error } = useQuery(
  TEST_USUARIO_LOGIN,
  {
    variables: {
      email: "Cesar33Orozco@outlook.es",
      password_hash: "Mando667.667"
    }
  }
  );


  if (loading) {
    console.log("⏳ Cargando datos de Hasura...");
    return <p>Cargando...</p>;
  }

  if (error) {
    console.error("🔥 Error Hasura:", error);
    return <p>Error</p>;
  }

  console.log("✅ Datos recibidos de Hasura:");
  console.log(data);

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Hasura</h2>
      <p>Revisa la consola 👀</p>
    </div>
  );
};

export default TestHasuraPage;
