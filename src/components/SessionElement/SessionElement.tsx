import { Box, Text, toast } from "@chakra-ui/react";
import {
  SessionFragment,
  SessionWithTeam_Fixture_Fragment,
  SessionWithTeam_TrainingSession_Fragment,
  TrainingSessionFragment,
  UserFragment,
} from "src/lib/fragments/fragments.generated";
import FlatList from "flatlist-react";
import { FixtureElement } from "./FixtureElement";
import { TrainingSessionElement } from "./TrainingSessionElement";

interface SessionElementProps {
  session: SessionFragment;
  type?: "simple" | "full";
  forceUpdate?: () => void;
}

export default function SessionElement({
  session,
  type,
  forceUpdate,
}: SessionElementProps) {
  switch (session.__typename) {
    case "Fixture":
      return (
        <FixtureElement
          session={session as SessionWithTeam_Fixture_Fragment}
          type={type}
          forceTeamUpdate={forceUpdate}
        />
      );
    case "TrainingSession":
      return (
        <TrainingSessionElement
          session={session as SessionWithTeam_TrainingSession_Fragment}
          type={type}
          forceTeamUpdate={forceUpdate}
        />
      );
  }
}
