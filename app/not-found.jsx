import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <article>
        <div className="intro">
          <h1>Page not found</h1>
          <p>
            The page you’re looking for does not exist or may have moved.{" "}
            <Link href="/">Return home</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}
