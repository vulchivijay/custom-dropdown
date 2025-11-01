import React, { useRef, useEffect } from 'react';
import { createDropdown, OptionItem } from '..';

type Props = {
  options: OptionItem[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function Dropdown({ options, placeholder, onChange }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    instanceRef.current = createDropdown(hostRef.current, options, placeholder);
    const el = instanceRef.current;
    const handler = (e: any) => onChange && onChange(e.detail.value);
    el.addEventListener('change', handler as EventListener);
    return () => {
      el.removeEventListener('change', handler as EventListener);
      if (hostRef.current && el && hostRef.current.contains(el)) hostRef.current.removeChild(el);
    };
  }, [options]);

  return <div ref={hostRef} />;
}
