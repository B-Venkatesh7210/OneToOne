import React, {
  useCallback,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { IMentorDetails } from "@/utils/types";
import { BiconomyContext } from "./BiconomyContext";
import { IFormData } from "@/utils/types";
import { ethers } from "ethers";
import { NFTStorage, File, Blob } from "nft.storage";

export const MentorContext = createContext<{
  mentorDetails: IMentorDetails | null;
  createMentorProfile: (
    data: IFormData,
    profilePicture: File | null,
    profilePictureName: string | null,
    metadata: string | null
  ) => Promise<void>;
  getMentorDetails: () => Promise<void>;
}>({
  mentorDetails: null,
  createMentorProfile: async () => {},
  getMentorDetails: async () => {},
});

export const useMentorContext = () => React.useContext(MentorContext);

export const MentorProvider = ({ children }: any) => {
  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY as string,
  });

  const [mentorDetails, setMentorDetails] = useState<IMentorDetails | null>(
    null
  );
  const {
    address,
    smartAccount,
    contract,
    contractAddress,
    biconomyPaymaster,
    paymasterServiceData,
  } = useContext(BiconomyContext);

  const createMentorProfile = async (
    formData: IFormData,
    profilePicture: File | null,
    profilePictureName: string | null,
    metadata: string | null
  ) => {
    console.log("Hey Wassup");
    try {
      //TODO: Add metadata
      
      const sessionPriceBig = ethers.utils.parseEther(
        formData.sessionPrice.toString()
      );
      const imageFile = new File(
        [profilePicture as File],
        profilePictureName as string,
        {
          type: profilePicture?.type,
        }
      );
      const imageBlob = imageFile.slice(0, imageFile.size, imageFile.type);
      const profilePictureCid = await client.storeBlob(imageBlob);
      console.log("Profile Picture Cid", profilePictureCid);
      console.log(
        "Mentor Profile Data",
        formData.name,
        profilePictureCid,
        formData.description,
        formData.skills,
        sessionPriceBig,
        formData.totalNftsupply,
        metadata
      );
      const minTx = await contract.populateTransaction.createMentorProfile(
        formData.name,
        profilePictureCid,
        formData.description,
        formData.skills,
        sessionPriceBig,
        formData.totalNftsupply,
        metadata
      );
      console.log("Mint Tx Data", minTx.data);
      const tx1 = {
        to: contractAddress,
        data: minTx.data,
      };
      //@ts-ignore
      let userOp = await smartAccount?.buildUserOp([tx1]);
      console.log("UserOp", { userOp });

      const paymasterAndDataResponse =
        await biconomyPaymaster?.getPaymasterAndData(
          //@ts-ignore
          userOp,
          paymasterServiceData
        );

      //@ts-ignore
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      //@ts-ignore
      const userOpResponse = await smartAccount?.sendUserOp(userOp);
      console.log("userOpHash", { userOpResponse });
      //@ts-ignore
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (error) {
      console.log(error);
    }
  };

  const getMentorDetails = async () => {
    console.log("Hey I am outside");
    if (contract) {
      console.log("Hey I am inside");
      const mentorData = await contract.mentorProfiles(address);
      setMentorDetails({
        name: mentorData.name,
        profilePicture: mentorData.profilePicture,
        description: mentorData.description,
        skills: mentorData.skills,
        sessionPrice: mentorData.sessionPrice,
        totalNftSupply: mentorData.totalNftSupply,
      });
    }
  };

  return (
    <MentorContext.Provider
      value={{
        mentorDetails,
        getMentorDetails,
        createMentorProfile,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};
