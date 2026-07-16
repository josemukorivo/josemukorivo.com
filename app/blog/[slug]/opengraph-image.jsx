import { ImageResponse } from "next/og";
import {
  SocialCard,
  socialImageContentType,
  socialImageSize
} from "../../_components/social-card";
import { getArticle } from "../../../lib/blog";

export const alt = "An article by Joseph Mukorivo";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default async function OpenGraphImage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return new ImageResponse(
    <SocialCard
      eyebrow="Writing"
      title={article?.title ?? "Joseph Mukorivo — Writing"}
    />,
    size
  );
}
