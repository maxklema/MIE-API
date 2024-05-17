require('dotenv').config();

const { URL, username, password } = require('./variables.js');
const queryData = require('./getData');

URL.value = "https://maxprac.webchartnow.com/webchart.cgi";
username.value = process.env.USERNAME;
password.value = process.env.PASSWORD;

//console.log(queryData.accessData( [], "patients", { }));
console.log(queryData.retrieveData( "patients", [], {}));