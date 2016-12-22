'use strict';

var lib = require('./lib');

// Lambda Handler
module.exports.handler = function(event, context) {

  // Check event for dry run, which prevents actual deletion
  // check logs to see what would have been deleted
  console.log(event);
  if(event.dryRun){
    process.env.DRY_RUN = true;
  } else {
    process.env.DRY_RUN = false;
  }

  if(!process.env.AWS_ACCOUNT_ID){
    console.warn('WARN: NO AWS_ACCOUNT_ID, defaulting to current account');
    process.env.AWS_ACCOUNT_ID = context.invoked_function_arn.split(':')[4];
  }

  if(!process.env.REPO_REGION){
    console.warn('WARN: NO REPO_REGION, defaulting to us-east-1');
    process.env.REPO_REGION = 'us-east-1';
  }

  if(!process.env.ECS_REGION){
    console.warn('WARN: NO ECS_REGION, defaulting to us-east-1');
    process.env.ECS_REGION = 'us-east-1';
  }

  if(!process.env.REPO_AGE_THRESHOLD){
    console.warn('WARN: NO REPO_AGE_THRESHOLD, defaulting to 90 days');
    process.env.REPO_AGE_THRESHOLD = 90;
  }

  if(!process.env.ECS_CONCURRENCY){
    console.warn('WARN: NO ECS_CONCURRENCY, defaulting to 10 concurrent promises');
    process.env.ECS_CONCURRENCY = 10;
  }

  if(!process.env.API_DELAY){
    console.warn('WARN: NO API_DELAY, defaulting to 500 milliseconds');
    process.env.API_DELAY = 500;
  }

  if(!process.env.REPO_TO_CLEAN){
    console.error('ERROR: NO REPO_TO_CLEAN, must be set');
    return context.fail(new Error('Must set REPO_TO_CLEAN'));
  }

  var params = {
    repositoryName: process.env.REPO_TO_CLEAN
  };

  lib.getRepoImages(params)
    .then(lib.filterImagesByDateThreshold)
    .then(lib.filterOutActiveImages)
    .then(lib.deleteImages)
    .then(context.succeed)
    .catch(context.fail);
};
