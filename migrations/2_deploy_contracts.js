const SubmissionCounter = artifacts.require("SubmissionCounter");

module.exports = function (deployer) {
  deployer.deploy(SubmissionCounter);
};
