export function SiteFooter() {
  return (
    <footer
      className="mt-[104px] flex items-baseline justify-between border-t border-rule pt-5 text-[13px] text-muted max-[640px]:mt-20"
      data-reveal
      data-reveal-self
    >
      <span className="font-handwriting text-[20px] font-normal leading-[1.1] text-ink">
        Joseph Mukorivo
      </span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
