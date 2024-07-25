const session = require('../Session Management/getCookie.cjs');
const fs = require('fs');
const { URL, practice, cookie } = require('../Variables/variables.cjs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const log = require('../Logging/createLog.cjs');
const { Worker } = require('worker_threads');
const path = require('path');
const os = require("os");
const { pipeline } = require('stream/promises');
const error = require('../errors.cjs');
const stream = require('stream');

const MAX_WORKERS = os.cpus().length;
const processedFiles = new Set();

// success file CSV writer
const successCSVWriter = createCsvWriter({
    path: './Upload Status/success.csv',
    header: [
        {id: 'file', title: 'FILE'},
        {id: 'patID', title: 'PAT_ID'},
        {id: 'status', title: 'STATUS'}
    ],
    append: true
});

// Error file CSV Writer
const errorCSVWriter = createCsvWriter({
    path: './Upload Status/errors.csv',
    header: [
        {id: 'file', title: 'FILE'},
        {id: 'patID', title: 'PAT_ID'},
        {id: 'status', title: 'STATUS'}
    ],
    append: true
});

//gather already-uploaded files
async function loadFiles(){
    if (fs.existsSync("./Upload Status/success.csv")){
        return new Promise((resolve, reject) => {
            fs.createReadStream("./Upload Status/success.csv")
                .pipe(csv())
                .on('data', (row) => {
                    if (row){
                        //adds files already uploaded to a set
                        processedFiles.add(getKey({file: row.FILE, pat_id: row.PAT_ID}));
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        })
    } else {
        fs.writeFile("./Upload Status/success.csv", "FILE,PAT_ID,STATUS\n", 'utf8', () => {});
    }
}

function getKey(obj){
    return JSON.stringify(obj);
}

//import multiple documents through a CSV file
async function uploadDocs(csv_file){
    
    if (cookie.value == ""){
        await session.getCookie();
    }

    if (!fs.existsSync("./Upload Status")){
        fs.mkdirSync("./Upload Status", { recursive: true} )
    }
    
    //create errors.csv file if one does not already exist
    if (!fs.existsSync("./Upload Status/errors.csv")){
        fs.writeFile("./Upload Status/errors.csv", "FILE,PAT_ID,STATUS\n", 'utf8', () => {});
    }

    await loadFiles();
    const headers = [];
    const docQueue = [];
    let workerPromises = [];
    const success = [];
    const errors = [];
    const csvParser = csv({
        mapHeaders: ({ header }) => {
            headers.push(header);
            return header;
        }
    });

    //grabs all of the headers from the CSV file.
    csvParser.on('error', (err) => {
        log.createLog("error", "Bad Request");
        throw new error.customError(error.CSV_PARSING_ERROR,  `There was an error parsing your CSV file. Make sure it is formatted correctly. Error: ${err}`);
    })

    await pipeline(
        fs.createReadStream(csv_file),
        csvParser,
        new stream.Writable({
            objectMode: true,
            write(row, encoding, callback) {
                //if row is header, store it in an array
                if (!processedFiles.has(getKey({file: row.document_name, pat_id: row.pat_id}))){
                    processedFiles.add(getKey({file: row.document_name, pat_id: row.pat_id}));
                    docQueue.push(row); //push to queue for workers
                }
                callback();
            }
        })
    );

    for (i = 0; i < MAX_WORKERS; i++){
        const addWorker = new Promise((resolve) => {

            function newWorker(){
                const row = docQueue.shift();
                console.log(row);
                if (!row){
                    resolve();
                    return;
                }

                const worker = new Worker(path.join(__dirname, "/Parallelism/uploadDoc.cjs"), { workerData: {row: row, URL: URL.value, Cookie: cookie.value, Practice: practice.value}})
    
                worker.on('message', (message) => {
                    if (message.success == true){ 
                        log.createLog("info", `Document Upload Response:\nFilename \"${message.filename}\" was successfully uploaded: ${message.result}`);
                        success.push({ file: row.document_name, patID: row.pat_id, status: 'Success'});
                        newWorker();
                    } else if (message.success == false) {
                        log.createLog("info", `Document Upload Response:\nFilename \"${message.filename}\" failed to upload: ${message.result}`);
                        errors.push({ file: row.document_name, patID: row.pat_id, status: 'Failed Upload'})
                        newWorker();
                    } else {
                        log.createLog("error", "Bad Request");
                        errors.push({ file: row.document_name, patID: row.pat_id, status: `Failed Upload - Bad Request: ${message.result}`})
                        newWorker();
                    }
                });
            }
            newWorker();
        })
        workerPromises.push(addWorker);
    }

    await Promise.all(workerPromises)
    console.log("Upload Document Job Completed.");

    //write results to appropriate CSV file
    if (success.length != 0){
        successCSVWriter.writeRecords(success);
    }
    if (errors.length != 0){
        errorCSVWriter.writeRecords(errors);  
    }

}

module.exports = { uploadDocs };
