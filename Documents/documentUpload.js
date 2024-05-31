const session = require('../Session Management/getCookie');
const fs = require('fs');
const error = require('../errors');
const axios = require('axios');
const { URL, practice } = require('../Variables/variables');
const { parse } = require('csv-parse/sync');
const log = require('../Logging/createLog');
const FormData = require('form-data');

//function for importing a single document
function uploadSingleDocument(filename, storageType, docType, patID, options = {subject: "", service_location: "", service_date: ""} ){

    cookie = session.getCookie();
    if (cookie != ""){

        let subject = "subject" in options ? options["subject"] : "";
        let service_date = "service_date" in options ? options["service_date"] : "";
        let service_location = "service_location" in options ? options["service_location"] : "";

        const mrnumber = `MR-${patID}`;

        const form = new FormData();
        form.append('f', 'chart');
        form.append('s', 'upload');
        form.append('storage_type', storageType);
        form.append('service_date', service_date);
        form.append('service_location', service_location);
        form.append('doc_type', docType);
        form.append('subject', subject);
        form.append('file', fs.createReadStream(filename));
        form.append('pat_id', patID);
        form.append('mrnumber', mrnumber);
        form.append('interface', 'WC_DATA_IMPORT');

        log.createLog("info", `Document Upload Request:\nDocument Type: \"${docType}\"\nStorage Type: \"${storageType}\"\n Patient ID: ${patID}`);
        axios.post(URL.value, form, {
            headers: {
                'Content-Type': 'multi-part/form-data', 
                'cookie': `wc_miehr_${practice.value}_session_id=${cookie}`
            }
        })
        .then(response => {
            const result = response.headers['x-status'];
            if (result != 'success'){
                console.log(`File \"${filename}\" failed to upload: ${response.headers['x-status_desc']}`);
                log.createLog("info", `Document Upload Response:\nFilename \"${filename}\" failed to upload: ${response.headers['x-status_desc']}`);
            } else {
                console.log(`File \"${filename}\" was uploaded: ${response.headers['x-status_desc']}`);
                log.createLog("info", `Document Upload Response:\nFilename \"${filename}\" was successfully uploaded: ${response.headers['x-status_desc']}`);
            } 
        })
        .catch(err => {
            log.createLog("error", "Bad Request");
            throw new error.customError(error.ERRORS.BAD_REQUEST, `There was a bad request trying to upload \"${filename}\". Error: ` + err);
        });

    } else {
        log.createLog("error", "Bad Request");
        throw new error.customError(error.ERRORS.BAD_REQUEST, '\"DocumentID\" must be of type int.');
    }

}

//import multiple documents through a CSV file
function uploadDocs(csv_file){

    csv_data_parsed = parseCSV(csv_file);
    const length = csv_data_parsed.length;

    //iterate over each document to upload
    for (i = 0; i < length; i++){
        uploadSingleDocument(csv_data_parsed[i]['document_name'], csv_data_parsed[i]['storage_type'], csv_data_parsed[i]['doc_type'], csv_data_parsed[i]['pat_id'], {subject: csv_data_parsed[i]['subject'], service_location: csv_data_parsed[i]['service_location'], service_date: csv_data_parsed[i]['service_date']});
    }

}

//parses CSV data and returns an array
function parseCSV(csv_file) {

    validHeaders = ['document_name', 'pat_id', 'doc_type', 'storage_type', 'subject', 'service_location', 'service_date'];

    //Sync operation
    const csv_raw_data = fs.readFileSync(csv_file, 'utf8');
    let results;
    try {
        results = parse(csv_raw_data, {
            columns: true,
            skip_empty_lines: true
        });
    } catch (err) {
        log.createLog("error", "Invalid CSV Headers");
        throw new error.customError(error.ERRORS.INVALID_CSV_HEADERS, `The headers in \"${csv_file}\" are not valid. They must be \'document_name\', \'pat_id\', \'doc_type\', and \'storage_type\'.`);
    }
    
    const headers = Object.keys(results[0]);
    const headersValid = validHeaders.every(header => headers.includes(header));
    if (!headersValid){ //invalid CSV headers
        log.createLog("error", "Invalid CSV Headers");
        throw new error.customError(error.ERRORS.INVALID_CSV_HEADERS, `The headers in \"${csv_file}\" are not valid. They must be \'document_name\', \'pat_id\', \'doc_type\', and \'storage_type\'.`);
    }

    return results;

}

module.exports = { uploadSingleDocument, uploadDocs };
