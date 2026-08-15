import "server-only";

import { headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_REQUEST_HEADER,
  isSupportedLocale
} from "./i18n-config";
import { MESSAGES } from "./i18n-messages";

export async function getRequestLocale() {
  const locale = (await headers()).get(LOCALE_REQUEST_HEADER);
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getMessages(locale) {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}
