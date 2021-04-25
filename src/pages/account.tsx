import { Box, Container, Heading, Stack, Text } from "@chakra-ui/layout";
import EditUser from "../components/EditUser/EditUser";
import useUser from "../lib/useUser";
import NextLink from "next/link";
import { Button } from "@chakra-ui/button";
import Head from "next/head";
import { useColorModeValue } from "@chakra-ui/color-mode";

export default function Account() {
  const { user } = useUser();
  return (
    <>
      <Head>
        <title>Account | Track &amp; Trace</title>
      </Head>
      <Container>
        <Stack py={4}>
          <Box
            p={4}
            borderRadius='xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Heading fontSize='2xl'>Edit Profile</Heading>
            <Text>
              Use this section to modify your account profile information
            </Text>
            <EditUser user={user} />
          </Box>
          <Box
            p={4}
            borderRadius='xl'
            bg={useColorModeValue("white", "gray.700")}
          >
            <Heading fontSize='2xl'>Account Settings</Heading>
            <Text>Use this section to change your account settings</Text>
            <NextLink href='/api/auth/logout'>
              <Button mt={4} colorScheme='red'>
                Logout
              </Button>
            </NextLink>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
