import { Stack } from "@chakra-ui/layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import useUser from "../../lib/useUser";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { Input } from "@chakra-ui/input";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { PhoneNumberUtil } from "google-libphonenumber";
import { Button } from "@chakra-ui/button";
import { useUpdateUserMutation } from "./updateUser.mutation.generated";
import { User } from "src/lib/graphql/types";
import {
  UserFragment,
  UserFragmentDoc,
} from "src/lib/fragments/fragments.generated";

const phoneUtil = PhoneNumberUtil.getInstance();

interface EditUserForm {
  name: string;
  email: string;
  phoneNumber: string;
}

interface EditUserProps {
  user: UserFragment;
  onFinish?: (user: UserFragment) => void;
}
export default function EditUser({ user, onFinish }: EditUserProps) {
  const { user: u } = useUser();

  const [updateUser] = useUpdateUserMutation(() => ({
    update(cache, { data }) {
      if (data.updateUser) {
        cache.writeFragment({
          fragment: UserFragmentDoc,
          fragmentName: "User",
          data: data.updateUser,
        });
      }
    },
  }));

  if (u.id !== user.id && !u.isAdmin) {
    return (
      <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Unauthorised
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          You cannot edit this user
        </AlertDescription>
      </Alert>
    );
  }

  const { register, errors, handleSubmit } = useForm<EditUserForm>({
    defaultValues: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        phoneNumber: Yup.string().test(
          "valid-phonenumber",
          "A valid phone number is required",
          (value) => {
            if (value && value !== "") {
              if (phoneUtil.isValidNumber(phoneUtil.parse(value, "GB"))) {
                return true;
              }
              return false;
            }
            return true;
          }
        ),
      })
    ),
  });
  const toast = useToast();
  return (
    <Stack
      as='form'
      onSubmit={handleSubmit(async ({ name, email, phoneNumber }) => {
        try {
          const { data } = await updateUser({
            variables: {
              user: {
                name,
                email,
                phoneNumber,
              },
            },
          });

          if (onFinish) {
            onFinish(data.updateUser);
          }
        } catch (e) {
          toast({ status: "error", title: "Error", description: e.message });
        }
      })}
    >
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input placeholder='John Doe' name='name' ref={register} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor='email'>Email address</FormLabel>
        <Input
          placeholder='john.doe@example.com'
          name='email'
          type='email'
          ref={register}
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.phoneNumber}>
        <FormLabel htmlFor='phoneNumber'>Phone Number</FormLabel>
        <Input
          placeholder='07123456789'
          name='phoneNumber'
          type='tel'
          ref={register}
        />
        <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
      </FormControl>
      <Button type='submit'>Submit</Button>
    </Stack>
  );
}
