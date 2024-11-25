let build_version = (window as { [key: string]: any })["env"]["buildVersion"] as string;
let env_dd = (window as { [key: string]: any })["env"]["ddEnv"] as string;
let env_lmsUrl = (window as { [key: string]: any })["env"]["lmsUrl"] as string;
let sessionId = (window as { [key: string]: any })["env"]["sessionId"] as string;
let apiURL = (window as { [key: string]: any })["env"]["apiURL"] as string;

export const environment = {
  production: false,
  apiURL: apiURL,
  subscriptionName: 'LMS-1',
  sessionId: sessionId,
  version: build_version,
  ddEnv: env_dd,
  lmsUrl: env_lmsUrl,
  // auth: {
  //   domain: auth0Domain,
  //   clientId: auth0ClientID,
  //   authorizationParams: {
  //     redirect_uri: window.location.origin,
  //   },
  //   errorPath: '/error',
  // },
};