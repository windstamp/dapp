var BN = require('bn.js')
var abi = require('ethereumjs-abi')
var sleep = require('sleep');
var TruffleContract = require('truffle-contract');
var Web3 = require('web3');


const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const EncodeTester = TruffleContract(require('../build/contracts/EncodeTester.json'));
EncodeTester.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number to prevent replay attacks
// contractAddress is used to prevent cross-contract replay attacks
var signPayment = async function(sender, recipient, amount, nonce, contractAddress) {
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        [recipient, amount, nonce, contractAddress]
    ).toString("hex");
    
    // console.log('\n hash: ', hash)

    // signature = await web3.eth.personal.sign(hash, sender);
    signature = await web3.eth.sign(sender, hash);

    return {sig: signature, msg: hash};
}

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    encodeTester = await EncodeTester.deployed();
    console.log('\n encodeTester address: ', encodeTester.address);

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];
    console.log('\n acc0: ', acc0);
    console.log('\n acc1: ', acc1);
    console.log('\n acc2: ', acc2);
    console.log('\n acc3: ', acc3);
    console.log('\n acc4: ', acc4);
    console.log('\n acc5: ', acc5);

    var balance0 = await web3.eth.getBalance(acc0);
    var balance1 = await web3.eth.getBalance(acc1);
    var balance2 = await web3.eth.getBalance(acc2);
    var balance3 = await web3.eth.getBalance(acc3);
    var balance4 = await web3.eth.getBalance(acc4);
    var balance5 = await web3.eth.getBalance(acc5);
    balance0 = web3.fromWei(balance0, 'ether');
    balance1 = web3.fromWei(balance1, 'ether');
    balance2 = web3.fromWei(balance2, 'ether');
    balance3 = web3.fromWei(balance3, 'ether');
    balance4 = web3.fromWei(balance4, 'ether');
    balance5 = web3.fromWei(balance5, 'ether');
    console.log('\n balance0: ', balance0.toNumber());
    console.log('\n balance1: ', balance1.toNumber());
    console.log('\n balance2: ', balance2.toNumber());
    console.log('\n balance3: ', balance3.toNumber());
    console.log('\n balance4: ', balance4.toNumber());
    console.log('\n balance5: ', balance5.toNumber());

    result = abi.soliditySHA3(
        [ "address", "address", "uint", "uint" ],
        [ new BN("43989fb883ba8111221e89123897538475893837", 16), 0, 10000, 1448075779 ]
    ).toString('hex')
    console.log('\n result: ', result);
    // result:  c3ab5ca31a013757f26a88561f0ff5057a97dfcc33f43d6b479abc3ac2d1d595

    result = await encodeTester.encodePackedTest2(10000, false, '123456');
    console.log('\n result: ', result);
    // result:  [ '0x59d7fed46588c004ebba79912722e459db746c6b2214d37ce912f6809ad9801b',
    // '0x59d7fed46588c004ebba79912722e459db746c6b2214d37ce912f6809ad9801b' ]

    result = await encodeTester.encodePackedTest2(10000, false, '0x00000000000000000000000000123456');
    console.log('\n result: ', result);
//     result:  [ '0xc5dd20a919ff3e40f1238b736bd2a78e90ce8ba0782f99eb6119ebb97552292d',
//   '0xc5dd20a919ff3e40f1238b736bd2a78e90ce8ba0782f99eb6119ebb97552292d' ]
    
    result = await encodeTester.encodePackedTest2(10000, false, '00000000000000000000000000123456');
    console.log('\n result: ', result);
    // result:  [ '0x07e601396cc849c23d500a4b36957bd8753e27e39432665f5dd8fb192a41d7aa',
    // '0x07e601396cc849c23d500a4b36957bd8753e27e39432665f5dd8fb192a41d7aa' ]

    // 对于函数 encodePackedTest3(uint value, bool fake, bytes32 secret)
    // 00000000000000000000000000123456 与 123456 的结果一致
    // 而 0x00000000000000000000000000123456 则不一致
    result = await encodeTester.encodePackedTest3(10000, false, '0x00000000000000000000000000123456');
    console.log('\n result: ', result);
    // result:  [ '0x391cb314155702bab39e5fd9abf693ad12d29fcb371d9740b76d4b66bcabad84',
    // '0x391cb314155702bab39e5fd9abf693ad12d29fcb371d9740b76d4b66bcabad84' ]

    result = await encodeTester.encodePackedTest3(10000, false, '00000000000000000000000000123456');
    console.log('\n result: ', result);
    // result:  [ '0xe705ba0f57c52960d373a9d98ca99ebcc6a0df70cf26832fd9d65ade14a4061f',
    // '0xe705ba0f57c52960d373a9d98ca99ebcc6a0df70cf26832fd9d65ade14a4061f' ]

    result = await encodeTester.encodePackedTest3(10000, false, '123456');
    console.log('\n result: ', result);
//     result:  [ '0xe705ba0f57c52960d373a9d98ca99ebcc6a0df70cf26832fd9d65ade14a4061f',
//   '0xe705ba0f57c52960d373a9d98ca99ebcc6a0df70cf26832fd9d65ade14a4061f' ]

    result = await encodeTester.encodePackedTest4(10000, false, '123456');
    console.log('\n result: ', result);
//     result:  [ '0x6bc49ff981a3f9d1d3d6dd056b5bad3620a59c6afbf072c390d281e559914c40',
//   '0x6bc49ff981a3f9d1d3d6dd056b5bad3620a59c6afbf072c390d281e559914c40' ]

    // 和 encodePackedTest2(address a, uint b, string c) 结果一致
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ 10000, false, '123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  59d7fed46588c004ebba79912722e459db746c6b2214d37ce912f6809ad9801b
    
    // 和 encodePackedTest2(address a, uint b, string c) 结果一致
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ 10000, false, '0x00000000000000000000000000123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // c5dd20a919ff3e40f1238b736bd2a78e90ce8ba0782f99eb6119ebb97552292d
    
    // 和 encodePackedTest2(address a, uint b, string c) 结果一致
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ 10000, false, '00000000000000000000000000123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // 07e601396cc849c23d500a4b36957bd8753e27e39432665f5dd8fb192a41d7aa

    // 
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "address" ],
        [ 10000, false, '123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  0111290d173179f21b261f1a95116fe1aa1639749e313a7a823a106e6068df50
    
    // 
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "address" ],
        [ 10000, false, '0x00000000000000000000000000123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  c36b2c99b77fa9e0014daf8611482ff10ee7f5015c0b3577b78699affde1b975
    
    // 
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "address" ],
        [ 10000, false, '00000000000000000000000000123456']
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  4239b9f2d5901154c60eadbd26b39de583e8cfa39098c8da7a15e3716519a952

    var secret = web3.sha3('123456');
    console.log('\n secret: ', secret);
    // secret:  0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a

    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ 10000, false, secret]
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  40888d06be48407b4ccf4194fd4a7ecbd1800153883ec64a7d932a4a2db2e916

    result = await encodeTester.encodePackedTest2(10000, false, secret);
    console.log('\n encodePackedTest2: ', result);
//     result:  [ '0x40888d06be48407b4ccf4194fd4a7ecbd1800153883ec64a7d932a4a2db2e916',
//   '0x40888d06be48407b4ccf4194fd4a7ecbd1800153883ec64a7d932a4a2db2e916' ]
    
    result = await encodeTester.encodePackedTest3(10000, false, secret);
    console.log('\n encodePackedTest3: ', result);
//     result:  [ '0xa1f1944aedc3beb452cb668a6dc88aa67bfa838d201575e0be36358f52a3ffaf',
//   '0xa1f1944aedc3beb452cb668a6dc88aa67bfa838d201575e0be36358f52a3ffaf' ]

    result = await encodeTester.encodePackedTest4(10000, false, secret);
    console.log('\n encodePackedTest4: ', result);
//     result:  [ '0x02362c7c0cacd9b5f64ce9c18375dee5f8ba70b02770f44bf985bbdcd43ff02b',
//   '0x02362c7c0cacd9b5f64ce9c18375dee5f8ba70b02770f44bf985bbdcd43ff02b' ]

    secret = secret.slice(2);
    console.log('\n secret: ', secret);
    // secret:  c888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a
    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ 10000, false, secret]
    ).toString('hex')
    console.log('\n blindedBid: ', blindedBid);
    // blindedBid:  6a451758b6ea6c02729a6fd62668d6b1044188c2ec4c0a613d68ab076e3230fb

    result = await encodeTester.encodePackedTest3(10000, false, secret);
    console.log('\n encodePackedTest3: ', result);
    // result:  [ '0xaecfc84c5060ba595f316ab9e7ae8bd31d18be23c8ad3a0b4c044fa8f9b19b91',
    // '0xaecfc84c5060ba595f316ab9e7ae8bd31d18be23c8ad3a0b4c044fa8f9b19b91' ]

    // blindedBid = abi.soliditySHA3(
    //     [ "uint", "bool", "bytes" ],
    //     [ 10000, false, secret]
    // ).toString('hex')
    // console.log('\n blindedBid: ', blindedBid);

    // result = await encodeTester.encodePackedTest5(10000, false, secret);
    // console.log('\n encodePackedTest5: ', result);

    // signPayment 中生成的 hash 和 encodeTester.encodePackedTest6 生成的 hash 是一致的
    var alice = acc0;
    var bob = acc1;

    var amount = 1000;
    var nonce = 0;
    var contractAddress = encodeTester.address;
    msgAndSig = await signPayment(alice, bob, amount, nonce, contractAddress);
    console.log('\n msg: ', msgAndSig.msg);
    console.log('\n sig: ', msgAndSig.sig);
    // msg:  0xffb1d188f92259af5dbb70c9d01fe313e8e768b9b42e54d92f60fd96628e900e
    // sig:  0x498747113cba282cdb60c915075b9e8671d7a2e672823c5336220bb743629c65545750ab232860c0b9a0386fd241d623f70e995afe5a49912b6c04e2decd24c900

    result = await encodeTester.encodePackedTest6(amount, nonce, {from: bob});
    console.log('\n encodePackedTest6: ', result);
//     result:  [ '0xffb1d188f92259af5dbb70c9d01fe313e8e768b9b42e54d92f60fd96628e900e',
//   '0xffb1d188f92259af5dbb70c9d01fe313e8e768b9b42e54d92f60fd96628e900e' ]

    msg = msgAndSig.msg;
    // msg = msg.slice(2);
    sig = msgAndSig.sig;
    // sig = sig.slice(2);
    console.log('\n msg: ', msg);
    console.log('\n msg length: ', msg.length);
    console.log('\n sig: ', sig);
    console.log('\n sig length: ', sig.length);

    result = await encodeTester.lengthSignature(msg, sig);
    console.log('\n lengthSignature: ', result);
    msgLength = result[0];
    sigLength = result[1];
    console.log('\n msgLength: ', msgLength.toNumber());
    console.log('\n sigLength: ', sigLength.toNumber());

    result = await encodeTester.splitSignature(sig);
    // result = await encodeTester.splitSignature(msgAndSig.sig);
    console.log('\n splitSignature: ', result);
    v = result[0];
    r = result[1];
    s = result[2];
    console.log('\n v: ', v.toNumber());
    console.log('\n r: ', r);
    console.log('\n s: ', s);

    // msg 有没有 0x 前缀，结果真的是天差地别
    // 没有 0x 前缀，智能合约的 msg 和 sig 参数会解析出错
    // 有了 0x 前缀，智能合约返回的结果却又是 0x0000000000000000000000000000000000000000
    // 说明也出错了
    // 但是 splitSignature 结果却是对的

    result = await encodeTester.recoverSigner(msg, sig);
    console.log('\n recoverSigner: ', result);
    console.log('\n alice: ', alice);

    result = await encodeTester.recoverSigner2(sig, msg, {from: acc5, gas:4700000, gasPrice: 1});
    console.log('\n recoverSigner2: ', result);
    console.log('\n alice: ', alice);
};

asyncFunc();
