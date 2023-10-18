import config from "../../config/config.js";
const MetaData = require( "../../MetaData.json");

export default function Login() {
const cognitoDomainUrl = MetaData.ClientDetails.cognitoDomainUrl;
const cognitoClientId = MetaData.ClientDetails.cognitoClientId;
const redirectUrl = config.redirectUrl;
  function navigateCognitoLogin() {

    const loginUrl =`${cognitoDomainUrl}/login?client_id=${cognitoClientId}&response_type=token&scope=openid+profile&redirect_uri=${redirectUrl}`;

    window.location.href = loginUrl;
  }
  return (
    <div>
      {navigateCognitoLogin()}
    </div>
  );
}