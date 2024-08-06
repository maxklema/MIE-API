const mie = require('../../index');

mie.URL.value = "";
mie.practice.value = "";
mie.username.value = ""
mie.password.value = "";

//create input JSON object with configurations for the migration
let inputJSON = {
    "username": "",
    "password": "",
    "handle": "",
    "url": "",
    "mapping": "one",
    "input_data": ["./DocsToUpload.csv"],
    "output_dir":  "./Upload Status",
    "threads": 4
}

//Upload all the documents in the CSV (see CSV file for details)
mie.migrateData(inputJSON);