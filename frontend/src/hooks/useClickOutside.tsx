import { useEffect, useRef, RefObject } from 'react';

type EventType = 'mousedown' | 'mouseup' | 'click';

const useClickOutside = <T extends HTMLElement>(callback: () => void, eventType: EventType = 'mousedown'): RefObject<T> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener(eventType, handleClickOutside);

    return () => {
      document.removeEventListener(eventType, handleClickOutside);
    };
  }, [callback, eventType]);

  return ref;
};

export default useClickOutside;
