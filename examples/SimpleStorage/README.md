# README.md

通过示例 SimpleStorage 来介绍智能合约开发过程中涉及到的方方面面。如：Solidity、Truffle、nodejs & web。

## SimpleStorage

### 1. 创建目录
创建示例 SimpleStorage 的目录。

```
mkdir SimpleStorage
cd SimpleStorage
```

### 2. 配置 truffle
执行下列命令初始化 truffle 项目的基本结构及配置信息。

```
truffle init
```

执行之后，会生成目录 contracts, migrations, test，及配置信息 truffle.js。

#### 2.1 配置 truffle.js
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

#### 2.2 测试
```
truffle test
```

#### 2.4 编译
```
truffle compile
truffle compile --all
```

#### 2.3 Migrate
```
truffle migrate --network local
```

### 3. 配置 nodejs
执行下列命令初始化 nodejs 项目的基本结构及配置作息。

```
npm init
```

执行之后，会生成配置文件 package.json。

#### 3.1 构建 nodejs 目录结构



#### 3.2 配置依赖项



