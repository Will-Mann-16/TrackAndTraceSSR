import {
  Fixture,
  FixturePlayer,
  TeamMemberStatus,
  TrainingSession,
} from "@prisma/client";
import { ForbiddenError } from "apollo-server-errors";
import {
  ToggleFixtureAvailabilityMutationVariables,
  ToggleFixturePlayingMutationVariables,
  ToggleTrainingSessionAttendanceMutationVariables,
} from "src/components/SessionElement/sessionAttendance.mutation.generated";
import { Context } from "./context";
import user from "./user";

export default {
  Mutation: {
    async createTrainingSession(
      parent: unknown,
      { trainingSession },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.trainingSession.count({
          where: {
            team: {
              id: {
                equals: trainingSession.teamId,
              },
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.trainingSession.create({
        data: {
          title: trainingSession.title,
          start: trainingSession.start,
          end: trainingSession.end,
          description: trainingSession.description,
          public: trainingSession.public,
          team: {
            connect: {
              id: trainingSession.teamId,
            },
          },
        },
      });
    },
    async updateTrainingSession(
      parent: unknown,
      { id, trainingSession },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.trainingSession.count({
          where: {
            id: {
              equals: id,
            },
            team: {
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.trainingSession.update({
        where: {
          id,
        },
        data: {
          title: trainingSession.title,
          start: trainingSession.start,
          end: trainingSession.end,
          description: trainingSession.description,
          public: trainingSession.public,
          team: {
            connect: {
              id: trainingSession.teamId,
            },
          },
        },
      });
    },
    async deleteTrainingSession(
      parent: unknown,
      { id },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.trainingSession.count({
          where: {
            id: {
              equals: id,
            },
            team: {
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.trainingSession.delete({
        where: {
          id,
        },
      });
    },
    async createFixture(
      parent: unknown,
      { fixture },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.fixture.count({
          where: {
            team: {
              id: {
                equals: fixture.teamId,
              },
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.fixture.create({
        data: {
          start: fixture.start,
          opponent: fixture.opponent,
          description: fixture.description,
          location: fixture.location,
          team: {
            connect: {
              id: fixture.teamId,
            },
          },
        },
      });
    },
    async updateFixture(
      parent: unknown,
      { id, fixture },
      { prisma, user }: Context
    ) {
      if (
        !user.isAdmin &&
        (await prisma.fixture.count({
          where: {
            id: {
              equals: id,
            },
            team: {
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.fixture.update({
        where: {
          id,
        },
        data: {
          start: fixture.start,
          opponent: fixture.opponent,
          description: fixture.description,
          location: fixture.location,
          team: {
            connect: {
              id: fixture.teamId,
            },
          },
        },
      });
    },
    async deleteFixture(parent: unknown, { id }, { prisma, user }: Context) {
      if (
        !user.isAdmin &&
        (await prisma.fixture.count({
          where: {
            id: {
              equals: id,
            },
            team: {
              members: {
                some: {
                  status: TeamMemberStatus.CAPTAIN,
                  user: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.fixture.delete({
        where: {
          id,
        },
      });
    },
    async toggleTrainingSessionAttendance(
      parent: unknown,
      { id }: ToggleTrainingSessionAttendanceMutationVariables,
      { prisma, user }: Context
    ) {
      if (
        (await prisma.trainingSession.count({
          where: {
            id: {
              equals: id,
            },
            public: {
              equals: true,
            },
            team: {
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
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      return await prisma.trainingSession.update({
        where: {
          id,
        },
        data: {
          attending:
            (await prisma.trainingSession.count({
              where: {
                id: {
                  equals: id,
                },
                attending: {
                  some: {
                    id: user.id,
                  },
                },
              },
            })) > 0
              ? {
                  disconnect: {
                    id: user.id,
                  },
                }
              : {
                  connect: {
                    id: user.id,
                  },
                },
        },
      });
    },
    async toggleFixtureAvailability(
      parent: unknown,
      { id }: ToggleFixtureAvailabilityMutationVariables,
      { prisma, user }: Context
    ) {
      if (
        (await prisma.fixture.count({
          where: {
            id: {
              equals: id,
            },
            team: {
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
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      await prisma.fixture.update({
        where: {
          id,
        },
        data: {
          players:
            (await prisma.fixture.count({
              where: {
                id: {
                  equals: id,
                },
                players: {
                  some: {
                    user: {
                      id: {
                        equals: user.id,
                      },
                    },
                  },
                },
              },
            })) > 0
              ? {
                  deleteMany: {
                    userId: {
                      equals: user.id,
                    },
                    fixtureId: {
                      equals: id,
                    },
                  },
                }
              : {
                  create: {
                    user: {
                      connect: {
                        id: user.id,
                      },
                    },
                    isPlaying: false,
                  },
                },
        },
      });
      return await prisma.fixture.findFirst({
        where: {
          id: {
            equals: id,
          },
        },
      });
    },
    async toggleFixturePlaying(
      parent: unknown,
      { id, user }: ToggleFixturePlayingMutationVariables,
      { prisma, user: u }: Context
    ) {
      if (
        (await prisma.fixture.count({
          where: {
            id: {
              equals: id,
            },
            team: {
              members: {
                some: {
                  status: {
                    equals: TeamMemberStatus.CAPTAIN,
                  },
                  user: {
                    id: {
                      equals: u.id,
                    },
                  },
                },
              },
            },
          },
        })) === 0
      ) {
        throw new ForbiddenError("Unauthorized");
      }

      await prisma.fixture.update({
        where: {
          id,
        },
        data: {
          players:
            (await prisma.fixture.count({
              where: {
                id: {
                  equals: id,
                },
                players: {
                  some: {
                    user: {
                      id: {
                        equals: user,
                      },
                    },
                    isPlaying: {
                      equals: true,
                    },
                  },
                },
              },
            })) > 0
              ? {
                  updateMany: {
                    where: {
                      userId: {
                        equals: user,
                      },
                      fixtureId: {
                        equals: id,
                      },
                    },
                    data: {
                      isPlaying: false,
                    },
                  },
                }
              : {
                  updateMany: {
                    where: {
                      userId: {
                        equals: user,
                      },
                      fixtureId: {
                        equals: id,
                      },
                    },
                    data: {
                      isPlaying: true,
                    },
                  },
                },
        },
      });

      return await prisma.fixture.findFirst({
        where: {
          id: {
            equals: id,
          },
        },
      });
    },
  },
  Session: {
    __resolveType(obj: any, args: undefined, ctx: Context) {
      if (obj.end) {
        return "TrainingSession";
      }
      if (obj.opponent) {
        return "Fixture";
      }
      return null;
    },
  },
  TrainingSession: {
    async attending(
      parent: TrainingSession,
      args: undefined,
      { prisma }: Context
    ) {
      return await prisma.user.findMany({
        where: {
          trainingSessions: {
            some: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    async team(obj: TrainingSession, args: undefined, { prisma }: Context) {
      return await prisma.team.findFirst({
        where: {
          id: {
            equals: obj.teamId,
          },
        },
      });
    },
  },
  Fixture: {
    async players(parent: Fixture, args: undefined, { prisma }: Context) {
      return await prisma.fixturePlayer.findMany({
        where: {
          fixture: {
            id: parent.id,
          },
        },
      });
    },
    async team(obj: Fixture, args: undefined, { prisma }: Context) {
      return await prisma.team.findFirst({
        where: {
          id: {
            equals: obj.teamId,
          },
        },
      });
    },
  },
  FixturePlayer: {
    async user(parent: FixturePlayer, args: undefined, { prisma }: Context) {
      return await prisma.user.findFirst({
        where: {
          id: {
            equals: parent.userId,
          },
        },
      });
    },
  },
};
