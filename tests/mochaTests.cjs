const assert = require('assert'); 
const mie = require('../index.cjs');
const fs = require('fs');
const path = require('path');

mie.URL.value = process.env.URL;
mie.practice.value = process.env.PRACTICE;
mie.username.value = process.env.USERNAME;
mie.password.value = process.env.PASSWORD;
mie.GeminiKey.value = process.env.GEMINI_KEY;

mie.ledger.value = "false";

describe('MIE API TESTS', async () => {

    describe("Get Session ID", async () => {

        it("Get Cookie - Validate", async () => {

            await mie.getCookie();
            const cookie = mie.Cookie.value;
            assert.equal(cookie.length, 36);

        }).timeout(1000000); 
    })

    describe("Retrieve Records", async () => {
        
        it('Retrieve Records - No Fields', async () => {
            
            const data = await mie.retrieveRecord("patients", [], {pat_id: 18});

            assert.equal(data["meta"]["status"], "200");
            assert.equal(data['db'][0]['spouse_birthdate'], "1930-01-15 00:00:00");

        }).timeout(1000000);

        it('Retrieve Records - Fields', async () => {
            const data = await mie.retrieveRecord("patients", ["ssn", "home_phone"], {pat_id: 18})
            assert.equal(data['0']['ssn'], "111111111");
            assert.equal(data['0']['home_phone'], "2604440099");
            
        }).timeout(1000000);

        it('Retrieve Records - All Patient Data (Brief)', async () => {
            let JSON_data = {"patients":[{"value":"Rogers","active":"1","address1":"1026 Waverley St.","address2":"","address3":"","alternate_phone":"","attending_physician":"0","birth_date":"1980-07-02 00:00:00","cell_phone":"6504592627","cellco_id":"0","chart_online":"0","city":"Palo Alto","country":"US","county":"","create_date":"2015-08-24 15:25:57","dea_number":"","death_date":"0000-00-00 00:00:00","death_indicator":"0","degree":"","edit_date":"2016-01-28 15:54:29","email":"crogers@bettercorp.com","emergency_contact":"Jay McDonald","emergency_phone":"(650) 821-1416","employer_addr1":"1700 Amphitheatre Parkway","employer_addr2":"","employer_addr3":"","employer_city":"Mountain View","employer_country":"US","employer_county":"Santa Clara","employer_name":"Better Corp.","employer_state":"CA","employer_uid":"","employer_zipcode":"94043","employment_status":"","extern_id1":"","family_physician":"0","fax_number":"","first_name":"Cory","first_name_phn":"26","gurantor_id":"","home_phone":"6504256321","interface":"Unknown","is_patient":"1","is_tmp":"0","last_name":"Rogers","last_name_phn":"6762","license_number":"","marital_status":"S","middle_name":"","nat_pro_id":"","pager":"","pat_id":"51","preferred_alert_method":"1","preferred_first_name":"","race":"","referring_physician":"0","revised_by":"2","revision_number":"0","sex":"M","signature_date":"0000-00-00 00:00:00","sin":"","spouse_birthdate":"0000-00-00 00:00:00","spouse_name":"","ssn":"210658124","state":"CA","suffix":"","tax_id_number":"","title":"","universal_id":"","username":"case","work_phone":"6504596270","zip_code":"94301"}],"patient_conditions":[],"patient_conditions_family":[],"patient_procedures":[],"patient_targets":[],"incidents":[],"incidents_revision":[],"encounter_orders":[],"encounter_orders_revisions":[],"encounters":[],"encounters_current":[],"rxlist":[],"rxlist_allergylist":[],"documents":[],"print_queue_multi":[],"pat_chart_types":[],"pat_pat_relations":[{"create_date":"2023-04-24 13:30:24","create_user_id":"2","end_date":"9999-01-01","modified_date":"2023-04-24 13:30:24","modified_user_id":"2","pat_id":"51","pat_rel_id":"36","related_pat_id":"43","relation_type_id":"15","revision_num":"0","start_date":"2016-02-02"},{"create_date":"2016-07-21 15:54:28","create_user_id":"2","end_date":"9998-07-10","modified_date":"2016-01-19 15:55:52","modified_user_id":"2","pat_id":"51","pat_rel_id":"16","related_pat_id":"43","relation_type_id":"30","revision_num":"0","start_date":"2016-01-19"}],"insurance_policy":[],"observations":[{"obs_id":"2183","request_id":"84","obs_code":"2930","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:00","obs_order":"0","obs_result":"R5","obs_range":"","obs_name":"Race","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"WEBCHART","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:00"},{"obs_id":"2185","request_id":"0","obs_code":"828","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"E2","obs_range":"","obs_name":"Ethnicity","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"},{"obs_id":"3651","request_id":"84","obs_code":"6823","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:00","obs_order":"0","obs_result":"White","obs_range":"","obs_name":"CDC Race","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"WEBCHART","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:00"},{"obs_id":"3673","request_id":"0","obs_code":"6824","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"Not Hispanic or Latino","obs_range":"","obs_name":"CDC Ethnicity","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"},{"obs_id":"2184","request_id":"0","obs_code":"827","template_id":"1.3.6.1.4.1.19376.1.5.3.1.3.16","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"English","obs_range":"","obs_name":"Language","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"}],"accommodations":[]}
            const data = await mie.getAllPatientRecords(51, { length: "concise" });
            assert.equal(data, JSON.stringify(JSON_data));
            
        }).timeout(1500000);

        it('Concatenate Records', async () => {
            
            let JSON_data = {patients: { '0': { pat_id: '18' } },documents: {'0': { pat_id: '6', doc_id: '4', storage_type: '8' },'1': { pat_id: '6', doc_id: '116', storage_type: '21' }}};

            const data = await mie.getCustomRecords(["patients", "documents"], [["pat_id"], ["doc_id", "storage_type"]], [{ pat_id: 18}, {pat_id: 6}], 0);

            assert.equal(JSON.stringify(data), JSON.stringify(JSON_data));

        }).timeout(2500000);

    });

    describe('AI Tests', function() {

        const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

        before(function() {
            if (nodeVersion < 18){
                this.skip();
            }
        });

        it('Summarize Patient - AI', async function() {
            const data = await mie.summarizePatient(18);
            assert.equal(typeof data, 'string');
        }).timeout(25000);


        it('Query Patient - AI', async function() {
            const data = await mie.queryPatient(18, "Does this patient have insurance?");
            assert.equal(typeof data, 'string');
        }).timeout(25000);

    });

    describe("Update Records", async () => {

        it("Update Patient", async () => {
            
            //update to Paul first to clear previous tests
            let data_to_update = {
                "first_name": "Paul",
                "ssn": "00000000",
            };

            mie.updateRecord("patients", { pat_id: 43 }, data_to_update);

            //update with new data
            let new_data = {
                "first_name": "Max",
                "ssn": "123456789",
            };

            setTimeout(async () =>  {
                mie.updateRecord("patients", { pat_id: 43 }, new_data);

                data = await mie.retrieveRecord("patients", ["ssn", "first_name"], { pat_id: 43});

                assert.equal(data['0']['ssn'], "123456789");
                assert.equal(data['0']['first_name'], "Max");

            }, 3000);
        }).timeout(100000);

    });

    describe("New Records", async () => {

        it("New observation", async () => {

            const data = {
                "obs_name": "BP Site",
                "obs_result": "Left Arm",
                "obs_code": "227",
                "pat_id": 14,
            }

            mie.createRecord("observations", data);

            const patient_data = await mie.retrieveRecord("observations", ["obs_code", "obs_name", "obs_result"], { });

            assert.equal(patient_data[Object.keys(patient_data).length-1]['obs_name'], "BP Site");
            assert.equal(patient_data[Object.keys(patient_data).length-1]['obs_result'], "Left Arm");
            assert.equal(patient_data[Object.keys(patient_data).length-1]['obs_code'], "227");

        }).timeout(1000000);

        it("New Patient", async () => {

            const data = {
                "first_name": "Autumn",
                "last_name": "Baker",
                "address1": "MIE Office"
            }

            mie.createRecord("patients", data);

            const patient_data = await mie.retrieveRecord("patients", ["first_name", "last_name", "address1"], { });


            assert.equal(patient_data[Object.keys(patient_data).length-1]['first_name'], "Autumn");
            assert.equal(patient_data[Object.keys(patient_data).length-1]['last_name'], "Baker");
            assert.equal(patient_data[Object.keys(patient_data).length-1]['address1'], "MIE Office");

        }).timeout(1000000);

    });

    describe("Ledger Functionality", async function() {

        afterEach(function() {
           
            //delete Ledgers
            const logDirectory = path.join(__dirname, '../Logs');
            fs.rmSync(logDirectory, {recursive: true, force: true});
            mie.ledger.value = "false";
            
        });

        it("Write to info.log", async function() {

            //create the ledger
            mie.ledger.value = "true";
            const options = {
                "levels": ["info", "error"],
                "format": ["levels"],
                "storage": ["./Logs/info.log", "./Logs/errors.log"],
                "log_returned_data": "false"
            }
            mie.createLedger(options);

            //Write to the ledger
            await mie.retrieveRecord("patients", ["first_name"], { pat_id: 18 });

            //Read from the ledger
            const logFilePath = path.join(__dirname, "../Logs/info.log");
            const data = fs.readFileSync(logFilePath, "utf8");
            let expectedData = "[info]: Record Retrieval Request:\nRequest URL: \"https://mieinternprac.webchartnow.com/webchart.cgi/json/R0VUL2RiL3BhdGllbnRzL3BhdF9pZD0xOA==\"\nEndpoint: \"patients\"\nQuery By: {\"pat_id\":18}\n[info]: Record Retrieval Response\n";
            assert.equal(data, expectedData);


        });

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

        it("Downloading Documents", async function() {

            //download Documents
            await mie.downloadDocs({ doc_id: 29 }, "mocha_downloads", 0);
            await mie.downloadDocs({ doc_id: 299 }, "mocha_downloads", 0);

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await delay(1000);

            //get Success.CSV file
            const fPath = path.join(__dirname, "../Download Status/success.csv");
            const fileContent = fs.readFileSync(fPath, "utf8");

            //split the content into lines
            const lines = fileContent.split("\n");
            assert.equal(lines[1], "mocha_downloads/Hart_29.jpg,29,SUCCESS");
            assert.equal(lines[2], "mocha_downloads/Hart_299.tif,299,SUCCESS");

        }).timeout(1000000);

    })


});