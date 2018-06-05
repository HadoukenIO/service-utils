const { execSync } = require('child_process');
const path = require('path');
const packJson = require(path.resolve(process.cwd(), './package.json'));

// app name and build number are required
const args = process.argv.slice(2);
if (args.length<2) {
    console.log(`Missing required parameters, usage: node ${process.argv[1]} [app name] [build to promote]`);
    process.exit(1);
}
// obligatory version
let version = packJson['version'];
if (version.length <= 0) {
    console.log('missing version in package.json ?');
    process.exit(1);
}
const buildToPromote = args[1];
if (buildToPromote.length == 0) {
    console.log('Missing/blank build number to promote to production');
    process.exit(1);
}

// copy from staging folder to production folder on the CDN
const cdnSourcePath = 's3://cdn.openfin.co/services-staging/openfin/' + args[0] + '/' + version + '-' + buildToPromote
const cdnDestPath = 's3://cdn.openfin.co/services/openfin/' + args[0] + '/' + version

const deployCmd = `aws s3 cp ${cdnSourcePath} ${cdnDestPath} --recursive`;
console.log(`dep cmd: ${deployCmd}`)
//execSync(deployCmd, { stdio: [0,1,2]});
