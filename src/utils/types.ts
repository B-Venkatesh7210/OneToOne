import { BigNumber } from "ethers";

export interface IFormData {
  name: string;
  description: string;
  skills: string;
  totalNftsupply: number;
  // sessionPrice: number;
}

export interface IMentorDetails {
  id: number;
  mentor: string;
  name: string;
  profilePicture: string;
  description: string;
  skills: string;
  // sessionPrice: number;
  totalNftSupply: number;
}

export interface IMentorsData {
  id: number;
  mentor: string;
  name: string;
  profilePicture: string;
  description: string;
  skills: string;
  // sessionPrice: number;
  isSubscriber: boolean;
}

export interface ISessionData {
  sessionId: BigNumber,
  roomId: string,
  from: string,
  to: string,
  toId: BigNumber,
  fromTimestamp: BigNumber,
  toTimestamp: BigNumber,
  name: string,
  description: string,
  status: string
}