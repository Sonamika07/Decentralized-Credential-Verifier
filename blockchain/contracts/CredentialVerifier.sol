// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialVerifier is Ownable {

    struct Credential {
        address issuer;
        string studentName;
        string course;
        string institution;
        string issueDate;
        string ipfsCID;
        bool revoked;
        bool exists;
    }

    mapping(string => Credential) private credentials;

    mapping(address => bool) public authorizedIssuers;

    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    event CredentialIssued(
        string indexed credentialId,
        string studentName,
        string course,
        string institution,
        string ipfsCID
    );

    event CredentialRevoked(
        string indexed credentialId
    );

    constructor() Ownable(msg.sender) {
        authorizedIssuers[msg.sender] = true;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender],
            "Not authorized issuer"
        );
        _;
    }

    function authorizeIssuer(
        address issuer
    ) public onlyOwner {
        require(
            issuer != address(0),
            "Invalid issuer address"
        );

        authorizedIssuers[issuer] = true;

        emit IssuerAuthorized(issuer);
    }

    function revokeIssuer(
        address issuer
    ) public onlyOwner {
        authorizedIssuers[issuer] = false;

        emit IssuerRevoked(issuer);
    }

    function issueCredential(
        string memory credentialId,
        string memory studentName,
        string memory course,
        string memory institution,
        string memory issueDate,
        string memory ipfsCID
    ) public onlyAuthorizedIssuer {

        require(
            !credentials[credentialId].exists,
            "Credential already exists"
        );

        credentials[credentialId] = Credential({
            issuer: msg.sender,
            studentName: studentName,
            course: course,
            institution: institution,
            issueDate: issueDate,
            ipfsCID: ipfsCID,
            revoked: false,
            exists: true
        });

        emit CredentialIssued(
            credentialId,
            studentName,
            course,
            institution,
            ipfsCID
        );
    }

    function verifyCredential(
        string memory credentialId
    )
        public
        view
        returns (
            string memory studentName,
            string memory course,
            string memory institution,
            string memory issueDate,
            string memory ipfsCID,
            bool revoked,
            bool exists
        )
    {
        Credential memory credential =
            credentials[credentialId];

        return (
            credential.studentName,
            credential.course,
            credential.institution,
            credential.issueDate,
            credential.ipfsCID,
            credential.revoked,
            credential.exists
        );
    }

    function revokeCredential(
        string memory credentialId
    ) public {

        require(
            credentials[credentialId].exists,
            "Credential does not exist"
        );

        require(
            msg.sender == owner() ||
            (
                msg.sender == credentials[credentialId].issuer &&
                authorizedIssuers[msg.sender]
            ),
            "Not authorized to revoke"
        );

        require(
            !credentials[credentialId].revoked,
            "Credential already revoked"
        );

        credentials[credentialId].revoked = true;

        emit CredentialRevoked(credentialId);
    }
}