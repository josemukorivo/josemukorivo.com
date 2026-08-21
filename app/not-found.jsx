import { InlineLink } from "./_components/inline-link";
import { PageShell } from "./_components/page-shell";
import { localizePath } from "../lib/i18n-config";
import { getMessages, getRequestLocale } from "../lib/i18n-server";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageShell>
      <article className="mt-[88px] max-[640px]:mt-16">
        <div className="max-w-[600px]">
          <h1 className="mb-6 text-[26px] font-medium leading-tight">
            Page not found
          </h1>
          <p>
            The page you’re looking for does not exist or may have moved.{" "}
            <InlineLink href={localizePath("/", locale)}>
              {messages.navigation.home}
            </InlineLink>
            .
          </p>
          <p className="mt-6 text-subtle">
            Browse the{" "}
            <InlineLink href={localizePath("/blog", locale)}>
              writing index
            </InlineLink>
            , review the <InlineLink href="/sitemap.xml">sitemap</InlineLink>,
            or read <InlineLink href="/llms.txt">llms.txt</InlineLink> for an
            agent-friendly guide to the site.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
