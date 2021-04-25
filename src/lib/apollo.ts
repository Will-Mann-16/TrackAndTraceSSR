import { useMemo, useReducer } from "react";

import {
  from,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  Observable,
  NormalizedCacheObject,
  useApolloClient,
  StoreObject,
  Reference,
  DocumentNode,
  TypedDocumentNode,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAccessToken } from "@auth0/nextjs-auth0";
import fetch from "isomorphic-fetch";
import { possibleTypes } from "./graphql/possibleTypes.json";

let apolloClient;

const errorHandler = onError(
  ({ response, operation, graphQLErrors, networkError }) => {
    console.log(response, operation, graphQLErrors, networkError);
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // set to true for SSR
    link: from([
      (errorHandler as unknown) as ApolloLink,
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_HOST + "/api/graphql",
        fetch,
        credentials: "same-origin",
      }),
    ]),
    cache: new InMemoryCache({
      possibleTypes,
      typePolicies: {
        Query: {
          fields: {
            team(_, { args, toReference }) {
              return toReference({
                __typename: "Team",
                id: args.id,
              });
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(
  ctx?: any,
  initialState?: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> {
  const localApolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = localApolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    localApolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return localApolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = localApolloClient;
  return localApolloClient;
}

export function useApollo(
  initialState: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo({}, initialState), [
    initialState,
  ]);

  return store;
}

export type ApolloCacheSSR<T> = T & {
  apolloState?: NormalizedCacheObject;
};

interface UseCachedFragmentOptions<T extends Reference | StoreObject, V> {
  defaultValue: T;
  fragment: DocumentNode | TypedDocumentNode;
  fragmentName?: string;
  variables?: V;
}

export function useCachedFragment<T extends Reference | StoreObject, V = any>({
  defaultValue,
  fragment,
  fragmentName,
  variables,
}: UseCachedFragmentOptions<T, V>): [T, () => void] {
  const apollo = useApolloClient();

  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);

  const value = useMemo(
    () =>
      apollo.cache.readFragment<T, V>({
        id: apollo.cache.identify(defaultValue),
        fragment,
        fragmentName,
        variables,
      }) || defaultValue,
    [apollo.cache, tick]
  );

  return [Object.keys(value).length === 0 ? defaultValue : value, forceUpdate];
}
