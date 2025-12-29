import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  uri: "http://localhost:8080/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "admin123",
  },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;