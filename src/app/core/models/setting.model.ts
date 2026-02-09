export interface AppSettings {
  id?: string;
  verboseLogging: boolean;
  betaFeatures: boolean;
  theme: 'default' | 'high-contrast' | 'midnight' | 'light';
  language: 'en' | 'de';
}

// Alias for compatibility with components
export type Setting = AppSettings;
