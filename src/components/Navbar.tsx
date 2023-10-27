import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BiconomyContext } from "../context/BiconomyContext";
import { getEllipsisTxt } from "@/utils/formatters";

interface NavbarProps {
  isSticky: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isSticky }) => {
  const router = useRouter();
  const { address, connect } = useContext(BiconomyContext);

  return (
    <div
      className={`h-[10vh] z-[1000] bgBeauty border-b-2 border-[#3a3a3a] w-full flex flex-row rounded-b-xl justify-between items-center py-2 px-4 ${
        isSticky ? "fixed top-0" : ""
      }`}
    >
      <div className="text-black text-3xl font-bold">ONE TO ONE</div>
      <div className="flex space-x-16">
        <button
          className="text-black font-bold text-xl"
          onClick={() => router.push("/")}
        >
          Home
        </button>
        <button
          className="text-black font-bold text-xl"
          onClick={() => router.push("/becomeMentor")}
        >
          Mentor
        </button>
        <button
          className="text-black font-bold text-xl"
          onClick={() => router.push("/dashboard")}
        >
          Profile
        </button>
        {address == null || address == undefined ? (
          <div className="flex-none"></div>
        ) : (
          <div className="flex flex-row justify-center items-center gap-2">
            <span className="text-black text-[2rem] font-bold">100</span>
            <span className="text-black text-[1.5rem]">🪙</span>
          </div>
        )}

        {address == null || address == undefined ? (
          <>
            <button
              onClick={connect}
              className="bg-blue-500 text-black px-4 py-2 rounded-xl w-[10rem] h-[3rem]"
            >
              Connect Wallet
            </button>
          </>
        ) : (
          <span className="mt-3 text-lg font-semibold text-black">{getEllipsisTxt(address)}</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
