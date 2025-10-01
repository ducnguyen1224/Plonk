const circomlibjs = require("circomlibjs");
const fs = require("fs");

async function poseidonHash(id) {
  // Build Poseidon instance. This loads constants & performs setup.
  const poseidon = await circomlibjs.buildPoseidonOpt();

  const hashBigInt = poseidon.F.toObject(poseidon([id]));

  return hashBigInt;
}

const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString(); // Convert BigInt to string
  }
  return value; // Return other values as-is
};

function generateRandomNumberString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }
  return result;
}

async function main() {
  const randID = generateRandomNumberString(5);

  const commitment = await poseidonHash(randID);
  const jsonCommitment = JSON.stringify(commitment, replacer, 2);
  fs.writeFileSync("commitment.json", jsonCommitment, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("JSON file has been saved successfully!");
    }
  });
  fs.writeFileSync("ID.json", randID, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("JSON file has been saved successfully!");
    }
  });
}

main();
