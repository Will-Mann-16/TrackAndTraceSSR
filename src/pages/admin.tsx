import { Container, Heading, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useUser from "src/lib/useUser";

export default function Admin() {
  const { user } = useUser();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user.isAdmin) {
      toast({ status: "error", title: "Unauthorised" });
      router.replace("/");
    }
  }, [user]);
  return (
    <>
      <Head>
        <title>Admin | Track &amp; Trace</title>
      </Head>
      <Container>
        <Heading>Admin</Heading>
        <Text>Any problems / feature requests, let Goliath know.</Text>
      </Container>
    </>
  );
}
