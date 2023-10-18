import CryptoJS from 'crypto-js';
import config from '../config/config';

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
    const encryptedValue = encryptData(value);
    document.cookie = name + "=" + encryptedValue + "; Max-Age=3600; SameSite=Strict";
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
