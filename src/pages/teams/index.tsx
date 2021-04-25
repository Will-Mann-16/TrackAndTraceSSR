import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "../../lib/axios";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import useSWR from "swr";
import EditTeam from "../../components/EditTeam/EditTeam";
import TeamElement from "../../components/TeamElement/TeamElement";
import useUser from "../../lib/useUser";
import { getTeams } from "src/lib/queries/teams/teams.query.generated";
import { Team } from "src/lib/graphql/types";
import { FaPlus } from "react-icons/fa";
import { NormalizedCacheObject } from "@apollo/client";
import { ApolloCacheSSR } from "src/lib/apollo";
import Head from "next/head";
import { useRouter } from "next/router";

interface TeamsPageSSRProps {
  teams?: Team[];
  error?: string;
}

export default function TeamsPage({ teams, error }: TeamsPageSSRProps) {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  if (error) {
    return (
      <>
        <Head>
          <title>Teams | Track &amp; Trace</title>
        </Head>
        <Container>
          <Heading>Error</Heading>
          <Heading fontSize='xl'>{error}</Heading>
        </Container>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Teams | Track &amp; Trace</title>
      </Head>
      <Container maxW='2xl' py={4}>
        {user.isAdmin && (
          <Flex justify='flex-end'>
            <Button onClick={onOpen} leftIcon={<FaPlus />} colorScheme='green'>
              Add
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New Team</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <EditTeam
                    onFinish={() => {
                      onClose();
                      router.replace(router.basePath);
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        )}
        <SimpleGrid columns={{ lg: 4, md: 3, sm: 2, base: 1 }} spacing={4}>
          {teams?.map((team) => (
            <TeamElement type='apply' team={team} key={team.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<ApolloCacheSSR<TeamsPageSSRProps>>> {
    try {
      const { data, apolloClient } = await getTeams({
        context: {
          headers: {
            cookie: context.req.headers.cookie,
          },
        },
      });
      return {
        props: {
          teams: data.teams as Team[],
          apolloState: apolloClient.cache.extract(),
        },
      };
    } catch (e) {
      return {
        props: {
          error: e.message,
        },
      };
    }
  },
});
