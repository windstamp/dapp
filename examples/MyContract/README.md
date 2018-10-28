# README

本示例展示如何将智能合约部署到以太坊网络。

## 1. 创建 Truffle 项目

### 1.1 创建目录
```
mkdir MyContract
cd MyContract
```

### 1.2 truffle init
初始化成 truffle 项目。

执行下面的命令之后，会创建 truffle 项目的子目录结构，以及配置文件。

```
truffle init
```

需要注意的是，truffle init 需要目录是空的，因此先执行 truffle init，再创建 README.md。

## 1.3 配置 truffle
truffle.js
```
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    networks: {
      poa: {
          host: '192.168.60.30',
          port: 8102,
          gas: 4700000,
          gasPrice:1,
          network_id: '*'
      },
      pow: {
          host: '192.168.60.31',
          port: 8100,
          gas: 4700000,
          gasPrice:1,
          network_id: '*'
      },
      ganache: {
          host: '192.168.60.12',
          port: 7545,
          network_id: '*'
      },
      ganachecli: {
          host: '192.168.60.12',
          port: 8545,
          network_id: '*'
      },
      local: {
          host: '127.0.0.1',
          port: 8545,
          network_id: '*'
      }
  }
};
```

## 1.4 编写智能合约
在目录 contracts 中创建智能合约文件 MyContract.sol。

MyContract.sol
```
pragma solidity ^0.4.23;

contract MyContract {
    address public owner;
    int public value;

    constructor() public {
        owner = msg.sender;
    }

    function setValue(int v) public {
        value = v;
    }

    function getValue() public view returns(int) {
        return value;
    }
}
```

### 1.5 部署智能合约
部署智能合约到以太坊中有多种方法，本文介绍三种方法：1. 通过 truffle 部署脚本；
2. 通过 nodejs 脚本；3. 通过 nodejs web 项目。


## 1.5.1 编写 truffle 部署脚本
在 migrations 子目录中创建部署脚本 2_deploy_contracts.js。

2_deploy_contracts.js
```
var MyContract = artifacts.require("./MyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};
```

### 1.5.2 配置和安装 nodejs 依赖项
无论是通过 nodejs 脚本，还是 nodejs web 项目的方式将智能合约部署到以太坊网络。
都需要使用相关的第三方依赖。因此，先通过 npm init 增加 nodejs 的配置文件 package.json，
并在其中配置相关的依赖。这里我们用到了 truffle-contract 用来简化智能合约的部署等操作。

#### 1.5.2.1 npm init
执行下列命令
```
npm init
```

一直点默认，直到生成配置文件 package.json。并配置依赖项 truffle-contract 和 web3 等。
由于，下面 nodejs web 项目也会用到这个配置文件，所以这里一次性把 nodejs web 的依赖项
jquery, watchify 等也配置好了。

package.json
```
{
  "name": "mycontract",
  "version": "1.0.0",
  "description": "MyContract example.",
  "main": "app.js",
  "devDependencies": {
    "babel-polyfill": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "babel-preset-stage-3": "^6.24.1",
    "babelify": "~7.3.0",
    "browserify": "~14.3.0",
    "jquery": "~3.2.1",
    "truffle": "^4.0.4",
    "truffle-contract": "^3.0.1",
    "watchify": "~3.9.0",
    "web3": "~0.20.1",
    "zeppelin-solidity": "^1.5.0"
  },
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": [
            "es2015",
            "stage-2",
            "stage-3"
          ]
        }
      ]
    ]
  },
  "directories": {
    "test": "test"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "watchify app.js -o bundle.js -v"
  },
  "author": "Windstamp",
  "license": "ISC"
}
```

#### 1.5.2.2 npm install
执行下列命令安装 nodejs 的项目依赖项。
```
npm install
```

npm 安装有时候太慢，需要使用国内镜像加速。
```
npm --registry https://registry.npm.taobao.org install
```

需要说明的是，有时候使用国内镜像下载下来的包并不能完全正常使用，
而不使用又不能成功下载。这是个问题，而且很难查明原因。

### 1.5.3 编写 nodejs 脚本
新建子目录 scripts 用于存放 nodejs 脚本。新建 scripts/deploy.js 用于将
智能合约部署到网络中。

scripts/deploy.js
```
var Web3 = require('web3');
var contract = require('truffle-contract');

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

const MyContract = contract(require('../build/contracts/MyContract.json'));
MyContract.setProvider(provider);

let myContract = null;
const GAS = 1000000;

var address = web3.eth.accounts[0];

const showError = error => {
    console.error(error);
};

MyContract.new({ from: address, gas: GAS }).then(instance => {
    myContract = instance;

    console.log('address', instance.address);
    console.log('txhash', instance.transactionHash);
  }).catch(showError);
```

执行下列命令，将智能合约部署到以太坊网络中去。
```
node scripts/deploy.js
```

或者
```
cd scripts
node deploy.js
```

需要注意依赖项 web3 和 truffle-contract 的目录关系。


### 1.5.4 构建 nodejs web 项目
构建 nodejs web 项目，通过网页操作的方式，将智能合约部署到网络中。

这里用到了 jquery 库。

#### 1.5.4.1 更新配置文件 package.json
在配置文件 package.json 中配置启动命令 start。
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "watchify app.js -o bundle.js -v"
}
```

#### 1.5.4.2 app.js
编写脚本文件 app.js。

#### 1.5.4.3 index.html
编写页面 index.html。

#### 1.5.4.4 npm start
执行下列命令，启动 nodejs web 项目。
```
npm start
```

#### 1.5.4.5 打开 index.html
打开 index.html 页面，可以开始通过页面的形式将智能合约部署到以太坊网络。

需要说明的是，不一定可以同时在所有的浏览器上同时正常运行。当在一种浏览器上出现问题时，
可以换成另一种浏览器试试。如，当使用 google chrome 浏览器运行失败时，可以换成 ie 浏览器试试。

## Contributor
1. Windstamp, https://github.com/windstamp
