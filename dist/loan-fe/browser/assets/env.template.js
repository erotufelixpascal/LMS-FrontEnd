(function(window) {
    window["env"] = window["env"] || {};
    window["env"]["ddEnv"] = "${APP_DD_ENV}";
    window["env"]["buildVersion"] = "${APP_BUILD_VERSION}";
    // window["env"]["auth0ClientID"] = "${APP_AUTH0_CLIENTID}";
    // window["env"]["auth0Domain"] = "${APP_AUTH0_DOMAIN}";
    window["env"]["apiUrl"] = "${APP_API_URL}";
    window["env"]["sessionId"] = "${APP_SESSIONID}";
    window["env"]["lmsUrl"] = "${APP_LMS_URL}";

  })(this);