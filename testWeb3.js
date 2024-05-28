const Web3 = require("web3");

try {
  const web3 = new Web3("http://localhost:7545");
  console.log("Web3 version:", web3.version);
} catch (error) {
  console.error("Failed to initialize Web3:", error);
}
