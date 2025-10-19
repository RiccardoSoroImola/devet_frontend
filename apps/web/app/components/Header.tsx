"use client";

import styles from "./Header.module.css";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
};

export default function Header({
  title = "Menù",
  onBack,
  showBackButton = false,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {showBackButton ? (
          <button
            onClick={onBack}
            className={styles.backButton}
            aria-label="Indietro"
          >
            <svg
              className={styles.backIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.placeholder} />
      </div>
    </header>
  );
}
