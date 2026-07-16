import Link from "next/link";

export function IndexLink({ href }) {
  return (
    <Link
      className="group inline-flex w-fit items-center gap-2 bg-none font-serif text-lg font-medium italic leading-[1.2] text-ink max-[680px]:text-[17px]"
      href={href}
    >
      <svg
        aria-hidden="true"
        className="size-4 fill-none stroke-current stroke-[1.35] [stroke-linecap:round] [stroke-linejoin:round] transition-transform duration-180 ease-out-expo group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        viewBox="0 0 18 18"
      >
        <path d="M7 4 3.5 7.5 7 11" />
        <path d="M4 7.5h5.25a4.25 4.25 0 0 1 4.25 4.25V13" />
      </svg>
      <span>Index</span>
    </Link>
  );
}
