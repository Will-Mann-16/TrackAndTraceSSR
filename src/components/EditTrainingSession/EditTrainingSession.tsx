import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Switch,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { Team } from "src/lib/graphql/types";
import {
  SessionWithTeamFragmentDoc,
  TeamFragment,
  TrainingSessionFragment,
  TrainingSessionFragmentDoc,
} from "src/lib/fragments/fragments.generated";
import {
  useCreateTrainingSessionMutation,
  useUpdateTrainingSessionMutation,
} from "./editTrainingSession.mutation.generated";

interface EditTrainingSessionForm {
  start: string;
  end: string;
  title: string;
  description?: string | null;
  public: boolean;
}

interface EditTrainingSessionProps {
  team: TeamFragment;
  trainingSession?: TrainingSessionFragment;
  onFinish?: (team: Team) => void;
}
export default function EditTrainingSession({
  team,
  trainingSession,
  onFinish,
}: EditTrainingSessionProps) {
  const {
    register,
    errors,
    handleSubmit,
    watch,
  } = useForm<EditTrainingSessionForm>({
    defaultValues: {
      start: trainingSession?.start
        ? DateTime.fromISO(trainingSession.start).toFormat("yyyy-LL-dd'T'T")
        : undefined,
      end: trainingSession?.end
        ? DateTime.fromISO(trainingSession.end).toFormat("yyyy-LL-dd'T'T")
        : undefined,
      description: trainingSession?.description,
      public: trainingSession?.public,
      title: trainingSession?.title,
    },
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().nullable(),
        start: Yup.string().required(),
        end: Yup.string().required(),
        public: Yup.boolean().required(),
      })
    ),
  });

  const [createTrainingSession] = useCreateTrainingSessionMutation(() => ({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(team),
        fields: {
          sessions(existingSessionRefs = [], { readField }) {
            const newSessionRef = cache.writeFragment({
              data: { ...data.createTrainingSession, team },
              fragment: SessionWithTeamFragmentDoc,
              fragmentName: "SessionWithTeam",
            });

            if (
              existingSessionRefs.some(
                (ref) => readField("id", ref) === data.createTrainingSession.id
              )
            ) {
              return existingSessionRefs;
            }

            return [...existingSessionRefs, newSessionRef].sort(
              (a, b) =>
                new Date(readField<string>("start", a)).getTime() -
                new Date(readField<string>("start", b)).getTime()
            );
          },
        },
      });
    },
  }));
  const [updateTrainingSession] = useUpdateTrainingSessionMutation(() => ({
    update(cache, { data }) {
      cache.writeFragment({
        data: data.updateTrainingSession,
        fragment: TrainingSessionFragmentDoc,
        fragmentName: "TrainingSession",
      });
    },
  }));

  const toast = useToast();
  return (
    <Stack
      as='form'
      onSubmit={handleSubmit(
        async ({ title, description, start, end, public: isPublic }) => {
          try {
            let newTrainingSession;
            if (trainingSession?.id) {
              const { data } = await updateTrainingSession({
                variables: {
                  id: trainingSession.id,
                  trainingSession: {
                    title,
                    description,
                    start: DateTime.fromISO(start).toJSDate(),
                    end: DateTime.fromISO(end).toJSDate(),
                    public: isPublic,
                    teamId: team.id,
                  },
                },
              });
              newTrainingSession = data.updateTrainingSession;
            } else {
              const { data } = await createTrainingSession({
                variables: {
                  trainingSession: {
                    title,
                    description,
                    start: DateTime.fromISO(start).toJSDate(),
                    end: DateTime.fromISO(end).toJSDate(),
                    public: isPublic,
                    teamId: team.id,
                  },
                },
              });
              newTrainingSession = data.createTrainingSession;
            }
            if (onFinish) {
              onFinish(newTrainingSession);
            }
          } catch (e) {
            toast({ status: "error", title: "Error", description: e.message });
          }
        }
      )}
    >
      <FormControl isInvalid={!!errors.title}>
        <FormLabel htmlFor='title'>Title</FormLabel>
        <Input
          placeholder='Enter training session title'
          name='title'
          ref={register}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel htmlFor='description'>Description</FormLabel>
        <Textarea
          placeholder='Enter training session description'
          name='description'
          ref={register}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.start}>
        <FormLabel htmlFor='start'>Start</FormLabel>
        <Input
          placeholder='Enter training session start'
          name='start'
          type='datetime-local'
          ref={register}
        />
        <FormErrorMessage>{errors.start}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.end}>
        <FormLabel htmlFor='end'>End</FormLabel>
        <Input
          placeholder='Enter training session end'
          name='end'
          type='datetime-local'
          ref={register}
        />
        <FormErrorMessage>{errors.end}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.public}>
        <Flex align='center'>
          <FormLabel htmlFor='public' mb='0'>
            Is Public?
          </FormLabel>
          <Switch name='public' ref={register} />
        </Flex>
        <FormHelperText>
          When a session is public, anyone in the club can attend
        </FormHelperText>
        <FormErrorMessage>{errors.public}</FormErrorMessage>
      </FormControl>
      <Button type='submit'>Submit</Button>
    </Stack>
  );
}
