// window.env = {
//     buildVersion: "1.0.0",
//     ddEnv: "development",
//     auth0ClientID: "your-auth0-client-id",
//     auth0Domain: "your-auth0-domain",
//     lmsUrl: "your-lms-url"
//   };
  
  (function(window) {
    window["env"] = window["env"] || {};
    window["env"]["ddEnv"] = "local";
    window["env"]["buildVersion"] = "v1.0.0-local";
    window["env"]["apiUrl"] = "http://127.0.0.1:8000";
    window["env"]["sessionId"] = "1234";
    window["env"]["lmsUrl"] = "http://localhost:4200";
    // window["env"]["auth0ClientID"] = "te474747y";
    // window["env"]["auth0Domain"] = "auth-a.landmarkworldwide.com";

})(this);