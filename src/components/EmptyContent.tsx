import styles from "../styles/components/EmptyContent.module.css";

export const EmptyContent = () => {
  return (
    <div className={styles.panel}>
      <p className={styles.text}>자료 없음</p>
    </div>
  );
};
