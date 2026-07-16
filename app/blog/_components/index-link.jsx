import Link from "next/link";
import styles from "../blog.module.css";

export function IndexLink({ href }) {
  return (
    <Link className={styles.indexLink} href={href}>
      <svg aria-hidden="true" viewBox="0 0 18 18">
        <path d="M7 4 3.5 7.5 7 11" />
        <path d="M4 7.5h5.25a4.25 4.25 0 0 1 4.25 4.25V13" />
      </svg>
      <span>Index</span>
    </Link>
  );
}
