import React, { useCallback, createContext, useState, useEffect } from "react";
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
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { Magic } from "magic-sdk";
import { contractABI } from "../abi/contractABI"
import { 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'

export const BiconomyContext = createContext<{
  address: string | null;
  smartAccount: BiconomySmartAccountV2 | null;
  provider: any;
  connect: () => Promise<void>;
  changeNumber: () => Promise<void>;
}>({
  address: null,
  smartAccount: null,
  provider: null,
  connect: async () => {},
  changeNumber: async () => {},
});

export const useBiconomyContext = () => React.useContext(BiconomyContext);

export const BiconomyProvider = ({ children }: any) => {
  const [address, setAddress] = useState<string | null>(null);
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<any>(null);
  let magic: any;

  const bundler: IBundler = new Bundler({
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
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

      const address = await biconomySmartAccount.getAccountAddress();
      console.log(address);
      //0x9D325543fec51Fa17B959Ed5cfdABde780521eF5
      setSmartAccount(biconomySmartAccount);
      setAddress(address);
      localStorage.setItem("address", address);
      localStorage.setItem(
        "smartAccount",
        JSON.stringify(biconomySmartAccount)
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    //@ts-ignore
    magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
      network: {
        rpcUrl: "https://rpc.ankr.com/polygon_mumbai",
        chainId: 80001,
      },
    });

    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/polygon_mumbai"
    );
    localStorage.setItem("provider", JSON.stringify(provider));
    setProvider(provider);
    const savedAddress = localStorage.getItem("address");
    const savedSmartAccount = JSON.parse(
      localStorage.getItem("smartAccount") || "{}"
    );

    if (savedAddress) {
      setAddress(savedAddress);
    }

    if (savedSmartAccount) {
      setSmartAccount(savedSmartAccount);
    }
  }, []);

  const changeNumber = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(
      //@ts-ignore
      contractAddress,
      contractABI,
      provider,
    )
    try {
      const minTx = await contract.populateTransaction.changeNumber("17");
      console.log(minTx.data);
      const tx1 = {
        to: contractAddress,
        data: minTx.data,
      };
      //@ts-ignore
      let userOp = await smartAccount?.buildUserOp([tx1]);
      console.log({ userOp })
      // const biconomyPaymaster =
      //   smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      // let paymasterServiceData: SponsorUserOperationDto = {
      //   mode: PaymasterMode.SPONSORED,
      //   smartAccountInfo: {
      //     name: 'BICONOMY',
      //     version: '2.0.0'
      //   },
      // };
      // const paymasterAndDataResponse =
      //   await biconomyPaymaster.getPaymasterAndData(
      //     //@ts-ignore
      //     userOp,
      //     paymasterServiceData
      //   );
      
      // //@ts-ignore
      // userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      // //@ts-ignore
      // const userOpResponse = await smartAccount?.sendUserOp(userOp);
      // console.log("userOpHash", userOpResponse);
      // //@ts-ignore
      // const { receipt } = await userOpResponse.wait(1);
      // console.log("txHash", receipt.transactionHash);
    } catch (err: any) {
      console.error(err);
      console.log(err)
    }
  }

  return (
    <BiconomyContext.Provider value={{ address, smartAccount, provider, connect, changeNumber }}>
      {children}
    </BiconomyContext.Provider>
  );
};
