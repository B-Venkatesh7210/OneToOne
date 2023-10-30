import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Video, Audio } from "@huddle01/react/components";
import {
  useVideo,
  useAudio,
  useLobby,
  useRoom,
  useRecording,
  usePeers,
} from "@huddle01/react/hooks";
import { FaMicrophone, FaVideo } from "react-icons/fa";
import { Router } from "next/router";
import { useRouter } from "next/router";
import { useBiconomyContext } from "@/context/BiconomyContext";

const Room = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { peers } = usePeers();
  const { leaveRoom } = useRoom();
  const { leaveLobby } = useLobby();
  const { globalCamStream, setGlobalCamStream } = useBiconomyContext();

  const {
    produceVideo,
    stopProducingVideo,
    stream: camStream,
    error: camError,
  } = useVideo();
  const {
    produceAudio,
    stopProducingAudio,
    stream: micStream,
    error: micError,
  } = useAudio();

  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const toggleCam = async () => {
    if (isCamOn) {
      console.log(camStream);
      stopProducingVideo();
    } else {
      console.log(camStream);
      await produceVideo(camStream);
    }
    setIsCamOn(!isCamOn);
  };

  const toggleMic = async () => {
    if (isMicOn) {
      stopProducingAudio();
    } else {
      // @ts-ignore
      await produceAudio(micStream);
    }
    setIsMicOn(!isMicOn);
  };

  useEffect(() => {
    // console.log(camStream);
    // if (camStream && videoRef.current) {
    //   videoRef.current.srcObject = camStream;
    // }
    console.log(globalCamStream);
    if (globalCamStream && videoRef.current) {
      videoRef.current.srcObject = globalCamStream;
    }
  }, [globalCamStream]);

  return (
    <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
      <Navbar isSticky={true} />
      <div className="h-[10vh]"></div>
      <span
        onClick={() => {
          console.log(JSON.stringify(peers));
        }}
      >
        Room
      </span>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <div className="flex flex-wrap gap-3 items-center justify-center ">
          <div className="h-80 aspect-video bg-zinc-800/50 rounded-2xl relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <div className="w-full h-full aspect-video bg-secondaryRed/10 border-solid border-[1px] border-primaryRed rounded-xl relative overflow-hidden mt-4 border-shadow">
            {Object.values(peers)
              .filter((peer: any) => peer.cam)
              .map((peer: any) => (
                <div
                  key={peer.peerId}
                  className="w-full h-full aspect-video bg-zinc-800/50 rounded-2xl relative overflow-hidden"
                >
                  <Video
                    peerId={""}
                    track={peer.cam}
                    className="h-full w-full object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    debug
                  />
                </div>
              ))}
          </div>
        </div>
        {Object.values(peers)
          .filter((peer) => peer.mic)
          .map((peer) => (
            <Audio
              key={peer.peerId}
              peerId={peer.peerId}
              // @ts-ignore
              track={peer.mic}
            />
          ))}
      </div>
      <div className="flex gap-8 mt-4">
        <button
          onClick={toggleCam}
          className={`p-4 rounded-full ${
            isCamOn ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <FaVideo className={`${isCamOn ? "text-white" : "text-gray-500"}`} />
        </button>
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full ${
            isMicOn ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <FaMicrophone
            className={`${isMicOn ? "text-white" : "text-gray-500"}`}
          />
        </button>
        <span
          onClick={() => {
            leaveRoom();
            leaveLobby();
            router.push("/");
          }}
        >
          Leave
        </span>
      </div>
    </div>
  );
};

export default Room;
