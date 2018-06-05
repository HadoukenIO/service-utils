const path = require('path');
const fs   = require('fs');

const args = process.argv.slice(2);
if (args.length<1) {
    console.log('Missing app name');
    process.exit(1);
}

const appName = args[0];
const outputFile = path.resolve(process.cwd(), "Jenkinsfile-" + appName);

const contents = `node ('james-bond') {

    properties([
        parameters([
            choiceParam(
                choices: 'staging\\nproduction',
                description: 'which environment to deploy to',
                name: 'DEPLOY_TYPE'
            ),
            stringParam(
                defaultValue: 'develop',
                description: 'branch to build (staging only)',
                name: 'GIT_BRANCH'
            ),
            stringParam(
                defaultValue: '',
                description: 'build number to promote to production',
                name: 'BUILD_TO_PROMOTE'
            ),
        ])
    ])

    stage ('checkout'){
        checkout scm
        if (params.DEPLOY_TYPE != 'production') {
            dir('d-service') {
                git branch: params.GIT_BRANCH, url: 'https://github.com/HadoukenIO/${appName}-service.git'
            }
        }
    }

    stage ('build'){
        if (params.DEPLOY_TYPE != 'production') {
            sh "cd ./d-service/ && npm i"
            sh "cd ./d-service/ && npm run build"
            GIT_SHORT_SHA = sh ( script: "cd ./d-service/ && git rev-parse --short HEAD", returnStdout: true ).trim()
            sh "echo \${GIT_SHORT_SHA} > ./d-service/dist/SHA.txt"
        }
    }

    stage ('deploy'){
        if (params.DEPLOY_TYPE != 'production') {
            sh "cd ./d-service/ && node ../deploy-staging.js ${appName} " + env.BUILD_NUMBER
        } else {
            sh "cd ./d-service/ && node ../deploy-prod.js ${appName} " + params.BUILD_TO_PROMOTE
        }
    }
}`;

fs.writeFile(outputFile, contents, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 