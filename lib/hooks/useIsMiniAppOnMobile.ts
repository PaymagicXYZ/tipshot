import { useEffect, useState } from 'react';

export function useIsMiniAppOnMobile() {
  const [isMiniAppOnMobile, setIsMiniAppOnMobile] = useState(false);

  useEffect(() => {
    setIsMiniAppOnMobile(
      navigator.userAgent.toLowerCase().includes('farcaster'),
    );
  }, []);

  return isMiniAppOnMobile;
}
