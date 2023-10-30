import React, { useContext } from "react";
import { ISessionData } from "../utils/types";
import { BiconomyContext } from "@/context/BiconomyContext";
import moment from "moment-timezone";

interface SessionProps {
  sessions: ISessionData[];
}

const Session: React.FC<SessionProps> = ({ sessions }) => {
  const { approveSession, getMentorSessions } = useContext(BiconomyContext);

  const convertTimestamp = (timestamp: number) => {
    const date = moment.unix(timestamp).tz("Asia/Kolkata");
    const formattedDate = date.format("ddd MMM D YYYY HH:mm:ss z");
    return formattedDate;
  };

  return (
    <>
      {sessions.map((session) => (
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
          {session.status == "2" && (
            <div className="flex flex-row justify-center items-center gap-8">
              <div className="flex flex-col justify-start items-center">
                <span className="text-green-900 font-semibold text-base">
                  Approve
                </span>
                <button
                  className="w-[3rem] h-[2rem] bg-green-600 text-black"
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
                <button className="w-[3rem] h-[2rem] bg-red-600 text-black">
                  Yes
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
