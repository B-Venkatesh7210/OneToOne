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
