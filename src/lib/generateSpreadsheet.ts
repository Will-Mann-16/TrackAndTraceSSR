import {
  SessionWithTeam_Fixture_Fragment,
  SessionWithTeam_TrainingSession_Fragment,
  UserFragment,
} from "./fragments/fragments.generated";
import { DateTime } from "luxon";
import XLSX from "xlsx";

const TRAINING_SESSION_LOCATION = "Weetwood Sports Park";

export function s2ab(s) {
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf); //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

export async function generateFixtureSpreadsheet(
  session: SessionWithTeam_Fixture_Fragment,
  user: UserFragment
) {
  const wb = XLSX.utils.book_new();

  const title = `${session.team.name} vs ${
    session.opponent
  } - ${DateTime.fromISO(session.start).toLocaleString(
    DateTime.DATE_SHORT
  )}.xlsx`;

  wb.Props = {
    Title: title,
    Subject: `${session.team.name} Track & Trace`,
    Author: user.name,
    CreatedDate: new Date(),
  };

  wb.SheetNames.push(session.team.name);

  let data: string[][] = [
    [
      "Name",
      "Date of Session (in dd/mm/yyyy format)",
      "Time of Session (From - To in hh:mm as 24 hour format)",
      "Location of Session",
      "Email of Attendee",
      "Phone of Attendee",
    ],
  ];

  data.push([
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
  ]);

  session.players
    .filter((e) => e.isPlaying)
    .forEach((player) => {
      data.push([
        player.user.name,
        DateTime.fromISO(session.start).toLocaleString(DateTime.DATE_SHORT),
        `${DateTime.fromISO(session.start).toLocaleString(
          DateTime.TIME_24_SIMPLE
        )} - ${DateTime.fromISO(session.start)
          .plus({ minutes: 90 })
          .toLocaleString(DateTime.TIME_24_SIMPLE)}`,
        session.location,
        player.user.email,
        player.user.phoneNumber,
      ]);
    });

  wb.Sheets[session.team.name] = XLSX.utils.aoa_to_sheet(data);

  return wb;
}

export async function generateTrainingSessionSpreadsheet(
  session: SessionWithTeam_TrainingSession_Fragment,
  user: UserFragment
) {
  const wb = XLSX.utils.book_new();

  const title = `${session.team.name} - ${session.title} - ${DateTime.fromISO(
    session.start
  ).toLocaleString(DateTime.DATE_SHORT)}.xlsx`;

  wb.Props = {
    Title: title,
    Subject: `${session.team.name} Track & Trace`,
    Author: user.name,
    CreatedDate: new Date(),
  };

  wb.SheetNames.push(session.team.name);

  let data: string[][] = [
    [
      "Name",
      "Date of Session (in dd/mm/yyyy format)",
      "Time of Session (From - To in hh:mm as 24 hour format)",
      "Location of Session",
      "Email of Attendee",
      "Phone of Attendee",
    ],
  ];

  data.push([
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
    session.team.name,
  ]);

  session.attending.forEach((user) => {
    data.push([
      user.name,
      DateTime.fromISO(session.start).toLocaleString(DateTime.DATE_SHORT),
      `${DateTime.fromISO(session.start).toLocaleString(
        DateTime.TIME_24_SIMPLE
      )} - ${DateTime.fromISO(session.end).toLocaleString(
        DateTime.TIME_24_SIMPLE
      )}`,
      TRAINING_SESSION_LOCATION,
      user.email,
      user.phoneNumber,
    ]);
  });

  wb.Sheets[session.team.name] = XLSX.utils.aoa_to_sheet(data);

  return wb;
}
