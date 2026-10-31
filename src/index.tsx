'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
export interface Tab {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  tabs?: readonly Tab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'automatic' | 'manual';
  lazy?: boolean;
  keepMounted?: boolean;
  loop?: boolean;
  direction?: 'ltr' | 'rtl';
  label?: string;
  className?: string;
}
export function Tabs({
  tabs = [],
  value: controlled,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activation = 'automatic',
  lazy = true,
  keepMounted = false,
  loop = true,
  direction = 'ltr',
  label = 'Tabs',
  className,
}: TabsProps) {
  if (
    tabs.length > 100 ||
    new Set(tabs.map((tab) => tab.id)).size !== tabs.length ||
    tabs.some((tab) => !tab.id || tab.id.length > 128) ||
    !['horizontal', 'vertical'].includes(orientation) ||
    !['automatic', 'manual'].includes(activation)
  )
    throw new TypeError('Invalid tabs or configuration.');
  const [internal, setValue] = useState(defaultValue);
  const requested = controlled ?? internal;
  const current =
    tabs.find((tab) => tab.id === requested && !tab.disabled) ?? tabs.find((tab) => !tab.disabled);
  const [focusId, setFocus] = useState<string | undefined>(current?.id);
  const active = tabs.some((tab) => tab.id === focusId && !tab.disabled) ? focusId : current?.id;
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const visited = useRef(new Set<string>());
  const id = useId();
  useEffect(() => {
    if (current) visited.current.add(current.id);
  }, [current?.id]);
  const choose = (value: string) => {
    if (controlled === undefined) setValue(value);
    onValueChange?.(value);
  };
  return (
    <div className={className} dir={direction}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        style={{
          display: 'flex',
          gap: 4,
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) refs.current.set(tab.id, node);
              else refs.current.delete(tab.id);
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={current?.id === tab.id}
            tabIndex={active === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onFocus={() => setFocus(tab.id)}
            onClick={() => choose(tab.id)}
            onKeyDown={(event) => {
              const enabled = tabs.filter((item) => !item.disabled);
              const position = enabled.findIndex((item) => item.id === tab.id);
              let delta = 0;
              if (orientation === 'horizontal' && event.key === 'ArrowRight')
                delta = direction === 'rtl' ? -1 : 1;
              if (orientation === 'horizontal' && event.key === 'ArrowLeft')
                delta = direction === 'rtl' ? 1 : -1;
              if (orientation === 'vertical' && event.key === 'ArrowDown') delta = 1;
              if (orientation === 'vertical' && event.key === 'ArrowUp') delta = -1;
              if (activation === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                choose(tab.id);
                return;
              }
              if (!delta && !['Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              let next =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? enabled.length - 1
                    : position + delta;
              if (loop) next = (next + enabled.length) % enabled.length;
              const target = enabled[next];
              if (target) {
                setFocus(target.id);
                refs.current.get(target.id)?.focus();
                if (activation === 'automatic') choose(target.id);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => {
        const selected = tab.id === current?.id;
        const mount = !lazy || selected || (keepMounted && visited.current.has(tab.id));
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={!selected}
            tabIndex={selected ? 0 : -1}
          >
            {mount ? tab.content : null}
          </div>
        );
      })}
    </div>
  );
}
export default Tabs;
