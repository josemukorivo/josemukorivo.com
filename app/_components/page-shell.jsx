const variants = {
  home: [
    "mx-auto w-[calc(100%_-_48px)] max-w-[580px] pb-12 pt-24",
    "max-[640px]:w-[calc(100%_-_36px)] max-[640px]:pt-10"
  ].join(" "),
  writing: [
    "mx-auto w-[calc(100%_-_48px)] max-w-[824px] pb-12 pt-24",
    "max-[680px]:w-[calc(100%_-_36px)] max-[680px]:pt-10"
  ].join(" "),
  article: [
    "mx-auto w-[calc(100%_-_48px)] max-w-[580px] pb-16 pt-14",
    "max-[680px]:w-[calc(100%_-_36px)] max-[680px]:pt-7"
  ].join(" ")
};

export function PageShell({ children, variant = "home" }) {
  return <main className={variants[variant]}>{children}</main>;
}
