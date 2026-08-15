export function SiteFooter() {
  return (
    <footer
      className="hand-drawn-footer-rule mt-[104px] flex items-baseline justify-between pt-5 text-[13px] text-muted max-[640px]:mt-20"
      data-reveal
      data-reveal-self
    >
      <span className="name-signature relative font-body text-[20px] font-normal leading-[1.1] text-ink">
        Joseph Mukorivo
      </span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
