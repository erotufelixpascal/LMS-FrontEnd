const win = window as unknown as { env?: Record<string, string> };
const runtimeEnv = win.env ?? {};

export const environment = {
  production: false,
  // env.js sets window.env.apiUrl (lowercase "url") - this used to read
  // "apiURL" instead and silently resolved to undefined, which is why
  // CommonService previously hardcoded its own base URL.
  apiURL: runtimeEnv['apiUrl'] || 'http://localhost:3000/api',
  subscriptionName: 'LMS-1',
  sessionId: runtimeEnv['sessionId'],
  version: runtimeEnv['buildVersion'],
  ddEnv: runtimeEnv['ddEnv'],
  lmsUrl: runtimeEnv['lmsUrl'],
};
