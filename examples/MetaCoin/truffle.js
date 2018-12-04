/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

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
          port: 7545,
          network_id: '*'
      }
  }
};
