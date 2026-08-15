import { NextResponse } from "next/server";
import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME
} from "../../../lib/i18n-config";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isSupportedLocale(payload?.locale)) {
    return NextResponse.json({ error: "Unsupported locale." }, { status: 400 });
  }

  const response = NextResponse.json({ locale: payload.locale });
  response.cookies.set(LOCALE_COOKIE_NAME, payload.locale, {
    httpOnly: true,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}
