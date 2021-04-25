import {
  Button,
  Box,
  Stack,
  HStack,
  Text,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { useCachedFragment } from "src/lib/apollo";
import {
  UserFragment,
  UserFragmentDoc,
} from "src/lib/fragments/fragments.generated";

interface UserElementProps {
  type: "simple" | "full" | "contact-info";
  user: UserFragment;
  isExpandable?: boolean;
  accessory?: ReactNode;
}
export default function UserElement({
  type,
  user: defaultUser,
  isExpandable,
  accessory,
}: UserElementProps) {
  let [user, forceUpdate] = useCachedFragment<UserFragment>({
    defaultValue: defaultUser,
    fragment: UserFragmentDoc,
    fragmentName: "User",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const element = useMemo<ReactNode>(() => {
    switch (type) {
      case "simple":
        return <Text>{user.name}</Text>;
      case "full":
        return (
          <Stack my={4}>
            <Text fontWeight='600'>{user.name}</Text>
            <HStack>
              <Tag size='sm'>Email</Tag>
              <Link
                fontSize='sm'
                href={`mailto:${user.email}`}
                color='green.300'
              >
                {user.email}
              </Link>
            </HStack>
            <HStack>
              <Tag size='sm'>Phone Number</Tag>
              <Link
                fontSize='sm'
                href={`tel:${user.phoneNumber}`}
                color='green.300'
              >
                {user.phoneNumber}
              </Link>
            </HStack>
          </Stack>
        );
      case "contact-info":
        return (
          <Stack>
            <HStack>
              <Tag>Email</Tag>
              <Link href={`mailto:${user.email}`} color='green.300'>
                {user.email}
              </Link>
            </HStack>
            <HStack>
              <Tag>Phone Number</Tag>
              <Link href={`tel:${user.phoneNumber}`} color='green.300'>
                {user.phoneNumber}
              </Link>
            </HStack>
          </Stack>
        );
    }
  }, [type, user]);

  return (
    <>
      <Flex
        align='center'
        justify='space-between'
        onClick={isExpandable && onOpen}
        cursor={isExpandable && "pointer"}
        minH={8}
      >
        {element}
        {accessory}
      </Flex>
      {isExpandable && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <HStack>
                  <Tag>Email</Tag>
                  <Link href={`mailto:${user.email}`} color='green.300'>
                    {user.email}
                  </Link>
                </HStack>
                <HStack>
                  <Tag>Phone Number</Tag>
                  <Link href={`tel:${user.phoneNumber}`} color='green.300'>
                    {user.phoneNumber}
                  </Link>
                </HStack>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
