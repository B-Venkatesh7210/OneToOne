import React, { useContext, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { MentorContext } from "@/context/mentorContext";
import { BiconomyContext } from "@/context/BiconomyContext";

const Dashboard = () => {
  const { getMentorDetails } = useContext(MentorContext);
  const { contract } = useContext(BiconomyContext);
  useEffect(() => {
    getMentorDetails();
  }, []);

  return (
    <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
      <Navbar isSticky={true} />
      <div className="h-[10vh]"></div>
      <span>Profile</span>
    </div>
  );
};

export default Dashboard;
