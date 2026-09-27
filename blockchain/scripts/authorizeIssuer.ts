import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("Authorizing issuer...");

  const issuerAddress =
    "0xBd646E2df4C1833B1366c2B0720456773EFCF6a5";

  const contractAddress =
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const CredentialVerifier =
    await ethers.getContractFactory("CredentialVerifier");

  const credentialVerifier =
    CredentialVerifier.attach(contractAddress) as any;

  const transaction =
    await credentialVerifier.authorizeIssuer(issuerAddress);

  await transaction.wait();

  console.log("Issuer authorized successfully!");
  console.log("Issuer:", issuerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});