import {
  Box,
  Flex,
  Stack,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
  Button,
  ModalFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import {
  SessionWithTeamFragmentDoc,
  SessionWithTeam_Fixture_Fragment,
  TeamWithMembersFragment,
  TeamWithMembersFragmentDoc,
  FixtureFragmentDoc,
  FixturePlayerFragmentDoc,
  FixturePlayerWithUserFragmentDoc,
  FixturePlayerWithUserFragment,
  UserFragment,
} from "src/lib/fragments/fragments.generated";
import { truncate } from "lodash";
import { useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import UserElement from "../UserElement";
import useUser from "src/lib/useUser";
import {
  useToggleFixtureAvailabilityMutation,
  useToggleFixturePlayingMutation,
} from "./sessionAttendance.mutation.generated";
import { useCachedFragment } from "src/lib/apollo";
import EditFixture from "../EditFixture";
import { useApolloClient } from "@apollo/client";
import { TeamMemberStatus } from "src/lib/graphql/types";
import { useDeleteFixtureMutation } from "../EditFixture/editFixture.mutation.generated";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import { generateFixtureSpreadsheet, s2ab } from "src/lib/generateSpreadsheet";
import Table from "../Table";
import { Cell, Column } from "react-table";
import useMeasure from "react-use-measure";

interface FixtureElementProps {
  session: SessionWithTeam_Fixture_Fragment;
  type?: "simple" | "full";
  forceTeamUpdate?: () => void;
}
export function FixtureElement({
  session: defaultSession,
  type,
  forceTeamUpdate,
}: FixtureElementProps) {
  let [
    session,
    forceUpdate,
  ] = useCachedFragment<SessionWithTeam_Fixture_Fragment>({
    defaultValue: defaultSession as SessionWithTeam_Fixture_Fragment,
    fragment: SessionWithTeamFragmentDoc,
    fragmentName: "SessionWithTeam",
  });

  const router = useRouter();
  const description = useMemo(() => truncate(session.description), [session]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();

  const toast = useToast();

  const [toggleFixtureAvailability] = useToggleFixtureAvailabilityMutation(
    () => ({
      variables: {
        id: session.id,
      },
      update(cache, { data }) {
        if (data.toggleFixtureAvailability) {
          cache.writeFragment({
            data: data.toggleFixtureAvailability,
            fragment: FixtureFragmentDoc,
            fragmentName: "Fixture",
          });
        }
      },
    })
  );

  const fixtureComponent = useMemo(() => {
    switch (type) {
      case "simple":
        return (
          <Flex
            opacity={
              DateTime.fromISO(session.start) >= DateTime.local().startOf("day")
                ? 1
                : 0.8
            }
            alignItems='center'
            rounded='xl'
            cursor='pointer'
            _hover={{
              bg: useColorModeValue("gray.200", "gray.600"),
            }}
            py={1}
            px={2}
            onClick={onOpen}
            justify='space-between'
            transitionDuration='0.2s'
          >
            <Flex
              flexGrow={1}
              justify={{ base: "flex-start", md: "space-between" }}
              flexDir={{ base: "column", md: "row" }}
              mr={2}
            >
              <Box>
                <Text fontSize='sm'>
                  {session.team.name} vs {session.opponent}
                </Text>
              </Box>
              <Box textAlign={{ base: "left", md: "right" }}>
                <Text fontSize='sm'>
                  {DateTime.fromISO(session.start).toFormat("ccc dd/LL HH:mm")}
                </Text>
                <Text fontSize='sm' color='gray'>
                  {session.location}
                </Text>
              </Box>
            </Flex>
            <Button
              flexShrink={0}
              flexGrow={0}
              size='sm'
              disabled={session.players.some(
                (e) => e.user.id === user.id && e.isPlaying
              )}
              colorScheme={
                session.players.some(
                  (e) => e.user.id === user.id && e.isPlaying
                )
                  ? "green"
                  : session.players.some((e) => e.user.id === user.id)
                  ? "blue"
                  : undefined
              }
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await toggleFixtureAvailability();
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
              {session.players.some((e) => e.user.id === user.id && e.isPlaying)
                ? "Playing"
                : "Can Play"}
            </Button>
          </Flex>
        );
      case "full":
        return (
          <Flex
            opacity={
              DateTime.fromISO(session.start) >= DateTime.local().startOf("day")
                ? 1
                : 0.8
            }
            alignItems='center'
            rounded='xl'
            cursor='pointer'
            _hover={{
              bg: useColorModeValue("gray.200", "gray.600"),
            }}
            py={2}
            px={3}
            onClick={onOpen}
            justify='space-between'
            transitionDuration='0.2s'
          >
            <Flex
              flexGrow={1}
              justify='space-between'
              flexDir={{ base: "column", md: "row" }}
              mr={2}
            >
              <Box>
                <Text>
                  {session.team.name} vs {session.opponent}
                </Text>{" "}
                <Text color='gray'>{description}</Text>
              </Box>
              <Box textAlign={{ base: "left", md: "right" }}>
                <Text>
                  {DateTime.fromISO(session.start).toFormat("ccc LLL d, HH:mm")}
                </Text>
                <Text color='gray.400'>{session.location}</Text>
              </Box>
            </Flex>
            <Button
              flexShrink={0}
              flexGrow={0}
              disabled={session.players.some(
                (e) => e.user.id === user.id && e.isPlaying
              )}
              colorScheme={
                session.players.some(
                  (e) => e.user.id === user.id && e.isPlaying
                )
                  ? "green"
                  : session.players.some((e) => e.user.id === user.id)
                  ? "blue"
                  : undefined
              }
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await toggleFixtureAvailability();
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
              {session.players.some((e) => e.user.id === user.id && e.isPlaying)
                ? "Playing"
                : "Can Play"}
            </Button>
          </Flex>
        );
    }
  }, [session, type]);

  return (
    <>
      {fixtureComponent}
      <FixtureModal
        session={session}
        forceUpdate={forceUpdate}
        forceTeamUpdate={forceTeamUpdate}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
interface FixtureModalProps {
  session: SessionWithTeam_Fixture_Fragment;
  forceUpdate: () => void;
  forceTeamUpdate?: () => void;
  isOpen: boolean;
  onClose: () => void;
}
function FixtureModal({
  session,
  forceUpdate,
  forceTeamUpdate,
  isOpen,
  onClose,
}: FixtureModalProps) {
  const deleteDisclosure = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>();
  const [edit, setEdit] = useState<boolean>(false);
  const { user } = useUser();
  const toast = useToast();

  const client = useApolloClient();
  const team = useMemo(
    () =>
      client.cache.readFragment<TeamWithMembersFragment>({
        fragment: TeamWithMembersFragmentDoc,
        fragmentName: "TeamWithMembers",
        id: client.cache.identify(session.team),
      }) || (session.team as TeamWithMembersFragment),
    [session]
  );

  const [deleteFixture] = useDeleteFixtureMutation(() => ({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(team),
        fields: {
          sessions(existingSessionRefs = [], { readField }) {
            return existingSessionRefs.filter(
              (ref) => readField("id", ref) !== data.deleteFixture.id
            );
          },
        },
      });
    },
  }));

  const canEdit = useMemo<boolean>(
    () =>
      user.isAdmin ||
      team?.members?.some(
        (e) => e.user.id === user.id && e.status === TeamMemberStatus.Captain
      ),
    [user, team]
  );

  const [playerRef, playerBounds] = useMeasure();
  const playerColumns = useMemo(() => {
    const columns: Column<FixturePlayerWithUserFragment>[] = [
      {
        Header: "Name",
        accessor: "user.name" as "user",
        width: playerBounds.width,
      },
    ];

    if (
      user.isAdmin ||
      team.members?.some(
        (f) => f.user.id === user.id && f.status === TeamMemberStatus.Captain
      )
    ) {
      columns[0].width = (columns[0].width as number) - 128;
      columns.push({
        Header: "Select",
        id: "isPlaying",
        Cell: ({ row }: Cell<FixturePlayerWithUserFragment>) => (
          <IsPlayingButton
            fixtureId={session.id}
            player={row.original}
            forceFixtureUpdate={forceUpdate}
          />
        ),
        width: 128,
      });
    }

    return columns;
  }, [user, team, playerBounds.width]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {session.team.name} vs {session.opponent}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {canEdit && edit ? (
              <EditFixture
                fixture={session}
                team={team}
                onFinish={() => {
                  setEdit(false);
                  forceUpdate();
                }}
              />
            ) : (
              <>
                <Text fontStyle='italic' mb={4}>
                  {DateTime.fromISO(session.start).toFormat(
                    "cccc LLLL d, HH:mm"
                  )}
                </Text>
                <Text color='gray'>{session.location}</Text>
                <Text mb={4}>{session.description}</Text>
                <Table<FixturePlayerWithUserFragment>
                  tableRef={playerRef}
                  sort
                  size='sm'
                  data={session.players.filter(
                    (e) =>
                      e.isPlaying ||
                      user.isAdmin ||
                      team.members.some(
                        (f) =>
                          f.user.id === user.id &&
                          f.status === TeamMemberStatus.Captain
                      )
                  )}
                  caption='Players'
                  columns={playerColumns}
                  getRowId={(row) => row.id}
                  layout='flex'
                  height='md'
                />
              </>
            )}
          </ModalBody>
          {canEdit && (
            <ModalFooter>
              <Button
                onClick={async () => {
                  try {
                    const wb = await generateFixtureSpreadsheet(session, user);
                    saveAs(
                      new Blob(
                        [
                          s2ab(
                            XLSX.write(wb, { bookType: "xlsx", type: "binary" })
                          ),
                        ],
                        {
                          type: "application/octet-stream",
                        }
                      ),
                      wb.Props.Title
                    );
                  } catch (e) {
                    toast({
                      status: "error",
                      title: "Error",
                      description: e.message,
                    });
                  }
                }}
                colorScheme='blue'
                mr={3}
              >
                Download
              </Button>
              <Button
                onClick={deleteDisclosure.onOpen}
                mr={3}
                colorScheme='red'
              >
                Delete
              </Button>
              <Button
                colorScheme={!edit ? "green" : undefined}
                onClick={() => setEdit((edit) => !edit)}
              >
                {edit ? "Close" : "Edit"}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
      {canEdit && (
        <AlertDialog
          isOpen={deleteDisclosure.isOpen}
          leastDestructiveRef={cancelRef}
          onClose={deleteDisclosure.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Fixture
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme='red'
                  onClick={async () => {
                    try {
                      await deleteFixture({
                        variables: {
                          id: session.id,
                        },
                      });
                      deleteDisclosure.onClose();
                      onClose();
                      toast({
                        title: "Fixture successfully deleted",
                        status: "success",
                      });
                      if (forceTeamUpdate) {
                        forceTeamUpdate();
                      }
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
      )}
    </>
  );
}

interface IsPlayingButton {
  fixtureId: string;
  player: FixturePlayerWithUserFragment;
  forceFixtureUpdate: () => void;
}

function IsPlayingButton({
  fixtureId,
  player: defaultPlayer,
  forceFixtureUpdate,
  ...rest
}: IsPlayingButton) {
  const [
    player,
    forceUpdate,
  ] = useCachedFragment<FixturePlayerWithUserFragment>({
    defaultValue: defaultPlayer,
    fragment: FixturePlayerWithUserFragmentDoc,
    fragmentName: "FixturePlayerWithUser",
  });

  const toast = useToast();

  const [toggleFixturePlaying] = useToggleFixturePlayingMutation(() => ({
    variables: {
      id: fixtureId,
      user: player.user.id,
    },
    update(cache, { data }) {
      cache.writeFragment({
        data: data.toggleFixturePlaying,
        fragment: FixtureFragmentDoc,
        fragmentName: "Fixture",
      });
    },
  }));
  return (
    <Button
      size='sm'
      colorScheme={player.isPlaying ? "green" : undefined}
      onClick={async () => {
        try {
          await toggleFixturePlaying();
          forceUpdate();
          forceFixtureUpdate();
        } catch (e) {
          toast({
            status: "error",
            title: "Error",
            description: e.message,
          });
        }
      }}
      {...rest}
    >
      Playing?
    </Button>
  );
}
