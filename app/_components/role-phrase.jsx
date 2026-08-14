export function RolePhrase({ children }) {
  return (
    <span className="role-phrase">
      <svg
        aria-hidden="true"
        className="role-phrase-sketch"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 180 18"
      >
        <path
          className="role-phrase-sketch-stroke role-phrase-sketch-stroke--warm"
          d="M2 12C17 8 34 15 55 10C68 7 77 9 88 10"
        />
        <path
          className="role-phrase-sketch-stroke role-phrase-sketch-stroke--violet"
          d="M56 11C75 7 94 14 114 9C126 6 137 8 145 10"
        />
        <path
          className="role-phrase-sketch-stroke role-phrase-sketch-stroke--cool"
          d="M115 10C132 7 147 13 178 8"
        />
      </svg>
      <span className="role-phrase-copy">{children}</span>
    </span>
  );
}
