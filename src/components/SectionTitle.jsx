import styles from "./SectionTitle.module.css";

export default function SectionTitle({ children }) {
  return (
    <div className={styles.titleContainer}>
      <h2 className={styles.sectionTitle}>{children}</h2>
    </div>
  );
}
