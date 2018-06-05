const { execSync } = require('child_process');
const path = require('path');
const packJson = require(path.resolve(process.cwd(), './package.json'));

// app name and build number are required
const args = process.argv.slice(2);
if (args.length<2) {
    console.log(`Missing required parameters, usage: node ${process.argv[1]} [app name] [build number]`);
    process.exit(1);
}
// package.json must also have a version
let version = packJson['version'];
if (version.length <= 0) {
    console.log('missing version in package.json ?');
    process.exit(1);
}
if (args[1] !== "") {
    version += '-' + args[1];
}

// simply copy the dist directory up to the CDN
const distLoc = path.resolve(process.cwd(), './dist');
const s3Loc = 's3://cdn.openfin.co/services-staging/openfin/' + args[0] + '/' + version;

const deployCmd = `aws s3 cp ${distLoc} ${s3Loc}/ --recursive`;
execSync(deployCmd, { stdio: [0,1,2]});
