const { URL, practice, username, password, cookie } = require('../Variables/variables.cjs');
const path = require('path');
const { error } = require('console');
const uploadDocs = require('./documentUpload.cjs');
const { createRecord } = require('./../Create Records/requests_POST.cjs');

const migrateData = async (inputJSON) => {

    //constants
    let configJSON;

    const getFilePaths = (configJSON) => {

        let filePaths = {};

        for (let i = 0; i < configJSON["input_data"].length; i++){
            filePaths[i] = {};
            filePaths[i]["dirname"] = path.dirname(configJSON["input_data"][i]);
            filePaths[i]["basename"] = path.basename(configJSON["input_data"][i]);

            //ensure each file is a CSV
            if (!(filePaths[i]["basename"].toLowerCase()).endsWith(".csv")){
                throw error(`ERROR: All input files must be of type \'.csv\'. Received \'${filePaths[i]["basename"]}\' instead`);
            }

        }
        return filePaths;
    }

    ( async () => {
        
        //Read JSON Input File
        configJSON = inputJSON;
        
        //Generate Session Token
        username.value = username.value || configJSON["username"]; 
        password.value = password.value || configJSON["password"]; 
        practice.value = practice.value || configJSON["handle"];
        URL.value = URL.value || configJSON["URL"];

        process.stdout.write(`${'\x1b[33m➜\x1b[0m'} Getting Session ID... \r`)
        await createRecord("patients", { "first_name": "test"});
        console.log(`${'\x1b[1;32m✓\x1b[0m'} Received Session ID: ${cookie.value}`);

        //parsing file paths for input_data
        let filePaths = getFilePaths(configJSON);
        console.log(`${'\x1b[1;32m✓\x1b[0m'} parsed all .csv input file paths`);

        // pass in the CSV
        await uploadDocs.uploadDocs(filePaths, configJSON);

    })();

}

module.exports = { migrateData };