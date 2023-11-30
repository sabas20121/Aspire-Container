const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();

 const MetaData = require('./src/conf/MetaData.json')
 const port = MetaData.Port.AspirePort;
 const serverOptions = {
     key: fs.readFileSync('../server.key'),
     cert: fs.readFileSync('../server.crt')
 };

const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

const getDashboardList = require('./src/routes/GetDashboardListRouter');
const getDashboardURL = require('./src/routes/GetDashboardURLRouter');
const getSelfServiceURL = require('./src/routes/GetSelfServiceURLRouter');
const getAskMeURL = require('./src/routes/GetAskMeURLRouter');
const getReportMetaData = require('./src/routes/GetReportMetaDataRouter');
const getReportObject = require('./src/routes/GetReportObjectRouter');
const getClientObject = require('./src/routes/GetClientObjectRouter');
const getQSUserDetails = require('./src/routes/GetQuicksightUserDetailsRouter');
const getIdToken = require('./src/routes/GetIdTokenRouter');
const getIdentityId = require('./src/routes/GetIdentityIdRouter');

const JsonFileLoader = require('./src/utils/JsonFileLoader');
const jsonFileLoader = new JsonFileLoader();
const endpointJson = jsonFileLoader.readJsonFile('./src/conf/aspire_url_map_environment.json');

app.use(endpointJson.production.fetchDashboardList, getDashboardList);
app.use(endpointJson.production.fetchDashboardURL, getDashboardURL);
app.use(endpointJson.production.fetchSelfServiceURL, getSelfServiceURL);
app.use(endpointJson.production.fetchAskMeURL, getAskMeURL);
app.use(endpointJson.production.fetchReportMetaData, getReportMetaData);
app.use(endpointJson.production.fetchReportObjects, getReportObject);
app.use(endpointJson.production.fetchClientObjects, getClientObject);
app.use(endpointJson.production.fetchQSUserDetails, getQSUserDetails);
app.use(endpointJson.production.fetchIdToken, getIdToken);
app.use(endpointJson.production.fetchIdentityId, getIdentityId);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/ge', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = https.createServer(serverOptions, app);
// const port = 443;

server.listen(port, () => {
    console.log(`Aspire LSEG Server running on port ${port}`);
});
