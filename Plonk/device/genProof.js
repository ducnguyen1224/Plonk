const snarkjs = require("snarkjs");
const fs = require("fs");
const axios = require("axios");

async function run() {
  console.log('Reading local files...');
  

  const ID = fs.readFileSync("ID.json", "utf8").trim();
  const IDBigInt = BigInt(ID);
  console.log('Using ID:', ID);

  const commitment = fs.readFileSync("commitment.json", "utf8").trim();
  
  let cleanCommitment = commitment;
  
  if (cleanCommitment.startsWith('"') && cleanCommitment.endsWith('"')) {
    cleanCommitment = cleanCommitment.slice(1, -1);
  }
  
  cleanCommitment = cleanCommitment.replace(/[^\d]/g, '');
  
  console.log('Raw commitment:', commitment);
  console.log('Clean commitment:', cleanCommitment);
  
  const commitmentBigInt = BigInt(cleanCommitment);
  console.log('Using commitment:', cleanCommitment);

  try {
    console.log('Requesting nonce from server...');
    const nonceResponse = await axios.get('http://192.168.80.114:3000/nonce');
    const nonce = nonceResponse.data.nonce;
    console.log('Received nonce:', nonce);

    console.log('Generating Plonk proof...');
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      {
        secretID: IDBigInt,
        nonce: nonce,
        commitment: commitmentBigInt,
      },
      "poseidonAuth.wasm",
      "poseidon_auth_final.zkey"
    );
    
    console.log('Proof generated successfully');
    
    const res = { proof: proof, output: publicSignals[0] };
    
    console.log('Sending proof to server...');
    const proofResponse = await axios.post('http://192.168.80.114:3000/proof', {
      proof: res
    });
    console.log('Proof sent successfully:', proofResponse.data.message);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Make sure server is running and IP is correct');
  }
}

run().then(() => {
  process.exit(0);
});
