import {
  Button,
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
  FixtureFragment,
  FixtureFragmentDoc,
  SessionWithTeamFragmentDoc,
  TeamFragment,
} from "src/lib/fragments/fragments.generated";
import {
  useCreateFixtureMutation,
  useUpdateFixtureMutation,
} from "./editFixture.mutation.generated";

interface EditFixtureForm {
  start: string;
  opponent: string;
  location?: string | null;
  description?: string | null;
}

interface EditFixtureProps {
  team: TeamFragment;
  fixture?: FixtureFragment;
  onFinish?: (team: Team) => void;
}
export default function EditFixture({
  team,
  fixture,
  onFinish,
}: EditFixtureProps) {
  const { register, errors, handleSubmit } = useForm<EditFixtureForm>({
    defaultValues: {
      start: fixture?.start
        ? DateTime.fromISO(fixture.start).toFormat("yyyy-LL-dd'T'T")
        : undefined,
      opponent: fixture?.opponent,
      location: fixture?.location,
      description: fixture?.description,
    },
    resolver: yupResolver(
      Yup.object().shape({
        opponent: Yup.string().required(),
        description: Yup.string().nullable(),
        location: Yup.string().nullable(),
        start: Yup.string().required(),
      })
    ),
  });

  const [createFixture] = useCreateFixtureMutation(() => ({
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(team),
        fields: {
          sessions(existingSessionRefs = [], { readField }) {
            const newSessionRef = cache.writeFragment({
              data: { ...data.createFixture, team },
              fragment: SessionWithTeamFragmentDoc,
              fragmentName: "SessionWithTeam",
            });

            if (
              existingSessionRefs.some(
                (ref) => readField("id", ref) === data.createFixture.id
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
  const [updateFixture] = useUpdateFixtureMutation(() => ({
    update(cache, { data }) {
      cache.writeFragment({
        data: data.updateFixture,
        fragment: FixtureFragmentDoc,
        fragmentName: "FixtureFragment",
      });
    },
  }));

  const toast = useToast();
  return (
    <Stack
      as='form'
      onSubmit={handleSubmit(
        async ({ description, start, opponent, location }) => {
          try {
            let newFixture;
            if (fixture?.id) {
              const { data } = await updateFixture({
                variables: {
                  id: fixture.id,
                  fixture: {
                    description,
                    start: DateTime.fromISO(start).toJSDate(),
                    opponent,
                    location,
                    teamId: team.id,
                  },
                },
              });
              newFixture = data.updateFixture;
            } else {
              const { data } = await createFixture({
                variables: {
                  fixture: {
                    description,
                    start: DateTime.fromISO(start).toJSDate(),
                    opponent,
                    location,
                    teamId: team.id,
                  },
                },
              });
              newFixture = data.createFixture;
            }
            if (onFinish) {
              onFinish(newFixture);
            }
          } catch (e) {
            toast({ status: "error", title: "Error", description: e.message });
          }
        }
      )}
    >
      <FormControl isInvalid={!!errors.opponent}>
        <FormLabel htmlFor='opponent'>Opponent</FormLabel>
        <Input
          placeholder='Enter fixture opponent'
          name='opponent'
          ref={register}
        />
        <FormErrorMessage>{errors.opponent}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel htmlFor='description'>Description</FormLabel>
        <Textarea
          placeholder='Enter fixture description'
          name='description'
          ref={register}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.start}>
        <FormLabel htmlFor='start'>Start</FormLabel>
        <Input
          placeholder='Enter fixture start'
          name='start'
          type='datetime-local'
          ref={register}
        />
        <FormErrorMessage>{errors.start}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.location}>
        <FormLabel htmlFor='location'>Location</FormLabel>
        <Input
          placeholder='Enter fixture location'
          name='location'
          ref={register}
        />
        <FormErrorMessage>{errors.location}</FormErrorMessage>
      </FormControl>
      <Button type='submit'>Submit</Button>
    </Stack>
  );
}
