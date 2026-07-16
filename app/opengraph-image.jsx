import { ImageResponse } from "next/og";
import {
  SocialCard,
  socialImageContentType,
  socialImageSize
} from "./_components/social-card";
import { SITE_TITLE } from "../lib/site";

export const alt = SITE_TITLE;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpenGraphImage() {
  return new ImageResponse(
    <SocialCard eyebrow="Engineering, products, and systems" title={SITE_TITLE} />,
    size
  );
}
