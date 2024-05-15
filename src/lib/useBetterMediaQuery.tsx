import {useEffect, useState} from "react";

export default function useBetterMediaQuery(mediaQueryString = '(min-width: 768px)') {
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