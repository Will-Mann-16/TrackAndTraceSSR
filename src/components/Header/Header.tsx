import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import NextLink from "next/link";
import useUser from "../../lib/useUser";
import { HamburgerIcon } from "@chakra-ui/icons";
export default function Header() {
  const { user } = useUser();
  const [show, setShow] = useState<boolean>(false);

  const links = useMemo(() => {
    return (
      <>
        <NextLink href='/' passHref>
          <Link>Home</Link>
        </NextLink>
        <NextLink href='/teams' passHref>
          <Link>Teams</Link>
        </NextLink>
        <NextLink href='/account' passHref>
          <Link>Account</Link>
        </NextLink>
        {user?.isAdmin && (
          <NextLink href='/admin' passHref>
            <Link>Admin</Link>
          </NextLink>
        )}
      </>
    );
  }, [user]);

  return (
    <Flex
      flexDir='column'
      alignItems='stretch'
      justifyContent='flex-start'
      bg='primary'
      color='white'
    >
      <Flex justify='space-between' align='center' p={4}>
        <Heading fontSize='xl'>LUU Sport Track &amp; Trace</Heading>
        {user && (
          <>
            <IconButton
              aria-label='menu'
              display={{ base: "block", md: "none" }}
              icon={<HamburgerIcon />}
              fontSize='xl'
              variant='ghost'
              onClick={() => setShow((show) => !show)}
            />
            <HStack display={{ base: "none", md: "block" }}>{links}</HStack>
          </>
        )}
      </Flex>
      {user && (
        <VStack
          alignItems='flex-start'
          p={4}
          display={{ base: show ? "flex" : "none", md: "none" }}
        >
          {links}
        </VStack>
      )}
    </Flex>
  );
}
