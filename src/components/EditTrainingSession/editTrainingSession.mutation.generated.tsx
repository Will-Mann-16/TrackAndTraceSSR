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
export type CreateTrainingSessionMutationVariables = Types.Exact<{
  trainingSession: Types.TrainingSessionInput;
}>;

export type CreateTrainingSessionMutation = { __typename?: "Mutation" } & {
  createTrainingSession: {
    __typename?: "TrainingSession";
  } & TrainingSessionFragment;
};

export type UpdateTrainingSessionMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
  trainingSession: Types.TrainingSessionInput;
}>;

export type UpdateTrainingSessionMutation = { __typename?: "Mutation" } & {
  updateTrainingSession: {
    __typename?: "TrainingSession";
  } & TrainingSessionFragment;
};

export type DeleteTrainingSessionMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type DeleteTrainingSessionMutation = { __typename?: "Mutation" } & {
  deleteTrainingSession: {
    __typename?: "TrainingSession";
  } & TrainingSessionFragment;
};

export const CreateTrainingSessionDocument = gql`
  mutation CreateTrainingSession($trainingSession: TrainingSessionInput!) {
    createTrainingSession(trainingSession: $trainingSession) {
      ...TrainingSession
    }
  }
  ${TrainingSessionFragmentDoc}
`;

// Don't use for SSG
export const useCreateTrainingSessionMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    CreateTrainingSessionMutation,
    CreateTrainingSessionMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    CreateTrainingSessionMutation,
    CreateTrainingSessionMutationVariables
  >(CreateTrainingSessionDocument, options);
};

export type CreateTrainingSessionMutationHookResult = ReturnType<
  typeof useCreateTrainingSessionMutation
>;
export type CreateTrainingSessionMutationResult = Apollo.MutationResult<
  CreateTrainingSessionMutation
>;

export async function getCreateTrainingSession(
  options?: Omit<
    Apollo.QueryOptions<CreateTrainingSessionMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<CreateTrainingSessionMutation>({
    ...options,
    query: CreateTrainingSessionDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type CreateTrainingSessionMutationOptions = Apollo.BaseMutationOptions<
  CreateTrainingSessionMutation,
  CreateTrainingSessionMutationVariables
>;
export const UpdateTrainingSessionDocument = gql`
  mutation UpdateTrainingSession(
    $id: ID!
    $trainingSession: TrainingSessionInput!
  ) {
    updateTrainingSession(id: $id, trainingSession: $trainingSession) {
      ...TrainingSession
    }
  }
  ${TrainingSessionFragmentDoc}
`;

// Don't use for SSG
export const useUpdateTrainingSessionMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    UpdateTrainingSessionMutation,
    UpdateTrainingSessionMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    UpdateTrainingSessionMutation,
    UpdateTrainingSessionMutationVariables
  >(UpdateTrainingSessionDocument, options);
};

export type UpdateTrainingSessionMutationHookResult = ReturnType<
  typeof useUpdateTrainingSessionMutation
>;
export type UpdateTrainingSessionMutationResult = Apollo.MutationResult<
  UpdateTrainingSessionMutation
>;

export async function getUpdateTrainingSession(
  options?: Omit<
    Apollo.QueryOptions<UpdateTrainingSessionMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<UpdateTrainingSessionMutation>({
    ...options,
    query: UpdateTrainingSessionDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type UpdateTrainingSessionMutationOptions = Apollo.BaseMutationOptions<
  UpdateTrainingSessionMutation,
  UpdateTrainingSessionMutationVariables
>;
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
