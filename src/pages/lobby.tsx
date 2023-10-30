import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAudio, useVideo, useRoom } from "@huddle01/react/hooks";
import { FaMicrophone, FaVideo } from "react-icons/fa";
import { useRouter } from "next/router";
import { useBiconomyContext } from "@/context/BiconomyContext";

const Lobby = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinRoom } = useRoom();
  const router = useRouter();
  const { globalCamStream, setGlobalCamStream } = useBiconomyContext();

  const {
    fetchVideoStream,
    stopVideoStream,
    stream: camStream,
    error: camError,
  } = useVideo();
  const {
    fetchAudioStream,
    stopAudioStream,
    stream: micStream,
    error: micError,
  } = useAudio();

  const [isCamOn, setIsCamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  const toggleCam = async () => {
    if (isCamOn) {
      stopVideoStream();
    } else {
      await fetchVideoStream();
    }
    setIsCamOn(!isCamOn);
  };

  const toggleMic = async () => {
    if (isMicOn) {
      stopAudioStream();
    } else {
      await fetchAudioStream();
    }
    setIsMicOn(!isMicOn);
  };

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
      console.log("Setting global cam stream", camStream);
      setGlobalCamStream(camStream);
    }
  }, [camStream, fetchVideoStream]);

  return (
    <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
      <Navbar isSticky={true} />
      <div className="h-[10vh]"></div>
      <span className="text-2xl font-bold mb-10">Lobby</span>
      <div className="mb-4 w-[40%] h-80 aspect-video border-solid border-[1px] border-primaryRed rounded-xl relative overflow-hidden mt-4 border-shadow">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
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
      </div>
      <button
        className="w-[10rem] h-[3rem] flex flex-col justify-center items-center bg-green-700 rounded-xl mt-8"
        onClick={() => {
          joinRoom();
          router.push("/room");
        }}
      >
        <span className="text-white font-semibold text-base">Join Room</span>
      </button>
    </div>
  );
};

export default Lobby;
