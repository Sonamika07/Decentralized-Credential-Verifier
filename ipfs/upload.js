require("dotenv").config();

const { PinataSDK } = require("pinata");
const fs = require("fs");

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

async function uploadFile() {
  try {
    const file = new Blob([
      fs.readFileSync("./CrediVerify_Demo_Certificate_CERT-004.pdf"),
    ]);

    const upload = await pinata.upload.public.file(file);

    console.log("File uploaded successfully!");
    console.log("CID:", upload.cid);
  } catch (error) {
    console.error("Upload failed:");
    console.error(error);
  }
}

uploadFile();