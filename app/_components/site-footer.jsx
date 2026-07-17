export function SiteFooter() {
  return (
    <footer
      className="mt-[104px] flex justify-between border-t border-rule pt-5 text-[13px] text-muted max-[640px]:mt-20"
      data-reveal
      data-reveal-self
    >
      <span className="font-serif text-sm leading-[1.65] italic">
        Joseph Mukorivo
      </span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
