export const contractABI = [
  {
    inputs: [
      {
        internalType: "contract OTONFT",
        name: "_otoNFT",
        type: "address",
      },
      {
        internalType: "contract OTO_Token",
        name: "_otoToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_mentorId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
    ],
    name: "approveSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_number",
        type: "uint256",
      },
    ],
    name: "changeNumber",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_profilePicture",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_skills",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_sessionPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalNftSupply",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
    ],
    name: "createMentorProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMentors",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "mentor",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "profilePicture",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "skills",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalNftSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sessionPrice",
            type: "uint256",
          },
        ],
        internalType: "struct OneToOne.MentorProfile[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mentorId",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mentorIdToAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mentorIdToSessions",
    outputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sessionPrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "roomId",
        type: "string",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "toId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fromTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "toTimestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "enum OneToOne.Status",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mentorProfiles",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "profilePicture",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "skills",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "totalNftSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sessionPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_mentorId",
        type: "uint256",
      },
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "number",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "otoNFT",
    outputs: [
      {
        internalType: "contract OTONFT",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "otoToken",
    outputs: [
      {
        internalType: "contract OTO_Token",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_mentorId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_sessionId",
        type: "uint256",
      },
    ],
    name: "rejectSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "mentor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sessionPrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "roomId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "fromTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "toTimestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "requestSession",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "sessionId",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "sessionIdToBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
