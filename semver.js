const semver = require('semver');
const fs = require('fs');
const cwd = process.cwd();
const packageJson = require(cwd + '/package');
const currentVersion = packageJson.version;
const increment = process.argv[2];
const contractsEnv = process.argv[3] || false;

const VERSION_INCREMENTS = ['prerelease', 'patch', 'minor', 'major'];
const CONTRACTS_ENVS = ['local', 'aws', 'server', 'test'];

function isIncrementValid(increment) {
  return VERSION_INCREMENTS.includes(increment);
}

function isEnvValid(env) {
  return CONTRACTS_ENVS.includes(env);
}

if (!increment || !isIncrementValid(increment)) {
  console.log(`Is not a valid semver: ${increment}, exiting...`);
  process.exit(1);
}

if (contractsEnv && !isEnvValid(contractsEnv)) {
  console.log(`Is not a contractsEnv: ${contractsEnv}, exiting...`);
  process.exit(1);
}

let newVersion = semver.inc(currentVersion, increment, contractsEnv);


packageJson.version = newVersion;
fs.writeFileSync(cwd + '/package.json', JSON.stringify(packageJson, null, '  '));

process.stdout.write(newVersion);
