import assert from 'assert'; 
import mie from '../index.cjs';

mie.URL.value = process.env.URL;
mie.practice.value = process.env.HANDLE;
mie.username.value = process.env.USERNAME;
mie.password.value = process.env.PASSWORD;
mie.GeminiKey.value = process.env.GEMINI_KEY;

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
            let JSON_data = {"patients":[{"value":"Smith","active":"1","address1":"2300 Commonwealth Avenue","address2":"","address3":"","alternate_phone":"","attending_physician":"0","birth_date":"1931-11-08 00:00:00","cell_phone":"","cellco_id":"0","chart_online":"0","city":"Anytown","country":"US","county":"","create_date":"2010-02-03 21:31:38","dea_number":"","death_date":"0000-00-00 00:00:00","death_indicator":"0","degree":"","edit_date":"2022-03-21 07:51:01","email":"anyone@aol.com","emergency_contact":"","emergency_phone":"","employer_addr1":"","employer_addr2":"","employer_addr3":"","employer_city":"","employer_country":"US","employer_county":"","employer_name":"","employer_state":"IN","employer_uid":"","employer_zipcode":"","employment_status":"","extern_id1":"","family_physician":"0","fax_number":"","first_name":"Theodore","first_name_phn":"","gurantor_id":"","home_phone":"2405551212","interface":"Webchart","is_patient":"1","is_tmp":"0","last_name":"Smith","last_name_phn":"","license_number":"","marital_status":"W","middle_name":"S.","nat_pro_id":"","pager":"","pat_id":"13","preferred_alert_method":"0","preferred_first_name":"","race":"R5","referring_physician":"0","revised_by":"8","revision_number":"0","sex":"M","signature_date":"0000-00-00 00:00:00","sin":"","spouse_birthdate":"0000-00-00 00:00:00","spouse_name":"","ssn":"","state":"MD","suffix":"","tax_id_number":"","title":"","universal_id":"","username":"","work_phone":"","zip_code":"22222"}],"patient_conditions":{"0":{"pat_id":"13","description":"Arthritis"},"1":{"pat_id":"13","description":"Hypertension"},"2":{"pat_id":"13","description":"Hyperlipidemia"},"3":{"pat_id":"13","description":"Benign Localized Prostate Hyperplasia Without Obstruction and Lower Urinary Tract Symptoms (LUTS)"},"4":{"pat_id":"13","description":"Type 2 diabetes mellitus without complications"},"5":{"pat_id":"13","description":"Hypothyroidism"},"6":{"pat_id":"13","description":"GERD - Gastro-esophageal reflux disease"},"7":{"pat_id":"13","description":"Cholecystitis, unspecified"},"8":{"pat_id":"13","description":"Appendicitis"},"9":{"pat_id":"13","description":"Cataract"}},"patient_conditions_family":{"0":{"pat_id":"13","description":"NKH - No Known History"}},"patient_procedures":{"0":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-08-30 19:36:31"},"1":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-08-30 19:36:49"},"2":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-08-30 19:37:38"},"3":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-08-30 19:43:06"},"4":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-08-30 20:07:43"},"5":{"pat_id":"13","description":"No Known Past Procedure","entered_date":"2010-09-04 22:12:08"},"6":{"pat_id":"13","description":"Cholecystectomy","entered_date":"2010-08-30 19:36:31"},"7":{"pat_id":"13","description":"Cataract extraction","entered_date":"2010-08-30 19:36:31"},"8":{"pat_id":"13","description":"Appendectomy","entered_date":"2010-08-30 19:36:31"}},"patient_targets":{"request":"db/patient_targets/pat_id=13","db":[],"meta":{"status":"204","msg":"No Content","success":["No data found"]}},"incidents":{"request":"db/incidents/pat_id=13","db":[],"meta":{"status":"204","msg":"No Content","success":["No data found"]}},"encounter_orders":{"request":"db/encounter_orders/pat_id=13","db":[],"meta":{"status":"204","msg":"No Content","success":["No data found"]}},"encounters":{"0":{"pat_id":"13","chief_complaint":"","create_date":"2022-09-30 13:47:20","location":"","stage":"","visit_type":"CMWR","diagnosis2":""},"1":{"pat_id":"13","chief_complaint":"Here for consultation for control of diabetes and hypertension.","create_date":"2010-08-30 19:28:01","location":"OFFICE","stage":"Physician","visit_type":"HISTEXAM","diagnosis2":""},"2":{"pat_id":"13","chief_complaint":"Here for consultation for diabetes, hypertension and GERD.","create_date":"2010-08-30 19:39:08","location":"OFFICE","stage":"Physician","visit_type":"OFFICEF","diagnosis2":""}},"encounters_current":{"request":"db/encounters_current/pat_id=13","db":[],"meta":{"status":"204","msg":"No Content","success":["No data found"]}},"rxlist":{"0":{"pat_id":"13","drug_name":"Lipitor","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"1":{"pat_id":"13","drug_name":"Zantac","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"2":{"pat_id":"13","drug_name":"Actos","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"3":{"pat_id":"13","drug_name":"Synthroid","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"4":{"pat_id":"13","drug_name":"Glucosamine Chondroitin MaxStr","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"5":{"pat_id":"13","drug_name":"Saw Palmetto","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"},"6":{"pat_id":"13","drug_name":"Lisinopril","indication":"","entered_date":"2010-02-03 22:06:20","end_date":"0000-00-00 00:00:00"}},"rxlist_allergylist":{"0":{"pat_id":"13","allergy_name":"Sulfamethoxazole","comments":"","revision_date":"2010-02-03 22:03:34"},"1":{"pat_id":"13","allergy_name":"Penicillin G Benzathine","comments":"","revision_date":"2010-02-10 21:53:14"}},"insurance_policy":{"0":{"pat_id":"13","plan_name":"Medicare ","start_datetime":"2010-01-01 00:00:00","relation_insured":"Self"}}};
            const data = await mie.getAllPatientRecords(13, { length: "brief" })
            assert.equal(data, JSON.stringify(JSON_data));
            
        }).timeout(150000);

        it('Retrieve Records - All Patient Data (Concise)', async () => {
            let JSON_data = {"patients":[{"value":"Rogers","active":"1","address1":"1026 Waverley St.","address2":"","address3":"","alternate_phone":"","attending_physician":"0","birth_date":"1980-07-02 00:00:00","cell_phone":"6504592627","cellco_id":"0","chart_online":"0","city":"Palo Alto","country":"US","county":"","create_date":"2015-08-24 15:25:57","dea_number":"","death_date":"0000-00-00 00:00:00","death_indicator":"0","degree":"","edit_date":"2016-01-28 15:54:29","email":"crogers@bettercorp.com","emergency_contact":"Jay McDonald","emergency_phone":"(650) 821-1416","employer_addr1":"1700 Amphitheatre Parkway","employer_addr2":"","employer_addr3":"","employer_city":"Mountain View","employer_country":"US","employer_county":"Santa Clara","employer_name":"Better Corp.","employer_state":"CA","employer_uid":"","employer_zipcode":"94043","employment_status":"","extern_id1":"","family_physician":"0","fax_number":"","first_name":"Cory","first_name_phn":"26","gurantor_id":"","home_phone":"6504256321","interface":"Unknown","is_patient":"1","is_tmp":"0","last_name":"Rogers","last_name_phn":"6762","license_number":"","marital_status":"S","middle_name":"","nat_pro_id":"","pager":"","pat_id":"51","preferred_alert_method":"1","preferred_first_name":"","race":"","referring_physician":"0","revised_by":"2","revision_number":"0","sex":"M","signature_date":"0000-00-00 00:00:00","sin":"","spouse_birthdate":"0000-00-00 00:00:00","spouse_name":"","ssn":"210658124","state":"CA","suffix":"","tax_id_number":"","title":"","universal_id":"","username":"case","work_phone":"6504596270","zip_code":"94301"}],"patient_conditions":[],"patient_conditions_family":[],"patient_procedures":[],"patient_targets":[],"incidents":[],"incidents_revision":[],"encounter_orders":[],"encounter_orders_revisions":[],"encounters":[],"encounters_current":[],"rxlist":[],"rxlist_allergylist":[],"documents":[],"print_queue_multi":[],"pat_chart_types":[],"pat_pat_relations":[{"create_date":"2023-04-24 13:30:24","create_user_id":"2","end_date":"9999-01-01","modified_date":"2023-04-24 13:30:24","modified_user_id":"2","pat_id":"51","pat_rel_id":"36","related_pat_id":"43","relation_type_id":"15","revision_num":"0","start_date":"2016-02-02"},{"create_date":"2016-07-21 15:54:28","create_user_id":"2","end_date":"9998-07-10","modified_date":"2016-01-19 15:55:52","modified_user_id":"2","pat_id":"51","pat_rel_id":"16","related_pat_id":"43","relation_type_id":"30","revision_num":"0","start_date":"2016-01-19"}],"insurance_policy":[],"observations":[{"obs_id":"2183","request_id":"84","obs_code":"2930","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:00","obs_order":"0","obs_result":"R5","obs_range":"","obs_name":"Race","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"WEBCHART","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:00"},{"obs_id":"2185","request_id":"0","obs_code":"828","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"E2","obs_range":"","obs_name":"Ethnicity","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"},{"obs_id":"3651","request_id":"84","obs_code":"6823","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:00","obs_order":"0","obs_result":"White","obs_range":"","obs_name":"CDC Race","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"WEBCHART","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:00"},{"obs_id":"3673","request_id":"0","obs_code":"6824","template_id":"","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"Not Hispanic or Latino","obs_range":"","obs_name":"CDC Ethnicity","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"},{"obs_id":"2184","request_id":"0","obs_code":"827","template_id":"1.3.6.1.4.1.19376.1.5.3.1.3.16","pat_id":"51","observer_id":"0","revision_number":"3","user_id":"2","observed_datetime":"2015-08-24 15:26:40","obs_order":"0","obs_result":"English","obs_range":"","obs_name":"Language","obs_units":"","obs_flag":"","obs_status":"","verified_datetime":"0000-00-00 00:00:00","restricted":"0","create_datetime":"2015-08-24 15:26:40","modified_datetime":"2016-07-21 15:54:27","interface":"","obs_ext_id":"","test_comments":"","free_text":"","micro_result":"","interpretive_text":"","inpatient":"0","observed_start_ts":"0000-00-00 00:00:00","observed_end_ts":"2015-08-24 15:26:40"}],"accommodations":[]};
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


});