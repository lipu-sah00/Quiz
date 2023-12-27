import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.android.codex.app',
  appName: 'Web Developement Quiz',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
