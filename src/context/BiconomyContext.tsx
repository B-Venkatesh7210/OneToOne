import React, {
  useCallback,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { BigNumber, ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { Magic } from "magic-sdk";
import { contractABI } from "../abi/contractABI";
import { tokenContractABI } from "../abi/tokenContractABI";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { useRouter } from "next/router";
import {
  IMentorDetails,
  IFormData,
  IMentorsData,
  ISessionData,
} from "@/utils/types";
import { NFTStorage, File, Blob } from "nft.storage";
import { nftContractABI } from "../abi/nftContractABI";
import axios from "axios";

export const BiconomyContext = createContext<{
  address: string | null;
  smartAccount: BiconomySmartAccountV2 | null;
  provider: any;
  contract: any;
  nftContract: any;
  contractAddress: string | null;
  biconomyPaymaster: IHybridPaymaster<SponsorUserOperationDto> | null;
  paymasterServiceData: SponsorUserOperationDto | null;
  connect: () => Promise<void>;
  getContractDetails: () => Promise<void>;
  changeNumber: () => Promise<void>;
  mentorDetails: IMentorDetails | null;
  isMentor: boolean;
  allMentorsData: IMentorsData[];
  approvedSessions: ISessionData[];
  rejectedSessions: ISessionData[];
  pendingSessions: ISessionData[];
  roomId: string | null;
  globalCamStream: any;
  setGlobalCamStream: React.Dispatch<React.SetStateAction<any>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  createMentorProfile: (
    data: IFormData,
    profilePicture: File | null,
    profilePictureName: string | null,
    metadata: string | null
  ) => Promise<void>;
  getMentorDetails: (_address: string, _contract: any) => Promise<void>;
  getAllMentors: (
    _address: string,
    _contract: any,
    _nftContract: any
  ) => Promise<void>;
  requestSession: (
    data: IMentorsData,
    fromTimestamp: number,
    name: string,
    description: string
  ) => Promise<void>;
  mintNft: (data: IMentorsData) => Promise<void>;
  getMentorSessions: (mentorId: number) => Promise<void>;
  approveSession: (mentorId: number, sessionId: number) => Promise<void>;
  rejectSession: (mentorId: number, sessionId: number) => Promise<void>;
}>({
  address: null,
  smartAccount: null,
  provider: null,
  contract: null,
  nftContract: null,
  contractAddress: null,
  biconomyPaymaster: null,
  paymasterServiceData: null,
  connect: async () => {},
  getContractDetails: async () => {},
  changeNumber: async () => {},
  mentorDetails: null,
  isMentor: false,
  allMentorsData: [],
  approvedSessions: [],
  rejectedSessions: [],
  pendingSessions: [],
  roomId: null,
  globalCamStream: null,
  setGlobalCamStream: () => {},
  setRoomId: () => {},
  createMentorProfile: async () => {},
  getMentorDetails: async () => {},
  getAllMentors: async () => {},
  requestSession: async () => {},
  mintNft: async () => {},
  getMentorSessions: async () => {},
  approveSession: async () => {},
  rejectSession: async () => {},
});

export const useBiconomyContext = () => React.useContext(BiconomyContext);

export const BiconomyProvider = ({ children }: any) => {
  const [address, setAddress] = useState<string | null>(null);
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [biconomyPaymaster, setBiconomyPaymaster] =
    useState<IHybridPaymaster<SponsorUserOperationDto> | null>(null);
  const [paymasterServiceData, setPaymasterServiceData] =
    useState<SponsorUserOperationDto | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [isMentor, setIsMentor] = useState(false);
  const [mentorDetails, setMentorDetails] = useState<IMentorDetails | null>(
    null
  );
  const [nftContract, setNftContract] = useState<any>(null);
  const [tokenContract, setTokenContract] = useState<any>(null);
  const [tokenContractAddress, setTokenContractAddress] = useState<
    string | null
  >(null);
  const [allMentorsData, setAllMentorsData] = useState<IMentorsData[]>([]);
  const [approvedSessions, setApprovedSessions] = useState<ISessionData[]>([]);
  const [rejectedSessions, setRejectedSessions] = useState<ISessionData[]>([]);
  const [pendingSessions, setPendingSessions] = useState<ISessionData[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [globalCamStream, setGlobalCamStream] = useState<any>(null);

  const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY as string,
  });

  let magic: any;
  const router = useRouter();

  const bundler: IBundler = new Bundler({
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: ChainId.POLYGON_MUMBAI, // or any supported chain of your choice
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/80001/dmhR4bRKM.5d45f18d-49f7-40b3-b882-814832c63569",
  });

  const connect = useCallback(async () => {
    try {
      await magic.wallet.connectWithUI();
      const web3Provider = new ethers.providers.Web3Provider(
        magic.rpcProvider as any,
        "any"
      );

      const module2 = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module2,
        activeValidationModule: module2,
      });

      const smartAccountAddress =
        await biconomySmartAccount.getAccountAddress();
      const biconomyPaymaster =
        biconomySmartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      setBiconomyPaymaster(biconomyPaymaster);
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };
      setPaymasterServiceData(paymasterServiceData);
      //0x9D325543fec51Fa17B959Ed5cfdABde780521eF5
      setSmartAccount(biconomySmartAccount);
      setAddress(smartAccountAddress);
      // localStorage.setItem("address", address);
      // localStorage.setItem(
      //   "smartAccount",
      //   JSON.stringify(biconomySmartAccount)
      // );

      const contractAddress2 = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      //@ts-ignore
      setContractAddress(contractAddress2);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract2 = new ethers.Contract(
        //@ts-ignore
        contractAddress2,
        contractABI,
        provider
      );
      console.log(contract2);
      setContract(contract2);
      const nftContractAddress2 = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
      const nftContract2 = new ethers.Contract(
        //@ts-ignore
        nftContractAddress2,
        nftContractABI,
        provider
      );
      console.log(nftContract2);
      setNftContract(nftContract2);
      const tokenContractAddress2 =
        process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
      //@ts-ignore
      setTokenContractAddress(tokenContractAddress2);
      const tokenContract2 = new ethers.Contract(
        //@ts-ignore
        tokenContractAddress2,
        tokenContractABI,
        provider
      );
      console.log(tokenContract2);
      setTokenContract(tokenContract2);

      await getAllMentors(smartAccountAddress, contract2, nftContract2);
      await getMentorDetails(smartAccountAddress, contract2);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getContractDetails = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/polygon_mumbai"
    );
    // localStorage.setItem("provider", JSON.stringify(provider));
    setProvider(provider);
    const contractAddress2 = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    //@ts-ignore
    setContractAddress(contractAddress2);
    const contract2 = new ethers.Contract(
      //@ts-ignore
      contractAddress2,
      contractABI,
      provider
    );
    console.log(contract2);
    setContract(contract2);
    const nftContractAddress2 = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    const nftContract2 = new ethers.Contract(
      //@ts-ignore
      nftContractAddress2,
      nftContractABI,
      provider
    );
    console.log(nftContract2);
    setNftContract(nftContract2);
    const tokenContractAddress2 =
      process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
    //@ts-ignore
    setTokenContractAddress(tokenContractAddress2);
    const tokenContract2 = new ethers.Contract(
      //@ts-ignore
      tokenContractAddress2,
      tokenContractABI,
      provider
    );
    console.log(tokenContract2);
    setTokenContract(tokenContract2);
  };

  useEffect(() => {
    //@ts-ignore
    magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
      network: {
        rpcUrl: "https://rpc.ankr.com/polygon_mumbai",
        chainId: 80001,
      },
    });

    getContractDetails();
  }, []);

  const createMentorProfile = async (
    formData: IFormData,
    profilePicture: File | null,
    profilePictureName: string | null,
    metadata: string | null
  ) => {
    console.log("Hey Wassup");
    try {
      //TODO: Add metadata

      // const sessionPriceBig = ethers.utils.parseEther(
      //   formData.sessionPrice.toString()
      // );
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
        // sessionPriceBig,
        formData.totalNftsupply,
        metadata
      );
      const minTx = await contract.populateTransaction.createMentorProfile(
        formData.name,
        profilePictureCid,
        formData.description,
        formData.skills,
        // sessionPriceBig,
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
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  //@ts-ignore
  const getMentorDetails = async (_address, _contract) => {
    console.log("Hey I am outside");
    if (_contract) {
      console.log("Hey I am inside", _address, _contract);
      const mentorData = await _contract.mentorProfiles(_address);
      console.log("Mentor Data", mentorData);
      if (mentorData.name !== "") {
        setIsMentor(true);
      }
      setMentorDetails({
        id: mentorData.id,
        mentor: mentorData.mentor,
        name: mentorData.name,
        profilePicture: mentorData.profilePicture,
        description: mentorData.description,
        skills: mentorData.skills,
        // sessionPrice: mentorData.sessionPrice,
        totalNftSupply: mentorData.totalNftSupply,
      });
    }
  };

  //@ts-ignore
  const getAllMentors = async (_address, _contract, _nftContract) => {
    const allMentors = await _contract.getAllMentors();
    console.log("All Mentors", allMentors);
    let allMentorsData2: IMentorsData[] = [];
    for (let i = 0; i < allMentors.length; i++) {
      const mentor = allMentors[i];
      const hasNFT = await _nftContract.balanceOf(_address, mentor.id);
      const isSubscriber = hasNFT > 0;
      const element = {
        id: mentor.id,
        mentor: mentor.mentor,
        name: mentor.name,
        profilePicture: mentor.profilePicture,
        description: mentor.description,
        skills: mentor.skills,
        // sessionPrice: mentor.sessionPrice,
        isSubscriber: isSubscriber,
      }; // Assuming 1 is the count of NFT that signifies subscription

      allMentorsData2.push(element);
    }
    console.log("All Mentors Data", allMentorsData2);
    setAllMentorsData(allMentorsData2);
  };

  const changeNumber = async () => {
    try {
      const minTx = await contract.populateTransaction.changeNumber(22);
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
      console.log("userOpHash", userOpResponse);
      //@ts-ignore
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (err: any) {
      console.error(err);
      console.log(err);
    }
  };

  const createRoom = async () => {
    try {
      const response = await axios.post("/api/create-room");
      console.log(response);
      const data = response.data.data.roomId;
      console.log(data);
      return data; // do something with the response data
    } catch (error) {
      console.error(error);
    }
  };

  const requestSession = async (
    data: IMentorsData,
    fromTimestamp: number,
    name: string,
    description: string
  ) => {
    try {
      const roomId: string = await createRoom();
      console.log("Room Id", roomId);

      // const bigSessionPrice = ethers.utils.parseEther(sessionPrice.toString());
      // console.log(bigSessionPrice.toString());

      // console.log(
      //   "Token Contract Details",
      //   tokenContractAddress,
      //   tokenContract
      // );

      // const minTx1 = await tokenContract.populateTransaction.approve(
      //   tokenContractAddress,
      //   bigSessionPrice
      // );
      // console.log("Mint Tx Data 1", minTx1.data);
      // const tx1 = {
      //   to: tokenContractAddress,
      //   data: minTx1.data,
      // };

      const minTx2 = await contract.populateTransaction.requestSession(
        data.mentor,
        roomId,
        fromTimestamp,
        fromTimestamp,
        name,
        description
      );
      console.log("Mint Tx Data 2", minTx2.data);
      const tx2 = {
        to: contractAddress,
        data: minTx2.data,
      };
      //@ts-ignore
      let userOp2 = await smartAccount?.buildUserOp([tx2]);
      console.log("UserOp 2", { userOp2 });

      const paymasterAndDataResponse2 =
        await biconomyPaymaster?.getPaymasterAndData(
          //@ts-ignore
          userOp2,
          paymasterServiceData
        );

      //@ts-ignore
      userOp2.paymasterAndData = paymasterAndDataResponse2.paymasterAndData;
      //@ts-ignore
      const userOpResponse2 = await smartAccount?.sendUserOp(userOp2);
      console.log("userOpHash 2", userOpResponse2);
      //@ts-ignore
      const { receipt: receipt2 } = await userOpResponse2.wait(1);
      console.log("txHash 2", receipt2.transactionHash);

      // router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const mintNft = async (data: IMentorsData) => {
    try {
      const minTx = await contract.populateTransaction.mintNFT(data.id);
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
      console.log("userOpHash", userOpResponse);
      //@ts-ignore
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);

      // router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const getMentorSessions = async (mentorId: number) => {
    const allMentorSessions2 = await contract.getMentorSessions(mentorId);
    console.log("All Mentor Sessions", allMentorSessions2);
    const approvedSessions = allMentorSessions2.filter(
      (session: any) => session.status === 0
    );
    const rejectedSessions = allMentorSessions2.filter(
      (session: any) => session.status === 1
    );
    const pendingSessions = allMentorSessions2.filter(
      (session: any) => session.status === 2
    );

    setApprovedSessions(approvedSessions);
    setRejectedSessions(rejectedSessions);
    setPendingSessions(pendingSessions);
  };

  const approveSession = async (mentorId: number, sessionId: number) => {
    console.log(mentorId, sessionId);
    const minTx = await contract.populateTransaction.approveSession(
      mentorId.toString(),
      sessionId.toString()
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
    console.log("userOpHash", userOpResponse);
    //@ts-ignore
    const { receipt } = await userOpResponse.wait(1);
    console.log("txHash", receipt.transactionHash);
  };

  const rejectSession = async (mentorId: number, sessionId: number) => {
    console.log(mentorId, sessionId);
    const minTx = await contract.populateTransaction.rejectSession(
      mentorId,
      sessionId
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
    console.log("userOpHash", userOpResponse);
    //@ts-ignore
    const { receipt } = await userOpResponse.wait(1);
    console.log("txHash", receipt.transactionHash);
  };

  return (
    <BiconomyContext.Provider
      value={{
        address,
        smartAccount,
        provider,
        contract,
        nftContract,
        contractAddress,
        biconomyPaymaster,
        paymasterServiceData,
        connect,
        getContractDetails,
        changeNumber,
        mentorDetails,
        isMentor,
        allMentorsData,
        approvedSessions,
        rejectedSessions,
        pendingSessions,
        roomId,
        globalCamStream,
        setGlobalCamStream,
        setRoomId,
        getMentorDetails,
        createMentorProfile,
        getAllMentors,
        requestSession,
        mintNft,
        getMentorSessions,
        approveSession,
        rejectSession,
      }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};
