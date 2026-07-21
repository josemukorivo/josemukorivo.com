export function RolePhrase({ children }) {
  return (
    <span className="role-phrase">
      <span className="role-phrase-copy">{children}</span>
      <svg
        aria-hidden="true"
        className="role-phrase-mark"
        viewBox="0 0 18 18"
      >
        <circle cx="7" cy="7" r="3.25" />
        <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2M3.1 3.1l1.4 1.4M9.5 9.5l1.4 1.4M10.9 3.1 9.5 4.5M4.5 9.5l-1.4 1.4" />
        <path className="role-phrase-pencil" d="m10.75 13.75 3.9-3.9 1.5 1.5-3.9 3.9-2 .5.5-2Z" />
      </svg>
    </span>
  );
}

