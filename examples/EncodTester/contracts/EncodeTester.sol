pragma solidity >=0.4.22 <0.6.0;

contract EncodeTester {
    // 用于表明 keccak256(a, b, c) 和 keccak256(abi.encodePacked(a, b, c)) 生成的结果是一致的
    // 但是后一种方法抽象性更好
    // abi.encodePacked Is it necessary, https://ethereum.stackexchange.com/questions/53220/abi-encodepacked-is-it-necessary
    function encodePackedTest(address a, uint b, string c) public pure returns(bytes32, bytes32){
        return (keccak256(a, b, c), keccak256(abi.encodePacked(a, b, c)));
    }

    function encodePackedTest2(uint value, bool fake, string secret) public pure returns(bytes32, bytes32){
        return (keccak256(value, fake, secret), keccak256(abi.encodePacked(value, fake, secret)));
    }

    function encodePackedTest3(uint value, bool fake, bytes32 secret) public pure returns(bytes32, bytes32){
        return (keccak256(value, fake, secret), keccak256(abi.encodePacked(value, fake, secret)));
    }

    function encodePackedTest4(uint value, bool fake, address secret) public pure returns(bytes32, bytes32){
        return (keccak256(value, fake, secret), keccak256(abi.encodePacked(value, fake, secret)));
    }

    function encodePackedTest5(uint value, bool fake, bytes secret) public pure returns(bytes32, bytes32){
        return (keccak256(value, fake, secret), keccak256(abi.encodePacked(value, fake, secret)));
    }

    function encodePackedTest6(uint256 amount, uint256 nonce) public view returns(bytes32, bytes32) {
        return (keccak256(msg.sender, amount, nonce, this), keccak256(abi.encodePacked(msg.sender, amount, nonce, this)));
    }

    /// signature methods.
    function splitSignature(bytes memory sig)
        public
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

    function lengthSignature(bytes32 message, bytes memory sig)
        public
        pure
        returns (uint256, uint256)
    {
        return (message.length, sig.length);
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        public
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function recoverSigner2(bytes memory sig, bytes32 message)
        public
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

}
