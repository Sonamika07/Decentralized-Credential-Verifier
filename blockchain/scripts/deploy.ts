import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("Deploying CredentialVerifier...");

  const CredentialVerifier = await ethers.getContractFactory(
    "CredentialVerifier"
  );

  const credentialVerifier = await CredentialVerifier.deploy();

  await credentialVerifier.waitForDeployment();

  const contractAddress = await credentialVerifier.getAddress();

  console.log("CredentialVerifier deployed successfully!");
  console.log("Contract Address:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});