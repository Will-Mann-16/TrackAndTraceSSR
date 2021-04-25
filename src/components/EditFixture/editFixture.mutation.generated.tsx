/* eslint-disable no-use-before-define */
import * as Types from "../../lib/graphql/types";

import { FixtureFragment } from "../../lib/fragments/fragments.generated";
import { gql } from "@apollo/client";
import { FixtureFragmentDoc } from "../../lib/fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type CreateFixtureMutationVariables = Types.Exact<{
  fixture: Types.FixtureInput;
}>;

export type CreateFixtureMutation = { __typename?: "Mutation" } & {
  createFixture: { __typename?: "Fixture" } & FixtureFragment;
};

export type UpdateFixtureMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
  fixture: Types.FixtureInput;
}>;

export type UpdateFixtureMutation = { __typename?: "Mutation" } & {
  updateFixture: { __typename?: "Fixture" } & FixtureFragment;
};

export type DeleteFixtureMutationVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type DeleteFixtureMutation = { __typename?: "Mutation" } & {
  deleteFixture: { __typename?: "Fixture" } & FixtureFragment;
};

export const CreateFixtureDocument = gql`
  mutation CreateFixture($fixture: FixtureInput!) {
    createFixture(fixture: $fixture) {
      ...Fixture
    }
  }
  ${FixtureFragmentDoc}
`;

// Don't use for SSG
export const useCreateFixtureMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    CreateFixtureMutation,
    CreateFixtureMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    CreateFixtureMutation,
    CreateFixtureMutationVariables
  >(CreateFixtureDocument, options);
};

export type CreateFixtureMutationHookResult = ReturnType<
  typeof useCreateFixtureMutation
>;
export type CreateFixtureMutationResult = Apollo.MutationResult<
  CreateFixtureMutation
>;

export async function getCreateFixture(
  options?: Omit<Apollo.QueryOptions<CreateFixtureMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<CreateFixtureMutation>({
    ...options,
    query: CreateFixtureDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type CreateFixtureMutationOptions = Apollo.BaseMutationOptions<
  CreateFixtureMutation,
  CreateFixtureMutationVariables
>;
export const UpdateFixtureDocument = gql`
  mutation UpdateFixture($id: ID!, $fixture: FixtureInput!) {
    updateFixture(id: $id, fixture: $fixture) {
      ...Fixture
    }
  }
  ${FixtureFragmentDoc}
`;

// Don't use for SSG
export const useUpdateFixtureMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    UpdateFixtureMutation,
    UpdateFixtureMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<
    UpdateFixtureMutation,
    UpdateFixtureMutationVariables
  >(UpdateFixtureDocument, options);
};

export type UpdateFixtureMutationHookResult = ReturnType<
  typeof useUpdateFixtureMutation
>;
export type UpdateFixtureMutationResult = Apollo.MutationResult<
  UpdateFixtureMutation
>;

export async function getUpdateFixture(
  options?: Omit<Apollo.QueryOptions<UpdateFixtureMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<UpdateFixtureMutation>({
    ...options,
    query: UpdateFixtureDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type UpdateFixtureMutationOptions = Apollo.BaseMutationOptions<
  UpdateFixtureMutation,
  UpdateFixtureMutationVariables
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
