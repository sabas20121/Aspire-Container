import { User } from './User';


const SessionManager = (function () {
    
    let instance;

    function init() {
      User.initUser();
    }
        
    function isActive() {
        const user = User.getUser();
        if (user) {
        const expirationTimestamp = user.getExpiryTs();
        const currentTimestamp = Math.floor(Date.now() / 1000);
            if (expirationTimestamp && expirationTimestamp >= currentTimestamp) {
                return true;
            }
            return false;
        }
        return false;
    }
    
    function signout() {
        let Cookies = document.cookie.split(";");
        for (var i = 0; i < Cookies.length; i++) {

          document.cookie = Cookies[i] + "=; expires=" + new Date(0).toUTCString() ;
        }
        window.location.href = '';
    }
    
    function createInstance() {
        return {
        init,
        signout,
        isActive
        };
    }

    return {
        getInstance: function () {
        if (!instance) {
            instance = createInstance();
        }
        return instance;
        },
    };
})();
  

const sessionManager = SessionManager.getInstance();

export { sessionManager as SessionManager };
