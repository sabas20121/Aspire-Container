const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();

// const MetaData = require('./MetaData.json')
// const port = MetaData.Port.AspirePort;
// const serverOptions = {
//     key: fs.readFileSync(MetaData.SSL.SSL_Key),
//     cert: fs.readFileSync(MetaData.SSL.SSL_Certificate)
// };

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
const getSelfServiseURL = require('./src/routes/GetSelfServiceURLRouter');
const getAskMeURL = require('./src/routes/GetAskMeURLRouter');
const getReportMetaData = require('./src/routes/GetReportMetaDataRouter');

const JsonFileLoader = require('./src/util/JsonFileLoader');
const jsonFileLoader = new JsonFileLoader();
const endpointJson = jsonFileLoader.readJsonFile('./src/conf/aspire_urlmapenvironment.json');

app.use(endpointJson.production.fetchDashboardList, getDashboardList);
app.use(endpointJson.production.fetchDashboardURL, getDashboardURL);
app.use(endpointJson.production.fetchSelfServiceURL, getSelfServiceURL);
app.use(endpointJson.production.fetchAskMeURL, getAskMeURL);
app.use(endpointJson.production.fetchReportMetaData, getReportMetaData);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/ge', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// const server = https.createServer(serverOptions, app);
const port = 443;

app.listen(port, () => {
    console.log(`Aspire Server running on port ${port}`);
});
