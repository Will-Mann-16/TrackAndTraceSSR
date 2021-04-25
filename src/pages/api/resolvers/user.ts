import {
  Fixture,
  Team,
  TeamMemberStatus,
  User,
  TrainingSession,
} from "@prisma/client";
import { UpdateUserMutationVariables } from "src/components/EditUser/updateUser.mutation.generated";
import { Context } from "./context";
import { DateTime } from "luxon";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export default {
  Query: {
    async user(
      parent: unknown,
      args: unknown,
      { user }: Context
    ): Promise<User> {
      return user;
    },
  },
  Mutation: {
    async updateUser(
      parent: unknown,
      { user: { phoneNumber, ...user } }: UpdateUserMutationVariables,
      context: Context
    ): Promise<User> {
      return context.prisma.user.update({
        where: {
          id: context.user.id,
        },
        data: {
          ...user,
          phoneNumber: phoneUtil.format(
            phoneUtil.parse(phoneNumber, "GB"),
            PhoneNumberFormat.INTERNATIONAL
          ),
        },
      });
    },
  },
  User: {
    async teams(
      parent: User,
      args: unknown,
      { prisma }: Context
    ): Promise<Team[]> {
      return prisma.team.findMany({
        where: {
          members: {
            some: {
              user: {
                id: {
                  equals: parent.id,
                },
              },
              status: {
                not: TeamMemberStatus.APPLIED,
              },
            },
          },
        },
      });
    },
    async sessions(
      parent: User,
      args: unknown,
      { prisma }: Context
    ): Promise<(Fixture | TrainingSession)[]> {
      const fixtures = await prisma.fixture.findMany({
        where: {
          team: {
            members: {
              some: {
                user: {
                  id: {
                    equals: parent.id,
                  },
                },
                status: {
                  not: TeamMemberStatus.APPLIED,
                },
              },
            },
          },
          start: {
            gte: DateTime.local().startOf("day").toJSDate(),
          },
        },
      });
      const trainingSessions = await prisma.trainingSession.findMany({
        where: {
          team: {
            members: {
              some: {
                user: {
                  id: {
                    equals: parent.id,
                  },
                },
                status: {
                  not: TeamMemberStatus.APPLIED,
                },
              },
            },
          },
          start: {
            gte: DateTime.local().startOf("day").toJSDate(),
          },
        },
      });

      return [...fixtures, ...trainingSessions].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
    },
  },
};
