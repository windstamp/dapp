pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract FurnaceCoin is Ownable, StandardToken {
    string public name = "FurnaceCoin";
    string public symbol = "FCoin";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 1000000000;

    constructor(uint _initSupply) public {
        if (_initSupply <= 0)
            _initSupply = INITIAL_SUPPLY;

        totalSupply_ = _initSupply;

        balances[msg.sender] = totalSupply_;

        emit Transfer(address(0x0), msg.sender, totalSupply_);
    }

    function mint(uint _value) public onlyOwner returns(bool) {
        totalSupply_ += _value;

        balances[msg.sender] += _value;

        emit Transfer(address(0x0), msg.sender, _value);
    }
}
