/* eslint-disable no-use-before-define */
import * as Types from "../../lib/graphql/types";

import {
  TeamMemberWithUserFragment,
  TeamMemberFragment,
} from "../../lib/fragments/fragments.generated";
import { gql } from "@apollo/client";
import {
  TeamMemberWithUserFragmentDoc,
  TeamMemberFragmentDoc,
} from "../../lib/fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type JoinTeamMutationVariables = Types.Exact<{
  team: Types.Scalars["ID"];
}>;

export type JoinTeamMutation = { __typename?: "Mutation" } & {
  joinTeam: { __typename?: "TeamMember" } & TeamMemberWithUserFragment;
};

export type ApproveTeamMemberMutationVariables = Types.Exact<{
  team: Types.Scalars["ID"];
  user: Types.Scalars["ID"];
}>;

export type ApproveTeamMemberMutation = { __typename?: "Mutation" } & {
  approveTeamMember: { __typename?: "TeamMember" } & TeamMemberFragment;
};

export type SetTeamCaptainMutationVariables = Types.Exact<{
  team: Types.Scalars["ID"];
  user: Types.Scalars["ID"];
}>;

export type SetTeamCaptainMutation = { __typename?: "Mutation" } & {
  setTeamCaptain: { __typename?: "TeamMember" } & TeamMemberFragment;
};

export const JoinTeamDocument = gql`
  mutation JoinTeam($team: ID!) {
    joinTeam(team: $team) {
      ...TeamMemberWithUser
    }
  }
  ${TeamMemberWithUserFragmentDoc}
`;

// Don't use for SSG
export const useJoinTeamMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<JoinTeamMutation, JoinTeamMutationVariables>
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<JoinTeamMutation, JoinTeamMutationVariables>(
    JoinTeamDocument,
    options
  );
};

export type JoinTeamMutationHookResult = ReturnType<typeof useJoinTeamMutation>;
export type JoinTeamMutationResult = Apollo.MutationResult<JoinTeamMutation>;

export async function getJoinTeam(
  options?: Omit<Apollo.QueryOptions<JoinTeamMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<JoinTeamMutation>({
    ...options,
    query: JoinTeamDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type JoinTeamMutationOptions = Apollo.BaseMutationOptions<
  JoinTeamMutation,
  JoinTeamMutationVariables
>;
export const ApproveTeamMemberDocument = gql`
  mutation ApproveTeamMember($team: ID!, $user: ID!) {
    approveTeamMember(team: $team, user: $user) {
      ...TeamMember
    }
  }
  ${TeamMemberFragmentDoc}
`;

// Don't use for SSG
export const useApproveTeamMemberMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    ApproveTeamMemberMutation,
    ApproveTeamMemberMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    ApproveTeamMemberMutation,
    ApproveTeamMemberMutationVariables
  >(ApproveTeamMemberDocument, options);
};

export type ApproveTeamMemberMutationHookResult = ReturnType<
  typeof useApproveTeamMemberMutation
>;
export type ApproveTeamMemberMutationResult = Apollo.MutationResult<
  ApproveTeamMemberMutation
>;

export async function getApproveTeamMember(
  options?: Omit<
    Apollo.QueryOptions<ApproveTeamMemberMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<ApproveTeamMemberMutation>({
    ...options,
    query: ApproveTeamMemberDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type ApproveTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  ApproveTeamMemberMutation,
  ApproveTeamMemberMutationVariables
>;
export const SetTeamCaptainDocument = gql`
  mutation SetTeamCaptain($team: ID!, $user: ID!) {
    setTeamCaptain(team: $team, user: $user) {
      ...TeamMember
    }
  }
  ${TeamMemberFragmentDoc}
`;

// Don't use for SSG
export const useSetTeamCaptainMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    SetTeamCaptainMutation,
    SetTeamCaptainMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    SetTeamCaptainMutation,
    SetTeamCaptainMutationVariables
  >(SetTeamCaptainDocument, options);
};

export type SetTeamCaptainMutationHookResult = ReturnType<
  typeof useSetTeamCaptainMutation
>;
export type SetTeamCaptainMutationResult = Apollo.MutationResult<
  SetTeamCaptainMutation
>;

export async function getSetTeamCaptain(
  options?: Omit<Apollo.QueryOptions<SetTeamCaptainMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<SetTeamCaptainMutation>({
    ...options,
    query: SetTeamCaptainDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type SetTeamCaptainMutationOptions = Apollo.BaseMutationOptions<
  SetTeamCaptainMutation,
  SetTeamCaptainMutationVariables
>;
