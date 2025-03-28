import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

// Authorization handling for WebSocket
// This code is used to pass the access token to the WebSocket connection
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

// Data provider
// This code is used to create a data provider that can be used to interact with the GraphQL API
// The data provider is used to interact with the GraphQL API using the GraphQL client
export const dataProvider = graphqlDataProvider(client);

// Live provider
// This code is used to create a live provider that can be used to interact with the GraphQL API using WebSocket
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
