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
import MetaData from './MetaData.json';

const grabConfig = async (): Promise<RawConfiguration | undefined> => {

  const params = queryString.parse(location.search) as {
    configFile?: string;
  };

  try {
    //////////////////////////////////

    // let Configuration;
    // if (params.configFile) {
    //   Configuration = JSON.parse(params.configFile);
    // }
    const newConfigId = v4();
    return {
      id: newConfigId,
      displayLabel: `Connection (${formatDate(new Date(), "yyyy-MM-dd HH:mm")})`,
      connection: {
        url: MetaData.GraphConfiguration.GRAPH_EXP_PUBLIC_OR_PROXY_ENDPOINT,
        queryEngine: MetaData.GraphConfiguration.GRAPH_EXP_GRAPH_TYPE,
        proxyConnection: !!MetaData.GraphConfiguration.GRAPH_EXP_USING_PROXY_SERVER,
        graphDbUrl: MetaData.GraphConfiguration.GRAPH_EXP_CONNECTION_URL || "",
        awsAuthEnabled: !!MetaData.GraphConfiguration.GRAPH_EXP_IAM,
        awsRegion: MetaData.GraphConfiguration.GRAPH_EXP_AWS_REGION || "",
        enableCache: MetaData.GraphConfiguration.enableCache || true,
        cacheTimeMs: MetaData.GraphConfiguration.cacheTimeMs,
      },
    };

    ///////////////////////////////////

  } catch (error) {
    console.error(`Error when trying to create connection: ${error.message}`);
  }
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