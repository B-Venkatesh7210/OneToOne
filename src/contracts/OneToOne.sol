// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OTONFT.sol";
import "./OTOToken.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Mumbai = 0xeCCE60A30ae55Afe2559039d1B4d12EeD9E0F9AE
//Mumbai NFT = 0xd9486EC845c26F1f1c4AF4675c47B3ea09aac508
//Mumbai Token = 0xCaE82a239eB417f635d449430A20AC1039Dd586E

//Remix = 0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005
//Remix NFT = 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99
//Remix Token = 0xd9145CCE52D386f254917e481eB44e9943F39138

contract OneToOne {

    using Counters for Counters.Counter;
    Counters.Counter public mentorId;
    using Counters for Counters.Counter;
    Counters.Counter public sessionId;

    uint256 public number;


    OTONFT public otoNFT;
    // OTO_Token public otoToken;

    struct MentorProfile {
        uint256 id;
        address mentor;
        string name;
        string profilePicture;
        string description;
        string skills;
        uint256 totalNftSupply;
    }

    enum Status {
        Approved,
        Rejected,
        Pending
    }

    struct Session {
        uint256 sessionId;
        string roomId;
        address from;
        address to;
        uint256 toId;
        uint256 fromTimestamp;
        uint256 toTimestamp;
        string name;
        string description;
        Status status; 
    }

    mapping(address => MentorProfile) public mentorProfiles;
    mapping(uint256 => address) public mentorIdToAddress;
    mapping(uint256 => Session[]) public mentorIdToSessions;

    //TODO add OTO token
    constructor(OTONFT _otoNFT) {
        otoNFT = _otoNFT;
        // otoToken = _otoToken;
        otoNFT.initializeOneToOneContract(address(this));
    }

    function createMentorProfile(
        string memory _name,
        string memory _profilePicture,
        string memory _description,
        string memory _skills,
        uint256 _totalNftSupply,
        string memory _metadata
    ) external {
        uint256 currMentorId = mentorId.current();
        mentorIdToAddress[currMentorId] = msg.sender;
        otoNFT.updateTotalNftSupply(currMentorId, _totalNftSupply);
        otoNFT.addMetadata(currMentorId, _metadata);
        mentorProfiles[msg.sender] = MentorProfile({
            id: currMentorId,
            mentor: msg.sender,
            name: _name,
            profilePicture: _profilePicture,
            description: _description,
            skills: _skills,
            totalNftSupply: _totalNftSupply
        });
        mentorId.increment();
    }

    function requestSession(address mentor, string memory roomId, uint256 fromTimestamp, uint256 toTimestamp, string memory name, string memory description) payable external {
        MentorProfile storage currMentor = mentorProfiles[mentor];
            uint256 currSessionId = sessionId.current();
            Session memory newSession = Session({
            sessionId: currSessionId,
            roomId: roomId,
            from: msg.sender,
            to: mentor,
            toId: currMentor.id,
            fromTimestamp: fromTimestamp,
            toTimestamp: toTimestamp,
            name: name,
            description: description,
            status: Status.Pending
        });
         mentorIdToSessions[currMentor.id].push(newSession);
         sessionId.increment();
        
    }

    function approveSession(uint256 _mentorId, uint256 _sessionId) external {
        require(
            mentorProfiles[mentorIdToAddress[_mentorId]].mentor == msg.sender,
            "Caller not authorized"
        );
        
        Session[] storage sessions = mentorIdToSessions[_mentorId];
        bool sessionFound = false;
        for (uint256 i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionId == _sessionId) {
                require(sessions[i].fromTimestamp >= block.timestamp, "Event is in the past");
                sessions[i].status = Status.Approved;
                sessionFound = true;
                break;
            }
        }

        require(sessionFound, "Session not found");
    }

    function rejectSession(uint256 _mentorId, uint256 _sessionId) external {
        require(
            mentorProfiles[mentorIdToAddress[_mentorId]].mentor == msg.sender,
            "Caller not authorized"
        );

        Session[] storage sessions = mentorIdToSessions[_mentorId];
        bool sessionFound = false;
        for (uint256 i = 0; i < sessions.length; i++) {
            if (sessions[i].sessionId == _sessionId) {
                require(sessions[i].fromTimestamp >= block.timestamp, "Event is in the past");
                sessions[i].status = Status.Rejected;
                sessionFound = true;
                break;
            }
        }

        // Optional: revert if session not found
        require(sessionFound, "Session not found");
    }

    function changeNumber(uint256 _number) public {
        number = _number;
    }

  function getAllMentors() public view returns (MentorProfile[] memory) {
    uint256 currentCount = mentorId.current();
    MentorProfile[] memory profiles = new MentorProfile[](currentCount);

    for (uint256 i = 0; i < currentCount; i++) {
        address mentorAddress = mentorIdToAddress[i];
        profiles[i] = mentorProfiles[mentorAddress];
    }

    return profiles;
}

function mintNFT(uint256 _mentorId) external {
        address mentorAddress = mentorIdToAddress[_mentorId];
        MentorProfile storage currMentor = mentorProfiles[mentorAddress];
        require(currMentor.mentor != address(0), "Mentor does not exist");
        require(otoNFT.balanceOf(msg.sender, _mentorId) == 0, "You already own an NFT");
        otoNFT.mint(msg.sender, _mentorId);
    }

    function getMentorSessions(uint256 _mentorId) external view returns (Session[] memory) {
        return mentorIdToSessions[_mentorId];
    }




}