"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent
} from "../../lib/analytics";
import {
  DEFAULT_LOCALE,
  LOCALE_DETAILS,
  LOCALES,
  localizePath,
  stripLocaleFromPathname
} from "../../lib/i18n-config";

const SHONA_PROMPT_STORAGE_KEY = "joseph-site-locale:shona-prompt:v1";

function browserSuggestsZimbabwe() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === "Africa/Harare";
  } catch {
    return false;
  }
}

function shonaPromptWasHandled() {
  try {
    return window.localStorage.getItem(SHONA_PROMPT_STORAGE_KEY) === "handled";
  } catch {
    return false;
  }
}

function rememberShonaPromptWasHandled() {
  try {
    window.localStorage.setItem(SHONA_PROMPT_STORAGE_KEY, "handled");
  } catch {
    // Locale switching remains available when storage is unavailable.
  }
}

export function LanguageSwitcher({ locale, messages }) {
  const menuId = useId();
  const pathname = usePathname() ?? "/";
  const containerRef = useRef(null);
  const suggestionCapturedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [suggestShona, setSuggestShona] = useState(false);
  const showsShonaPrompt = locale === DEFAULT_LOCALE && suggestShona;

  useEffect(() => {
    if (locale !== DEFAULT_LOCALE || shonaPromptWasHandled()) {
      return undefined;
    }

    const controller = new AbortController();

    async function resolveSuggestion() {
      let shouldSuggestShona = browserSuggestsZimbabwe();

      try {
        const response = await fetch("/api/locale-suggestion", {
          cache: "no-store",
          signal: controller.signal
        });

        if (response.ok) {
          const result = await response.json();
          shouldSuggestShona ||= result.suggestShona === true;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }

      setSuggestShona(shouldSuggestShona);
    }

    resolveSuggestion();
    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    if (!showsShonaPrompt || suggestionCapturedRef.current) {
      return;
    }

    suggestionCapturedRef.current = true;
    captureAnalyticsEvent(ANALYTICS_EVENTS.languageSuggestionShown, {
      current_locale: locale,
      suggested_locale: "sn"
    });
  }, [locale, showsShonaPrompt]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function selectLocale(nextLocale) {
    setOpen(false);
    rememberShonaPromptWasHandled();
    setSuggestShona(false);

    if (nextLocale === locale) {
      return;
    }

    await fetch("/api/locale", {
      body: JSON.stringify({ locale: nextLocale }),
      headers: { "content-type": "application/json" },
      method: "POST"
    });

    const basePathname = stripLocaleFromPathname(pathname);
    const query = window.location.search.slice(1);
    const localizedHref = localizePath(
      `${basePathname}${query ? `?${query}` : ""}`,
      nextLocale
    );

    captureAnalyticsEvent(ANALYTICS_EVENTS.languageChanged, {
      current_path: pathname,
      from_locale: locale,
      prompted_for_shona: showsShonaPrompt,
      to_locale: nextLocale
    });
    window.location.assign(localizedHref);
  }

  const triggerLabel = showsShonaPrompt
    ? messages.viewInShona
    : LOCALE_DETAILS[locale].label;
  const triggerFlag = showsShonaPrompt
    ? LOCALE_DETAILS.sn.flag
    : LOCALE_DETAILS[locale].flag;

  return (
    <div className="language-switcher" ref={containerRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="language-switcher-trigger"
        data-suggests-shona={showsShonaPrompt ? "true" : undefined}
        onClick={() => {
          setOpen((currentOpen) => {
            const nextOpen = !currentOpen;

            if (nextOpen) {
              captureAnalyticsEvent(ANALYTICS_EVENTS.languageMenuOpened, {
                current_locale: locale,
                current_path: pathname,
                prompted_for_shona: showsShonaPrompt
              });
            }

            return nextOpen;
          });
        }}
        type="button"
      >
        <span>
          <span aria-hidden="true">{triggerFlag}</span> {triggerLabel}
        </span>
        <svg aria-hidden="true" viewBox="0 0 12 12">
          <path d="m2.5 4.5 3.5 3 3.5-3" />
        </svg>
      </button>

      {open ? (
        <div
          aria-label={messages.switchLanguage}
          className="language-switcher-menu"
          id={menuId}
          role="listbox"
        >
          {showsShonaPrompt ? (
            <span className="language-switcher-note">
              {messages.shonaSuggestion}
            </span>
          ) : null}
          {LOCALES.map((optionLocale) => (
            <button
              aria-selected={optionLocale === locale}
              className="language-switcher-option"
              data-active={optionLocale === locale ? "true" : undefined}
              key={optionLocale}
              lang={LOCALE_DETAILS[optionLocale].htmlLang}
              onClick={() => selectLocale(optionLocale)}
              role="option"
              type="button"
            >
              <span>
                <span aria-hidden="true">
                  {LOCALE_DETAILS[optionLocale].flag}
                </span>{" "}
                {LOCALE_DETAILS[optionLocale].label}
              </span>
              {optionLocale === locale ? (
                <svg aria-hidden="true" viewBox="0 0 16 16">
                  <path d="m3.5 8.3 2.7 2.6 6.3-6" />
                </svg>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
