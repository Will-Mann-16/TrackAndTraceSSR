import {
  getSession,
  handleAuth,
  handleCallback,
  handleProfile,
} from "@auth0/nextjs-auth0";
import { setUser } from "@sentry/nextjs";
import prisma from "../../../lib/prisma";

async function afterCallback(req, res, session, state) {
  if (
    (await prisma.user.count({
      where: {
        auth0Id: {
          equals: session.user.sub,
        },
      },
    })) === 0
  ) {
    await prisma.user.create({
      data: {
        auth0Id: session.user.sub,
        email: session.user.email,
        pictureUrl: session.user.picture,
      },
    });
  }
  return session;
}

async function afterRefetch(req, res, session) {
  const user = await prisma.user.findFirst({
    where: {
      auth0Id: session.user.sub,
    },
    include: {
      teams: true,
      fixtures: false,
      trainingSessions: false,
    },
  });

  setUser({ email: user.email, id: user.id });

  return {
    ...session,
    user,
  };
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  },
  async profile(req, res, session) {
    try {
      await handleProfile(req, res, { afterRefetch, refetch: true });
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  },
});
