const assert = require('assert'); 
const mie = require('../index.cjs');
const fs = require('fs');
const path = require('path');
const os = require('os');

mie.URL.value = process.env.URL;
mie.practice.value = process.env.PRACTICE;
mie.username.value = process.env.USERNAME;
mie.password.value = process.env.PASSWORD;

mie.ledger.value = "false";

describe("UPLOADING DOCUMENTS - MAPPING ONE", async () => {

    describe("Get Session ID", async () => {

        it("Get Cookie - Validate", async () => {

            await mie.getCookie();
            const cookie = mie.Cookie.value;
            assert.equal(cookie.length, 36);

        }).timeout(1000000); 
    })

    describe("Documents", async function() {

        afterEach(function() {
            
            //delete files and statuses
            const fileDirectory = path.join(__dirname, '../mocha_downloads');
            const DstatusDirectory = path.join(__dirname, '../Download Status');
            const UstatusDirectory = path.join(__dirname, '../Upload Status');
            fs.rmSync(fileDirectory, {recursive: true, force: true});
            fs.rmSync(DstatusDirectory, {recursive: true, force: true});
            fs.rmSync(UstatusDirectory, {recursive: true, force: true});
            try {
                fs.renameSync(path.join(__dirname, './Upload Test/Documents/Doe2.html'), path.join(__dirname, './Upload Test/Documents/Doe2.htm'));
            } catch (e) {
                //nothing
            }
            
        })

        it('Uploading Documents - Header Variation One', async function() {

            //upload docs
            docCSV_Path = path.join(__dirname, "Upload Test/docsToUpload.csv");
        
            await mie.uploadDocs(docCSV_Path);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await delay(2000);
            
            //get success.csv file
            const fPath = path.join(__dirname, "../Upload Status/success.csv");
            const fileContent = fs.readFileSync(fPath, "utf8");

            //split the content into lines
            const lines = fileContent.split("\n");

            let success = [lines[1], lines[2], lines[3], lines[4]];
            let expected = ["tests/Upload Test/Documents/Doe.html,14,null,Success", "tests/Upload Test/Documents/Doe_116.ccr,18,null,Success", "tests/Upload Test/Documents/autumn.jpg,18,null,Success", "tests/Upload Test/Documents/bill.jpg,14,null,Success"];

            assert.deepEqual(success.sort(), expected.sort());
        

        }).timeout(1000000);



    })

});