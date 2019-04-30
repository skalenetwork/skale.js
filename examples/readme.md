# Examples 

Here you can find examples description.

Before all you need to create `.env` form `.env_examples` with your
credentials.

To run examples you should do some changes (if it's needed) and then

`node script_name_js`
 
## Common
#### unlockAccount.js
unlock your account if you want your transactions to be signed by the
node

#### transferSkale.js
you need change 

`to: 'recipientAccount'` and 

`amount: 'amount of SKALE tokens in wei'` on yours data and then run
script.

## Logs
#### GetPastEvents.js
get events by name

## Manager
#### checkNodeName.js
check the node name before node create (name should be available)

#### createNode.js
create node

#### createSchain.js
create S-chain

Attention!!! before S-chain create you should create at least 20 nodes

#### deleteSchain.js
delete S-chain by `name`

you need change `name` before run script

#### getActiveNodes.js
get all active nodes

#### getSchains.js
get all S-chains for account

## Nodes
#### getActiveNodeIps.js
get IPs for all active nodes

#### getNodeRaw.js
get node info by `nodeID`

you need change `nodeID` before run script

## Schains
#### getNodeConfig.js
get info of nodes which contain a S-chain by `schainName`

you need change `schainName` before run script

#### getPrice.js
get the price of S-chain

you need change `indexOfType` before run script

#### getTransferHistory.js
get all transfer history for account (like: node create, S-chain create,
transfer SKALE tokens)

#### getSchainByName.js
get info of S-chain by `schainName`

you need change `schainName` before run script

#### getSchainListSize.js
get number of S-chains for account

## Token
#### getBalance.js
get balance of SKALE tokens for account
