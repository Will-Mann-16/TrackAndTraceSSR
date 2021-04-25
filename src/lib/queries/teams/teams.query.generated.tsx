/* eslint-disable no-use-before-define */
import * as Types from "../../graphql/types";

import {
  TeamWithMembersFragment,
  FullTeamFragment,
  TeamFragment,
} from "../../fragments/fragments.generated";
import { gql } from "@apollo/client";
import {
  TeamWithMembersFragmentDoc,
  FullTeamFragmentDoc,
  TeamFragmentDoc,
} from "../../fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type TeamsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type TeamsQuery = { __typename?: "Query" } & {
  teams: Array<{ __typename?: "Team" } & TeamWithMembersFragment>;
};

export type TeamQueryVariables = Types.Exact<{
  id?: Types.Maybe<Types.Scalars["ID"]>;
  slug?: Types.Maybe<Types.Scalars["String"]>;
}>;

export type TeamQuery = { __typename?: "Query" } & {
  team?: Types.Maybe<{ __typename?: "Team" } & FullTeamFragment>;
};

export const TeamsDocument = gql`
  query Teams {
    teams {
      ...TeamWithMembers
    }
  }
  ${TeamWithMembersFragmentDoc}
`;

// Don't use for SSG
export const useTeamsQuery = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.QueryHookOptions<TeamsQuery, TeamsQueryVariables>
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useQuery<TeamsQuery, TeamsQueryVariables>(
    TeamsDocument,
    options
  );
};

export type TeamsQueryHookResult = ReturnType<typeof useTeamsQuery>;
export type TeamsQueryResult = Apollo.QueryResult<
  TeamsQuery,
  TeamsQueryVariables
>;

export async function getTeams(
  options?: Omit<Apollo.QueryOptions<TeamsQueryVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<TeamsQuery>({
    ...options,
    query: TeamsDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export const TeamDocument = gql`
  query Team($id: ID, $slug: String) {
    team(id: $id, slug: $slug) {
      ...FullTeam
    }
  }
  ${FullTeamFragmentDoc}
`;

// Don't use for SSG
export const useTeamQuery = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.QueryHookOptions<TeamQuery, TeamQueryVariables>
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options);
};

export type TeamQueryHookResult = ReturnType<typeof useTeamQuery>;
export type TeamQueryResult = Apollo.QueryResult<TeamQuery, TeamQueryVariables>;

export async function getTeam(
  options?: Omit<Apollo.QueryOptions<TeamQueryVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<TeamQuery>({
    ...options,
    query: TeamDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
