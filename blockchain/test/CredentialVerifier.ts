import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CredentialVerifier", function () {
  async function deployContract() {
    const [owner, user] = await ethers.getSigners();

    const CredentialVerifier = await ethers.getContractFactory(
      "CredentialVerifier"
    );

    const credentialVerifier = await CredentialVerifier.deploy() as any;

    await credentialVerifier.waitForDeployment();

    return { credentialVerifier, owner, user };
  }

  // Test 1: Credential successfully issue hona chahiye
  it("should issue a credential successfully", async function () {
    const { credentialVerifier } = await deployContract();

    await credentialVerifier.issueCredential(
      "CERT-001",
      "Sonamika Anand",
      "B.Tech CSE",
      "Roorkee Institute of Technology",
      "2026-09-25",
      "QmExampleCID123"
    );

    const credential =
      await credentialVerifier.verifyCredential("CERT-001");

    expect(credential[0]).to.equal("Sonamika Anand");
    expect(credential[1]).to.equal("B.Tech CSE");
    expect(credential[2]).to.equal(
      "Roorkee Institute of Technology"
    );
    expect(credential[4]).to.equal("QmExampleCID123");
    expect(credential[5]).to.equal(false);
    expect(credential[6]).to.equal(true);
  });

  // Test 2: Duplicate credential ID reject hona chahiye
  it("should reject duplicate credential IDs", async function () {
    const { credentialVerifier } = await deployContract();

    await credentialVerifier.issueCredential(
      "CERT-001",
      "Sonamika Anand",
      "B.Tech CSE",
      "Roorkee Institute of Technology",
      "2026-09-25",
      "QmExampleCID123"
    );

    let reverted = false;

    try {
      await credentialVerifier.issueCredential(
        "CERT-001",
        "Another Student",
        "B.Tech",
        "Another Institute",
        "2026-09-25",
        "QmAnotherCID"
      );
    } catch (error) {
      reverted = true;
    }

    expect(reverted).to.equal(true);
  });

  // Test 3: Non-owner credential issue nahi kar sakta
  it("should prevent a non-owner from issuing credentials", async function () {
    const { credentialVerifier, user } = await deployContract();

    let reverted = false;

    try {
      await credentialVerifier
        .connect(user)
        .issueCredential(
          "CERT-002",
          "Test Student",
          "B.Tech CSE",
          "Test Institute",
          "2026-09-25",
          "QmTestCID"
        );
    } catch (error) {
      reverted = true;
    }

    expect(reverted).to.equal(true);
  });

  // Test 4: Credential revoke hona chahiye
  it("should revoke a credential", async function () {
    const { credentialVerifier } = await deployContract();

    await credentialVerifier.issueCredential(
      "CERT-003",
      "Sonamika Anand",
      "B.Tech CSE",
      "Roorkee Institute of Technology",
      "2026-09-25",
      "QmExampleCID789"
    );

    await credentialVerifier.revokeCredential("CERT-003");

    const credential =
      await credentialVerifier.verifyCredential("CERT-003");

    expect(credential[5]).to.equal(true);
  });

  // Test 5: Non-existent credential revoke nahi hona chahiye
  it("should reject revoking a non-existent credential", async function () {
    const { credentialVerifier } = await deployContract();

    let reverted = false;

    try {
      await credentialVerifier.revokeCredential("CERT-999");
    } catch (error) {
      reverted = true;
    }

    expect(reverted).to.equal(true);
  });
});