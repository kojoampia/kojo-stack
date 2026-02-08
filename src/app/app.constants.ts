// Application constants
// Uses Angular environment files for environment-specific values (environment.ts / environment.prod.ts)
// Fallback to webpack-injected globals for backward compatibility

import { environment } from '../environments/environment';

declare const VERSION: string;
declare const DEBUG_INFO_ENABLED: boolean;
declare const MOCK_MODE_ENABLED: boolean;
declare const SERVER_API_URL: string;
declare const KS_DASHBOARD_URL: string;
declare const BUILD_TIMESTAMP: string;

// Provide fallback values if webpack doesn't inject them
const VERSION_FALLBACK = '2026.1.0';
const DEBUG_INFO_ENABLED_FALLBACK = !environment.production;
const MOCK_MODE_ENABLED_FALLBACK = false;
const SERVER_API_URL_FALLBACK = environment.apiUrl;
const KS_DASHBOARD_URL_FALLBACK = '/api/v1/auth';
const BUILD_TIMESTAMP_FALLBACK = new Date().toISOString();

export const EXPORTED_VERSION = typeof VERSION !== 'undefined' ? VERSION : VERSION_FALLBACK;
export const EXPORTED_DEBUG_INFO_ENABLED = typeof DEBUG_INFO_ENABLED !== 'undefined' ? DEBUG_INFO_ENABLED : DEBUG_INFO_ENABLED_FALLBACK;
export const EXPORTED_MOCK_MODE_ENABLED = typeof MOCK_MODE_ENABLED !== 'undefined' ? MOCK_MODE_ENABLED : MOCK_MODE_ENABLED_FALLBACK;
export const EXPORTED_SERVER_API_URL = typeof SERVER_API_URL !== 'undefined' ? SERVER_API_URL : SERVER_API_URL_FALLBACK;
export const EXPORTED_KS_DASHBOARD_URL = typeof KS_DASHBOARD_URL !== 'undefined' ? KS_DASHBOARD_URL : KS_DASHBOARD_URL_FALLBACK;
export const EXPORTED_BUILD_TIMESTAMP = typeof BUILD_TIMESTAMP !== 'undefined' ? BUILD_TIMESTAMP : BUILD_TIMESTAMP_FALLBACK;

// Named exports for backward compatibility
export {
  EXPORTED_VERSION as VERSION,
  EXPORTED_DEBUG_INFO_ENABLED as DEBUG_INFO_ENABLED,
  EXPORTED_MOCK_MODE_ENABLED as MOCK_MODE_ENABLED,
  EXPORTED_SERVER_API_URL as SERVER_API_URL,
  EXPORTED_KS_DASHBOARD_URL as KS_DASHBOARD_URL,
  EXPORTED_BUILD_TIMESTAMP as BUILD_TIMESTAMP,
};

export const PROFILE_USER_URL = '/assets/kojo-ampia-addison.jpeg';
export const ADMIN_API = 'https://www.jojoaddison.net';
