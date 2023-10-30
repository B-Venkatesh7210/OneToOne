import React, { useContext } from "react";
import { ISessionData } from "../utils/types";
import { BiconomyContext } from "@/context/BiconomyContext";
import moment from "moment-timezone";
import { useLobby } from "@huddle01/react/hooks";
import { useRouter } from "next/router";

interface SessionProps {
  sessions: ISessionData[];
}

const Session: React.FC<SessionProps> = ({ sessions }) => {
  const router = useRouter();
  const { approveSession, rejectSession, getMentorSessions, setRoomId } =
    useContext(BiconomyContext);

  const { joinLobby } = useLobby();

  const convertTimestamp = (timestamp: number) => {
    const date = moment.unix(timestamp).tz("Asia/Kolkata");
    const formattedDate = date.format("ddd MMM D YYYY HH:mm:ss z");
    return formattedDate;
  };

  const checkValidity = (timestamp: number) => {
    const newTimestamp = parseInt(timestamp.toString());
    const date = new Date();
    const dateTimestampInSeconds = Math.floor(date.getTime() / 1000);
    console.log("Date", date);
    console.log("Date Timestamp in seconds", dateTimestampInSeconds);

    return newTimestamp > dateTimestampInSeconds;
  };

  const sortedSessions = [...sessions].sort(
    (a, b) =>
      parseInt(a.fromTimestamp.toString()) -
      parseInt(b.fromTimestamp.toString())
  );

  return (
    <>
      {sortedSessions.map((session) => (
        <div
          key={session.sessionId.toString()}
          className="w-full h-auto flex flex-row justify-between items-start mb-4"
        >
          <div className="flex flex-col justify-start items-start">
            <span className="text-black font-bold text-xl">{session.name}</span>
            <span className="text-black font-semibold text-[0.8rem]">
              {convertTimestamp(parseInt(session.fromTimestamp.toString()))}
            </span>
          </div>
          <div className="flex flex-col justify-start items-start w-[40%]">
            <span className="text-black font-semibold text-base">
              {session.description}
            </span>
          </div>

          {session.status == "0" && (
            <div className="flex flex-row justify-center items-center gap-8">
              <button
                className="w-[10rem] h-[3rem] flex flex-col justify-center items-center bg-green-700 rounded-xl"
                disabled={
                  !checkValidity(parseInt(session.fromTimestamp.toString()))
                }
                onClick={async () => {
                  console.log("Joining Lobby");
                  joinLobby(session.roomId);
                  setRoomId(session.roomId as string);
                  router.push("/lobby");
                }}
              >
                <span className="text-white font-semibold text-base">
                  Join Session
                </span>
              </button>
            </div>
          )}
          {session.status == "1" && (
            <div className="flex flex-row justify-center items-center gap-8">
              <div className="flex flex-col justify-start items-center">
                <button
                  className="w-[10rem] h-[3rem] flex flex-col justify-center items-center bg-red-700 rounded-xl"
                  disabled={
                    !checkValidity(parseInt(session.fromTimestamp.toString()))
                  }
                  onClick={async () => {
                    console.log("Joining Lobby");
                    joinLobby(session.roomId as string);
                  }}
                >
                  <span className="text-white font-semibold text-base">
                    Rejected
                  </span>
                </button>
              </div>
            </div>
          )}
          {session.status == "2" && (
            <div className="flex flex-row justify-center items-center gap-8">
              <div className="flex flex-col justify-start items-center">
                <span className="text-green-900 font-semibold text-base">
                  Approve
                </span>
                <button
                  className="w-[3rem] h-[2rem] bg-green-600 text-black rounded-lg"
                  onClick={async () => {
                    await approveSession(
                      parseInt(session.toId.toString()),
                      parseInt(session.sessionId.toString())
                    );
                    getMentorSessions(parseInt(session.toId.toString()));
                  }}
                >
                  Yes
                </button>
              </div>
              <div className="flex flex-col justify-start items-center">
                <span className="text-red-900 font-semibold text-base">
                  Reject
                </span>
                <button
                  className="w-[3rem] h-[2rem] bg-red-600 text-black rounded-lg"
                  onClick={async () => {
                    await rejectSession(
                      parseInt(session.toId.toString()),
                      parseInt(session.sessionId.toString())
                    );
                    getMentorSessions(parseInt(session.toId.toString()));
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Session;
