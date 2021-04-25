import { Container, Heading, Text } from "@chakra-ui/layout";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getTeam } from "src/lib/queries/teams/teams.query.generated";
import { Team } from "src/lib/graphql/types";
import TeamElement from "src/components/TeamElement";
import { FullTeamFragment } from "src/lib/fragments/fragments.generated";
import { NormalizedCacheObject } from "@apollo/client";
import { ApolloCacheSSR } from "src/lib/apollo";
import Head from "next/head";

interface TeamPageSSRProps {
  team?: FullTeamFragment;
  error?: string;
}

export default function TeamPage({ team, error }: TeamPageSSRProps) {
  if (error) {
    return (
      <>
        <Head>
          <title>Error | Track &amp; Trace</title>
        </Head>
        <Container p={4}>
          <Heading>Error</Heading>
          <Heading fontSize='xl'>{error}</Heading>
        </Container>
      </>
    );
  }
  if (!team) {
    return (
      <>
        <Head>
          <title>Not found | Track &amp; Trace</title>
        </Head>
        <Container p={4}>
          <Heading>Team not found</Heading>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{team.name} | Track &amp; Trace</title>
      </Head>
      <Container p={4}>
        <TeamElement type='page' team={team} />
      </Container>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(
    context: GetServerSidePropsContext<{ slug: string }>
  ): Promise<GetServerSidePropsResult<ApolloCacheSSR<TeamPageSSRProps>>> {
    try {
      const { data, apolloClient } = await getTeam({
        variables: {
          slug: context.params.slug,
        },
        context: {
          headers: {
            cookie: context.req.headers.cookie,
          },
        },
      });

      return {
        props: {
          team: data.team,
          apolloState: apolloClient.cache.extract(),
        },
      };
    } catch (error) {
      return {
        props: {
          error: error.message,
        },
      };
    }
  },
});
