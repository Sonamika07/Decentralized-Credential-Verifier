import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("Connecting to CredentialVerifier...");

  const [owner] = await ethers.getSigners();

  const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const CredentialVerifier = await ethers.getContractFactory(
    "CredentialVerifier"
  );

  const credentialVerifier = CredentialVerifier.attach(
    contractAddress
  ) as any;

  console.log("Contract:", contractAddress);
  console.log("Owner:", owner.address);

  console.log("\n1. Issuing credential...");

  const issueTx = await credentialVerifier.issueCredential(
    "CERT-001",
    "Sonamika Anand",
    "B.Tech CSE",
    "Roorkee Institute of Technology",
    "2026-09-25",
    "QmExampleCID123"
  );

  await issueTx.wait();

  console.log("Credential issued successfully!");

  console.log("\n2. Verifying credential...");

  const credential =
    await credentialVerifier.verifyCredential("CERT-001");

  console.log("Student Name:", credential[0]);
  console.log("Course:", credential[1]);
  console.log("Institution:", credential[2]);
  console.log("Issue Date:", credential[3]);
  console.log("IPFS CID:", credential[4]);
  console.log("Revoked:", credential[5]);
  console.log("Exists:", credential[6]);

  console.log("\n3. Revoking credential...");

  const revokeTx =
    await credentialVerifier.revokeCredential("CERT-001");

  await revokeTx.wait();

  console.log("Credential revoked successfully!");

  console.log("\n4. Verifying after revocation...");

  const updatedCredential =
    await credentialVerifier.verifyCredential("CERT-001");

  console.log("Student Name:", updatedCredential[0]);
  console.log("Revoked:", updatedCredential[5]);
  console.log("Exists:", updatedCredential[6]);

  console.log("\nComplete flow finished!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});