import axios from 'axios';
import { User } from "./User";
const MetaData = require('../MetaData.json')
const QuickSightAPI = (() => {

    function fetchAndParseResponse(endPointAPI) {

        const payload = {
                    openIdToken: User.getUser().getOpenIdToken()
                  };
        let apiUrl = `/api/aspire/${endPointAPI}`;
        return fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              })
              .then((response) => response.json())
              .catch((error) => {
                   console.error('Error fetching data:', error);
              });
    };

    function fetchDashboardsList() {

        return fetchAndParseResponse('fetch-DashboardList')
            .then(responseBody => {
                if (responseBody.status === 500) {
                    return { status: 500, message: "error" };
                }

                const dashboardList = responseBody.body.DashboardList;

                if (dashboardList && dashboardList.length > 0) {
                    return { status: 200, message: "success", payload: dashboardList };
                } else {
                    return { status: 200, message: "empty", payload: { empty: true } };
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return { status: 500, message: "error" };
            });
    }

    function generateDashboardURL() {

        return fetchAndParseResponse("fetch-DashboardURL")
            .then(responseBody => {
                if (responseBody.status === 500) {
                    return { status: 500, message: "error" };
                }

                const dashboardEmbedUrl = responseBody.EmbedUrl;
                return { status: 200, message: "success", payload: { url: dashboardEmbedUrl } };
            })
            .catch(error => {
                console.error('Error:', error);
                return { status: 500, message: "error" };
            });
    }

    function generateAskMeURL() {

        return fetchAndParseResponse("fetch-AskMeURL")
            .then(responseBody => {
                if (responseBody.status === 500) {
                    return { status: 500, message: "error" };
                }
                const qEmbedUrl = responseBody.EmbedUrl;
                return { status: 200, message: "success", payload: { url: qEmbedUrl } };
            })
            .catch(error => {
                console.error('Error:', error);
                return { status: 500, message: "error" };
            });
    }

    function generateSelfServiceURL() {

        return fetchAndParseResponse("fetch-SelfServiceURL")
            .then(responseBody => {
                if (responseBody.status === 500) {
                    return { status: 500, message: "error" };
                }
                const sessionEmbedUrl = responseBody.EmbedUrl;
                return { status: 200, message: "success", payload: { url: sessionEmbedUrl } };
            })
            .catch(error => {
                console.error('Error:', error);
                return { status: 500, message: "error" };
            });
    }

    return {
        fetchDashboardsList,
        generateDashboardURL,
        generateSelfServiceURL,
        generateAskMeURL,
    };
})();

export default QuickSightAPI;