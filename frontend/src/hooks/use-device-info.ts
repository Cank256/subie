
import { useState, useEffect } from 'react';

type DeviceInfo = {
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  location: string;
};

export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceName: 'Unknown Device',
    deviceType: 'Unknown',
    ipAddress: '0.0.0.0',
    location: 'Unknown',
  });

  useEffect(() => {
    const getDeviceInfo = async () => {
      // Get device name and type
      const userAgent = navigator.userAgent;
      let deviceName = 'Unknown Device';
      let deviceType = 'Unknown';

      if (/iPhone/.test(userAgent)) {
        deviceName = 'iPhone';
        deviceType = 'Mobile';
      } else if (/iPad/.test(userAgent)) {
        deviceName = 'iPad';
        deviceType = 'Tablet';
      } else if (/Android/.test(userAgent) && /Mobile/.test(userAgent)) {
        deviceName = 'Android Phone';
        deviceType = 'Mobile';
      } else if (/Android/.test(userAgent)) {
        deviceName = 'Android Tablet';
        deviceType = 'Tablet';
      } else if (/Windows/.test(userAgent)) {
        deviceName = 'Windows Device';
        deviceType = 'Desktop';
      } else if (/Macintosh/.test(userAgent)) {
        deviceName = 'Mac';
        deviceType = 'Desktop';
      } else if (/Linux/.test(userAgent)) {
        deviceName = 'Linux Device';
        deviceType = 'Desktop';
      }

      // Set basic device info first before attempting IP lookup
      setDeviceInfo({
        deviceName,
        deviceType,
        ipAddress: '0.0.0.0',
        location: 'Unknown',
      });

      try {
        // Try a more reliable service with CORS support
        const ipserviceUrls = [
          'https://api.ipify.org?format=json',
          'https://ipinfo.io/json'
        ];
        
        let ipData = null;
        
        // Try each service until one works
        for (const url of ipserviceUrls) {
          try {
            // Try to get IP info using a fetch with timeout to prevent long hangs
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(url, { 
              signal: controller.signal,
              mode: 'cors',
              headers: {
                'Accept': 'application/json'
              }
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            ipData = await response.json();
            
            // If we got data, break the loop
            if (ipData) break;
          } catch (innerError) {
            console.warn(`Error fetching from ${url}:`, innerError);
            // Continue to the next URL
          }
        }
        
        if (ipData) {
          // Different APIs return different structured data
          const ip = ipData.ip || '0.0.0.0';
          const city = ipData.city || 'Unknown';
          const country = ipData.country || ipData.country_name || 'Unknown';
          
          setDeviceInfo({
            deviceName,
            deviceType,
            ipAddress: ip,
            location: `${city}, ${country}`,
          });
        }
      } catch (error) {
        console.error('Error fetching IP info:', error);
        // We already set fallback device info above
      }
    };

    getDeviceInfo();
  }, []);

  return deviceInfo;
};
