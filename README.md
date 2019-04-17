# SKALE JS API library

[![Build Status](https://travis-ci.com/skalenetwork/skale.js.svg?token=VyxyB39zs82QAe5RAZya&branch=develop)](https://travis-ci.com/skalenetwork/skale.js)
[![codecov](https://codecov.io/gh/skalenetwork/skale.js/branch/develop/graph/badge.svg?token=fZeTTl2yaf)](https://codecov.io/gh/skalenetwork/skale.js)



SKALE client tools.  
You can use this library to develop browser and Node.js 
applications that use Skale.

## Installation

#### Node

```bash
npm install @skalenetwork/skale.js
```

## Usage
```js
const skale = require('@skalenetwork/skale.js');

console.log(skale);
> {
    init: ... ,
    ...
    w3: {...},
    w3events: {...},
    helper: {...},
    rand: ... ,
    Listener: ... 
}
```

## Examples

Examples can be found at the [examples](https://github.com/skalenetwork/skale.js/tree/develop/examples) folder

## Documentation

Documentation can be found at read the [docs]()

### Build

```bash
# build patch version
npm run build-patch

# build minor version
npm run build-minor

# build major version
npm run build-major
```

#### Build publish

```bash
npm publish
```

#### Testing (mocha)

To run tests locally you need save environment variables to `.env` file:
* `IP`: ip of test geth
* `PORT`: port of test geth
* `ETH_ACCOUNT`: test account address
* `ETH_PRIVATE_KEY`: test account privatekey
 
Then:
```bash
npm run test
```
if you do not want to save them to a file, you can run tests like this:
```bash
env IP='IP' PORT='PORT' ETH_ACCOUNT='ETH_ACCOUNT' 
ETH_PRIVATE_KEY='ETH_PRIVATE_KEY' npm test
```

#### Versioning

The version scheme for this repo is {major}.{minor}.{patch}*[]: 
For more details see: https://semver.org/

#### Lint

Conforming to linting rules is a prerequisite to commit to filestorage.js.
```bash
npm run lint
```

## Contributing

**If you have any questions please ask our development community on 
[Discord](https://discord.gg/vvUtWJB).**

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

#### Requirements
- Node.js v8
- npm

# License

![GitHub](https://img.shields.io/github/license/skalenetwork/filestorage.js.svg)

All contributions are made under the [GNU Lesser General Public 
License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). 
See [LICENSE](LICENSE).
