import {useEffect, useState} from "react";

/**
 * Modified from link below
 * @see https://observablehq.com/@werehamster/avoiding-hydration-mismatch-when-using-react-hooks
 * @param mediaQueryString
 * @returns {unknown}
 */
export default function useBetterMediaQuery(mediaQueryString: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQueryList: MediaQueryList = window.matchMedia(mediaQueryString);
    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener("change", listener); // Fix: Pass the event type as the first argument
    return () => mediaQueryList.removeEventListener("change", listener); // Fix: Pass the event type as the first argument
  }, [mediaQueryString])

  return matches;
}