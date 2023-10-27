import React, { useState, useContext } from "react";
import { IFormData } from "@/utils/types";
import { MentorContext } from "../context/MentorContext";
import Navbar from "@/components/Navbar";
import { AddAPhoto } from "@mui/icons-material";
import Image from "next/image";
import { NFTStorage, File, Blob } from "nft.storage";
import html2canvas from "html2canvas";

const BecomeMentor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { createMentorProfile } = useContext(MentorContext);
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    description: "",
    skills: "",
    totalNftsupply: 0,
    sessionPrice: 0,
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureName, setProfilePictureName] = useState<string | null>(
    null
  );

  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY as string,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      setProfilePicture(file);
      setProfilePictureName(file.name);
    } else {
      setSelectedImage(null);
      setProfilePicture(null);
      setProfilePictureName(null);
    }
  };

  // const dataURLtoBlob = (dataURL) => {
  //   let binary = atob(dataURL.split(",")[1]);
  //   let array = [];
  //   for (let i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], { type: "image/png" });
  // };

  // const uploadToNFTStorage = async (imageData: any) => {
  //   const blob = dataURLtoBlob(imageData);
  //   const metadata = await client.storeBlob(blob);
  //   //@ts-ignore
  //   return metadata.url;
  // };

  // const uploadDivAsNFT = async () => {
  //   try {
  //     const divElement = document.getElementById("nftDiv");
  //     //@ts-ignore
  //     const canvas = await html2canvas(divElement);
  //     const imageData = canvas.toDataURL("image/png");
  //     const nftURL = await uploadToNFTStorage(imageData);
  //     console.log(nftURL);
  //     return nftURL;
  //   } catch (error) {
  //     console.error("Error while uploading to NFT Storage:", error);
  //     return undefined;
  //   }
  // };

  async function uploadDivToNFTStorage(divId: string) {
    try {
      const divContent = document.getElementById(divId)?.innerHTML;

      if (!divContent) {
        throw new Error("Div not found or empty");
      }

      // Convert the div content to a Blob
      const blob = new Blob([divContent], { type: "text/html" });

      const file = new File([blob], `${divId}.html`, { type: "text/html" });

      // Store the blob in NFT storage
      const cid = await client.storeBlob(file);
      console.log("Stored in NFT Storage with CID:", cid);

      return cid;
    } catch (error) {
      console.error("Error uploading div to NFT Storage:", error);
    }
  }

  return (
    <>
      <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
        <Navbar isSticky={true} />
        <div className="h-[10vh]"></div>
        <div className="text-[3rem] font-bold mb-10">Become A Mentor</div>

        <div className="w-[80%] h-full flex flex-row justify-between items-start px-10">
          <div className="bgBeauty p-10 rounded-lg shadow-md w-full max-w-xl">
            <div className="relative mb-6 flex flex-row justify-between items-center">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-black focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  onChange={handleInputChange}
                />
              </div>
              {selectedImage ? (
                <div className="relative h-[8rem] w-[8rem] rounded-[100%] bg-white flex flex-col justify-center items-center cursor-pointer">
                  <Image
                    src={selectedImage}
                    alt="Profile Picture"
                    layout="fill"
                    objectFit="contain"
                    className="object-cover h-full w-full rounded-[50%]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="relative h-[8rem] w-[8rem] rounded-[100%] bg-white flex flex-col justify-center items-center cursor-pointer">
                  <AddAPhoto
                    style={{ fontSize: 30, color: "black" }}
                  ></AddAPhoto>
                  {selectedImage ? (
                    <div className="relative">
                      <Image
                        src={selectedImage}
                        alt="Profile Picture"
                        layout="fill"
                        objectFit="contain"
                        className="object-cover h-full w-full rounded-[50%]"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="text-center text-black text-[0.8rem]">
                        Choose Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-black focus:shadow-outline"
                id="description"
                name="description"
                rows={3}
                placeholder="Enter a brief description about yourself"
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="skills"
              >
                Skills
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-black focus:shadow-outline"
                id="skills"
                name="skills"
                rows={3}
                placeholder="List your skills"
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="totalNftsupply"
              >
                Total NFT Supply
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-black focus:shadow-outline"
                id="totalNftsupply"
                name="totalNftsupply"
                type="number"
                min="1"
                placeholder="Enter whole number > 0"
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="sessionPrice"
              >
                Session Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-black focus:shadow-outline"
                id="sessionPrice"
                name="sessionPrice"
                type="number"
                min="1"
                placeholder="Enter whole number > 0"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={async () => {
                  uploadDivToNFTStorage("nftDiv");
                  // createMentorProfile(
                  //   formData,
                  //   profilePicture,
                  //   profilePictureName
                  // );
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-black focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </div>
          <div
            id="nftDiv"
            className="bgBeauty h-[25rem] w-[25rem] rounded-2xl border-[0.5rem] border-blue-300 py-16 flex flex-col justify-start items-center"
          >
            <span className="text-black text-[3.4rem] font-bold">
              ONE TO ONE
            </span>
            <span className="text-black text-[2.5rem] font-bold">MENTOR</span>
            {formData.name == "" ? (
              <span className="text-gray-600 text-[1.5rem] font-bold mt-12">
                Enter your Name...
              </span>
            ) : (
              <span className="text-black text-[2.5rem] font-bold mt-12">
                {formData.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeMentor;
