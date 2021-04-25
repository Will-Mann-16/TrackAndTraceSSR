/* eslint-disable no-use-before-define */
import * as Types from "../graphql/types";

import { gql } from "@apollo/client";
export type UserFragment = { __typename?: "User" } & Pick<
  Types.User,
  "id" | "name" | "email" | "phoneNumber"
>;

export type TrainingSessionFragment = { __typename?: "TrainingSession" } & Pick<
  Types.TrainingSession,
  "id" | "start" | "end" | "title" | "description" | "public"
> & { attending: Array<{ __typename?: "User" } & UserFragment> };

export type FixtureFragment = { __typename?: "Fixture" } & Pick<
  Types.Fixture,
  "id" | "start" | "description" | "location" | "opponent"
> & {
    players: Array<
      { __typename?: "FixturePlayer" } & FixturePlayerWithUserFragment
    >;
  };

export type Session_Fixture_Fragment = { __typename?: "Fixture" } & Pick<
  Types.Fixture,
  "id" | "start" | "description"
> &
  FixtureFragment;

export type Session_TrainingSession_Fragment = {
  __typename?: "TrainingSession";
} & Pick<Types.TrainingSession, "id" | "start" | "description"> &
  TrainingSessionFragment;

export type SessionFragment =
  | Session_Fixture_Fragment
  | Session_TrainingSession_Fragment;

export type SessionWithTeam_Fixture_Fragment = { __typename?: "Fixture" } & {
  team: { __typename?: "Team" } & TeamFragment;
} & Session_Fixture_Fragment;

export type SessionWithTeam_TrainingSession_Fragment = {
  __typename?: "TrainingSession";
} & {
  team: { __typename?: "Team" } & TeamFragment;
} & Session_TrainingSession_Fragment;

export type SessionWithTeamFragment =
  | SessionWithTeam_Fixture_Fragment
  | SessionWithTeam_TrainingSession_Fragment;

export type FixturePlayerFragment = { __typename?: "FixturePlayer" } & Pick<
  Types.FixturePlayer,
  "id" | "isPlaying"
>;

export type FixturePlayerWithUserFragment = { __typename?: "FixturePlayer" } & {
  user: { __typename?: "User" } & UserFragment;
} & FixturePlayerFragment;

export type TeamFragment = { __typename?: "Team" } & Pick<
  Types.Team,
  "id" | "name" | "slug" | "bio"
>;

export type TeamMemberFragment = { __typename?: "TeamMember" } & Pick<
  Types.TeamMember,
  "id" | "status"
>;

export type TeamMemberWithUserFragment = { __typename?: "TeamMember" } & {
  user: { __typename?: "User" } & UserFragment;
} & TeamMemberFragment;

export type TeamMemberWithTeamFragment = { __typename?: "TeamMember" } & {
  team: { __typename?: "Team" } & TeamFragment;
} & TeamMemberFragment;

export type TeamWithMembersFragment = { __typename?: "Team" } & {
  members: Array<{ __typename?: "TeamMember" } & TeamMemberWithUserFragment>;
} & TeamFragment;

export type TeamWithSessionsFragment = { __typename?: "Team" } & {
  sessions: Array<
    | ({ __typename?: "Fixture" } & SessionWithTeam_Fixture_Fragment)
    | ({
        __typename?: "TrainingSession";
      } & SessionWithTeam_TrainingSession_Fragment)
  >;
} & TeamFragment;

export type FullTeamFragment = { __typename?: "Team" } & {
  members: Array<{ __typename?: "TeamMember" } & TeamMemberWithUserFragment>;
  sessions: Array<
    | ({ __typename?: "Fixture" } & SessionWithTeam_Fixture_Fragment)
    | ({
        __typename?: "TrainingSession";
      } & SessionWithTeam_TrainingSession_Fragment)
  >;
} & TeamFragment;

export type FullUserFragment = { __typename?: "User" } & Pick<
  Types.User,
  "isAdmin"
> & {
    teams: Array<{ __typename?: "Team" } & TeamFragment>;
    sessions: Array<
      | ({ __typename?: "Fixture" } & SessionWithTeam_Fixture_Fragment)
      | ({
          __typename?: "TrainingSession";
        } & SessionWithTeam_TrainingSession_Fragment)
    >;
  } & UserFragment;

export const TeamMemberFragmentDoc = gql`
  fragment TeamMember on TeamMember {
    id
    status
  }
`;
export const TeamFragmentDoc = gql`
  fragment Team on Team {
    id
    name
    slug
    bio
  }
`;
export const TeamMemberWithTeamFragmentDoc = gql`
  fragment TeamMemberWithTeam on TeamMember {
    ...TeamMember
    team {
      ...Team
    }
  }
  ${TeamMemberFragmentDoc}
  ${TeamFragmentDoc}
`;
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    name
    email
    phoneNumber
  }
`;
export const TeamMemberWithUserFragmentDoc = gql`
  fragment TeamMemberWithUser on TeamMember {
    ...TeamMember
    user {
      ...User
    }
  }
  ${TeamMemberFragmentDoc}
  ${UserFragmentDoc}
`;
export const TeamWithMembersFragmentDoc = gql`
  fragment TeamWithMembers on Team {
    ...Team
    members {
      ...TeamMemberWithUser
    }
  }
  ${TeamFragmentDoc}
  ${TeamMemberWithUserFragmentDoc}
`;
export const FixturePlayerFragmentDoc = gql`
  fragment FixturePlayer on FixturePlayer {
    id
    isPlaying
  }
`;
export const FixturePlayerWithUserFragmentDoc = gql`
  fragment FixturePlayerWithUser on FixturePlayer {
    ...FixturePlayer
    user {
      ...User
    }
  }
  ${FixturePlayerFragmentDoc}
  ${UserFragmentDoc}
`;
export const FixtureFragmentDoc = gql`
  fragment Fixture on Fixture {
    id
    start
    description
    location
    opponent
    players {
      ...FixturePlayerWithUser
    }
  }
  ${FixturePlayerWithUserFragmentDoc}
`;
export const TrainingSessionFragmentDoc = gql`
  fragment TrainingSession on TrainingSession {
    id
    start
    end
    title
    description
    attending {
      ...User
    }
    public
  }
  ${UserFragmentDoc}
`;
export const SessionFragmentDoc = gql`
  fragment Session on Session {
    id
    start
    description
    ... on Fixture {
      ...Fixture
    }
    ... on TrainingSession {
      ...TrainingSession
    }
  }
  ${FixtureFragmentDoc}
  ${TrainingSessionFragmentDoc}
`;
export const SessionWithTeamFragmentDoc = gql`
  fragment SessionWithTeam on Session {
    ...Session
    team {
      ...Team
    }
  }
  ${SessionFragmentDoc}
  ${TeamFragmentDoc}
`;
export const TeamWithSessionsFragmentDoc = gql`
  fragment TeamWithSessions on Team {
    ...Team
    sessions {
      ...SessionWithTeam
    }
  }
  ${TeamFragmentDoc}
  ${SessionWithTeamFragmentDoc}
`;
export const FullTeamFragmentDoc = gql`
  fragment FullTeam on Team {
    ...Team
    members {
      ...TeamMemberWithUser
    }
    sessions {
      ...SessionWithTeam
    }
  }
  ${TeamFragmentDoc}
  ${TeamMemberWithUserFragmentDoc}
  ${SessionWithTeamFragmentDoc}
`;
export const FullUserFragmentDoc = gql`
  fragment FullUser on User {
    ...User
    isAdmin
    teams {
      ...Team
    }
    sessions {
      ...SessionWithTeam
    }
  }
  ${UserFragmentDoc}
  ${TeamFragmentDoc}
  ${SessionWithTeamFragmentDoc}
`;
