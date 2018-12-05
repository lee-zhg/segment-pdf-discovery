/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require('dotenv').config();

var request = require('request');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var params={};

// retrieve environment variables
var dis_username = process.env.DISCOVERY_USERNAME;
var dis_password = process.env.DISCOVERY_PASSWORD;
var dis_version = process.env.DISCOVERY_VERSION_DATE;
var dis_url = process.env.DISCOVERY_URL;
var dis_env = process.env.DISCOVERY_ENVIRONMENT_ID;
var dis_collection = process.env.DISCOVERY_COLLECTION_ID;
var dis_apikey = process.env.DISCOVERY_IAM_APIKEY;


// Create the Discovery service wrapper

// IAM authentication, either IAM authentication or Basic authentication
/*
var discovery = new DiscoveryV1({
  version: dis_version,
  iam_apikey: dis_apikey,
  url: dis_url
});
*/

// Basic authentication, either IAM authentication or Basic authentication
var discovery = new DiscoveryV1({
  version: dis_version,
  username: dis_username,
  password: dis_password,
  url: dis_url
});


// create custom configuration of the Discovery service
createConfiguration(discovery, params).then(function (data) {
  if (data.configuration_id) {
    console.error("Successfully created new configuration: " + data.name);
  } else {
    console.error("Failed to create new configuration: " + data.name);
  }
}).catch((error) => {
  console.error(error);
  console.error("Failed to create new configuration: " + data.name);
});


/**
 * Create a Discovery configuration that extracts keywords.
 * @param {Object} discovery - Discovery service wrapper
 * @param {Object} params - blank object
 * @return {Promise} Promise with resolve({enhanced discovery params}) or reject(err).
 */
function createConfiguration(discovery, params) {
  return new Promise((resolve, reject) => {

    // read Discovery configuration from file
    var configuration_file = 'pdfSegmentConfig.json';
    if (process.env.DISCOVERY_CONFIGURATION_FILE !== undefined) {
      // if defined, override with value from .env
      configuration_file = process.env.DISCOVERY_CONFIGURATION_FILE;
    }

    const fs = require('fs');
    let rawdata = fs.readFileSync(configuration_file);  
    let config = JSON.parse(rawdata);  
    //console.log(JSON.stringify(config, null, 2));

    console.log('Creating collection config');
    params.name = config.name;
    params.description = config.description;
    params.environment_id = process.env.DISCOVERY_ENVIRONMENT_ID;

    // conversions is defined based on configuration file
    params.file = config;
    //console.log("++++++++++++++++++++++");
    //console.log(JSON.stringify(params, null, 2));
    //console.log("++++++++++++++++++++++");

    discovery.createConfiguration(params, (err, data) => {
      if (err) {
        console.error(err);
        return reject(new Error('Failed to get create Discovery configuration.'));
      } else {
        //console.log("++++++++++++++++++++++");
        //console.log(JSON.stringify(params['file'], null, 2));
        //console.log("++++++++++++++++++++++");
        // clear out temp fields so we are clean for additional disco calls
        //delete params['name'];
        //delete params['file'];
        //console.log(JSON.stringify(data, null, 2));
        params.configuration_id = data.configuration_id;
        //console.log("++++++++++++++++++++++data.configuration_id");
        //console.log("++++++++++++++++++++++params.configuration_id");
        
        return resolve(params);
      }
    });
  });
};


