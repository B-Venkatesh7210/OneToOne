import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { BiconomyContext } from "@/context/BiconomyContext";
import Image2 from "../assets/images/image.jpg";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";

interface Session {
  id: number;
  content: string;
}

type TabType = "Pending" | "Approved" | "Rejected";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const {
    getContractDetails,
    contract,
    address,
    getMentorDetails,
    mentorDetails,
    isMentor,
  } = useContext(BiconomyContext);

  useEffect(() => {
    getContractDetails();
    //@ts-ignore
    getMentorDetails(address, contract);
  }, []);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Pending":
        return pendingSessions.map((session) => (
          <div key={session.id}>{session.content}</div>
        ));
      case "Approved":
        return approvedSessions.map((session) => (
          <div key={session.id}>{session.content}</div>
        ));
      case "Rejected":
        return rejectedSessions.map((session) => (
          <div key={session.id}>{session.content}</div>
        ));
      default:
        return null;
    }
  };

  const pendingSessions: Session[] = [
    { id: 1, content: "Pending Session 1" },
    { id: 2, content: "Pending Session 2" },
  ];
  const approvedSessions: Session[] = [
    { id: 1, content: "Approved Session 1" },
  ];
  const rejectedSessions: Session[] = [
    { id: 1, content: "Rejected Session 1" },
  ];

  // const getSessionPrice = () => {
  //   const bigNumber = ethers.BigNumber.from(
  //     mentorDetails?.sessionPrice.toString()
  //   );
  //   const divisor = ethers.BigNumber.from("1000000000000000000"); // This represents 10^18

  //   const result = bigNumber.div(divisor);
  //   return result.toString();
  // };

  return (
    <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
      <Navbar isSticky={true} />
      <div className="h-[10vh]"></div>
      <div className="flex flex-row justify-between items-center w-[80%]">
        <div
          className={`${
            isMentor
              ? `flex flex-col items-center bgBeauty px-10 pt-10 rounded-lg shadow-md w-[35%] h-[70vh]`
              : `hidden`
          } `}
          onClick={() => {
            console.log(isMentor);
          }}
        >
          {/* Profile Image */}
          <div className="relative h-[8rem] w-[8rem] mb-6 rounded-[100%] bg-white flex flex-col justify-center items-center cursor-pointer">
            <Image
              src={`https://ipfs.io/ipfs/${mentorDetails?.profilePicture}`}
              alt="Profile Picture"
              layout="fill"
              objectFit="contain"
              className="object-cover h-full w-full rounded-[50%]"
            />
          </div>

          {/* Name */}
          <div className="mb-6 w-full">
            <label
              className="block text-black text-[2rem] font-bold mb-2"
              htmlFor="name"
            >
              {mentorDetails?.name}
            </label>
          </div>

          {/* Description */}
          <div className="mb-6 w-full h-auto my-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              {mentorDetails?.description}
            </label>
          </div>

          {/* Skills */}
          <div className="mb-6 w-full h-auto my-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="skills"
            >
              {mentorDetails?.skills}
            </label>
          </div>

          {/* Total NFT Supply */}
          <div className="mb-6 w-full my-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="totalNftsupply"
            >
              Total NFT Supply - {mentorDetails?.totalNftSupply.toString()}
            </label>
          </div>

          {/* Session Price */}
          {/* <div className="mb-6 w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="sessionPrice"
            >
              {mentorDetails && `Session Price - ${getSessionPrice()}`}
            </label>
          </div> */}
        </div>
        <div
          className={`bgBeauty flex flex-col rounded-xl h-[70vh] ${
            isMentor ? "w-[60%]" : "w-full"
          }`}
        >
          <div className="flex flex-row border-b">
            <div
              onClick={() => handleTabClick("Pending")}
              className={`cursor-pointer px-4 py-2 flex-1 text-center rounded-tl-xl rounded-b-xl ${
                activeTab === "Pending"
                  ? "border-b-4 border-blue-500 bg-blue-300 text-black font-bold text-xl"
                  : "hover:bg-blue-100 text-black font-bold text-xl"
              }`}
            >
              Pending
            </div>
            <div
              onClick={() => handleTabClick("Approved")}
              className={`cursor-pointer px-4 py-2 flex-1 text-center rounded-b-xl ${
                activeTab === "Approved"
                  ? "border-b-4 border-blue-500 bg-blue-300 text-black font-bold text-xl"
                  : "hover:bg-blue-100 text-black font-bold text-xl"
              }`}
            >
              Approved
            </div>
            <div
              onClick={() => handleTabClick("Rejected")}
              className={`cursor-pointer px-4 py-2 flex-1 text-center rounded-tr-xl rounded-b-xl ${
                activeTab === "Rejected"
                  ? "border-b-4 border-blue-500 bg-blue-300 text-black font-bold text-xl"
                  : "hover:bg-blue-100 text-black font-bold text-xl"
              }`}
            >
              Rejected
            </div>
          </div>
          <div className="p-4 w-full">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
