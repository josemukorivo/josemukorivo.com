import { InlineLink } from "./_components/inline-link";
import { PageShell } from "./_components/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <article className="mt-[88px] max-[640px]:mt-16">
        <div className="max-w-[600px]">
          <h1 className="mb-6 text-[26px] font-medium leading-tight">
            Page not found
          </h1>
          <p>
            The page you’re looking for does not exist or may have moved.{" "}
            <InlineLink href="/">Return home</InlineLink>.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
