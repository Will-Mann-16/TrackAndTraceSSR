/* eslint-disable no-use-before-define */
import * as Types from "../../graphql/types";

import { FullUserFragment } from "../../fragments/fragments.generated";
import { gql } from "@apollo/client";
import { FullUserFragmentDoc } from "../../fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type UserDisplayQueryVariables = Types.Exact<{ [key: string]: never }>;

export type UserDisplayQuery = { __typename?: "Query" } & {
  user: { __typename?: "User" } & FullUserFragment;
};

export const UserDisplayDocument = gql`
  query UserDisplay {
    user {
      ...FullUser
    }
  }
  ${FullUserFragmentDoc}
`;

// Don't use for SSG
export const useUserDisplayQuery = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.QueryHookOptions<UserDisplayQuery, UserDisplayQueryVariables>
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useQuery<UserDisplayQuery, UserDisplayQueryVariables>(
    UserDisplayDocument,
    options
  );
};

export type UserDisplayQueryHookResult = ReturnType<typeof useUserDisplayQuery>;
export type UserDisplayQueryResult = Apollo.QueryResult<
  UserDisplayQuery,
  UserDisplayQueryVariables
>;

export async function getUserDisplay(
  options?: Omit<Apollo.QueryOptions<UserDisplayQueryVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<UserDisplayQuery>({
    ...options,
    query: UserDisplayDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
