# README

本示例用于展示如何基于ERC20标准代币，实现一套自己的代币。

## 1. 创建项目和设置配置信息

### 1.1 创建项目 FurnaceCoin
```
mkdir FurnaceCoin
cd FurnaceCoin
```

### 1.2 配置truffle信息
```
truffle init
```

在生成的文件truffle.js配置以太坊网络等信息。

### 1.3 配置nodejs信息
```
npm init
```

在生成的文件package.json中配置依赖的npm包。

## 2. 编写智能合约

### 2.1 编写智能合约 FurnaceCoin
编写智能合约 contracts/FurnaceCoin.sol，实现自己的代币。

示例如下：
```
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
```

这里用到了 zeppelin-solidity 库中的 ERC20 标准代币实现。

FurnaceCoin 在创建时便设定初始代币数量，并全部分配给创建者。
同时支持创建者在后续增加代币的总数量，通过方法 mint() 实现。

## 3. 部署智能合约

### 3.1 编写部署脚本
编写部署脚本 migrations/2_deploy_contracts.js。

示例如下：
```
var FurnaceCoin = artifacts.require("./FurnaceCoin.sol");

module.exports = function(deployer) {
    var initSupply = 3000000000;
    
    deployer.deploy(FurnaceCoin, initSupply);
};
```

### 3.2 将智能合约部署到以太坊网络

```
truffle migrate --network ganache
```

这里，需要记住各智能合约在指定以太坊网络中的合约地址。

## 4. 使用 FurnaceCoin
这里只通过 nodejs 脚本来使用 FurnaceCoin，存放于目录 scripts。

## 4.1 转账操作
脚本 scripts/transfer.js 用于实现转账操作。
```
var Web3 = require('web3');
var contract = require('truffle-contract');

//var rpcUrl = "http://localhost:7545";
var rpcUrl = "http://192.168.60.12:7545";

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const FurnaceCoin = contract(require('../build/contracts/FurnaceCoin.json'));
FurnaceCoin.setProvider(provider);

const showError = error => {
    console.error(error);
};

var addressOfFurnaceCoin = "0xbefd2d3f950f0e948bd0bef1f03f84636185c09c";
var deployed = FurnaceCoin.at(addressOfFurnaceCoin);

var accounts = web3.eth.accounts;
var acc0, balanceOfAcc0;
var acc1, balanceOfAcc1;
var acc2, balanceOfAcc2;
var acc3, balanceOfAcc3;
var acc4, balanceOfAcc4;

if (accounts.length > 0)
    acc0 = web3.eth.accounts[0];

if (accounts.length > 1)
    acc1 = web3.eth.accounts[1];

if (accounts.length > 2)
    acc2 = web3.eth.accounts[2];

if (accounts.length > 3)
    acc3 = web3.eth.accounts[3];

if (accounts.length > 4)
    acc4 = web3.eth.accounts[4];

var async_func_transfer = async function(to, value, sender) {
    var result = await deployed.transfer(to, value, {from: sender});
    console.log("\nTest transfer (sender:", sender, ", to:", to, ", value:", value, ").");
    console.log("transfer tx: ", result.tx);
}

async_func_transfer(acc1, 1000, acc0);
```

### 4.2 监听事件
创建脚本 scripts/events.js 用于监听 FurnaceCoin 触发的日志。

scripts/events.js
```nodejs
var Web3 = require('web3');
var contract = require('truffle-contract');

//var rpcUrl = "http://localhost:7545";
var rpcUrl = "http://192.168.60.12:7545";

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const FurnaceCoin = contract(require('../build/contracts/FurnaceCoin.json'));
FurnaceCoin.setProvider(provider);

const showError = error => {
    console.error(error);
};

var addressOfFurnaceCoin = "0xbefd2d3f950f0e948bd0bef1f03f84636185c09c";
var deployed = FurnaceCoin.at(addressOfFurnaceCoin);

console.log("Event Lister.");

var eventTransfer = deployed.Transfer();
var eventApproval = deployed.Approval();

eventTransfer.watch(function(error, result){
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('\nEvent for Transfer:');
    console.log('transactionIndex: ', result.transactionIndex);
    console.log('transactionHash: ', result.transactionHash);
    console.log('blockHash: ', result.blockHash);
    console.log('blockNumber: ', result.blockNumber);
    console.log('addressOfFurnaceCoin: ', result.address);
    console.log('from: ', result.args.from);
    console.log('to: ', result.args.to);
    console.log('value: ', result.args.value.toNumber());
});

eventApproval.watch(function(error, result){
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('\nEvent for Approval:');
    console.log('transactionIndex: ', result.transactionIndex);
    console.log('transactionHash: ', result.transactionHash);
    console.log('blockHash: ', result.blockHash);
    console.log('blockNumber: ', result.blockNumber);
    console.log('addressOfFurnaceCoin: ', result.address);
    console.log('owner: ', result.args.owner);
    console.log('spender: ', result.args.spender);
    console.log('value: ', result.args.value.toNumber());
});
```

### 4.3 使用 FurnaceCoin
创建脚本 scritps/test.js，调用 FurnaceCoin 中的方法。

主要是：
- 对于每个字段，调用同名的获取方法，查看对应值。
- 通过方法 totalSupply() 查看总的代币数量。
- 通过方法 balanceOf() 查询给定账户的代币余额。
- 通过方法 transfer() 转账指定数量的代币给指定账户。
- 通过方法 approve() 授权指定数量的代币可由指定账户进行支付。
- 通过方法 allowance() 查询授权支付信息。
- 通过方法 increaseApproval() 追加支付授权。
- 通过方法 decreaseApproval() 撤销指定数量的支付授权。
- 通过方法 transferFrom() 进行授权支付。

特别需要注意的是，当调用方法 transfer(), transferFrom() 时会触发事件 Transfer。
当调用方法 approve(), increaseApproval(), decreaseApproval() 时会触发事件 Approval。
启动脚本 scripts/events.js 将能够监听到这些日志事件，并输出日志的详细信息。

``` nodejs
var Web3 = require('web3');
var contract = require('truffle-contract');

//var rpcUrl = "http://localhost:7545";
var rpcUrl = "http://192.168.60.12:7545";

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const FurnaceCoin = contract(require('../build/contracts/FurnaceCoin.json'));
FurnaceCoin.setProvider(provider);

const showError = error => {
    console.error(error);
};

var addressOfFurnaceCoin = "0xbefd2d3f950f0e948bd0bef1f03f84636185c09c";
var deployed = FurnaceCoin.at(addressOfFurnaceCoin);

var accounts = web3.eth.accounts;
var acc0, balanceOfAcc0;
var acc1, balanceOfAcc1;
var acc2, balanceOfAcc2;
var acc3, balanceOfAcc3;
var acc4, balanceOfAcc4;

if (accounts.length > 0)
    acc0 = web3.eth.accounts[0];

if (accounts.length > 1)
    acc1 = web3.eth.accounts[1];

if (accounts.length > 2)
    acc2 = web3.eth.accounts[2];

if (accounts.length > 3)
    acc3 = web3.eth.accounts[3];

if (accounts.length > 4)
    acc4 = web3.eth.accounts[4];

console.log("Test FurnaceCoin.");
deployed.then(function() {
    return deployed.name();
})
.then(function(result) {
    console.log("\nTest name:");
    console.log("name: ", result);

    return deployed.symbol();
})
.then(function(result) {
    console.log("\nTest symbol:");
    console.log("symbol: ", result);

    return deployed.decimals();
})
.then(function(result) {
    console.log("\nTest decimals:");
    console.log("decimals: ", result.toNumber());

    return deployed.INITIAL_SUPPLY();
})
.then(function(result) {
    console.log("\nTest INITIAL_SUPPLY:");
    console.log("INITIAL_SUPPLY: ", result.toNumber());

    return deployed.totalSupply();
})
.then(function(result) {
    console.log("\nTest totalSupply_:");
    console.log("totalSupply_: ", result.toNumber());

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();

    return deployed.transfer(acc1, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest transfer:");
    console.log("transfer tx: ", result.tx);

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();

    return deployed.approve(acc0, 3000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest approve:");
    console.log("approve tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.increaseApproval(acc0, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest increaseApproval:");
    console.log("increaseApproval tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.decreaseApproval(acc0, 500, {from: acc0});
})
.then(function(result) {
    console.log("\nTest decreaseApproval:");
    console.log("decreaseApproval tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.transferFrom(acc0, acc1, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest transferFrom:");
    console.log("transferFrom tx: ", result.tx);

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();
})
.catch(showError);
```
