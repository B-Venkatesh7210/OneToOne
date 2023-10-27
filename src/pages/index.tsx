import React, { useEffect, useContext } from "react";
import { BiconomyContext } from "@/context/BiconomyContext";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

const Home = () => {

  const router = useRouter();

  return (
    <>
      <div className="w-screen min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
        <Navbar isSticky={true} />
        <div className="h-[10vh]"></div>
        <div className="text-[3rem] font-bold">ONE TO ONE</div>
        <div className="text-[1rem] font-semibold mb-10">
          One to One sessions at fingertips
        </div>

        
      </div>
    </>
  );
};

export default Home;
