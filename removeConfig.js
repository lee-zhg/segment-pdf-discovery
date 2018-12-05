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


// remove configuration(s) of the Discovery service
removeConfiguration(discovery, params).then(function (data) {
  if (data.failed) {
    console.error("Failed to remove Discovery configuration: " + data.to_delete_array);
  } else {
    console.error("Successfully removed new configuration: " + data.to_delete_array);
  }
}).catch((error) => {
  console.error(error);
  console.error("Failed to remove Discovery configuration: " + data.to_delete_array);
});


/**
 * Remove Discovery configuration
 * @param {Object} discovery - Discovery service wrapper
 * @param {Object} params - blank object
 * @return {Promise} Promise with resolve({enhanced discovery params}) or reject(err).
 */
function removeConfiguration(discovery, params) {
  return new Promise((resolve, reject) => {

    console.log('Removing collection config');
    var to_delete = process.env.DISCOVERY_CONFIG_DELETE;
    var to_delete_array = to_delete.split(",");
    params.environment_id = process.env.DISCOVERY_ENVIRONMENT_ID;
    params.to_delete_array = to_delete_array;

    //console.log("++++++++++++++++++++++");
    //console.log(to_delete_array);
    //console.log("++++++++++++++++++++++");

    // Retrieve all configurations
    discovery.listConfigurations(params, (err, data) => {
      if (err) {
        params.failed = true;
        console.error(err);
        return reject(new Error('Failed to get create Discovery configuration.'));
      } else {
        //console.log("++++++++++++++++++++++");
        //console.log(JSON.stringify(data, null, 2));
        //console.log("++++++++++++++++++++++");
        //console.log(data.configurations[0].name);
        //console.log(data.configurations.length);
        console.log("Total configuration count=" + data.configurations.length);

        // Loop through each configuration
        for (var i = 0; i < data.configurations.length; i++) { 
          console.log(data.configurations[i].name);
          console.log(data.configurations[i].configuration_id);

          if (to_delete_array.includes(data.configurations[i].name)){
            console.log("==================");
            delete params.configuration_id;
            params.configuration_id = data.configurations[i].configuration_id;
        
            discovery.deleteConfiguration(params, (err, data) => {
              if (err) {
                params.failed = true;
                console.error(err);
                return reject(new Error('Failed to delete Discovery configuration.'));
              } else {
                console.log("++++++++++++++++++++++");
                console.log(JSON.stringify(data, null, 2));
                console.log("++++++++++++++++++++++");
            
                return resolve(params);
              }
            });
          }
        }




        return resolve(params);
      }
    });
  });
};


