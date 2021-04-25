import { useUser as useAuthUser } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";

export default function useUser() {
  const { user, ...rest } = useAuthUser();

  return {
    ...rest,
    user: user as User | null,
  };
}
