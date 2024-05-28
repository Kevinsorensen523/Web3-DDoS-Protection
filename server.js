const express = require("express");
const Web3 = require("web3");
const app = express();
const PORT = 3000;

const web3 = new Web3("http://localhost:7545");

const contractJSON = require("./build/contracts/SubmissionCounter.json");
const contractABI = contractJSON.abi;
const contractAddress = contractJSON.networks["5777"].address;

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  let submitCount = 0;
  try {
    submitCount = await contract.methods.count().call();
  } catch (error) {
    console.error("Failed to fetch count from the blockchain:", error);
    submitCount = "Error fetching count";
  }

  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Data Submission Counter</title>
            <script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    background-color: #f4f4f4; 
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                input[type="text"], button {
                    margin: 10px 0;
                    padding: 8px;
                    width: 80%;
                    border-radius: 4px;
                }
                button {
                    border: none;
                    background-color: #007BFF;
                    color: white;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Data Submission Counter</h1>
                <input type="text" id="dataInput" placeholder="Enter some data" required />
                <button onclick="submitData()">Submit</button>
                <p id="countDisplay">Submitted ${submitCount} times</p>
            </div>

            <script>
                window.addEventListener('load', async () => {
                    if (window.ethereum) {
                        window.web3 = new Web3(window.ethereum);
                        try {
                            await window.ethereum.enable();
                        } catch (error) {
                            console.error("User denied account access");
                        }
                    } else if (window.web3) {
                        window.web3 = new Web3(web3.currentProvider);
                    } else {
                        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
                    }
                });

                async function submitData() {
                    const dataInput = document.getElementById('dataInput').value;
                    const contract = new web3.eth.Contract(${JSON.stringify(
                      contractABI
                    )}, "${contractAddress}");
                    const accounts = await web3.eth.getAccounts();
                    contract.methods.submitData().send({ from: accounts[0] })
                        .then(function(receipt){
                            window.location.reload(); // Reload page to update the count
                        })
                        .catch(function(error){
                            console.error("Transaction failed: ", error);
                        });
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
