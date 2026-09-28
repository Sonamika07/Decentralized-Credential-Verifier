import "./App.css";
import { ethers } from "ethers";
import contractData from "./contract/CredentialVerifier.json";

const contractAddress =
  "0x7Ae3B202490fDb30FbE2D977A4fB8D84592B979e";

const contractABI = contractData.abi;

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    console.log("Connected Wallet:", address);

    alert("Wallet connected successfully!");
  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
}

async function verifyCredential() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  const credentialId =
    document.getElementById("credentialId").value.trim();

  if (!credentialId) {
    alert("Please enter Credential ID");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const credential =
      await contract.verifyCredential(credentialId);

    const studentName = credential[0];
    const course = credential[1];
    const institution = credential[2];
    const issueDate = credential[3];
    const ipfsCID = credential[4];
    const revoked = credential[5];
    const exists = credential[6];

    console.log("Student Name:", studentName);
    console.log("Course:", course);
    console.log("Institution:", institution);
    console.log("Issue Date:", issueDate);
    console.log("IPFS CID:", ipfsCID);
    console.log("Revoked:", revoked);
    console.log("Exists:", exists);

    if (!exists) {
      alert("Credential not found!");
      return;
    }

    if (revoked) {
      alert(
        `Credential found, but it has been REVOKED.\n\nStudent: ${studentName}\nCourse: ${course}`
      );
      return;
    }

    // IPFS certificate URL
    const certificateURL =
      `https://ipfs.io/ipfs/${ipfsCID}`;

    alert(
      `Credential is VALID!\n\n` +
      `Student: ${studentName}\n` +
      `Course: ${course}\n` +
      `Institution: ${institution}\n` +
      `Issue Date: ${issueDate}\n\n` +
      `Certificate will open from IPFS.`
    );

    // Open certificate PDF from IPFS
    window.open(certificateURL, "_blank");

  } catch (error) {
    console.error("Credential verification failed:", error);

    alert(
      "Verification failed. Check the browser console for details."
    );
  }
}

async function issueCredential() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  const credentialId =
    document.getElementById("issueCredentialId").value.trim();

  const studentName =
    document.getElementById("studentName").value.trim();

  const course =
    document.getElementById("course").value.trim();

  const institution =
    document.getElementById("institution").value.trim();

  const issueDate =
    document.getElementById("issueDate").value.trim();

  const ipfsCID =
    document.getElementById("ipfsCID").value.trim();

  if (
    !credentialId ||
    !studentName ||
    !course ||
    !institution ||
    !issueDate ||
    !ipfsCID
  ) {
    alert("Please fill all credential fields.");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    console.log("Issuing credential...");

    const transaction =
      await contract.issueCredential(
        credentialId,
        studentName,
        course,
        institution,
        issueDate,
        ipfsCID
      );

    console.log("Transaction sent:", transaction.hash);

    alert(
      "Transaction sent. Please wait for blockchain confirmation."
    );

    await transaction.wait();

    console.log("Credential issued successfully!");

    alert(
      `Credential issued successfully!\n\nCredential ID: ${credentialId}`
    );
  } catch (error) {
    console.error("Credential issuance failed:", error);

    if (error.code === "ACTION_REJECTED") {
      alert("Transaction rejected in MetaMask.");
    } else {
      alert(
        "Credential issuance failed. Check the browser console."
      );
    }
  }
}

async function revokeCredential() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  const credentialId =
    document.getElementById("revokeCredentialId").value.trim();

  if (!credentialId) {
    alert("Please enter Credential ID");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    console.log("Revoking credential...");

    const transaction =
      await contract.revokeCredential(credentialId);

    console.log("Transaction sent:", transaction.hash);

    alert(
      "Revocation transaction sent. Please wait for confirmation."
    );

    await transaction.wait();

    console.log("Credential revoked successfully!");

    alert(
      `Credential revoked successfully!\n\nCredential ID: ${credentialId}`
    );
  } catch (error) {
    console.error("Credential revocation failed:", error);

    if (error.code === "ACTION_REJECTED") {
      alert("Transaction rejected in MetaMask.");
    } else {
      alert(
        "Credential revocation failed. Check the browser console."
      );
    }
  }
}

function App() {
  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">CrediVerify</div>

        <button
          className="connect-btn"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </nav>

      <main className="container">

        <section className="hero">

          <p className="badge">
            BLOCKCHAIN CREDENTIAL VERIFICATION
          </p>

          <h1>
            Verify Academic Credentials
            <span> with Blockchain</span>
          </h1>

          <p className="subtitle">
            Issue, verify and revoke academic credentials using
            blockchain technology and decentralized storage.
          </p>

        </section>

        <section className="cards">

          {/* ISSUE CREDENTIAL */}

          <div className="card">

            <h2>Issue Credential</h2>

            <p>
              Authorized institutions can issue a new digital
              credential.
            </p>

            <input
              id="issueCredentialId"
              type="text"
              placeholder="Credential ID"
            />

            <input
              id="studentName"
              type="text"
              placeholder="Student Name"
            />

            <input
              id="course"
              type="text"
              placeholder="Course"
            />

            <input
              id="institution"
              type="text"
              placeholder="Institution"
            />

            <input
              id="issueDate"
              type="text"
              placeholder="Issue Date (YYYY-MM-DD)"
            />

            <input
              id="ipfsCID"
              type="text"
              placeholder="IPFS CID"
            />

            <button onClick={issueCredential}>
              Issue Credential
            </button>

          </div>


          {/* VERIFY CREDENTIAL */}

          <div className="card">

            <h2>Verify Credential</h2>

            <p>
              Verify a credential using its unique credential ID.
            </p>

            <input
              id="credentialId"
              type="text"
              placeholder="Enter Credential ID"
            />

            <button onClick={verifyCredential}>
              Verify Credential
            </button>

          </div>


          {/* REVOKE CREDENTIAL */}

          <div className="card">

            <h2>Revoke Credential</h2>

            <p>
              Authorized issuers can revoke an issued credential.
            </p>

            <input
              id="revokeCredentialId"
              type="text"
              placeholder="Credential ID"
            />

            <button onClick={revokeCredential}>
              Revoke Credential
            </button>

          </div>


          {/* BLOCKCHAIN STATUS */}

          <div className="card">

            <h2>Blockchain Status</h2>

            <p>Smart Contract</p>

            <div className="status">
              ● Local Blockchain
            </div>

            <p className="address">
              Contract: 0x5FC8...5707
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;