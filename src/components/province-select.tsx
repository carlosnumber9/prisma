'use client';

import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { dictionaries, type Locale } from '../lib/i18n';
import { matchProvince, searchProvinces } from '../lib/provinces';
import { provinceStore, useProvince } from './province-state';
import styles from './province-select.module.css';

export function ProvinceSelect({ locale }: { locale: Locale }) {
  const province = useProvince();
  const m = dictionaries[locale];
  const listId = useId();
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const options = searchProvinces(query ?? '');
  const open = query !== null;
  useEffect(() => {
    if (open && active >= 0)
      document
        .getElementById(`${listId}-${options[active]?.id}`)
        ?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId, options]);
  const close = () => {
    setQuery(null);
    setActive(-1);
  };
  const select = (id: string) => {
    provinceStore.select(id);
    close();
  };
  const keyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      if (!open) setQuery('');
      setActive((previous) =>
        Math.max(
          0,
          Math.min(
            options.length - 1,
            previous + (event.key === 'ArrowDown' ? 1 : -1),
          ),
        ),
      );
    } else if (open && ['Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setActive(event.key === 'Home' ? 0 : options.length - 1);
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      const selected = options[active] ?? matchProvince(query);
      if (selected) select(selected.id);
    }
  };
  return (
    <div className={styles.selector}>
      <input
        role="combobox"
        type="text"
        value={query ?? province.name}
        aria-label={m.province}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && options[active]
            ? `${listId}-${options[active].id}`
            : undefined
        }
        autoComplete="off"
        spellCheck={false}
        onFocus={() => {
          setQuery('');
          setActive(-1);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(-1);
        }}
        onClick={() => {
          if (!open) {
            setQuery('');
            setActive(-1);
          }
        }}
        onKeyDown={keyboard}
        onBlur={() => {
          const exact = query === null ? undefined : matchProvince(query);
          if (exact) provinceStore.select(exact.id);
          close();
        }}
      />
      <span className={styles.chevron} aria-hidden="true">
        ⌄
      </span>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={m.province}
          className={styles.options}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              id={`${listId}-${option.id}`}
              role="option"
              aria-selected={option.id === province.id}
              data-active={index === active}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => select(option.id)}
            >
              {option.name}
            </li>
          ))}
          {!options.length && (
            <li role="presentation">{m.noProvinceMatches}</li>
          )}
        </ul>
      )}
    </div>
  );
}
