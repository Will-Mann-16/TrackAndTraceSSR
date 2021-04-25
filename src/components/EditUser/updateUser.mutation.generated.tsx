/* eslint-disable no-use-before-define */
import * as Types from "../../lib/graphql/types";

import { FullUserFragment } from "../../lib/fragments/fragments.generated";
import { gql } from "@apollo/client";
import { FullUserFragmentDoc } from "../../lib/fragments/fragments.generated";
import * as Apollo from "@apollo/client";
import { NextRouter, useRouter } from "next/router";
import { initializeApollo } from "src/lib/apollo";
export type UpdateUserMutationVariables = Types.Exact<{
  user: Types.UserInput;
}>;

export type UpdateUserMutation = { __typename?: "Mutation" } & {
  updateUser: { __typename?: "User" } & FullUserFragment;
};

export const UpdateUserDocument = gql`
  mutation UpdateUser($user: UserInput!) {
    updateUser(user: $user) {
      ...FullUser
    }
  }
  ${FullUserFragmentDoc}
`;

// Don't use for SSG
export const useUpdateUserMutation = (
  optionsFunc?: (
    router: NextRouter
  ) => Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >
) => {
  const router = useRouter();
  const options = optionsFunc ? optionsFunc(router) : {};
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
};

export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult = Apollo.MutationResult<
  UpdateUserMutation
>;

export async function getUpdateUser(
  options?: Omit<Apollo.QueryOptions<UpdateUserMutationVariables>, "query">
) {
  const apolloClient = initializeApollo();
  const data = await apolloClient.query<UpdateUserMutation>({
    ...options,
    query: UpdateUserDocument,
  });

  return {
    data: data?.data,
    error: data?.error ?? data?.errors ?? null,
    apolloClient,
  };
}
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
