import {
  Fixture,
  Team,
  TeamMember,
  TeamMemberStatus,
  TrainingSession,
} from "@prisma/client";
import { Context } from "./context";
import { DateTime } from "luxon";
import { ForbiddenError, UserInputError } from "apollo-server-errors";
import slugify from "src/lib/slug";
import { TeamQueryVariables } from "src/lib/queries/teams/teams.query.generated";
import {
  CreateTeamMutationVariables,
  DeleteTeamMutationVariables,
  UpdateTeamMutationVariables,
} from "src/components/EditTeam/editTeam.mutation.generated";

export default {
  Query: {
    async teams(parent: unknown, args: undefined, { prisma }: Context) {
      return await prisma.team.findMany();
    },
    async team(
      parent: unknown,
      { id, slug }: TeamQueryVariables,
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.team.count({
          where: {
            OR: [
              {
                id: {
                  equals: id,
                },
              },
              {
                slug: {
                  equals: slug,
                },
              },
            ],
            members: {
              some: {
                status: {
                  not: TeamMemberStatus.APPLIED,
                },
                user: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        })) === 0
      )
        throw new ForbiddenError("Unauthorised");
      return await prisma.team.findFirst({
        where: {
          OR: [
            {
              id: {
                equals: id,
              },
            },
            {
              slug: {
                equals: slug,
              },
            },
          ],
        },
      });
    },
  },
  Mutation: {
    async createTeam(
      parent: unknown,
      { team }: CreateTeamMutationVariables,
      { prisma, user }: Context
    ) {
      if (!user.isAdmin) throw new ForbiddenError("Unauthorised");
      return await prisma.team.create({
        data: {
          name: team.name,
          slug: slugify(team.name),
          bio: team.bio,
        },
      });
    },
    async updateTeam(
      parent: unknown,
      { id, team }: UpdateTeamMutationVariables,
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.teamMember.count({
          where: {
            user: {
              id: {
                equals: user.id,
              },
            },
            team: {
              id: {
                equals: id,
              },
            },
            status: TeamMemberStatus.CAPTAIN,
          },
        })) === 0
      )
        throw new ForbiddenError("Unauthorised");
      return await prisma.team.update({
        where: {
          id,
        },
        data: {
          name: team.name,
          slug: slugify(team.name),
          bio: team.bio,
        },
      });
    },
    async deleteTeam(
      parent: unknown,
      { id }: DeleteTeamMutationVariables,
      { prisma, user }: Context
    ) {
      if (!user.isAdmin) throw new ForbiddenError("Unauthorised");
      return await prisma.team.delete({
        where: {
          id,
        },
      });
    },
    async joinTeam(parent: unknown, { team }, { prisma, user }: Context) {
      if (
        (await prisma.teamMember.count({
          where: {
            team: {
              id: {
                equals: team,
              },
            },
            user: {
              id: {
                equals: user.id,
              },
            },
          },
        })) > 0
      )
        throw new UserInputError("Already a member of this team");
      return await prisma.teamMember.create({
        data: {
          status: user.isAdmin
            ? TeamMemberStatus.MEMBER
            : TeamMemberStatus.APPLIED,
          team: {
            connect: {
              id: team,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    },
    async approveTeamMember(
      parent: unknown,
      { team, user: userId },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.teamMember.count({
          where: {
            user: {
              id: {
                equals: user.id,
              },
            },
            team: {
              id: {
                equals: team,
              },
            },
            status: TeamMemberStatus.CAPTAIN,
          },
        })) === 0
      )
        throw new ForbiddenError("Unauthorised");
      if (
        (await prisma.teamMember.count({
          where: {
            team: {
              id: {
                equals: team,
              },
            },
            user: {
              id: {
                equals: userId,
              },
            },
            status: {
              not: TeamMemberStatus.APPLIED,
            },
          },
        })) > 0
      )
        throw new UserInputError("Team member already in team/hasn't applied");
      await prisma.teamMember.updateMany({
        where: {
          team: {
            id: {
              equals: team,
            },
          },
          user: {
            id: {
              equals: userId,
            },
          },
        },
        data: {
          status: TeamMemberStatus.MEMBER,
        },
      });
      return await prisma.teamMember.findFirst({
        where: {
          team: {
            id: {
              equals: team,
            },
          },
          user: {
            id: {
              equals: userId,
            },
          },
        },
      });
    },
    async setTeamCaptain(
      parent: unknown,
      { team, user: userId },
      { prisma, user }: Context
    ) {
      if (!user.isAdmin) throw new ForbiddenError("Unauthorised");
      if (
        (await prisma.teamMember.count({
          where: {
            team: {
              id: {
                equals: team,
              },
            },
            user: {
              id: {
                equals: userId,
              },
            },
            status: {
              equals: TeamMemberStatus.CAPTAIN,
            },
          },
        })) > 0
      )
        throw new UserInputError("Team member already captain / not in team");
      await prisma.teamMember.updateMany({
        where: {
          team: {
            id: {
              equals: team,
            },
          },
          user: {
            id: {
              equals: userId,
            },
          },
        },
        data: {
          status: TeamMemberStatus.CAPTAIN,
        },
      });
      return await prisma.teamMember.findFirst({
        where: {
          team: {
            id: {
              equals: team,
            },
          },
          user: {
            id: {
              equals: userId,
            },
          },
        },
      });
    },
  },
  Team: {
    async members(parent: Team, args: undefined, { prisma, user }: Context) {
      if (
        !user.isAdmin &&
        (await prisma.teamMember.count({
          where: {
            team: {
              id: {
                equals: parent.id,
              },
            },
            user: {
              id: {
                equals: user.id,
              },
            },
            status: {
              not: TeamMemberStatus.APPLIED,
            },
          },
        })) === 0
      ) {
        return await prisma.teamMember.findMany({
          where: {
            team: {
              id: {
                equals: parent.id,
              },
            },
            OR: [
              {
                user: {
                  id: {
                    equals: user.id,
                  },
                },
              },
              {
                status: TeamMemberStatus.CAPTAIN,
              },
            ],
          },
        });
      } else {
        return await prisma.teamMember.findMany({
          where: {
            team: {
              id: {
                equals: parent.id,
              },
            },
          },
        });
      }
    },
    async sessions(
      parent: Team,
      args: unknown,
      { prisma }: Context
    ): Promise<(Fixture | TrainingSession)[]> {
      const fixtures = await prisma.fixture.findMany({
        where: {
          team: {
            id: {
              equals: parent.id,
            },
          },
        },
      });
      const trainingSessions = await prisma.trainingSession.findMany({
        where: {
          team: {
            id: {
              equals: parent.id,
            },
          },
        },
      });

      return [...fixtures, ...trainingSessions].sort((a, b) => {
        const aTime = new Date(a.start).getTime();
        const bTime = new Date(b.start).getTime();
        if (new Date(a.start) < new Date() && new Date(b.start) < new Date()) {
          return bTime - aTime;
        } else {
          return aTime - bTime;
        }
      });
    },
  },
  TeamMember: {
    async user(parent: TeamMember, args: unknown, { prisma }: Context) {
      return await prisma.user.findFirst({
        where: {
          id: {
            equals: parent.userId,
          },
        },
      });
    },
    async team(parent: TeamMember, args: unknown, { prisma }: Context) {
      return await prisma.team.findFirst({
        where: {
          id: {
            equals: parent.teamId,
          },
        },
      });
    },
  },
};
