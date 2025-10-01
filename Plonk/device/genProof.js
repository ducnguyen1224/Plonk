const snarkjs = require("snarkjs");
const fs = require("fs");
const axios = require("axios");

async function run() {
  console.log('Reading local files...');
  
  // Đọc ID và commitment từ local theo sơ đồ
  const ID = fs.readFileSync("ID.json", "utf8").trim();
  const IDBigInt = BigInt(ID);
  console.log('Using ID:', ID);

  // Đọc commitment từ local
  const commitment = fs.readFileSync("commitment.json", "utf8").trim();
  
  // Xử lý commitment để loại bỏ ký tự đặc biệt
  let cleanCommitment = commitment;
  
  // Loại bỏ dấu ngoặc kép nếu có
  if (cleanCommitment.startsWith('"') && cleanCommitment.endsWith('"')) {
    cleanCommitment = cleanCommitment.slice(1, -1);
  }
  
  // Loại bỏ khoảng trắng và ký tự đặc biệt
  cleanCommitment = cleanCommitment.replace(/[^\d]/g, '');
  
  console.log('Raw commitment:', commitment);
  console.log('Clean commitment:', cleanCommitment);
  
  const commitmentBigInt = BigInt(cleanCommitment);
  console.log('Using commitment:', cleanCommitment);

  // Lấy nonce từ server theo sơ đồ
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
    
    // Gửi proof đến server theo sơ đồ
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
