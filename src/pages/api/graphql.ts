import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ApolloServer, AuthenticationError } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "src/lib/prisma";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
    const session = getSession(req, res);

    if (!session || !session.user) {
      throw new AuthenticationError("Unauthorised");
    }

    return {
      user: session.user,
      prisma,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
