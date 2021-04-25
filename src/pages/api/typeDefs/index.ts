import { gql } from "apollo-server-micro";

export default gql`
  scalar DateTime

  type Fixture implements Session {
    id: ID!
    team: Team!
    opponent: String!
    location: String
    description: String
    start: DateTime!
    players: [FixturePlayer!]!
  }

  type FixturePlayer {
    id: ID!
    fixture: Fixture!
    user: User!
    isPlaying: Boolean!
  }

  type TrainingSession implements Session {
    id: ID!
    team: Team!
    title: String!
    description: String
    start: DateTime!
    end: DateTime!
    attending: [User!]!
    public: Boolean!
  }

  interface Session {
    id: ID!
    team: Team!
    description: String
    start: DateTime!
  }

  type Team {
    id: String!
    name: String!
    slug: String!
    bio: String
    members: [TeamMember!]!
    sessions: [Session!]!
  }

  enum TeamMemberStatus {
    APPLIED
    MEMBER
    CAPTAIN
  }

  type TeamMember {
    id: ID!
    team: Team!
    user: User!
    status: TeamMemberStatus!
  }

  type User {
    id: String!
    auth0Id: String!
    email: String!
    name: String
    phoneNumber: String
    pictureUrl: String
    teams: [Team!]!
    sessions: [Session!]!
    isAdmin: Boolean!
  }

  input UserInput {
    name: String!
    email: String!
    phoneNumber: String!
  }

  input TeamInput {
    name: String!
    bio: String
  }

  input TrainingSessionInput {
    teamId: ID!
    title: String!
    description: String
    start: DateTime!
    end: DateTime!
    public: Boolean!
  }

  input FixtureInput {
    teamId: ID!
    opponent: String!
    location: String
    description: String
    start: DateTime!
  }

  type Query {
    user: User!
    teams: [Team!]!
    team(id: ID, slug: String): Team
  }

  type Mutation {
    updateUser(user: UserInput!): User!

    createTeam(team: TeamInput!): Team!
    updateTeam(id: ID!, team: TeamInput!): Team!
    deleteTeam(id: ID!): Team!

    joinTeam(team: ID!): TeamMember!
    approveTeamMember(team: ID!, user: ID!): TeamMember!
    setTeamCaptain(team: ID!, user: ID!): TeamMember!

    createTrainingSession(
      trainingSession: TrainingSessionInput!
    ): TrainingSession!
    updateTrainingSession(
      id: ID!
      trainingSession: TrainingSessionInput!
    ): TrainingSession!
    deleteTrainingSession(id: ID!): TrainingSession!

    createFixture(fixture: FixtureInput!): Fixture!
    updateFixture(id: ID!, fixture: FixtureInput!): Fixture!
    deleteFixture(id: ID!): Fixture!

    toggleTrainingSessionAttendance(id: ID!): TrainingSession!
    toggleFixtureAvailability(id: ID!): Fixture!
    toggleFixturePlaying(id: ID!, user: ID!): Fixture!
  }
`;
