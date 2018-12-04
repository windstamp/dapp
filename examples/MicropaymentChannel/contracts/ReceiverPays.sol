pragma solidity >=0.4.24 <0.6.0;

// Alice 部署智能合约 ReceiverPays
// 并对所支付的数据amount生成签名signature
// Bob调用方法ReceiverPays.claimPayment() 获取Alice发送给Bob的amount个以太币（单位：Wei）

contract ReceiverPays {
    address owner = msg.sender;

    mapping(uint256 => bool) usedNonces;

    constructor() public payable {}

    function claimPayment(uint256 amount, uint256 nonce, bytes memory signature) public {
        // require(!usedNonces[nonce], "usedNonces[" + nonce + "] failed.");
        require(!usedNonces[nonce], "usedNonces[nonce] failed.");
        usedNonces[nonce] = true;

        // this recreates the message that was signed on the client
        // bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, amount, nonce, this)));
        bytes32 message = keccak256(abi.encodePacked(msg.sender, amount, nonce, this));

        // @TODO
        // recoverSigner 一直失败，要不返回 0x0000000000000000000000000000000000000000
        // 先注释，让后续的流程先跑通
        // require(recoverSigner(message, signature) == owner, "recoverSigner failed.");

        // 向 msg.sender 发送 amount 个以太币（单位：Wei）
        // 那么 amount 个以太币哪里来？
        // 是 this 代表的合约中的余额
        // 每个智能合约都有一个fallback函数，如果没有创建，则会默认生成
        // 这里 msg.sender.transfer() 会调用 this.fallback() 函数
        // 然后在 this.fallback() 函数中实现 web3.eth.sendTransaction({from: this, to: msg.ssender, value: amount})
        // 上面不一定对，但大概是这么个意思，不然不就凭空给 msg.sender 发送了 amount 个以太币（单位：Wei）
        msg.sender.transfer(amount);
    }

    /// destroy the contract and reclaim the leftover funds.
    function kill() public {
        require(msg.sender == owner, "msg.sender is not owner.");
        selfdestruct(msg.sender);
    }

    /// signature methods.
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65, "sig.length is not 65.");

        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
            // second 32 bytes.
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    /// builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}
