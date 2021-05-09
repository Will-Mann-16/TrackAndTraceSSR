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
  SessionWithTeam_TrainingSession_Fragment,
  TeamWithMembersFragment,
  TeamWithMembersFragmentDoc,
  TrainingSessionFragmentDoc,
  UserFragment,
} from "src/lib/fragments/fragments.generated";
import { truncate } from "lodash";
import { useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import UserElement from "../UserElement";
import useUser from "src/lib/useUser";
import { useToggleTrainingSessionAttendanceMutation } from "./sessionAttendance.mutation.generated";
import { useCachedFragment } from "src/lib/apollo";
import EditTrainingSession from "../EditTrainingSession";
import { useApolloClient } from "@apollo/client";
import { TeamMemberStatus } from "src/lib/graphql/types";
import { useDeleteTrainingSessionMutation } from "../EditTrainingSession/editTrainingSession.mutation.generated";
import {
  generateTrainingSessionSpreadsheet,
  s2ab,
} from "src/lib/generateSpreadsheet";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ReactNode } from "react";
import Table from "../Table";
import { Column } from "react-table";
import useMeasure from "react-use-measure";

interface TrainingSessionElement {
  session: SessionWithTeam_TrainingSession_Fragment;
  type?: "simple" | "full";
  forceTeamUpdate?: () => void;
}
export function TrainingSessionElement({
  session: defaultSession,
  type,
  forceTeamUpdate,
}: TrainingSessionElement) {
  let [
    session,
    forceUpdate,
  ] = useCachedFragment<SessionWithTeam_TrainingSession_Fragment>({
    defaultValue: defaultSession as SessionWithTeam_TrainingSession_Fragment,
    fragment: SessionWithTeamFragmentDoc,
    fragmentName: "SessionWithTeam",
  });

  const router = useRouter();
  const description = useMemo(() => truncate(session.description), [session]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();

  const toast = useToast();

  const [toggleTrainingAttendance] = useToggleTrainingSessionAttendanceMutation(
    () => ({
      variables: {
        id: session.id,
      },
      update(cache, { data }) {
        if (data.toggleTrainingSessionAttendance) {
          cache.writeFragment({
            data: data.toggleTrainingSessionAttendance,
            fragment: TrainingSessionFragmentDoc,
            fragmentName: "TrainingSession",
          });
        }
      },
    })
  );

  const trainingSessionComponent = useMemo<ReactNode>(() => {
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
              bg: useColorModeValue("gray.400", "gray.600"),
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
                <Text fontSize='sm'>{session.title}</Text>
              </Box>
              <Box textAlign={{ base: "left", md: "right" }}>
                <Text fontSize='sm'>
                  {DateTime.fromISO(session.start).toFormat("ccc dd/LL HH:mm")}{" "}
                  - {DateTime.fromISO(session.end).toFormat("HH:mm")}
                </Text>
                <Text fontSize='sm' color='gray'>
                  {session.team.name}
                </Text>
              </Box>
            </Flex>
            <Button
              flexShrink={0}
              flexGrow={0}
              size='sm'
              colorScheme={
                session.attending.some((e) => e.id === user.id)
                  ? "green"
                  : undefined
              }
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await toggleTrainingAttendance();
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
              Attend
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
              bg: useColorModeValue("gray.400", "gray.600"),
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
                <Text>{session.title}</Text>
                <Text color='gray'>{description}</Text>
              </Box>
              <Box textAlign={{ base: "left", md: "right" }}>
                <Text>
                  {DateTime.fromISO(session.start).toFormat("ccc LLL d, HH:mm")}{" "}
                  - {DateTime.fromISO(session.end).toFormat("HH:mm")}
                </Text>
              </Box>
            </Flex>
            <Button
              flexShrink={0}
              flexGrow={0}
              colorScheme={
                session.attending.some((e) => e.id === user.id)
                  ? "green"
                  : undefined
              }
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await toggleTrainingAttendance();
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
              Attend
            </Button>
          </Flex>
        );
    }
  }, [session, type]);

  return (
    <>
      {trainingSessionComponent}
      <TrainingSessionModal
        session={session}
        forceUpdate={forceUpdate}
        forceTeamUpdate={forceTeamUpdate}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
interface TrainingSessionModalProps {
  session: SessionWithTeam_TrainingSession_Fragment;
  forceUpdate: () => void;
  forceTeamUpdate?: () => void;
  isOpen: boolean;
  onClose: () => void;
}
function TrainingSessionModal({
  session,
  forceUpdate,
  forceTeamUpdate,
  isOpen,
  onClose,
}: TrainingSessionModalProps) {
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

  const [deleteTrainingSession] = useDeleteTrainingSessionMutation(() => ({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(team),
        fields: {
          sessions(existingSessionRefs = [], { readField }) {
            return existingSessionRefs.filter(
              (ref) => readField("id", ref) !== data.deleteTrainingSession.id
            );
          },
        },
      });
    },
  }));

  const [playerRef, playerBounds] = useMeasure();
  const playerColumns = useMemo(() => {
    const columns: Column<UserFragment>[] = [
      {
        Header: "Name",
        accessor: "name",
        width: playerBounds.width,
      },
    ];
    return columns;
  }, [user, playerBounds.width]);

  const canEdit = useMemo<boolean>(
    () =>
      user.isAdmin ||
      team?.members?.some(
        (e) => e.user.id === user.id && e.status === TeamMemberStatus.Captain
      ),
    [user, team]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{session.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {canEdit && edit ? (
              <EditTrainingSession
                trainingSession={session}
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
                  )}{" "}
                  - {DateTime.fromISO(session.end).toFormat("HH:mm")}
                </Text>
                <Text mb={4}>{session.description}</Text>
                <Table<UserFragment>
                  tableRef={playerRef}
                  sort
                  size='sm'
                  data={session.attending}
                  caption='Attending'
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
                    const wb = await generateTrainingSessionSpreadsheet(
                      session,
                      user
                    );
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
                Delete Training Session
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
                      await deleteTrainingSession({
                        variables: {
                          id: session.id,
                        },
                      });
                      deleteDisclosure.onClose();
                      onClose();
                      toast({
                        title: "Training Session successfully deleted",
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
