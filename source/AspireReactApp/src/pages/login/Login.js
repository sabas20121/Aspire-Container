import config from "../../config/config.js";
import React, { useState, useEffect } from "react";

export default function Login() {
  const [cognitoDomainUrl, setCognitoDomainUrl] = useState(null);
  const [cognitoClientId, setCognitoClientId] = useState(null);
  const redirectUrl = config.redirectUrl;

  useEffect(() => {
    const payload = {
      requestedObject: 'ClientDetails',
    };

    fetchClientDetails(payload)
      .then((ClientDetails) => {
        setCognitoDomainUrl(ClientDetails.cognitoDomainUrl);
        setCognitoClientId(ClientDetails.cognitoClientId);
      })
      .catch((error) => {
        console.error('Error fetching client details:', error);
      });
  }, []);

  function fetchClientDetails(payload) {
    const apiUrl = '/metricstream/api/fetch-clientobjects';
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching client data:', error);
        throw error;
      });
  }

  function navigateCognitoLogin() {
    if (cognitoDomainUrl && cognitoClientId) {
      const loginUrl = `${cognitoDomainUrl}/login?client_id=${cognitoClientId}&response_type=token&scope=openid+profile&redirect_uri=${redirectUrl}`;
      window.location.href = loginUrl;
    }
  }

  return (
    <div>
      {navigateCognitoLogin()}
    </div>
  );
}