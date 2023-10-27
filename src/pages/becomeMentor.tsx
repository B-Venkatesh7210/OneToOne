import React, { useState, useContext } from "react";
import { IFormData } from "@/utils/types";
import { BiconomyContext } from "../context/BiconomyContext";
import Navbar from "@/components/Navbar";
import { AddAPhoto } from "@mui/icons-material";
import Image from "next/image";

const BecomeMentor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { createMentorProfile } = useContext(BiconomyContext);
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

  return (
    <>
      <div className="w-full min-h-screen h-auto flex flex-col justify-start items-center py-10 px-10 bg-gray-950">
        <Navbar isSticky={true} />
        <div className="h-[10vh]"></div>
        <div className="text-[3rem] font-bold mb-10">Become A Mentor</div>

        <div className="bgBeauty p-10 rounded-lg shadow-md w-full max-w-xl">
          <div className="mb-6 w-[50%] flex flex-row justify-between items-center">
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
              <>
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
              </>
            ) : (
              <>
                <AddAPhoto style={{ fontSize: 30, color: "white" }}></AddAPhoto>
                {selectedImage ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <span className="text-center text-white text-[0.8rem]">
                      Choose Profile Picture
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </>
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
              onClick={() => {
                createMentorProfile(formData);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-black focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeMentor;
