import CryptoJS from 'crypto-js';
import config from '../config/config';
import jwt_decode from 'jwt-decode';

const CookieManager = (function () {

  function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    if (cookieValue) {
      const encryptedValue = cookieValue[2];
      const decryptedValue = decryptData(encryptedValue);
      return decryptedValue;
    }
    return null;
  }

  function setCookie(name, value) {
    let expTime = 3600;

    if (name === 'OptimizerID') {
      const decodedToken = jwt_decode(value);
        if (decodedToken && decodedToken.exp) {
        const expTimestamp = decodedToken.exp * 1000;
        const expDate = new Date(expTimestamp);
        expTime = Math.floor((expDate.getTime() - Date.now()) / 1000);
      }
    }
    const encryptedValue = encryptData(value);
    document.cookie = `${name}=${encryptedValue}; Max-Age=${expTime}; SameSite=Strict`;
  }

  function encryptData(data) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), config.SECRET_KEY).toString();
    return encryptedData;
  }

  function decryptData(encryptedData) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, config.SECRET_KEY);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

  return {
    getCookie,
    setCookie
  };

})();

export { CookieManager };
