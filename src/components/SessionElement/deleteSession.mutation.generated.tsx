/* eslint-disable no-use-before-define */
import * as Types from "../../lib/graphql/types";

import {
  TrainingSessionFragment,
  FixtureFragment,
} from "../../lib/fragments/fragments.generated";
import { gql } from "@apollo/client";
import {
  TrainingSessionFragmentDoc,
  FixtureFragmentDoc,
} from "../../lib/fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type DeleteTrainingSessionMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type DeleteTrainingSessionMutation = { __typename?: "Mutation" } & {
  deleteTrainingSession: {
    __typename?: "TrainingSession";
  } & TrainingSessionFragment;
};

export type DeleteFixtureMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type DeleteFixtureMutation = { __typename?: "Mutation" } & {
  deleteFixture: { __typename?: "Fixture" } & FixtureFragment;
};

export const DeleteTrainingSessionDocument = gql`
  mutation DeleteTrainingSession($id: ID!) {
    deleteTrainingSession(id: $id) {
      ...TrainingSession
    }
  }
  ${TrainingSessionFragmentDoc}
`;

// Don't use for SSG
export const useDeleteTrainingSessionMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    DeleteTrainingSessionMutation,
    DeleteTrainingSessionMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    DeleteTrainingSessionMutation,
    DeleteTrainingSessionMutationVariables
  >(DeleteTrainingSessionDocument, options);
};

export type DeleteTrainingSessionMutationHookResult = ReturnType<
  typeof useDeleteTrainingSessionMutation
>;
export type DeleteTrainingSessionMutationResult = Apollo.MutationResult<
  DeleteTrainingSessionMutation
>;

export async function getDeleteTrainingSession(
  options?: Omit<
    Apollo.QueryOptions<DeleteTrainingSessionMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<DeleteTrainingSessionMutation>({
    ...options,
    query: DeleteTrainingSessionDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type DeleteTrainingSessionMutationOptions = Apollo.BaseMutationOptions<
  DeleteTrainingSessionMutation,
  DeleteTrainingSessionMutationVariables
>;
export const DeleteFixtureDocument = gql`
  mutation DeleteFixture($id: ID!) {
    deleteFixture(id: $id) {
      ...Fixture
    }
  }
  ${FixtureFragmentDoc}
`;

// Don't use for SSG
export const useDeleteFixtureMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    DeleteFixtureMutation,
    DeleteFixtureMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    DeleteFixtureMutation,
    DeleteFixtureMutationVariables
  >(DeleteFixtureDocument, options);
};

export type DeleteFixtureMutationHookResult = ReturnType<
  typeof useDeleteFixtureMutation
>;
export type DeleteFixtureMutationResult = Apollo.MutationResult<
  DeleteFixtureMutation
>;

export async function getDeleteFixture(
  options?: Omit<Apollo.QueryOptions<DeleteFixtureMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<DeleteFixtureMutation>({
    ...options,
    query: DeleteFixtureDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type DeleteFixtureMutationOptions = Apollo.BaseMutationOptions<
  DeleteFixtureMutation,
  DeleteFixtureMutationVariables
>;
