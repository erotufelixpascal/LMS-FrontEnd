let build_version = (window as { [key: string]: any })["env"]["buildVersion"] as string;
let env_dd = (window as { [key: string]: any })["env"]["ddEnv"] as string;
let auth0ClientID = (window as { [key: string]: any })["env"]["auth0ClientID"] as string;
let auth0Domain = (window as { [key: string]: any })["env"]["auth0Domain"] as string;
let env_lmsUrl = (window as { [key: string]: any })["env"]["cmpUrl"] as string;

export const environment = {
  production: false,
  apiURL: "http://127.0.0.1:8000",
  topicName: 'attend',
  subscriptionName: 'LMS-1',
  sessionId: '1234',
  version: build_version,
  ddEnv: env_dd,
  lmsUrl: env_lmsUrl,
  auth: {
    domain: auth0Domain,
    clientId: auth0ClientID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
    errorPath: '/error',
  },
};