// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialVerifier is Ownable {
    struct Credential {
        string studentName;
        string course;
        string institution;
        string issueDate;
        string ipfsCID;
        bool revoked;
        bool exists;
    }

    mapping(string => Credential) private credentials;

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

    constructor() Ownable(msg.sender) {}

    function issueCredential(
        string memory credentialId,
        string memory studentName,
        string memory course,
        string memory institution,
        string memory issueDate,
        string memory ipfsCID
    ) public onlyOwner {
        require(!credentials[credentialId].exists, "Credential already exists");

        credentials[credentialId] = Credential({
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
        Credential memory credential = credentials[credentialId];

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
    ) public onlyOwner {
        require(credentials[credentialId].exists, "Credential does not exist");
        require(!credentials[credentialId].revoked, "Credential already revoked");

        credentials[credentialId].revoked = true;

        emit CredentialRevoked(credentialId);
    }
}