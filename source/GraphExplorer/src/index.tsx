import queryString from "query-string";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { v4 } from "uuid";
import { formatDate } from "./utils";
import App from "./App";
import { RawConfiguration } from "./core";
import ConnectedProvider from "./core/ConnectedProvider";
import "./index.css";

const apiUrl = '/metricstream/api/fetch-clientobjects';

const fetchGraphConfiguration = async (payload) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return data.GraphConfiguration;
//       return data;
    } else {
      throw new Error(`Failed to fetch GraphConfiguration: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error when trying to fetch GraphConfiguration: ${error.message}`);
    return null;
  }
};

const payload = {
  requestedObject: 'GraphConfiguration',
};

const grabConfig = async (): Promise<RawConfiguration | undefined> => {
  try {
    const graphConfig = await fetchGraphConfiguration(payload);

    if (graphConfig) {
      const newConfigId = v4();
      return {
        id: newConfigId,
        displayLabel: `Connection (${formatDate(new Date(), "yyyy-MM-dd HH:mm")})`,
        connection: {
          url: graphConfig.GRAPH_EXP_PUBLIC_OR_PROXY_ENDPOINT,
          queryEngine: graphConfig.GRAPH_EXP_GRAPH_TYPE,
          proxyConnection: !!graphConfig.GRAPH_EXP_USING_PROXY_SERVER,
          graphDbUrl: graphConfig.GRAPH_EXP_CONNECTION_URL || "",
          awsAuthEnabled: !!graphConfig.GRAPH_EXP_IAM,
          awsRegion: graphConfig.GRAPH_EXP_AWS_REGION || "",
          enableCache: graphConfig.enableCache || true,
          cacheTimeMs: graphConfig.cacheTimeMs,
        },
      };
    }
  } catch (error) {
    console.error(`Error when trying to create connection: ${error.message}`);
  }

  return undefined;
};

const BootstrapApp = () => {
  const [config, setConfig] = useState<RawConfiguration | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const config = await grabConfig();
      setConfig(config);
    })();
  }, []);

  return (
    <React.StrictMode>
      <Router>
        <ConnectedProvider config={config}>
          {
            <App />
          }
        </ConnectedProvider>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<BootstrapApp />, document.getElementById("root"));
