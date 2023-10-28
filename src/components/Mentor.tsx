import React, { useContext } from "react";
import { IMentorDetails, IFormData, IMentorsData } from "@/utils/types";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import { BiconomyContext } from "@/context/BiconomyContext";

interface MentorProps {
  data: IMentorsData;
}

const Mentor: React.FC<MentorProps> = ({ data }) => {
  const { address } = useContext(BiconomyContext);

  const getSessionPrice = () => {
    const bigNumber = ethers.BigNumber.from(data.sessionPrice.toString());
    const divisor = ethers.BigNumber.from("1000000000000000000"); // This represents 10^18

    const result = bigNumber.div(divisor);
    return result.toString();
  };
  return (
    <div
      className={`${
        !(data.mentor == address)
        //TODO: Change this to true
          ? "hidden"
          : "bgBeauty min-h-[22rem] h-auto w-[20rem] p-5 flex flex-col justify-start items-center rounded-2xl"
      }`}
    >
      <div className="relative h-[8rem] w-[8rem] mb-6 rounded-[100%] bg-white flex flex-col justify-center items-center cursor-pointer">
        <Image
          src={`https://ipfs.io/ipfs/${data.profilePicture}`}
          alt="Profile Picture"
          layout="fill"
          objectFit="contain"
          className="object-cover h-full w-full rounded-[50%]"
        />
      </div>
      <div className="w-full h-auto flex flex-row justify-between items-start">
        <div className="w-[60%] flex flex-col justify-start items-start">
          <h2 className="text-xl font-bold text-black">{data.name}</h2>
          <p className="text-base font-semibold text-black">
            {data.description}
          </p>
          <p className="text-base font-semibold text-black">{data.skills}</p>
        </div>
        <div className="w-[30%] flex flex-col justify-start items-center">
          <p className="text-sm font-semibold text-black">Session Price</p>
          <h2 className="text-xl font-bold text-black">
            {getSessionPrice()} 🪙
          </h2>
          <button className="h-[2rem] w-[4rem] bg-blue-400 rounded-lg mt-4 text-black text-sm font-semibold">
            Mint
          </button>
        </div>
      </div>
      <button className="h-[2.5rem] w-full bg-blue-400 rounded-lg mt-5 text-black font-bold">
        Book A Session
      </button>
    </div>
  );
};

export default Mentor;
