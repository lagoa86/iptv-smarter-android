
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee434f45167447b7a5e05b1f71971f22',
  appName: 'iptv-smarter-android',
  webDir: 'dist',
  server: {
    url: 'https://ee434f45-1674-47b7-a5e0-5b1f71971f22.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};

export default config;
