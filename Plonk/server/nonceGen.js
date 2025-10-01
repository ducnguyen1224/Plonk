const fs = require("fs");

function generateTimestampNonce() {
  return Date.now().toString(); // Current timestamp in milliseconds
}

// Example usage
const timestampNonce = generateTimestampNonce();
fs.writeFileSync("timestampNonce.json", timestampNonce, (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("JSON file has been saved successfully!");
  }
});
