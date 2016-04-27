# Serverless ECR Cleaner
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1689118/14857262/899bbf5e-0c69-11e6-89fb-e5f9789e32bf.png" />
</p>

## Setup
Requires Serverless to be installed (Project currently Serverless v0.5.x)

`git clone https://github.com/trek10inc/ecr-cleaner`

With admin credentials for your account in the cloned directory
`serverless project init`

Otherwise, generate CF template and deploy resources manually with console
`serverless project init -c` (Doesn't execute CF, just generates it)

Install Dependencies
`cd main && npm install`


Setup environment variables...

```
# _meta/s-variables-common.json

{
  "project": "ecr-cleaner",
  "projectBucket": "serverless.us-east-1.ecr-cleaner",
  "domain": "ecr-cleaner",
  "notificationEmail": "johndoe@example.com",
  "region": "us-east-1",
  "repoToClean": "ecr-cleanup-target",
  "repoRegion": "us-east-1", // DEFAULT
  "ecsRegion": "us-east-1", // DEFAULT
  "repoAgeThreshold": 90, // DEFAULT
  "awsAccountId": "123456789012"
}
```


```
# main/s-function.json

{
  "name": "main",
  ....
  // If you want to make changes to the schedule ECR cleaner runs on
  //   do so here. Details on scheduled events at
  //   http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
  "events": [{
      "name" : "dailyRun",
      "type": "schedule",
      "config": {
         "schedule": "rate(1 day)",
         "enabled": true
      }
    }],
  "environment": {
    "SERVERLESS_PROJECT": "${project}",
    "SERVERLESS_STAGE": "${stage}",
    "SERVERLESS_REGION": "${region}",
    "AWS_ACCOUNT_ID": "${awsAccountId}",
    "REPO_REGION": "${repoRegion}",
    "ECS_REGION": "${ecsRegion}",
    "REPO_AGE_THRESHOLD": "${repoAgeThreshold}",
    "REPO_TO_CLEAN": "${repoToClean}"
  },
  ....
}

```

## Deploy
`sls dash deploy`

## Dry Run

To test and make sure things are working as you expect before deleting a whole bunch
of images you can pass in a dry run options as part of the lambda event either via the
console or when running locally.

```
# main/event.json
{
	"dryRun":true
}

// Local run command: serverless function run main -s dev
```

# Many Thanks

Many thanks to [Stephen Ennis](https://github.com/stennisTCD) and [OffGrid Electric](http://offgrid-electric.com/) for their help and contributions to this project!
