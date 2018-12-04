// pragma solidity >0.4.99 <0.6.0;

// /D/working/bitbucket/zblockchain/ethereumcodes/windows/truffle/examples/Coin/contracts/Coin.sol:1:1: SyntaxError: Source file requires different compiler version (current compiler is 0.4.24+commit.e67f0147.Emscripten.clang - note that nightly builds are considered to be strictly less than the released version
// pragma solidity >0.4.99 <0.6.0;
// ^-----------------------------^
// Compilation failed. See above.

pragma solidity >=0.4.0 <0.6.0;

contract Coin {
    // The keyword "public" makes those variables
    // easily readable from outside.
    address public minter;
    mapping (address => uint) public balances;

    // Events allow light clients to react to
    // changes efficiently.
    event Sent(address from, address to, uint amount);

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() public {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        require(amount < 1e60);
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
