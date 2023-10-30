import React, { useContext, useState } from "react";
import { IMentorDetails, IFormData, IMentorsData } from "@/utils/types";
import Image from "next/image";
import { BigNumber, ethers } from "ethers";
import { BiconomyContext } from "@/context/BiconomyContext";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface MentorProps {
  data: IMentorsData;
}

const Mentor: React.FC<MentorProps> = ({ data }) => {
  const {
    address,
    contract,
    nftContract,
    requestSession,
    mintNft,
    getAllMentors,
  } = useContext(BiconomyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleBookSession = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const computeUnixTimestamp = () => {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    return Math.floor(combinedDateTime.getTime() / 1000);
  };

  // const getSessionPrice = () => {
  //   const bigNumber = ethers.BigNumber.from(data.sessionPrice.toString());

  //   const result = ethers.utils.formatEther(bigNumber.toString());
  //   return result.toString();
  // };

  // const getHalfSessionPrice = () => {
  //   const bigNumber = ethers.BigNumber.from(data.sessionPrice.toString());

  //   const result = ethers.utils.formatEther(bigNumber.div(2).toString());
  //   return result.toString();
  // };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "400px", // Set the width you desire
      height: "500px",
      background:
        "radial-gradient(circle at 10% 20%, rgb(220, 217, 249) 0%, rgb(172, 224, 217) 89.8%)",
      borderRadius: "20px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)", // You can adjust the opacity by changing the last value.
      backdropFilter: "blur(4px)", // This provides the blur effect.
    },
  };

  return (
    <div
      className={`${
        data.mentor == address
          ? //TODO: Change this to true
            "hidden"
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
          {/* <p className="text-sm font-semibold text-black">Session Price</p> */}
          {/* {data.isSubscriber ? (
            <div className="w-full flex flex-row justify-between items-baseline mt-2">
              <h2 className="text-sm font-bold text-red-700 line-through">
                {getSessionPrice()}
              </h2>
              <h2 className="text-xl font-bold text-black flex flex-row">
                {getHalfSessionPrice()}
              </h2>
              <h2 className="text-xl font-bold text-black flex flex-row">🪙</h2>
            </div>
          ) : (
            <h2 className="text-xl font-bold text-black">
              {getSessionPrice()} 🪙
            </h2>
          )} */}
          {!data.isSubscriber && (
            <button
              className="h-[2rem] w-[4rem] bg-blue-400 rounded-lg mt-4 text-black text-sm font-semibold"
              onClick={async () => {
                await mintNft(data);
                //@ts-ignore
                getAllMentors(address, contract, nftContract);
              }}
            >
              Mint
            </button>
          )}
        </div>
      </div>
      <button
        onClick={handleBookSession}
        className="h-[2.5rem] w-full bg-blue-400 rounded-lg mt-5 text-black font-bold"
      >
        Book A Session
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Book A Session Modal"
        style={customStyles}
      >
        <div className="flex flex-col justify-start items-center h-full w-full">
          <h2 className="text-black text-3xl font-bold">Book A Session</h2>
          <div className="w-full flex flex-col justify-start items-start mt-4">
            <label className="text-black text-xl font-bold">Date</label>
            <DatePicker
              selected={selectedDate}
              minDate={new Date()}
              // @ts-ignore
              onChange={(date) => setSelectedDate(date)}
              className="text-black mt-2"
            />
            <label className="text-black text-xl font-bold mt-2">Time</label>
            <DatePicker
              selected={selectedTime}
              // @ts-ignore
              onChange={(date) => setSelectedTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              dateFormat="h:mm aa"
              className="text-black mt-2"
            />
            <label className="text-black text-xl font-bold mt-2">Name</label>
            <input
              className="text-black mt-2 w-full h-[2rem] px-2"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="text-black text-xl font-bold mt-2">
              Description
            </label>
            <textarea
              className="text-black mt-2 w-full h-[5rem] p-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className="w-[80%] h-[3rem] bg-blue-400 mt-10 rounded-xl text-black font-bold"
            onClick={() => {
              // const sessionPrice = data.isSubscriber ? getHalfSessionPrice() : getSessionPrice();
              const fromTimestamp = computeUnixTimestamp();
              // console.log(sessionPrice, fromTimestamp, name, description);
              requestSession(
                data,
                fromTimestamp,
                name,
                description
              );
            }}
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Mentor;
