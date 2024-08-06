# MIE API Tools

A package designed to interact with [MIE's](https://www.mieweb.com/) (Medical Informatics Engineering) [Webchart](https://www.webchartnow.com/) API seamlessly in NPM environments.

## Table of Contents

- [Installation](#Installation)
- [Methods and Features](#Methods-and-Features)
- [Setting Variables](#Setting-Variables)
- [Retrieving Cookie](#Retrieving-Cookie)
- [Retrieving Records](#Retrieving-Records)
  - [Search by Querying](#Search-by-Querying)
  - [Filtering by Fields](#Filtering-by-Fields)
  - [Retrieving all Patient Data](#Retrieving-all-Patient-Data)
- [Updating Records](#Updating-Records)
- [Creating Records](#Creating-Records)
- [Patient Documents](#Patient-Documents)
  - [Downloading Documents](#Downloading-Documents)
  - [Migrating Documents](#Migrating-Documents)
    - [Configuration](#Configuration)
    - [Mappings](#Mappings)
    - [Custom Mappings](#Custom-Mappings)
    - [Outputs](#Outputs)
      - [Successes](#Successes)
      - [Errors](#Errors)
    - [Example CSV](#Example-CSV)
- [AI Capabilities](#AI-Capabilities)
  - [Summarize Patient's Medical History](#Summarize-a-Patients-Medical-History)
  - [Ask Questions About Patient's Medical History](#Ask-Questions-About-a-Patients-Medical-History)
- [Ledger](#ledger)
  - [Ledger Examples](#ledger-examples)
- [Motivation](#Motivation)
- [Author](#Author)

## Installation

**NPM**  
`$ npm i @maxklema/mie-api-tools`

**Yarn**  
`$ yarn add @maxklema/mie-api-tools`

**PNPM**  
`$ pnpm add @maxklema/mie-api-tools`

Once the package is installed, you can import it into your project using `require` or `import`.

```javascript
const mie = require("@maxklema/mie-api-tools");
```

```javascript
import mie from "@maxklema/mie-api-tools";
```

> **NOTE:** Default import is highly reccomended. If you want to use a named import only, you must install the appropriate global variables that will be used to make your request.
>
> **Example**: Importing the retrieveRecord method requires `const { retrieveRecord, URL, practice, username, password } = require('@maxklema/mie-api-tools');`. Simply importing `const { retrieveRecord } = require('@maxklema/mie-api-tools');` will not work.

As of version **1.0.7**, importing @maxklema/mie-api-tools using `import` does not include ledger or document capabilities.

## Methods and Features

- Retrieve Session Cookie
- Retrieve Records
  - Search through queries
  - Filter by fields
  - Get all data related to a patient
- Update Records
  - Update any record with JSON data
- Create Recrods
  - Create any record with JSON data
- Patient Documents
  - Downloading Documents
    - Download multiple documents through querying
    - **Multi-Threading** allows for extremely fast downloading
  - Document Migration
    - Upload multiple documents with through a CSV file
    - **Multi-Threading** allows for extremely fast uploading
- AI Capabilities (using [Gemini](https://ai.google.dev/))
  - Summarize patients' entire medical history in any style
  - Ask questions about patients' medical history
- Ledger
  - Can be turned on or off
  - Log all requests, responses, and errors
  - Can customize your ledger and the location logs are written to

## Setting Variables

Before you are able to make requests and interact with the API, you need to set a few variables to help MIE API Tools create a valid session ID.

The following table shows all the global variables that can be set:

| Name        | Required? | Type   | Description                                                                                                           |
| ----------- | --------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `URL`       | Required  | String | The URL of your WebChart. It should look something similar to `"https://practice.webchartnow.com/webchart.cgi"`.      |
| `practice`  | Required  | String | The name of your practice.                                                                                            |
| `username`  | Required  | String | The username used to create a session ID. **NOTE:** Make sure the user you are choosing has valid permissions.        |
| `password`  | Required  | String | The password of the user used to create a session ID.                                                                 |
| `ledger`    | Optional  | String | A toggle to switch the ledger on or off. For more information, see [Ledger](#Ledger).                                 |
| `GeminiKey` | Optional  | String | Your Gemini API Key to use MIE API Tools' AI features. For more information, see [AI Capabilities](#AI-Capabilities). |

Setting the variables should be done right after the import statement. An example is shown below:

```javascript
mie.URL.value = "https://practice.webchartnow.com/webchart.cgi";
mie.practice.value = "practice";
mie.username.value = process.env.USERNAME;
mie.password.value = process.env.PASSWORD;
```

> **NOTE:** When setting the username and password values, it is recommended to use environment variables.

## Retrieving Cookie

Sometimes, you may only want to receieve your WebChart Session Cookie. This can be achieved with the `mie.getCookie()` method.

Here is an example:

```javascript
async function getCookie() {
  await mie.getCookie();
  return mie.Cookie.value;
}

const cookie = getCookie();
```

> **NOTE**: You must declare your login information first before calling this method. To do this, see [Setting Variables](#Setting-Variables).

## Retrieving Records

Perhaps the most common use case of the package is getting database records. This can be achieved with the `mie.retrieveRecord()` method.

The basic structure of the request is as follows:

```javascript
mie
  .retrieveRecord("patients", [], {})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
```

`mie.retrieveRecord()` accepts the following parameters:

| Name       | Required?       | Type         | Description                                                                                                                                                      |
| ---------- | --------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | Required        | String       | The specific API endpoint that you wish to query from. By default, WebChart has 191 endpoints which can be found in _Control Panel &rarr; API_ of your WebChart. |
| `fields`   | `[]` no fields  | String Array | Fields that you want to display (parse) in the response. Only these fields will be returned.                                                                     |
| `queries`  | `{}` no queries | Object       | Fields that you want to query by to help locate specific records.                                                                                                |

**Response Format**: JSON

> **NOTE:** Only specifying the endpoint while leaving the other parameters empty will return **ALL** data for that endpoint. For example, when retrieving records for the `patients` endpoint, all `patients` data will be returned.

Although `mie.retrieveRecord()` returns a promise, the method can also be invoked with `await/async`.

```javascript
async function myFunc() {
  const data = await mie.retrieveRecord("documents", [], {});
  console.log(data);
}

myFunc();
```

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/getRecords.js).

### Search by Querying

In order to narrow down the records returned, you can specify queries to retrieve records by in the third parameter.

For example, in the `patients` endpoint, if you want to only return records pertaining to a patient with `pat_id: 18`:

```javascript
mie.retrieveRecord("patients", [], { pat_id: 18 });
```

You are also able to chain queries together by placing multiple inside an object. This will narrow down a search even more.

```javascript
mie.retrieveRecord("patients", [], { first_name: "Will", sex: "M" });
```

> **NOTE:** You can only query by fields that are available for that endpoint specifically. For example, `last_name` exists in the `patients` endpoint, making it a legal field to query by. However, querying by `doc_id` in that same endpoint will throw an error.

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/getRecords.js).

### Filtering by Fields

Sometimes a single record can have dozens of fields. If you are only looking for a certain field or fields, you can specify which one(s) in the second parameter.

For example, in the `documents` endpoint, if you want to return only the `storage_type` of each document:

```javascript
mie.retrieveRecord("documents", ["storage_type"], { doc_type: "WCPHOTO" });
```

In the same example, if you only want to return the `storage_type` and `doc_id`:

```javascript
mie.retrieveRecord("documents", ["storage_type", "doc_id"], {
  doc_type: "WCPHOTO",
});
```

Thus, the output would look something similar to this for a single record:

```
'0': {
pat_id: '9',
storage_type: '0',
doc_id: '659'
}
```

> **NOTE:** When filtering by fields, the `pat_id` (if applicable) is always included in the returned data.

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/getRecords.js).

### Retrieving all Patient Data

There may be cases where you want to gather all the available records for a patient. However, these records can be scattered across dozens of endpoints, making it hard to query, let alone concatenate, all of the data.

MIE API Tools provides a method called `mie.getAllPatientRecords()` for doing this.

The basic structure of the request is as follows:

```javascript
mie
  .getAllPatientRecords(5, { length: "concise" })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
```

`mie.getAllPatientRecords()` accepts the following parameters:

| Name               | Required? | Type                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | --------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pat_id`           | Required  | Integer                            | The patient ID of the patient for whom you want to retrieve their information.                                                                                                                                                                                                                                                                                                                                                |
| `options (length)` | Optional  | Object, with key being type string | The length, or level of detail, of data that is returned. Length accepts `brief`, `concise`, and `detailed`. Each one returns more Records. Why the difference? Some endpoints provide very important (and relevant) patient information, while others provide less important and relevant information. The more brief the synopsis, the less lesser-relevant records that are returned. THe **default length** is `concise`. |

**Response Format**: JSON

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/getAllPatientData.js).

## Updating Records

Another common use of the package is updating records at various API endpoints. This can be achieved by using the `mie.updateRecord()` method.

The basic structure of the request is as follows:

```javascript
const json_data = {
  first_name: "William",
  address1: "1690 Broadway Bldg 19, Ste 500, Fort Wayne, IN 46802",
};

mie.updateRecord("patients", { pat_id: 18 }, json_data);
```

Updating records requires a JSON object that contains key-value pairs of fields to update.

`mie.updateRecord()` accepts the following parameters:

| Name                      | Required?              | Type   | Description                                                                                                                                                      |
| ------------------------- | ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint`                | Required               | String | The specific API endpoint that you wish to query from. By default, WebChart has 191 endpoints which can be found in _Control Panel &rarr; API_ of your WebChart. |
| `identifier`              | Required               | Object | The unique ID of the specific record to update.                                                                                                                  |
| `json_options (new data)` | `{}` No data to update | Object | The new updated Data formatted as a JSON object.                                                                                                                 |

**Response Format**: none

> **NOTE:** Each endpoint has a specific identifier. For those that deal with patient data, it is most likely `pat_id`. Other endpoints, such as `documents`, have `doc_id` as their identifier. A complete list can be found inside the API Docs of your WebChart or in [_src/Variables/endpointLists.js_](https://github.com/maxklema/mie-api-tools/blob/main/src/Variables/endpointLists.js) of this repository.

> **NOTE:** By Default, not all endpoints support UPDATE functionality. Double check that the API endpoint you want to use supports UPDATE functionality.

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/updateRecords.js).

## Creating Records

Creating new Records is another important capability of MIE API Tools. The methodology is very similar to `mie.updateRecords()` but without the identifier. This can be achieved by using the `mie.createRecord()` method.

The basic structure of the request is as follows:

```javascript
const json_data = {
  first_name: "William",
  address1: "1690 Broadway Bldg 19, Ste 500, Fort Wayne, IN 46802",
};

mie.createRecord("patients", json_data);
```

Updating records requires a JSON object that contains key-value pairs of fields to update.

`mie.updateRecords()` accepts the following parameters.

| Name       | Required?              | Type   | Description                                                                                                                                                      |
| ---------- | ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | Required               | String | The specific API endpoint that you wish to query from. By default, WebChart has 191 endpoints which can be found in _Control Panel &rarr; API_ of your WebChart. |
| `new_data` | `{}` No data to update | Object | The new Data to post to an endpoint formatted as a JSON object.                                                                                                  |

**Response Format**: none

> **NOTE:** When creating a new record in a certain endpoint, it is **not necessary** to include all possible field-value pairs in the JSON object. For example, when creating a new patient, you do not have to fill in every field, such as `first_name`, `ssn`, `address3`, etc. A new patient will still be created with the fields you did include in the JSON object while the remaining fields will be left blank.

> **NOTE:** By Default, not all endpoints support POST functionality. Double check that the API endpoint you want to use supports POST functionality.

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/createRecords.js).

## Patient Documents

> **NOTE**: As of version **1.0.7**, installing @maxklema/mie-api-tools using `import` does not support patient documents.

An integral part of WebChart is being able to store patient documents. WebChart supports 28 different storage types and dozens of document types. For a complete chart explaining the storage types, see [Custom Documents CSV API](https://docs.enterprisehealth.com/functions/system-administration/data-migration/custom-documents-csv-api/#process).

MIE API Tools allows you to download a collection of documents and upload a collection of documents.

### Downloading Documents

MIE API Tools allows you to download as many documents as you want at once through querying. Download functionalities also allow for an optimization option, which allows for faster downloading. This can be achieved by using the `mie.downloadDocs()` function.

The basic structure of the request is as follows:

```javascript
mie.downloadDocs({ storage_type: 8 }, "downloads", 0);
```

`mie.downloadDocs()` accepts the following parameters:

| Name           | Required? | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queryString`  | Required  | Object  | Fields that you want to query by to help locate specific documents for download. All documents that are returned by the query will be downloaded.                                                                                                                                                                                                                                                         |
| `directory`    | Required  | String  | The directory you want to place your downloaded file in.                                                                                                                                                                                                                                                                                                                                                  |
| `optimization` | Optional  | Integer | When left blank, optimization is turned off. When set to `1`, optimization is turned on. When optimization is on, filenames follow the format: `doc_id.extension`. When optimization is off, filenames follow the format: `(pat_last_name)_(doc_id).extension`. The difference is significant in that the patient's last name does not need to be queried before the document is downloaded, saving time. |

**Response Format**: For each file you attempt to download, the status of the upload will either be placed in `/Download Status/success.csv` or in `/Download Status/errors.csv`. Each file contains the headers `FILE`, `DOC_ID`, and `STATUS`. Results are appended to the previous. **If you delete statuses in either file, do not delete the headers, or the program may crash!**

Similar to [Retrieving Records by Querying](#Search-by-Querying), `mie.downloadDocs()` also takes an object with queries. You can only filter by the fields that belong to the `documents` endpoint. You can find a full list at _Control Panel &rarr; API &rarr; Documents_.

You are also able to chain queries together to download more specific documents. For example:\

```javascript
mie.downloadDocs({ storage_type: 8, doc_type: "WCPHOTO" }, "downloads", 0);
```

> Example Folder: [here](https://github.com/maxklema/mie-api-tools/tree/main/examples/Download%20Documents).

### Migrating Documents

MIE API Tools allows you to upload any amount of documents at once by crafting a custom CSV file (see more below). With uploading capabilities, you are able to specify header fields.

The basic structure of the request is as follows:

```javascript
mie.migrateData(jsonObject);
```

`mie.migrateData()` accepts the following parameter:

| Name         | Required? | Type   | Description                                         |
| ------------ | --------- | ------ | --------------------------------------------------- |
| `jsonObject` | Required  | Object | The JSON Object with your migration configurations. |

#### Configuration

To upload documents, you need a configuration JSON object. This object should include everything needed to make a data migration, including your WebChart credentials, output directory, mapping, threads, etc.

The following table describes each available property.

| Property        | Required? | Type            | Description                                                                                                                                                                                                                                   |
| --------------- | --------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username`      | Variable  | String          | Your login username for your WebChart system. This field is required if `mie.username.value` is empty.                                                                                                                                        |
| `password`      | Variable  | String          | The login password for your WebChart system. This field is required if `mie.password.value` is empty.                                                                                                                                         |
| `handle`        | Variable  | String          | The name of your WebChart system. This field is required if `mie.handle.value` is empty.                                                                                                                                                      |
| `url`           | Variable  | String          | The URL of your WebChart. It should look something similar to `"https://practice.webchartnow.com/webchart.cgi"`. This field is required if `mie.URL.value` is empty.                                                                          |
| `input_data`    | Required  | Array Object    | A list of filepaths to your input CSV file or files (you can have multiple data migrations).                                                                                                                                                  |
| `output_dir`    | Optional  | String          | The root output directory where you want the results of your migrations to be stored. The default directory is `Output/`.                                                                                                                     |
| `mapping`       | Required  | String / Object | The mapping translation for your input CSV headers. As of 1.0.0, pre-templated mappings `one` and `two` are available. To see these mappings, view [mappings](#Mappings). To create custom mappings, see [custom mappings](#Custom-Mappings). |
| `threads`       | Optional  | Integer         | The number of worker threads you want working at once. The default is your number of CPU cores.                                                                                                                                               |
| `csv_delimiter` | Variable  | String          | The character that separates data in your CSV files. The default delimiter is `,`. If you have a different delimiter, you need to include this header.                                                                                        |

#### Mappings

Mappings translate your CSV headers to those that WebChart understands. This is necessary since different EHRs may have different headers and capitalizations.

For a detailed description of each header, see the 'Documents' API documentation on your WebChart.

| Mapping One [`one`] | Mapping One [`two`] | Translation         |
| ------------------- | ------------------- | ------------------- |
| filePath            | filepath            | file                |
| mrNumber            | mrnumber            | mrnumber            |
| docID               | docid               | doc_id              |
| revisionNumber      | revisionnumber      | revision_number     |
| userID              | userid              | user_id             |
| originID            | originid            | origin_id           |
| patID               | patid               | pat_id              |
| docType             | doctype             | doc_type            |
| storageType         | storagetype         | storage_type        |
| storageID           | storageid           | storage_id          |
| serviceLocation     | servicelocation     | service_location    |
| originDate          | origindate          | origin_date         |
| enterDate           | enterdate           | enter_date          |
| revisionDater       | revisiondate        | revision_date       |
| serviceDate         | servicedate         | service_date        |
| approxServiceDate   | approxservicedate   | approx_service_date |
| interface           | interface           | interface           |
| inpatient           | inpatient           | inpatient           |
| allowForTeaching    | allowforteaching    | allow_for_teaching  |
| subject             | subject             | subject             |

> **NOTE:** Some EHRs may export data with headers not included in this list. In that case, you do not have to remove them from the CSV import file. They will be ignored by the program.

#### Custom Mappings

Custom mappings can also be created. In your config.json file, instead of assigning `"mapping"` to a string, assign it to an object (which will be converted to a map).

As an example, for an input CSV file with the headers `FILE_PATH`, `PAT_ID`, `MRNUMBER`, and `DOC_TYPE`, a custom mapping can be created like this:

_Config.json_

```JSON
"mapping": {
    "FILE_PATH": "file",
    "DOC_TYPE": "doc_type",
    "MRNUMBER": "mrnumber",
    "PAT_ID": "pat_id"
},
```

Here is an example of a CSV file containing 6 documents to be uploaded:

```CSV
document_name,storage_type,doc_type,pat_id,subject,service_location,service_date
testing_files/29.jpg,8,WCPHOTO,18,"","",""
testing_files/Hart_109.txt,14,US,18,"this is my test lab!","OFFICE","2008-08-10 00:00:00"
testing_files/110.txt,14,US,18,"","OFFICE","2008-08-10 00:00:00"
testing_files/111.txt,14,US,18,"","OFFICE","2008-08-10 00:00:00"
testing_files/112.txt,14,US,18,"","OFFICE","2008-08-10 00:00:00"
testing_files/113.txt,14,US,18,"","OFFICE","2008-08-10 00:00:00"
```

#### Outputs

For each input CSV file, a folder will be created with the name of that file for the job output. Inside, there will be a success.csv and an errors.csv file.

##### Successes

The headers in the sucess.csv file will be the same headers as the input CSV file.

If you re-run a migration job, **do not delete your success.csv file**. This file is used to keep track of files that have already been uploaded and will avoid uploading duplicate files in future jobs.

##### Errors

The headers in the errors.csv file will be the same headers as the input CSV file.

A new errors.csv file is generated for each migration job, so duplicate error messages will not appear.

Once you have created your CSV file containing all the files you want to upload, you can upload them by invoking the `mie.uploadDocs()` function.

#### Example CSV

An input CSV file with mapping `two` may look something like this

```CSV
filepath,doctype,mrnumber
testing_files/29.jpg,WCPHOTO,10033
testing_files/110.txt,US,10033
testing_files/Hart_109.txt,US,10033
testing_files/Doe.html,ORDIM,10033
```

> **NOTE:** While MIE API Tools supports _most_ storage types, some are not supported (yet). However, there are work-arounds. For example, `storage_type: 13 (.htm)` files do not upload correctly to WebChart. Neither do `.tif` or `.tiff` files. As a result, all `.htm` files are automatically converted to `.html` files. Similarly, all `.tif` and `.tiff` files are automatically converted to `.png` files.

> Example Folder: [here](https://github.com/maxklema/mie-api-tools/tree/main/examples/Upload%20Documents).

## AI Capabilities

> **NOTE**: AI capabilities are only supported in Node.js 18 and above.

If you simply want a overview of a patient's medical history and the ability to ask questions about them, MIE API Tools has built-in methods that allow you to do this. The package uses Google's [Gemini](https://ai.google.dev/) LLM to help do this.

In order to use the AI capabilities, you must set `mie.GeminiKey.value` to that of your Gemini API Key.

### Summarize a Patients Medical History

One way MIE API Tools utilizes AI is by providing summaries of patient medical history. This can be achieved by using the `mie.summarizePatient()` method.

The basic structure of the request is as follows:

```javascript
mie
  .summarizePatient(18)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
```

`mie.summarizePatient()` accepts the following parameters:

| Name        | Required? | Type                | Description                                                                                                                                                           |
| ----------- | --------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patID`     | Required  | Integer             | The ID of the patient for whom you want to summarize.                                                                                                                 |
| `adjective` | Optional  | Object Key (String) | An adjective to specify the type of summary you would like to receive. Examples include `brief`, `detailed`, `professional`, etc. The default adjective is `concise`. |
| `model`     | Optional  | Object Key (String) | The Gemini AI Model you want to use to provide you a summary. The default model is `gemini-1.5-flash`.                                                                |

An example of using all three parameters in a request looks like this:

```javascript
mie
  .summarizePatient(18, { adjective: "brief", model: "gemini-1.5-flash" })
  .then((result) => {
    console.log(result);
  });
```

**Response Format:** String.

An example response may look something like this: \
_William S. Hart is a 70-year-old male patient with a history of hypertension, congestive heart failure, atrial fibrillation, hyperlipidemia, coronary artery disease, peripheral vascular disease, and a history of smoking. He has also been diagnosed with asthma and COPD. Mr. Hart has a history of a right-sided stroke and anemia. He has a history of various procedures, including a CT scan of the head and an appendectomy. He has been prescribed a variety of medications throughout his medical history, including aspirin, lisinopril, lasix, and coumadin. Mr. Hart has had a variety of encounters with the healthcare system, including visits, consultations, and follow-up appointments. He has a history of an injury involving a fall while walking with boxes up a ramp. Mr. Hart is insured by Medicare and AARP._

Although `mie.summarizePatient()` returns a promise, the method can also be invoked with `await/async`.

```javascript
async function myFunc() {
  const summary = await mie.summarizePatient(18);
  console.log(summary);
}

myFunc();
```

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/AiTools.js).

### Ask Questions About a Patients Medical History

Another way MIE API Tools utilizes AI is by allowing you to ask questions about a patient's medical history. This can be achieved by using the `mie.queryPatient()` method.

The basic structure of the request is as follows:

```javascript
mie
  .queryPatient(18, "Does this patient have insurance?")
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.error(err);
  });
```

`mie.queryPatient()` accepts the following parameters:

| Name               | Required?                  | Type                | Description                                                                                            |
| ------------------ | -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| `patID`            | Required                   | Integer             | The ID of the patient for whom you want to summarize.                                                  |
| `query` (question) | `""` indicates no question | String              | The query, or question, you would like to ask about the patient.                                       |
| `model`            | Optional                   | Object Key (String) | The Gemini AI Model you want to use to provide you a summary. The default model is `gemini-1.5-flash`. |

An example of using all three parameters in a request looks like this:

```javascript
mie
  .queryPatient(18, "Does this patient have insurance?", {
    model: "gemini-1.5-flash",
  })
  .then((response) => {
    console.log(response);
  });
```

**Response Format:** String.

An example response to the question _Does this patient have insurance?_ can look like this:\
 _Based on the provided JSON data, the patient, William S. Hart, has two insurance policies: "Medicare" and "AARP". Both policies have a relation insured as "Self", meaning the patient is the primary insured on both plans. This indicates that the patient has insurance coverage._

Although `mie.queryPatient()` returns a promise, the method can also be invoked with `await/async`.

```javascript
async function myFunc() {
  const query = await mie.queryPatient(18, "Does this patient have insurance?");
  console.log(query);
}

myFunc();
```

> Example File: [here](https://github.com/maxklema/mie-api-tools/blob/main/examples/AiTools.js).

## Ledger

> **NOTE**: As of version **1.0.7**, installing @maxklema/mie-api-tools using `import` does not support ledger functionalities.

MIE API Tools provides a tool to log all requests, responses, and errors made. The package uses the [Winston](https://github.com/winstonjs/winston) package for logging.

A Ledger can be toggled on or off. To toggle a ledger on, you must set `mie.ledger.value` to `"true"`. To toggle a ledger off, you must set `mie.ledger.value` to `"false"`.

Creating a new ledger can be achieved by invoking the `mie.createLedger()` method.

A basic structure of the request is as follows:

```javascript
const options = {
  levels: ["info", "error"],
  format: ["timestamps", "levels"],
  storage: ["Logs/info.log", "Logs/errors.log"],
  log_returned_data: "false",
};

mie.createLedger(options);
```

`mie.createLedger()` accepts an object, which takes in the following parameters:

| Name                | Required? | Type                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `levels`            | Optional  | String Array           | The type of messages that you would like logged. `info` messages log all requests and responses made. `error` messages log all errors that were thrown. The **default levels** include both `info` and `error` messages.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `format`            | Optional  | String Array           | Additional options you would like your ledger to include. `timestamps` will log the timestamp next to each message. `levels` will log the level (type of message) next to each message. This is useful if you are logging both `info` and `error` messages in the same file or in the console. The **default formats** enable both `timestamps` and `levels`.                                                                                                                                                                                                                                                                                                                                                                       |
| `storage`           | Optional  | String or String Array | The location that the ledger will write to. If you want `info` and `error` messages to be written to two different files, set this option to an string array containing two different filepaths. **NOTE:** the first filepath will be where `info` messages are logged while the second filepath will be where `error` messages are logged. An error will be thrown if you specify two file paths but only have one level set. If you only want messages to be logged to one file, you must set `storage` to a String containing that filepath, not a String array. Lastly, if you want your messages to be logged to the console, set `storage_type` to `"console"`. The **default storage** location is `"Logs/apiActivity.log"`. |
| `log_returned_data` | Optional  | String                 | A boolean, basically, that allows you to toggle loose-lipped data responses on or off. Setting this to `true` will log the data that is returned by each response. Setting this to `false` will not log the data is returned by each response. The **default value** is set to `true`. **However, serious consideration should go into dictating this option as sensitive medical information will be logged.**                                                                                                                                                                                                                                                                                                                     |

**Response Format:** Varies based on options specified.

### Ledger Examples

**Example One:** All options enabled and level messages are seperated as such:

```javascript
const options = {
  levels: ["info", "error"],
  format: ["timestamps", "levels"],
  storage: ["Logs/info.log", "Logs/errors.log"],
  log_returned_data: "true",
};
```

Logs/info.log:

```
2024-06-06T14:26:03.789Z [info]: Patient Query AI Request:
Patient ID: Sdasds
Gemini Model: "gemini-1.5-flash"
Query: "Does this patient have insurance?"
2024-06-06T14:26:03.793Z [info]: Patient Retrieval Request (Top Records Filtered):
Patient ID: Sdasds
2024-06-06T14:26:04.834Z [info]: Record Retrieval Request:
Request URL: "https://mieinternprac.webchartnow.com/webchart.cgi/json/R0VUL2RiL3BhdGllbnRzL3BhdF9pZD1TZGFzZHM="
Endpoint: "patients"
Query By: {"pat_id":"Sdasds"}
2024-06-06T14:26:04.933Z [info]: Record Retrieval Response
2024-06-06T14:26:04.933Z [info]: Patient Retrieval Response:
Failed to collect patient information with Patient ID Sdasds because no patient with that ID exists.
```

Errors/errors.log:

```
2024-06-06T14:26:04.936Z [error]: Bad Parameter: No patient exists with ID "Sdasds".
```

**Example Two:** All format options are toggled off and `info` and `error` messages are written to a single file.

```javascript
const options = {
  levels: ["info", "error"],
  format: [],
  storage: ["Logs/activity.log"],
  log_returned_data: "true",
};
```

Logs/activity.log:

```
Patient Query AI Request:
Patient ID: Sdasds
Gemini Model: "gemini-1.5-flash"
Query: "Does this patient have insurance?"
Patient Retrieval Request (Top Records Filtered):
Patient ID: Sdasds
Record Retrieval Request:
Request URL: "https://mieinternprac.webchartnow.com/webchart.cgi/json/R0VUL2RiL3BhdGllbnRzL3BhdF9pZD1TZGFzZHM="
Endpoint: "patients"
Query By: {"pat_id":"Sdasds"}
Record Retrieval Response:
Data: {"request":"db/patients/pat_id=Sdasds","db":[],"meta":{"status":"204","msg":"No Content","success":["No data found"]}}
Patient Retrieval Response:
Failed to collect patient information with Patient ID Sdasds because no patient with that ID exists.
Bad Parameter: No patient exists with ID "Sdasds".
```

> Example Folder: [here](https://github.com/maxklema/mie-api-tools/tree/main/examples/Using%20the%20Ledger).
> e

## Motivation

MIE has an API that integrates with WebChart (Electronic Health Record) Systems, allowing developers and healthcare professionals access to critical medical data from the WebChart server. However, to use the MIE API, it has to be run in a browser using HTTPS requests. This makes it hard for developers to use the API and can lead to problems including scalability issues, session management, and security concerns. Since browsers are not optimized for handling large numbers of connections and requests, with the API running in a browser, it may be harder to handle large volumes of requests. Browser sessions are not long, resulting in the API facing challenges in managing longer-term sessions. This can then affect the ability to maintain persistent connections across multiple API requests. Overall, integrating the MIE API with Webchart EHR systems through a browser is not the optimal method to utilize this important API.

This package allows for the API to be used seamlessly by being capable of performing both basic and advanced CRU operations, uploading and downloading documents, summarizing patient medical records and asking questions about patients, and logging all requests, responses, and errors as needed.

## Author

- [@maxklema](https://www.github.com/maxklema)
