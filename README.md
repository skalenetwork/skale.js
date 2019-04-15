# SKALE JS API library

[![Build Status](https://travis-ci.com/skalenetwork/skale.js.svg?token=VyxyB39zs82QAe5RAZya&branch=develop)](https://travis-ci.com/skalenetwork/skale.js)
[![codecov](https://codecov.io/gh/skalenetwork/skale.js/branch/develop/graph/badge.svg?token=fZeTTl2yaf)](https://codecov.io/gh/skalenetwork/skale.js)



SKALE client tools.  
You can use this library to develop browser and Node.js applications that use Skale.

## Installation

#### NPM

```bash
npm install @skalenetwork/skale-api
```

#### Yarn

```bash
yarn add @skalenetwork/skale-api
```

## API Documentation

You can find documentation for the current version here:

## Contribution

#### Requirements
- Node.js
- npm

#### Build

```bash
bash build_and_publish.sh patch/minor/major
```

##### Building for specific env

```bash
bash build_and_publish.sh prerelease local/aws/server/test
```

##### Bump version without rebuilding sources

```bash
node semver.js minor
# or
node semover.js prerelease aws
```


#### Testing (mocha)

```bash
npm run test
```


### Versioning

The version format for this repo is `{major}.{minor}.{patch}` for stable, and `{major}.{minor}.{patch}-{stage}.{devnum}` for unstable (stage can be `alpha` or `beta`).

For more details see: https://semver.org/
