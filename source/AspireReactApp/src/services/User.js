import jwt_decode from 'jwt-decode';
import { CookieManager } from './CookieManager';

const User = (function () {
  let instance;
  let user;
  
  function initUser() {
    const cookie = CookieManager.getCookie('OptimizerID');
    if (cookie) {
      const idToken = cookie;

      if (!idToken) {
        return;
      }
      user = createUser(idToken);
    }
  }

  function createUser(idToken) {
    try {
      const decodedToken = jwt_decode(idToken);
      
      const userData = {
        userName: decodedToken["cognito:username"],
        email: decodedToken["email"],
        exp: decodedToken["exp"],
        name: decodedToken["name"],
        mobile: decodedToken["mobile"],
        cognitoUrl: decodedToken["iss"],
        openIdToken: idToken,
      };

      const getUserName = function () {
        return userData['userName'];
      };
      const getEmail = function () {
        return userData['email'];
      };
      const getExpiryTs = function () {
        return userData['exp'];
      };
      const getName = function () {
        return userData['name'];
      };
      const getMobile = function () {
        return userData['mobile'];
      };
      const getcognitoUrl = function () {
        return userData['cognitoUrl'];
      };
      const getOpenIdToken = function () {
        return userData['openIdToken'];
      };
		
      return {
        getUserName,
        getEmail,
        getExpiryTs,
        getName,
        getMobile,
        getcognitoUrl,
        getOpenIdToken,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  function getUser() {
    return user;
  }

  function createInstance() {
    return {
      initUser,
      getUser,
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
        // initUser();
      }
      return instance;
    },
  };
})();

const user = User.getInstance();

export { user as User };
