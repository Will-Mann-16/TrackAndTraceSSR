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
export type ToggleTrainingSessionAttendanceMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type ToggleTrainingSessionAttendanceMutation = {
  __typename?: "Mutation";
} & {
  toggleTrainingSessionAttendance: {
    __typename?: "TrainingSession";
  } & TrainingSessionFragment;
};

export type ToggleFixtureAvailabilityMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type ToggleFixtureAvailabilityMutation = { __typename?: "Mutation" } & {
  toggleFixtureAvailability: { __typename?: "Fixture" } & FixtureFragment;
};

export type ToggleFixturePlayingMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
  user: Types.Scalars["ID"];
}>;

export type ToggleFixturePlayingMutation = { __typename?: "Mutation" } & {
  toggleFixturePlaying: { __typename?: "Fixture" } & FixtureFragment;
};

export const ToggleTrainingSessionAttendanceDocument = gql`
  mutation ToggleTrainingSessionAttendance($id: ID!) {
    toggleTrainingSessionAttendance(id: $id) {
      ...TrainingSession
    }
  }
  ${TrainingSessionFragmentDoc}
`;

// Don't use for SSG
export const useToggleTrainingSessionAttendanceMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    ToggleTrainingSessionAttendanceMutation,
    ToggleTrainingSessionAttendanceMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    ToggleTrainingSessionAttendanceMutation,
    ToggleTrainingSessionAttendanceMutationVariables
  >(ToggleTrainingSessionAttendanceDocument, options);
};

export type ToggleTrainingSessionAttendanceMutationHookResult = ReturnType<
  typeof useToggleTrainingSessionAttendanceMutation
>;
export type ToggleTrainingSessionAttendanceMutationResult = Apollo.MutationResult<
  ToggleTrainingSessionAttendanceMutation
>;

export async function getToggleTrainingSessionAttendance(
  options?: Omit<
    Apollo.QueryOptions<ToggleTrainingSessionAttendanceMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<
    ToggleTrainingSessionAttendanceMutation
  >({ ...options, query: ToggleTrainingSessionAttendanceDocument });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type ToggleTrainingSessionAttendanceMutationOptions = Apollo.BaseMutationOptions<
  ToggleTrainingSessionAttendanceMutation,
  ToggleTrainingSessionAttendanceMutationVariables
>;
export const ToggleFixtureAvailabilityDocument = gql`
  mutation ToggleFixtureAvailability($id: ID!) {
    toggleFixtureAvailability(id: $id) {
      ...Fixture
    }
  }
  ${FixtureFragmentDoc}
`;

// Don't use for SSG
export const useToggleFixtureAvailabilityMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    ToggleFixtureAvailabilityMutation,
    ToggleFixtureAvailabilityMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    ToggleFixtureAvailabilityMutation,
    ToggleFixtureAvailabilityMutationVariables
  >(ToggleFixtureAvailabilityDocument, options);
};

export type ToggleFixtureAvailabilityMutationHookResult = ReturnType<
  typeof useToggleFixtureAvailabilityMutation
>;
export type ToggleFixtureAvailabilityMutationResult = Apollo.MutationResult<
  ToggleFixtureAvailabilityMutation
>;

export async function getToggleFixtureAvailability(
  options?: Omit<
    Apollo.QueryOptions<ToggleFixtureAvailabilityMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<ToggleFixtureAvailabilityMutation>({
    ...options,
    query: ToggleFixtureAvailabilityDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type ToggleFixtureAvailabilityMutationOptions = Apollo.BaseMutationOptions<
  ToggleFixtureAvailabilityMutation,
  ToggleFixtureAvailabilityMutationVariables
>;
export const ToggleFixturePlayingDocument = gql`
  mutation ToggleFixturePlaying($id: ID!, $user: ID!) {
    toggleFixturePlaying(id: $id, user: $user) {
      ...Fixture
    }
  }
  ${FixtureFragmentDoc}
`;

// Don't use for SSG
export const useToggleFixturePlayingMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    ToggleFixturePlayingMutation,
    ToggleFixturePlayingMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    ToggleFixturePlayingMutation,
    ToggleFixturePlayingMutationVariables
  >(ToggleFixturePlayingDocument, options);
};

export type ToggleFixturePlayingMutationHookResult = ReturnType<
  typeof useToggleFixturePlayingMutation
>;
export type ToggleFixturePlayingMutationResult = Apollo.MutationResult<
  ToggleFixturePlayingMutation
>;

export async function getToggleFixturePlaying(
  options?: Omit<
    Apollo.QueryOptions<ToggleFixturePlayingMutationVariables>,
    "query"
  >
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<ToggleFixturePlayingMutation>({
    ...options,
    query: ToggleFixturePlayingDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type ToggleFixturePlayingMutationOptions = Apollo.BaseMutationOptions<
  ToggleFixturePlayingMutation,
  ToggleFixturePlayingMutationVariables
>;
