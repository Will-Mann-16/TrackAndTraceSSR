/* eslint-disable no-use-before-define,@typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};


export type Fixture = Session & {
  __typename?: 'Fixture';
  id: Scalars['ID'];
  team: Team;
  opponent: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
  players: Array<FixturePlayer>;
};

export type FixtureInput = {
  teamId: Scalars['ID'];
  opponent: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
};

export type FixturePlayer = {
  __typename?: 'FixturePlayer';
  id: Scalars['ID'];
  fixture: Fixture;
  user: User;
  isPlaying: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUser: User;
  createTeam: Team;
  updateTeam: Team;
  deleteTeam: Team;
  joinTeam: TeamMember;
  approveTeamMember: TeamMember;
  setTeamCaptain: TeamMember;
  createTrainingSession: TrainingSession;
  updateTrainingSession: TrainingSession;
  deleteTrainingSession: TrainingSession;
  createFixture: Fixture;
  updateFixture: Fixture;
  deleteFixture: Fixture;
  toggleTrainingSessionAttendance: TrainingSession;
  toggleFixtureAvailability: Fixture;
  toggleFixturePlaying: Fixture;
};


export type MutationUpdateUserArgs = {
  user: UserInput;
};


export type MutationCreateTeamArgs = {
  team: TeamInput;
};


export type MutationUpdateTeamArgs = {
  id: Scalars['ID'];
  team: TeamInput;
};


export type MutationDeleteTeamArgs = {
  id: Scalars['ID'];
};


export type MutationJoinTeamArgs = {
  team: Scalars['ID'];
};


export type MutationApproveTeamMemberArgs = {
  team: Scalars['ID'];
  user: Scalars['ID'];
};


export type MutationSetTeamCaptainArgs = {
  team: Scalars['ID'];
  user: Scalars['ID'];
};


export type MutationCreateTrainingSessionArgs = {
  trainingSession: TrainingSessionInput;
};


export type MutationUpdateTrainingSessionArgs = {
  id: Scalars['ID'];
  trainingSession: TrainingSessionInput;
};


export type MutationDeleteTrainingSessionArgs = {
  id: Scalars['ID'];
};


export type MutationCreateFixtureArgs = {
  fixture: FixtureInput;
};


export type MutationUpdateFixtureArgs = {
  id: Scalars['ID'];
  fixture: FixtureInput;
};


export type MutationDeleteFixtureArgs = {
  id: Scalars['ID'];
};


export type MutationToggleTrainingSessionAttendanceArgs = {
  id: Scalars['ID'];
};


export type MutationToggleFixtureAvailabilityArgs = {
  id: Scalars['ID'];
};


export type MutationToggleFixturePlayingArgs = {
  id: Scalars['ID'];
  user: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  user: User;
  teams: Array<Team>;
  team?: Maybe<Team>;
};


export type QueryTeamArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};

export type Session = {
  id: Scalars['ID'];
  team: Team;
  description?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  members: Array<TeamMember>;
  sessions: Array<Session>;
};

export type TeamInput = {
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  id: Scalars['ID'];
  team: Team;
  user: User;
  status: TeamMemberStatus;
};

export enum TeamMemberStatus {
  Applied = 'APPLIED',
  Member = 'MEMBER',
  Captain = 'CAPTAIN'
}

export type TrainingSession = Session & {
  __typename?: 'TrainingSession';
  id: Scalars['ID'];
  team: Team;
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
  attending: Array<User>;
  public: Scalars['Boolean'];
};

export type TrainingSessionInput = {
  teamId: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
  public: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  auth0Id: Scalars['String'];
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  pictureUrl?: Maybe<Scalars['String']>;
  teams: Array<Team>;
  sessions: Array<Session>;
  isAdmin: Scalars['Boolean'];
};

export type UserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
};
