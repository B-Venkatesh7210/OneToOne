import React, { useEffect, useContext } from "react";
import { BiconomyContext } from "@/context/BiconomyContext";

const Home = () => {
  const { address, connect, smartAccount, changeNumber } =
    useContext(BiconomyContext);

  return (
    <>
      <div className="w-screen min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-red-600">
        <div className="text-[3rem] font-bold">ONE TO ONE</div>
        <div className="text-[1rem] font-semibold mb-10">
          One to One sessions at fingertips
        </div>

        {address == null || address == undefined ? (
          <>
            <span>Connect your wallet</span>
            <button
              onClick={connect}
              className="w-[15rem] h-[3rem] bg-blue-500 text-[1.2rem] font-bold rounded-xl mt-4"
            >
              Connect Wallet
            </button>
          </>
        ) : (
          <>
            <span>Your Address is : {address}</span>
            <button
              onClick={() => {
                console.log(smartAccount);
              }}
              className="w-[15rem] h-[3rem] bg-blue-500 text-[1.2rem] font-bold rounded-xl mt-10"
            >
              Become a Mentor
            </button>
            <button
              onClick={changeNumber}
              className="w-[15rem] h-[3rem] bg-blue-500 text-[1.2rem] font-bold rounded-xl mt-10"
            >
              Change Number
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
