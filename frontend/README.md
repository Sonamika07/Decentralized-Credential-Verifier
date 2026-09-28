CrediVerify — Decentralized Credential Verifier

CrediVerify is a blockchain-based academic credential verification application that allows authorized issuers to issue digital credentials, stores certificate files on IPFS, and lets users verify or revoke credentials through a public EVM testnet.

Live Blockchain Deployment

Network: Ethereum Sepolia Testnet

Smart Contract: 0x8225ccc6C9403851A1D562F6a6b8F3dB1b514E7F

Certificate storage: IPFS via Pinata

Demo Credential ID: CERT-004

This project is a portfolio demonstration. The included certificate is a demo credential and is not an official academic certificate.

Features

Connect wallet using MetaMask

Authorized issuer can issue credentials

Store certificate files on IPFS

Store the IPFS CID with credential data on the blockchain

Verify credentials using a Credential ID

Open the verified certificate from IPFS

Revoke credentials

Show revoked/valid credential status

Smart-contract events for issuance and revocation

Public testnet deployment on Ethereum Sepolia

Architecture

User
  |
  v
React + Vite Frontend
  |
  v
MetaMask
  |
  v
ethers.js
  |
  v
CredentialVerifier Smart Contract
  |
  +---- Credential metadata + IPFS CID ----> Sepolia Blockchain
  |
  +---- Certificate file <------------------- IPFS / Pinata

Technology Stack

Frontend

React

Vite

JavaScript

ethers.js

CSS

Blockchain

Solidity

Hardhat

Ethereum Sepolia Testnet

OpenZeppelin Contracts

Storage

IPFS

Pinata

Wallet

MetaMask

Development Tools

Node.js

npm

Git

GitHub

VS Code

Smart Contract

The CredentialVerifier contract supports:

Issue Credential

Authorized issuers can create a credential using:

Credential ID

Student name

Course

Institution

Issue date

IPFS CID

Verify Credential

Anyone can verify a credential using its Credential ID and view:

Student name

Course

Institution

Issue date

IPFS CID

Revocation status

Existence status

Revoke Credential

The contract allows the owner or the authorized issuer of a credential to revoke it.

Issuer Authorization

The contract owner can authorize or revoke issuer addresses.

Project Structure

Decentralized-Credential-Verifier/
│
├── blockchain/
│   ├── contracts/
│   │   └── CredentialVerifier.sol
│   ├── scripts/
│   │   ├── deploy.ts
│   │   └── authorizeIssuer.ts
│   ├── test/
│   ├── hardhat.config.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── contract/
│   │   │   └── CredentialVerifier.json
│   │   └── App.jsx
│   └── package.json
│
├── ipfs/
│   ├── upload.js
│   └── package.json
│
└── README.md

Local Setup

1. Clone the repository

git clone https://github.com/Sonamika07/Decentralized-Credential-Verifier.git
cd Decentralized-Credential-Verifier

2. Install blockchain dependencies

cd blockchain
npm install

3. Compile the smart contract

npx hardhat compile

4. Run blockchain tests

npx hardhat test

5. Run the frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL shown by Vite and connect MetaMask.

Sepolia Deployment

The smart contract is deployed on Ethereum Sepolia.

Contract Address:
0x8225ccc6C9403851A1D562F6a6b8F3dB1b514E7F

For deployment credentials, keep RPC URLs and private keys in a local .env file. Never commit secrets to GitHub.

Example:

SEPOLIA_RPC_URL=YOUR_RPC_URL
PRIVATE_KEY=YOUR_PRIVATE_KEY

Demo Flow

The demonstrated credential lifecycle is:

Issue Credential
       ↓
Verify Credential
       ↓
Open Certificate from IPFS
       ↓
Revoke Credential
       ↓
Verify Again
       ↓
Credential shows Revoked

Security Notes

Private keys are kept outside the repository.

.env files are ignored by Git.

Smart-contract authorization restricts credential issuance.

Credential IDs cannot be duplicated.

Revocation status is stored on-chain.

This project uses a testnet and demo certificate for portfolio purposes.

Screenshots

Screenshots of the application can be added here later.

Suggested screenshots:

Home / Connect Wallet

Issue Credential

Successful Credential Verification

Certificate opened from IPFS

Revoked Credential

MetaMask connected to Sepolia

Future Improvements

Deploy to an EVM mainnet when appropriate

Add QR-code based credential verification

Add issuer dashboard

Add credential search/history

Add stronger credential schema validation

Add automated contract verification

Improve UI/UX and accessibility

Add production-grade backend/indexing if required

Author

Sonamika Anand Samrat

B.Tech CSE — Roorkee Institute of Technology

GitHub: https://github.com/Sonamika07
