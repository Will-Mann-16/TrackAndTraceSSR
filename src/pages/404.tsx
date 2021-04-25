import { Container, Heading, Text } from "@chakra-ui/layout";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 | Track &amp; Trace</title>
      </Head>
      <Container>
        <Heading>404: Not found</Heading>
        <Text>
          This page doesn't exist in our system. Use the navbar to head to a
          different page
        </Text>
      </Container>
    </>
  );
}
