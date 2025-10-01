const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

function readJsonFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath); // Resolve the file path
    const data = fs.readFileSync(absolutePath, "utf8"); // Read the file as a string
    const jsonData = JSON.parse(data); // Parse the string into a JSON object
    return jsonData;
  } catch (err) {
    console.error("Error reading the JSON file:", err);
    return null;
  }
}

async function run() {
  const proofPath = "../proof.json";
  const proof = readJsonFile(proofPath);
  const nonce = JSON.parse(fs.readFileSync("../timestampNonce.json"));
  const commitmentPath = "../commitment.json";
  const commitment = readJsonFile(commitmentPath);
  const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

  const publicSignals = new Array();
  publicSignals[0] = proof.output;
  publicSignals[1] = nonce;
  publicSignals[2] = commitment;

  // Sử dụng Plonk verification thay vì Groth16
  const res = await snarkjs.plonk.verify(vKey, publicSignals, proof.proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }
}

run().then(() => {
  process.exit(0);
});
