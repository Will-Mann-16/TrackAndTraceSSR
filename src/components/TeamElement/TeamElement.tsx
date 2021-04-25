import { useApolloClient } from "@apollo/client";
import {
  Text,
  Box,
  useColorModeValue,
  Flex,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  SimpleGrid,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useCachedFragment } from "src/lib/apollo";
import {
  FullTeamFragment,
  FullTeamFragmentDoc,
  TeamFragment,
  TeamFragmentDoc,
  TeamMemberFragmentDoc,
  TeamMemberWithUserFragment,
  TeamMemberWithUserFragmentDoc,
  TeamWithMembersFragment,
  TeamWithMembersFragmentDoc,
} from "src/lib/fragments/fragments.generated";
import { Team, TeamMember, TeamMemberStatus } from "src/lib/graphql/types";
import useUser from "src/lib/useUser";
import EditFixture from "../EditFixture";
import EditTeam from "../EditTeam";
import { useDeleteTeamMutation } from "../EditTeam/editTeam.mutation.generated";
import EditTrainingSession from "../EditTrainingSession";
import SessionElement from "../SessionElement";
import UserElement from "../UserElement";
import {
  useApproveTeamMemberMutation,
  useJoinTeamMutation,
  useSetTeamCaptainMutation,
} from "./teamMembers.mutation.generated";

interface TeamElementProps {
  team: TeamFragment | TeamWithMembersFragment | FullTeamFragment;
  type: "simple" | "apply" | "page";
}
export default function TeamElement({
  team: defaultTeam,
  type,
}: TeamElementProps) {
  const router = useRouter();
  const { user } = useUser();
  switch (type) {
    case "simple":
      var [team, forceUpdate] = useCachedFragment<TeamWithMembersFragment>({
        defaultValue: defaultTeam as TeamWithMembersFragment,
        fragment: TeamWithMembersFragmentDoc,
        fragmentName: "TeamWithMembers",
      });

      return (
        <Box
          cursor='pointer'
          onClick={() => router.push(`/teams/${defaultTeam.slug}`)}
          p={2}
          transitionDuration='0.3s'
          rounded='xl'
          _hover={{
            bg: "gray.600",
          }}
        >
          <Text>{team.name}</Text>
        </Box>
      );
    case "apply":
      var [team, forceUpdate] = useCachedFragment<TeamWithMembersFragment>({
        defaultValue: defaultTeam as TeamWithMembersFragment,
        fragment: TeamWithMembersFragmentDoc,
        fragmentName: "TeamWithMembers",
      });

      const [joinTeam] = useJoinTeamMutation(() => ({
        update(cache, { data }) {
          cache.modify({
            id: cache.identify(team),
            fields: {
              members(existingMemberRefs = [], { readField }) {
                const newMemberRef = cache.writeFragment({
                  data: data.joinTeam,
                  fragment: TeamMemberWithUserFragmentDoc,
                  fragmentName: "TeamMemberWithUser",
                });

                if (
                  existingMemberRefs.some(
                    (ref) => readField("id", ref) === data.joinTeam.id
                  )
                ) {
                  return existingMemberRefs;
                }

                return [...existingMemberRefs, newMemberRef];
              },
            },
          });
        },
      }));

      const [deleteTeam] = useDeleteTeamMutation(() => ({
        variables: {
          id: team.id,
        },
      }));

      const cancelRef = useRef<HTMLButtonElement>();
      const { isOpen, onClose, onOpen } = useDisclosure();

      const { captains, status } = useMemo<{
        captains: TeamMemberWithUserFragment[];
        status?: TeamMemberStatus;
      }>(
        () => ({
          status: (team as TeamWithMembersFragment).members.find(
            (e) => e.user.id === user.id
          )?.status,
          captains: (team as TeamWithMembersFragment).members.filter(
            (e) => e.status === TeamMemberStatus.Captain
          ),
        }),
        [team]
      );

      const toast = useToast();

      return (
        <Stack>
          <Flex
            rounded='lg'
            boxShadow='2xl'
            _hover={
              !!status || user.isAdmin
                ? {
                    boxShadow: "3xl",
                    bg: useColorModeValue("whiteAlpha.100", "gray.600"),
                  }
                : {}
            }
            transitionDuration='0.3s'
            minH='150px'
            bg={useColorModeValue("white", "gray.700")}
            cursor='pointer'
            onClick={() =>
              (!!status || user.isAdmin) && router.push(`/teams/${team.slug}`)
            }
            d='flex'
            align='stretch'
            justify='center'
            flexDir='column'
            p={4}
          >
            <Text
              textAlign='center'
              flex={1}
              fontWeight='bold'
              as='h4'
              fontSize='xl'
            >
              {team.name}
            </Text>
            {captains.length > 0 && (
              <Stack flex={1}>
                {captains.map(({ user }) => (
                  <Text textAlign='center' key={user.id}>
                    {user.name}
                  </Text>
                ))}
              </Stack>
            )}
            <Button
              colorScheme='green'
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await joinTeam({
                    variables: {
                      team: team.id,
                    },
                  });
                  forceUpdate();
                } catch (e) {
                  toast({
                    status: "error",
                    title: "Error",
                    description: e.message,
                  });
                }
              }}
              disabled={!!status}
            >
              {status
                ? status === TeamMemberStatus.Applied
                  ? "Applied"
                  : "Member"
                : "Join"}
            </Button>
          </Flex>
          {user.isAdmin && (
            <>
              <Button colorScheme='red' onClick={onOpen}>
                Delete
              </Button>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                      Delete Training Session
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme='red'
                        onClick={async () => {
                          try {
                            await deleteTeam();
                            onClose();
                            toast({
                              title: "Training Session successfully deleted",
                              status: "success",
                            });
                            router.replace(router.basePath);
                          } catch (err) {
                            toast({
                              title: "Error",
                              description: err.message,
                              status: "error",
                            });
                          }
                        }}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </Stack>
      );
    case "page":
      return <TeamPage team={defaultTeam as FullTeamFragment} />;
  }
}

interface TeamPageProps {
  team: FullTeamFragment;
}

function TeamPage({ team: defaultTeam }: TeamPageProps) {
  let [team, forceUpdate] = useCachedFragment<FullTeamFragment>({
    defaultValue: defaultTeam,
    fragment: FullTeamFragmentDoc,
    fragmentName: "FullTeam",
  });

  const { user } = useUser();

  const isCaptain = useMemo<boolean>(
    () =>
      user.isAdmin ||
      team.members.some(
        (e) => e.user.id === user.id && e.status === TeamMemberStatus.Captain
      ),
    [user, team]
  );
  const editDisclosure = useDisclosure();
  const sessionDisclosure = useDisclosure();

  const [approveTeamMember] = useApproveTeamMemberMutation(() => ({
    update(cache, { data }) {
      if (data.approveTeamMember) {
        cache.writeFragment({
          data: data.approveTeamMember,
          fragment: TeamMemberFragmentDoc,
          fragmentName: "TeamMember",
        });
      }
    },
  }));

  const [setTeamCaptain] = useSetTeamCaptainMutation(() => ({
    update(cache, { data }) {
      if (data.setTeamCaptain) {
        cache.writeFragment({
          data: data.setTeamCaptain,
          fragment: TeamMemberFragmentDoc,
          fragmentName: "TeamMember",
        });
      }
    },
  }));

  const toast = useToast();

  return (
    <>
      <Flex justify='space-between'>
        <Heading>{team.name}</Heading>
        {isCaptain && (
          <>
            <Button
              leftIcon={<FaEdit />}
              colorScheme='green'
              onClick={editDisclosure.onOpen}
            >
              Edit
            </Button>
            <Modal
              isOpen={editDisclosure.isOpen}
              onClose={editDisclosure.onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Team</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <EditTeam
                    team={team}
                    onFinish={() => {
                      editDisclosure.onClose();
                      forceUpdate();
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Flex>
      <Text>{team.bio}</Text>
      <SimpleGrid my={4} columns={{ base: 1, md: 2 }} spacing={4} minH='md'>
        <Box
          p={4}
          rounded='lg'
          boxShadow='2xl'
          bg={useColorModeValue("white", "gray.700")}
        >
          <Heading fontSize='xl'>Captains</Heading>
          <Stack>
            {team.members
              .filter((e) => e.status === TeamMemberStatus.Captain)
              .map(({ user: u, status }) => (
                <UserElement type='full' user={u} key={u.id} />
              ))}
          </Stack>
        </Box>
        <Box
          p={4}
          rounded='lg'
          boxShadow='2xl'
          bg={useColorModeValue("white", "gray.700")}
        >
          <Heading fontSize='xl'>Members</Heading>
          <Stack>
            {team.members
              .filter(
                (e) =>
                  e.status !== TeamMemberStatus.Applied ||
                  team.members.some(
                    (f) =>
                      f.user.id === user.id &&
                      f.status === TeamMemberStatus.Captain
                  ) ||
                  user.isAdmin
              )
              .map(({ user: u, status }) => (
                <UserElement
                  type='simple'
                  user={u}
                  key={u.id}
                  isExpandable
                  accessory={
                    status === TeamMemberStatus.Applied && isCaptain ? (
                      <Button
                        size='sm'
                        colorScheme='green'
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await approveTeamMember({
                              variables: {
                                team: team.id,
                                user: u.id,
                              },
                            });
                            forceUpdate();
                          } catch (e) {
                            toast({
                              status: "error",
                              title: "Error",
                              description: e.message,
                            });
                          }
                        }}
                      >
                        Approve
                      </Button>
                    ) : (
                      user.isAdmin && (
                        <Button
                          disabled={status === TeamMemberStatus.Captain}
                          size='sm'
                          colorScheme='blue'
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await setTeamCaptain({
                                variables: {
                                  team: team.id,
                                  user: u.id,
                                },
                              });
                              forceUpdate();
                            } catch (e) {
                              toast({
                                status: "error",
                                title: "Error",
                                description: e.message,
                              });
                            }
                          }}
                        >
                          Captain
                        </Button>
                      )
                    )
                  }
                />
              ))}
          </Stack>
        </Box>
      </SimpleGrid>
      <Box
        p={4}
        rounded='lg'
        boxShadow='2xl'
        bg={useColorModeValue("white", "gray.700")}
        w='100%'
      >
        <Flex align='center' justify='space-between'>
          <Heading fontSize='xl'>Sessions</Heading>
          {isCaptain && (
            <>
              <Button
                onClick={sessionDisclosure.onOpen}
                colorScheme='blue'
                leftIcon={<FaPlus />}
              >
                New
              </Button>
              <Modal
                size='lg'
                isOpen={sessionDisclosure.isOpen}
                onClose={sessionDisclosure.onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create new session</ModalHeader>
                  <ModalBody>
                    <Tabs isFitted>
                      <TabList>
                        <Tab>Training Session</Tab>
                        <Tab>Fixture</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <EditTrainingSession
                            team={team}
                            onFinish={() => {
                              forceUpdate();
                              sessionDisclosure.onClose();
                            }}
                          />
                        </TabPanel>
                        <TabPanel>
                          <EditFixture
                            team={team}
                            onFinish={() => {
                              forceUpdate();
                              sessionDisclosure.onClose();
                            }}
                          />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
        </Flex>
        <Stack my={2}>
          {team.sessions.map((session) => (
            <SessionElement
              session={session}
              type='full'
              key={session.id}
              forceUpdate={forceUpdate}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
}
