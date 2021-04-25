import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "./editTeam.mutation.generated";
import { Team } from "src/lib/graphql/types";
import { TeamFragment } from "src/lib/fragments/fragments.generated";

interface EditTeamForm {
  name: string;
  bio?: string;
}

interface EditTeamProps {
  team?: TeamFragment;
  onFinish?: (team: Team) => void;
}
export default function EditTeam({ team, onFinish }: EditTeamProps) {
  const { register, errors, handleSubmit } = useForm<EditTeamForm>({
    defaultValues: {
      name: team?.name,
      bio: team?.bio,
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        bio: Yup.string(),
      })
    ),
  });

  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const toast = useToast();
  return (
    <Stack
      as='form'
      onSubmit={handleSubmit(async ({ name, bio }) => {
        try {
          let newTeam;
          if (team?.id) {
            const { data } = await updateTeam({
              variables: {
                id: team.id,
                team: {
                  name,
                  bio,
                },
              },
            });
            newTeam = data.updateTeam;
          } else {
            const { data } = await createTeam({
              variables: {
                team: {
                  name,
                  bio,
                },
              },
            });
            newTeam = data.createTeam;
          }
          if (onFinish) {
            onFinish(newTeam);
          }
        } catch (e) {
          toast({ status: "error", title: "Error", description: e.message });
        }
      })}
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input placeholder='Enter team name' name='name' ref={register} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.bio}>
        <FormLabel htmlFor='bio'>Bio</FormLabel>
        <Textarea placeholder='Enter team bio' name='bio' ref={register} />
        <FormErrorMessage>{errors.bio}</FormErrorMessage>
      </FormControl>
      <Button type='submit'>Submit</Button>
    </Stack>
  );
}
