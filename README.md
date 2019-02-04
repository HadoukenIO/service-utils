# desktop-services
all things common across desktop services - build/deploy utils, etc.

## what do we have here exactly?

so far, just jenkins jobs and deploy scripts.  this would also be the ideal place for any common testing utilities, etc.

### conventions
1. all versioning is handled by the service via it's package.json
1. *staging* means an envrionment (equivalent to another CDN location:  https://cdn.openfin.co/services-staging/)
1. *staging* env is used to show the next version of the service 
1. *production* aka stable is merely another cdn location: https://cdn.openfin.co/services-staging/
1. jenkins differentiates between the environments when considering them as deploy targets:
    - jobs run in *staging* mode do a clean build (rm -Rf node_modules && npm i && npm run build)
    - jobs run in *staging* mode allow selection of branch to deploy
    - jobs run in *staging* mode deploy to staging CDN location and use a build number suffix, ex: 0.2.3-45
    - jobs run in production mode skip the build/test and run a special production deploy
    - jobs run in production mode copy (s3) from the staging CDN location to the production location (trimming the build number in the process)

## adding a new service

Adding a service starts with a Jenkinsfile where you define the steps of the service's build/test/deploy pipeline.  Looking at the notifications file as an example, you'll first see three parameters for the job:

1. the *staging* vs *production* selector
2. the git branch of the service to run the job on (only used for *staging*)
2. the build number to promote from staging to production (only used for *production*)
The job params are followed by the 3 build steps:
1. checkout - grabs the files in this repo and also checks out the service itself (unless its a prod build)
1. build - does the actual install/compile/testing, etc (unless its a prod build)
1. deploy - this is handled by two diff files to make things a bit more explicit
    - deploy-staging.js - handles going from locally built/staged files up to the staging CDN
    - deploy-prod.js - handles going from the staging CDN to the prod CDN

The quickest way to get started is to use the included helper script to generate a Jenkinsfile:
```
node genJenkinsfile.js name-of-the-new-service
```

Now that you have the new service's Jenkinsfile, simply fork this repo and add it.  Next, create a job on the jenkins server, use a pipeline job and be sure to click "this job is parameterized".  Configure the pipeline to point to the new fork with path to the new Jenkinsfile.  Run the job and run like ...


## License
The code in this repository is covered by the included license.

However, if you run this code, it may call on the OpenFin RVM or OpenFin Runtime, which are covered by OpenFin's Developer, Community, and Enterprise licenses. You can learn more about OpenFin licensing at the links listed below or just email us at support@openfin.co with questions.

https://openfin.co/developer-agreement/
https://openfin.co/licensing/


