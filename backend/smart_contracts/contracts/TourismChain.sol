// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TourismChain is Ownable {

    // --- DATA STRUCTURES ---

    struct Booking {
        string orderId;
        uint256 userId;
        uint256 guideId;
        uint256 amount;
        string currency;
        string paymentRef;
        uint256 timestamp;
    }

    struct GuideProfile {
        bool isVerified;
        string metadataURI;
    }

    struct Certificate {
        uint256 id;
        string itemName;
        address owner;
        address issuer;
        uint256 issueDate;
        string metadataURI;
    }

    // --- STATE ---

    uint256 private _nextCertId;

    // Mappings
    mapping(uint256 => GuideProfile) public guides;
    mapping(string => Booking) public bookings;
    mapping(uint256 => Certificate) public certificates;

    // Events
    event GuideVerified(uint256 indexed guideId, bool status);
    event BookingCreated(string indexed orderId, uint256 indexed userId, uint256 amount);
    event CertificateIssued(uint256 indexed certId, address indexed owner, string itemName);

    constructor() Ownable(msg.sender) {
        _nextCertId = 1; // Start IDs at 1
    }

    // --- ADMIN ACTIONS ---

    function verifyGuide(uint256 _guideId, bool _status, string memory _uri) external onlyOwner {
        guides[_guideId] = GuideProfile({
            isVerified: _status,
            metadataURI: _uri
        });
        emit GuideVerified(_guideId, _status);
    }

    function issueCertificate(address _to, string memory _itemName, string memory _uri) external onlyOwner {
        uint256 currentId = _nextCertId++;

        certificates[currentId] = Certificate({
            id: currentId,
            itemName: _itemName,
            owner: _to,
            issuer: msg.sender,
            issueDate: block.timestamp,
            metadataURI: _uri
        });

        emit CertificateIssued(currentId, _to, _itemName);
    }

    // --- CORE LOGIC ---

    function createBooking(
        string memory _orderId,
        uint256 _userId,
        uint256 _guideId,
        uint256 _amount,
        string memory _currency,
        string memory _paymentRef
    ) external {
        bookings[_orderId] = Booking({
            orderId: _orderId,
            userId: _userId,
            guideId: _guideId,
            amount: _amount,
            currency: _currency,
            paymentRef: _paymentRef,
            timestamp: block.timestamp
        });

        emit BookingCreated(_orderId, _userId, _amount);
    }

    // --- READ VIEWS ---

    function getGuide(uint256 _guideId) external view returns (GuideProfile memory) {
        return guides[_guideId];
    }

    function getBooking(string memory _orderId) external view returns (Booking memory) {
        return bookings[_orderId];
    }

    function getCertificate(uint256 _certId) external view returns (Certificate memory) {
        return certificates[_certId];
    }
}