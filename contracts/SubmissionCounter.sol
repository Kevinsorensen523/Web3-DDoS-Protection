// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SubmissionCounter {
    uint public count = 0;

    function submitData() public {
        count += 1;
    }
}
