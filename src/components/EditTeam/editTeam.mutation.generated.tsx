/* eslint-disable no-use-before-define */
import * as Types from "../../lib/graphql/types";

import {
  FullTeamFragment,
  TeamFragment,
} from "../../lib/fragments/fragments.generated";
import { gql } from "@apollo/client";
import {
  FullTeamFragmentDoc,
  TeamFragmentDoc,
} from "../../lib/fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type CreateTeamMutationVariables = Types.Exact<{
  team: Types.TeamInput;
}>;

export type CreateTeamMutation = { __typename?: "Mutation" } & {
  createTeam: { __typename?: "Team" } & FullTeamFragment;
};

export type UpdateTeamMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
  team: Types.TeamInput;
}>;

export type UpdateTeamMutation = { __typename?: "Mutation" } & {
  updateTeam: { __typename?: "Team" } & FullTeamFragment;
};

export type DeleteTeamMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type DeleteTeamMutation = { __typename?: "Mutation" } & {
  deleteTeam: { __typename?: "Team" } & TeamFragment;
};

export const CreateTeamDocument = gql`
  mutation CreateTeam($team: TeamInput!) {
    createTeam(team: $team) {
      ...FullTeam
    }
  }
  ${FullTeamFragmentDoc}
`;

// Don't use for SSG
export const useCreateTeamMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    CreateTeamMutation,
    CreateTeamMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(
    CreateTeamDocument,
    options
  );
};

export type CreateTeamMutationHookResult = ReturnType<
  typeof useCreateTeamMutation
>;
export type CreateTeamMutationResult = Apollo.MutationResult<
  CreateTeamMutation
>;

export async function getCreateTeam(
  options?: Omit<Apollo.QueryOptions<CreateTeamMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<CreateTeamMutation>({
    ...options,
    query: CreateTeamDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<
  CreateTeamMutation,
  CreateTeamMutationVariables
>;
export const UpdateTeamDocument = gql`
  mutation UpdateTeam($id: ID!, $team: TeamInput!) {
    updateTeam(id: $id, team: $team) {
      ...FullTeam
    }
  }
  ${FullTeamFragmentDoc}
`;

// Don't use for SSG
export const useUpdateTeamMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<UpdateTeamMutation, UpdateTeamMutationVariables>(
    UpdateTeamDocument,
    options
  );
};

export type UpdateTeamMutationHookResult = ReturnType<
  typeof useUpdateTeamMutation
>;
export type UpdateTeamMutationResult = Apollo.MutationResult<
  UpdateTeamMutation
>;

export async function getUpdateTeam(
  options?: Omit<Apollo.QueryOptions<UpdateTeamMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<UpdateTeamMutation>({
    ...options,
    query: UpdateTeamDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type UpdateTeamMutationOptions = Apollo.BaseMutationOptions<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
>;
export const DeleteTeamDocument = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`;

// Don't use for SSG
export const useDeleteTeamMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    DeleteTeamMutation,
    DeleteTeamMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(
    DeleteTeamDocument,
    options
  );
};

export type DeleteTeamMutationHookResult = ReturnType<
  typeof useDeleteTeamMutation
>;
export type DeleteTeamMutationResult = Apollo.MutationResult<
  DeleteTeamMutation
>;

export async function getDeleteTeam(
  options?: Omit<Apollo.QueryOptions<DeleteTeamMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<DeleteTeamMutation>({
    ...options,
    query: DeleteTeamDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<
  DeleteTeamMutation,
  DeleteTeamMutationVariables
>;
