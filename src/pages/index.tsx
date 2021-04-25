import {
  Box,
  Container,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  Link,
} from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import NextLink from "next/link";
import useUser from "../lib/useUser";
import SessionElement from "../components/SessionElement";
import TeamElement from "../components/TeamElement";
import { useUserDisplayQuery } from "../lib/queries/userDisplay/userDisplay.query.generated";
import { Session, Team } from "src/lib/graphql/types";
import { useColorModeValue } from "@chakra-ui/color-mode";
import UserElement from "src/components/UserElement";
import Head from "next/head";
import { SessionWithTeamFragment } from "src/lib/fragments/fragments.generated";

export default function HomePage() {
  const { loading, error, data } = useUserDisplayQuery();
  const { user } = useUser();
  return (
    <>
      <Head>
        <title>Home | Track &amp; Trace</title>
      </Head>
      <Container maxW='4xl' py={4}>
        <Heading textAlign='center'>Welcome back, {user.name}</Heading>
        <SimpleGrid my={8} columns={{ base: 1, md: 2 }} spacing={4} minH='xl'>
          <Box
            p={4}
            rounded='lg'
            boxShadow='2xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Stack>
              <Heading fontSize='xl'>Upcoming Sessions</Heading>
              <Stack>
                {data?.user.sessions?.map((session) => (
                  <SessionElement
                    type='simple'
                    session={session as SessionWithTeamFragment}
                    key={session.id}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box
            p={4}
            rounded='lg'
            boxShadow='2xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Heading fontSize='xl'>Your Teams</Heading>
            {data?.user.teams.map((team) => (
              <TeamElement type='simple' team={team as Team} key={team.id} />
            ))}
          </Box>
          <Box
            p={4}
            rounded='lg'
            boxShadow='2xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Stack>
              <Heading fontSize='xl'>Contact Information</Heading>
              <UserElement type='contact-info' user={user} />
              <Text fontStyle='italic'>
                If this information is not correct, please update it in the{" "}
                <NextLink href='/account' passHref>
                  <Link color='green.300'>account</Link>
                </NextLink>{" "}
                page
              </Text>
            </Stack>
          </Box>
          <Box
            p={4}
            rounded='lg'
            boxShadow='2xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Stack spacing={4}>
              <Heading fontSize='xl'>Positive COVID-19 Test</Heading>
              <Text>
                If you have a positive test result returned from the NHS and you
                attended <b>any</b> sport session (training or fixture), you{" "}
                <b>must</b> inform your COVID officer.
              </Text>
              <Heading fontSize='md'>Your COVID Officers:</Heading>
              <List spacing={3}>
                <ListItem>
                  <HStack>
                    <Tag>Hockey (M)</Tag>
                    <Text>Henry Johnson</Text>
                    <Link href='mailto:ee18hj@leeds.ac.uk' color='green.300'>
                      ee18hj@leeds.ac.uk
                    </Link>
                  </HStack>
                </ListItem>
              </List>
            </Stack>
          </Box>
        </SimpleGrid>
      </Container>
    </>
  );
}
