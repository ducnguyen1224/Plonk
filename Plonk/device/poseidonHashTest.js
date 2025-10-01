const circomlibjs = require("circomlibjs");
const fs = require("fs");
const axios = require("axios");

async function poseidonHash(id) {
  // Build Poseidon instance. This loads constants & performs setup.
  const poseidon = await circomlibjs.buildPoseidonOpt();

  const hashBigInt = poseidon.F.toObject(poseidon([id]));

  return hashBigInt;
}

function generateRandomNumberString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }
  return result;
}

async function main() {
  const randID = generateRandomNumberString(5);
  console.log('Generated random ID:', randID);

  const commitment = await poseidonHash(randID);
  console.log('Generated commitment:', commitment.toString());

  // Lưu ID và commitment local theo sơ đồ
  fs.writeFileSync("ID.json", randID);
  fs.writeFileSync("commitment.json", commitment.toString());
  
  // send commitment to server of step 1.3
  try {
    console.log('Sending commitment to server...');
    const response = await axios.post('http://192.168.80.114:3000/commitment', {
      commitment: commitment.toString()
    });
    console.log('Commitment sent to server:', response.data.message);
  } catch (error) {
    console.error('Error sending to server:', error.message);
    console.log('Make sure server is running and IP is correct');
  }
  
  console.log('ID and commitment saved locally');
  console.log('Ready for authentication step');
}

main();
