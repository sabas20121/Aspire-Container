import React, {
	useState,
	useEffect
} from 'react';
import {
	CookieManager
} from '../../services/CookieManager.js';
import {
	SessionManager
} from '../../services/SessionManager.js';
import {
	CognitoUser,
	CognitoUserPool,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import Home from '../home/Home.js';
import config from "../../config/config.js";
import './Login.css';
import {
	Button,
	TextField,
	Typography
} from "@mui/material";
// import {
// 	styled
// } from "@mui/material/styles";

import msaispirelogin from '../../assets/metricstream-aispire-login.svg';
import aispire from '../../assets/aispire-login.svg';
import laptop from '../../assets/laptop.png';
import SELogo from '../../assets/Siemens_Energy_logo.svg';

export default function Login() {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		isAuthenticated: false,
	});

	const redirectUrl = config.redirectUrl;
	const [errorMessage, setErrorMessage] = useState('');
	const [clientFlag, setClientFlag] = useState(null);
	const [isSSOEnable, setSSOFlag] = useState(null);
	// const [customQSRegistrationEnabled, setQSRegistrationFlag] = useState(null);
	const [cognitoDomainUrl, setCognitoDomainUrl] = useState(null);
	const [cognitoClientId, setCognitoClientId] = useState(null);
	const [cognitoUserPoolId, setCognitoUserPoolId] = useState(null);
	const [identityProvider, setIdentityProvider] = useState(null);
	const [code, setCode] = useState(null);
	// const [identityPoolId, setIdentityPoolId] = useState(null);
	// const [identityProviderRegion, setIdentityProviderRegion] = useState(null);




	useEffect(() => {

		const payload = {
			requestedObject: 'ClientDetails',
		};

		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.has('code')) {
			setCode(urlParams.get('code'));
		} else{
			fetchClientDetails(payload)
			.then((ClientDetails) => {
				setSSOFlag(ClientDetails.isSSOEnable);
				sessionStorage.setItem('customQSRegistrationEnabled', ClientDetails.customQSRegistrationEnabled);
				// setQSRegistrationFlag(ClientDetails.customQSRegistrationEnabled);
				setCognitoDomainUrl(ClientDetails.cognitoDomainUrl);
				setCognitoClientId(ClientDetails.cognitoClientId);
				setCognitoUserPoolId(ClientDetails.cognitoUserPoolId);
				if (ClientDetails.isSSOEnable) {
					setIdentityProvider(ClientDetails.identityProvider)
					// setIdentityPoolId(ClientDetails.identityPoolId)
					// setIdentityProviderRegion(ClientDetails.identityProviderRegion)
				}
				setClientFlag(true);
			})
			.catch((error) => {
				console.error('Error fetching client details:', error);
			});
		}
	}, []);

	useEffect(() => {
		const fetchIdToken = async (authorizationCode) => {
			try {
			const payload = {
				code: authorizationCode,
				redirectUrl: window.location.origin,
			};

			const apiUrl = '/metricstream/api/fetch-IdToken';
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				console.error('Error fetching ID token:', response.statusText);
				throw new Error('Failed to fetch ID token');
			}

			const data = await response.json();
			const idToken = data?.data?.id_token;

			if (idToken) {
				handleAuthenticationSuccess(idToken);
			}

			} catch (error) {
			console.error('Error fetching ID token:', error.message);
			}
		};
		fetchIdToken(code);
	}, [code]);

	const fetchQSUserDetails = (idToken) => {
		const payload = {
			openIdToken: idToken
		};
		const apiUrl = '/metricstream/api/fetch-QSUserDetails';
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

	const handleInputChange = (e) => {
		const {
			name,
			value
		} = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const fetchReportMetaData = () => {
		const payload = {};

		fetch('/metricstream/api/tasks/fetch-ReportMetaData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				if (data) {
					localStorage.setItem('ReportMetaData', JSON.stringify(data));
				} else {
					console.error('Error: Invalid response data format.');
				}
			})
			.catch((error) => {
				console.error('Error fetching report data:', error);
			});
	};

	const handleAuthenticationSuccess = (idToken) => {
		CookieManager.setCookie('OptimizerID', idToken);
		const customQSRegistrationEnabled = sessionStorage.getItem('customQSRegistrationEnabled');
		if (customQSRegistrationEnabled) {
			fetchQSUserDetails(idToken);
		}
		fetchReportMetaData();
		setFormData({
			...formData,
			isAuthenticated: true
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const poolData = {
			UserPoolId: cognitoUserPoolId,
			ClientId: cognitoClientId
		};

		const userPool = new CognitoUserPool(poolData);
		const authenticationData = {
			Username: formData.username,
			Password: formData.password,
		};

		const authenticationDetails = new AuthenticationDetails(authenticationData);
		const userData = {
			Username: formData.username,
			Pool: userPool,
		};

		const cognitoUser = new CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (session) => {
				const idToken = session.idToken.jwtToken;
				handleAuthenticationSuccess(idToken);
			},
			onFailure: (err) => {
				console.error('Authentication failed:', err);
				if (err.code === 'NotAuthorizedException') {
					setErrorMessage("Invalid Username or Password. Please enter a valid Username & Password.");
				} else {
					setErrorMessage('An error occurred. Please try again later.');
				}
			},

			// newPasswordRequired: (userAttributes, requiredAttributes) => {},
		});
	};

	const handleSsoLogin = () => {
		if (isSSOEnable && clientFlag) {
			const ssoRedirectUrl = `${cognitoDomainUrl}/oauth2/authorize?identity_provider=${identityProvider}&redirect_uri=${redirectUrl}&response_type=CODE&client_id=${cognitoClientId}&scope=email%20openid`
			window.location.href = ssoRedirectUrl;
		}
	};

	if (formData.isAuthenticated) {
		SessionManager.init();
		const isSessionValid = SessionManager.isActive();
		if (isSessionValid) {
			const newUrl = `${window.location.origin}${window.location.pathname}`;
			window.history.replaceState({}, document.title, newUrl);
      return (
        <div>
          <Home/>
        </div>
      );
		}
	}

	if (!clientFlag) {
		return null;
	}

  return (
    <div className="container">
      <div className="left-section">
        <div className="intro-div">
          <text className="text-1">
            MetricStream AiSPIRE is the industry’s first <br />
            AI-powered, knowledge-centric GRC.
          </text>
          <text className="text-2">
            AI-Powered GRC to Augment Decision-Making, <br />
            Prioritization, and Improve Efficiency.
          </text>
          <text className="text-2">30% reduction in controls, control tests.</text>
          <div className="rectangle" />
        </div>
        <img src={laptop} alt="laptop" />
      </div>
      <div className="right-section">
        {/*<div className="right-content">*/}
  		<div className='logo-container'>
  			<div className="logo-div-Aispire">
  				<img src={msaispirelogin} alt="logo" width="242" height="78" />
  			</div>
  			<div className="logo-div-prod">
  				<img src={SELogo} alt="logo" width="155" />
  			</div>
  		</div>
          <form onSubmit={handleSubmit}>
            <div className="login-form">
              <div className="error-container">
                {errorMessage && (
                  <div className="login-error-message">{errorMessage}</div>
                )}
              </div>
              <div className="login-input">
                <TextField
                  name="username"
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      width: "554px",
                      height: "11px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Open Sans",
                      margin: "0px",
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: "13px",
                      alignItems: "center",
                      letterSpacing: "0.15px",
                      color: "#706982 !important",
                    },
                  }}
                />
              </div>
              <div className="login-input">
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      width: "554px",
                      height: "11px",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Open Sans",
                      margin: "0px",
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: "13px",
                      alignItems: "center",
                      letterSpacing: "0.15px",
                      color: "#706982 !important",
                    },
                  }}
                />
              </div>
              <div class="login-button-div">
                <Button variant="filled" class="login-button" type="submit">
                  <Typography class="login-text">Login</Typography>
                </Button>
              </div>
            </div>
          </form>
          {isSSOEnable && (
            <div className="login-button-div-sso">
              <div className='sso-separater'>
                <div className="sso-line" />
                <p className="sso-text">Or</p>
                <div className="sso-line" />
              </div>
              <Button variant="filled" class="sso-button" onClick={handleSsoLogin}>
                <Typography class="login-text">Sign in with SSO</Typography>
              </Button>
            </div>
          )}
        {/* </div> */}
      </div>
    </div>
  );
}